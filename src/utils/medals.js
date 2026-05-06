// Definição de todas as medalhas disponíveis
export const MEDALS = [
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

// Verifica se uma medalha está desbloqueada
export function isMedalUnlocked(medal, userStars, userTrophies) {
  const req = medal.requirement;
  
  if (req.stars !== undefined && req.trophies !== undefined) {
    // Requer ambos
    return userStars >= req.stars && userTrophies >= req.trophies;
  } else if (req.stars !== undefined) {
    // Requer apenas estrelas
    return userStars >= req.stars;
  } else if (req.trophies !== undefined) {
    // Requer apenas troféus
    return userTrophies >= req.trophies;
  }
  
  return false;
}

// Calcula o progresso de uma medalha (0-100%)
export function getMedalProgress(medal, userStars, userTrophies) {
  const req = medal.requirement;
  
  if (req.stars !== undefined && req.trophies !== undefined) {
    const starsProgress = Math.min((userStars / req.stars) * 100, 100);
    const trophiesProgress = Math.min((userTrophies / req.trophies) * 100, 100);
    return Math.min(starsProgress, trophiesProgress);
  } else if (req.stars !== undefined) {
    return Math.min((userStars / req.stars) * 100, 100);
  } else if (req.trophies !== undefined) {
    return Math.min((userTrophies / req.trophies) * 100, 100);
  }
  
  return 0;
}

// Retorna texto de requisito formatado
export function getRequirementText(req) {
  const parts = [];
  
  if (req.stars !== undefined) {
    parts.push(`⭐ ${req.stars} estrela${req.stars > 1 ? 's' : ''}`);
  }
  
  if (req.trophies !== undefined) {
    parts.push(`🏆 ${req.trophies} troféu${req.trophies > 1 ? 's' : ''}`);
  }
  
  return parts.join(' + ');
}

// Retorna label de raridade
export function getRarityLabel(rarity) {
  const labels = {
    bronze: 'Bronze',
    silver: 'Prata',
    gold: 'Ouro',
    legendary: 'Lendária'
  };
  return labels[rarity] || rarity;
}

// Retorna todas as medalhas desbloqueadas
export function getUnlockedMedals(userStars, userTrophies) {
  return MEDALS.filter(medal => isMedalUnlocked(medal, userStars, userTrophies));
}

// Retorna as próximas medalhas a serem desbloqueadas (ordenadas por progresso)
export function getNextMedals(userStars, userTrophies, limit = 3) {
  const locked = MEDALS.filter(medal => !isMedalUnlocked(medal, userStars, userTrophies));
  
  return locked
    .map(medal => ({
      ...medal,
      progress: getMedalProgress(medal, userStars, userTrophies)
    }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, limit);
}
