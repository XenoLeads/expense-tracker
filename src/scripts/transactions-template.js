import Card from "./card.js";
import Main from "./main.js";
import Transaction from "./transaction.js";
import clear_search_icon from "../assets/icons/clear.svg";
import Utils from "./utils.js";

const desktop_quick_view_actions_sidebar = document.getElementsByClassName("desktop-quick-view-actions-sidebar")[0];
const Filters = {
  time: "all",
  type: "all",
  category: "all",
};

function get_transactions_template() {
  return `
        <div class="search-bar-container">
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
      if (search_input && search_input.value.trim() !== "") {
        search_input.value = "";
        refresh();
      }
    });
  }

  refresh();
}

function handle_transaction_filters(filter) {
  const filter_type = filter.dataset.type;
  const filter_value = filter.dataset.value;
  if (filter_type in Filters && Filters[filter_type] !== filter_value) {
    Filters[filter_type] = filter_value;
    if (filter_type === "type") Filters.category = "all";
    update_filter_ui(filter_type, filter_value);
    display_transactions(undefined, Filters);
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

  if (filter_type === "type") {
    category_filters_container.innerHTML = "";
    function create_category_button(category_name) {
      return `<button class="button transaction-filter transaction-category-filter-${category_name}" data-type="category" data-value="${category_name}">${Utils.capitalize(
        category_name,
        " & "
      )}</button>`;
    }

    let category_buttons = "";
    const only_show_selected_type_of_transactions = filter_value !== "all";
    if (only_show_selected_type_of_transactions) {
      Main.categories[Filters.type].forEach(category_name => (category_buttons += create_category_button(category_name)));
      category_filters_container.insertAdjacentHTML("beforeend", create_category_button("all"));
    }
    category_filters_container.insertAdjacentHTML("beforeend", category_buttons);

    // Add event listener to newly created category filters
    const all_category_filters = [...category_filters_container.children];
    all_category_filters.map(filter => {
      filter.classList.remove("selected");
      filter.addEventListener("click", () => {
        handle_transaction_filters(filter);
      });
    });
    if (only_show_selected_type_of_transactions) all_category_filters[0].classList.add("selected");
  }
}

async function display_transactions(transactions = Transaction.get(), filters = Filters) {
  const search_bar = document.getElementsByClassName("search-bar")[0];
  const searched_text = search_bar.value.trim();
  const all_transactions = document.getElementsByClassName("all-transactions")[0];
  all_transactions.innerHTML = "";
  const sorted_transactions = Utils.sort_transactions(transactions);
  let filtered_transactions;
  if (filters) filtered_transactions = Utils.filter_transactions(sorted_transactions, filters, searched_text);

  for (const transaction of filtered_transactions) {
    const card = await Card.transaction(transaction, true);
    all_transactions.appendChild(card);
  }
}

function refresh() {
  display_transactions();
  const transaction_filters = [...document.getElementsByClassName("transaction-filter")];
  transaction_filters.map(filter => filter.addEventListener("click", () => handle_transaction_filters(filter)));

  const search_bar = document.getElementsByClassName("search-bar")[0];
  const timer = { id: null, delay: 300 };
  search_bar.addEventListener("input", () => {
    clearTimeout(timer.id);
    timer.id = setTimeout(() => search(search_bar), timer.delay);
  });

  function search(search_bar) {
    const searched_text = search_bar.value.trim();
    const matched_transactions = Transaction.search(searched_text);
    display_transactions(matched_transactions);
  }
}

export default {
  name: "transactions",
  get: get_transactions_template,
  init: init_transactions_template,
  refresh,
};
