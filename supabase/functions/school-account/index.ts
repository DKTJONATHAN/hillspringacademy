import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  db,
  json,
  genericError,
  validEmail,
  clean,
  norm,
  isAdminEmail,
  sixDigitCode,
  hashCode,
  passwordProblem,
  clientIp,
  rateLimit,
  verifyTurnstile,
  findUserByEmail,
  randomPassword,
  corsHeaders,
} from "../_shared/util.ts";
import { sendEmail, codeEmail } from "../_shared/email.ts";

const CODE_TTL_MIN = 10;
const RESEND_COOLDOWN_SEC = 60;
const MAX_ATTEMPTS = 5;

async function issueCode(email: string, purpose: "signup" | "reset", name?: string) {
  const since = new Date(Date.now() - RESEND_COOLDOWN_SEC * 1000).toISOString();
  const { data: recent } = await db.from("school_codes").select("id").eq("email", email).eq("purpose", purpose).gte("created_at", since).limit(1);
  if (recent?.length) return { wait: true };
  const code = sixDigitCode();
  await db.from("school_codes").update({ used_at: new Date().toISOString() }).eq("email", email).eq("purpose", purpose).is("used_at", null);
  const ins = await db.from("school_codes").insert({
    email,
    purpose,
    code_hash: await hashCode(email, purpose, code),
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
    try {
      await db.rpc("school_code_fail", { p_id: row.id });
    } catch {
      await db.from("school_codes").update({ attempts: row.attempts + 1 }).eq("id", row.id);
    }
    return "That code is not correct.";
  }
  await db.from("school_codes").update({ used_at: new Date().toISOString() }).eq("id", row.id);
  return "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(req) });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, req);
  let p: any;
  try {
    p = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400, req);
  }
  if (p.website) return json({ ok: true }, 200, req);

  const ip = clientIp(req);

  try {
    const email = norm(p.email);
    if (!validEmail(email)) return json({ error: "Please enter a valid email address." }, 400, req);

    // Global IP budget
    if (!(await rateLimit(`acct:ip:${ip}`, 3600, 20))) {
      return json({ error: "Too many requests. Please try again later." }, 429, req);
    }

    // Remove informative check or always generic
    if (p.action === "check") {
      return json({ ok: true }, 200, req);
    }

    if (p.action === "register") {
      if (!(await rateLimit(`acct:reg:${email}`, 3600, 5))) return json({ error: "Too many requests. Please try again later." }, 429, req);
      if (!(await verifyTurnstile(p.turnstileToken, ip))) return json({ error: "Security check failed. Please try again." }, 400, req);

      const fullName = clean(p.fullName, 120);
      const phone = clean(p.phone, 30);
      if (fullName.length < 2) return json({ error: "Please enter your full name." }, 400, req);

      const existing = await findUserByEmail(email);
      if (existing?.email_confirmed_at) {
        return json({
          error: "You already have an account with this email. Please sign in. If you forgot your password, use “Forgot password”.",
          code: "ALREADY_REGISTERED",
        }, 409, req);
      }

      let userId = existing?.id;
      if (existing) {
        // Unverified: only resend code — never change password here
        const r = await issueCode(email, "signup", fullName.split(/\s+/)[0]);
        return json({ ok: true, needsVerification: true, wait: Boolean((r as any).wait) }, 200, req);
      }

      const tempPw = await randomPassword();
      const c = await db.auth.admin.createUser({ email, password: tempPw, email_confirm: false });
      if (c.error) throw c.error;
      userId = c.data.user.id;
      await db.from("school_profiles").upsert({ user_id: userId, full_name: fullName, phone: phone || null });
      const r = await issueCode(email, "signup", fullName.split(/\s+/)[0]);
      return json({ ok: true, needsVerification: true, wait: Boolean((r as any).wait) }, 200, req);
    }

    if (p.action === "verify_signup") {
      if (!(await rateLimit(`acct:verify:${ip}:${email}`, 3600, 10))) {
        return json({ error: "Too many requests. Please try again later." }, 429, req);
      }
      const password = String(p.password ?? "");
      const badPw = passwordProblem(password);
      if (badPw) return json({ error: badPw }, 400, req);

      const user = await findUserByEmail(email);
      if (!user) return json({ error: "We could not find that account. Please register.", code: "NOT_REGISTERED" }, 404, req);
      if (user.email_confirmed_at) return json({ ok: true, alreadyVerified: true }, 200, req);
      const bad = await consumeCode(email, "signup", clean(p.code, 6));
      if (bad) return json({ error: bad }, 400, req);
      const u = await db.auth.admin.updateUserById(user.id, { password, email_confirm: true });
      if (u.error) throw u.error;
      return json({ ok: true }, 200, req);
    }

    if (p.action === "resend_signup") {
      if (!(await rateLimit(`acct:resend:${email}`, 3600, 5))) return json({ error: "Too many requests. Please try again later." }, 429, req);
      if (!(await verifyTurnstile(p.turnstileToken, ip))) return json({ error: "Security check failed. Please try again." }, 400, req);
      const user = await findUserByEmail(email);
      if (!user || user.email_confirmed_at) return json({ ok: true }, 200, req);
      const { data: prof } = await db.from("school_profiles").select("full_name").eq("user_id", user.id).maybeSingle();
      const r: any = await issueCode(email, "signup", prof?.full_name?.split(/\s+/)[0]);
      if (r.wait) return json({ error: `Please wait ${RESEND_COOLDOWN_SEC} seconds before asking for another code.` }, 429, req);
      return json({ ok: true }, 200, req);
    }

    if (p.action === "request_reset") {
      if (!(await rateLimit(`acct:reset:${email}`, 3600, 5))) return json({ error: "Too many requests. Please try again later." }, 429, req);
      if (!(await verifyTurnstile(p.turnstileToken, ip))) return json({ error: "Security check failed. Please try again." }, 400, req);

      const portal = p.portal === "admin" ? "admin" : "parent";

      if (portal === "admin") {
        // Identical response whether or not the email is admin
        const isAdmin = await isAdminEmail(email);
        const user = await findUserByEmail(email);
        if (isAdmin && user?.email_confirmed_at) {
          const { data: prof } = await db.from("school_profiles").select("full_name").eq("user_id", user.id).maybeSingle();
          await issueCode(email, "reset", prof?.full_name?.split(/\s+/)[0]);
        }
        return json({
          ok: true,
          message: "If this is an administrator email, a code has been sent.",
        }, 200, req);
      }

      const user = await findUserByEmail(email);
      if (!user) {
        return json({ error: "You do not have an account yet. Please register first.", code: "NOT_REGISTERED" }, 404, req);
      }
      if (!user.email_confirmed_at) {
        return json({ error: "This email has not been verified yet. Please verify your email first.", code: "NOT_VERIFIED" }, 409, req);
      }
      const { data: prof } = await db.from("school_profiles").select("full_name").eq("user_id", user.id).maybeSingle();
      const r: any = await issueCode(email, "reset", prof?.full_name?.split(/\s+/)[0]);
      if (r.wait) return json({ error: `A code was just sent. Please wait ${RESEND_COOLDOWN_SEC} seconds before asking again.` }, 429, req);
      return json({ ok: true }, 200, req);
    }

    if (p.action === "verify_reset") {
      if (!(await rateLimit(`acct:verify:${ip}:${email}`, 3600, 10))) {
        return json({ error: "Too many requests. Please try again later." }, 429, req);
      }
      const portal = p.portal === "admin" ? "admin" : "parent";
      if (portal === "admin" && !(await isAdminEmail(email))) {
        return json({ error: "Unable to reset password." }, 400, req);
      }
      const bad = passwordProblem(String(p.newPassword ?? ""));
      if (bad) return json({ error: bad }, 400, req);
      const user = await findUserByEmail(email);
      if (!user) return json({ error: "You do not have an account yet. Please register first.", code: "NOT_REGISTERED" }, 404, req);
      const codeBad = await consumeCode(email, "reset", clean(p.code, 6));
      if (codeBad) return json({ error: codeBad }, 400, req);
      const u = await db.auth.admin.updateUserById(user.id, { password: String(p.newPassword) });
      if (u.error) throw u.error;
      await db.auth.admin.signOut(user.id).catch(() => {});
      try {
        await db.from("school_audit_log").insert({
          actor_id: user.id,
          action: portal === "admin" ? "admin_password_reset" : "parent_password_reset",
          target: email,
          ip,
        });
      } catch { /* audit table may not exist yet */ }
      return json({ ok: true }, 200, req);
    }

    return json({ error: "Unknown action." }, 400, req);
  } catch (e) {
    console.error(e);
    return genericError(req, 500);
  }
});
