import { useEffect, useState } from "react";
import { appsApi } from "./supabase.js";

/** Manage website administrators (add by name, email, temporary password). */
export function AdminAdminsTab({ token }) {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const data = await appsApi({ action: "list_admins" }, token);
    setAdmins(data.admins || []);
  };

  useEffect(() => {
    if (!token) return;
    load().catch((err) => setStatus(err.message || "Unable to load admins."));
  }, [token]);

  const createAdmin = async (e) => {
    e.preventDefault();
    setStatus("");
    setBusy(true);
    try {
      await appsApi(
        {
          action: "create_admin",
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        },
        token
      );
      setForm({ name: "", email: "", password: "" });
      setStatus("Admin added. They can sign in at /admin with the email and password you set.");
      await load();
    } catch (err) {
      setStatus(err.message || "Unable to add admin.");
    } finally {
      setBusy(false);
    }
  };

  const setActive = async (user_id, active) => {
    setStatus("");
    try {
      await appsApi({ action: "set_admin_active", user_id, active }, token);
      await load();
      setStatus(active ? "Admin reactivated." : "Admin deactivated.");
    } catch (err) {
      setStatus(err.message || "Unable to update admin.");
    }
  };

  return (
    <div>
      <div className="row-head" style={{ marginBottom: 16 }}>
        <div>
          <h3>Administrators</h3>
          <p className="lede">
            Add people who can open the admin panel to manage admissions, enquiries and newsletters. They sign in at /admin.
          </p>
        </div>
      </div>

      <form className="card" onSubmit={createAdmin} style={{ marginBottom: 24, maxWidth: 480 }}>
        <h3>Add admin</h3>
        <label>
          Full name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
        </label>
        <label>
          Temporary password
          <input
            type="text"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </label>
        <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>
          Share this password with them securely. They can change it later with “Forgot password” on the admin sign-in page.
        </p>
        {status && <p className="form-success" role="status">{status}</p>}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Adding…" : "Add admin"}
        </button>
      </form>

      <div className="card">
        <h3>Current admins</h3>
        {!admins.length && <p>No admins listed yet. Add one above after you sign in as an administrator.</p>}
        <ul className="checks" style={{ listStyle: "none", padding: 0 }}>
          {admins.map((a) => (
            <li key={a.user_id} style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <strong>{a.name || "—"}</strong>
                <br />
                <span>{a.email || a.user_id}</span>
                <br />
                <small>
                  {a.active ? "Active" : "Inactive"} · {a.role}
                </small>
              </div>
              {a.active ? (
                <button type="button" className="btn small ghost dark" onClick={() => setActive(a.user_id, false)}>
                  Deactivate
                </button>
              ) : (
                <button type="button" className="btn small" onClick={() => setActive(a.user_id, true)}>
                  Reactivate
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
