import { api, auth } from '../services/api.js';
import { updateUserStats } from '../components/layout.js';

let allVideos = [];
let userProgress = {};

export function VideosPage() {
  return `
    <section class="page">
      <h2 class="page__title">Vídeos <span class="page__titleAccent">Educativos</span></h2>
      <p class="page__subtitle">Explore nossos vídeos incríveis e ganhe estrelas enquanto aprende coisas novas!</p>
      
      <div id="videosContent">
        <div class="loading-message">Carregando vídeos...</div>
      </div>
    </section>
  `;
}

export async function initVideosPage() {
  try {
    // Buscar todos os vídeos
    allVideos = await api.getAllVideos();
    
    // Buscar progresso do usuário (se logado)
    if (auth.isAuthenticated()) {
      try {
        const progressData = await api.getUserProgress();
        // Converter para objeto para acesso rápido por videoId
        userProgress = progressData.reduce((acc, p) => {
          acc[p.videoId] = p;
          return acc;
        }, {});
        console.log('Progresso do usuário carregado:', Object.keys(userProgress).length, 'vídeos');
        
        // Atualizar estrelas no header
        updateUserStats();
      } catch (err) {
        console.log('Usuário sem progresso:', err);
      }
    }
    
    renderVideos();
  } catch (error) {
    console.error('Erro ao carregar vídeos:', error);
    document.getElementById('videosContent').innerHTML = `
      <div class="error-message">
        <p>❌ Erro ao carregar vídeos</p>
        <button class="btn btn--primary" onclick="location.reload()">Tentar novamente</button>
      </div>
    `;
  }
}

function renderVideos() {
  const videosContent = document.getElementById('videosContent');
  
  if (allVideos.length === 0) {
    videosContent.innerHTML = `
      <div class="empty-state">
        <p>Nenhum vídeo cadastrado ainda.</p>
        <a href="#/admin-videos" class="btn btn--primary">Cadastrar vídeos</a>
      </div>
    `;
    return;
  }
  
  // Agrupar vídeos por idade
  const videosPorIdade = allVideos.reduce((acc, video) => {
    if (!acc[video.idade]) {
      acc[video.idade] = [];
    }
    acc[video.idade].push(video);
    return acc;
  }, {});
  
  // Ordenar idades
  const idades = Object.keys(videosPorIdade).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    return numA - numB;
  });
  
  // Renderizar seções por idade
  videosContent.innerHTML = idades.map(idade => renderIdadeSection(idade, videosPorIdade[idade])).join('');
}

function renderIdadeSection(idade, videos) {
  return `
    <section class="videoAgeSection">
      <div class="videoAgeHeader">
        <h2>${idade}</h2>
        <span>${videos.length} vídeo(s)</span>
      </div>

      <div class="gridVideos">
        ${videos.map(video => renderVideoCard(video)).join('')}
      </div>
    </section>
  `;
}

function renderVideoCard(video) {
  const progress = userProgress[video.id] || null;
  const progressPercent = progress ? Math.floor(progress.progress) : 0;
  const stars = progress ? progress.stars : 0;
  const isCompleted = progress ? progress.completed : false;
  
  return `
    <article class="videoCard">
      <div class="videoEmbed">
        <img 
          src="https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg" 
          alt="${video.titulo}"
          class="video-thumbnail"
        />
        ${isCompleted ? '<div class="video-completed-badge">✓ Concluído</div>' : ''}
      </div>

      <div class="videoBody">
        <div class="videoTags">
          <span class="tag tag--soft">${video.idade}</span>
          <span class="tag tag--soft">${video.categoria}</span>
        </div>

        <h2 class="videoTitle">${video.titulo}</h2>

        ${progressPercent > 0 ? `
          <div class="progressRow">
            <div class="progressBar">
              <div class="progressBar__fill" style="width:${progressPercent}%"></div>
            </div>
            <div class="progressText">${progressPercent}% assistido</div>
          </div>
        ` : ''}

        <div class="videoFooter">
          <div class="rewardRow">
            <span class="rewardStar">★</span>
            <span>${stars} / 20 estrelas</span>
          </div>

          <a class="btn btn--pill ${progressPercent === 100 ? 'btn--ghost' : progressPercent > 0 ? 'btn--orange' : 'btn--mint'}" href="#/player?id=${video.id}">
            ${progressPercent === 100 ? 'Reassistir' : progressPercent > 0 ? 'Continuar' : 'Assistir'}
          </a>
        </div>
      </div>
    </article>
  `;
}
