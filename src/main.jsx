import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./auth-fix.css";
import "./seo.css";
import "./nav-fix.css";
import "./styles.css";
import "./forms-unslop.css";
import "./site-unslop.css";


const rootEl = document.getElementById("root");

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Hydrate when the Worker already injected SSR HTML; otherwise client-render
if (rootEl && rootEl.hasChildNodes() && rootEl.querySelector(".skip, header, main, .page")) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}

document.documentElement.classList.add("app-ready");

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
  });
}
