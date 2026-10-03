import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { db, json, cors, validEmail, clean, norm, userFromRequest, requireAdmin } from "../_shared/util.ts";
import { sendEmail, acceptanceEmail, rejectionEmail, applicationReceivedEmail, enquiryReceivedEmail, esc,
  FROM_ADMISSIONS, ADMISSIONS_EMAIL, SCHOOL_EMAIL, layout } from "../_shared/email.ts";

Deno.serve(async req => {
  if (req.method === "OPTIONS") return json({});
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let p: any;
  try { p = await req.json(); } catch { return json({ error: "Invalid request." }, 400); }

  try {
    // ===================== Signed-in parent actions =====================
    if (["submit_application", "submit_enquiry", "my_submissions"].includes(p.action)) {
      const user = await userFromRequest(req);
      if (!user?.email) return json({ error: "Please sign in to continue.", code: "AUTH" }, 401);
      const email = norm(user.email);
      const { data: prof } = await db.from("school_profiles").select("full_name,phone").eq("user_id", user.id).maybeSingle();

      if (p.action === "my_submissions") {
        const apps = await db.from("school_applications")
          .select("id,learner_name,requested_level,status,created_at,decided_at").eq("user_id", user.id).order("created_at", { ascending: false });
        const enq = await db.from("school_conversations")
          .select("id,subject,status,created_at").eq("user_id", user.id).order("created_at", { ascending: false });
        return json({ ok: true, profile: prof, applications: apps.data || [], enquiries: enq.data || [] });
      }

      if (p.action === "submit_application") {
        const learner = clean(p.learnerName, 120), level = clean(p.requestedLevel, 80);
        if (!learner || !level) return json({ error: "Please enter the learner's name and the level requested." }, 400);
        const parent = clean(p.parentName, 120) || prof?.full_name || email;
        const ins = await db.from("school_applications").insert({
          user_id: user.id, parent_name: parent, parent_email: email, phone: clean(p.phone, 30) || prof?.phone || null,
          learner_name: learner, learner_dob: p.learnerDob || null, gender: clean(p.gender, 20) || null,
          current_level: clean(p.currentLevel, 80) || null, requested_level: level,
          previous_school: clean(p.previousSchool, 160) || null, entry_term: clean(p.entryTerm, 60) || null,
          notes: clean(p.notes, 2000) || null,
        }).select("id").single();
        if (ins.error) throw ins.error;
        const out: any = { ok: true, id: ins.data.id };
        try { // confirmation to parent
          const m = applicationReceivedEmail({ parent, learner, level });
          await sendEmail({ to: email, subject: m.subject, html: m.html, from: FROM_ADMISSIONS, replyTo: ADMISSIONS_EMAIL });
        } catch (e) { out.parentEmailError = String(e); console.error(e); }
        try { // alert to school
          const html = layout({ eyebrow: "New application", title: "A new admission application", body:
            `<p><strong>${esc(learner)}</strong> for <strong>${esc(level)}</strong><br>Parent: ${esc(parent)} (${esc(email)})</p><p>Open the admin dashboard to review and decide.</p>` });
          await sendEmail({ to: ADMISSIONS_EMAIL, subject: `New application: ${learner} (${level})`, html, replyTo: email });
        } catch (e) { console.error(e); }
        return json(out);
      }

      if (p.action === "submit_enquiry") {
        const subject = clean(p.subject, 160) || "General enquiry", message = clean(p.message, 4000);
        if (message.length < 5) return json({ error: "Please write your enquiry." }, 400);
        const name = prof?.full_name || email;
        const kind = p.topic === "admissions" ? "admissions" : "contact";
        const r = await db.from("school_conversations").insert({
          kind, name, email, phone: clean(p.phone, 30) || prof?.phone || null, subject,
          student_name: clean(p.learnerName, 120) || null, message, status: "new", user_id: user.id,
        }).select("id").single();
        if (r.error) throw r.error;
        await db.from("school_messages").insert({ conversation_id: r.data.id, sender_type: "parent", sender_name: name, sender_email: email, body: message, delivery_status: "received" });
        const out: any = { ok: true, id: r.data.id };
        try {
          const m = enquiryReceivedEmail({ name, subject });
          await sendEmail({ to: email, subject: m.subject, html: m.html, replyTo: SCHOOL_EMAIL });
        } catch (e) { console.error(e); }
        try {
          const html = layout({ eyebrow: "New enquiry", title: esc(subject), body: `<p><strong>${esc(name)}</strong> &lt;${esc(email)}&gt;</p><div style="white-space:pre-wrap;background:#f7f7f8;padding:14px;border-radius:8px">${esc(message)}</div>` });
          await sendEmail({ to: kind === "admissions" ? ADMISSIONS_EMAIL : SCHOOL_EMAIL, subject: `New enquiry: ${subject}`, html, replyTo: email });
        } catch (e) { console.error(e); }
        return json(out);
      }
    }

    // ========================= Admin actions ============================
    if (["whoami", "list_applications", "decide_application"].includes(p.action)) {
      const admin = await requireAdmin(req);
      if (!admin) return json({ error: "Administrator access only.", code: "NOT_ADMIN" }, 403);

      if (p.action === "whoami") return json({ ok: true, email: admin.email });

      if (p.action === "list_applications") {
        let q = db.from("school_applications").select("*").order("created_at", { ascending: false }).limit(300);
        if (["pending", "accepted", "rejected"].includes(p.status)) q = q.eq("status", p.status);
        const { data, error } = await q;
        if (error) throw error;
        return json({ ok: true, applications: data });
      }

      if (p.action === "decide_application") {
        const decision = p.decision === "accepted" ? "accepted" : p.decision === "rejected" ? "rejected" : "";
        if (!decision) return json({ error: "Decision must be accepted or rejected." }, 400);
        const note = clean(p.note, 1000);
        // Only decide once: guards against double clicks sending two emails.
        const upd = await db.from("school_applications")
          .update({ status: decision, decision_note: note || null, decided_by: norm(admin.email), decided_at: new Date().toISOString() })
          .eq("id", p.id).eq("status", "pending").select("*").maybeSingle();
        if (upd.error) throw upd.error;
        if (!upd.data) return json({ error: "This application has already been decided." }, 409);
        const a = upd.data;
        const args = { parent: a.parent_name, learner: a.learner_name, level: a.requested_level, note };
        const mail = decision === "accepted" ? acceptanceEmail(args) : rejectionEmail(args);
        let emailId: string | null = null, emailError: string | null = null;
        try {
          const sent = await sendEmail({ to: a.parent_email, subject: mail.subject, html: mail.html, from: FROM_ADMISSIONS, replyTo: ADMISSIONS_EMAIL });
          emailId = sent.id || null;
        } catch (e) { emailError = e instanceof Error ? e.message : String(e); console.error(e); }
        await db.from("school_applications").update({ decision_email_id: emailId, decision_email_error: emailError }).eq("id", a.id);
        return json({ ok: true, status: decision, emailSent: Boolean(emailId), emailError });
      }
    }

    return json({ error: "Unknown action." }, 400);
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Request failed." }), { status: 500, headers: cors });
  }
});
