export function LoginPage() {
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

        <form id="login-form" style="display: grid; gap: 16px;">
          <div>
            <label
              for="email"
              style="display: block; margin-bottom: 6px;"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
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
              name="senha"
              type="password"
              placeholder="Digite sua senha"
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
            <a href="#/cadastro">Cadastre-se</a>
          </p>
        </form>
      </div>
    </section>
  `;
}