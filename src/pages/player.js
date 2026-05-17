import { auth } from '../services/api.js';
import { API_URL } from '../config.js';
import { updateUserStats } from '../components/layout.js';

let player;
let videoData;
let progressInterval;
let currentProgress = 0;
let maxProgressReached = 0;
let maxStarsEarned = 0; // Estrelas máximas já conquistadas neste vídeo
let lastSavedTime = 0;
let videoCompleted = false;

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
    const response = await fetch(`${API_URL}/videos/${videoId}`);
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
        const progressResponse = await fetch(`${API_URL}/videos/progress/${videoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          currentProgress = progressData.progress || 0;
          maxProgressReached = currentProgress;
          maxStarsEarned = progressData.stars || 0;
          videoCompleted = progressData.completed || false;
          updateProgressUI(currentProgress, progressData.stars || 0, progressData.completed ? 1 : 0);
          if (videoCompleted) {
            showCompletedWarning();
          }
        }
      } catch {
        // sem progresso anterior
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
  if (currentProgress > 0 && currentProgress < 100) {
    setTimeout(() => {
      const duration = player.getDuration();
      if (duration > 0) {
        const startTime = (currentProgress / 100) * duration;
        player.seekTo(startTime, true);
        lastSavedTime = startTime;
      }
    }, 500);
  } else {
    lastSavedTime = 0;
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
      if (currentTime > lastSavedTime + 10) {
        player.seekTo(lastSavedTime, true);
        return;
      }

      // Sempre avançar lastSavedTime para evitar falsos positivos no anti-pulo
      lastSavedTime = currentTime;

      let newProgress = (currentTime / duration) * 100;

      // Considerar completo se >= 98% (evita problema de não chegar a 100%)
      if (newProgress >= 98) {
        newProgress = 100;
      }

      newProgress = Math.min(newProgress, 100);

      // Nunca retroceder a barra de progresso
      if (newProgress < maxProgressReached) {
        return;
      }

      // Atualizar progresso máximo alcançado
      if (newProgress > maxProgressReached) {
        maxProgressReached = newProgress;
      }

      // Atualizar apenas se houver mudança significativa (>1%)
      if (Math.abs(newProgress - currentProgress) > 1) {
        currentProgress = newProgress;
        const calculatedStars = Math.floor(currentProgress / 5);
        // Nunca exibir menos estrelas do que o máximo já conquistado
        const stars = Math.max(calculatedStars, maxStarsEarned);
        if (calculatedStars > maxStarsEarned) maxStarsEarned = calculatedStars;
        const trophy = videoCompleted || currentProgress >= 100 ? 1 : 0;

        updateProgressUI(currentProgress, stars, trophy);
        saveProgress(currentProgress);
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
    const response = await fetch(`${API_URL}/videos/progress`, {
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
  if (rewards.starsEarned > 0) {
    spawnStarFloat();
    const burstCount = Math.min(rewards.starsEarned + 2, 5);
    for (let b = 0; b < burstCount; b++) {
      setTimeout(() => spawnFireworkBurst(), b * 260);
    }
  }

  if (rewards.trophyEarned > 0) {
    spawnTrophyBanner();
  }
}

function spawnStarFloat() {
  const directions = [
    { tx: '-110px', left: '35vw' },
    { tx:  '110px', left: '58vw' },
  ];
  const baseTop = 45 + Math.random() * 15;
  const centerLeft = '46vw';

  // +1 no centro
  const plus = document.createElement('div');
  plus.className = 'reward-plus-one';
  plus.textContent = '+1';
  plus.style.left = centerLeft;
  plus.style.top  = baseTop + 'vh';
  document.body.appendChild(plus);
  plus.addEventListener('animationend', () => plus.remove());

  // estrela do centro (sobe reto)
  const centerStar = document.createElement('div');
  centerStar.className = 'reward-star-float';
  centerStar.textContent = '⭐';
  centerStar.style.left = centerLeft;
  centerStar.style.top  = baseTop + 'vh';
  centerStar.style.setProperty('--tx', '0px');
  document.body.appendChild(centerStar);
  centerStar.addEventListener('animationend', () => centerStar.remove());

  // estrelas laterais
  directions.forEach(({ tx, left }, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'reward-star-float';
      el.textContent = '⭐';
      el.style.left = left;
      el.style.top  = baseTop + 'vh';
      el.style.setProperty('--tx', tx);
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 120);
  });
}

function spawnFireworkBurst() {
  const burst = document.createElement('div');
  burst.className = 'fw-burst';
  burst.style.left = (10 + Math.random() * 80) + 'vw';
  burst.style.top  = (10 + Math.random() * 70) + 'vh';
  document.body.appendChild(burst);

  const EMOJIS = ['⭐', '✨', '🌟', '💫'];
  const count  = 14;
  for (let i = 0; i < count; i++) {
    const angle    = (i / count) * 360;
    const dist     = 70 + Math.random() * 70;
    const rad      = (angle * Math.PI) / 180;
    const p        = document.createElement('div');
    p.className    = 'fw-particle';
    p.textContent  = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    p.style.setProperty('--tx', Math.cos(rad) * dist + 'px');
    p.style.setProperty('--ty', Math.sin(rad) * dist + 'px');
    p.style.setProperty('--delay', (Math.random() * 0.15) + 's');
    burst.appendChild(p);
  }

  setTimeout(() => burst.remove(), 1400);
}

function spawnTrophyBanner() {
  const baseTop    = 38 + Math.random() * 12;
  const centerLeft = '46vw';
  const directions = [
    { tx: '-120px', left: '33vw' },
    { tx:  '120px', left: '60vw' },
  ];

  // "+1 🏆" central
  const plus = document.createElement('div');
  plus.className   = 'reward-trophy-plus-one';
  plus.textContent = '+1 🏆';
  plus.style.left  = centerLeft;
  plus.style.top   = baseTop + 'vh';
  document.body.appendChild(plus);
  plus.addEventListener('animationend', () => plus.remove());

  // troféu central sobe reto
  const center = document.createElement('div');
  center.className = 'reward-trophy-float';
  center.textContent = '🏆';
  center.style.left  = centerLeft;
  center.style.top   = baseTop + 'vh';
  center.style.setProperty('--tx', '0px');
  document.body.appendChild(center);
  center.addEventListener('animationend', () => center.remove());

  // troféus laterais
  directions.forEach(({ tx, left }, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className   = 'reward-trophy-float';
      el.textContent = '🏆';
      el.style.left  = left;
      el.style.top   = baseTop + 'vh';
      el.style.setProperty('--tx', tx);
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 140);
  });

  // rajadas de fogos extras (5 bursts com emojis mistos)
  const TROPHY_EMOJIS = ['🏆', '⭐', '✨', '🌟', '💫'];
  for (let b = 0; b < 5; b++) {
    setTimeout(() => {
      const burst = document.createElement('div');
      burst.className = 'fw-burst';
      burst.style.left = (10 + Math.random() * 80) + 'vw';
      burst.style.top  = (10 + Math.random() * 70) + 'vh';
      document.body.appendChild(burst);
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * 360;
        const dist  = 80 + Math.random() * 80;
        const rad   = (angle * Math.PI) / 180;
        const p     = document.createElement('div');
        p.className   = 'fw-particle';
        p.textContent = TROPHY_EMOJIS[Math.floor(Math.random() * TROPHY_EMOJIS.length)];
        p.style.setProperty('--tx', Math.cos(rad) * dist + 'px');
        p.style.setProperty('--ty', Math.sin(rad) * dist + 'px');
        p.style.setProperty('--delay', (Math.random() * 0.2) + 's');
        burst.appendChild(p);
      }
      setTimeout(() => burst.remove(), 1500);
    }, b * 300);
  }

  // banner inferior com delay para não sobrepor os efeitos
  setTimeout(() => {
    const banner = document.createElement('div');
    banner.className = 'reward-trophy-banner';
    banner.innerHTML = '🏆 Parabéns! Vídeo concluído e troféu conquistado!';
    document.body.appendChild(banner);
    banner.addEventListener('animationend', () => banner.remove());
  }, 600);
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

export function isPlayerActive() {
  return !!(player && !videoCompleted);
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
  maxStarsEarned = 0;
  lastSavedTime = 0;
  videoCompleted = false;
}
