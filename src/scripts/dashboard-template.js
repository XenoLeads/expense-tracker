import Card from "./card.js";
import Utils from "./utils.js";
import Transaction from "./transaction.js";
import Tracker from "./tracker.js";
import Chart from "./chart.js";

const desktop_quick_view_actions_sidebar = document.getElementsByClassName("desktop-quick-view-actions-sidebar")[0];
let pie_chart = {
  chart: null,
};

function get_dashboard_template() {
  Tracker.recalculate();
  return `
        <div class="balance-income-expense-expense-overview-top-icomes-top-expenses">
            <div class="balance-income-expense-expense-overview">
              <div class="card balance-income-expense">
                <div class="wrapper total-balance-wrapper">
                  <p>Balance:</p>
                  <p class="total-balance">-</p>
                </div>
                <div class="income-expense">
                  <div class="wrapper total-income-wrapper">
                    <p>Income:</p>
                    <p class="total-income">-</p>
                  </div>
                  <div class="wrapper total-expense-wrapper">
                    <p>Expense:</p>
                    <p class="total-expense">-</p>
                  </div>
                </div>
              </div>
              <div class="card expense-overview-container">
                <div class="expense-overview-wrapper">
                <h2 class="heading expense-overview-heading">Top Expenses</h2>
                  <div class="separator"></div>
                  <div class="expense-overviews">
                    <p class="expense-overview">Food: $123</p>
                    <p class="expense-overview">Travel: $123</p>
                    <p class="expense-overview">Grocery: $123</p>
                  </div>
                </div>
                <div class="expense-pie-chart-container">
                  <canvas class="expense-pie-chart"></canvas>
                </div>
              </div>
              <div class="card budget-overview">
                <h2 class="heading budget-overview-heading">Budget Overview</h2>
                <div class="separator"></div>
                <div class="budget-overviews-container">
                  <p class="budget-overview">Food: $123</p>
                  <p class="budget-overview">Travel: $123</p>
                  <p class="budget-overview">Grocery: $123</p>
                </div>
              </div>
            </div>
            <div class="card top-incomes-top-expenses">
              <div class="top-incomes-container">
                <h2 class="top-incomes-heading">Top Incomes</h2>
                <div class="separator"></div>
                <div class="top-incomes">
                  <p class="top-income">Freelance: $123</p>
                  <p class="top-income">Salary: $123</p>
                  <p class="top-income">Commission: $123</p>
                </div>
              </div>
              <div class="top-expenses-container">
                <h2 class="top-expenses-heading">Top Expenses</h2>
                <div class="separator"></div>
                <div class="top-expenses">
                  <p class="top-income">Rent: $123</p>
                  <p class="top-income">Grocery: $123</p>
                  <p class="top-income">Transportation: $123</p>
                </div>
              </div>
            </div>
          </div>
          <div class="card balance-line-chart-container">
            <div class="balance-line-chart"></div>
          </div>
          <div class="card recent-transactions-container">
            <div class="recent-transactions-heading">
              <h2 class="recent-transactions-heading-text">Recent Transactions</h2>
              <button class="button recent-transactions-heading-see-all-button">See All</button>
            </div>
            <div class="separator"></div>
            <div class="recent-transactions"></div>
          </div>
  `;
}

function init_dashboard_template(callback) {
  desktop_quick_view_actions_sidebar.innerHTML = `
  <div class="card top-incomes-top-expenses">
            <div class="top-incomes-container">
              <h2 class="top-incomes-heading">Top Incomes</h2>
              <div class="separator"></div>
              <div class="top-incomes">
                <p class="top-income">Freelance: $123</p>
                <p class="top-income">Salary: $123</p>
                <p class="top-income">Commission: $123</p>
              </div>
            </div>
            <div class="top-expenses-container">
              <h2 class="top-expenses-heading">Top Expenses</h2>
              <div class="separator"></div>
              <div class="top-expenses">
                <p class="top-income">Rent: $123</p>
                <p class="top-income">Groceries: $123</p>
                <p class="top-income">Transportation: $123</p>
              </div>
            </div>
          </div>
`;

  const see_all_transactions_button = document.getElementsByClassName("recent-transactions-heading-see-all-button")[0];
  if (see_all_transactions_button && callback) see_all_transactions_button.addEventListener("click", callback);

  display_chart(Transaction.get());
  display_chart(Transaction.get());
}

async function display_transactions(transactions) {
  const recent_transactions = document.getElementsByClassName("recent-transactions")[0];
  recent_transactions.innerHTML = "";
  const sorted_transactions = Utils.sort_transactions(transactions);
  const recent_10_transactions = sorted_transactions.slice(0, 10);

  for (const transaction of recent_10_transactions) {
    const card = await Card.transaction(transaction);
    recent_transactions.appendChild(card);
  }
}

function display_transactions_overview_amounts(tracker) {
  const total_balance = document.getElementsByClassName("total-balance")[0];
  const total_income = document.getElementsByClassName("total-income")[0];
  const total_expense = document.getElementsByClassName("total-expense")[0];
  total_balance.textContent = `${`${tracker.balance < 0 ? "-" : ""}$${Math.abs(parseFloat(tracker.balance.toFixed(2)))}`}`;
  total_income.textContent = `$${parseFloat(tracker.income.toFixed(2))}`;
  total_expense.textContent = `$${parseFloat(tracker.expense.toFixed(2))}`;
}

function display_expense_overview(transactions) {
  const expense_overviews = document.getElementsByClassName("expense-overviews")[0];
  expense_overviews.innerHTML = "";
  const filter = Utils.filter_transactions;
  const sort = Utils.sort_transactions;
  const capitalize = Utils.capitalize;
  const create_expense_element = expense => {
    const container = document.createElement("p");
    container.className = "expense-overview";
    container.textContent = `${capitalize(expense.category, " & ")}: ${Utils.get_currency_symbol(expense.currency)}${expense.amount}`;
    return container;
  };
  const expenses = filter(transactions, { type: "expense" });
  const sorted_expenses = sort(expenses, "amount");
  const top_3_expenses = sorted_expenses.slice(0, 3);
  for (const expense of top_3_expenses) expense_overviews.appendChild(create_expense_element(expense));
}

function refresh() {
  const transactions = Transaction.get();
  display_transactions(transactions);
  display_transactions_overview_amounts(Tracker.recalculate());
  display_expense_overview(transactions);
  update_chart(transactions);
}

function display_chart(transactions) {
  const expense_pie_chart = document.getElementsByClassName("expense-pie-chart")[0];
  const ctx = expense_pie_chart.getContext("2d");
  const formatted_transactions = format_transaction_for_charts(transactions);
  const expense = formatted_transactions.expense;
  const income = formatted_transactions.income;

  Chart.create(
    ctx,
    "pie",
    pie_chart,
    // Datasets
    [
      {
        label: "Expense",
        data: expense.values,
        categoryList: expense.labels,
        backgroundColor: expense.colors,
        borderWidth: 2,
        hoverOffset: 10,
      },
      {
        label: "Income",
        data: income.values,
        categoryList: income.labels,
        backgroundColor: income.colors,
        borderWidth: 2,
      },
    ],
    // Tooltip Callbacks
    {
      title: function (tooltipItems) {
        const item = tooltipItems[0];
        const dataset = item.dataset;
        const index = item.dataIndex;

        return dataset.categoryList[index];
      },
      label: function (context) {
        const type = context.dataset.label;
        const value = context.raw;

        // Format as currency
        const formattedValue = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);

        return ` ${type}: ${formattedValue}`;
      },
    }
  );
}

function update_chart(transactions) {
  const formatted_transactions = format_transaction_for_charts(transactions);
  const expense = formatted_transactions.expense;
  const income = formatted_transactions.income;

  Chart.update({ chart: pie_chart.chart }, [format_transaction_for_chart_datasets(expense), format_transaction_for_chart_datasets(income)]);

  function format_transaction_for_chart_datasets(transactions) {
    return {
      data: transactions.values,
      categoryList: transactions.labels,
      backgroundColor: transactions.colors,
    };
  }
}

function format_transaction_for_charts(transactions) {
  const COLOR_PALETTE = {
    income: {
      default: "#E2E8F0", // Slate 200 (Neutral Grey)
      salary: "#FACC15", // Yellow Gold (High contrast "Money" color)
      freelance: "#4ADE80", // Bright Green (Fresh income)
      investments: "#2DD4BF", // Teal (Growth, sits well next to blue)
      other: "#94A3B8", // Slate 400 (Darker Grey)
    },
    expense: {
      "default": "#E2E8F0", // Slate 200
      "food-dining": "#FF6B6B", // Soft Red (Common expense color)
      "transportation": "#FFA502", // Bright Orange (Active)
      "shopping": "#FF9FF3", // Lavender/Pink (Leisure)
      "bills-utilities": "#FF4757", // Saturated Red (Urgent/Fixed)
      "entertainment": "#A29BFE", // Soft Purple
      "healthcare": "#2ED573", // Medical Green (Distinct from other expenses)
      "travel": "#70A1FF", // Sky Blue (Lighter than background to stand out)
      "other": "#CED6E0", // Light Grey
    },
  };

  const summarised_transactions = Utils.summarise_transactions(transactions);
  let expense_values = [];
  let expense_labels = [];
  let expense_colors = [];

  let income_values = [];
  let income_labels = [];
  let income_colors = [];

  for (const type in summarised_transactions) {
    const values = [];
    const labels = [];
    const colors = [];
    for (const key in summarised_transactions[type]) {
      const transaction = summarised_transactions[type][key];
      values.push(transaction.amount);
      labels.push(Utils.capitalize(transaction.category, " & "));
      colors.push(COLOR_PALETTE[transaction.type][transaction.category]);
    }
    if (type === "expense") {
      expense_values = values;
      expense_labels = labels;
      expense_colors = colors;
    } else if (type === "income") {
      income_values = values;
      income_labels = labels;
      income_colors = colors;
    }
  }

  return {
    expense: {
      labels: expense_labels,
      values: expense_values,
      colors: expense_colors,
    },
    income: {
      labels: income_labels,
      values: income_values,
      colors: income_colors,
    },
  };
}

export default {
  name: "dashboard",
  get: get_dashboard_template,
  init: init_dashboard_template,
  refresh,
};
