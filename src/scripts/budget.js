// Fake Budgets
const budgets = [
  {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    category: "food-dining",
    amount: 150.75,
    currency: "usd",
    recurrence: "this-week",
    creation: "2025-11-18T18:00:00.000Z",
  },
  {
    id: "b2c3d4e5-f678-9012-3456-7890abcdef12",
    category: "bills-utilities",
    amount: 89.99,
    currency: "eur",
    recurrence: "this-month",
    creation: "2025-11-17T15:30:10.000Z",
  },
  {
    id: "c3d4e5f6-7890-1234-5678-90abcdef1234",
    category: "travel",
    amount: 2500.0,
    currency: "cad",
    recurrence: "this-year",
    creation: "2025-11-16T10:45:25.000Z",
  },
  {
    id: "d4e5f678-9012-3456-7890-abcdef123456",
    category: "shopping",
    amount: 45.5,
    currency: "gbp",
    recurrence: "this-week",
    creation: "2025-11-15T09:12:40.000Z",
  },
  {
    id: "e5f67890-1234-5678-90ab-cdef12345678",
    category: "transportation",
    amount: 65.0,
    currency: "usd",
    recurrence: "this-month",
    creation: "2025-11-14T21:05:55.000Z",
  },
  {
    id: "f6789012-3456-7890-abcd-ef1234567890",
    category: "entertainment",
    amount: 12000,
    currency: "jpy",
    recurrence: "this-year",
    creation: "2025-11-13T12:55:00.000Z",
  },
  {
    id: "78901234-5678-90ab-cdef-1234567890ab",
    category: "healthcare",
    amount: 30.0,
    currency: "aud",
    recurrence: "this-month",
    creation: "2025-11-12T17:20:30.000Z",
  },
  {
    id: "90123456-7890-abcd-ef12-34567890abcd",
    category: "other",
    amount: 25.0,
    currency: "hkd",
    recurrence: "this-week",
    creation: "2025-11-11T14:35:15.000Z",
  },
];

function Budget(category, amount, currency, recurrence) {
  return { category, amount, currency, recurrence, creation: new Date().toISOString() };
}

function add_budget(category, amount, currency, recurrence) {
  const same_budget_does_not_exists = budgets.findIndex(budget => budget.category === category && budget.recurrence === recurrence) < 0;
  if (same_budget_does_not_exists) budgets.push(Budget(category, amount, currency, recurrence));
}

function remove_budget(id) {
  const budget = find_budget(id);
  budgets.splice(budget.index, 1);
  return budget.item;
}

function find_budget(id) {
  const budget_index = budgets.findIndex(budget => budget.id === id);
  if (budget_index < 0) return null;
  return { index: budget_index, item: Object.assign({}, budgets[budget_index]) };
}

export default {
  get: () => budgets,
  add: add_budget,
  remove: remove_budget,
};
