import expense_icon from "../assets/icons/transaction-category/expense/expense.svg";
const desktop_quick_view_actions_sidebar = document.getElementsByClassName("desktop-quick-view-actions-sidebar")[0];

function get_budget_template() {
  return `
  <button class="button add-new-budget-button">Add New Budget</button>
        <div class="card remaining-budget-overview-pie-chart">
          <div class="remaining-budget-overview">
            <div class="remaining-budget-overview-heading-separator">
              <h2 class="remaining-budget-overview-heading">Most Used</h2>
              <div class="separator"></div>
            </div>
            <div class="most-used-budgets">
              <div class="remaining-budget">
                <img src="${"#"}" alt="" class="icon remaining-budget-icon" />
                <div class="remaining-budget-type-amount-progress-bar">
                  <div class="remaining-budget-type-amount">
                    <p class="remaining-budget-type">Grocery</p>
                    <p class="remaining-budget-amount">$123</p>
                  </div>
                  <progress value="30" max="100" style="accent-color: greenyellow" class="remaining-budget-progress-bar">30%</progress>
                </div>
              </div>
              <div class="remaining-budget">
                <img src="${"#"}" alt="" class="icon remaining-budget-icon" />
                <div class="remaining-budget-type-amount-progress-bar">
                  <div class="remaining-budget-type-amount">
                    <p class="remaining-budget-type">Grocery</p>
                    <p class="remaining-budget-amount">$123</p>
                  </div>
                  <progress value="30" max="100" style="accent-color: greenyellow" class="remaining-budget-progress-bar">30%</progress>
                </div>
              </div>
              <div class="remaining-budget">
                <img src="${"#"}" alt="" class="icon remaining-budget-icon" />
                <div class="remaining-budget-type-amount-progress-bar">
                  <div class="remaining-budget-type-amount">
                    <p class="remaining-budget-type">Grocery</p>
                    <p class="remaining-budget-amount">$123</p>
                  </div>
                  <progress value="30" max="100" style="accent-color: greenyellow" class="remaining-budget-progress-bar">30%</progress>
                </div>
              </div>
            </div>
          </div>
          <div class="budget-pie-chart"></div>
        </div>
        <div class="card all-budgets-container">
          <div class="all-budgets-heading-separator">
            <h2 class="all-budgets-heading">All Budgets</h2>
            <div class="separator"></div>
          </div>
          <div class="all-budgets-filters">
            <button class="button budget-filter all-budget-filter-button-all selected">All</button>
            <button class="button budget-filter all-budget-filter-button-most-used">Most Used</button>
            <button class="button budget-filter all-budget-filter-button-least-used">Least Used</button>
            <button class="button budget-filter all-budget-filter-button-weekly">Weekly</button>
            <button class="button budget-filter all-budget-filter-button-monthly">Monthly</button>
            <button class="button budget-filter all-budget-filter-button-yearly">Yearly</button>
          </div>
          <div class="all-budgets">
            <div class="budget-card">
              <div class="budget-icon-type-progress-amount-progress-bar">
                <img src="${"#"}" alt="" class="icon budget-icon" />
                <div class="budget-type-progress-amount-progress-bar">
                  <div class="budget-type-progress-amount">
                    <p class="budget-type">Grocery</p>
                    <p class="budget-progress-amount">$123/$123</p>
                  </div>
                  <progress value="30" max="100" style="accent-color: greenyellow" class="remaining-budget-progress-bar">30%</progress>
                </div>
              </div>
              <p class="budget-remaining-amount">$123</p>
            </div>
            <div class="budget-card">
              <div class="budget-icon-type-progress-amount-progress-bar">
                <img src="${"#"}" alt="" class="icon budget-icon" />
                <div class="budget-type-progress-amount-progress-bar">
                  <div class="budget-type-progress-amount">
                    <p class="budget-type">Grocery</p>
                    <p class="budget-progress-amount">$123/$123</p>
                  </div>
                  <progress value="30" max="100" style="accent-color: greenyellow" class="remaining-budget-progress-bar">30%</progress>
                </div>
              </div>
              <p class="budget-remaining-amount">$123</p>
            </div>
            <div class="budget-card">
              <div class="budget-icon-type-progress-amount-progress-bar">
                <img src="${"#"}" alt="" class="icon budget-icon" />
                <div class="budget-type-progress-amount-progress-bar">
                  <div class="budget-type-progress-amount">
                    <p class="budget-type">Grocery</p>
                    <p class="budget-progress-amount">$123/$123</p>
                  </div>
                  <progress value="30" max="100" style="accent-color: greenyellow" class="remaining-budget-progress-bar">30%</progress>
                </div>
              </div>
              <p class="budget-remaining-amount">$123</p>
            </div>
            <div class="budget-card">
              <div class="budget-icon-type-progress-amount-progress-bar">
                <img src="${"#"}" alt="" class="icon budget-icon" />
                <div class="budget-type-progress-amount-progress-bar">
                  <div class="budget-type-progress-amount">
                    <p class="budget-type">Grocery</p>
                    <p class="budget-progress-amount">$123/$123</p>
                  </div>
                  <progress value="30" max="100" style="accent-color: greenyellow" class="remaining-budget-progress-bar">30%</progress>
                </div>
              </div>
              <p class="budget-remaining-amount">$123</p>
            </div>
            <div class="budget-card">
              <div class="budget-icon-type-progress-amount-progress-bar">
                <img src="${"#"}" alt="" class="icon budget-icon" />
                <div class="budget-type-progress-amount-progress-bar">
                  <div class="budget-type-progress-amount">
                    <p class="budget-type">Grocery</p>
                    <p class="budget-progress-amount">$123/$123</p>
                  </div>
                  <progress value="30" max="100" style="accent-color: greenyellow" class="remaining-budget-progress-bar">30%</progress>
                </div>
              </div>
              <p class="budget-remaining-amount">$123</p>
            </div>
          </div>
        </div>
  `;
}

function init_budget_template() {
  const add_new_budget_button = document.getElementsByClassName("add-new-budget-button")[0];
  add_new_budget_button.addEventListener("click", () => {
    reset_budget_inputs();
    const budget_input_panel_container = document.getElementsByClassName("budget-input-panel-container")[0];
    budget_input_panel_container.classList.toggle("visible");
  });

  function reset_budget_inputs() {
    const budget_time_inputs = [...document.getElementsByClassName("budget-input-time")];
    budget_time_inputs.map(budget_time_input =>
      budget_time_input.dataset.value === "monthly" ? budget_time_input.classList.add("selected") : budget_time_input.classList.remove("selected")
    );

    const budget_inputs = [...document.getElementsByClassName("budget-input")];
    for (const budget_input of budget_inputs) {
      const type = budget_input.dataset.type;
      switch (type) {
        case "amount":
          budget_input.value = "";
          break;
        case "currency":
          budget_input.value = "usd";
          break;
        case "category":
          budget_input.value = "default";
          break;
      }
    }

    const budget_preview_inputs = [...document.getElementsByClassName("budget-preview-input")];
    for (const budget_preview_input of budget_preview_inputs) {
      const type = budget_preview_input.dataset.type;
      switch (type) {
        case "icon":
          budget_preview_input.src = expense_icon;
          break;
        case "category":
          budget_preview_input.textContent = "Default";
          break;
        case "currency":
          budget_preview_input.textContent = "$";
          break;
        case "amount":
          budget_preview_input.textContent = 0;
          break;
        case "time":
          budget_preview_input.textContent = "- Monthly";
          break;
      }
    }
    console.log(budget_preview_inputs);
  }

  desktop_quick_view_actions_sidebar.innerHTML = `
  <div class="desktop-budget-quick-view-actions">
            <button class="button desktop-add-budget-button">Add New Budget</button>
            <div class="desktop-most-used-budget-overview-container">
              <div class="card desktop-most-used-budget-overview-chart">
                <div class="desktop-most-used-budget-overview">
                  <h2 class="desktop-most-used-budget-overview-heading">Most Used</h2>
                  <div class="separator"></div>
                  <div class="remaining-budget">
                    <img src="${"#"}" alt="" class="icon remaining-budget-icon" />
                    <div class="remaining-budget-type-amount-progress-bar">
                      <div class="remaining-budget-type-amount">
                        <p class="remaining-budget-type">Grocery</p>
                        <p class="remaining-budget-amount">$123</p>
                      </div>
                      <progress value="30" max="100" style="accent-color: greenyellow" class="remaining-budget-progress-bar">30%</progress>
                    </div>
                  </div>
                  <div class="remaining-budget">
                    <img src="${"#"}" alt="" class="icon remaining-budget-icon" />
                    <div class="remaining-budget-type-amount-progress-bar">
                      <div class="remaining-budget-type-amount">
                        <p class="remaining-budget-type">Grocery</p>
                        <p class="remaining-budget-amount">$123</p>
                      </div>
                      <progress value="30" max="100" style="accent-color: greenyellow" class="remaining-budget-progress-bar">30%</progress>
                    </div>
                  </div>
                  <div class="remaining-budget">
                    <img src="${"#"}" alt="" class="icon remaining-budget-icon" />
                    <div class="remaining-budget-type-amount-progress-bar">
                      <div class="remaining-budget-type-amount">
                        <p class="remaining-budget-type">Grocery</p>
                        <p class="remaining-budget-amount">$123</p>
                      </div>
                      <progress value="30" max="100" style="accent-color: greenyellow" class="remaining-budget-progress-bar">30%</progress>
                    </div>
                  </div>
                </div>
                <div class="desktop-most-used-budget-chart budget-pie-chart"></div>
              </div>
            </div>
          </div>
  `;
}

export default {
  name: "budget",
  get: get_budget_template,
  init: init_budget_template,
};
