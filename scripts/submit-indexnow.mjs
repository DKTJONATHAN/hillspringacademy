import { readFile } from "node:fs/promises";

const HOST = "hillspringsacademy.sc.ke";
const ORIGIN = "https://" + HOST;
const KEY = "75688c69408be664eb237460d270c682";
const KEY_LOCATION = ORIGIN + "/" + KEY + ".txt";
const xml = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const urls = [...xml.matchAll(/<loc>(https:\/\/hillspringsacademy\.sc\.ke[^<]*)<\/loc>/g)]
  .map((match) => match[1].trim())
  .filter((url) => {
    try { const parsed = new URL(url); return parsed.origin === ORIGIN && !parsed.search && !parsed.hash; }
    catch { return false; }
  });
const uniqueUrls = [...new Set(urls)];
if (!uniqueUrls.length) throw new Error("No canonical URLs found in public/sitemap.xml");
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: uniqueUrls })
});
const body = await response.text();
if (![200, 202].includes(response.status)) throw new Error("IndexNow submission failed (" + response.status + "): " + body);
console.log("IndexNow accepted " + uniqueUrls.length + " canonical URLs. HTTP " + response.status);
