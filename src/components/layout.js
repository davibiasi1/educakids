import { auth, api } from '../services/api.js';

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
  }, 0);
}

function getCurrentPath() {
  return window.location.hash.replace('#', '').split('?')[0] || '/home';
}

function getNavLinks() {
  const currentPath = getCurrentPath();

  return `
    <a class="navlink ${currentPath === '/home' ? 'navlink--active' : ''}" href="#/home">Início</a>
    <a class="navlink ${currentPath === '/videos' ? 'navlink--active' : ''}" href="#/videos">Vídeos</a>
    <a class="navlink ${currentPath === '/recompensas' ? 'navlink--active' : ''}" href="#/recompensas">Recompensas</a>
    <a class="navlink ${currentPath === '/progresso' ? 'navlink--active' : ''}" href="#/progresso">Progresso</a>
    <a class="navlink ${currentPath === '/sobre' ? 'navlink--active' : ''}" href="#/sobre">Sobre</a>
    <a class="navlink ${currentPath === '/admin-videos' ? 'navlink--active' : ''}" href="#/admin-videos">Admin</a>
  `;
}

function getAvatar(user) {
  const currentPath = getCurrentPath();

  return `
    <a 
      class="avatar ${currentPath === '/perfil' ? 'avatar--active' : ''}" 
      href="#/perfil" 
      aria-label="Perfil" 
      title="${user ? user.name : 'Perfil'}"
    >
      <span class="avatar__icon">☺</span>
    </a>
  `;
}

export function renderLayout() {
  const isLoggedIn = auth.isAuthenticated();
  const user = auth.getUser();

  setupLogoutButton();

  return `
    <div class="app">
      <header class="topbar" id="topbar">
        <div class="topbar__left">
          <div class="brand">
            <div class="brand__icon">★</div>
            <div class="brand__name">
              <span class="brand__name--dark">Educa</span><span class="brand__name--color">Kids</span>
            </div>
          </div>
        </div>

        <nav class="topbar__nav">
          ${getNavLinks()}
        </nav>

        <div class="topbar__right">
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
          ` : ''}
          ${isLoggedIn
            ? `<a class="logout-btn" href="#" id="logout-btn">Sair</a>`
            : `<a class="logout-btn" href="#/login">Login</a>`
          }
          <button class="avatar" aria-label="Perfil" title="${user ? user.name : 'Perfil'}">
            <span class="avatar__icon">☺</span>
          </button>
        </div>
      </header>

      <main class="content" id="view"></main>
    </div>
  `;
}

export async function updateLayout() {
  const topbar = document.getElementById('topbar');
  if (!topbar) return;

  const isLoggedIn = auth.isAuthenticated();
  const user = auth.getUser();

  const newTopbar = `
    <div class="topbar__left">
      <div class="brand">
        <div class="brand__icon">★</div>
        <div class="brand__name">
          <span class="brand__name--dark">Educa</span><span class="brand__name--color">Kids</span>
        </div>
      </div>
    </div>

    <nav class="topbar__nav">
      ${getNavLinks()}
    </nav>

    <div class="topbar__right">
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
      ` : ''}
      ${isLoggedIn
        ? `<a class="logout-btn" href="#" id="logout-btn">Sair</a>`
        : `<a class="logout-btn" href="#/login">Login</a>`
      }
      <button class="avatar" aria-label="Perfil" title="${user ? user.name : 'Perfil'}">
        <span class="avatar__icon">☺</span>
      </button>
    </div>
  `;

  topbar.innerHTML = newTopbar;
  setupLogoutButton();
  
  // Atualizar valores reais de estrelas e troféus
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
    
    // Atualizar também o localStorage com dados atualizados
    auth.saveUser(profile);
  } catch (error) {
    console.error('❌ Erro ao atualizar estatísticas do usuário:', error);
  }
}