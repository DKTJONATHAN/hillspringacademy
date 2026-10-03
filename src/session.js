import { useCallback, useEffect, useState } from "react";
import { refreshSession } from "./supabase.js";

const KEY = "hsa_parent_session";
const ADMIN_KEY = "hsa_admin_emails";

const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; } };

export function saveSession(data) {
  const s = { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: Date.now() + (data.expires_in || 3600) * 1000, email: data.user?.email || "" };
  localStorage.setItem(KEY, JSON.stringify(s));
  return s;
}
export const clearSession = () => localStorage.removeItem(KEY);

/** Returns a valid access token, refreshing it when close to expiry. */
export async function getToken() {
  let s = read();
  if (!s) return "";
  if (s.expires_at - Date.now() < 60000) {
    try { s = saveSession(await refreshSession(s.refresh_token)); } catch { clearSession(); return ""; }
  }
  return s.access_token;
}

export function useParentSession() {
  const [session, setSession] = useState(read);
  useEffect(() => { getToken().then(() => setSession(read())); }, []);
  const signedIn = useCallback((data) => setSession(saveSession(data)), []);
  const signOut = useCallback(() => { clearSession(); setSession(null); }, []);
  return { session, signedIn, signOut };
}

// Admin emails remembered in this browser (used for friendly hints; the server is the real gatekeeper).
export function getAdminEmails(seed = []) {
  let list = [];
  try { list = JSON.parse(localStorage.getItem(ADMIN_KEY) || "[]"); } catch { /* ignore */ }
  return [...new Set([...seed, ...list].map(e => String(e).trim().toLowerCase()).filter(Boolean))];
}
export function rememberAdminEmail(email) {
  const list = getAdminEmails();
  const e = String(email).trim().toLowerCase();
  if (e && !list.includes(e)) localStorage.setItem(ADMIN_KEY, JSON.stringify([...list, e]));
}
export const maskEmail = (email) => {
  const [u = "", d = ""] = String(email).split("@");
  return `${u.slice(0, 1)}${"*".repeat(Math.max(2, Math.min(u.length - 1, 6)))}@${d}`;
};
