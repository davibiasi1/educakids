export function renderLayout() {
  return `
    <div class="app">
      <header class="topbar">
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

          <button class="avatar" aria-label="Perfil">
            <span class="avatar__icon">☺</span>
          </button>
        </div>
      </header>

      <main class="content" id="view"></main>
    </div>
  `;
}
