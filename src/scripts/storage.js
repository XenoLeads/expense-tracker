import Transaction from "./transaction.js";
import Transactions_Template from "./transactions-template.js";
import Budget from "./budget.js";
import Budgets_Template from "./budget-template.js";
import Statistics_Template from "./statistics-template.js";

const main = document.getElementsByClassName("main")[0];

function save() {
  localStorage.setItem(
    "data",
    JSON.stringify({
      transactions: Transaction.get(),
      budgets: Budget.get(),
    })
  );
}
function set() {
  const DATA_KEYMAP = {
    transactions: Transaction,
    budgets: Budget,
  };
  const stored_data = JSON.parse(localStorage.getItem("data"));
  for (const data in stored_data) if (data in DATA_KEYMAP) DATA_KEYMAP[data].set(stored_data[data]);
}

function save_state() {
  localStorage.setItem(
    "state",
    JSON.stringify({
      current_tab: main.dataset.tab,
      transaction_filters: Transactions_Template.filters,
      budget_filters: Budgets_Template.filters,
      statistics_time_filter: Statistics_Template.time_filter,
    })
  );
  set_state();
}
function set_state() {
  const stored_state = JSON.parse(localStorage.getItem("state"));
  if (!stored_state) return null;
  const { current_tab, transaction_filters, budget_filters, statistics_time_filter } = stored_state;
  main.dataset.tab = current_tab;
  Transactions_Template.filters = transaction_filters;
  Budgets_Template.filters = budget_filters;
  Statistics_Template.time_filter = statistics_time_filter;
}

export default {
  save,
  set,
  save_state,
  set_state,
};
