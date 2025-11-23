import Utils from "./utils.js";
import Chart from "./chart.js";
import Transaction from "./transaction.js";

const desktop_quick_view_actions_sidebar = document.getElementsByClassName("desktop-quick-view-actions-sidebar")[0];

const line_chart = {
  chart: null,
};

let time_filter = "all";

function get_statistics_template() {
  return `
        <button class="button export-statistics-button">Export</button>
        <div class="card statistics-time-filter-container">
          <div class="statistics-time-filters">
            <button class="button statistics-time-filter statistics-time-filter-all-time selected" data-type="time" data-value="all">All Time</button>
            <button class="button statistics-time-filter statistics-time-filter-this-week" data-type="time" data-value="this-week">This Week</button>
            <button class="button statistics-time-filter statistics-time-filter-this-month" data-type="time" data-value="this-month">This Month</button>
            <button class="button statistics-time-filter statistics-time-filter-this-year" data-type="time" data-value="this-year">This Year</button>
          </div>
        </div>
        <div class="statistics-line-pie-chart-container">
          <canvas class="card statistics-chart statistics-line-chart"></canvas>
          <div class="card statistics-chart statistics-pie-chart"></div>
        </div>
        <div class="card statistics-chart statistics-bar-chart"></div>
  `;
}

function init_statistics_template() {
  desktop_quick_view_actions_sidebar.innerHTML = `
          <div class="deskto-statistics-quick-view-actions-container">
            <button class="button desktop-export-statistics-button">Export</button>
            <div class="card statistics-time-filter-container">
              <h2 class="statistics-time-filter-heading">Time</h2>
              <div class="separator"></div>
              <div class="statistics-time-filters">
                <button class="button statistics-time-filter statistics-time-filter-all-time selected">All Time</button>
                <button class="button statistics-time-filter statistics-time-filter-today">Today</button>
                <button class="button statistics-time-filter statistics-time-filter-this-week">This Week</button>
                <button class="button statistics-time-filter statistics-time-filter-this-month">This Month</button>
                <button class="button statistics-time-filter statistics-time-filter-this-year">This Year</button>
              </div>
            </div>
          </div>
  `;

  const statistics_time_filter = [...document.getElementsByClassName("statistics-time-filter")];
  statistics_time_filter.map(filter => {
    filter.addEventListener("click", () => {
      if (filter.classList.contains("selected")) return;
      statistics_time_filter.map(filter => filter.classList.remove("selected"));
      filter.classList.add("selected");
      const filter_value = filter.dataset.value;
      time_filter = filter_value;
      update_line_chart();
    });
  });

  display_line_chart();
}

function display_line_chart(transactions = Transaction.get()) {
  const statistics_line_chart = document.getElementsByClassName("statistics-line-chart")[0];
  const statistics_line_chart_ctx = statistics_line_chart.getContext("2d");
  const filtered_transactions = Utils.filter_transactions(transactions, { time: time_filter });
  const sorted_transactions = Utils.sort_transactions(filtered_transactions, undefined, false);
  let balance_over_time = 0;
  const points = [];
  for (let index = 0; index < sorted_transactions.length; index++) {
    const transaction = sorted_transactions[index];
    let amount = transaction.amount;
    if (transaction.currency !== "usd") amount = Utils.convert_currency(transaction.amount, transaction.currency, "usd");
    amount = Math.round(amount);
    if (transaction.type === "income") balance_over_time += amount;
    else balance_over_time -= amount;
    points.push({ x: transaction.time, y: balance_over_time });
  }

  Chart.create(
    statistics_line_chart_ctx,
    "line",
    line_chart,
    [
      {
        label: " Balance",
        data: points,
        borderWidth: 3,
        pointRadius: 2,
        tension: 0.2,
      },
    ],
    {
      tooltip_callbacks: {
        title(context) {
          const date = new Date(context[0].parsed.x);
          return format_time_label(date);
        },
        label(context) {
          const label = context.dataset.label;
          const value = context.raw.y;
          const formatted_value = Utils.format_currency(value);
          return `${label}: ${formatted_value}`;
        },
      },
      options_config: {
        scales: {
          x: {
            type: "time",
            time: {
              displayFormats: {
                day: "MMM d",
                month: "MMM yyyy",
              },
            },
            unit: "day",
            ticks: {
              maxTicksLimit: 5,
              callback: format_time_label,
            },
          },
          y: {
            beginAtZero: false,
            ticks: {
              callback(value) {
                const num = Number(value);
                return num < 0 ? "-$" + Math.abs(num).toLocaleString() : "$" + num.toLocaleString();
              },
            },
          },
        },
      },
    }
  );
}

function update_line_chart(transactions = Transaction.get()) {
  const filtered_transactions = Utils.filter_transactions(transactions, { time: time_filter });
  const sorted_transactions = Utils.sort_transactions(filtered_transactions, undefined, false);
  let balance_over_time = 0;
  const points = [];
  for (let index = 0; index < sorted_transactions.length; index++) {
    const transaction = sorted_transactions[index];
    let amount = transaction.amount;
    if (transaction.currency !== "usd") amount = Utils.convert_currency(transaction.amount, transaction.currency, "usd");
    amount = Math.round(amount);
    if (transaction.type === "income") balance_over_time += amount;
    else balance_over_time -= amount;
    points.push({ x: transaction.time, y: balance_over_time });
  }

  Chart.update(line_chart, [
    {
      data: points,
    },
  ]);
}

function format_time_label(time) {
  const TIME_FILTERS = {
    "all": {
      month: "short",
      day: "numeric",
      year: "2-digit",
    },
    "this-week": {
      month: "short",
      day: "numeric",
    },
    "this-month": {
      month: "short",
      day: "numeric",
    },
    "this-year": {
      month: "short",
      day: "numeric",
    },
  };

  return new Date(time).toLocaleDateString(undefined, TIME_FILTERS[time_filter]);
}

function refresh() {
  update_line_chart();
}

export default {
  name: "statistics",
  get: get_statistics_template,
  refresh,
  init: init_statistics_template,
};
