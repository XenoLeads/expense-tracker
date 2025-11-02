import search_icon from "../assets/icons/search.svg";
import clear_search_icon from "../assets/icons/clear.svg";
import shopping_cart_icon from "../assets/icons/transaction-category/shopping-cart.svg";

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
          <div class="all-transactions">
            <div class="transaction-card">
              <div class="transaction-icon-category-type-time-container">
                <div class="icon transaction-icon">
                  <img src="${shopping_cart_icon}" alt="" />
                </div>
                <div class="transaction-category-type-time-container">
                  <p class="transaction-category">Grocery</p>
                  <div class="transaction-type-time-container">
                    <p class="transaction-type">Cash</p>
                    <p>-</p>
                    <p class="transaction-time">10:00 AM</p>
                  </div>
                </div>
              </div>
              <p class="transaction-amount expense">-$123</p>
            </div>
            <div class="transaction-card">
              <div class="transaction-icon-category-type-time-container">
                <div class="icon transaction-icon">
                  <img src="${shopping_cart_icon}" alt="" />
                </div>
                <div class="transaction-category-type-time-container">
                  <p class="transaction-category">Grocery</p>
                  <div class="transaction-type-time-container">
                    <p class="transaction-type">Cash</p>
                    <p>-</p>
                    <p class="transaction-time">10:00 AM</p>
                  </div>
                </div>
              </div>
              <p class="transaction-amount income">+$123</p>
            </div>
            <div class="transaction-card">
              <div class="transaction-icon-category-type-time-container">
                <div class="icon transaction-icon">
                  <img src="${shopping_cart_icon}" alt="" />
                </div>
                <div class="transaction-category-type-time-container">
                  <p class="transaction-category">Grocery</p>
                  <div class="transaction-type-time-container">
                    <p class="transaction-type">Cash</p>
                    <p>-</p>
                    <p class="transaction-time">10:00 AM</p>
                  </div>
                </div>
              </div>
              <p class="transaction-amount expense">-$123</p>
            </div>
            <div class="transaction-card">
              <div class="transaction-icon-category-type-time-container">
                <div class="icon transaction-icon">
                  <img src="${shopping_cart_icon}" alt="" />
                </div>
                <div class="transaction-category-type-time-container">
                  <p class="transaction-category">Grocery</p>
                  <div class="transaction-type-time-container">
                    <p class="transaction-type">Cash</p>
                    <p>-</p>
                    <p class="transaction-time">10:00 AM</p>
                  </div>
                </div>
              </div>
              <p class="transaction-amount income">+$123</p>
            </div>
            <div class="transaction-card">
              <div class="transaction-icon-category-type-time-container">
                <div class="icon transaction-icon">
                  <img src="${shopping_cart_icon}" alt="" />
                </div>
                <div class="transaction-category-type-time-container">
                  <p class="transaction-category">Grocery</p>
                  <div class="transaction-type-time-container">
                    <p class="transaction-type">Cash</p>
                    <p>-</p>
                    <p class="transaction-time">10:00 AM</p>
                  </div>
                </div>
              </div>
              <p class="transaction-amount expense">-$123</p>
            </div>
            <div class="transaction-card">
              <div class="transaction-icon-category-type-time-container">
                <div class="icon transaction-icon">
                  <img src="${shopping_cart_icon}" alt="" />
                </div>
                <div class="transaction-category-type-time-container">
                  <p class="transaction-category">Grocery</p>
                  <div class="transaction-type-time-container">
                    <p class="transaction-type">Cash</p>
                    <p>-</p>
                    <p class="transaction-time">10:00 AM</p>
                  </div>
                </div>
              </div>
              <p class="transaction-amount income">+$123</p>
            </div>
            <div class="transaction-card">
              <div class="transaction-icon-category-type-time-container">
                <div class="icon transaction-icon">
                  <img src="${shopping_cart_icon}" alt="" />
                </div>
                <div class="transaction-category-type-time-container">
                  <p class="transaction-category">Grocery</p>
                  <div class="transaction-type-time-container">
                    <p class="transaction-type">Cash</p>
                    <p>-</p>
                    <p class="transaction-time">10:00 AM</p>
                  </div>
                </div>
              </div>
              <p class="transaction-amount expense">-$123</p>
            </div>
            <div class="transaction-card">
              <div class="transaction-icon-category-type-time-container">
                <div class="icon transaction-icon">
                  <img src="${shopping_cart_icon}" alt="" />
                </div>
                <div class="transaction-category-type-time-container">
                  <p class="transaction-category">Grocery</p>
                  <div class="transaction-type-time-container">
                    <p class="transaction-type">Cash</p>
                    <p>-</p>
                    <p class="transaction-time">10:00 AM</p>
                  </div>
                </div>
              </div>
              <p class="transaction-amount income">+$123</p>
            </div>
            <div class="transaction-card">
              <div class="transaction-icon-category-type-time-container">
                <div class="icon transaction-icon">
                  <img src="${shopping_cart_icon}" alt="" />
                </div>
                <div class="transaction-category-type-time-container">
                  <p class="transaction-category">Grocery</p>
                  <div class="transaction-type-time-container">
                    <p class="transaction-type">Cash</p>
                    <p>-</p>
                    <p class="transaction-time">10:00 AM</p>
                  </div>
                </div>
              </div>
              <p class="transaction-amount expense">-$123</p>
            </div>
            <div class="transaction-card">
              <div class="transaction-icon-category-type-time-container">
                <div class="icon transaction-icon">
                  <img src="${shopping_cart_icon}" alt="" />
                </div>
                <div class="transaction-category-type-time-container">
                  <p class="transaction-category">Grocery</p>
                  <div class="transaction-type-time-container">
                    <p class="transaction-type">Cash</p>
                    <p>-</p>
                    <p class="transaction-time">10:00 AM</p>
                  </div>
                </div>
              </div>
              <p class="transaction-amount income">+$123</p>
            </div>
          </div>
        </div>
  `;
}

function init_transactions_template() {
  const clear_search_button = document.getElementsByClassName("clear-search-icon")[0];
  if (clear_search_button) {
    clear_search_button.addEventListener("click", () => {
      const search_input = document.getElementsByClassName("search-bar")[0];
      if (search_input) search_input.value = "";
    });
  }
}

export default {
  name: "transactions",
  get: get_transactions_template,
  init: init_transactions_template,
};
