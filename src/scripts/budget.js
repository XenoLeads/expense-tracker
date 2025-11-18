// Fake Budgets
const budgets = [
  {
    category: "food-dining",
    amount: 150.75,
    currency: "usd",
    recurrence: "weekly",
    creation: "2025-11-18T18:00:00.000Z",
  },
  {
    category: "bills-utilities",
    amount: 89.99,
    currency: "eur",
    recurrence: "monthly",
    creation: "2025-11-17T15:30:10.000Z",
  },
  {
    category: "travel",
    amount: 2500.0,
    currency: "cad",
    recurrence: "yearly",
    creation: "2025-11-16T10:45:25.000Z",
  },
  {
    category: "shopping",
    amount: 45.5,
    currency: "gbp",
    recurrence: "weekly",
    creation: "2025-11-15T09:12:40.000Z",
  },
  {
    category: "transportation",
    amount: 65.0,
    currency: "usd",
    recurrence: "monthly",
    creation: "2025-11-14T21:05:55.000Z",
  },
  {
    category: "entertainment",
    amount: 12000,
    currency: "jpy",
    recurrence: "yearly",
    creation: "2025-11-13T12:55:00.000Z",
  },
  {
    category: "healthcare",
    amount: 30.0,
    currency: "aud",
    recurrence: "monthly",
    creation: "2025-11-12T17:20:30.000Z",
  },
  {
    category: "other",
    amount: 25.0,
    currency: "hkd",
    recurrence: "weekly",
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

export default {
  get: () => budgets,
  add: add_budget,
};
