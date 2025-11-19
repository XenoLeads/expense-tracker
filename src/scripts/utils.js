import Transaction from "./transaction";

const CURRENCY_SYMBOLS = {
  usd: "$",
  eur: "€",
  gbp: "£",
  jpy: "¥",
  krw: "₩",
  inr: "₹",
  rub: "₽",
  try: "₺",
  vnd: "₫",
  brl: "R$",
  cad: "C$",
  aud: "A$",
  chf: "CHF",
  hkd: "HK$",
  nzd: "NZ$",
  sgd: "SG$",
};

function get_currency_symbol(abbreviation) {
  if (abbreviation in CURRENCY_SYMBOLS) return CURRENCY_SYMBOLS[abbreviation];
  return "";
}

function capitalize(string, dash_replacement_character = " ") {
  if (!string) return "";
  return string
    .split("-")
    .map(
      segment =>
        segment[0].toUpperCase() +
        segment
          .slice(1)
          .split("")
          .map(char => char.toLowerCase())
          .join("")
    )
    .join(dash_replacement_character);
}

function format_transaction_time(iso_format) {
  const now = new Date(iso_format);
  const current_hour = now.getHours();
  let current_minute = now.getMinutes();
  if (current_minute.length < 2) current_minute = "0" + current_minute;
  const [year, month, day] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
  if (isWithin12Hours(now)) {
    if (current_hour > 12) return `${current_hour - 12}:${current_minute} PM`;
    else return `${current_hour}:${current_minute} AM`;
  } else {
    return `${day}/${month}/${year}`;
  }

  function isWithin12Hours(target_time) {
    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

    const targetDate = target_time;
    return targetDate >= twelveHoursAgo && targetDate <= now;
  }
}

function convert_currency(amount, from_currency, to_currency) {
  const EXCHANGE_RATES = {
    usd: 1,
    eur: 0.8622,
    gbp: 0.7597,
    jpy: 155.07,
    krw: 1462.66,
    inr: 88.64,
    rub: 81.25,
    try: 42.34,
    vnd: 26372.0,
    brl: 5.329,
    cad: 1.4049,
    aud: 1.5418,
    chf: 0.7945,
    hkd: 7.7796,
    nzd: 1.7674,
    sgd: 1.303,
  };
  if (from_currency in EXCHANGE_RATES && to_currency in EXCHANGE_RATES) {
    const amount_in_base_currency = amount / EXCHANGE_RATES[from_currency];
    const amount_in_converted_currency = amount_in_base_currency * EXCHANGE_RATES[to_currency];
    return amount_in_converted_currency;
  }
  return null;
}

function sort_transactions(transactions, type = "time", ascending = true) {
  if (!transactions || transactions.length < 0) return;
  return [...transactions].sort((a, b) => {
    let value_a = 0;
    let value_b = 0;
    switch (type) {
      case "time":
        value_a = new Date(a.time).getTime();
        value_b = new Date(b.time).getTime();
        break;
      case "amount":
        let amount_a = a.amount;
        if (a.currency !== "usd") amount_a = convert_currency(a.amount, a.currency, "usd");
        let amount_b = b.amount;
        if (b.currency !== "usd") amount_b = convert_currency(b.amount, b.currency, "usd");
        value_a = amount_a;
        value_b = amount_b;
        break;
    }
    return ascending ? value_b - value_a : value_a - value_b;
  });
}
function sort_budgets(budgets, filters = { sort: "most-used" }) {
  if (!budgets || budgets.length < 0) return;
  const most_used = filters.sort === "most-used" ? true : false;
  return [...budgets].sort((a, b) => {
    const budget_a_remaining_percentage = (a.used / a.amount) * 100;
    const budget_b_remaining_percentage = (b.used / b.amount) * 100;
    return most_used ? budget_b_remaining_percentage - budget_a_remaining_percentage : budget_a_remaining_percentage - budget_b_remaining_percentage;
  });
}

function filter_transactions(transactions, filters, search_text = null) {
  const now = new Date();
  if (search_text) transactions = Transaction.search(search_text, transactions);
  return transactions.filter(tx => {
    const txTime = new Date(tx.time);
    let match = true;

    // --- Time Filter ---
    if (filters.time && filters.time !== "all") {
      const startOf = {
        today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        week: start_of_week(now),
        month: new Date(now.getFullYear(), now.getMonth(), 1),
        year: new Date(now.getFullYear(), 0, 1),
      };

      switch (filters.time) {
        case "today":
          match = match && txTime >= startOf.today;
          break;
        case "this-week":
          match = match && txTime >= startOf.week;
          break;
        case "this-month":
          match = match && txTime >= startOf.month;
          break;
        case "this-year":
          match = match && txTime >= startOf.year;
          break;
      }
    }

    // --- Type Filter ---
    if (filters.type && filters.type !== "all") {
      match = match && tx.type === filters.type;
    }

    // --- Category Filter ---
    if (filters.category && filters.category !== "all") {
      match = match && tx.category === filters.category;
    }

    // --- Method Filter ---
    if (filters.method && filters.method !== "all") {
      match = match && tx.method === filters.method;
    }

    // --- Currency Filter (optional) ---
    if (filters.currency && filters.currency !== "all") {
      match = match && tx.currency === filters.currency;
    }

    return match;

    function start_of_week(date) {
      const copy = new Date(date);
      const day = copy.getDay();
      const diff = copy.getDate() - day;
      return new Date(copy.getFullYear(), copy.getMonth(), diff);
    }
  });
}

function filter_budgets(budgets, filters = {}) {
  return budgets.filter(budget => (filters.time && filters.time !== "all" ? budget.recurrence === filters.time : true));
}

function set_used_budget(budgets, transactions) {
  return budgets.map(budget => {
    budget.used = 0;
    const used_budget_transactions = filter_transactions(transactions, { time: budget.recurrence, category: budget.category });

    if (used_budget_transactions.length > 0)
      budget.used = parseFloat(
        used_budget_transactions
          .reduce((accumulator, transaction) => {
            let amount = transaction.amount;
            if (transaction.currency !== budget.currency) amount = convert_currency(transaction.amount, transaction.currency, budget.currency);
            return (accumulator += amount);
          }, 0)
          .toFixed(2)
      );

    return budget;
  });
}

export default {
  capitalize,
  format_transaction_time,
  convert_currency,
  sort_transactions,
  filter_transactions,
  filter_budgets,
  sort_budgets,
  set_used_budget,
  get_currency_symbol,
};
