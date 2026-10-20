import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App.jsx";

const SITE = "https://hillspringsacademy.sc.ke";

const PAGE_TITLES = {
  "/": "Hill Springs Academy | Private School in Maua, Meru County",
  "/about": "About Hill Springs Academy | Private School in Maua",
  "/academics": "Academics | Hill Springs Academy, Maua",
  "/admissions": "Admissions | Hill Springs Academy, Maua",
  "/signup": "Join Hill Springs Academy | Sign up",
  "/apply": "Apply to Hill Springs Academy | Maua",
  "/enquire": "Make an enquiry | Hill Springs Academy",
  "/school-life": "School Life | Hill Springs Academy, Maua",
  "/gallery": "Gallery | Hill Springs Academy, Maua",
  "/reading-materials": "Learning Resources | Hill Springs Academy, Maua",
  "/fees": "School Fees | Hill Springs Academy, Maua",
  "/uniforms": "Uniforms | Hill Springs Academy, Maua",
  "/faq": "FAQ | Hill Springs Academy, Maua",
  "/contact": "Contact Hill Springs Academy | Maua, Meru County",
  "/blog": "Blog | Hill Springs Academy, Maua",
  "/directors": "Leadership | Hill Springs Academy, Maua",
  "/privacy": "Privacy | Hill Springs Academy",
  "/terms": "Terms of Service | Hill Springs Academy",
  "/refund-policy": "Refund Policy | Hill Springs Academy",
  "/delete-account": "Delete account help | Hill Springs Academy",
  "/sitemap": "Sitemap | Hill Springs Academy, Maua",
  "/admin": "Admin | Hill Springs Academy",
};

/**
 * Render the React app to an HTML string for the given URL.
 * @param {string} url Absolute or path URL of the request
 * @returns {{ appHtml: string, title: string, canonical: string, pathname: string }}
 */
export function render(url) {
  const parsed = new URL(url, SITE);
  const pathname = parsed.pathname.replace(/\/$/, "") || "/";
  const location = pathname + parsed.search;

  const appHtml = renderToString(
    <React.StrictMode>
      <StaticRouter location={location}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );

  const title =
    PAGE_TITLES[pathname] ||
    (pathname.startsWith("/blog/")
      ? "Blog | Hill Springs Academy, Maua"
      : "Hill Springs Academy | Private School in Maua, Meru County");

  const canonical = SITE + (pathname === "/" ? "/" : pathname);

  return { appHtml, title, canonical, pathname };
}
