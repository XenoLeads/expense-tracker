import "../styles/style.css";

import Icon from "./icon.js";
import Utils from "./utils.js";
import Dashboard from "./dashboard-template.js";
import Transactions from "./transactions-template.js";
import Transaction from "./transaction.js";
import Budget from "./budget-template.js";
import Statistics from "./statistics-template.js";

const main = document.getElementsByClassName("main")[0];
const main_content = document.getElementsByClassName("main-content")[0];
const current_tab_name = document.getElementsByClassName("current-tab-name")[0];
const dashboard_button = [...document.getElementsByClassName("navigation-button-dashboard")];
const transactions_button = [...document.getElementsByClassName("navigation-button-transactions")];
const budget_button = [...document.getElementsByClassName("navigation-button-budget")];
const statistics_button = [...document.getElementsByClassName("navigation-button-statistics")];
const navigation_buttons = [...dashboard_button, ...transactions_button, ...budget_button, ...statistics_button];
const toggle_sidebar_button = document.getElementsByClassName("toggle-sidebar-button")[0];
const navigation_sidebar = [...document.getElementsByClassName("navigation-sidebar")];
const add_transaction_panel = document.getElementsByClassName("add-transaction-panel")[0];
const mobile_add_transaction_navigation_button = document.getElementsByClassName("navigation-button-add mobile")[0];
const mobile_add_transaction_button = document.getElementsByClassName("add-transaction-button")[0];
const mobile_discard_transaction_button = document.getElementsByClassName("discard-transaction-button")[0];
const income_option = document.getElementById("transaction-input-type-income");
const expense_option = document.getElementById("transaction-input-type-expense");
const amount = document.getElementById("add-transaction-input-amount");
const currency = document.getElementById("add-transaction-input-currency");
const description = document.getElementById("add-transaction-input-description");
const method = document.getElementById("add-transaction-input-method");
const category = document.getElementById("add-transaction-input-category");
const time = document.getElementById("add-transaction-input-time");
const transaction_inputs = [amount, currency, description, method, category, time];
const transaction_preview = [...document.getElementsByClassName("transaction-preview")];
const transaction_preview_container = document.querySelector(".add-transaction-input-preview > .transaction-card");
const transaction_icon_preview = document.getElementsByClassName("transaction-icon-preview")[0];
const add_transaction_input_category = document.getElementById("add-transaction-input-category");

const NAVIGATION_KEYMAP = {
  dashboard: Dashboard,
  transactions: Transactions,
  budget: Budget,
  statistics: Statistics,
};

const CATEGORIES = {
  income: ["default", "salary", "freelance", "investments", "other"],
  expense: ["default", "food-dining", "transportation", "shopping", "bills-utilities", "entertainment", "healthcare", "travel", "other"],
};

function init() {
  render_tab(Dashboard);

  navigation_buttons.map(button => {
    button.addEventListener("click", () => {
      if (button.classList.contains("selected")) return;
      highlight_selected_tab(navigation_buttons, button);

      const tab = NAVIGATION_KEYMAP[button.dataset.navigationTab];
      if (tab) render_tab(tab);
    });
  });
  toggle_sidebar_button.addEventListener("click", () => navigation_sidebar.map(sidebar => sidebar.classList.toggle("visible")));

  mobile_add_transaction_navigation_button.addEventListener("click", () => {
    add_transaction_panel.classList.add("visible");
    reset_add_transaction_inputs();
    amount.select();
  });
  mobile_discard_transaction_button.addEventListener("click", () => {
    add_transaction_panel.classList.remove("visible");
  });
  mobile_add_transaction_button.addEventListener("click", () => {
    const transaction_type = get_selected_input_type();
    const { amount, currency, description, method, category, time } = get_transaction_inputs();
    if (![transaction_type, currency, amount, description, method, category, time].some(input => input === "")) {
      Transaction.add(transaction_type, currency, parseInt(amount), description, method, category, time);
      refresh_current_tab();
      add_transaction_panel.classList.remove("visible");
    }
  });

  main_content.addEventListener("click", event => {
    if (event.target.closest(".transaction-card")) return;
    const transaction_cards = [...document.getElementsByClassName("transaction-card")];
    if (transaction_cards.length > 0) transaction_cards.map(transaction_card => transaction_card.classList.remove("edit"));
  });

  init_mobile_add_transaction_inputs();
}

function refresh_current_tab() {
  const CURRENT_TAB_KEYMAP = {
    dashboard: Dashboard,
    transactions: Transactions,
    budget: Budget,
    statistics: Statistics,
  };
  const current_tab_name = main.dataset.tab;
  const current_tab = CURRENT_TAB_KEYMAP[current_tab_name];
  if (current_tab.refresh) current_tab.refresh();
}

function get_transaction_inputs() {
  const [amount_value, currency_value, description_value, method_value, category_value, time_value] = [
    get_value(amount),
    get_value(currency),
    get_value(description),
    get_value(method),
    get_value(category),
    get_value(time),
  ];

  return {
    amount: amount_value,
    currency: currency_value,
    description: description_value,
    method: method_value,
    category: category_value,
    time: time_value,
  };

  function get_value(element) {
    return element.value.trim();
  }
}

function reset_add_transaction_inputs() {
  const expense_option = document.getElementById("transaction-input-type-expense");
  expense_option.checked = true;
  const amount = document.getElementById("add-transaction-input-amount");
  amount.value = 0;
  const currency = document.getElementById("add-transaction-input-currency");
  currency.value = "$";
  const description = document.getElementById("add-transaction-input-description");
  description.value = "";
  const method = document.getElementById("add-transaction-input-method");
  method.value = "cash";
  const category = document.getElementById("add-transaction-input-category");
  category.value = "default";
  const time = document.getElementById("add-transaction-input-time");
  time.value = get_current_iso_formatted_time();
  transaction_preview_container.classList.remove("income");
  transaction_preview_container.classList.add("expense");
  set_category("expense");
  refresh_inputs();
}

function refresh_inputs() {
  transaction_inputs.map(transaction_input => {
    const input = transaction_input;
    const input_type = transaction_input.dataset.type;
    let preview_input;
    if (input_type === "currency") preview_input = transaction_preview.find(element => element.dataset.type === "amount");
    else preview_input = transaction_preview.find(element => element.dataset.type === input_type);
    refresh_preview(input, preview_input);
  });
}

function get_current_iso_formatted_time() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function init_mobile_add_transaction_inputs() {
  transaction_inputs.map(transaction_input => transaction_input.addEventListener("input", refresh_inputs));

  [income_option, expense_option].map(input_type => {
    input_type.addEventListener("input", () => {
      const transaction_type = input_type.dataset.type;
      const amount_transaction_preview = transaction_preview.find(preview => preview.dataset.type === "amount");
      if (transaction_type === "income") {
        transaction_preview_container.classList.remove("expense");
        transaction_preview_container.classList.add("income");
      } else {
        transaction_preview_container.classList.remove("income");
        transaction_preview_container.classList.add("expense");
      }
      refresh_preview(input_type, amount_transaction_preview);
      set_category(transaction_type);
      const category_preview = transaction_preview.find(preview => preview.dataset.type === "category");
      refresh_preview(category, category_preview);
    });
  });
}

function refresh_preview(input, preview_input) {
  if (input && preview_input) {
    const input_type = input.dataset.type;
    switch (input_type) {
      case "method":
        preview_input.textContent = Utils.capitalize(input.value);
        break;
      case "category":
        preview_input.textContent = Utils.capitalize(input.value, " & ");
        Icon.get(get_selected_input_type(), input.value).then(icon_url => {
          transaction_icon_preview.src = icon_url;
        });
        break;
      case "time":
        preview_input.textContent = Utils.format_transaction_time(input.value);
        break;
    }
    if (["amount", "currency", "income", "expense"].includes(input_type)) refresh_amount();
  }

  function refresh_amount() {
    const amount_preview = transaction_preview.find(preview => preview.classList.contains("transaction-amount", "transaction-preview"));
    const selected_input_type = get_selected_input_type();
    const amount_value = parseInt(amount.value);
    amount_preview.textContent = `${selected_input_type === "income" ? "+" : selected_input_type === "expense" ? "-" : ""}${currency.value}${
      amount_value === "" ? 0 : amount_value
    }`;
  }
}

function set_category(type) {
  if (!CATEGORIES[type]) return;
  add_transaction_input_category.innerHTML = "";
  CATEGORIES[type].forEach(category => {
    add_transaction_input_category.insertAdjacentHTML("beforeend", `<option value="${category}">${Utils.capitalize(category)}</option>`);
  });
}
function set_category_filters(type) {
  if (!CATEGORIES[type]) return;
  add_transaction_input_category.innerHTML = "";
  CATEGORIES[type].forEach(category => {
    add_transaction_input_category.insertAdjacentHTML("beforeend", `<option value="${category}">${Utils.capitalize(category)}</option>`);
  });
}

function get_selected_input_type() {
  const selected_type = income_option.checked === true ? income_option : expense_option.checked === true ? expense_option : null;
  if (selected_type === null) return selected_type;
  const selected_type_name = selected_type.dataset.type;
  return selected_type_name;
}

function render_tab(tab) {
  const TAB_CALLBACK_KEYMAP = {
    dashboard: () => {
      highlight_selected_tab(navigation_buttons, transactions_button);
      render_tab(Transactions);
    },
  };

  main_content.innerHTML = tab.get();
  tab.init(TAB_CALLBACK_KEYMAP[tab.name]);
  main.dataset.tab = tab.name;

  current_tab_name.textContent = Utils.capitalize(tab.name);
}

function highlight_selected_tab(tabs, selected_tab_list) {
  tabs.map(tab => {
    if (Array.isArray(selected_tab_list)) {
      selected_tab_list.forEach(selected_tab => {
        const current_tab_name = tab.dataset.navigationTab;
        const selected_tab_name = selected_tab.dataset.navigationTab;
        if (current_tab_name === selected_tab_name) tab.classList.add("selected");
        else tab.classList.remove("selected");
      });
    } else {
      const selected_tab = selected_tab_list;
      const current_tab_name = tab.dataset.navigationTab;
      const selected_tab_name = selected_tab.dataset.navigationTab;
      if (current_tab_name === selected_tab_name) tab.classList.add("selected");
      else tab.classList.remove("selected");
    }
  });
}

init();

export default {
  categories: {
    get income() {
      return CATEGORIES.income;
    },
    get expense() {
      return CATEGORIES.expense;
    },
  },
  refresh: refresh_current_tab,
};
