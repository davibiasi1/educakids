import { renderLayout } from "./components/layout.js";
import { initRouter } from "./router.js";

export function startApp() {
  const root = document.querySelector("#app");
  root.innerHTML = renderLayout();   // monta header/nav + área de conteúdo
  initRouter();                      // liga o roteamento
}
