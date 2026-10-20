import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./auth-fix.css";
import "./seo.css";
import "./nav-fix.css";

// Load full site stylesheet from last good commit (temporary until full file is restored in-repo)
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://cdn.jsdelivr.net/gh/DKTJONATHAN/hillspringacademy@06b107b/src/styles.css";
document.head.appendChild(link);

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
