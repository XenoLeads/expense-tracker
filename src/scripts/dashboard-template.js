import shopping_cart_icon from "../assets/icons/transaction-category/shopping-cart.svg";

const desktop_quick_view_actions_sidebar = document.getElementsByClassName("desktop-quick-view-actions-sidebar")[0];

function get_dashboard_template() {
  return `
        <div class="balance-income-expense-expense-overview-top-icomes-top-expenses">
            <div class="balance-income-expense-expense-overview">
              <div class="card balance-income-expense">
                <div class="wrapper total-balance-wrapper">
                  <p>Balance:</p>
                  <p class="total-balance">$123</p>
                </div>
                <div class="income-expense">
                  <div class="wrapper total-income-wrapper">
                    <p>Income:</p>
                    <p class="total-income">$123</p>
                  </div>
                  <div class="wrapper total-expense-wrapper">
                    <p>Expense:</p>
                    <p class="total-expense">$123</p>
                  </div>
                </div>
              </div>
              <div class="card expense-overview">
                <div class="expense-details-wrapper">
                  <p class="expense-1-details">Food: $123</p>
                  <p class="expense-2-details">Travel: $123</p>
                  <p class="expense-3-details">Grocery: $123</p>
                </div>
                <div class="expense-pie-chart"></div>
              </div>
              <div class="card budget-overview">
                <h2 class="heading budget-overview-heading">Budget Overview</h2>
                <div class="separator"></div>
                <div class="budget-overviews-container">
                  <p class="budget-overview">Food: $123</p>
                  <p class="budget-overview">Travel: $123</p>
                  <p class="budget-overview">Grocery: $123</p>
                </div>
              </div>
            </div>
            <div class="card top-incomes-top-expenses">
              <div class="top-incomes-container">
                <h2 class="top-incomes-heading">Top Incomes</h2>
                <div class="separator"></div>
                <div class="top-incomes">
                  <p class="top-income">Freelance: $123</p>
                  <p class="top-income">Salary: $123</p>
                  <p class="top-income">Commission: $123</p>
                </div>
              </div>
              <div class="top-expenses-container">
                <h2 class="top-expenses-heading">Top Expenses</h2>
                <div class="separator"></div>
                <div class="top-expenses">
                  <p class="top-income">Rent: $123</p>
                  <p class="top-income">Grocery: $123</p>
                  <p class="top-income">Transportation: $123</p>
                </div>
              </div>
            </div>
          </div>
          <div class="card balance-line-chart-container">
            <div class="balance-line-chart"></div>
          </div>
          <div class="card recent-transactions-container">
            <div class="recent-transactions-heading">
              <h2 class="recent-transactions-heading-text">Recent Transactions</h2>
              <button class="button recent-transactions-heading-see-all-button">See All</button>
            </div>
            <div class="separator"></div>
            <div class="recent-transactions">
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

function init_dashboard_template(callback) {
  desktop_quick_view_actions_sidebar.innerHTML = `
  <div class="card top-incomes-top-expenses">
            <div class="top-incomes-container">
              <h2 class="top-incomes-heading">Top Incomes</h2>
              <div class="separator"></div>
              <div class="top-incomes">
                <p class="top-income">Freelance: $123</p>
                <p class="top-income">Salary: $123</p>
                <p class="top-income">Commission: $123</p>
              </div>
            </div>
            <div class="top-expenses-container">
              <h2 class="top-expenses-heading">Top Expenses</h2>
              <div class="separator"></div>
              <div class="top-expenses">
                <p class="top-income">Rent: $123</p>
                <p class="top-income">Groceries: $123</p>
                <p class="top-income">Transportation: $123</p>
              </div>
            </div>
          </div>
`;

  const see_all_transactions_button = document.getElementsByClassName("recent-transactions-heading-see-all-button")[0];
  if (see_all_transactions_button && callback) see_all_transactions_button.addEventListener("click", callback);
}

export default {
  name: "dashboard",
  get: get_dashboard_template,
  init: init_dashboard_template,
};
