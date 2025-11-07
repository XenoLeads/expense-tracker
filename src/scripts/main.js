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
const mobile_add_transaction_button = document.getElementsByClassName("navigation-button-add mobile")[0];
const mobile_discard_transaction_button = document.getElementsByClassName("discard-transaction-button")[0];

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

  mobile_add_transaction_button.addEventListener("click", () => {
    add_transaction_panel.classList.add("visible");
  });
  mobile_discard_transaction_button.addEventListener("click", () => {
    add_transaction_panel.classList.remove("visible");
  });
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
