import { auth } from '../services/api.js';
import { updateUserStats } from '../components/layout.js';

let player;
let videoData;
let progressInterval;
let currentProgress = 0;
let maxProgressReached = 0; // Rastrear o progresso máximo já atingido
let lastSavedTime = 0; // Última posição salva em segundos
let videoCompleted = false; // Flag para vídeo completo

export function PlayerPage(params) {
  const videoId = params.id;
  
  if (!videoId) {
    return '<div class="error-page"><h2>Vídeo não encontrado</h2></div>';
  }

  return `
    <section class="page player-container">
      <div class="player-wrapper" id="playerWrapper">
        <div id="ytPlayer"></div>
      </div>
      
      <div class="player-info">
        <h2 id="videoTitle">Carregando...</h2>
        <div id="videoMeta"></div>
        
        <div class="player-progress">
          <div class="player-progress-label">
            <span>Progresso do vídeo</span>
            <span id="progressPercent">0%</span>
          </div>
          <div class="player-progress-bar">
            <div class="player-progress-fill" id="progressFill" style="width: 0%"></div>
          </div>
        </div>

        <div class="player-rewards">
          <div class="player-reward-card player-reward-card--stars">
            <div class="icon">⭐</div>
            <div class="value" id="starsEarned">0</div>
            <div class="label">Estrelas ganhas</div>
          </div>
          <div class="player-reward-card player-reward-card--trophy">
            <div class="icon">🏆</div>
            <div class="value" id="trophyEarned">0</div>
            <div class="label">Troféu</div>
          </div>
        </div>

        <div style="margin-top: 20px;">
          <a href="#/videos" class="btn btn--ghost">← Voltar para vídeos</a>
        </div>
      </div>
    </section>
  `;
}

export async function initPlayerPage(params) {
  const videoId = params.id;
  
  if (!videoId) return;

  // Carregar YouTube iframe API
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  // Buscar dados do vídeo
  try {
    const response = await fetch(`http://localhost:3000/videos/${videoId}`);
    videoData = await response.json();
    
    document.getElementById('videoTitle').textContent = videoData.titulo;
    document.getElementById('videoMeta').innerHTML = `
      <div class="video-item-meta">
        <span class="badge badge--category">${videoData.categoria}</span>
        <span class="badge badge--age">${videoData.idade}</span>
      </div>
    `;

    // Buscar progresso do usuário (se logado)
    if (auth.isAuthenticated()) {
      try {
        const token = auth.getToken();
        const progressResponse = await fetch(`http://localhost:3000/videos/progress/${videoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          currentProgress = progressData.progress || 0;
          maxProgressReached = currentProgress; // Inicializar progresso máximo
          videoCompleted = progressData.completed || false;
          updateProgressUI(currentProgress, progressData.stars || 0, progressData.completed ? 1 : 0);
          console.log('Progresso carregado:', currentProgress + '%', videoCompleted ? '(Vídeo já completo)' : '');
          
          // Se o vídeo já foi completado, mostrar aviso
          if (videoCompleted) {
            showCompletedWarning();
          }
        }
      } catch (err) {
        console.log('Usuário sem progresso anterior');
      }
    }
  } catch (error) {
    console.error('Erro ao carregar vídeo:', error);
  }

  // Inicializar player quando API estiver pronta
  window.onYouTubeIframeAPIReady = function() {
    initPlayer(videoData.youtubeId);
  };

  // Se a API já estiver carregada
  if (window.YT && window.YT.Player) {
    initPlayer(videoData.youtubeId);
  }
}

function initPlayer(youtubeId) {
  player = new YT.Player('ytPlayer', {
    height: '100%',
    width: '100%',
    videoId: youtubeId,
    playerVars: {
      'playsinline': 1,
      'rel': 0,
      'modestbranding': 1,
      'controls': 1, // Manter controles básicos (play/pause/volume)
      'disablekb': 1, // Desabilitar atalhos de teclado (setas para avançar)
      'fs': 0, // Desabilitar tela cheia (evita truques)
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  console.log('Player pronto! Progresso atual:', currentProgress + '%');
  
  // Se houver progresso anterior, posicionar o vídeo
  if (currentProgress > 0 && currentProgress < 100) {
    // Aguardar um pouco para garantir que a duração está disponível
    setTimeout(() => {
      const duration = player.getDuration();
      if (duration > 0) {
        const startTime = (currentProgress / 100) * duration;
        player.seekTo(startTime, true);
        lastSavedTime = startTime; // Inicializar posição salva
        console.log(`Continuando de ${Math.floor(currentProgress)}% (${Math.floor(startTime)}s de ${Math.floor(duration)}s)`);
      }
    }, 500);
  } else {
    lastSavedTime = 0; // Começando do início
  }
}

function onPlayerStateChange(event) {
  // YT.PlayerState.PLAYING = 1
  if (event.data === 1) {
    startProgressTracking();
  } else {
    stopProgressTracking();
  }
}

function startProgressTracking() {
  if (progressInterval) return;
  
  progressInterval = setInterval(() => {
    if (!player || typeof player.getCurrentTime !== 'function') return;
    
    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();
    
    if (duration > 0) {
      // PROTEÇÃO ANTI-TRAPAÇA: Verificar se usuário tentou pular
      if (currentTime > lastSavedTime + 5) {
        // Se pulou mais de 5 segundos, voltar para a posição válida
        console.warn('⚠️ Tentativa de pulo detectada! Voltando para posição válida.');
        player.seekTo(lastSavedTime, true);
        return;
      }
      
      let newProgress = (currentTime / duration) * 100;
      
      // Considerar completo se >= 98% (evita problema de não chegar a 100%)
      if (newProgress >= 98) {
        newProgress = 100;
      }
      
      newProgress = Math.min(newProgress, 100);
      
      // IMPORTANTE: Nunca retroceder o progresso
      // Se o novo progresso for menor, manter o progresso atual
      if (newProgress < currentProgress && currentProgress < 100) {
        console.log(`Progresso não retrocede: mantendo ${Math.floor(currentProgress)}% ao invés de ${Math.floor(newProgress)}%`);
        return;
      }
      
      // Atualizar progresso máximo alcançado
      if (newProgress > maxProgressReached) {
        maxProgressReached = newProgress;
      }
      
      // Atualizar apenas se houver mudança significativa (>1%)
      if (Math.abs(newProgress - currentProgress) > 1) {
        currentProgress = newProgress;
        const stars = Math.floor(currentProgress / 5);
        const trophy = currentProgress >= 100 ? 1 : 0;
        
        updateProgressUI(currentProgress, stars, trophy);
        saveProgress(currentProgress);
        
        // Atualizar última posição salva
        lastSavedTime = currentTime;
      }
    }
  }, 2000); // Verificar a cada 2 segundos
}

function stopProgressTracking() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

function updateProgressUI(progress, stars, trophy) {
  document.getElementById('progressPercent').textContent = `${Math.floor(progress)}%`;
  document.getElementById('progressFill').style.width = `${progress}%`;
  document.getElementById('starsEarned').textContent = stars;
  document.getElementById('trophyEarned').textContent = trophy;
}

async function saveProgress(progress) {
  if (!auth.isAuthenticated() || !videoData) return;

  try {
    const token = auth.getToken();
    console.log('Salvando progresso:', Math.floor(progress) + '%');
    const response = await fetch('http://localhost:3000/videos/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        videoId: videoData.id,
        progress: Math.floor(progress),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Progresso salvo! Recompensas:', data.rewards);
      
      // Atualizar estatísticas do usuário no header sempre
      updateUserStats();
      
      // Mostrar notificação de recompensas
      if (data.rewards.starsEarned > 0 || data.rewards.trophyEarned > 0) {
        showRewardNotification(data.rewards);
      }
      
      // Se completou agora, marcar flag
      if (data.completed && !videoCompleted) {
        videoCompleted = true;
      }
    } else {
      // Tratar erros (ex: tentativa de trapaça detectada)
      const errorData = await response.json();
      console.error('Erro ao salvar progresso:', errorData.message);
      
      if (response.status === 400) {
        alert('⚠️ ' + errorData.message);
        // Pausar o vídeo
        if (player && player.pauseVideo) {
          player.pauseVideo();
        }
      }
    }
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
  }
}

function showRewardNotification(rewards) {
  let message = '';
  
  if (rewards.starsEarned > 0) {
    message += `⭐ +${rewards.starsEarned} estrela(s)! `;
  }
  
  if (rewards.trophyEarned > 0) {
    message += `🏆 Parabéns! Você completou o vídeo e ganhou um troféu!`;
  }
  
  if (message) {
    // Você pode implementar um toast/notification aqui
    console.log(message);
    alert(message);
  }
}

function showCompletedWarning() {
  const warningDiv = document.createElement('div');
  warningDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 30px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    z-index: 9999;
    font-weight: bold;
    text-align: center;
    animation: slideDown 0.5s ease;
  `;
  warningDiv.innerHTML = `
    🏆 Você já completou este vídeo!<br>
    <small style="font-weight: normal; opacity: 0.9;">Não há mais recompensas para este vídeo.</small>
  `;
  
  document.body.appendChild(warningDiv);
  
  // Remover após 5 segundos
  setTimeout(() => {
    warningDiv.style.animation = 'slideUp 0.5s ease';
    setTimeout(() => warningDiv.remove(), 500);
  }, 5000);
}

// Limpar ao sair da página
export function cleanupPlayer() {
  stopProgressTracking();
  
  if (player && typeof player.destroy === 'function') {
    player.destroy();
  }
  
  player = null;
  videoData = null;
  currentProgress = 0;
  maxProgressReached = 0;
  lastSavedTime = 0;
  videoCompleted = false;
}
