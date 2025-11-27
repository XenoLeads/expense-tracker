import Tracker from "./tracker.js";
import CSV from "./csv.js";
import Utils from "./utils.js";
import Chart from "./chart.js";
import Transaction from "./transaction.js";

const desktop_quick_view_actions_sidebar = document.getElementsByClassName("desktop-quick-view-actions-sidebar")[0];
const container = document.getElementById("container");

const line_chart = {
  chart: null,
};

const bar_chart = {
  chart: null,
};

const horizontal_bar_chart = {
  chart: null,
};

let time_filter = "all";

function get_statistics_template() {
  return `
        <button class="button export-statistics-button">Export</button>
        <div class="card statistics-time-filter-container">
          <div class="statistics-time-filters">
            <button class="button statistics-time-filter statistics-time-filter-all-time" data-type="time" data-value="all">All Time</button>
            <button class="button statistics-time-filter statistics-time-filter-this-week" data-type="time" data-value="this-week">This Week</button>
            <button class="button statistics-time-filter statistics-time-filter-this-month" data-type="time" data-value="this-month">This Month</button>
            <button class="button statistics-time-filter statistics-time-filter-this-year" data-type="time" data-value="this-year">This Year</button>
          </div>
        </div>
        <div class="statistics-line-horizontal-bar-chart-container">
          <div class="statistics-chart-container statistics-line-chart-container">
            <canvas class="card statistics-chart statistics-line-chart"></canvas>
          </div>
          <div class="statistics-chart statistics-horizontal-bar-chart-container">
            <canvas class="card statistics-chart statistics-horizontal-bar-chart"></canvas>
          </div>
        </div>
        <div class="statistics-chart-container statistics-bar-chart-container">
          <canvas class="card statistics-chart statistics-bar-chart"></canvas>
        </div>
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
                <button class="button statistics-time-filter statistics-time-filter-all-time" data-type="time" data-value="all">All Time</button>
                <button class="button statistics-time-filter statistics-time-filter-this-week" data-type="time" data-value="this-week">This Week</button>
                <button class="button statistics-time-filter statistics-time-filter-this-month" data-type="time" data-value="this-month">This Month</button>
                <button class="button statistics-time-filter statistics-time-filter-this-year" data-type="time" data-value="this-year">This Year</button>
              </div>
            </div>
          </div>
  `;

  init_filters();

  const export_statistics_button = document.getElementsByClassName("export-statistics-button")[0];
  export_statistics_button.addEventListener("click", () => {
    const transactions = Utils.filter_transactions(Transaction.get(), { time: time_filter });
    if (transactions.length < 1) console.error(new Error("No Transactions Available."));
    else CSV.export(transactions);
  });

  display_line_chart();
  display_bar_chart();
  display_horizontal_bar_chart();
}

function init_filters() {
  const filter_elemets = [...document.getElementsByClassName("statistics-time-filter")];
  
  filter_elemets.forEach(filter => {
    const filter_value = filter.dataset.value;
    if (filter_value === time_filter) filter.classList.add("selected");
  });

  filter_elemets.forEach(filter => {
    filter.addEventListener("click", () => {
      if (filter.classList.contains("selected")) return;
      filter_elemets.forEach(filter => filter.classList.remove("selected"));
      filter.classList.add("selected");
      const filter_value = filter.dataset.value;
      time_filter = filter_value;
      refresh();
    });
  });
}

function display_line_chart(transactions = Transaction.get()) {
  const line_chart_border_color = getComputedStyle(container).getPropertyValue("--bar-chart-border-color");
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
        backgroundColor: "#5ab4d2",
        borderColor: line_chart_border_color,
        borderWidth: 3,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointHitRadius: 20,
        tension: 0.2,
      },
    ],
    {
      layout_padding: {
        top: 40,
      },
      tooltip_callbacks: {
        title(context) {
          const date = new Date(context[0].parsed.x);
          return format_time_label(date, true);
        },
        label(context) {
          const label = context.dataset.label;
          const value = context.raw.y;
          const formatted_value = Utils.format_currency(value);
          return `${label}: ${formatted_value}`;
        },
      },
      options_config: {
        maintainAspectRatio: false,
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
              callback: time => format_time_label(time),
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
  const line_chart_border_color = Utils.get_css_property_value(container, "bar-chart-border-color");
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
      borderColor: line_chart_border_color,
    },
  ]);
}

function format_time_label(time, is_title = false) {
  const TIME_FILTERS = {
    "all": {
      year: "numeric",
    },
    "this-week": {
      weekday: "short",
    },
    "this-month": {
      day: "2-digit",
    },
    "this-year": {
      month: "short",
      day: "2-digit",
    },
  };

  if (is_title) {
    delete TIME_FILTERS.all.year;
    TIME_FILTERS["this-week"].weekday = "long";
    TIME_FILTERS["this-month"].weekday = "long";
    TIME_FILTERS["this-year"].month = "long";
  }
  return new Date(time).toLocaleDateString(undefined, TIME_FILTERS[time_filter]);
}

function display_bar_chart(transactions = Transaction.get()) {
  const chart_canvas = document.getElementsByClassName("statistics-bar-chart")[0];
  const chart_ctx = chart_canvas.getContext("2d");
  const grouped_transactions = Utils.group_transactions(transactions, time_filter);
  const sorted_transactions = grouped_transactions.sort((a, b) => new Date(a.x) - new Date(b.x));
  let income_over_time = 0;
  let expense_over_time = 0;
  const income_points = [];
  const expense_points = [];
  for (let index = 0; index < sorted_transactions.length; index++) {
    const transaction = sorted_transactions[index];
    income_over_time += Math.round(transaction.income);
    expense_over_time += Math.round(transaction.expense);
    income_points.push({ x: transaction.x, y: income_over_time });
    expense_points.push({ x: transaction.x, y: expense_over_time });
  }

  Chart.create(
    chart_ctx,
    "bar",
    bar_chart,
    [
      {
        label: " Income",
        data: income_points,
        backgroundColor: "rgba(46, 255, 46, 0.8)",
        borderColor: "rgba(46, 255, 46, 1)",
        borderWidth: 2,
      },
      {
        label: " Expense",
        data: expense_points,
        backgroundColor: "rgba(255, 46, 46, 0.8)",
        borderColor: "rgba(255, 46, 46, 1)",
        borderWidth: 2,
      },
    ],
    {
      layout_padding: {
        top: 40,
      },
      legend: {
        display: true,
        position: "bottom",
      },
      tooltip_callbacks: {
        title(context) {
          const date = new Date(context[0].parsed.x);
          return format_time_label(date, true);
        },
        label(context) {
          const label = context.dataset.label;
          const value = context.raw.y;
          const formatted_value = Utils.format_currency(value);
          return `${label}: ${formatted_value}`;
        },
      },
      options_config: {
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: false,
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
              callback: time => format_time_label(time),
            },
          },
          y: {
            stacked: false,
            beginAtZero: true,
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

function update_bar_chart(transactions = Transaction.get()) {
  const filtered_transactions = Utils.filter_transactions(transactions, { time: time_filter });
  const grouped_transactions = Utils.group_transactions(filtered_transactions, time_filter);
  const sorted_transactions = grouped_transactions.sort((a, b) => new Date(a.x) - new Date(b.x));
  let income_over_time = 0;
  let expense_over_time = 0;
  const income_points = [];
  const expense_points = [];
  for (let index = 0; index < sorted_transactions.length; index++) {
    const transaction = sorted_transactions[index];
    income_over_time += Math.round(transaction.income);
    expense_over_time += Math.round(transaction.expense);
    income_points.push({ x: transaction.x, y: income_over_time });
    expense_points.push({ x: transaction.x, y: expense_over_time });
  }

  Chart.update(bar_chart, [
    {
      data: income_points,
    },
    {
      data: expense_points,
    },
  ]);
}

function display_horizontal_bar_chart(tracker = Tracker.recalculate(Utils.filter_transactions(Transaction.get(), { time: time_filter }))) {
  const chart_border_color = getComputedStyle(container).getPropertyValue("--chart-border-color");
  const chart_canvas = document.getElementsByClassName("statistics-horizontal-bar-chart")[0];
  const chart_ctx = chart_canvas.getContext("2d");
  const labels = [];
  const values = [];

  for (const property in tracker) {
    labels.push(Utils.capitalize(property));
    values.push(tracker[property]);
  }

  Chart.create(
    chart_ctx,
    "bar",
    horizontal_bar_chart,
    [
      {
        label: "",
        data: values,
        backgroundColor: ["#E7E7E7", "rgba(46, 255, 46, 0.8)", "rgba(255, 46, 46, 0.8)"],
        borderColor: chart_border_color,
        borderWidth: 2,
      },
    ],
    {
      tooltip_callbacks: {
        label(context) {
          return " " + Utils.format_currency(context.raw);
        },
      },
      global_labels: labels,
      options_config: {
        maintainAspectRatio: false,
        indexAxis: "y",
        startAtZero: true,
        scales: {
          x: {
            ticks: {
              callback(context) {
                return Utils.format_currency(context);
              },
            },
          },
        },
      },
    }
  );
}

function update_horizontal_bar_chart(tracker = Tracker.recalculate(Utils.filter_transactions(Transaction.get(), { time: time_filter }))) {
  const chart_border_color = getComputedStyle(container).getPropertyValue("--chart-border-color");
  const values = [];

  for (const property in tracker) values.push(tracker[property]);

  Chart.update(horizontal_bar_chart, [
    {
      data: values,
      borderColor: chart_border_color,
    },
  ]);
}

function refresh() {
  update_line_chart();
  update_bar_chart();
  update_horizontal_bar_chart();
}

export default {
  name: "statistics",
  get: get_statistics_template,
  refresh,
  init: init_statistics_template,
};
