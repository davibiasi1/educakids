import "./src/style.css";
import "./src/admin-player-styles.css";
import { startApp } from "./src/app.js";

startApp();
registerSW();
setupInstallPrompt();

// ── Service Worker ─────────────────────────────────────
function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
}

// ── Banner de instalação ───────────────────────────────
function setupInstallPrompt() {
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner(() => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
        removeInstallBanner();
      });
    });
  });

  window.addEventListener('appinstalled', () => {
    removeInstallBanner();
    deferredPrompt = null;
  });
}

function showInstallBanner(onInstall) {
  if (document.getElementById('pwa-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'pwa-banner';
  banner.innerHTML = `
    <div class="pwa-banner__icon">📱</div>
    <div class="pwa-banner__text">
      <strong>Instalar EducaKids</strong>
      <span>Adicione à tela inicial</span>
    </div>
    <button class="pwa-banner__btn" id="pwa-install-btn">Instalar</button>
    <button class="pwa-banner__close" id="pwa-close-btn" aria-label="Fechar">✕</button>
  `;
  document.body.appendChild(banner);

  document.getElementById('pwa-install-btn').addEventListener('click', onInstall);
  document.getElementById('pwa-close-btn').addEventListener('click', removeInstallBanner);
}

function removeInstallBanner() {
  document.getElementById('pwa-banner')?.remove();
}
