import Icon from "./icon";

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
  if (isWithin12Hours(iso_format)) {
    const [hour, minute] = iso_format.split("T")[1].split(":");
    if (parseInt(hour) > 12) return `${parseInt(hour) - 12}:${minute} PM`;
    else return `${parseInt(hour)}:${minute} AM`;
  } else {
    const [year, month, day] = iso_format.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  }

  function isWithin12Hours(targetTime) {
    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

    const targetDate = new Date(targetTime);

    return targetDate >= twelveHoursAgo && targetDate <= now;
  }
}

async function get_transaction_card(transaction) {
  const icon_url = await Icon.get(transaction.type, transaction.category);
  return `
          <div class="transaction-card ${transaction.type}" data-id="${transaction.id}">
              <div class="transaction-icon-category-method-time-container">
                <div class="icon transaction-icon">
                  <img src="${icon_url}" alt="" />
                </div>
                <div class="transaction-category-method-time-container">
                  <p class="transaction-category">${
                    transaction.category === "default" ? capitalize(transaction.type) : capitalize(transaction.category)
                  }</p>
                  <div class="transaction-method-time-container">
                    <p class="transaction-method">${capitalize(transaction.method)}</p>
                    <p>-</p>
                    <p class="transaction-time">${format_transaction_time(transaction.time)}</p>
                  </div>
                </div>
              </div>
              <p class="transaction-amount">${transaction.type === "income" ? "+" : "-"}${CURRENCY_SYMBOLS[transaction.currency]}${parseFloat(
    transaction.amount
  )}</p>
            </div>
      `;
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
  return [...transactions].sort((a, b) => {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();
    return most_recent ? timeB - timeA : timeA - timeB;
  });
}

export default {
  capitalize,
  format_transaction_time,
  get_transaction_card,
  convert_to_usd,
  sort_transactions,
};
