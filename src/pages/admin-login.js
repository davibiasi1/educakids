import { adminAuth } from '../services/api.js';
import { API_URL } from '../config.js';

export function AdminLoginPage() {
  requestAnimationFrame(() => {
    const form = document.getElementById('adminLoginForm');
    if (!form) return;

    form.onsubmit = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const errorDiv = document.getElementById('adminLoginError');
      const btn = document.getElementById('adminLoginBtn');

      const showError = (msg) => {
        if (errorDiv) {
          errorDiv.textContent = msg;
          errorDiv.style.display = 'block';
        }
      };

      if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
      }

      const email    = document.getElementById('adminEmail').value;
      const password = document.getElementById('adminPassword').value;

      if (!email || !password) {
        showError('Preencha todos os campos');
        return false;
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Entrando...'; }

      try {
        const response = await fetch(`${API_URL}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Credenciais inválidas');

        adminAuth.saveToken(data.token);
        adminAuth.saveAdmin(data.admin);
        window.location.hash = '#/admin-videos';
      } catch (err) {
        showError('❌ ' + err.message);
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Entrar como Admin'; }
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
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🔐</div>
          <h1 style="margin: 0 0 6px; font-size: 26px;">Acesso Admin</h1>
          <p style="margin: 0; color: #666; font-size: 14px;">Área restrita — EducaKids</p>
        </div>

        <div
          id="adminLoginError"
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

        <form id="adminLoginForm" action="javascript:void(0);" method="post" style="display: grid; gap: 16px;">
          <div>
            <label for="adminEmail" style="display: block; margin-bottom: 6px;">E-mail</label>
            <input
              id="adminEmail"
              type="email"
              placeholder="admin@educakids.com"
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
            <label for="adminPassword" style="display: block; margin-bottom: 6px;">Senha</label>
            <input
              id="adminPassword"
              type="password"
              placeholder="••••••••"
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
            id="adminLoginBtn"
            type="submit"
            style="
              padding: 12px;
              border: none;
              border-radius: 10px;
              background-color: #ff7f50;
              color: #fff;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: opacity 0.2s;
            "
            onmouseover="this.style.opacity='0.88'"
            onmouseout="this.style.opacity='1'"
          >
            Entrar como Admin
          </button>
        </form>
      </div>
    </section>
  `;
}

export function initAdminLoginPage() {
  if (adminAuth.isAuthenticated()) {
    window.location.hash = '#/admin-videos';
  }
}
