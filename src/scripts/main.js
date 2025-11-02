import "../styles/style.css";
import dashboard from "./dashboard-template.js";

const main = document.getElementsByClassName("main")[0];
main.innerHTML = dashboard.get();
