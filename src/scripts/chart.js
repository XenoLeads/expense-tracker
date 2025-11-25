import "chartjs-adapter-moment";
import Utils from "./utils.js";
import Chart from "chart.js/auto";

function display_chart(
  context,
  type,
  chart_obj,
  datasets,
  { legend = { display: false }, tooltip_callbacks = {}, global_labels = [], options_config = {}, plugins = {}, layout_padding = 10 } = {}
) {
  const primary_text_color = Utils.get_css_property_value(document.getElementById("container"), "primary-text-color");

  Chart.defaults.color = primary_text_color;
  Chart.defaults.font.size = Utils.get_rem(0.8);


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
      layout: { padding: layout_padding },
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

function update_chart(chart_obj = null, updated_datasets, updated_global_labels = null, { options_config = {} } = {}) {
  if (!chart_obj) return;

  updated_datasets.forEach((dataset, index) => {
    for (const property in dataset) chart_obj.chart.data.datasets[index][property] = dataset[property];
  });

  if (options_config) {
    const new_x_color = options_config?.scales?.x?.ticks?.color;
    const new_y_color = options_config?.scales?.y?.ticks?.color;
    const new_legend_color = options_config?.plugins?.legend?.labels?.color;
    if (new_x_color) chart_obj.chart.options.scales.x.ticks.color = new_x_color;
    if (new_y_color) chart_obj.chart.options.scales.y.ticks.color = new_y_color;
    if (new_legend_color) chart_obj.chart.options.plugins.legend.labels.color = new_legend_color;
  }

  if (updated_global_labels) chart_obj.chart.data.labels = updated_global_labels;
  
  Chart.defaults.font.size = Utils.get_rem(0.8);
  chart_obj.chart.update();
}

export default {
  create: display_chart,
  update: update_chart,
};
