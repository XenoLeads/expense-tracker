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

function convert_to_usd(currency, amount) {
  const EXCHANGE_RATES = {
    eur: 1.159,
    gbp: 1.313,
    jpy: 0.006466,
    krw: 0.000681,
    inr: 0.01129,
    rub: 0.0123,
    try: 0.02367,
    vnd: 0.000038,
    brl: 0.1888,
    cad: 0.7142,
    aud: 0.654,
    chf: 1.254,
    hkd: 0.1287,
    nzd: 0.5661,
    sgd: 0.7684,
  };
  if (currency in EXCHANGE_RATES) return amount * EXCHANGE_RATES[currency];
  else null;
}

function sort_transactions(transactions, most_recent = true) {
  if (!transactions || transactions.length < 0) return;
  return [...transactions].sort((a, b) => {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();
    return most_recent ? timeB - timeA : timeA - timeB;
  });
}

function filter_transactions(transactions, filters, search_text = null) {
  const now = new Date();

  let filtered_transactions = transactions.filter(tx => {
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

  if ((search_text, filtered_transactions.length > 0))
    filtered_transactions = filtered_transactions.filter(transaction => transaction.description.includes(search_text));

  return filtered_transactions;
}

export default {
  capitalize,
  format_transaction_time,
  convert_to_usd,
  sort_transactions,
  filter_transactions,
};
