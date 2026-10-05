import { createClient } from "npm:@supabase/supabase-js@2";

export const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
export const SECRET_KEY = keys.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
export const db = createClient(SUPABASE_URL, SECRET_KEY, { auth: { persistSession: false } });

const ALLOWED_ORIGINS = new Set([
  "https://hillspringsacademy.sc.ke",
  "https://www.hillspringsacademy.sc.ke",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "content-type, apikey, authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
  if (ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

/** @deprecated use corsHeaders(req) */
export const cors = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "https://hillspringsacademy.sc.ke",
  "Access-Control-Allow-Headers": "content-type, apikey, authorization",
  Vary: "Origin",
};

export const json = (body: unknown, status = 200, req?: Request) =>
  new Response(JSON.stringify(body), { status, headers: req ? corsHeaders(req) : cors });

export function genericError(req?: Request, status = 500) {
  return json({ error: "Something went wrong. Please try again." }, status, req);
}

export const validEmail = (e: unknown) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e ?? "").trim());
export const clean = (v: unknown, max = 500) => String(v ?? "").trim().slice(0, max);
export const norm = (e: unknown) => String(e ?? "").trim().toLowerCase();

export function maskEmail(email: string) {
  const [u, d] = email.split("@");
  if (!u || !d) return "***";
  return `${u.slice(0, 1)}${"*".repeat(Math.max(2, Math.min(u.length - 1, 6)))}@${d}`;
}

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") || "";
  const first = xff.split(",")[0]?.trim();
  if (first) return first;
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
}

/** Returns true if allowed, false if rate-limited. Requires school_rate_limits + rl_hit RPC. */
export async function rateLimit(key: string, windowSec: number, max: number): Promise<boolean> {
  try {
    const { data, error } = await db.rpc("rl_hit", { p_key: key, p_window: windowSec, p_max: max });
    if (error) {
      console.error("rateLimit rpc", error);
      return true; // fail open only if RPC not deployed yet — tighten after Phase 2 SQL
    }
    return Boolean(data);
  } catch (e) {
    console.error("rateLimit", e);
    return true;
  }
}

/** Turnstile is enforced whenever TURNSTILE_SECRET is configured; production should configure it. */
export async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = Deno.env.get("TURNSTILE_SECRET") || "";
  if (!secret) {
    console.warn("TURNSTILE_SECRET not set — captcha not enforced yet");
    return true;
  }
  const t = String(token ?? "").trim();
  if (!t) return false;
  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", t);
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.success);
  } catch (e) {
    console.error("turnstile", e);
    return false;
  }
}

export async function getAdminRecord(userId: string) {
  const { data, error } = await db.from("school_admins")
    .select("user_id,name,role,active").eq("user_id", userId).eq("active", true).maybeSingle();
  if (error) throw error;
  return data;
}

export async function isAdminUserId(userId: string) {
  return Boolean(await getAdminRecord(userId));
}

export async function requireAdminManager(req: Request) {
  const user = await requireAdmin(req);
  if (!user) return null;
  const admin = await getAdminRecord(user.id);
  if (!admin || admin.role !== "owner") return null;
  return { user, admin };
}

export async function findUserByEmail(email: string): Promise<{ id: string; email_confirmed_at: string | null } | null> {
  const normalized = norm(email);
  try {
    const { data, error } = await db.rpc("school_find_user", { p_email: normalized });
    if (!error && Array.isArray(data) && data[0]?.id) {
      return { id: data[0].id, email_confirmed_at: data[0].email_confirmed_at ?? null };
    }
  } catch { /* fall through */ }
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => norm(u.email) === normalized);
    if (hit) return { id: hit.id, email_confirmed_at: hit.email_confirmed_at ?? null };
    if (data.users.length < 200) break;
  }
  return null;
}

export async function isAdminEmail(email: string) {
  const user = await findUserByEmail(email);
  if (!user) return false;
  return isAdminUserId(user.id);
}

export async function userFromRequest(req: Request) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await db.auth.getUser(token);
  return error ? null : data.user;
}

function aalFromJwt(req: Request): string {
  try {
    const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    const payload = token.split(".")[1];
    if (!payload) return "aal1";
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return String(json.aal || "aal1");
  } catch {
    return "aal1";
  }
}

/** Admin required. Set REQUIRE_ADMIN_MFA=true after TOTP is rolled out. */
export async function requireAdmin(req: Request) {
  const user = await userFromRequest(req);
  if (!user?.id || !(await isAdminUserId(user.id))) return null;
  const requireMfa = (Deno.env.get("REQUIRE_ADMIN_MFA") || "").toLowerCase() === "true";
  if (requireMfa && aalFromJwt(req) !== "aal2") return null;
  return user;
}

export function sixDigitCode() {
  const n = new Uint32Array(1);
  let v = 0;
  do {
    crypto.getRandomValues(n);
    v = n[0];
  } while (v >= 4294000000);
  return String(v % 1000000).padStart(6, "0");
}

async function hmacKey(): Promise<CryptoKey> {
  const raw = Deno.env.get("CODE_HMAC_KEY") || SECRET_KEY;
  const bytes = new TextEncoder().encode(raw);
  return crypto.subtle.importKey("raw", bytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

export async function hashCode(email: string, purpose: string, code: string) {
  const key = await hmacKey();
  const data = new TextEncoder().encode(`${norm(email)}|${purpose}|${code}`);
  const buf = await crypto.subtle.sign("HMAC", key, data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function passwordProblem(pw: string) {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  return "";
}

export async function randomPassword(): Promise<string> {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}
