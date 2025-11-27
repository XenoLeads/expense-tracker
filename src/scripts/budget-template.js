import Chart from "./chart.js";
import Card from "./card.js";
import Budget from "./budget.js";
import expense_icon from "../assets/icons/transaction-category/expense/expense.svg";
import Transaction from "./transaction.js";
import Utils from "./utils.js";

const desktop_quick_view_actions_sidebar = document.getElementsByClassName("desktop-quick-view-actions-sidebar")[0];

const doughnut_charts = [];

const Filters = {
  sort: "most-used",
  time: "all",
};

let budget_amounts = null;
let budget_recurrences = null;

function get_budget_template() {
  return `
  <button class="button opnen-budget-panel-button">Add New Budget</button>
        <div class="card remaining-budget-overview-pie-chart">
          <div class="remaining-budget-overview">
            <div class="remaining-budget-overview-heading-separator">
              <h2 class="remaining-budget-overview-heading">Most Used</h2>
              <div class="separator"></div>
            </div>
            <div class="most-used-budgets"></div>
          </div>
          <div class="budget-pie-chart-container">
            <canvas class="budget-pie-chart"></canvas>
          </div>
        </div>
        <div class="card all-budgets-container">
          <div class="all-budgets-heading-separator">
            <h2 class="all-budgets-heading">All Budgets</h2>
            <div class="separator"></div>
          </div>
          <div class="all-budgets-filters-container">
              <div class="all-budgets-filters all-budgets-sort-filters">
              <button class="button budget-filter all-budget-filter-button-most-used selected" data-type="sort" data-value="most-used">Most Used</button>
              <button class="button budget-filter all-budget-filter-button-least-used" data-type="sort" data-value="least-used">Least Used</button>
              </div>
            <div class="vertical-separator"></div>
              <div class="all-budgets-filters all-budgets-time-filters">
                <button class="button budget-filter all-budget-filter-button-weekly selected" data-type="time" data-value="all">All Time</button>
                <button class="button budget-filter all-budget-filter-button-weekly" data-type="time" data-value="this-week">Weekly</button>
                <button class="button budget-filter all-budget-filter-button-monthly" data-type="time" data-value="this-month">Monthly</button>
                <button class="button budget-filter all-budget-filter-button-yearly" data-type="time" data-value="this-year">Yearly</button>
              </div>
          </div>
          <div class="all-budgets"></div>
        </div>
  `;
}

function init_budget_template() {
  const open_budget_panel_button = document.getElementsByClassName("opnen-budget-panel-button")[0];
  open_budget_panel_button.addEventListener("click", show_budget_panel);

  desktop_quick_view_actions_sidebar.innerHTML = `
  <div class="desktop-budget-quick-view-actions">
            <button class="button desktop-add-budget-button">Add New Budget</button>
            <div class="desktop-most-used-budget-overview-container">
              <div class="card desktop-most-used-budget-overview-chart">
                <div class="desktop-most-used-budget-overview">
                  <h2 class="desktop-most-used-budget-overview-heading">Most Used</h2>
                  <div class="separator"></div>
                  <div class="most-used-budgets"></div>
                </div>
                <div class="budget-pie-chart-container">
                  <canvas class="desktop-most-used-budget-chart budget-pie-chart"></canvas>
                </div>
              </div>
            </div>
          </div>
  `;

  const budget_filters = [...document.getElementsByClassName("budget-filter")];
  budget_filters.forEach(budget_filter => {
    budget_filter.addEventListener("click", () => {
      if (budget_filter.classList.contains("selected")) return;
      highlight_selected_filter(budget_filter);
      const budget_type = budget_filter.dataset.type;
      const budget_value = budget_filter.dataset.value;
      if (budget_type in Filters && Filters[budget_type] !== budget_value) Filters[budget_type] = budget_value;
      if (budget_type === "sort")
        document.getElementsByClassName("remaining-budget-overview-heading")[0].textContent = Utils.capitalize(budget_value, " ");
      refresh();
    });
  });

  display_doughnut_chart(Utils.set_used_budget(Budget.get(), Transaction.get()));
}

function show_budget_panel() {
  reset_budget_inputs();
  const budget_input_panel_container = document.getElementsByClassName("budget-input-panel-container")[0];
  const budget_panel_heading = document.getElementsByClassName("heading budget-input-panel-heading")[0];
  const budget_input_confirm_button = document.getElementsByClassName("budget-input-confirm-button")[0];
  budget_panel_heading.textContent = "Add New Budget";
  budget_input_confirm_button.textContent = "Add";
  budget_input_panel_container.classList.add("visible");
  budget_input_panel_container.dataset.actionMode = "add";

  function reset_budget_inputs() {
    const budget_time_inputs = [...document.getElementsByClassName("budget-input-time")];
    budget_time_inputs.map(budget_time_input =>
      budget_time_input.dataset.value === "this-month" ? budget_time_input.classList.add("selected") : budget_time_input.classList.remove("selected")
    );

    const budget_inputs = [...document.getElementsByClassName("budget-input")];
    for (const budget_input of budget_inputs) {
      const type = budget_input.dataset.type;
      switch (type) {
        case "amount":
          budget_input.value = "";
          break;
        case "currency":
          budget_input.value = "usd";
          break;
        case "category":
          budget_input.value = "default";
          break;
      }
    }

    const budget_preview_inputs = [...document.getElementsByClassName("budget-preview-input")];
    for (const budget_preview_input of budget_preview_inputs) {
      const type = budget_preview_input.dataset.type;
      switch (type) {
        case "icon":
          budget_preview_input.src = expense_icon;
          break;
        case "category":
          budget_preview_input.textContent = "Default";
          break;
        case "currency":
          budget_preview_input.textContent = "$";
          break;
        case "amount":
          budget_preview_input.textContent = 0;
          break;
        case "time":
          budget_preview_input.textContent = "- Monthly";
          break;
      }
    }
  }
}

function highlight_selected_filter(filter) {
  const parent = filter.parentElement;
  const siblings = [...parent.children];
  siblings.map(sibling => sibling.classList.remove("selected"));
  filter.classList.add("selected");
}
async function refresh() {
  const all_budgets_container = document.getElementsByClassName("all-budgets")[0];
  const most_used_budgets = [...document.getElementsByClassName("most-used-budgets")];
  all_budgets_container.innerHTML = "";
  most_used_budgets.map(budget => (budget.innerHTML = ""));
  const budgets = Budget.get();
  if (budgets.length < 1) return;
  const transactions = Transaction.get();
  const filtered_budgets = Utils.filter_budgets(budgets, Filters);
  const formatted_budget = Utils.set_used_budget(filtered_budgets, transactions);

  const sorted_budgets = Utils.sort_budgets(formatted_budget, Filters);
  for (const budget of sorted_budgets) all_budgets_container.appendChild(await Card.budget(budget));
  for (const budget of sorted_budgets.slice(0, 3))
    most_used_budgets.map(most_used_budget => Card.remaining_budget(budget).then(card => most_used_budget.appendChild(card)));

  update_charts(Utils.set_used_budget(Budget.get(), Transaction.get()));
}

function display_doughnut_chart(budgets) {
  const chart_border_color = getComputedStyle(document.getElementById("container")).getPropertyValue("--chart-border-color");
  const budget_doughnut_chart = [...document.getElementsByClassName("budget-pie-chart")];
  const contexts = budget_doughnut_chart.map(chart => chart.getContext("2d"));
  const filtered_budgets = Utils.filter_budgets(budgets, Filters);
  const formatted_budgets = format_budgets_for_charts(filtered_budgets);
  const sorted_budgets = formatted_budgets.sort((a, b) => b.used - a.used);
  budget_amounts = sorted_budgets.map(budget => budget.amount);
  budget_recurrences = sorted_budgets.map(budget => budget.recurrence);

  contexts.forEach((context, index) => {
    if (doughnut_charts[index] === undefined) doughnut_charts[index] = { chart: null };

    Chart.create(
      context,
      "doughnut",
      doughnut_charts[index],
      // Datasets
      [
        {
          data: sorted_budgets.map(budget => budget.used),
          categoryList: sorted_budgets.map(budget => Utils.capitalize(budget.category, " & ")),
          backgroundColor: sorted_budgets.map(budget => budget.color),
          borderColor: chart_border_color,
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
      // Tooltip Callbacks
      {
        options_config: {
          maintainAspectRatio: false,
          scales: {
            x: { display: false },
            y: { display: false },
          },
        },
        tooltip_callbacks: {
          title(tooltip_items) {
            const item = tooltip_items[0];
            const dataset = item.dataset;
            const index = item.dataIndex;

            return dataset.categoryList[index];
          },
          label(context) {
            const value = context.raw;
            const formatted_value = Utils.format_currency(value);
            const budget_amount = Utils.format_currency(budget_amounts[context.dataIndex]);
            const budget_recurrence = Utils.capitalize(budget_recurrences[context.dataIndex].slice(5)) + "ly";
            return [` ${budget_recurrence}`, `${formatted_value} / ${budget_amount}`];
          },
        },
      }
    );
  });
}

function update_charts(budgets) {
  const chart_border_color = getComputedStyle(document.getElementById("container")).getPropertyValue("--chart-border-color");
  const filtered_budgets = Utils.filter_budgets(budgets, Filters);
  const formatted_budgets = format_budgets_for_charts(filtered_budgets);
  const sorted_budgets = formatted_budgets.sort((a, b) => b.used - a.used);
  budget_amounts = sorted_budgets.map(budget => budget.amount);
  budget_recurrences = sorted_budgets.map(budget => budget.recurrence);

  doughnut_charts.forEach(doughnut_chart_obj =>
    Chart.update(doughnut_chart_obj, [
      {
        data: sorted_budgets.map(budget => budget.used),
        categoryList: sorted_budgets.map(budget => Utils.capitalize(budget.category, " & ")),
        backgroundColor: sorted_budgets.map(budget => budget.color),
        borderColor: chart_border_color,
      },
    ])
  );
}

function format_budgets_for_charts(budgets) {
  const COLORS = {
    "default": "#E2E8F0",
    "food-dining": "#FF6B6B",
    "transportation": "#FFA502",
    "shopping": "#FF9FF3",
    "bills-utilities": "#FF4757",
    "entertainment": "#A29BFE",
    "healthcare": "#2ED573",
    "travel": "#70A1FF",
    "other": "#CED6E0",
  };
  const formatted_budgets = [];
  for (const budget of budgets) {
    let { category, amount, used, currency, recurrence } = budget;
    if (currency !== "usd") {
      amount = Utils.convert_currency(amount, currency, "usd");
      used = Utils.convert_currency(used, currency, "usd");
    }
    amount = Math.round(amount);
    used = Math.round(used);
    formatted_budgets.push({ category, amount, used, recurrence, color: COLORS[category] });
  }
  return formatted_budgets;
}

export default {
  name: "budget",
  get: get_budget_template,
  init: init_budget_template,
  refresh,
};
