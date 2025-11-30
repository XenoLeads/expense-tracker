let transactions = [];

function Transaction(type, currency, amount, description, method, category, time) {
  return { type, currency, amount, description, method, category, time, id: crypto.randomUUID() };
}

function add_transaction(type, currency, amount, description, method, category, time) {
  if (time.slice(0, -4) !== ":00Z") time += ":00Z";
  transactions.push(Transaction(type, currency, amount, description, method, category, time));
}

function remove_transaction(id) {
  const transaction = find_transaction(id);
  transactions.splice(transaction.index, 1);
  return transaction.item;
}

function find_transaction(id) {
  const transaction_index = transactions.findIndex(transaction => transaction.id === id);
  if (transaction_index < 0) return null;
  return { index: transaction_index, item: Object.assign({}, transactions[transaction_index]) };
}

function edit_transaction(id, new_transaction = null) {
  const transaction = find_transaction(id);
  if (transaction.index > -1 && new_transaction) {
    if (new_transaction.time) new_transaction.time += ":00Z";
    const selected_transaction = transactions[transaction.index];
    for (let property in selected_transaction) {
      if (property in new_transaction && selected_transaction[property] !== new_transaction[property]) {
        if (property === "amount") selected_transaction[property] = parseFloat(new_transaction[property]);
        else selected_transaction[property] = new_transaction[property];
      }
    }
  }
}

function search_transactions(description, new_transactions = null) {
  if (new_transactions) return new_transactions.filter(transaction => transaction.description.toLowerCase().includes(description.toLowerCase()));
  return transactions.filter(transaction => transaction.description.toLowerCase().includes(description.toLowerCase()));
}

export default {
  get: () => transactions,
  add: add_transaction,
  remove: remove_transaction,
  find: find_transaction,
  edit: edit_transaction,
  search: search_transactions,
  set(new_transactions) {
    transactions = new_transactions;
  },
};
