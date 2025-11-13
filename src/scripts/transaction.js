const transactions = [];

function Transaction(type, currency, amount, description, method, category, time) {
  return { type, currency, amount, description, method, category, time, id: crypto.randomUUID() };
}

function add_transaction(type, currency, amount, description, method, category, time) {
  transactions.push(Transaction(type, currency, amount, description, method, category, time));
}

add_transaction("expense", "usd", "12", "", "cash", "travel", "2025-11-13T05:00:00Z");
add_transaction("expense", "eur", "12", "", "cash", "travel", "2025-11-13T05:00:00Z");
add_transaction("expense", "usd", "12", "", "cash", "travel", "2025-11-13T05:00:00Z");
add_transaction("expense", "gbp", "12", "", "cash", "travel", "2025-11-13T05:00:00Z");
add_transaction("expense", "usd", "12", "", "cash", "travel", "2025-11-13T05:00:00Z");
add_transaction("income", "usd", "12", "", "cash", "freelance", "2025-11-13T05:00:00Z");
add_transaction("income", "usd", "12", "", "cash", "freelance", "2025-11-13T05:00:00Z");
add_transaction("income", "usd", "12", "", "cash", "freelance", "2025-11-13T05:00:00Z");
add_transaction("income", "usd", "12", "", "cash", "freelance", "2025-11-13T05:00:00Z");
add_transaction("income", "usd", "12", "", "cash", "freelance", "2025-11-13T05:00:00Z");
add_transaction("income", "usd", "12", "", "cash", "freelance", "2025-11-13T05:00:00Z");
add_transaction("income", "usd", "12", "", "cash", "freelance", "2025-11-13T05:00:00Z");

export default {
  get: () => transactions,
  add: add_transaction,
};
