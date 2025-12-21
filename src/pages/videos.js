const videos = [
  {
    id: "cores-1",
    tag: "Cores",
    titulo: "Aprendendo as Cores do Arco-íris",
    tempo: "5:30",
    progresso: 75,
    recompensa: 15,
    acao: "Continuar",
  },
  {
    id: "numeros-1",
    tag: "Números",
    titulo: "Contando até 10 com Animais",
    tempo: "8:00",
    progresso: 0,
    recompensa: 20,
    acao: "Assistir",
  },
];

export function VideosPage() {
  return `
    <section class="page">
      <h2 class="page__title">Vídeos <span class="page__titleAccent">Educativos</span></h2>
      <p class="page__subtitle">Explore nossos vídeos incríveis e ganhe estrelas enquanto aprende coisas novas!</p>

      <div class="gridVideos">
        ${videos.map(v => VideoCard(v)).join("")}
      </div>
    </section>
  `;
}

function VideoCard(v) {
  const hasProgress = v.progresso > 0;

  return `
    <article class="videoCard">
      <div class="videoThumb">
        <div class="videoThumb__placeholder">
          <!-- coloque sua imagem depois (background-image ou <img>) -->
        </div>
        <div class="videoThumb__time">⏱ ${v.tempo}</div>
      </div>

      <div class="videoBody">
        <div class="tag tag--soft">${v.tag}</div>
        <h3 class="videoTitle">${v.titulo}</h3>

        ${hasProgress ? `
          <div class="progressRow">
            <div class="progressBar">
              <div class="progressBar__fill" style="width:${v.progresso}%"></div>
            </div>
            <div class="progressText">${v.progresso}% assistido</div>
          </div>
        ` : `
          <div class="rewardRow">
            <span class="rewardStar">★</span>
            <span>+${v.recompensa} estrelas</span>
          </div>
        `}

        <div class="videoFooter">
          ${hasProgress ? `<div class="rewardRow"><span class="rewardStar">★</span><span>+${v.recompensa} estrelas</span></div>` : `<div></div>`}
          <a class="btn btn--pill ${hasProgress ? "btn--orange" : "btn--mint"}" href="#/progresso">${v.acao}</a>
        </div>
      </div>
    </article>
  `;
}
