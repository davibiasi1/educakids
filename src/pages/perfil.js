import { auth, api } from '../services/api.js';
import { MEDALS, isMedalUnlocked, getMedalProgress, getRequirementText, getRarityLabel, getUnlockedMedals } from '../utils/medals.js';

export function PerfilPage() {
  const user = auth.getUser();

  return `
    <section class="perfil-page">
      <div class="perfil-header">
        <div class="perfil-avatar">
          <span>☺</span>
        </div>

        <div>
          <h1>Olá, ${user ? user.name : 'Aluno'}!</h1>
          <p>Acompanhe suas recompensas e progresso no EducaKids.</p>
        </div>
      </div>

      <section class="perfil-stats perfil-stats--three">
        <div class="perfil-stat-card perfil-stat-card--gold">
          <span class="perfil-stat-icon">⭐</span>
          <h2 id="profile-stars">0</h2>
          <p>Estrelas conquistadas</p>
        </div>

        <div class="perfil-stat-card perfil-stat-card--purple">
          <span class="perfil-stat-icon">🏆</span>
          <h2 id="profile-trophies">0</h2>
          <p>Troféus conquistados</p>
        </div>

        <div class="perfil-stat-card perfil-stat-card--mint">
          <span class="perfil-stat-icon">📚</span>
          <h2 id="profile-videos">0</h2>
          <p>Vídeos concluídos</p>
        </div>
      </section>

      <section class="perfil-content-grid">
        <div class="perfil-box">
          <h2>Meu progresso nos vídeos</h2>
          <div id="progress-list">
            <p class="loading-message">Carregando progresso...</p>
          </div>
        </div>

        <div class="perfil-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="margin: 0;">Medalhas conquistadas</h2>
            <a href="#/recompensas" class="btn btn--small btn--outline">Ver todas</a>
          </div>
          <div id="achievements-list">
            <p class="loading-message">Carregando medalhas...</p>
          </div>
        </div>
      </section>
    </section>
  `;
}

export async function initPerfilPage() {
  console.log('🔄 Iniciando página de perfil...');

  try {
    // Buscar dados do perfil
    const profile = await api.getProfile();
    console.log('📊 Dados do perfil:', profile);

    // Atualizar estatísticas
    const userStars = profile.stars || 0;
    const userTrophies = profile.trophies || 0;
    
    document.getElementById('profile-stars').textContent = userStars;
    document.getElementById('profile-trophies').textContent = userTrophies;

    // Buscar progresso dos vídeos
    const userProgress = await api.getUserProgress();
    console.log('📹 Progresso dos vídeos:', userProgress);

    // Buscar todos os vídeos para cruzar informações
    const allVideos = await api.getAllVideos();
    console.log('🎬 Todos os vídeos:', allVideos);

    // Criar mapa de progresso por videoId
    const progressMap = {};
    if (userProgress && userProgress.length > 0) {
      userProgress.forEach(p => {
        progressMap[p.videoId] = p;
      });
    }

    // Contar vídeos concluídos
    const completedVideos = userProgress.filter(p => p.completed).length;
    document.getElementById('profile-videos').textContent = completedVideos;

    // Renderizar lista de progresso
    renderProgressList(allVideos, progressMap);

    // Renderizar medalhas conquistadas
    renderUnlockedMedals(userStars, userTrophies);

  } catch (error) {
    console.error('❌ Erro ao carregar perfil:', error);
    document.getElementById('progress-list').innerHTML = `
      <p class="error-message">Erro ao carregar dados do perfil. Tente novamente mais tarde.</p>
    `;
  }
}

function renderProgressList(videos, progressMap) {
  const progressList = document.getElementById('progress-list');

  if (!videos || videos.length === 0) {
    progressList.innerHTML = `
      <div class="empty-state">
        <p>Nenhum vídeo disponível ainda.</p>
        <a href="#/videos" class="btn btn--primary">Explorar Vídeos</a>
      </div>
    `;
    return;
  }

  // Filtrar apenas vídeos que têm progresso > 0
  const videosWithProgress = videos.filter(video => {
    const progress = progressMap[video.id];
    return progress && progress.progress > 0;
  });

  if (videosWithProgress.length === 0) {
    progressList.innerHTML = `
      <div class="empty-state">
        <p>📺 Você ainda não começou a assistir nenhum vídeo.</p>
        <a href="#/videos" class="btn btn--primary">Começar a Assistir</a>
      </div>
    `;
    return;
  }

  // Ordenar por progresso (maiores primeiro)
  videosWithProgress.sort((a, b) => {
    const progressA = progressMap[a.id]?.progress || 0;
    const progressB = progressMap[b.id]?.progress || 0;
    return progressB - progressA;
  });

  // Renderizar lista de progresso
  const progressHTML = videosWithProgress.map(video => {
    const progress = progressMap[video.id];
    const progressPercent = Math.round(progress.progress);
    const isCompleted = progress.completed;

    return `
      <div class="perfil-progress-item">
        <div class="perfil-progress-info">
          <span>${video.titulo}</span>
          <strong>${progressPercent}%</strong>
          ${isCompleted ? '<span class="badge badge--success">✓ Completo</span>' : ''}
        </div>
        <div class="perfil-progress-bar">
          <div class="perfil-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>
        <div class="perfil-progress-meta">
          <small>⭐ ${progress.stars || 0} estrelas ganhas</small>
          <a href="#/player?id=${video.id}" class="btn btn--small btn--outline">
            ${isCompleted ? 'Reassistir' : 'Continuar'}
          </a>
        </div>
      </div>
    `;
  }).join('');

  progressList.innerHTML = progressHTML;
}

function renderUnlockedMedals(userStars, userTrophies) {
  const achievementsList = document.getElementById('achievements-list');
  
  // Obter medalhas desbloqueadas
  const unlockedMedals = getUnlockedMedals(userStars, userTrophies);
  
  if (unlockedMedals.length === 0) {
    achievementsList.innerHTML = `
      <div class="empty-state">
        <p>🌟 Você ainda não conquistou nenhuma medalha.</p>
        <p style="font-size: 14px; color: var(--muted); margin-top: 8px;">
          Assista vídeos para ganhar estrelas e troféus e desbloquear medalhas incríveis!
        </p>
        <a href="#/videos" class="btn btn--primary" style="margin-top: 16px;">Começar a Assistir</a>
      </div>
    `;
    return;
  }
  
  // Mostrar últimas 6 medalhas conquistadas
  const recentMedals = unlockedMedals.slice(-6).reverse();
  
  const medalsHTML = recentMedals.map(medal => `
    <div class="perfil-medal-item">
      <span class="perfil-medal-icon">${medal.icon}</span>
      <div class="perfil-medal-info">
        <strong>${medal.name}</strong>
        <p>${medal.description}</p>
        <small class="medal-rarity medal-rarity--${medal.rarity}">${getRarityLabel(medal.rarity)}</small>
      </div>
      <div class="perfil-medal-check">✓</div>
    </div>
  `).join('');
  
  achievementsList.innerHTML = medalsHTML + 
    (unlockedMedals.length > 6 ? `
      <div style="text-align: center; margin-top: 16px;">
        <a href="#/recompensas" class="btn btn--outline">Ver todas as ${unlockedMedals.length} medalhas</a>
      </div>
    ` : '');
}