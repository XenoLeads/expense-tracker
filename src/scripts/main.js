import "../styles/style.css";

import Icon from "./icon.js";
import Utils from "./utils.js";
import Dashboard_Template from "./dashboard-template.js";
import Transactions_Template from "./transactions-template.js";
import Transaction from "./transaction.js";
import Budget_Template from "./budget-template.js";
import Budget from "./budget.js";
import Statistics_Template from "./statistics-template.js";

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
const budget_input_discard_button = document.getElementsByClassName("budget-input-discard-button")[0];
const budget_input_confirm_button = document.getElementsByClassName("budget-input-confirm-button")[0];
const budget_input_panel_container = document.getElementsByClassName("budget-input-panel-container")[0];

const NAVIGATION_KEYMAP = {
  dashboard: Dashboard_Template,
  transactions: Transactions_Template,
  budget: Budget_Template,
  statistics: Statistics_Template,
};

const CATEGORIES = {
  income: ["default", "salary", "freelance", "investments", "other"],
  expense: ["default", "food-dining", "transportation", "shopping", "bills-utilities", "entertainment", "healthcare", "travel", "other"],
};

function init() {
  render_tab(Dashboard_Template);

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
    add_transaction_panel.dataset.actionMode = "add";
    reset_add_transaction_inputs();
    amount.select();
  });
  mobile_discard_transaction_button.addEventListener("click", () => {
    add_transaction_panel.classList.remove("visible");
  });
  mobile_add_transaction_button.addEventListener("click", () => {
    const transaction_type = get_selected_input_type();
    const { amount, currency, description, method, category, time } = get_transaction_inputs();
    if (![transaction_type, currency, amount, method, category, time].some(input => input === "") && parseFloat(amount) !== 0) {
      const action_mode = add_transaction_panel.dataset.actionMode;
      const transaction_id = add_transaction_panel.dataset.transactionId;
      if (action_mode === "edit") {
        Transaction.edit(transaction_id, {
          transaction_type,
          amount,
          currency,
          description,
          method,
          category,
          time,
        });
      } else {
        Transaction.add(transaction_type, currency, parseInt(amount), description, method, category, time);
      }
      refresh_current_tab();
      add_transaction_panel.classList.remove("visible");
    }
  });

  main_content.addEventListener("click", event => {
    if (event.target.closest(".transaction-card")) return;
    const transaction_cards = [...document.getElementsByClassName("transaction-card")];
    if (transaction_cards.length > 0) transaction_cards.map(transaction_card => transaction_card.classList.remove("edit"));
  });

  budget_input_confirm_button.addEventListener("click", () => {
    const budget_input_values = get_budget_inputs();
    if (budget_input_values === null) return;
    const action_mode = budget_input_panel_container.dataset.actionMode;
    let success = false;
    if (action_mode === "add") {
      const { category, amount, currency, recurrence } = budget_input_values;
      success = Budget.add(category, amount, currency, recurrence);
    } else if (action_mode === "edit") {
      const budget_id = budget_input_panel_container.dataset.id;
      success = Budget.edit(budget_input_values, budget_id);
    }
    if (success) {
      budget_input_panel_container.classList.remove("visible");
      refresh_current_tab();
    }
  });

  init_mobile_add_transaction_inputs();
  init_budget_panel();
  document.body.removeAttribute("style");
}

function get_budget_inputs() {
  const budget_time_input = [...document.getElementsByClassName("budget-input-time")].find(input => input.classList.contains("selected"));
  const budget_time_input_value = budget_time_input.dataset.value;
  const budget_inputs = [...document.getElementsByClassName("budget-input")];
  const inputs = { recurrence: budget_time_input_value };
  budget_inputs.forEach(input => {
    const type = input.dataset.type;
    const value = input.value;
    inputs[type] = value;
  });
  if (inputs.amount.trim() === "") return null;
  inputs.amount = parseFloat(inputs.amount);
  return inputs;
}

function refresh_current_tab() {
  const CURRENT_TAB_KEYMAP = {
    dashboard: Dashboard_Template,
    transactions: Transactions_Template,
    budget: Budget_Template,
    statistics: Statistics_Template,
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
  set_transaction_panel_input_values();
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
    amount_preview.textContent = `${selected_input_type === "income" ? "+" : selected_input_type === "expense" ? "-" : ""}${Utils.get_currency_symbol(
      currency.value
    )}${amount_value === "" ? 0 : amount_value}`;
  }
}

function set_category(type) {
  if (!CATEGORIES[type]) return;
  add_transaction_input_category.innerHTML = "";
  CATEGORIES[type].forEach(category => {
    add_transaction_input_category.insertAdjacentHTML("beforeend", `<option value="${category}">${Utils.capitalize(category, " & ")}</option>`);
  });
}

function show_edit_transaction_panel(transaction) {
  set_edit_transaction_panel(transaction);
  add_transaction_panel.classList.add("visible");
  add_transaction_panel.dataset.actionMode = "edit";
  add_transaction_panel.dataset.transactionId = transaction.id;
}

function set_edit_transaction_panel(transaction) {
  set_transaction_panel_input_values(
    transaction.type,
    transaction.amount,
    transaction.currency,
    transaction.description,
    transaction.method,
    transaction.category,
    transaction.time.slice(0, -1),
    "Edit Transaction",
    "Edit"
  );
  refresh_inputs();
}

function set_transaction_panel_input_values(
  type_value = "expense",
  amount_value = 0,
  currency_value = "usd",
  description_value = "",
  method_value = "cash",
  category_value = "default",
  time_value = get_current_iso_formatted_time(),
  heading_text = "New Transaction",
  action_button_text = "Add"
) {
  const heading_element = document.getElementsByClassName("add-transaction-heading")[0];
  heading_element.textContent = heading_text;
  mobile_add_transaction_button.textContent = action_button_text;
  if (type_value === "income") {
    income_option.checked = true;
    transaction_preview_container.classList.remove("expense");
    transaction_preview_container.classList.add("income");
    set_category("income");
  } else {
    expense_option.checked = true;
    transaction_preview_container.classList.remove("income");
    transaction_preview_container.classList.add("expense");
    set_category("expense");
  }
  amount.value = amount_value;
  currency.value = currency_value;
  description.value = description_value;
  method.value = method_value;
  category.value = category_value;
  time.value = time_value;
}

function show_edit_budget_panel(budget) {
  set_edit_budget_panel(budget, "Edit Budget", "Edit");
}
function set_edit_budget_panel(budget, heading_text = "Add New Budget", confirm_button_text = "Add") {
  set_budget_input_values(budget);
  const budget_panel_heading = document.getElementsByClassName("heading budget-input-panel-heading")[0];
  budget_panel_heading.textContent = heading_text;
  budget_input_confirm_button.textContent = confirm_button_text;
  budget_input_panel_container.classList.add("visible");
  budget_input_panel_container.dataset.actionMode = "edit";
  budget_input_panel_container.dataset.id = budget.id;
}

function set_budget_input_values(budget) {
  const budget_inputs = [...document.getElementsByClassName("budget-input")];
  const budget_time_inputs = [...document.getElementsByClassName("budget-input-time")];
  budget_time_inputs.map(input => {
    if (input.dataset.value === budget.recurrence) input.classList.add("selected");
    else input.classList.remove("selected");
  });
  budget_inputs.map(input => {
    const input_type = input.dataset.type;
    if (input_type in budget) input.value = budget[input_type];
  });
  set_budget_preview(budget);
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
      render_tab(Transactions_Template);
    },
  };

  main_content.innerHTML = tab.get();
  tab.init(TAB_CALLBACK_KEYMAP[tab.name]);
  main.dataset.tab = tab.name;

  current_tab_name.textContent = Utils.capitalize(tab.name);
  if (tab.refresh) tab.refresh();
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

function init_budget_panel() {
  const budget_time_inputs = [...document.getElementsByClassName("budget-input-time")];
  budget_time_inputs.map(budget_input => {
    budget_input.addEventListener("click", () => {
      if (budget_input.classList.contains("selected")) return;
      set_selected_class(budget_input);
      const type = budget_input.dataset.type;
      const value = budget_input.dataset.value;
      set_budget_preview({ [type]: value });
    });
  });

  const budget_inputs = [...document.getElementsByClassName("budget-input")];
  budget_inputs.map(budget_input => {
    budget_input.addEventListener("input", () => {
      const type = budget_input.dataset.type;
      const value = budget_input.value;
      set_budget_preview({ [type]: value });
    });
  });

  budget_input_discard_button.addEventListener("click", () => {
    const budget_input_panel_container = document.getElementsByClassName("budget-input-panel-container")[0];
    budget_input_panel_container.classList.remove("visible");
  });
}

function set_selected_class(element) {
  const parent = element.parentElement;
  const children = [...parent.children];
  children.map(child => child.classList.remove("selected"));
  element.classList.add("selected");
}

async function set_budget_preview(budget = {}) {
  const preview_inputs = [...document.getElementsByClassName("budget-preview-input")];
  const formatted_budget = await format(budget);
  for (const preview_input of preview_inputs) {
    const input_type = preview_input.dataset.type;

    if (input_type in formatted_budget)
      if (input_type === "icon") preview_input.src = formatted_budget[input_type];
      else preview_input.textContent = formatted_budget[input_type];
  }

  async function format(budget) {
    if (Object.keys(budget).length < 1) return;
    const formatted_budget = Object.assign({}, budget);
    for (const key in formatted_budget) {
      switch (key) {
        case "amount":
          const parsed_float = parseFloat(formatted_budget[key]);
          if (isNaN(parsed_float)) formatted_budget[key] = 0;
          else formatted_budget[key] = parseFloat(formatted_budget[key]);
          break;
        case "currency":
          formatted_budget[key] = Utils.get_currency_symbol(formatted_budget[key]);
          break;
        case "category":
          const value = formatted_budget[key];
          formatted_budget[key] = Utils.capitalize(value, " & ");
          const icon_url = await Icon.get("expense", value);
          formatted_budget.icon = icon_url;
          break;
        case "recurrence":
          formatted_budget[key] = `- ${Utils.capitalize(formatted_budget[key].slice(5))}ly`;
          break;
      }
    }
    return formatted_budget;
  }
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
  panel: {
    edit_transaction: show_edit_transaction_panel,
    edit_budget: show_edit_budget_panel,
  },
};
