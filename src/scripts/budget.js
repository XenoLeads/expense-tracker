let budgets = [];

function Budget(category, amount, currency, recurrence) {
  return { category, amount, currency, recurrence, creation: new Date().toISOString(), id: crypto.randomUUID() };
}

function add_budget(category, amount, currency, recurrence) {
  const same_budget_does_not_exists = budgets.findIndex(budget => budget.category === category && budget.recurrence === recurrence) < 0;
  if (same_budget_does_not_exists) {
    budgets.push(Budget(category, amount, currency, recurrence));
    return true;
  }
  return false;
}

function remove_budget(id) {
  const budget = find_budget(id);
  if (!budget) return false;
  budgets.splice(budget.index, 1);
  return budget.item;
}

function find_budget(id) {
  const budget_index = budgets.findIndex(budget => budget.id === id);
  if (budget_index < 0) return null;
  return { index: budget_index, item: Object.assign({}, budgets[budget_index]) };
}

function edit_budget(new_budget, id) {
  const target_budget_object = find_budget(id);
  if (!target_budget_object) return;
  const target_budget = budgets[target_budget_object.index];
  const same_type_of_budget_index = budgets.findIndex(
    budget => new_budget.category === budget.category && new_budget.recurrence === budget.recurrence && id !== budget.id
  );
  const same_type_of_budget_exists = same_type_of_budget_index > 0;
  if (!same_type_of_budget_exists) {
    for (const property in new_budget) if (property in target_budget) target_budget[property] = new_budget[property];
    return true;
  }
  return false;
}

export default {
  get: () => budgets,
  add: add_budget,
  find: find_budget,
  remove: remove_budget,
  edit: edit_budget,
  set(new_budgets) {
    budgets = new_budgets;
  },
};
