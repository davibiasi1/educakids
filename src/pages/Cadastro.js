export function CadastroPage() {
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
        <h1 style="margin-bottom: 8px; font-size: 28px;">Criar conta</h1>
        <p style="margin-bottom: 24px; color: #666;">
          Cadastre o responsável para acessar o EducaKids
        </p>

        <form id="cadastro-form" style="display: grid; gap: 16px;">
          <div>
            <label
              for="nome"
              style="display: block; margin-bottom: 6px;"
            >
              Nome completo
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Digite seu nome"
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
              placeholder="Crie uma senha"
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
              for="confirmarSenha"
              style="display: block; margin-bottom: 6px;"
            >
              Confirmar senha
            </label>
            <input
              id="confirmarSenha"
              name="confirmarSenha"
              type="password"
              placeholder="Repita a senha"
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
              background-color: #22c55e;
              color: #fff;
              font-size: 16px;
              cursor: pointer;
            "
          >
            Cadastrar
          </button>

          <p style="text-align: center; margin: 0;">
            Já tem conta?
            <a href="#/login">Entrar</a>
          </p>
        </form>
      </div>
    </section>
  `;
}