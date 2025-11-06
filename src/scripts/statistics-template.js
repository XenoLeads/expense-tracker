const desktop_quick_view_actions_sidebar = document.getElementsByClassName("desktop-quick-view-actions-sidebar")[0];

function get_statistics_template() {
  return `
        <button class="button export-statistics-button">Export</button>
        <div class="card statistics-time-filter-container">
          <div class="statistics-time-filters">
            <button class="button statistics-time-filter statistics-time-filter-all-time selected">All Time</button>
            <button class="button statistics-time-filter statistics-time-filter-today">Today</button>
            <button class="button statistics-time-filter statistics-time-filter-this-week">This Week</button>
            <button class="button statistics-time-filter statistics-time-filter-this-month">This Month</button>
            <button class="button statistics-time-filter statistics-time-filter-this-year">This Year</button>
          </div>
        </div>
        <div class="statistics-line-pie-chart-container">
          <div class="card statistics-chart statistics-line-chart"></div>
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
}

export default {
  name: "statistics",
  get: get_statistics_template,
  init: init_statistics_template,
};
