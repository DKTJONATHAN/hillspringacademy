const SUPABASE_URL = "https://nkcnslswfbxrcvvlqxpy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_VdhqIlNG-l8peDPMXEp1TQ_58-fKzsQ";

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

export const submitSchoolEnquiry = (payload) => callFunction("school-submit", { action: "enquiry", ...payload });
export const subscribeToSchoolUpdates = (payload) => callFunction("school-submit", { action: "subscribe", ...payload });

export async function adminSignIn(email, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_PUBLISHABLE_KEY },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) throw new Error(data.error_description || data.msg || "Unable to sign in.");
  return data;
}

export const adminCall = (token, body) => callFunction("school-email-center", body, token);
