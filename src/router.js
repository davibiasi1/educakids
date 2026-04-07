import { HomePage } from "./pages/home.js";
import { VideosPage } from "./pages/videos.js";
import { RecompensasPage } from "./pages/recompensas.js";
import { ProgressoPage } from "./pages/progresso.js";
import { LoginPage } from "./pages/login.js";
import { CadastroPage } from "./pages/cadastro.js";
import { updateLayout } from "./components/layout.js";

const routes = {
  "/home": HomePage,
  "/videos": VideosPage,
  "/recompensas": RecompensasPage,
  "/progresso": ProgressoPage,
  "/login": LoginPage,
  "/cadastro": CadastroPage,
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
  
  // Atualizar layout sempre que mudar de página
  updateLayout();
}

export function initRouter() {
  window.addEventListener("hashchange", render);
  render();
}