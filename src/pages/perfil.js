import { auth } from '../services/api.js';

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
          <p>Acompanhe sua pontuação, recompensas e progresso no EducaKids.</p>
        </div>
      </div>

      <section class="perfil-stats">
        <div class="perfil-stat-card perfil-stat-card--gold">
          <span class="perfil-stat-icon">★</span>
          <h2>245</h2>
          <p>Pontos acumulados</p>
        </div>

        <div class="perfil-stat-card perfil-stat-card--purple">
          <span class="perfil-stat-icon">🏆</span>
          <h2>12</h2>
          <p>Recompensas conquistadas</p>
        </div>

        <div class="perfil-stat-card perfil-stat-card--mint">
          <span class="perfil-stat-icon">📚</span>
          <h2>8</h2>
          <p>Aulas concluídas</p>
        </div>
      </section>

      <section class="perfil-content-grid">
        <div class="perfil-box">
          <h2>Meu progresso</h2>

          <div class="perfil-progress-item">
            <div class="perfil-progress-info">
              <span>Matemática divertida</span>
              <strong>80%</strong>
            </div>
            <div class="perfil-progress-bar">
              <div style="width: 80%;"></div>
            </div>
          </div>

          <div class="perfil-progress-item">
            <div class="perfil-progress-info">
              <span>Leitura e interpretação</span>
              <strong>60%</strong>
            </div>
            <div class="perfil-progress-bar">
              <div style="width: 60%;"></div>
            </div>
          </div>

          <div class="perfil-progress-item">
            <div class="perfil-progress-info">
              <span>Ciências para crianças</span>
              <strong>45%</strong>
            </div>
            <div class="perfil-progress-bar">
              <div style="width: 45%;"></div>
            </div>
          </div>
        </div>

        <div class="perfil-box">
          <h2>Últimas recompensas</h2>

          <div class="perfil-reward">
            <span>🏅</span>
            <div>
              <strong>Explorador do Conhecimento</strong>
              <p>Conquistado ao concluir 5 aulas.</p>
            </div>
          </div>

          <div class="perfil-reward">
            <span>⭐</span>
            <div>
              <strong>Aluno Estrela</strong>
              <p>Conquistado por alcançar 200 pontos.</p>
            </div>
          </div>

          <div class="perfil-reward">
            <span>🚀</span>
            <div>
              <strong>Missão Cumprida</strong>
              <p>Conquistado ao finalizar uma trilha.</p>
            </div>
          </div>
        </div>
      </section>
    </section>
  `;
}