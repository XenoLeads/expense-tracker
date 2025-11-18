const budgets = [];

function Budget(category, amount, currency, recurrence) {
  return { category, amount, currency, recurrence, creation: new Date().toISOString() };
}

function add_budget(category, amount, currency, recurrence) {
  budgets.push(Budget(category, amount, currency, recurrence));
}

export default {
  get: () => budgets,
  add: add_budget,
};
