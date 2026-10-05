import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { db, json, userFromRequest, requireAdmin, clientIp, clean } from "../_shared/util.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json({});
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const admin = await requireAdmin(req);
    if (!admin) return json({ error: "Administrator access only.", code: "NOT_ADMIN" }, 403);

    const p = await req.json().catch(() => ({}));

    if (p.action === "delete_enquiry") {
      const id = clean(p.id, 80);
      if (!id) return json({ error: "Missing enquiry id." }, 400);

      const { data: conversation, error: findError } = await db
        .from("school_conversations")
        .select("id,subject,status")
        .eq("id", id)
        .maybeSingle();
      if (findError) throw findError;
      if (!conversation) return json({ error: "Enquiry not found." }, 404);

      const messages = await db.from("school_messages").delete().eq("conversation_id", id);
      if (messages.error) throw messages.error;

      const deleted = await db.from("school_conversations").delete().eq("id", id);
      if (deleted.error) throw deleted.error;

      await db.from("school_audit_log").insert({
        actor_id: admin.id,
        action: "enquiry_deleted",
        target: id,
        ip: clientIp(req),
      });

      return json({ ok: true, deleted: id, status: conversation.status });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Request failed." }, 500);
  }
});
