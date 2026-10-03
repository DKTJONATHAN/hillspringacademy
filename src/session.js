import { useCallback, useEffect, useState } from "react";
import { refreshSession } from "./supabase.js";

const KEY = "hsa_parent_session";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
};

export function saveSession(data) {
  const s = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expires_in || 3600) * 1000,
    email: data.user?.email || "",
  };
  localStorage.setItem(KEY, JSON.stringify(s));
  return s;
}
export const clearSession = () => localStorage.removeItem(KEY);

/** Returns a valid access token, refreshing it when close to expiry. */
export async function getToken() {
  let s = read();
  if (!s) return "";
  if (s.expires_at - Date.now() < 60000) {
    try {
      s = saveSession(await refreshSession(s.refresh_token));
    } catch {
      clearSession();
      return "";
    }
  }
  return s.access_token;
}

export function useParentSession() {
  const [session, setSession] = useState(read);
  useEffect(() => {
    getToken().then(() => setSession(read()));
  }, []);
  const signedIn = useCallback((data) => setSession(saveSession(data)), []);
  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);
  return { session, signedIn, signOut };
}

// Admin token helpers (sessionStorage only — cleared when the tab closes)
const ADMIN_TOKEN = "hsa_admin_token";
export function getAdminToken() {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN) || "";
  } catch {
    return "";
  }
}
export function setAdminToken(token) {
  try {
    if (token) sessionStorage.setItem(ADMIN_TOKEN, token);
    else sessionStorage.removeItem(ADMIN_TOKEN);
  } catch { /* ignore */ }
  try {
    localStorage.removeItem("hsa_admin_token");
    localStorage.removeItem("hsa_admin_emails");
  } catch { /* ignore */ }
}
export function clearAdminToken() {
  setAdminToken("");
}
