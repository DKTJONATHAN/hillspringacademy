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

  // Route-specific metadata is rendered on the server so crawlers and assistive tools
  // receive the same page description and indexing directive as visitors.
  html = html.replace(
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${escapeAttr(rendered.description)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${escapeAttr(rendered.description)}" />`
  );
  html = html.replace(
    /<meta\s+name="robots"[^>]*>/i,
    `<meta name="robots" content="${escapeAttr(rendered.robots)}" />`
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


const TURNSTILE_ACTIONS = new Set([
  "parent_register", "parent_resend", "parent_password_reset", "parent_verify",
  "parent_login", "application_submit", "enquiry_submit", "contact_submit",
  "newsletter_subscribe", "admin_login", "admin_password_reset", "admin_reset_verify"
]);

async function handleTurnstileVerify(request, env) {
  const origin = request.headers.get("Origin") || "";
  const configuredHosts = String(env.TURNSTILE_HOSTNAMES || "hillspringsacademy.sc.ke")
    .split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  const allowedHosts = new Set(configuredHosts.flatMap((host) => host.startsWith("www.") ? [host] : [host, `www.${host}`]));
  const allowedOrigins = [...allowedHosts].map((host) => `https://${host}`);
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    ...(origin && allowedOrigins.includes(origin) ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}),
  };
  const respond = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return respond({ ok: false, error: "POST only" }, 405);
  if (origin && !allowedOrigins.includes(origin)) return respond({ ok: false, error: "Origin not allowed" }, 403);

  const secret = String(env.TURNSTILE_SECRET || "").trim();
  if (!secret) return respond({ ok: false, error: "Turnstile verification is not configured on the server." }, 503);
  let body;
  try { body = await request.json(); } catch { return respond({ ok: false, error: "Invalid request." }, 400); }
  const token = String(body?.token || "").trim();
  const action = String(body?.action || "").trim();
  if (!token || token.length > 2048 || !TURNSTILE_ACTIONS.has(action)) {
    return respond({ ok: false, error: "Invalid security token or action." }, 400);
  }

  try {
    const form = new URLSearchParams({ secret, response: token });
    const ip = request.headers.get("CF-Connecting-IP");
    if (ip) form.set("remoteip", ip);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return respond({ ok: false, error: "Security verification is temporarily unavailable." }, 502);
    const result = await response.json();
    const hostname = String(result?.hostname || "").toLowerCase();
    const expectedHostname = allowedHosts.has(hostname);
    const ok = result?.success === true && result?.action === action && expectedHostname;
    if (!ok) return respond({ ok: false, error: "Security check failed. Please try again." }, 400);
    return respond({ ok: true });
  } catch (error) {
    console.error("Turnstile Siteverify failed", error);
    return respond({ ok: false, error: "Security verification is temporarily unavailable." }, 502);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // The admin hostname opens the existing /admin React route by default.
    if (url.hostname === "admin.hillspringsacademy.sc.ke" && url.pathname === "/") {
      url.pathname = "/admin";
      return Response.redirect(url.toString(), 302);
    }

    if (url.pathname === "/api/turnstile/verify") return handleTurnstileVerify(request, env);

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
