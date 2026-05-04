const videos = [
  // 2 anos
  {
    idade: "2 anos",
    categoria: "Português",
    titulo: "Música A E I O U",
    estrelas: 15,
    progresso: 0,
    youtubeId: "WyA6GscP4DA"
  },
  {
    idade: "2 anos",
    categoria: "Português",
    titulo: "Música animada",
    estrelas: 15,
    progresso: 0,
    youtubeId: "x5Dm5FcvIOw"
  },

  // 3 anos
  {
    idade: "3 anos",
    categoria: "Português",
    titulo: "Aprendendo o ABC",
    estrelas: 20,
    progresso: 0,
    youtubeId: "SlHhTvDFYWY"
  },
  {
    idade: "3 anos",
    categoria: "Artes",
    titulo: "As Cores",
    estrelas: 20,
    progresso: 0,
    youtubeId: "UuSngn7iR44"
  },
  {
    idade: "3 anos",
    categoria: "Matemática",
    titulo: "Aprender os números de 1 a 10",
    estrelas: 20,
    progresso: 0,
    youtubeId: "wxabvrLWImw"
  },

  // 4 anos
  {
    idade: "4 anos",
    categoria: "Português",
    titulo: "Aprender ABC",
    estrelas: 20,
    progresso: 0,
    youtubeId: "eaZoO7dIZwA"
  },
  {
    idade: "4 anos",
    categoria: "Português",
    titulo: "Música A E I O U",
    estrelas: 15,
    progresso: 0,
    youtubeId: "WyA6GscP4DA"
  },
  {
    idade: "4 anos",
    categoria: "Matemática",
    titulo: "Contar até 10 e quantidade",
    estrelas: 20,
    progresso: 0,
    youtubeId: "FgV7rw7PyvM"
  },
  {
    idade: "4 anos",
    categoria: "Matemática",
    titulo: "Conta de somar",
    estrelas: 25,
    progresso: 0,
    youtubeId: "T17JjsaohpI"
  },
  {
    idade: "4 anos",
    categoria: "Aprendendo cantando",
    titulo: "Relembrando música animada",
    estrelas: 15,
    progresso: 0,
    youtubeId: "x5Dm5FcvIOw"
  },

  // 5 anos
  {
    idade: "5 anos",
    categoria: "Português",
    titulo: "Som da letra B mais sílabas",
    estrelas: 25,
    progresso: 0,
    youtubeId: "gu6x7ziiGAw"
  },
  {
    idade: "5 anos",
    categoria: "Português",
    titulo: "Ler palavras com a letra B",
    estrelas: 25,
    progresso: 0,
    youtubeId: "lVqxryHlxW4"
  },
  {
    idade: "5 anos",
    categoria: "Português",
    titulo: "Som da letra C mais sílabas",
    estrelas: 25,
    progresso: 0,
    youtubeId: "E9-eRvn80-0"
  },
  {
    idade: "5 anos",
    categoria: "Português",
    titulo: "Ler palavras com a letra C",
    estrelas: 25,
    progresso: 0,
    youtubeId: "6xCLwV7JYFs"
  },
  {
    idade: "5 anos",
    categoria: "Português",
    titulo: "Som da letra D mais sílabas",
    estrelas: 25,
    progresso: 0,
    youtubeId: "31CaY9N4tr8"
  },
  {
    idade: "5 anos",
    categoria: "Português",
    titulo: "Ler palavras com a letra D",
    estrelas: 25,
    progresso: 0,
    youtubeId: "Ws2T8K1k5IE"
  },
  {
    idade: "5 anos",
    categoria: "Português",
    titulo: "Som da letra F mais sílabas",
    estrelas: 25,
    progresso: 0,
    youtubeId: "xGZ4W71uOjc"
  },
  {
    idade: "5 anos",
    categoria: "Português",
    titulo: "Ler palavras com a letra F",
    estrelas: 25,
    progresso: 0,
    youtubeId: "OrfF-ittK80"
  },
  {
    idade: "5 anos",
    categoria: "Português",
    titulo: "Som da letra G mais sílabas",
    estrelas: 25,
    progresso: 0,
    youtubeId: "a5T-49eoTIo"
  },
  {
    idade: "5 anos",
    categoria: "Português",
    titulo: "Ler palavras com a letra G",
    estrelas: 25,
    progresso: 0,
    youtubeId: "T7tGmKZ2ovM"
  },
  {
    idade: "5 anos",
    categoria: "Português",
    titulo: "Animais na fazenda",
    estrelas: 20,
    progresso: 0,
    youtubeId: "Y-DMGRJr1OU"
  },

  // 6 anos
  {
    idade: "6 anos",
    categoria: "Português",
    titulo: "Aprendendo numerais",
    estrelas: 20,
    progresso: 0,
    youtubeId: "W6tNQo2_cFQ"
  },
  {
    idade: "6 anos",
    categoria: "Português",
    titulo: "Aprendendo a formar palavras",
    estrelas: 25,
    progresso: 0,
    youtubeId: "F6RL-oLcALQ"
  },
  {
    idade: "6 anos",
    categoria: "Matemática",
    titulo: "Conta de somar",
    estrelas: 25,
    progresso: 0,
    youtubeId: "T17JjsaohpI"
  },
  {
    idade: "6 anos",
    categoria: "Matemática",
    titulo: "Atividade de matemática",
    estrelas: 25,
    progresso: 0,
    youtubeId: "rljiBbTOFvc"
  },

  // 7 anos
  {
    idade: "7 anos",
    categoria: "Português",
    titulo: "Gênero textual",
    estrelas: 30,
    progresso: 0,
    youtubeId: "ZE78-r0KMOc"
  },
  {
    idade: "7 anos",
    categoria: "Ciência",
    titulo: "Sistema solar para crianças",
    estrelas: 30,
    progresso: 0,
    youtubeId: "NpewGvMrr6o"
  },
  {
    idade: "7 anos",
    categoria: "Ciência",
    titulo: "Importância do Sol",
    estrelas: 30,
    progresso: 0,
    youtubeId: "YYFWXKbie-k"
  },
  {
    idade: "7 anos",
    categoria: "Ciência",
    titulo: "Divertindo com ciência",
    estrelas: 30,
    progresso: 0,
    youtubeId: "BTPmIFV1q0U"
  }
];

const idades = ["2 anos", "3 anos", "4 anos", "5 anos", "6 anos", "7 anos", "8 anos"];

function renderVideoCard(video) {
  return `
    <article class="videoCard">
      <div class="videoEmbed">
        <iframe
          src="https://www.youtube.com/embed/${video.youtubeId}"
          title="${video.titulo}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      </div>

      <div class="videoBody">
        <div class="videoTags">
          <span class="tag tag--soft">${video.idade}</span>
          <span class="tag tag--soft">${video.categoria}</span>
        </div>

        <h2 class="videoTitle">${video.titulo}</h2>

        ${video.progresso > 0 ? `
          <div class="progressRow">
            <div class="progressBar">
              <div class="progressBar__fill" style="width:${video.progresso}%"></div>
            </div>
            <div class="progressText">${video.progresso}% assistido</div>
          </div>
        ` : ''}

        <div class="videoFooter">
          <div class="rewardRow">
            <span class="rewardStar">★</span>
            <span>+${video.estrelas} estrelas</span>
          </div>

          <a class="btn btn--pill btn--mint" href="#/videos?video=${video.youtubeId}">
            Assistir
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderIdadeSection(idade) {
  const videosDaIdade = videos.filter(video => video.idade === idade);

  return `
    <section class="videoAgeSection">
      <div class="videoAgeHeader">
        <h2>${idade}</h2>
        <span>${videosDaIdade.length} vídeo(s)</span>
      </div>

      ${
        videosDaIdade.length > 0
          ? `<div class="gridVideos">${videosDaIdade.map(renderVideoCard).join("")}</div>`
          : `<div class="panel">Nenhum vídeo cadastrado para esta idade ainda.</div>`
      }
    </section>
  `;
}

export function VideosPage() {
  return `
    <section class="page videos-dashboard">
      <h1 class="page__title">
        Vídeos <span class="page__titleAccent">Educativos</span>
      </h1>

      <p class="page__subtitle">
        Explore vídeos por idade, matéria e ganhe estrelas enquanto aprende.
      </p>

      ${idades.map(renderIdadeSection).join("")}
    </section>
  `;
}