export function AdminVideosPage() {
  return `
    <section class="page admin-page">
      <h2 class="page__title">Admin - <span class="page__titleAccent">Cadastrar Vídeos</span></h2>
      <p class="page__subtitle">Adicione novos vídeos educativos para a plataforma</p>
      
      <div class="admin-container">
        <div class="admin-form-card">
          <form id="videoForm" class="video-form">
            <div class="form-group">
              <label for="youtubeId">ID do YouTube *</label>
              <input 
                type="text" 
                id="youtubeId" 
                name="youtubeId" 
                required
                placeholder="Ex: WyA6GscP4DA"
              />
              <small>O ID está na URL: youtube.com/watch?v=<strong>ID_AQUI</strong></small>
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
export function initAdminVideosPage() {
  const form = document.getElementById('videoForm');
  const clearBtn = document.getElementById('clearFormBtn');
  const messageEl = document.getElementById('formMessage');

  // Carregar vídeos cadastrados
  loadVideosList();

  // Submit do formulário
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const videoData = {
      youtubeId: formData.get('youtubeId'),
      titulo: formData.get('titulo'),
      categoria: formData.get('categoria'),
      idade: formData.get('idade'),
    };

    try {
      const response = await fetch('http://localhost:3000/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
