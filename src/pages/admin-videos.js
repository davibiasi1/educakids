import { adminAuth } from '../services/api.js';

export function AdminVideosPage() {
  if (!adminAuth.isAuthenticated()) {
    return `
      <section class="page" style="display:flex;align-items:center;justify-content:center;min-height:60vh;">
        <div style="text-align:center;">
          <div style="font-size:3rem;margin-bottom:16px;">🔐</div>
          <h2>Acesso restrito</h2>
          <p style="color:var(--muted);margin:8px 0 24px;">Esta área é exclusiva para administradores.</p>
          <a class="btn btn--primary" href="#/admin-login">Entrar como Admin</a>
        </div>
      </section>
    `;
  }

  return `
    <section class="page admin-page">
      <h2 class="page__title">Admin - <span class="page__titleAccent">Cadastrar Vídeos</span></h2>
      <p class="page__subtitle">Adicione novos vídeos educativos para a plataforma</p>
      
      <div class="admin-container">
        <div class="admin-form-card">
          <form id="videoForm" class="video-form">
            <div class="form-group">
              <label for="youtubeId">Link ou ID do YouTube *</label>
              <input
                type="text"
                id="youtubeId"
                name="youtubeId"
                required
                placeholder="Cole o link ou ID: https://youtube.com/watch?v=..."
              />
              <small id="youtubeIdHint">Cole o link completo do YouTube — o ID será extraído automaticamente.</small>
            </div>

            <div class="form-group">
              <label for="titulo">Título *</label>
              <input 
                type="text" 
                id="titulo" 
                name="titulo" 
                required
                placeholder="Ex: Música A E I O U"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="categoria">Categoria *</label>
                <select id="categoria" name="categoria" required>
                  <option value="">Selecione...</option>
                  <option value="Português">Português</option>
                  <option value="Matemática">Matemática</option>
                  <option value="Artes">Artes</option>
                  <option value="Ciências">Ciências</option>
                  <option value="História">História</option>
                  <option value="Geografia">Geografia</option>
                  <option value="Música">Música</option>
                </select>
              </div>

              <div class="form-group">
                <label for="idade">Idade *</label>
                <select id="idade" name="idade" required>
                  <option value="">Selecione...</option>
                  <option value="2 anos">2 anos</option>
                  <option value="3 anos">3 anos</option>
                  <option value="4 anos">4 anos</option>
                  <option value="5 anos">5 anos</option>
                  <option value="6 anos">6 anos</option>
                  <option value="7 anos">7 anos</option>
                  <option value="8 anos">8 anos</option>
                  <option value="9 anos">9 anos</option>
                  <option value="10 anos">10 anos</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn--primary">
                ➕ Cadastrar Vídeo
              </button>
              <button type="button" id="clearFormBtn" class="btn btn--ghost">
                🗑️ Limpar
              </button>
            </div>
          </form>

          <div id="formMessage" class="form-message"></div>
        </div>

        <div class="admin-videos-list" id="videosList">
          <h3>Vídeos Cadastrados</h3>
          <div id="videosListContent">Carregando...</div>
        </div>
      </div>
    </section>
  `;
}

// Inicializar a página
export async function initAdminVideosPage() {
  // Verificar token localmente primeiro (rápido)
  if (!adminAuth.isAuthenticated()) {
    window.location.hash = '#/admin-login';
    return;
  }

  // Validar token contra o backend (garante que não é inválido/expirado)
  try {
    const res = await fetch('http://localhost:3000/admin/me', {
      headers: { Authorization: `Bearer ${adminAuth.getToken()}` },
    });
    if (!res.ok) throw new Error('Token inválido');
  } catch {
    adminAuth.logout();
    window.location.hash = '#/admin-login';
    return;
  }

  const form = document.getElementById('videoForm');
  const clearBtn = document.getElementById('clearFormBtn');
  const messageEl = document.getElementById('formMessage');
  const youtubeInput = document.getElementById('youtubeId');
  const youtubeHint = document.getElementById('youtubeIdHint');

  // Extrai o ID do YouTube de qualquer formato de URL
  function extractYoutubeId(value) {
    const trimmed = value.trim();
    // Formatos suportados:
    // youtube.com/watch?v=ID
    // youtu.be/ID
    // youtube.com/embed/ID
    // youtube.com/shorts/ID
    const patterns = [
      /[?&]v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /\/embed\/([a-zA-Z0-9_-]{11})/,
      /\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const re of patterns) {
      const match = trimmed.match(re);
      if (match) return match[1];
    }
    // Se já for apenas o ID (11 caracteres alfanuméricos)
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    return null;
  }

  youtubeInput?.addEventListener('input', () => {
    const val = youtubeInput.value;
    if (!val.includes('youtube') && !val.includes('youtu.be')) return;

    const id = extractYoutubeId(val);
    if (id) {
      youtubeInput.value = id;
      youtubeInput.style.borderColor = 'var(--mint)';
      youtubeHint.innerHTML = `✅ ID extraído: <strong>${id}</strong>`;
      youtubeHint.style.color = 'var(--mint)';
    } else {
      youtubeInput.style.borderColor = '#ff7f50';
      youtubeHint.textContent = '❌ Link inválido. Use: youtube.com/watch?v=ID ou youtu.be/ID';
      youtubeHint.style.color = '#ff7f50';
    }
  });

  youtubeInput?.addEventListener('blur', () => {
    const id = extractYoutubeId(youtubeInput.value);
    if (!id) {
      youtubeInput.style.borderColor = '';
      youtubeHint.innerHTML = 'Cole o link completo do YouTube — o ID será extraído automaticamente.';
      youtubeHint.style.color = '';
    }
  });

  // Carregar vídeos cadastrados
  loadVideosList();

  // Submit do formulário
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const rawYoutubeId = formData.get('youtubeId');
    const resolvedId = extractYoutubeId(rawYoutubeId) || rawYoutubeId;
    const videoData = {
      youtubeId: resolvedId,
      titulo: formData.get('titulo'),
      categoria: formData.get('categoria'),
      idade: formData.get('idade'),
    };

    try {
      const response = await fetch('http://localhost:3000/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminAuth.getToken()}`,
        },
        body: JSON.stringify(videoData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar vídeo');
      }

      showMessage('✅ Vídeo cadastrado com sucesso!', 'success');
      form.reset();
      loadVideosList();
    } catch (error) {
      showMessage('❌ ' + error.message, 'error');
    }
  });

  // Limpar formulário
  clearBtn?.addEventListener('click', () => {
    form?.reset();
    messageEl.textContent = '';
    messageEl.className = 'form-message';
  });

  function showMessage(message, type) {
    messageEl.textContent = message;
    messageEl.className = `form-message form-message--${type}`;
    
    setTimeout(() => {
      messageEl.textContent = '';
      messageEl.className = 'form-message';
    }, 5000);
  }

  async function loadVideosList() {
    const listContent = document.getElementById('videosListContent');
    
    try {
      const response = await fetch('http://localhost:3000/videos');
      const videos = await response.json();

      if (videos.length === 0) {
        listContent.innerHTML = '<p class="no-videos">Nenhum vídeo cadastrado ainda.</p>';
        return;
      }

      listContent.innerHTML = videos.map(video => `
        <div class="video-item">
          <div class="video-item-thumb">
            <img 
              src="https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg" 
              alt="${video.titulo}"
            />
          </div>
          <div class="video-item-info">
            <h4>${video.titulo}</h4>
            <div class="video-item-meta">
              <span class="badge badge--category">${video.categoria}</span>
              <span class="badge badge--age">${video.idade}</span>
            </div>
          </div>
          <button 
            class="btn btn--danger btn--sm" 
            data-video-id="${video.id}"
          >
            🗑️
          </button>
        </div>
      `).join('');
      
      // Adicionar event listeners para os botões de deletar
      const deleteButtons = listContent.querySelectorAll('.btn--danger');
      deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const videoId = btn.getAttribute('data-video-id');
          deleteVideo(videoId);
        });
      });
    } catch (error) {
      listContent.innerHTML = '<p class="error-message">Erro ao carregar vídeos.</p>';
    }
  }

  async function deleteVideo(videoId) {
    if (!confirm('Tem certeza que deseja excluir este vídeo?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminAuth.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir vídeo');
      }

      showMessage('✅ Vídeo excluído com sucesso!', 'success');
      loadVideosList();
    } catch (error) {
      showMessage('❌ ' + error.message, 'error');
    }
  }
}
