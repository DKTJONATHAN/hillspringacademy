import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
const SECRET_KEY = keys.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const db = createClient(SUPABASE_URL, SECRET_KEY, { auth: { persistSession: false } });

const ALLOWED_ORIGINS = new Set([
  "https://hillspringsacademy.sc.ke",
  "https://www.hillspringsacademy.sc.ke",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "content-type, apikey, authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
  if (ALLOWED_ORIGINS.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

const json = (body: unknown, status = 200, req?: Request) =>
  new Response(JSON.stringify(body), { status, headers: req ? corsHeaders(req) : corsHeaders(new Request("https://hillspringsacademy.sc.ke")) });

const clean = (v: unknown, max = 500) => String(v ?? "").trim().slice(0, max);

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") || "";
  const first = xff.split(",")[0]?.trim();
  if (first) return first;
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
}

async function getAdminRecord(userId: string) {
  const { data, error } = await db.from("school_admins")
    .select("user_id,name,role,active")
    .eq("user_id", userId)
    .eq("active", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function userFromRequest(req: Request) {
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
    const parsed = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return String(parsed.aal || "aal1");
  } catch {
    return "aal1";
  }
}

// Same administrator authorization as supabase/functions/_shared/util.ts.
async function requireAdmin(req: Request) {
  const user = await userFromRequest(req);
  if (!user?.id || !(await getAdminRecord(user.id))) return null;
  const requireMfa = (Deno.env.get("REQUIRE_ADMIN_MFA") || "").toLowerCase() === "true";
  if (requireMfa && aalFromJwt(req) !== "aal2") return null;
  return user;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json({}, 200, req);
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405, req);

  try {
    const admin = await requireAdmin(req);
    if (!admin) return json({ error: "Administrator access only.", code: "NOT_ADMIN" }, 403, req);

    const p = await req.json().catch(() => ({}));

    if (p.action === "delete_enquiry") {
      const id = clean(p.id, 80);
      if (!id) return json({ error: "Missing enquiry id." }, 400, req);
      if (!isUuid(id)) return json({ error: "Invalid enquiry id." }, 400, req);

      const { data: conversation, error: findError } = await db
        .from("school_conversations")
        .select("id,subject,status")
        .eq("id", id)
        .maybeSingle();
      if (findError) throw findError;
      if (!conversation) return json({ error: "Enquiry not found." }, 404, req);

      const deletedMessages = await db.from("school_messages").delete().eq("conversation_id", id);
      if (deletedMessages.error) throw deletedMessages.error;

      const deleted = await db.from("school_conversations").delete().eq("id", id);
      if (deleted.error) throw deleted.error;

      const audit = await db.from("school_audit_log").insert({
        actor_id: admin.id,
        action: "enquiry_deleted",
        target: id,
        ip: clientIp(req),
      });
      if (audit.error) throw audit.error;

      return json({ ok: true, deleted: id, status: conversation.status }, 200, req);
    }

    return json({ error: "Unknown action." }, 400, req);
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Request failed." }, 500, req);
  }
});
