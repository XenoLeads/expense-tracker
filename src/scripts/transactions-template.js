import Main from "./main.js";
import Transaction from "./transaction";
import search_icon from "../assets/icons/search.svg";
import clear_search_icon from "../assets/icons/clear.svg";
import Utils from "./utils";

const desktop_quick_view_actions_sidebar = document.getElementsByClassName("desktop-quick-view-actions-sidebar")[0];
const Filters = {
  time: "all",
  type: "all",
  category: "all",
};

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
              <button class="button transaction-filter transaction-time-filter-all selected" data-type="time" data-value="all">All Time</button>
              <button class="button transaction-filter transaction-time-filter-today" data-type="time" data-value="today">Today</button>
              <button class="button transaction-filter transaction-time-filter-this-week" data-type="time" data-value="this-week">This Week</button>
              <button class="button transaction-filter transaction-time-filter-this-month" data-type="time" data-value="this-month">
                This Month
              </button>
              <button class="button transaction-filter transaction-time-filter-this-year" data-type="time" data-value="this-year">This Year</button>
            </div>
            <div class="separator"></div>
            <div class="transaction-filters-type">
              <button class="button transaction-filter transaction-category-filter-all selected" data-type="type" data-value="all">All</button>
              <button class="button transaction-filter transaction-category-filter-income" data-type="type" data-value="income">Income</button>
              <button class="button transaction-filter transaction-category-filter-expense" data-type="type" data-value="expense">Expense</button>
              <div class="vertical-separator"></div>
              <div class="transaction-filters-category"></div>
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
              <button class="button transaction-filter transaction-time-filter-all selected" data-type="time" data-value="all">All Time</button>
              <button class="button transaction-filter transaction-time-filter-today" data-type="time" data-value="today">Today</button>
              <button class="button transaction-filter transaction-time-filter-this-week" data-type="time" data-value="this-week">This Week</button>
              <button class="button transaction-filter transaction-time-filter-this-month" data-type="time" data-value="this-month">This Month</button>
              <button class="button transaction-filter transaction-time-filter-this-year" data-type="time" data-value="this-year">This Year</button>
            </div>
            <div class="card transaction-filters-type">
              <div class="desktop-transaction-filters-type-heading-separator">
                <h2 class="desktop-transaction-filters-type-heading">Category</h2>
                <div class="separator"></div>
              </div>
              <button class="button transaction-filter transaction-category-filter-all selected" data-type="type" data-value="all">All</button>
              <button class="button transaction-filter transaction-category-filter-income" data-type="type" data-value="income">Income</button>
              <button class="button transaction-filter transaction-category-filter-expense" data-type="type" data-value="expense">Expense</button>
              <div class="separator"></div>
              <button class="button transaction-filter transaction-category-filter-income-expense selected" data-type="category" data-value="all">Income/Expense</button>
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

  display_transactions();

  const transaction_filters = [...document.getElementsByClassName("transaction-filter")];

  transaction_filters.map(filter => filter.addEventListener("click", () => handle_transaction_filters(filter)));
}

function handle_transaction_filters(filter) {
  const filter_type = filter.dataset.type;
  const filter_value = filter.dataset.value;
  if (filter_type in Filters && Filters[filter_type] !== filter_value) {
    Filters[filter_type] = filter_value;
    update_filter_ui(filter_type, filter_value);
    display_transactions(Filters);
  }
}

function update_filter_ui(filter_type, filter_value) {
  const category_filters_container = document.getElementsByClassName("transaction-filters-category")[0];
  const transaction_filters = [...document.getElementsByClassName("transaction-filter")];
  const time_filters = transaction_filters.filter(transaction => transaction.dataset.type === "time");
  const type_filters = transaction_filters.filter(transaction => transaction.dataset.type === "type");
  const category_filters = transaction_filters.filter(transaction => transaction.dataset.type === "category");
  const FILTER_KEYMAP = {
    time: time_filters,
    type: type_filters,
    category: category_filters,
  };

  if (filter_type in FILTER_KEYMAP) {
    FILTER_KEYMAP[filter_type].map(filter => {
      const current_filter_value = filter.dataset.value;
      if (current_filter_value === filter_value) filter.classList.add("selected");
      else filter.classList.remove("selected");
    });
  }

  if (filter_type === "type" && filter_value === "all") Filters.category = "all";

  if (filter_type === "type") {
    const create_category_button = category_name =>
      `<button class="button transaction-filter transaction-category-filter-${category_name}" data-type="category" data-value="${category_name}">${Utils.capitalize(
        category_name
      )}</button>`;
    category_filters_container.innerHTML = "";
    let category_buttons = "";
    if (filter_value !== "all") Main.categories[Filters.type].forEach(category_name => (category_buttons += create_category_button(category_name)));
    category_filters_container.insertAdjacentHTML("beforeend", category_buttons);

    // Add event listener to newly created category filters
    [...category_filters_container.children].map(filter =>
      filter.addEventListener("click", () => {
        handle_transaction_filters(filter);
      })
    );
  }
}

async function display_transactions(filters = null) {
  const all_transactions = document.getElementsByClassName("all-transactions")[0];
  all_transactions.innerHTML = "";
  const sorted_transactions = Utils.sort_transactions(Transaction.get());
  let transactions = sorted_transactions;
  if (filters) transactions = Utils.filter_transactions(sorted_transactions, filters);

  let all_cards = "";
  for (const transaction of transactions) {
    const card = await Utils.get_transaction_card(transaction);
    all_cards += card;
  }
  all_transactions.insertAdjacentHTML("beforeend", all_cards);
}

export default {
  name: "transactions",
  get: get_transactions_template,
  init: init_transactions_template,
  refresh: display_transactions,
};
