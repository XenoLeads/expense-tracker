import "../styles/style.css";
import Dashboard from "./dashboard-template.js";
import Transactions from "./transactions-template.js";
import Budget from "./budget-template.js";
import Statistics from "./statistics-template.js";

const main = document.getElementsByClassName("main")[0];
const current_tab_name = document.getElementsByClassName("current-tab-name")[0];
const dashboard_button = document.getElementsByClassName("navigation-button-dashboard")[0];
const transactions_button = document.getElementsByClassName("navigation-button-transactions")[0];
const budget_button = document.getElementsByClassName("navigation-button-budget")[0];
const statistics_button = document.getElementsByClassName("navigation-button-statistics")[0];
const navigation_buttons = [dashboard_button, transactions_button, budget_button, statistics_button];

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

function highlight_selected_tab(tabs, selected_tab_name) {
  tabs.map(tab => tab.classList.remove("selected"));
  selected_tab_name.classList.add("selected");
}

init();
