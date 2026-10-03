import { createClient } from "npm:@supabase/supabase-js@2";

export const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
export const SECRET_KEY = keys.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
export const db = createClient(SUPABASE_URL, SECRET_KEY, { auth: { persistSession: false } });

export const cors = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, apikey, authorization",
};
export const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: cors });
export const validEmail = (e: unknown) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e ?? "").trim());
export const clean = (v: unknown, max = 500) => String(v ?? "").trim().slice(0, max);
export const norm = (e: unknown) => String(e ?? "").trim().toLowerCase();

export function maskEmail(email: string) {
  const [u, d] = email.split("@");
  if (!u || !d) return "***";
  return `${u.slice(0, 1)}${"*".repeat(Math.max(2, Math.min(u.length - 1, 6)))}@${d}`;
}

/**
 * Checks the authenticated user's membership in the live school_admins table.
 * The production schema identifies admins by auth.users.id, not by email.
 */
export async function isAdminUserId(userId: string) {
  const { data, error } = await db
    .from("school_admins")
    .select("user_id")
    .eq("user_id", userId)
    .eq("active", true)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

/** Backwards-compatible helper for flows that only have an email. */
export async function isAdminEmail(email: string) {
  const normalized = norm(email);
  if (!validEmail(normalized)) return false;

  // Resolve the Auth user first, then authorize by user_id.
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find(u => norm(u.email) === normalized);
    if (hit) return isAdminUserId(hit.id);
    if (data.users.length < 200) break;
  }
  return false;
}

/** Verifies the bearer token and returns the user (or null). */
export async function userFromRequest(req: Request) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await db.auth.getUser(token);
  return error ? null : data.user;
}

export async function requireAdmin(req: Request) {
  const user = await userFromRequest(req);
  if (!user?.id || !(await isAdminUserId(user.id))) return null;
  return user;
}

export function sixDigitCode() {
  const n = new Uint32Array(1);
  let v = 0;
  do { crypto.getRandomValues(n); v = n[0]; } while (v >= 4294000000);
  return String(v % 1000000).padStart(6, "0");
}

export async function hashCode(email: string, purpose: string, code: string) {
  const data = new TextEncoder().encode(`${norm(email)}|${purpose}|${code}|${SECRET_KEY}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

export function passwordProblem(pw: string) {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return "Password must contain at least one letter and one number.";
  return "";
}
