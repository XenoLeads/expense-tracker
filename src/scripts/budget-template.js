import Card from "./card.js";
import Budget from "./budget.js";
import expense_icon from "../assets/icons/transaction-category/expense/expense.svg";
import Transaction from "./transaction.js";
import Utils from "./utils.js";
import Main from "./main.js";

const desktop_quick_view_actions_sidebar = document.getElementsByClassName("desktop-quick-view-actions-sidebar")[0];

const Filters = {
  sort: "most-used",
  time: "all",
};

function get_budget_template() {
  return `
  <button class="button add-new-budget-button">Add New Budget</button>
        <div class="card remaining-budget-overview-pie-chart">
          <div class="remaining-budget-overview">
            <div class="remaining-budget-overview-heading-separator">
              <h2 class="remaining-budget-overview-heading">Most Used</h2>
              <div class="separator"></div>
            </div>
            <div class="most-used-budgets"></div>
          </div>
          <div class="budget-pie-chart"></div>
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
  const add_new_budget_button = document.getElementsByClassName("add-new-budget-button")[0];
  add_new_budget_button.addEventListener("click", show_add_budget_panel);

  desktop_quick_view_actions_sidebar.innerHTML = `
  <div class="desktop-budget-quick-view-actions">
            <button class="button desktop-add-budget-button">Add New Budget</button>
            <div class="desktop-most-used-budget-overview-container">
              <div class="card desktop-most-used-budget-overview-chart">
                <div class="desktop-most-used-budget-overview">
                  <h2 class="desktop-most-used-budget-overview-heading">Most Used</h2>
                  <div class="separator"></div>
                  <div class="remaining-budget">
                    <img src="${"#"}" alt="" class="icon remaining-budget-icon" />
                    <div class="remaining-budget-type-amount-progress-bar">
                      <div class="remaining-budget-type-amount">
                        <p class="remaining-budget-type">Grocery</p>
                        <p class="remaining-budget-amount">$123</p>
                      </div>
                      <progress value="30" max="100" style="accent-color: greenyellow" class="remaining-budget-progress-bar">30%</progress>
                    </div>
                  </div>
                  <div class="remaining-budget">
                    <img src="${"#"}" alt="" class="icon remaining-budget-icon" />
                    <div class="remaining-budget-type-amount-progress-bar">
                      <div class="remaining-budget-type-amount">
                        <p class="remaining-budget-type">Grocery</p>
                        <p class="remaining-budget-amount">$123</p>
                      </div>
                      <progress value="30" max="100" style="accent-color: greenyellow" class="remaining-budget-progress-bar">30%</progress>
                    </div>
                  </div>
                  <div class="remaining-budget">
                    <img src="${"#"}" alt="" class="icon remaining-budget-icon" />
                    <div class="remaining-budget-type-amount-progress-bar">
                      <div class="remaining-budget-type-amount">
                        <p class="remaining-budget-type">Grocery</p>
                        <p class="remaining-budget-amount">$123</p>
                      </div>
                      <progress value="30" max="100" style="accent-color: greenyellow" class="remaining-budget-progress-bar">30%</progress>
                    </div>
                  </div>
                </div>
                <div class="desktop-most-used-budget-chart budget-pie-chart"></div>
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
}

function show_add_budget_panel() {
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
  const most_used_budgets = document.getElementsByClassName("most-used-budgets")[0];
  all_budgets_container.innerHTML = "";
  most_used_budgets.innerHTML = "";
  const budgets = Budget.get();
  if (budgets.length < 1) return;
  const transactions = Transaction.get();
  const filtered_budgets = Utils.filter_budgets(budgets, Filters);
  const formatted_budget = Utils.set_used_budget(filtered_budgets, transactions);

  const sorted_budgets = Utils.sort_budgets(formatted_budget, Filters);
  for (const budget of sorted_budgets) all_budgets_container.appendChild(await Card.budget(budget));
  for (const budget of sorted_budgets.slice(0, 3)) most_used_budgets.appendChild(await Card.remaining_budget(budget));
}

export default {
  name: "budget",
  get: get_budget_template,
  init: init_budget_template,
  refresh,
};
