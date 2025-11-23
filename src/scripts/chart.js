import "chartjs-adapter-moment";
import Chart from "chart.js/auto";

function display_chart(
  context,
  type,
  chart_obj,
  datasets,
  { legend = { display: false }, tooltip_callbacks = {}, global_labels = [], options_config = {}, plugins = {} }
) {
  const primary_text_color = getComputedStyle(document.documentElement).getPropertyValue("--primary-text-color");

  Chart.defaults.color = primary_text_color;

  if (chart_obj.chart) {
    chart_obj.chart.destroy();
    chart_obj.chart = null;
  }

  chart_obj.chart = new Chart(context, {
    type,
    data: {
      labels: global_labels,
      datasets,
    },
    options: {
      ...options_config,
      responsive: true,
      radius: "80%",
      layout: {
        padding: 10,
      },
      plugins: {
        ...plugins,
        legend,
        tooltip: {
          cornerRadius: 8,
          displayColors: true,
          callbacks: tooltip_callbacks,
        },
      },
    },
  });
}

function update_chart(chart_obj = null, updated_datasets, updated_global_labels = null) {
  if (!chart_obj) return;

  updated_datasets.forEach((dataset, index) => {
    for (const property in dataset) chart_obj.chart.data.datasets[index][property] = dataset[property];
  });

  if (updated_global_labels) chart_obj.chart.data.labels = updated_global_labels;

  chart_obj.chart.update();
}

export default {
  create: display_chart,
  update: update_chart,
};
