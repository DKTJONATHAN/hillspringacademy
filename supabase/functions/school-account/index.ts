import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { db, json, cors, validEmail, clean, norm, maskEmail, isAdminEmail, sixDigitCode, hashCode, passwordProblem } from "../_shared/util.ts";
import { sendEmail, codeEmail } from "../_shared/email.ts";

const CODE_TTL_MIN = 10;
const RESEND_COOLDOWN_SEC = 60;
const MAX_ATTEMPTS = 5;

async function findUser(email: string) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find(u => norm(u.email) === email);
    if (hit) return hit;
    if (data.users.length < 200) break;
  }
  return null;
}

async function issueCode(email: string, purpose: "signup" | "reset", name?: string) {
  const since = new Date(Date.now() - RESEND_COOLDOWN_SEC * 1000).toISOString();
  const { data: recent } = await db.from("school_codes").select("id").eq("email", email).eq("purpose", purpose).gte("created_at", since).limit(1);
  if (recent?.length) return { wait: true };
  const code = sixDigitCode();
  await db.from("school_codes").update({ used_at: new Date().toISOString() }).eq("email", email).eq("purpose", purpose).is("used_at", null);
  const ins = await db.from("school_codes").insert({
    email, purpose, code_hash: await hashCode(email, purpose, code),
    expires_at: new Date(Date.now() + CODE_TTL_MIN * 60000).toISOString(),
  });
  if (ins.error) throw ins.error;
  const mail = codeEmail({ name, code, purpose });
  await sendEmail({ to: email, subject: mail.subject, html: mail.html });
  return { sent: true };
}

async function consumeCode(email: string, purpose: "signup" | "reset", code: string) {
  const { data: row } = await db.from("school_codes").select("*").eq("email", email).eq("purpose", purpose)
    .is("used_at", null).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!row) return "No active code. Please request a new one.";
  if (new Date(row.expires_at).getTime() < Date.now()) return "That code has expired. Please request a new one.";
  if (row.attempts >= MAX_ATTEMPTS) return "Too many wrong attempts. Please request a new code.";
  if (row.code_hash !== await hashCode(email, purpose, code)) {
    await db.from("school_codes").update({ attempts: row.attempts + 1 }).eq("id", row.id);
    return "That code is not correct.";
  }
  await db.from("school_codes").update({ used_at: new Date().toISOString() }).eq("id", row.id);
  return "";
}

Deno.serve(async req => {
  if (req.method === "OPTIONS") return json({});
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let p: any;
  try { p = await req.json(); } catch { return json({ error: "Invalid request." }, 400); }
  if (p.website) return json({ ok: true });

  try {
    const email = norm(p.email);
    if (!validEmail(email)) return json({ error: "Please enter a valid email address." }, 400);

    if (p.action === "check") {
      const user = await findUser(email);
      return json({ ok: true, exists: Boolean(user), verified: Boolean(user?.email_confirmed_at) });
    }

    if (p.action === "register") {
      const fullName = clean(p.fullName, 120), phone = clean(p.phone, 30), password = String(p.password ?? "");
      if (fullName.length < 2) return json({ error: "Please enter your full name." }, 400);
      const bad = passwordProblem(password);
      if (bad) return json({ error: bad }, 400);
      const existing = await findUser(email);
      if (existing?.email_confirmed_at) {
        return json({ error: "You already have an account with this email. Please sign in. If you forgot your password, use “Forgot password”.", code: "ALREADY_REGISTERED" }, 409);
      }
      let userId = existing?.id;
      if (existing) {
        const u = await db.auth.admin.updateUserById(existing.id, { password });
        if (u.error) throw u.error;
      } else {
        const c = await db.auth.admin.createUser({ email, password, email_confirm: false });
        if (c.error) throw c.error;
        userId = c.data.user.id;
      }
      await db.from("school_profiles").upsert({ user_id: userId, full_name: fullName, phone: phone || null });
      const r = await issueCode(email, "signup", fullName.split(/\s+/)[0]);
      return json({ ok: true, needsVerification: true, wait: Boolean((r as any).wait) });
    }

    if (p.action === "verify_signup") {
      const user = await findUser(email);
      if (!user) return json({ error: "We could not find that account. Please register.", code: "NOT_REGISTERED" }, 404);
      if (user.email_confirmed_at) return json({ ok: true, alreadyVerified: true });
      const bad = await consumeCode(email, "signup", clean(p.code, 6));
      if (bad) return json({ error: bad }, 400);
      const u = await db.auth.admin.updateUserById(user.id, { email_confirm: true });
      if (u.error) throw u.error;
      return json({ ok: true });
    }

    if (p.action === "resend_signup") {
      const user = await findUser(email);
      if (!user || user.email_confirmed_at) return json({ ok: true });
      const { data: prof } = await db.from("school_profiles").select("full_name").eq("user_id", user.id).maybeSingle();
      const r: any = await issueCode(email, "signup", prof?.full_name?.split(/\s+/)[0]);
      if (r.wait) return json({ error: `Please wait ${RESEND_COOLDOWN_SEC} seconds before asking for another code.` }, 429);
      return json({ ok: true });
    }

    if (p.action === "request_reset") {
      const portal = p.portal === "admin" ? "admin" : "parent";
      if (portal === "admin" && !(await isAdminEmail(email))) {
        // Do not reveal the administrator email list. The live school_admins
        // table intentionally contains user_id/name/role/active, not email.
        return json({
          error: "That email is not an administrator email, so it cannot be used to reset the admin password.",
          code: "NOT_ADMIN",
        }, 403);
      }

      const user = await findUser(email);
      if (!user) {
        return json({ error: "You do not have an account yet. Please register first.", code: "NOT_REGISTERED" }, 404);
      }
      if (!user.email_confirmed_at) {
        return json({ error: "This email has not been verified yet. Please verify your email first.", code: "NOT_VERIFIED" }, 409);
      }
      const { data: prof } = await db.from("school_profiles").select("full_name").eq("user_id", user.id).maybeSingle();
      const r: any = await issueCode(email, "reset", prof?.full_name?.split(/\s+/)[0]);
      if (r.wait) return json({ error: `A code was just sent. Please wait ${RESEND_COOLDOWN_SEC} seconds before asking again.` }, 429);
      return json({ ok: true });
    }

    if (p.action === "verify_reset") {
      const portal = p.portal === "admin" ? "admin" : "parent";
      if (portal === "admin" && !(await isAdminEmail(email))) return json({ error: "That email is not an administrator.", code: "NOT_ADMIN" }, 403);
      const bad = passwordProblem(String(p.newPassword ?? ""));
      if (bad) return json({ error: bad }, 400);
      const user = await findUser(email);
      if (!user) return json({ error: "You do not have an account yet. Please register first.", code: "NOT_REGISTERED" }, 404);
      const codeBad = await consumeCode(email, "reset", clean(p.code, 6));
      if (codeBad) return json({ error: codeBad }, 400);
      const u = await db.auth.admin.updateUserById(user.id, { password: String(p.newPassword) });
      if (u.error) throw u.error;
      await db.auth.admin.signOut(user.id).catch(() => {});
      return json({ ok: true });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Request failed." }), { status: 500, headers: cors });
  }
});
