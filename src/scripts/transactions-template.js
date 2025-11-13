import Transaction from "./transaction";
import search_icon from "../assets/icons/search.svg";
import clear_search_icon from "../assets/icons/clear.svg";
import Utils from "./utils";

const desktop_quick_view_actions_sidebar = document.getElementsByClassName("desktop-quick-view-actions-sidebar")[0];

function get_transactions_template() {
  return `
        <div class="search-bar-container">
          <button class="button search-button">
            <img src="${search_icon}" alt="" class="icon search-icon" />
          </button>
          <input type="text" name="search-bar" class="search-bar" />
          <button class="button clear-search-button">
            <img src="${clear_search_icon}" alt="" class="icon clear-search-icon" />
          </button>
        </div>
        <div class="card transaction-filters">
          <div class="transaction-filters-time">
            <button class="button transaction-filter transaction-time-filter-all selected">All Time</button>
            <button class="button transaction-filter transaction-time-filter-today">Today</button>
            <button class="button transaction-filter transaction-time-filter-this-week">This Week</button>
            <button class="button transaction-filter transaction-time-filter-this-month">This Month</button>
            <button class="button transaction-filter transaction-time-filter-this-year">This Year</button>
          </div>
          <div class="separator"></div>
          <div class="transaction-filters-category">
            <button class="button transaction-filter transaction-category-filter-all selected">All</button>
            <button class="button transaction-filter transaction-category-filter-income">Income</button>
            <button class="button transaction-filter transaction-category-filter-expense">Expense</button>
            <div class="vertical-separator"></div>
            <button class="button transaction-filter transaction-category-filter-income-expense selected">Income/Expense</button>
          </div>
        </div>

        <div class="card all-transactions-container">
          <div class="all-transactions-header">
            <h2 class="all-transactions-title">All Transactions</h2>
            <div class="separator"></div>
          </div>
          <div class="all-transactions"></div>
        </div>
  `;
}

function init_transactions_template() {
  desktop_quick_view_actions_sidebar.innerHTML = `
  <div class="transaction-filters">
            <div class="card transaction-filters-time">
              <div class="desktop-transaction-filters-time-heading-separator">
                <h2 class="desktop-transaction-filters-time-heading">Time</h2>
                <div class="separator"></div>
              </div>
              <button class="button transaction-filter transaction-time-filter-all selected">All Time</button>
              <button class="button transaction-filter transaction-time-filter-today">Today</button>
              <button class="button transaction-filter transaction-time-filter-this-week">This Week</button>
              <button class="button transaction-filter transaction-time-filter-this-month">This Month</button>
              <button class="button transaction-filter transaction-time-filter-this-year">This Year</button>
            </div>
            <div class="card transaction-filters-category">
              <div class="desktop-transaction-filters-category-heading-separator">
                <h2 class="desktop-transaction-filters-category-heading">Category</h2>
                <div class="separator"></div>
              </div>
              <button class="button transaction-filter transaction-category-filter-all selected">All</button>
              <button class="button transaction-filter transaction-category-filter-income">Income</button>
              <button class="button transaction-filter transaction-category-filter-expense">Expense</button>
              <div class="separator"></div>
              <button class="button transaction-filter transaction-category-filter-income-expense selected">Income/Expense</button>
            </div>
          </div>
  `;

  const clear_search_button = document.getElementsByClassName("clear-search-icon")[0];
  if (clear_search_button) {
    clear_search_button.addEventListener("click", () => {
      const search_input = document.getElementsByClassName("search-bar")[0];
      if (search_input) search_input.value = "";
    });
  }

  refresh_transactions();
}

function refresh_transactions() {
  const all_transactions = document.getElementsByClassName("all-transactions")[0];
  all_transactions.innerHTML = "";
  const all_transactions_array = Transaction.get();
  all_transactions_array
    .slice()
    .reverse()
    .forEach(transaction => {
      Utils.get_transaction_card(transaction).then(card => {
        all_transactions.insertAdjacentHTML("beforeend", card);
      });
    });
}

export default {
  name: "transactions",
  get: get_transactions_template,
  init: init_transactions_template,
  refresh: refresh_transactions,
};
