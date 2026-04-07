import { api, auth } from '../services/api.js';

export function LoginPage() {
  // Registrar event listener após a renderização
  requestAnimationFrame(() => {
    const form = document.getElementById('login-form');
    if (!form) return;

    // Adicionar onsubmit diretamente também
    form.onsubmit = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const errorDiv = document.getElementById('error-message');
      const submitBtn = document.getElementById('submit-btn');
      
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;

      // Função para mostrar erro
      const showError = (message) => {
        if (errorDiv) {
          errorDiv.textContent = message;
          errorDiv.style.display = 'block';
        }
      };

      // Limpar mensagem de erro
      if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
      }

      // Validação básica
      if (!email || !senha) {
        showError('Preencha todos os campos');
        return false;
      }

      // Desabilitar botão durante o carregamento
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Entrando...';
      }

      try {
        const response = await api.login(email, senha);
        
        // Salvar token e usuário
        auth.saveToken(response.token);
        auth.saveUser(response.user);

        // Redirecionar para home
        window.location.hash = '#/';
      } catch (error) {
        showError(error.message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Entrar';
        }
      }

      return false;
    };
  });

  return `
    <section
      style="
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f4f8ff;
        padding: 24px;
        box-sizing: border-box;
      "
    >
      <div
        style="
          width: 100%;
          max-width: 420px;
          background-color: #ffffff;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          box-sizing: border-box;
        "
      >
        <h1 style="margin-bottom: 8px; font-size: 28px;">Entrar</h1>
        <p style="margin-bottom: 24px; color: #666;">
          Acesse sua conta no EducaKids
        </p>

        <div 
          id="error-message" 
          style="
            display: none;
            padding: 12px;
            margin-bottom: 16px;
            background-color: #fee2e2;
            border: 1px solid #ef4444;
            border-radius: 8px;
            color: #dc2626;
            font-size: 14px;
          "
        ></div>

        <form id="login-form" action="javascript:void(0);" method="post" style="display: grid; gap: 16px;">
          <div>
            <label
              for="email"
              style="display: block; margin-bottom: 6px;"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              required
              autocomplete="email"
              style="
                width: 100%;
                padding: 12px;
                border-radius: 10px;
                border: 1px solid #ccc;
                font-size: 14px;
                box-sizing: border-box;
              "
            />
          </div>

          <div>
            <label
              for="senha"
              style="display: block; margin-bottom: 6px;"
            >
              Senha
            </label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              required
              autocomplete="current-password"
              style="
                width: 100%;
                padding: 12px;
                border-radius: 10px;
                border: 1px solid #ccc;
                font-size: 14px;
                box-sizing: border-box;
              "
            />
          </div>

          <button
            id="submit-btn"
            type="submit"
            style="
              padding: 12px;
              border: none;
              border-radius: 10px;
              background-color: #4f46e5;
              color: #fff;
              font-size: 16px;
              cursor: pointer;
            "
          >
            Entrar
          </button>

          <p style="text-align: center; margin: 0;">
            Ainda não tem conta?
            <a href="#/cadastro" style="color: #4f46e5; text-decoration: none; font-weight: 500;">Cadastre-se</a>
          </p>
        </form>
      </div>
    </section>
  `;
}