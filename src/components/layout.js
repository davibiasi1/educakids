import { auth } from '../services/api.js';

function setupLogoutButton() {
  setTimeout(() => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
        // Redirecionar para login (o router atualizará o layout automaticamente)
        window.location.hash = '#/login';
      });
    }
  }, 0);
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
          <a class="navlink" href="#/home">Início</a>
          <a class="navlink" href="#/videos">Vídeos</a>
          <a class="navlink" href="#/recompensas">Recompensas</a>
          <a class="navlink" href="#/progresso">Progresso</a>
        </nav>

        <div class="topbar__right">
          <div class="chip chip--gold">
            <span class="chip__icon">★</span>
            <span class="chip__value" id="starsValue">245</span>
          </div>

          <div class="chip chip--purple">
            <span class="chip__icon">🏆</span>
            <span class="chip__value" id="trophyValue">12</span>
          </div>

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

// Função para atualizar apenas o header dinamicamente
export function updateLayout() {
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
      <a class="navlink" href="#/home">Início</a>
      <a class="navlink" href="#/videos">Vídeos</a>
      <a class="navlink" href="#/recompensas">Recompensas</a>
      <a class="navlink" href="#/progresso">Progresso</a>
    </nav>

    <div class="topbar__right">
      <div class="chip chip--gold">
        <span class="chip__icon">★</span>
        <span class="chip__value" id="starsValue">245</span>
      </div>

      <div class="chip chip--purple">
        <span class="chip__icon">🏆</span>
        <span class="chip__value" id="trophyValue">12</span>
      </div>

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
}