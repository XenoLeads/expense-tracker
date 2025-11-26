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
  const primary_text_color = get_primary_text_color();

  Chart.defaults.color = primary_text_color;
  Chart.defaults.font.size = Utils.get_rem(0.8);

  if (chart_obj.chart) {
    chart_obj.chart.destroy();
    chart_obj.chart = null;
  }

  set_label_color({ options_config, color: primary_text_color });

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

  if (updated_global_labels) chart_obj.chart.data.labels = updated_global_labels;

  Chart.defaults.font.size = Utils.get_rem(0.8);
  const primary_text_color = get_primary_text_color();
  Chart.defaults.color = primary_text_color;
  set_label_color({ chart: chart_obj.chart, color: primary_text_color });

  chart_obj.chart.update();
}

function get_primary_text_color() {
  return Utils.get_css_property_value(document.getElementById("container"), "primary-text-color");
}

function set_label_color({ options_config = "", color = "#FFFFFF", chart = null }) {
  if (chart) set_color(chart.options, color);
  if (options_config) set_color(options_config, color);

  function set_color(object, color) {
    object.scales ??= {};
    object.scales.x ??= {};
    object.scales.y ??= {};

    object.scales.x.ticks ??= {};
    object.scales.y.ticks ??= {};

    object.scales.x.ticks.color = color;
    object.scales.y.ticks.color = color;
  }
}

export default {
  create: display_chart,
  update: update_chart,
};
