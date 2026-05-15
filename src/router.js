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
import { AdminLoginPage, initAdminLoginPage } from "./pages/admin-login.js";
import { PlayerPage, initPlayerPage, cleanupPlayer, isPlayerActive } from "./pages/player.js";

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
  "/admin-login": AdminLoginPage,
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
  if (path === '/admin-login') {
    initAdminLoginPage();
  }

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

function showExitVideoModal(onConfirm) {
  if (document.getElementById('exit-video-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'exit-video-overlay';
  overlay.className = 'exit-video-overlay';
  overlay.innerHTML = `
    <div class="exit-video-modal">
      <div class="exit-video-modal__icon">🎬</div>
      <h3 class="exit-video-modal__title">Vídeo em andamento</h3>
      <p class="exit-video-modal__text">Seu progresso foi salvo. Deseja mesmo sair do vídeo?</p>
      <div class="exit-video-modal__actions">
        <button class="btn btn--ghost" id="exit-video-no">Não, continuar</button>
        <button class="btn btn--primary" id="exit-video-yes">Sim, sair</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('exit-video-yes').addEventListener('click', () => {
    overlay.remove();
    onConfirm();
  });

  document.getElementById('exit-video-no').addEventListener('click', () => {
    overlay.remove();
  });
}

export function initRouter() {
  let previousHash = window.location.hash || '#/home';

  window.addEventListener("hashchange", () => {
    const targetHash = window.location.hash;
    const prevPath   = previousHash.replace('#', '').split('?')[0] || '/home';

    if (prevPath === '/player' && isPlayerActive()) {
      // Restaura a URL sem disparar novo hashchange
      history.replaceState(null, '', previousHash);

      showExitVideoModal(() => {
        previousHash = targetHash;
        window.location.hash = targetHash;
      });
      return;
    }

    previousHash = targetHash;
    render();
  });

  render();
}