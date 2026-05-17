import { auth, api, adminAuth } from '../services/api.js';

function getCurrentPath() {
  return window.location.hash.replace('#', '').split('?')[0] || '/';
}

function getNavLinks(isLoggedIn = auth.isAuthenticated()) {
  const p = getCurrentPath();
  const active = (path) => p === path ? 'navlink--active' : '';
  return `
    <a class="navlink ${active('/home')}" href="#/home">Início</a>
    ${isLoggedIn ? `
      <a class="navlink ${active('/videos')}"      href="#/videos">Vídeos</a>
      <a class="navlink ${active('/recompensas')}" href="#/recompensas">Recompensas</a>
      <a class="navlink ${active('/progresso')}"   href="#/progresso">Progresso</a>
    ` : ''}
    <a class="navlink ${active('/sobre')}" href="#/sobre">Sobre</a>
    ${adminAuth.isAuthenticated() ? `
      <a class="navlink ${active('/admin-videos')}" href="#/admin-videos">Admin</a>
    ` : ''}
  `;
}

function getMobileNavHTML(isLoggedIn, user) {
  const isAdminLoggedIn = adminAuth.isAuthenticated();
  return `
    <nav class="mobile-nav__links">
      ${getNavLinks(isLoggedIn)}
    </nav>
    <div class="mobile-nav__footer">
      ${isLoggedIn ? `
        <a class="mobile-nav__link mobile-nav__link--profile" href="#/perfil">☺ Perfil</a>
        <a class="mobile-nav__link mobile-nav__link--logout" href="#" id="mobile-logout-btn">Sair</a>
      ` : isAdminLoggedIn ? `
        <a class="mobile-nav__link mobile-nav__link--logout" href="#" id="mobile-admin-logout-btn">Sair (Admin)</a>
      ` : `
        <a class="mobile-nav__link" href="#/login">Login</a>
      `}
    </div>
  `;
}

function getTopbarRight(isLoggedIn, user) {
  return `
    ${isLoggedIn && user && user.name ? `<span class="user-name">${user.name}</span>` : ''}
    ${isLoggedIn ? `
      <div class="chip chip--gold">
        <span class="chip__icon">★</span>
        <span class="chip__value" id="starsValue">0</span>
      </div>
      <div class="chip chip--purple">
        <span class="chip__icon">🏆</span>
        <span class="chip__value" id="trophyValue">0</span>
      </div>
      <a class="avatar" href="#/perfil" aria-label="Perfil" title="${user ? user.name : 'Perfil'}">
        <span class="avatar__icon">☺</span>
      </a>
      <a class="logout-btn" href="#" id="logout-btn">Sair</a>
    ` : adminAuth.isAuthenticated()
      ? `<a class="logout-btn" href="#" id="admin-logout-btn">Sair (Admin)</a>`
      : `<a class="logout-btn" href="#/login">Login</a>`}
    <button class="hamburger" id="hamburger-btn" aria-label="Abrir menu">
      <span class="hamburger__line"></span>
      <span class="hamburger__line"></span>
      <span class="hamburger__line"></span>
    </button>
  `;
}

function setupLogoutButton() {
  setTimeout(() => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
        window.location.hash = '#/login';
      });
    }
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    if (adminLogoutBtn) {
      adminLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        adminAuth.logout();
        window.location.hash = '#/admin-login';
      });
    }
  }, 0);
}

let _hamburgerGlobalReady = false;

function attachHamburgerBtn() {
  const btn = document.getElementById('hamburger-btn');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav || btn.dataset.listenerReady) return;
  btn.dataset.listenerReady = 'true';
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('open');
    nav.classList.toggle('open');
  });
}

function setupHamburger() {
  // Vincula o botão sincronamente se o DOM já tiver o elemento,
  // caso contrário adia para o próximo tick (renderLayout ainda não inseriu o HTML)
  if (document.getElementById('hamburger-btn')) {
    attachHamburgerBtn();
  } else {
    setTimeout(attachHamburgerBtn, 0);
  }

  if (_hamburgerGlobalReady) return;
  _hamburgerGlobalReady = true;

  document.addEventListener('click', (e) => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav   = document.getElementById('mobile-nav');
    if (!hamburgerBtn?.contains(e.target) && !mobileNav?.contains(e.target)) {
      hamburgerBtn?.classList.remove('open');
      mobileNav?.classList.remove('open');
    }
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('#mobile-nav a');
    if (!link) return;
    if (link.id === 'mobile-logout-btn') {
      e.preventDefault();
      auth.logout();
      window.location.hash = '#/login';
    }
    if (link.id === 'mobile-admin-logout-btn') {
      e.preventDefault();
      adminAuth.logout();
      window.location.hash = '#/admin-login';
    }
    document.getElementById('hamburger-btn')?.classList.remove('open');
    document.getElementById('mobile-nav')?.classList.remove('open');
  });

  window.addEventListener('hashchange', () => {
    document.getElementById('hamburger-btn')?.classList.remove('open');
    document.getElementById('mobile-nav')?.classList.remove('open');
  });
}

function updateMobileNav() {
  const nav = document.getElementById('mobile-nav');
  if (!nav) return;
  const isLoggedIn = auth.isAuthenticated();
  const user = auth.getUser();
  nav.innerHTML = getMobileNavHTML(isLoggedIn, user);
}

export function renderLayout() {
  const isLoggedIn = auth.isAuthenticated();
  const user = auth.getUser();

  setupLogoutButton();
  setupHamburger();

  return `
    <div class="app">
      <div class="topbar-wrapper">
      <header class="topbar" id="topbar">
        <div class="topbar__left">
          <a class="brand" href="#/home">
            <div class="brand__icon">★</div>
            <div class="brand__name">
              <span class="brand__name--dark">Educa</span><span class="brand__name--color">Kids</span>
            </div>
          </a>
        </div>

        <nav class="topbar__nav">
          ${getNavLinks()}
        </nav>

        <div class="topbar__right">
          ${getTopbarRight(isLoggedIn, user)}
        </div>
      </header>

      <div class="mobile-nav" id="mobile-nav">
        ${getMobileNavHTML(isLoggedIn, user)}
      </div>
      </div>

      <main class="content" id="view"></main>
    </div>
  `;
}

export async function updateLayout() {
  const topbar = document.getElementById('topbar');
  if (!topbar) return;

  const isLoggedIn = auth.isAuthenticated();
  const user = auth.getUser();

  topbar.innerHTML = `
    <div class="topbar__left">
      <a class="brand" href="#/home">
        <div class="brand__icon">★</div>
        <div class="brand__name">
          <span class="brand__name--dark">Educa</span><span class="brand__name--color">Kids</span>
        </div>
      </a>
    </div>

    <nav class="topbar__nav">
      ${getNavLinks()}
    </nav>

    <div class="topbar__right">
      ${getTopbarRight(isLoggedIn, user)}
    </div>
  `;

  setupLogoutButton();
  setupHamburger();
  updateMobileNav();

  if (isLoggedIn) {
    updateUserStats();
  }
}

export async function updateUserStats() {
  try {
    console.log('🔄 Atualizando estatísticas do usuário...');
    const profile = await api.getProfile();
    console.log('📊 Dados do perfil recebidos:', profile);

    const starsElement = document.getElementById('starsValue');
    const trophyElement = document.getElementById('trophyValue');

    if (starsElement) {
      starsElement.textContent = profile.stars || 0;
      console.log('⭐ Estrelas atualizadas:', profile.stars || 0);
    } else {
      console.warn('⚠️ Elemento starsValue não encontrado!');
    }

    if (trophyElement) {
      trophyElement.textContent = profile.trophies || 0;
      console.log('🏆 Troféus atualizados:', profile.trophies || 0);
    } else {
      console.warn('⚠️ Elemento trophyValue não encontrado!');
    }

    auth.saveUser(profile);
  } catch (error) {
    console.error('❌ Erro ao atualizar estatísticas do usuário:', error);
  }
}
