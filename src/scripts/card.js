import Transaction from "./transaction.js";
import Icon from "./icon.js";
import Utils from "./utils.js";
import Main from "./main.js";

const CURRENCY_SYMBOLS = {
  usd: "$",
  eur: "€",
  gbp: "£",
  jpy: "¥",
  krw: "₩",
  inr: "₹",
  rub: "₽",
  try: "₺",
  vnd: "₫",
  brl: "R$",
  cad: "C$",
  aud: "A$",
  chf: "CHF",
  hkd: "HK$",
  nzd: "NZ$",
  sgd: "SG$",
};

async function create_transaction_card(transaction, editable = false) {
  const icon_url = await Icon.get(transaction.type, transaction.category);
  const card = document.createElement("div");
  card.classList.add("transaction-card", transaction.type);
  card.dataset.id = transaction.id;
  const action_buttons = `
            <div class="separator"></div>
            <div class="transaction-card-action-buttons-container">
              <button class="button transaction-card-action-button transaction-card-action-button-edit" data-action="edit">Edit</button>
              <button class="button transaction-card-action-button transaction-card-action-button-remove" data-action="remove">Remove</button>
            </div>
  `;
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
                  <div class="transaction-method-time-container">
                    <p class="transaction-method">${Utils.capitalize(transaction.method, "&")}</p>
                    <p>-</p>
                    <p class="transaction-time">${Utils.format_transaction_time(transaction.time)}</p>
                  </div>
                </div>
              </div>
              <p class="transaction-amount">${transaction.type === "income" ? "+" : "-"}${CURRENCY_SYMBOLS[transaction.currency]}${parseFloat(
    transaction.amount
  )}</p>
            </div>
            ${editable ? action_buttons : ""}
      `;

  card.innerHTML = card_content;
  if (editable) card.addEventListener("click", handle_action_buttons);

  return card;

  function handle_action_buttons(event) {
    const card = event.currentTarget;
    const clicked_element = event.target;
    if (clicked_element.classList.contains("transaction-card-action-button")) {
      const action = clicked_element.dataset.action;
      if (action === "remove") {
        const transaction_id = card.dataset.id;
        const remvoed_transaction = Transaction.remove(transaction_id);
        console.group("Removed Transaction:");
        console.log(remvoed_transaction);
        console.groupEnd();
        Main.refresh();
      }
    } else {
      const parent = card.parentElement;
      const children = [...parent.children];
      children.map(child => child.classList.remove("edit"));
      card.classList.add("edit");
    }
  }
}

export default {
  transaction: create_transaction_card,
};
