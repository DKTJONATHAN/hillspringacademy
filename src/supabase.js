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
  if (!response.ok || data.error) throw new Error(data.error || `Request failed (${response.status})`);
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

export const requestAdminPasswordReset = (email) =>
  callFunction("school-admin-auth", { action: "request_reset", email });

export const verifyAdminPasswordReset = (email, code, new_password) =>
  callFunction("school-admin-auth", { action: "verify_reset", email, code, new_password });
