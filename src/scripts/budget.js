// Fake Budgets
const budgets = [
  {
    id: "1a2b3c4d-5e6f-7890-abcd-ef1234567890",
    category: "food-dining",
    amount: 500.0,
    currency: "usd",
    recurrence: "this-month",
    creation: "2025-01-15T10:00:00.000Z",
  },
  {
    id: "2b3c4d5e-6f7a-8901-bcde-f12345678901",
    category: "food-dining",
    amount: 120.0,
    currency: "gbp",
    recurrence: "this-week",
    creation: "2025-02-20T14:30:00.000Z",
  },
  {
    id: "3c4d5e6f-7a8b-9012-cdef-123456789012",
    category: "transportation",
    amount: 200.0,
    currency: "eur",
    recurrence: "this-month",
    creation: "2025-03-10T09:15:00.000Z",
  },
  {
    id: "4d5e6f7a-8b9c-0123-def1-234567890123",
    category: "transportation",
    amount: 2500.0,
    currency: "usd",
    recurrence: "this-year",
    creation: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "5e6f7a8b-9c0d-1234-ef12-345678901234",
    category: "shopping",
    amount: 300.0,
    currency: "usd",
    recurrence: "this-month",
    creation: "2025-04-05T11:20:00.000Z",
  },
  {
    id: "6f7a8b9c-0d1e-2345-f123-456789012345",
    category: "shopping",
    amount: 80.0,
    currency: "cad",
    recurrence: "this-week",
    creation: "2025-05-12T16:45:00.000Z",
  },
  {
    id: "7a8b9c0d-1e2f-3456-1234-567890123456",
    category: "bills-utilities",
    amount: 1500.0,
    currency: "usd",
    recurrence: "this-month",
    creation: "2025-01-01T08:00:00.000Z",
  },
  {
    id: "8b9c0d1e-2f3a-4567-2345-678901234567",
    category: "bills-utilities",
    amount: 18000.0,
    currency: "gbp",
    recurrence: "this-year",
    creation: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "9c0d1e2f-3a4b-5678-3456-789012345678",
    category: "entertainment",
    amount: 150.0,
    currency: "eur",
    recurrence: "this-month",
    creation: "2025-06-08T12:00:00.000Z",
  },
  {
    id: "0d1e2f3a-4b5c-6789-4567-890123456789",
    category: "entertainment",
    amount: 50.0,
    currency: "usd",
    recurrence: "this-week",
    creation: "2025-07-15T14:00:00.000Z",
  },
  {
    id: "1e2f3a4b-5c6d-7890-5678-901234567890",
    category: "healthcare",
    amount: 250.0,
    currency: "usd",
    recurrence: "this-month",
    creation: "2025-02-28T10:30:00.000Z",
  },
  {
    id: "2f3a4b5c-6d7e-8901-6789-012345678901",
    category: "healthcare",
    amount: 3000.0,
    currency: "gbp",
    recurrence: "this-year",
    creation: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "3a4b5c6d-7e8f-9012-7890-123456789012",
    category: "travel",
    amount: 600.0,
    currency: "eur",
    recurrence: "this-month",
    creation: "2025-08-20T09:00:00.000Z",
  },
  {
    id: "4b5c6d7e-8f9a-0123-8901-234567890123",
    category: "travel",
    amount: 5000.0,
    currency: "usd",
    recurrence: "this-year",
    creation: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "5c6d7e8f-9a0b-1234-9012-345678901234",
    category: "other",
    amount: 100.0,
    currency: "jpy",
    recurrence: "this-month",
    creation: "2025-09-10T15:20:00.000Z",
  },
  {
    id: "6d7e8f9a-0b1c-2345-0123-456789012345",
    category: "other",
    amount: 25.0,
    currency: "hkd",
    recurrence: "this-week",
    creation: "2025-11-11T14:35:15.000Z",
  },
];

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
};
