import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { db, json, cors, validEmail, clean, norm, userFromRequest, requireAdmin, requireAdminManager, findUserByEmail, isAdminUserId, passwordProblem, clientIp } from "../_shared/util.ts";
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
        try {
          const m = applicationReceivedEmail({ parent, learner, level });
          await sendEmail({ to: email, subject: m.subject, html: m.html, from: FROM_ADMISSIONS, replyTo: ADMISSIONS_EMAIL });
        } catch (e) { out.parentEmailError = String(e); console.error(e); }
        try {
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
          const html = layout({ eyebrow: "New enquiry", title: esc(subject), body: `<p><strong>${esc(name)}</strong> <${esc(email)}></p><div style="white-space:pre-wrap;background:#f7f7f8;padding:14px;border-radius:8px">${esc(message)}</div>` });
          await sendEmail({ to: kind === "admissions" ? ADMISSIONS_EMAIL : SCHOOL_EMAIL, subject: `New enquiry: ${subject}`, html, replyTo: email });
        } catch (e) { console.error(e); }
        return json(out);
      }
    }

    // ========================= Admin actions ============================
    if (["whoami", "list_applications", "decide_application", "list_admins", "create_admin", "set_admin_active", "set_admin_role"].includes(p.action)) {
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

      if (["list_admins", "create_admin", "set_admin_active", "set_admin_role"].includes(p.action)) {
        const manager = await requireAdminManager(req);
        if (!manager) return json({ error: "Only the owner administrator can manage administrators.", code: "OWNER_REQUIRED" }, 403);

        if (p.action === "list_admins") {
          const { data: rows, error } = await db.from("school_admins")
            .select("user_id,name,role,active,created_at")
            .order("created_at", { ascending: true });
          if (error) throw error;
          const admins = [];
          for (const row of rows || []) {
            let email = "";
            try {
              const { data: u } = await db.auth.admin.getUserById(row.user_id);
              email = u?.user?.email || "";
            } catch { /* ignore */ }
            admins.push({ user_id: row.user_id, name: row.name || "", email, role: row.role, active: row.active, created_at: row.created_at });
          }
          return json({ ok: true, admins });
        }

        if (p.action === "create_admin") {
        const name = clean(p.name, 120);
        const email = norm(p.email);
        const password = String(p.password ?? "");
        const role = p.role === "editor" ? "editor" : "admin";
        if (!name) return json({ error: "Please enter the admin's name." }, 400);
        if (!validEmail(email)) return json({ error: "Please enter a valid email address." }, 400);
        const badPw = passwordProblem(password);
        if (badPw) return json({ error: badPw }, 400);

        let userId: string | null = null;
        const existing = await findUserByEmail(email);
        if (existing) {
          if (await isAdminUserId(existing.id)) {
            const { data: row } = await db.from("school_admins").select("active").eq("user_id", existing.id).maybeSingle();
            if (row?.active) {
              return json({ error: "This email is already an active administrator." }, 409);
            }
            await db.auth.admin.updateUserById(existing.id, { password, email_confirm: true });
            const up = await db.from("school_admins").update({ name, role, active: true }).eq("user_id", existing.id);
            if (up.error) throw up.error;
            await db.from("school_profiles").upsert({ user_id: existing.id, full_name: name });
            await db.from("school_audit_log").insert({ actor_id: manager.user.id, action: "admin_reactivated", target: email, details: { name, role }, ip: clientIp(req) });
            return json({ ok: true, reactivated: true, email, role });
          }
          userId = existing.id;
          await db.auth.admin.updateUserById(userId, { password, email_confirm: true });
        } else {
          const created = await db.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: name, role: "admin" },
          });
          if (created.error) throw created.error;
          userId = created.data.user!.id;
        }

        const ins = await db.from("school_admins").upsert({
          user_id: userId,
          name,
          role,
          active: true,
        });
        if (ins.error) throw ins.error;
        await db.from("school_profiles").upsert({ user_id: userId, full_name: name });
        await db.from("school_audit_log").insert({ actor_id: manager.user.id, action: "admin_created", target: email, details: { name, role }, ip: clientIp(req) });

        try {
          const html = layout({
            eyebrow: "Admin access",
            title: "You have been added as an administrator",
            body: `<p>Hello ${esc(name)},</p>
              <p>You can sign in to the Hill Springs Academy admin panel to manage admissions, enquiries and newsletters.</p>
              <p><strong>Sign-in page:</strong> <a href="https://hillspringsacademy.sc.ke/admin">hillspringsacademy.sc.ke/admin</a></p>
              <p><strong>Email:</strong> ${esc(email)}<br>
              Use the temporary password you were given, then change it with “Forgot password” if you prefer.</p>`,
          });
          await sendEmail({ to: email, subject: "Admin access — Hill Springs Academy", html, replyTo: SCHOOL_EMAIL });
        } catch (e) { console.error(e); }

        return json({ ok: true, created: true, email, role });
        }

        if (p.action === "set_admin_active") {
          const userId = clean(p.user_id, 80);
          if (!userId) return json({ error: "Missing admin id." }, 400);
          if (userId === manager.user.id) return json({ error: "You cannot deactivate your own account." }, 400);
          const active = p.active === true || p.active === "true";
          const { data: target } = await db.from("school_admins").select("role,active").eq("user_id", userId).maybeSingle();
          if (!target) return json({ error: "Administrator not found." }, 404);
          if (target.role === "owner") return json({ error: "An owner cannot be deactivated. Change their role first." }, 400);
          const up = await db.from("school_admins").update({ active }).eq("user_id", userId);
          if (up.error) throw up.error;
          if (!active) await db.auth.admin.signOut(userId, "global").catch(() => {});
          await db.from("school_audit_log").insert({ actor_id: manager.user.id, action: active ? "admin_reactivated" : "admin_deactivated", target: userId, details: { active }, ip: clientIp(req) });
          return json({ ok: true, user_id: userId, active });
        }

        if (p.action === "set_admin_role") {
          const userId = clean(p.user_id, 80);
          const role = p.role === "editor" ? "editor" : p.role === "admin" ? "admin" : "";
          if (!userId || !role) return json({ error: "A valid admin id and role are required." }, 400);
          if (userId === manager.user.id) return json({ error: "You cannot change your own role." }, 400);
          const { data: target } = await db.from("school_admins").select("role,active").eq("user_id", userId).maybeSingle();
          if (!target) return json({ error: "Administrator not found." }, 404);
          if (target.role === "owner" && role !== "owner") {
            const { count } = await db.from("school_admins").select("user_id", { count: "exact", head: true }).eq("role", "owner").eq("active", true);
            if ((count ?? 0) <= 1) return json({ error: "There must always be at least one active owner." }, 400);
          }
          const up = await db.from("school_admins").update({ role }).eq("user_id", userId);
          if (up.error) throw up.error;
          await db.from("school_audit_log").insert({ actor_id: manager.user.id, action: "admin_role_changed", target: userId, details: { from: target.role, to: role }, ip: clientIp(req) });
          return json({ ok: true, user_id: userId, role });
        }
      }
    }

    return json({ error: "Unknown action." }, 400);
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Request failed." }), { status: 500, headers: cors });
  }
});
