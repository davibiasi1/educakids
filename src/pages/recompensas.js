import { auth, api } from '../services/api.js';
import { MEDALS, isMedalUnlocked, getMedalProgress, getRequirementText, getRarityLabel } from '../utils/medals.js';

// NOTA: As medalhas agora são importadas de utils/medals.js
// para compartilhar com perfil.js e outras páginas

/* REMOVIDO - Agora em utils/medals.js
const MEDALS = [
  // Medalhas de Estrelas
  {
    id: 1,
    name: 'Primeira Estrela',
    description: 'Ganhe sua primeira estrela',
    icon: '⭐',
    requirement: { stars: 1 },
    rarity: 'bronze'
  },
  {
    id: 2,
    name: 'Colecionador Iniciante',
    description: 'Colete 10 estrelas',
    icon: '🌟',
    requirement: { stars: 10 },
    rarity: 'bronze'
  },
  {
    id: 3,
    name: 'Caçador de Estrelas',
    description: 'Colete 25 estrelas',
    icon: '✨',
    requirement: { stars: 25 },
    rarity: 'silver'
  },
  {
    id: 4,
    name: 'Estrela Brilhante',
    description: 'Colete 50 estrelas',
    icon: '💫',
    requirement: { stars: 50 },
    rarity: 'gold'
  },
  {
    id: 5,
    name: 'Constelação',
    description: 'Colete 100 estrelas',
    icon: '🌠',
    requirement: { stars: 100 },
    rarity: 'gold'
  },
  {
    id: 6,
    name: 'Galáxia de Estrelas',
    description: 'Colete 200 estrelas',
    icon: '🌌',
    requirement: { stars: 200 },
    rarity: 'legendary'
  },

  // Medalhas de Troféus
  {
    id: 7,
    name: 'Primeiro Troféu',
    description: 'Conquiste seu primeiro troféu',
    icon: '🏆',
    requirement: { trophies: 1 },
    rarity: 'bronze'
  },
  {
    id: 8,
    name: 'Colecionador de Troféus',
    description: 'Conquiste 3 troféus',
    icon: '🥇',
    requirement: { trophies: 3 },
    rarity: 'bronze'
  },
  {
    id: 9,
    name: 'Campeão Júnior',
    description: 'Conquiste 5 troféus',
    icon: '🥈',
    requirement: { trophies: 5 },
    rarity: 'silver'
  },
  {
    id: 10,
    name: 'Mestre dos Troféus',
    description: 'Conquiste 10 troféus',
    icon: '🥉',
    requirement: { trophies: 10 },
    rarity: 'gold'
  },
  {
    id: 11,
    name: 'Campeão Supremo',
    description: 'Conquiste 15 troféus',
    icon: '👑',
    requirement: { trophies: 15 },
    rarity: 'legendary'
  },

  // Medalhas Combinadas (Estrelas + Troféus)
  {
    id: 12,
    name: 'Aprendiz Dedicado',
    description: 'Ganhe 5 estrelas e 2 troféus',
    icon: '🎓',
    requirement: { stars: 5, trophies: 2 },
    rarity: 'bronze'
  },
  {
    id: 13,
    name: 'Estudante Exemplar',
    description: 'Ganhe 20 estrelas e 4 troféus',
    icon: '📚',
    requirement: { stars: 20, trophies: 4 },
    rarity: 'silver'
  },
  {
    id: 14,
    name: 'Gênio em Desenvolvimento',
    description: 'Ganhe 40 estrelas e 7 troféus',
    icon: '🧠',
    requirement: { stars: 40, trophies: 7 },
    rarity: 'gold'
  },
  {
    id: 15,
    name: 'Prodígio do Conhecimento',
    description: 'Ganhe 80 estrelas e 12 troféus',
    icon: '🎯',
    requirement: { stars: 80, trophies: 12 },
    rarity: 'gold'
  },
  {
    id: 16,
    name: 'Mestre do Saber',
    description: 'Ganhe 150 estrelas e 20 troféus',
    icon: '🔮',
    requirement: { stars: 150, trophies: 20 },
    rarity: 'legendary'
  },

  // Medalhas Especiais
  {
    id: 17,
    name: 'Explorador Curioso',
    description: 'Ganhe 15 estrelas',
    icon: '🔍',
    requirement: { stars: 15 },
    rarity: 'bronze'
  },
  {
    id: 18,
    name: 'Persistente',
    description: 'Ganhe 30 estrelas e 5 troféus',
    icon: '💪',
    requirement: { stars: 30, trophies: 5 },
    rarity: 'silver'
  },
  {
    id: 19,
    name: 'Imbatível',
    description: 'Ganhe 100 estrelas e 15 troféus',
    icon: '🚀',
    requirement: { stars: 100, trophies: 15 },
    rarity: 'legendary'
  },
  {
    id: 20,
    name: 'Lenda do EducaKids',
    description: 'Ganhe 250 estrelas e 25 troféus',
    icon: '🌟',
    requirement: { stars: 250, trophies: 25 },
    rarity: 'legendary'
  }
];
*/

export function RecompensasPage() {
  return `
    <section class="recompensas-page">
      <div class="page-header">
        <h2 class="page__title">🏆 Recompensas</h2>
        <p class="page__subtitle">Conquiste medalhas conforme você aprende e evolui!</p>
      </div>

      <div class="recompensas-stats">
        <div class="recompensas-stat">
          <span class="recompensas-stat-icon">⭐</span>
          <div>
            <h3 id="total-stars">0</h3>
            <p>Estrelas</p>
          </div>
        </div>
        <div class="recompensas-stat">
          <span class="recompensas-stat-icon">🏆</span>
          <div>
            <h3 id="total-trophies">0</h3>
            <p>Troféus</p>
          </div>
        </div>
        <div class="recompensas-stat">
          <span class="recompensas-stat-icon">🎖️</span>
          <div>
            <h3 id="total-medals">0</h3>
            <p>Medalhas</p>
          </div>
        </div>
      </div>

      <div class="medals-filters">
        <button class="filter-btn active" data-filter="all">Todas</button>
        <button class="filter-btn" data-filter="unlocked">Conquistadas</button>
        <button class="filter-btn" data-filter="locked">Bloqueadas</button>
        <button class="filter-btn" data-filter="bronze">Bronze</button>
        <button class="filter-btn" data-filter="silver">Prata</button>
        <button class="filter-btn" data-filter="gold">Ouro</button>
        <button class="filter-btn" data-filter="legendary">Lendárias</button>
      </div>

      <div id="medals-container" class="medals-grid">
        <p class="loading-message">Carregando medalhas...</p>
      </div>
    </section>
  `;
}

export async function initRecompensasPage() {
  console.log('🏆 Iniciando página de recompensas...');

  try {
    // Buscar dados do perfil
    const profile = await api.getProfile();
    console.log('📊 Dados do perfil:', profile);

    const userStars = profile.stars || 0;
    const userTrophies = profile.trophies || 0;

    // Atualizar estatísticas
    document.getElementById('total-stars').textContent = userStars;
    document.getElementById('total-trophies').textContent = userTrophies;

    // Calcular medalhas conquistadas (agora usando função importada)
    const unlockedMedals = MEDALS.filter(medal => isMedalUnlocked(medal, userStars, userTrophies));
    document.getElementById('total-medals').textContent = `${unlockedMedals.length}/${MEDALS.length}`;

    // Renderizar medalhas
    renderMedals('all', userStars, userTrophies);

    // Setup dos filtros
    setupFilters(userStars, userTrophies);

  } catch (error) {
    console.error('❌ Erro ao carregar recompensas:', error);
    document.getElementById('medals-container').innerHTML = `
      <p class="error-message">Erro ao carregar medalhas. Tente novamente mais tarde.</p>
    `;
  }
}

// NOTA: isMedalUnlocked, getMedalProgress e outras funções auxiliares
// agora estão em utils/medals.js

function renderMedals(filter, userStars, userTrophies) {
  const container = document.getElementById('medals-container');
  
  let filteredMedals = [...MEDALS];
  
  // Aplicar filtros
  if (filter === 'unlocked') {
    filteredMedals = filteredMedals.filter(m => isMedalUnlocked(m, userStars, userTrophies));
  } else if (filter === 'locked') {
    filteredMedals = filteredMedals.filter(m => !isMedalUnlocked(m, userStars, userTrophies));
  } else if (filter !== 'all') {
    filteredMedals = filteredMedals.filter(m => m.rarity === filter);
  }

  if (filteredMedals.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Nenhuma medalha encontrada nesta categoria.</p>
      </div>
    `;
    return;
  }

  const medalsHTML = filteredMedals.map(medal => {
    const unlocked = isMedalUnlocked(medal, userStars, userTrophies);
    const progress = getMedalProgress(medal, userStars, userTrophies);
    
    return `
      <div class="medal-card ${unlocked ? 'medal-card--unlocked' : 'medal-card--locked'} medal-card--${medal.rarity}">
        <div class="medal-icon ${unlocked ? '' : 'medal-icon--locked'}">
          ${medal.icon}
        </div>
        <h3 class="medal-name">${medal.name}</h3>
        <p class="medal-description">${medal.description}</p>
        
        <div class="medal-requirement">
          ${getRequirementText(medal.requirement)}
        </div>
        
        ${unlocked ? `
          <div class="medal-unlocked-badge">
            <span>✓</span> Conquistada!
          </div>
        ` : `
          <div class="medal-progress">
            <div class="medal-progress-bar">
              <div class="medal-progress-fill" style="width: ${progress}%"></div>
            </div>
            <small>${Math.round(progress)}% completo</small>
          </div>
        `}
        
        <div class="medal-rarity medal-rarity--${medal.rarity}">
          ${getRarityLabel(medal.rarity)}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = medalsHTML;
}

// NOTA: getRequirementText e getRarityLabel agora estão em utils/medals.js

function setupFilters(userStars, userTrophies) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover active de todos
      filterButtons.forEach(b => b.classList.remove('active'));
      
      // Adicionar active no clicado
      btn.classList.add('active');
      
      // Renderizar com filtro
      const filter = btn.dataset.filter;
      renderMedals(filter, userStars, userTrophies);
    });
  });
}
