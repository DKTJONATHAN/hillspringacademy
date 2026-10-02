import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const secretKeysRaw = Deno.env.get("SUPABASE_SECRET_KEYS") || "{}";
const secretKeys = JSON.parse(secretKeysRaw);
const SUPABASE_SECRET_KEY = secretKeys.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM = "Hill Springs Academy <info@hillspringacademy.sc.ke>";
const SCHOOL_EMAIL = "info@hillspringacademy.sc.ke";
const ADMISSIONS_EMAIL = "admissions@hillspringacademy.sc.ke";
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type, apikey, authorization" } });
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]!));
const validEmail = (e: unknown) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e ?? "").trim());

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured.");
  const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` }, body: JSON.stringify({ from: FROM, to: [to], subject, html }) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.message || "Email delivery failed.");
  return data;
}

Deno.serve(async req => {
  if (req.method === "OPTIONS") return json({});
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let p: any;
  try { p = await req.json(); } catch { return json({ error: "Invalid request." }, 400); }
  if (p.website) return json({ ok: true });

  try {
    if (p.action === "subscribe") {
      const email = String(p.email ?? "").trim().toLowerCase();
      const name = String(p.name ?? "").trim() || null;
      if (!validEmail(email)) return json({ error: "Please enter a valid email address." }, 400);
      const { data: existing } = await supabase.from("school_subscribers").select("id,active").eq("email", email).maybeSingle();
      if (existing?.active) return json({ ok: true, message: "Already subscribed." });
      if (existing) {
        const r = await supabase.from("school_subscribers").update({ name, active: true, unsubscribed_at: null }).eq("id", existing.id).select("id").single();
        if (r.error) throw r.error;
      } else {
        const r = await supabase.from("school_subscribers").insert({ email, name }).select("id").single();
        if (r.error) throw r.error;
      }
      const firstName = name?.split(/\s+/)[0] || email;
      let welcomeEmailId = null;
      let welcomeEmailError = null;
      try {
        const welcome = await sendEmail(email, "Welcome to Hill Springs Academy updates", `<div style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#202124"><div style="max-width:640px;margin:0 auto;padding:28px 16px"><div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.06)"><div style="background:#c8102e;padding:26px 28px;text-align:center"><img src="https://hillspringsacademy.sc.ke/logo.png" alt="Hill Springs Academy" style="max-height:82px;max-width:220px;width:auto;background:#fff;border-radius:10px;padding:7px;box-sizing:border-box"><div style="color:#fff;font-size:12px;letter-spacing:1.5px;margin-top:12px;font-weight:bold">HILL SPRINGS ACADEMY</div></div><div style="padding:32px 30px"><p style="margin:0 0 8px;color:#666;font-size:14px">WELCOME TO OUR SCHOOL COMMUNITY</p><h1 style="margin:0 0 18px;font-size:28px;line-height:1.2;color:#c8102e">Welcome, ${esc(firstName)}!</h1><p style="font-size:16px;line-height:1.7;margin:0 0 16px">Thank you for subscribing to Hill Springs Academy updates.</p><p style="font-size:15px;line-height:1.7;margin:0 0 20px">Hill Springs Academy is a school in Maua, Igembe South, Meru County, Kenya. We use our updates to share selected school notices, admissions information, learning resources and school news with families and members of our school community.</p><div style="background:#f7f7f7;border-left:4px solid #c8102e;padding:16px 18px;margin:22px 0"><p style="margin:0;font-size:15px;line-height:1.6"><strong>Our motto</strong><br>BUILDING AN EXCELLENT FOUNDATION FOR A BRIGHTER FUTURE</p></div><p style="font-size:15px;line-height:1.7;margin:0 0 22px">We are glad to have you with us and look forward to keeping you informed.</p><a href="https://hillspringsacademy.sc.ke" style="display:inline-block;background:#c8102e;color:#fff;text-decoration:none;padding:13px 20px;border-radius:8px;font-weight:bold">Visit Hill Springs Academy</a></div><div style="border-top:1px solid #eee;padding:20px 30px;color:#666;font-size:13px;line-height:1.6"><strong style="color:#333">Hill Springs Academy</strong><br>Maua, Igembe South, Meru County, Kenya<br><a href="mailto:${SCHOOL_EMAIL}" style="color:#c8102e">${SCHOOL_EMAIL}</a><br><br>You received this email because you subscribed to school updates on our website.</div></div><p style="text-align:center;color:#888;font-size:11px;margin:14px 0">Hill Springs Academy · ${new Date().getFullYear()}</p></div></div>`);
        welcomeEmailId = welcome?.id || null;
      } catch (e) {
        welcomeEmailError = e instanceof Error ? e.message : String(e);
        console.error("Welcome email failed", e);
      }
      return json({ ok: true, emailSent: Boolean(welcomeEmailId), emailId: welcomeEmailId, emailError: welcomeEmailError });
    }

    if (p.action === "unsubscribe") {
      const email = String(p.email ?? "").trim().toLowerCase();
      if (!validEmail(email)) return json({ error: "Please enter a valid email address." }, 400);
      await supabase.from("school_subscribers").update({ active: false, unsubscribed_at: new Date().toISOString() }).eq("email", email);
      return json({ ok: true });
    }

    if (p.action === "enquiry") {
      const email = String(p.email ?? "").trim().toLowerCase();
      const name = String(p.name ?? "").trim();
      const subject = String(p.subject ?? "").trim() || (p.type === "admissions" ? "Student enrolment enquiry" : "General enquiry");
      const message = String(p.message ?? "").trim();
      if (!name || !validEmail(email) || !message) return json({ error: "Please complete your name, email and message." }, 400);
      const kind = p.type === "admissions" ? "admissions" : "contact";
      const r = await supabase.from("school_conversations").insert({ kind, name, email, phone: String(p.phone ?? "").trim() || null, subject, student_name: String(p.studentName ?? "").trim() || null, current_level: String(p.currentLevel ?? "").trim() || null, requested_level: String(p.requestedLevel ?? "").trim() || null, message, status: "new" }).select("id").single();
      if (r.error) throw r.error;
      const convId = r.data.id;
      const m = await supabase.from("school_messages").insert({ conversation_id: convId, sender_type: "parent", sender_name: name, sender_email: email, body: message, delivery_status: "received" });
      if (m.error) throw m.error;
      const destination = kind === "admissions" ? ADMISSIONS_EMAIL : SCHOOL_EMAIL;
      const label = kind === "admissions" ? "Admissions enquiry" : "New website enquiry";
      let notificationEmailId = null;
      let notificationEmailError = null;
      try {
        const notification = await sendEmail(destination, `${label}: ${subject}`, `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto"><div style="padding:18px;background:#c8102e;color:#fff"><strong>Hill Springs Academy</strong></div><div style="padding:24px"><h2>${esc(label)}</h2><p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p>${p.phone ? `<p><strong>Phone:</strong> ${esc(p.phone)}</p>` : ""}${p.studentName ? `<p><strong>Learner:</strong> ${esc(p.studentName)}</p>` : ""}${p.currentLevel ? `<p><strong>Current level:</strong> ${esc(p.currentLevel)}</p>` : ""}${p.requestedLevel ? `<p><strong>Requested level:</strong> ${esc(p.requestedLevel)}</p>` : ""}<p><strong>Subject:</strong> ${esc(subject)}</p><div style="white-space:pre-wrap;padding:16px;background:#f5f5f5;border-radius:8px">${esc(message)}</div></div></div>`);
        notificationEmailId = notification?.id || null;
      } catch (e) {
        notificationEmailError = e instanceof Error ? e.message : String(e);
        console.error("School notification email failed", e);
      }
      return json({ ok: true, conversationId: convId, emailSent: Boolean(notificationEmailId), emailId: notificationEmailId, emailError: notificationEmailError });
    }
    return json({ error: "Unknown action." }, 400);
  } catch (e) { console.error(e); return json({ error: e instanceof Error ? e.message : "Request failed." }, 500); }
});