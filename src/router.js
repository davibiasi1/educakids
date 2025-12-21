import { HomePage } from "./pages/home.js";
import { VideosPage } from "./pages/videos.js";
import { RecompensasPage } from "./pages/recompensas.js";
import { ProgressoPage } from "./pages/progresso.js";

const routes = {
  "/home": HomePage,
  "/videos": VideosPage,
  "/recompensas": RecompensasPage,
  "/progresso": ProgressoPage,
};

function getRoute() {
  const hash = window.location.hash || "#/home";
  const [path, queryString] = hash.replace("#", "").split("?");
  const params = Object.fromEntries(new URLSearchParams(queryString || ""));
  return { path, params };
}

function render() {
  const view = document.querySelector("#view");
  const { path, params } = getRoute();

  const page = routes[path] || HomePage;
  view.innerHTML = page(params);
}

export function initRouter() {
  window.addEventListener("hashchange", render);
  render();
}
