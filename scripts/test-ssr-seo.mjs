import assert from "node:assert/strict";
import { render } from "../dist/server/entry-server.js";
import worker from "../worker.js";

const routes = ["/", "/fees", "/admissions", "/about", "/academics", "/blog"];
const renderedPages = routes.map((path) => ({ path, ...render(path) }));

for (const page of renderedPages) {
  assert.ok(page.appHtml.length > 1000, `SSR HTML is unexpectedly empty for ${page.path}`);
  assert.ok(page.appHtml.includes('class="pagehead"'), `Page heading missing for ${page.path}`);
  assert.equal(page.canonical, `https://hillspringsacademy.sc.ke${page.path === "/" ? "/" : page.path}`);
  assert.equal(page.robots.includes("noindex"), false, `Public route unexpectedly noindexed: ${page.path}`);
}

assert.equal(new Set(renderedPages.map((page) => page.title)).size, routes.length,
  "Public routes must have distinct server-rendered titles");
assert.notEqual(renderedPages.find((page) => page.path === "/fees").appHtml,
  renderedPages.find((page) => page.path === "/").appHtml,
  "Fees route must not render the homepage shell");

const shell = `<!doctype html><html><head>
<title>Shell</title>
<meta name="description" content="Shell description" />
<meta name="title" content="Shell" />
<meta name="robots" content="index,follow" />
<link rel="canonical" href="https://hillspringsacademy.sc.ke/" />
<meta property="og:description" content="Shell description" />
<meta property="og:url" content="https://hillspringsacademy.sc.ke/" />
<meta property="og:title" content="Shell" />
</head><body><div id="root"></div></body></html>`;

for (const page of renderedPages) {
  const request = new Request(`https://hillspringsacademy.sc.ke${page.path}`, {
    headers: { Accept: "text/html" },
  });
  const response = await worker.fetch(request, {
    ASSETS: { fetch: async () => new Response(shell, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }) },
  });
  const html = await response.text();
  assert.equal(response.status, 200, `Worker returned non-200 for ${page.path}`);
  assert.equal(response.headers.get("X-SSR"), "1", `Worker did not mark SSR for ${page.path}`);
  assert.ok(html.includes(`<title>${page.title}</title>`), `Route title missing from HTML for ${page.path}`);
  assert.ok(html.includes(`href="${page.canonical}"`), `Route canonical missing from HTML for ${page.path}`);
  assert.ok(html.includes(page.appHtml.slice(0, 80)), `SSR content was not injected for ${page.path}`);
}

console.log(`SSR SEO smoke test passed for ${routes.length} routes and Worker HTML responses.`);
