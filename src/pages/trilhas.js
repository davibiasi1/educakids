const trilhas = [
  { id: "cores", titulo: "Cores", desc: "Aprenda cores com vídeos rápidos" },
  { id: "numeros", titulo: "Números", desc: "Conte e reconheça números" },
  { id: "formas", titulo: "Formas", desc: "Quadrado, círculo, triângulo..." },
];

export function TrilhasPage() {
  return `
    <section>
      <h2>Trilhas</h2>
      <div class="grid">
        ${trilhas
          .map(
            (t) => `
            <article class="card">
              <h3>${t.titulo}</h3>
              <p>${t.desc}</p>
              <a class="btn" href="#/video?trilha=${t.id}&aula=1">Assistir aula 1</a>
            </article>
          `
          )
          .join("")}
      </div>
    </section>
  `;
}
