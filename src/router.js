import { HomePage } from "./pages/home.js";
import { VideosPage, initVideosPage } from "./pages/videos.js";
import { RecompensasPage, initRecompensasPage } from "./pages/recompensas.js";
import { ProgressoPage, initProgressoPage } from "./pages/progresso.js";
import { LoginPage } from "./pages/login.js";
import { CadastroPage } from "./pages/cadastro.js";
import { updateLayout } from "./components/layout.js";
import { SobrePage } from "./pages/sobre.js";
import { PerfilPage, initPerfilPage } from "./pages/perfil.js";
import { AdminVideosPage, initAdminVideosPage } from "./pages/admin-videos.js";
import { PlayerPage, initPlayerPage, cleanupPlayer } from "./pages/player.js";

const routes = {
  "/home": HomePage,
  "/videos": VideosPage,
  "/trilhas": VideosPage,
  "/recompensas": RecompensasPage,
  "/progresso": ProgressoPage,
  "/login": LoginPage,
  "/cadastro": CadastroPage,
  "/sobre": SobrePage,
  "/perfil": PerfilPage,
  "/admin-videos": AdminVideosPage,
  "/player": PlayerPage,
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

  // Cleanup do player ao sair
  cleanupPlayer();

  const page = routes[path] || HomePage;
  view.innerHTML = page(params);
  
  // Atualizar layout sempre que mudar de página
  updateLayout();
  
  // Inicializar página admin se for a rota correta
  if (path === '/admin-videos') {
    initAdminVideosPage();
  }
  
  // Inicializar player se for a rota correta
  if (path === '/player') {
    initPlayerPage(params);
  }
  
  // Inicializar página de vídeos se for a rota correta
  if (path === '/videos' || path === '/trilhas') {
    initVideosPage();
  }
  
  // Inicializar página de perfil se for a rota correta
  if (path === '/perfil') {
    initPerfilPage();
  }
  
  // Inicializar página de recompensas se for a rota correta
  if (path === '/recompensas') {
    initRecompensasPage();
  }
  
  // Inicializar página de progresso se for a rota correta
  if (path === '/progresso') {
    initProgressoPage();
  }
}

export function initRouter() {
  window.addEventListener("hashchange", render);
  render();
}