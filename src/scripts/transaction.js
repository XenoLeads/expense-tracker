const transactions = [];

function Transaction(type, amount, description, method, category, time) {
  return { type, amount, description, method, category, time, id: crypto.randomUUID() };
}

function add_transaction(type, amount, description, method, category, time) {
  transactions.push(Transaction(type, amount, description, method, category, time));
}

add_transaction("income", "$123", "First Client", "cash", "freelance", "6/11/2025");

export default {
  get: () => transactions,
  add: add_transaction,
};
