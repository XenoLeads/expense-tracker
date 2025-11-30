import Transaction from "./transaction.js";
import Budget from "./budget.js";

function save() {
  localStorage.setItem(
    "data",
    JSON.stringify({
      transactions: Transaction.get(),
      budgets: Budget.get(),
    })
  );
}

function set() {
  const DATA_KEYMAP = {
    transactions: Transaction,
    budgets: Budget,
  };
  const stored_data = JSON.parse(localStorage.getItem("data"));
  for (const data in stored_data) if (data in DATA_KEYMAP) DATA_KEYMAP[data].set(stored_data[data]);
}

export default {
  save,
  set,
};
