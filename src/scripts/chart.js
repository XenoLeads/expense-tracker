import Chart from "chart.js/auto";

function display_chart(context, type, chart_obj, datasets, tooltip_callbacks = {}) {
  const primary_text_color = getComputedStyle(document.documentElement).getPropertyValue("--primary-text-color");

  Chart.defaults.color = primary_text_color;

  if (chart_obj.chart) {
    chart_obj.chart.destroy();
    chart_obj.chart = null;
  }

  chart_obj.chart = new Chart(context, {
    type,
    data: {
      labels: [],
      datasets,
    },
    options: {
      responsive: true,
      radius: "80%",
      layout: {
        padding: 10,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          cornerRadius: 8,
          displayColors: true,
          callbacks: tooltip_callbacks,
        },
      },
    },
  });
}

function update_chart({ chart }, updated_datasets) {
  if (!chart) return;
  updated_datasets.forEach((dataset, index) => {
    for (const property in dataset) chart.data.datasets[index][property] = dataset[property];
  });

  chart.update();
}

export default {
  create: display_chart,
  update: update_chart,
};
