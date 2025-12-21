export function HomePage() {
  return `
    <section class="hero hero--shapes">
      <div class="hero__badge">✨ Aprender é divertido!</div>

      <h1 class="hero__title">
        Aprenda brincando com o <span class="brandInline">Educa<span>Kids</span></span>
      </h1>

      <p class="hero__subtitle">
        Assista vídeos educativos, ganhe estrelas e conquiste prêmios incríveis enquanto desenvolve novas habilidades! 🎉
      </p>

      <div class="hero__actions">
        <a class="btn btn--primary" href="#/videos">
          <span class="btn__icon">▶</span> Começar Agora
        </a>
        <a class="btn btn--ghost" href="#/videos">Ver Vídeos</a>
      </div>

      <div class="hero__stats">
        <div class="stat">
          <div class="stat__value stat__value--mint">500+</div>
          <div class="stat__label">Vídeos</div>
        </div>
        <div class="stat">
          <div class="stat__value stat__value--orange">50+</div>
          <div class="stat__label">Recompensas</div>
        </div>
        <div class="stat">
          <div class="stat__value stat__value--purple">10k+</div>
          <div class="stat__label">Crianças</div>
        </div>
      </div>
    </section>
  `;
}
