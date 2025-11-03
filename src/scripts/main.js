import "../styles/style.css";
import Dashboard from "./dashboard-template.js";
import Transactions from "./transactions-template.js";
import Budget from "./budget-template.js";
import Statistics from "./statistics-template.js";

const main = document.getElementsByClassName("main")[0];
const current_tab_name = [...document.getElementsByClassName("current-tab-name")];
const dashboard_button = [...document.getElementsByClassName("navigation-button-dashboard")];
const transactions_button = [...document.getElementsByClassName("navigation-button-transactions")];
const budget_button = [...document.getElementsByClassName("navigation-button-budget")];
const statistics_button = [...document.getElementsByClassName("navigation-button-statistics")];
const navigation_buttons = [...dashboard_button, ...transactions_button, ...budget_button, ...statistics_button];
const toggle_sidebar_button = document.getElementsByClassName("toggle-sidebar-button")[0];
const tablet_navigation_sidebar = document.getElementsByClassName("tablet-navigation-sidebar")[0];

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
  toggle_sidebar_button.addEventListener("click", () => tablet_navigation_sidebar.classList.toggle("visible"));
}

function render_tab(tab) {
  const TAB_CALLBACK_KEYMAP = {
    dashboard: () => {
      highlight_selected_tab(navigation_buttons, transactions_button);
      render_tab(Transactions);
    },
  };

  main.innerHTML = tab.get();
  tab.init(TAB_CALLBACK_KEYMAP[tab.name]);

  current_tab_name.textContent = capitalize(tab.name);
}

function capitalize(string) {
  return (
    string[0].toUpperCase() +
    string
      .slice(1)
      .split("")
      .map(char => char.toLowerCase())
      .join("")
  );
}

function highlight_selected_tab(tabs, selected_tab) {
  tabs.map(tab => {
    const current_tab_name = tab.dataset.navigationTab;
    const selected_tab_name = selected_tab.dataset.navigationTab;
    if (current_tab_name === selected_tab_name) tab.classList.add("selected");
    else tab.classList.remove("selected");
  });
}

init();
