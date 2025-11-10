import "../styles/style.css";

import Utils from "./utils.js";
import Dashboard from "./dashboard-template.js";
import Transactions from "./transactions-template.js";
import Budget from "./budget-template.js";
import Statistics from "./statistics-template.js";

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
const transaction_preview = [...document.getElementsByClassName("transaction-preview")];
const transaction_preview_container = document.querySelector(".add-transaction-input-preview > .transaction-card");

const NAVIGATION_KEYMAP = {
  dashboard: Dashboard,
  transactions: Transactions,
  budget: Budget,
  statistics: Statistics,
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
  });
  mobile_discard_transaction_button.addEventListener("click", () => {
    add_transaction_panel.classList.remove("visible");
  });
  mobile_add_transaction_button.addEventListener("click", () => {
    const income_option = document.getElementById("transaction-input-type-income");
    const expense_option = document.getElementById("transaction-input-type-expense");
    const seleted_type = income_option.checked === true ? income_option : expense_option;
    const seleted_type_name = seleted_type.dataset.type;
    const amount = document.getElementById("add-transaction-input-amount");
    const currency = document.getElementById("add-transaction-input-currency");
    const description = document.getElementById("add-transaction-input-description");
    const method = document.getElementById("add-transaction-input-method");
    const category = document.getElementById("add-transaction-input-category");
    const time = document.getElementById("add-transaction-input-time");
    const transaction_inputs = [amount, currency, description, method, category, time];
  });

  init_mobile_add_transaction_inputs();
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
  category.value = "none";
  const time = document.getElementById("add-transaction-input-time");
  time.value = get_current_iso_formatted_time();
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

function format_transaction_time(iso_format) {
  if (isWithin12Hours(iso_format)) {
    const [hour, minute] = iso_format.split("T")[1].split(":");
    if (parseInt(hour) > 12) return `${parseInt(hour) - 12}:${minute} PM`;
    else return `${parseInt(hour)}:${minute} AM`;
  } else {
    const [year, month, day] = iso_format.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  }
}

function init_mobile_add_transaction_inputs() {
  const income_option = document.getElementById("transaction-input-type-income");
  const expense_option = document.getElementById("transaction-input-type-expense");
  const amount = document.getElementById("add-transaction-input-amount");
  const currency = document.getElementById("add-transaction-input-currency");
  const description = document.getElementById("add-transaction-input-description");
  const method = document.getElementById("add-transaction-input-method");
  const category = document.getElementById("add-transaction-input-category");
  const time = document.getElementById("add-transaction-input-time");
  const transaction_inputs = [amount, currency, description, method, category, time];

  transaction_inputs.map(transaction_input => {
    transaction_input.addEventListener("input", () => {
      const input = transaction_input;
      const input_type = transaction_input.dataset.type;
      let preview_input;
      if (input_type === "currency") preview_input = transaction_preview.find(element => element.dataset.type === "amount");
      else preview_input = transaction_preview.find(element => element.dataset.type === input_type);
      refresh_preview(input, preview_input);
    });
  });

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
    });
  });

  function get_selected_input_type() {
    const income_option = document.getElementById("transaction-input-type-income");
    const expense_option = document.getElementById("transaction-input-type-expense");
    const selected_type = income_option.checked === true ? income_option : expense_option.checked === true ? expense_option : null;
    if (selected_type === null) return selected_type;
    const selected_type_name = selected_type.dataset.type;
    return selected_type_name;
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
          break;
        case "time":
          preview_input.textContent = format_transaction_time(input.value);
          break;
      }
      if (["amount", "currency", "income", "expense"].includes(input_type)) refresh_amount();
    }
  }
  function refresh_amount() {
    const amount_preview = transaction_preview.find(preview => preview.classList.contains("transaction-amount", "transaction-preview"));
    const selected_input_type = get_selected_input_type();
    amount_preview.textContent = `${selected_input_type === "income" ? "+" : selected_input_type === "expense" ? "-" : ""}${currency.value}${
      amount.value === "" ? 0 : amount.value
    }`;
  }
}

function isWithin12Hours(targetTime) {
  const now = new Date();
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

  const targetDate = new Date(targetTime);

  return targetDate >= twelveHoursAgo && targetDate <= now;
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
