// Fake Data
const transactions = [
  {
    type: "expense",
    currency: "usd",
    amount: "18.50",
    description: "Lunch at cafe",
    method: "card",
    category: "food-dining",
    time: "2025-11-12T19:05:00Z",
    id: "7f12a3c1-4b1a-4a97-bf1b-b9b33d9e6ab1",
  },
  {
    type: "expense",
    currency: "eur",
    amount: "45.00",
    description: "Train ticket",
    method: "cash",
    category: "transportation",
    time: "2025-11-10T09:42:00Z",
    id: "6a8f0e7b-2a3d-49c2-a78e-019f97a1cb82",
  },
  {
    type: "expense",
    currency: "gbp",
    amount: "120.99",
    description: "New headphones",
    method: "card",
    category: "shopping",
    time: "2025-11-05T15:15:00Z",
    id: "64db25a9-02ff-4d29-9ef4-c96447b3af5f",
  },
  {
    type: "expense",
    currency: "inr",
    amount: "950.00",
    description: "Electric bill",
    method: "bank-transfer",
    category: "bills-utilities",
    time: "2025-10-28T18:45:00Z",
    id: "d9f7b9c3-9b87-4d87-aadc-91d4c5a9b78e",
  },
  {
    type: "expense",
    currency: "usd",
    amount: "60.25",
    description: "Weekend movie & snacks",
    method: "card",
    category: "entertainment",
    time: "2025-11-09T20:10:00Z",
    id: "be7e5d48-8291-4892-9b0b-2d71df3d0b19",
  },
  {
    type: "income",
    currency: "usd",
    amount: "1200.00",
    description: "Monthly salary",
    method: "bank-transfer",
    category: "salary",
    time: "2025-11-01T08:00:00Z",
    id: "62e7e12c-6a2e-4ff1-bc64-0b2e9fd83b21",
  },
  {
    type: "income",
    currency: "eur",
    amount: "220.50",
    description: "Freelance project",
    method: "bank-transfer",
    category: "freelance",
    time: "2025-10-15T10:30:00Z",
    id: "7bd57d0d-9b24-4a6e-8b59-8495c51a1a0b",
  },
  {
    type: "income",
    currency: "usd",
    amount: "75.00",
    description: "Dividends",
    method: "bank-transfer",
    category: "investments",
    time: "2025-09-20T14:10:00Z",
    id: "cb53b3d3-8ac0-43a3-9944-65a8b38ed723",
  },
  {
    type: "expense",
    currency: "usd",
    amount: "300.00",
    description: "Flight ticket",
    method: "card",
    category: "travel",
    time: "2025-11-02T11:30:00Z",
    id: "c3af09b5-f4e3-4dc3-b510-fecde1d83699",
  },
  {
    type: "income",
    currency: "usd",
    amount: "500.00",
    description: "Stock profit",
    method: "other",
    category: "investments",
    time: "2025-11-12T12:00:00Z",
    id: "b148bd79-cb85-4a13-933e-64e48e4f418f",
  },
];

function Transaction(type, currency, amount, description, method, category, time) {
  return { type, currency, amount, description, method, category, time, id: crypto.randomUUID() };
}

function add_transaction(type, currency, amount, description, method, category, time) {
  transactions.push(Transaction(type, currency, amount, description, method, category, time));
}

export default {
  get: () => transactions,
  add: add_transaction,
};
