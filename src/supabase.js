const SUPABASE_URL = "https://clpmfblwrpnqwbxgbtkd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable__Va_EquGjJC_2AYwYB1fJQ_4OLIQdcR";

async function callFunction(name, body, token = "") {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_PUBLISHABLE_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) {
    const e = new Error(data.error || `Request failed (${response.status})`);
    e.code = data.code; e.data = data;
    throw e;
  }
  return data;
}

export const submitSchoolEnquiry = (payload) =>
  callFunction("school-submit", { action: "enquiry", ...payload });

export const subscribeToSchoolUpdates = (payload) =>
  callFunction("school-submit", { action: "subscribe", ...payload });

export const unsubscribeFromSchoolUpdates = (email) =>
  callFunction("school-submit", { action: "unsubscribe", email });

export async function adminSignIn(email, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_PUBLISHABLE_KEY },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.msg || "Unable to sign in.");
  }
  return data;
}

export const adminCall = (token, body) =>
  callFunction("school-email-center", body, token);

// Admin password reset now uses the same school-account verification system
// as parent accounts. This matches the production school_admins user_id schema.
export const requestAdminPasswordReset = (email) =>
  callFunction("school-account", { action: "request_reset", email, portal: "admin" });

export const verifyAdminPasswordReset = (email, code, new_password) =>
  callFunction("school-account", { action: "verify_reset", email, code, newPassword: new_password, portal: "admin" });

// ---------------- Parent accounts, applications, admin decisions ----------------
export const accountApi = (body) => callFunction("school-account", body);
export const appsApi = (body, token = "") => callFunction("school-applications", body, token);

export async function passwordSignIn(email, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_PUBLISHABLE_KEY },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    const err = new Error(data.error_description || data.msg || "Unable to sign in.");
    err.code = data.error_code || data.error || "";
    throw err;
  }
  return data;
}

export async function refreshSession(refresh_token) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_PUBLISHABLE_KEY },
    body: JSON.stringify({ refresh_token }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) throw new Error("Session expired.");
  return data;
}
