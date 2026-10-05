import { useEffect, useState } from "react";
import { appsApi } from "./supabase.js";

const roleLabel = (role) => role === "owner" ? "Owner" : role === "editor" ? "Editor" : "Admin";

export function AdminAdminsTab({ token }) {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState("");

  const load = async () => {
    const data = await appsApi({ action: "list_admins" }, token);
    setAdmins(data.admins || []);
  };

  useEffect(() => {
    if (!token) return;
    load().catch((err) => setError(err.message || "Unable to load administrators."));
  }, [token]);

  const createAdmin = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    setBusy(true);
    try {
      await appsApi({
        action: "create_admin",
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      }, token);
      setForm({ name: "", email: "", password: "", role: "admin" });
      setStatus("Administrator created successfully.");
      await load();
    } catch (err) {
      setError(err.message || "Unable to add administrator.");
    } finally {
      setBusy(false);
    }
  };

  const setRole = async (user_id, role) => {
    setStatus("");
    setError("");
    try {
      await appsApi({ action: "set_admin_role", user_id, role }, token);
      await load();
      setStatus("Administrator role updated.");
    } catch (err) {
      setError(err.message || "Unable to update administrator role.");
    }
  };

  const deleteAdmin = async (admin) => {
    const name = admin.name || admin.email || "this administrator";
    const confirmed = window.confirm(
      `PERMANENT DELETE\n\nYou are about to permanently delete ${name}.\n\nThis removes the administrator's account, access and administrator records. This action cannot be undone.\n\nContinue?`
    );
    if (!confirmed) return;

    setDeleting(admin.user_id);
    setStatus("");
    setError("");

    try {
      await appsApi({
        action: "set_admin_active",
        user_id: admin.user_id,
        active: false,
      }, token);

      setStatus(`${name} was permanently deleted.`);
      await load();
    } catch (err) {
      setError(err.message || "Unable to permanently delete administrator.");
    } finally {
      setDeleting("");
    }
  };

  const owners = admins.filter((a) => a.role === "owner").length;
  const managers = admins.filter((a) => a.role !== "owner").length;

  return (
    <div className="admin-section">
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">Security & access</span>
          <h2>Administrator management</h2>
          <p>Control who can access the Hill Springs Academy administration portal.</p>
        </div>
        <div className="admin-stat-pills">
          <span><b>{admins.length}</b> total</span>
          <span><b>{owners}</b> owners</span>
          <span><b>{managers}</b> staff</span>
        </div>
      </div>

      {(status || error) && (
        <div className={error ? "admin-alert error" : "admin-alert success"} role="status">
          {error || status}
        </div>
      )}

      <div className="admin-two-column">
        <form className="admin-panel-card" onSubmit={createAdmin}>
          <div className="admin-card-heading">
            <div className="admin-icon">+</div>
            <div>
              <h3>Add administrator</h3>
              <p>Create a new admin or editor account.</p>
            </div>
          </div>

          <label>
            Full name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" placeholder="Full name" />
          </label>

          <label>
            Email address
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" placeholder="name@example.com" />
          </label>

          <label>
            Temporary password
            <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" />
          </label>

          <label>
            Access level
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="admin">Admin — operational access</option>
              <option value="editor">Editor — operational access</option>
            </select>
          </label>

          <div className="admin-info-box">
            <strong>Owner protection</strong>
            <span>Only owners can manage administrators. Owner accounts cannot be deleted or demoted from this portal.</span>
          </div>

          <button className="btn admin-primary-btn" type="submit" disabled={busy}>
            {busy ? "Creating account…" : "Create administrator"}
          </button>
        </form>

        <div className="admin-panel-card">
          <div className="admin-card-heading">
            <div className="admin-icon">✓</div>
            <div>
              <h3>Access levels</h3>
              <p>How administrator roles are protected.</p>
            </div>
          </div>

          <div className="role-explainer">
            <div><span className="role-badge owner">Owner</span><p>Full control of administrators and school operations. Protected from deletion and demotion.</p></div>
            <div><span className="role-badge admin">Admin</span><p>Operational administration access. Can be managed by an owner.</p></div>
            <div><span className="role-badge editor">Editor</span><p>Operational access with editor-level permissions. Can be managed by an owner.</p></div>
          </div>

          <div className="admin-danger-note">
            <strong>Permanent deletion</strong>
            <span>Deleting an administrator removes their Auth account and school administrator record permanently. The action cannot be undone.</span>
          </div>
        </div>
      </div>

      <div className="admin-panel-card admin-list-card">
        <div className="admin-card-heading">
          <div className="admin-icon">☰</div>
          <div>
            <h3>Current administrators</h3>
            <p>Active accounts and their access levels.</p>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Administrator</th><th>Role</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.user_id}>
                  <td>
                    <div className="admin-person">
                      <div className="admin-avatar">{(a.name || a.email || "A").slice(0, 1).toUpperCase()}</div>
                      <div><strong>{a.name || "Unnamed administrator"}</strong><span>{a.email || a.user_id}</span></div>
                    </div>
                  </td>
                  <td>
                    {a.role === "owner" ? (
                      <span className="role-badge owner">Owner</span>
                    ) : (
                      <select value={a.role === "editor" ? "editor" : "admin"} onChange={(e) => setRole(a.user_id, e.target.value)} aria-label={"Role for " + (a.name || a.email || "administrator")}>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                      </select>
                    )}
                  </td>
                  <td><span className="status-dot"><i />Active</span></td>
                  <td>
                    {a.role === "owner" ? (
                      <span className="protected-label">Protected owner</span>
                    ) : (
                      <button
                        type="button"
                        className="btn small danger-btn"
                        disabled={deleting === a.user_id}
                        onClick={() => deleteAdmin(a)}
                      >
                        {deleting === a.user_id ? "Deleting…" : "Delete permanently"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!admins.length && <div className="admin-empty">No administrators found.</div>}
        </div>
      </div>
    </div>
  );
}
