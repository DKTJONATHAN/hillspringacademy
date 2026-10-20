import { render } from "./dist/server/entry-server.js";

const ASSET_EXT =
  /\.(js|css|map|ico|png|jpe?g|gif|webp|avif|svg|woff2?|ttf|eot|json|webmanifest|txt|xml|mp4|webm)$/i;

function isDocumentRequest(request, url) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  if (ASSET_EXT.test(url.pathname)) return false;
  const accept = request.headers.get("Accept") || "";
  // Prefer HTML document navigation; still SSR if Accept is missing
  if (accept && !accept.includes("text/html") && !accept.includes("*/*")) return false;
  return true;
}

async function ssrResponse(request, env) {
  const url = new URL(request.url);
  const rendered = render(request.url);

  // Shell is the client build's index.html (with hashed asset tags)
  const shellRes = await env.ASSETS.fetch(
    new Request(new URL("/index.html", url.origin), request)
  );
  if (!shellRes.ok) {
    // Fallback: let assets pipeline handle it
    return env.ASSETS.fetch(request);
  }

  let html = await shellRes.text();

  // Replace boot splash / empty root with SSR markup
  html = html.replace(
    /<div id="root"[^>]*>[\s\S]*?<\/div>/i,
    `<div id="root">${rendered.appHtml}</div>`
  );

  // Title + canonical for the route
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(rendered.title)}</title>`);
  html = html.replace(
    /<meta\s+name="title"[^>]*>/i,
    `<meta name="title" content="${escapeAttr(rendered.title)}" />`
  );
  html = html.replace(
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${escapeAttr(rendered.canonical)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"[^>]*>/i,
    `<meta property="og:url" content="${escapeAttr(rendered.canonical)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"[^>]*>/i,
    `<meta property="og:title" content="${escapeAttr(rendered.title)}" />`
  );

  // Mark that HTML was server-rendered (useful for debugging)
  html = html.replace(
    "</head>",
    `<meta name="ssr" content="1" />\n</head>`
  );

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "X-SSR": "1",
    },
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!env.ASSETS) {
      return new Response("ASSETS binding missing", { status: 500 });
    }

    // Document navigations → SSR; static files → assets pipeline
    if (isDocumentRequest(request, url)) {
      try {
        return await ssrResponse(request, env);
      } catch (err) {
        console.error("SSR failed, falling back to SPA shell", err);
        // Soft-fail: serve static SPA so the site still works
        return env.ASSETS.fetch(request);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
