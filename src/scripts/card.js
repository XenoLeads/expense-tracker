import Transaction from "./transaction.js";
import Icon from "./icon.js";
import Utils from "./utils.js";
import Main from "./main.js";
import Budget from "./budget.js";

function get_card_action_buttons() {
  const container = document.createElement("div");
  container.className = "card-action-buttons-container";

  const edit_button = document.createElement("button");
  edit_button.className = "button card-action-button card-action-button-edit";
  edit_button.dataset.action = "edit";

  const edit_button_icon = document.createElement("img");
  edit_button_icon.className = "icon dark-light";
  edit_button_icon.src = "#";
  edit_button_icon.alt = "";

  const edit_button_text = document.createElement("p");
  edit_button_text.textContent = "Edit";
  edit_button_text.className = "card-action-button-text";

  edit_button.appendChild(edit_button_icon);
  edit_button.appendChild(edit_button_text);
  Icon.import(Utils.get_icon_url("edit", Main.is_dark_theme)).then(icon_url => (edit_button_icon.src = icon_url));

  const remove_button = document.createElement("button");
  remove_button.className = "button card-action-button card-action-button-remove";
  remove_button.dataset.action = "remove";

  const remove_button_icon = document.createElement("img");
  remove_button_icon.className = "icon dark-light";
  remove_button_icon.src = "#";
  remove_button_icon.alt = "";

  const remove_button_text = document.createElement("p");
  remove_button_text.textContent = "Remove";
  remove_button_text.className = "card-action-button-text";

  remove_button.appendChild(remove_button_icon);
  remove_button.appendChild(remove_button_text);
  Icon.import(Utils.get_icon_url("clear", Main.is_dark_theme)).then(icon_url => (remove_button_icon.src = icon_url));

  container.appendChild(edit_button);
  container.appendChild(remove_button);

  return container;
}

async function create_transaction_card(transaction, editable = false) {
  const icon_url = await Icon.get(transaction.type, transaction.category);
  const card = document.createElement("div");
  card.classList.add("transaction-card", transaction.type);
  card.dataset.id = transaction.id;
  card.title = transaction.description;
  card.dataset.card = "transaction";
  const card_content = `
            <div class="transaction-card-content">
              <div class="transaction-icon-category-method-time-container">
                <div class="icon transaction-icon">
                  <img src="${icon_url}" alt="" />
                </div>
                <div class="transaction-category-method-time-container">
                  <p class="transaction-category">${
                    transaction.category === "default" ? Utils.capitalize(transaction.type) : Utils.capitalize(transaction.category, " & ")
                  }</p>
                  <p class="transaction-description">${transaction.description}</p>
                  <div class="transaction-method-time-container">
                    <p class="transaction-method">${Utils.capitalize(transaction.method)}</p>
                    <p>-</p>
                    <p class="transaction-time">${Utils.format_transaction_time(transaction.time)}</p>
                  </div>
                </div>
              </div>
              <p class="transaction-amount">${transaction.type === "income" ? "+" : "-"}${Utils.get_currency_symbol(
    transaction.currency
  )}${parseFloat(transaction.amount)}</p>
            </div>
      `;

  card.innerHTML = card_content;

  if (editable) {
    const separator = document.createElement("div");
    separator.className = "separator";
    card.appendChild(separator);
    card.appendChild(get_card_action_buttons());
    card.addEventListener("click", handle_action_buttons);
  }

  return card;
}

function handle_action_buttons(event) {
  const card = event.currentTarget;
  const clicked_element = event.target;
  if (clicked_element.classList.contains("card-action-button")) {
    const card_type = card.dataset.card;
    const action = clicked_element.dataset.action;
    const card_id = card.dataset.id;
    if (card_type === "transaction") {
      if (action === "remove") {
        const removed_transaction = Transaction.remove(card_id);
        console.group("Removed Transaction:");
        console.log(removed_transaction);
        console.groupEnd();
        Main.refresh();
      } else if (action === "edit") {
        Main.panel.edit_transaction(Transaction.find(card_id).item);
      }
    } else if (card_type === "budget") {
      if (action === "remove") {
        const removed_budget = Budget.remove(card_id);
        console.group("Removed Budget:");
        console.log(removed_budget);
        console.groupEnd();
        Main.refresh();
      } else if (action === "edit") {
        Main.panel.edit_budget(Budget.find(card_id).item);
      }
    }
  }
  if (card.classList.contains("edit")) return;
  const parent = card.parentElement;
  const children = [...parent.children];
  children.map(child => child.classList.remove("edit"));
  card.classList.add("edit");
}

async function create_budget_card(budget) {
  let { amount, used, category, currency, recurrence } = budget;
  const remaining_amount = amount - used;
  const icon_url = await Icon.get("expense", category);
  const card = document.createElement("div");
  card.className = "budget-card";
  card.dataset.recurrence = recurrence;
  let used_budget_percentage = (used / amount) * 100;
  card.title = `${format_amount(used, currency)}/${format_amount(amount, currency)}\nRemaining: ${format_amount(remaining_amount, currency)}`;
  card.dataset.id = budget.id;
  card.dataset.card = "budget";
  const card_content = `
            <div class="budget-card-content">
              <div class="budget-icon-type-progress-amount-progress-bar">
                <img src="${icon_url}" alt="" class="icon budget-icon" />
                <div class="budget-type-progress-amount-progress-bar">
                  <div class="budget-type-progress-amount">
                    <p class="budget-type">${Utils.capitalize(category, " & ")}</p>
                    <div class="budget-progress-amount">
                    <div class="budget-progress-amount-used">${format_amount(used, currency)}</div>
                    /
                    <div class="budget-progress-amount-total">${format_amount(amount, currency)}</div>
                    </div>
                  </div>
                  <p class="budget-time budget-preview-input recurrence-time" data-type="time">- ${format_budget_recurrence_text(recurrence)}</p>
                  <progress value="${used}" max="${amount}" style="accent-color: ${get_progress_bar_color(
    used_budget_percentage
  )}" class="remaining-budget-progress-bar">${used_budget_percentage}%</progress>
                </div>
              </div>
              <p class="budget-remaining-amount">${format_amount(remaining_amount, currency)}</p>
            </div>
  `;

  card.innerHTML = card_content;

  const separator = document.createElement("div");
  separator.className = "separator";
  card.appendChild(separator);
  card.appendChild(get_card_action_buttons());
  card.addEventListener("click", handle_action_buttons);

  return card;

  function format_budget_recurrence_text(recurrence) {
    if (recurrence) return Utils.capitalize(recurrence.slice(5) + "ly");
  }
}

async function create_remaining_budget_card(budget) {
  const { amount, used, category, currency } = budget;
  const icon_url = await Icon.get("expense", category);
  let used_budget_percentage = (budget.used / budget.amount) * 100;
  const card = document.createElement("div");
  card.className = "remaining-budget";
  card.dataset.card = "remaining-budget";
  const card_content = `
                <img src="${icon_url}" alt="" class="icon remaining-budget-icon" />
                <div class="remaining-budget-type-amount-progress-bar">
                  <div class="remaining-budget-type-amount">
                    <p class="remaining-budget-type">${Utils.capitalize(category, " & ")}</p>
                    <p class="remaining-budget-amount">${format_amount(amount - used, Utils.get_currency_symbol(currency))}</p>
                  </div>
                  <progress value="${used}" max="${amount}" style="accent-color: ${get_progress_bar_color(
    used_budget_percentage
  )}" class="remaining-budget-progress-bar">${used_budget_percentage}%</progress>
                </div>
  `;
  card.innerHTML = card_content;
  return card;
}

function format_amount(amount, currency) {
  amount = parseFloat(amount);
  currency = Utils.get_currency_symbol(currency);
  if (amount < 0) return `-${currency}${parseFloat((amount * -1).toFixed(2))}`;
  return `${currency}${parseFloat(amount.toFixed(2))}`;
}

function get_progress_bar_color(percentage) {
  const BUDGET_PROGRESS_COLORS = {
    0: "#ADFF2F",
    50: "#FFA500",
    70: "#FF4500",
    90: "#8B0000",
  };
  let budget_progress_bar_color = BUDGET_PROGRESS_COLORS[0];
  if (percentage > 50 && percentage <= 70) budget_progress_bar_color = BUDGET_PROGRESS_COLORS[50];
  else if (percentage > 70 && percentage <= 90) budget_progress_bar_color = BUDGET_PROGRESS_COLORS[70];
  else if (percentage > 90) budget_progress_bar_color = BUDGET_PROGRESS_COLORS[90];
  return budget_progress_bar_color;
}

export default {
  transaction: create_transaction_card,
  budget: create_budget_card,
  remaining_budget: create_remaining_budget_card,
};
