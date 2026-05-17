import { auth, api } from '../services/api.js';

export function ProgressoPage() {
  return `
    <section class="progresso-page">
      <div class="ai-header">
        <div class="ai-icon">
          <svg class="ai-sparkles" width="90" height="90" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ff8a5b;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#f58c57;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ff9d6f;stop-opacity:1" />
              </linearGradient>
            </defs>
            <!-- Estrela grande central -->
            <path class="sparkle-main" d="M30 5 L32 28 L55 30 L32 32 L30 55 L28 32 L5 30 L28 28 Z" 
                  fill="url(#sparkle-gradient)" />
            <!-- Estrela pequena superior -->
            <path class="sparkle-small sparkle-top" d="M45 8 L46 13 L51 14 L46 15 L45 20 L44 15 L39 14 L44 13 Z" 
                  fill="url(#sparkle-gradient)" opacity="0.7" />
            <!-- Estrela pequena inferior -->
            <path class="sparkle-small sparkle-bottom" d="M15 40 L16 45 L21 46 L16 47 L15 52 L14 47 L9 46 L14 45 Z" 
                  fill="url(#sparkle-gradient)" opacity="0.7" />
          </svg>
          <div class="ai-pulse"></div>
        </div>
        <div class="ai-header-text">
          <h1>Análise Inteligente de Progresso</h1>
          <p id="ai-status" class="ai-status">
            <span class="loading-dots">Analisando dados</span>
          </p>
        </div>
      </div>

      <div id="ai-content" class="ai-content-loading">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Processando informações de aprendizado...</p>
        </div>
      </div>
    </section>
  `;
}

export async function initProgressoPage() {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const profile = await api.getProfile();
    const userProgress = await api.getUserProgress();
    const allVideos = await api.getAllVideos();

    // Atualizar status
    document.getElementById('ai-status').innerHTML = `
      <span class="status-success">✓ Análise concluída</span>
    `;

    // Gerar análise inteligente
    const analysis = generateAIAnalysis(profile, userProgress, allVideos);

    // Renderizar conteúdo
    renderProgressContent(analysis, profile, userProgress, allVideos);

  } catch (error) {
    console.error('❌ Erro ao carregar progresso:', error);
    document.getElementById('ai-status').innerHTML = `
      <span class="status-error">⚠️ Erro na análise</span>
    `;
    document.getElementById('ai-content').innerHTML = `
      <div class="error-message">
        <p>Não foi possível processar os dados. Tente novamente mais tarde.</p>
      </div>
    `;
  }
}

function generateAIAnalysis(profile, userProgress, allVideos) {
  const totalVideos = allVideos.length;
  const watchedVideos = userProgress.length;
  const completedVideos = userProgress.filter(p => p.completed).length;
  const totalStars = profile.stars || 0;
  const totalTrophies = profile.trophies || 0;

  // Calcular progresso médio
  const avgProgress = userProgress.length > 0
    ? userProgress.reduce((sum, p) => sum + p.progress, 0) / userProgress.length
    : 0;

  // Analisar por categoria
  const progressByCategory = {};
  const categoryStats = {};
  
  allVideos.forEach(video => {
    if (!categoryStats[video.categoria]) {
      categoryStats[video.categoria] = { total: 0, watched: 0, completed: 0, totalStars: 0 };
    }
    categoryStats[video.categoria].total++;
  });

  userProgress.forEach(progress => {
    const video = allVideos.find(v => v.id === progress.videoId);
    if (video) {
      const cat = video.categoria;
      categoryStats[cat].watched++;
      if (progress.completed) {
        categoryStats[cat].completed++;
      }
      categoryStats[cat].totalStars += progress.stars || 0;
    }
  });

  // Calcular níveis de engajamento por categoria
  Object.keys(categoryStats).forEach(cat => {
    const stats = categoryStats[cat];
    progressByCategory[cat] = {
      ...stats,
      engagementLevel: stats.watched > 0 ? (stats.watched / stats.total) * 100 : 0,
      completionRate: stats.watched > 0 ? (stats.completed / stats.watched) * 100 : 0
    };
  });

  // Identificar categoria favorita (mais engajamento)
  const favoriteCategory = Object.entries(progressByCategory)
    .sort((a, b) => b[1].engagementLevel - a[1].engagementLevel)[0];

  // Identificar pontos fortes e fracos
  const strongCategories = Object.entries(progressByCategory)
    .filter(([_, stats]) => stats.completionRate >= 70)
    .map(([cat, _]) => cat);

  const improvementCategories = Object.entries(progressByCategory)
    .filter(([_, stats]) => stats.engagementLevel > 0 && stats.completionRate < 50)
    .map(([cat, _]) => cat);

  // Gerar insights personalizados
  const insights = generateInsights(
    completedVideos,
    totalStars,
    totalTrophies,
    avgProgress,
    favoriteCategory,
    strongCategories,
    improvementCategories
  );

  // Calcular tendência (crescimento esperado)
  const daysActive = Math.max(1, Math.floor((new Date() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24)));
  const videosPerDay = completedVideos / daysActive;
  const predictedVideos7Days = Math.round(completedVideos + (videosPerDay * 7));
  const predictedStars7Days = Math.round(totalStars + (totalStars / daysActive * 7));

  return {
    totalVideos,
    watchedVideos,
    completedVideos,
    totalStars,
    totalTrophies,
    avgProgress: Math.round(avgProgress),
    progressByCategory,
    favoriteCategory,
    strongCategories,
    improvementCategories,
    insights,
    predictions: {
      videosIn7Days: predictedVideos7Days,
      starsIn7Days: predictedStars7Days,
      nextMilestone: getNextMilestone(completedVideos, totalStars, totalTrophies)
    },
    learningVelocity: videosPerDay.toFixed(2),
    daysActive
  };
}

function generateInsights(completed, stars, trophies, avgProgress, favoriteCategory, strongCategories, improvementCategories) {
  const insights = [];

  // Insight principal
  if (completed === 0) {
    insights.push({
      type: 'motivation',
      icon: '🚀',
      title: 'Pronto para começar!',
      message: 'Sua jornada de aprendizado está prestes a começar. Cada vídeo concluído é uma conquista!'
    });
  } else if (completed < 5) {
    insights.push({
      type: 'progress',
      icon: '⭐',
      title: 'Excelente início!',
      message: `Você já concluiu ${completed} vídeo${completed > 1 ? 's' : ''}! Continue assim e logo alcançará grandes conquistas.`
    });
  } else if (completed < 10) {
    insights.push({
      type: 'success',
      icon: '🎯',
      title: 'Progresso consistente!',
      message: `${completed} vídeos concluídos demonstram dedicação. Você está no caminho certo para se tornar um especialista!`
    });
  } else {
    insights.push({
      type: 'achievement',
      icon: '🏆',
      title: 'Performance excepcional!',
      message: `Com ${completed} vídeos concluídos, você demonstra um comprometimento admirável com o aprendizado!`
    });
  }

  // Insight sobre categoria favorita
  if (favoriteCategory) {
    insights.push({
      type: 'favorite',
      icon: '❤️',
      title: 'Área de interesse identificada',
      message: `Você demonstra forte interesse em ${favoriteCategory[0]}. Continue explorando este tema!`
    });
  }

  // Insight sobre pontos fortes
  if (strongCategories.length > 0) {
    insights.push({
      type: 'strength',
      icon: '💪',
      title: 'Pontos fortes detectados',
      message: `Você tem excelente desempenho em: ${strongCategories.slice(0, 2).join(', ')}. Incrível!`
    });
  }

  // Insight sobre progresso médio
  if (avgProgress >= 80) {
    insights.push({
      type: 'excellence',
      icon: '✨',
      title: 'Comprometimento extraordinário',
      message: `Seu progresso médio de ${avgProgress}% mostra que você assiste aos vídeos com atenção total!`
    });
  }

  // Recomendação de melhoria
  if (improvementCategories.length > 0) {
    insights.push({
      type: 'recommendation',
      icon: '💡',
      title: 'Oportunidade de crescimento',
      message: `Tente completar mais vídeos de ${improvementCategories[0]} para expandir seu conhecimento!`
    });
  }

  return insights;
}

function getNextMilestone(videos, stars, trophies) {
  const milestones = [
    { videos: 5, stars: 20, trophies: 5, name: 'Aprendiz Dedicado', icon: '🎓' },
    { videos: 10, stars: 50, trophies: 10, name: 'Estudante Exemplar', icon: '📚' },
    { videos: 20, stars: 100, trophies: 20, name: 'Mestre do Conhecimento', icon: '🧠' },
    { videos: 50, stars: 250, trophies: 50, name: 'Gênio do EducaKids', icon: '🌟' }
  ];

  for (const milestone of milestones) {
    if (videos < milestone.videos || stars < milestone.stars || trophies < milestone.trophies) {
      return {
        ...milestone,
        videosNeeded: Math.max(0, milestone.videos - videos),
        starsNeeded: Math.max(0, milestone.stars - stars),
        trophiesNeeded: Math.max(0, milestone.trophies - trophies)
      };
    }
  }

  return {
    name: 'Lenda do EducaKids',
    icon: '👑',
    videosNeeded: 0,
    starsNeeded: 0,
    trophiesNeeded: 0
  };
}

function renderProgressContent(analysis, profile, userProgress, allVideos) {
  const content = document.getElementById('ai-content');
  content.className = 'ai-content';

  content.innerHTML = `
    <!-- Insights da IA -->
    <div class="ai-insights">
      ${analysis.insights.map(insight => `
        <div class="insight-card insight-card--${insight.type}">
          <span class="insight-icon">${insight.icon}</span>
          <div class="insight-content">
            <h3>${insight.title}</h3>
            <p>${insight.message}</p>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Estatísticas principais -->
    <div class="stats-grid">
      <div class="stat-card stat-card--purple">
        <div class="stat-icon">📊</div>
        <div class="stat-value">${analysis.completedVideos}</div>
        <div class="stat-label">Vídeos concluídos</div>
        <div class="stat-sublabel">de ${analysis.totalVideos} disponíveis</div>
      </div>

      <div class="stat-card stat-card--gold">
        <div class="stat-icon">⭐</div>
        <div class="stat-value">${analysis.totalStars}</div>
        <div class="stat-label">Estrelas coletadas</div>
        <div class="stat-sublabel">Continue brilhando!</div>
      </div>

      <div class="stat-card stat-card--mint">
        <div class="stat-icon">🏆</div>
        <div class="stat-value">${analysis.totalTrophies}</div>
        <div class="stat-label">Troféus conquistados</div>
        <div class="stat-sublabel">Você é um campeão!</div>
      </div>

      <div class="stat-card stat-card--orange">
        <div class="stat-icon">⚡</div>
        <div class="stat-value">${analysis.learningVelocity}</div>
        <div class="stat-label">Velocidade de aprendizado</div>
        <div class="stat-sublabel">vídeos/dia</div>
      </div>
    </div>

    <!-- Progresso por categoria -->
    <div class="category-analysis">
      <h2 class="section-title">
        <span class="title-icon">📈</span>
        Análise por Categoria
      </h2>
      <div class="category-cards">
        ${Object.entries(analysis.progressByCategory).map(([category, stats]) => `
          <div class="category-card">
            <div class="category-header">
              <h3>${getCategoryIcon(category)} ${category}</h3>
              <span class="category-badge">${stats.watched}/${stats.total}</span>
            </div>
            <div class="category-progress">
              <div class="progress-bar">
                <div class="progress-fill progress-fill--${getProgressColor(stats.engagementLevel)}" 
                     style="width: ${stats.engagementLevel}%"></div>
              </div>
              <div class="progress-stats">
                <span>${Math.round(stats.engagementLevel)}% explorado</span>
                <span>${Math.round(stats.completionRate)}% concluído</span>
              </div>
            </div>
            <div class="category-stats">
              <div class="category-stat">
                <span class="stat-icon-small">✓</span>
                <span>${stats.completed} completos</span>
              </div>
              <div class="category-stat">
                <span class="stat-icon-small">⭐</span>
                <span>${stats.totalStars} estrelas</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Previsões e Próxima Meta -->
    <div class="predictions-section">
      <div class="prediction-card">
        <h2 class="section-title">
          <span class="title-icon">🔮</span>
          Projeção para 7 dias
        </h2>
        <div class="prediction-content">
          <div class="prediction-item">
            <div class="prediction-value">${analysis.predictions.videosIn7Days}</div>
            <div class="prediction-label">vídeos concluídos</div>
          </div>
          <div class="prediction-item">
            <div class="prediction-value">${analysis.predictions.starsIn7Days}</div>
            <div class="prediction-label">estrelas coletadas</div>
          </div>
        </div>
        <p class="prediction-note">Baseado no seu ritmo atual de aprendizado</p>
      </div>

      <div class="milestone-card">
        <h2 class="section-title">
          <span class="title-icon">${analysis.predictions.nextMilestone.icon}</span>
          Próxima Conquista
        </h2>
        <div class="milestone-content">
          <h3>${analysis.predictions.nextMilestone.name}</h3>
          ${analysis.predictions.nextMilestone.videosNeeded > 0 ? `
            <div class="milestone-progress">
              <div class="milestone-item">
                <span>📹</span>
                <span>Faltam ${analysis.predictions.nextMilestone.videosNeeded} vídeo(s)</span>
              </div>
              <div class="milestone-item">
                <span>⭐</span>
                <span>Faltam ${analysis.predictions.nextMilestone.starsNeeded} estrela(s)</span>
              </div>
              <div class="milestone-item">
                <span>🏆</span>
                <span>Faltam ${analysis.predictions.nextMilestone.trophiesNeeded} troféu(s)</span>
              </div>
            </div>
          ` : `
            <p class="milestone-achieved">🎉 Você já alcançou este marco!</p>
          `}
        </div>
      </div>
    </div>

    <!-- Recomendações -->
    <div class="recommendations-section">
      <h2 class="section-title">
        <span class="title-icon">🎯</span>
        Recomendações Personalizadas
      </h2>
      <div class="recommendations-grid">
        ${generateRecommendations(analysis, allVideos, userProgress).map(rec => `
          <a href="#/player?id=${rec.id}" class="recommendation-card">
            <div class="rec-icon">${rec.icon}</div>
            <h3>${rec.titulo}</h3>
            <p>${rec.reason}</p>
            <div class="rec-meta">
              <span class="rec-badge">${rec.categoria}</span>
              <span class="rec-badge">${rec.idade}</span>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

function getCategoryIcon(category) {
  const icons = {
    'Matemática': '🔢',
    'Ciências': '🔬',
    'Português': '📖',
    'História': '📜',
    'Geografia': '🌍',
    'Inglês': '🗣️',
    'Artes': '🎨',
    'Educação Física': '⚽',
    'Música': '🎵'
  };
  return icons[category] || '📚';
}

function getProgressColor(percentage) {
  if (percentage >= 70) return 'green';
  if (percentage >= 40) return 'yellow';
  return 'red';
}

function generateRecommendations(analysis, allVideos, userProgress) {
  const watchedIds = new Set(userProgress.map(p => p.videoId));
  const unwatchedVideos = allVideos.filter(v => !watchedIds.has(v.id));

  if (unwatchedVideos.length === 0) {
    return [];
  }

  const recommendations = [];

  // Recomendar da categoria favorita
  if (analysis.favoriteCategory) {
    const favCatVideo = unwatchedVideos.find(v => v.categoria === analysis.favoriteCategory[0]);
    if (favCatVideo) {
      recommendations.push({
        ...favCatVideo,
        icon: '❤️',
        reason: 'Recomendado porque você adora ' + analysis.favoriteCategory[0]
      });
    }
  }

  // Recomendar de categoria com menos progresso
  if (analysis.improvementCategories.length > 0) {
    const improveCatVideo = unwatchedVideos.find(v => v.categoria === analysis.improvementCategories[0]);
    if (improveCatVideo) {
      recommendations.push({
        ...improveCatVideo,
        icon: '💡',
        reason: 'Expanda seu conhecimento em ' + analysis.improvementCategories[0]
      });
    }
  }

  // Adicionar mais vídeos aleatórios se necessário
  while (recommendations.length < 3 && unwatchedVideos.length > recommendations.length) {
    const randomVideo = unwatchedVideos[Math.floor(Math.random() * unwatchedVideos.length)];
    if (!recommendations.find(r => r.id === randomVideo.id)) {
      recommendations.push({
        ...randomVideo,
        icon: '🎬',
        reason: 'Novo conteúdo para você descobrir'
      });
    }
  }

  return recommendations.slice(0, 3);
}
