import { useEffect, useMemo, useState } from "react";
import { PageHead } from "./components.jsx";
import { adminCall, adminDeleteCall, adminSignIn, appsApi } from "./supabase.js";
import { AdminAdminsTab } from "./AdminAdminsTab.jsx";
import { getAdminToken, setAdminToken, clearAdminToken } from "./session.js";

const NAV = [
  ["overview", "Overview", "⌂"],
  ["applications", "Admissions", "▣"],
  ["messages", "Enquiries", "✉"],
  ["subscribers", "Subscribers", "◎"],
  ["compose", "Email centre", "✎"],
  ["admins", "Administrators", "♙"],
];

export function AdminEmailCentre() {
  const [token, setToken] = useState(() => getAdminToken());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetStep, setResetStep] = useState("request");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [tab, setTab] = useState("overview");
  const [adminInfo, setAdminInfo] = useState(null);
  const [apps, setApps] = useState([]);
  const [appFilter, setAppFilter] = useState("pending");
  const [appStatus, setAppStatus] = useState("");
  const [notes, setNotes] = useState({});
  const [deciding, setDeciding] = useState("");
  const [deletingApp, setDeletingApp] = useState("");
  const [deletingEnquiry, setDeletingEnquiry] = useState("");
  const [resetCooldown, setResetCooldown] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [compose, setCompose] = useState({
    kind: "newsletter",
    audience: "subscribers",
    subject: "",
    content: "",
    recipients: "",
  });

  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow";
    return () => { robots.content = "index, follow"; };
  }, []);

  const loadConversations = async (t = token) => {
    const data = await adminCall(t, { action: "list_conversations" });
    setConversations(data.conversations || []);
  };

  const loadSubscribers = async (t = token) => {
    const data = await adminCall(t, { action: "subscribers" });
    setSubscribers(data.subscribers || []);
  };

  const loadAdmins = async (t = token) => {
    try {
      const data = await appsApi({ action: "list_admins" }, t);
      setAdmins(data.admins || []);
    } catch {
      setAdmins([]);
    }
  };

  const loadApps = async (statusFilter = appFilter, t = token) => {
    setAppStatus("");
    try {
      const body = { action: "list_applications" };
      if (statusFilter && statusFilter !== "all") body.status = statusFilter;
      const data = await appsApi(body, t);
      setApps(data.applications || []);
    } catch (err) {
      setAppStatus(err.message || "Unable to load applications.");
    }
  };

  const loadPortal = async (t = token) => {
    try {
      const me = await appsApi({ action: "whoami" }, t);
      setAdminInfo(me);
      await Promise.all([
        loadApps("all", t),
        loadConversations(t),
        loadSubscribers(t),
        loadAdmins(t),
      ]);
    } catch {
      clearAdminToken();
      setToken("");
    }
  };

  useEffect(() => {
    if (token) loadPortal(token);
  }, []);

  useEffect(() => {
    if (resetCooldown <= 0) return;
    const t = setTimeout(() => setResetCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resetCooldown]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return conversations.filter((c) => {
      if (filter !== "all" && c.status !== filter) return false;
      if (!q) return true;
      return [c.requester_name, c.requester_email, c.subject, c.type]
        .filter(Boolean).join(" ").toLowerCase().includes(q);
    });
  }, [conversations, filter, search]);

  const pendingCount = apps.filter((a) => a.status === "pending").length;
  const openEnquiries = conversations.filter((c) => c.status !== "closed").length;

  const requestReset = async (e) => {
    e.preventDefault();
    setResetStatus("");
    try {
      const { requestAdminPasswordReset } = await import("./supabase.js");
      await requestAdminPasswordReset(email);
      setResetStep("verify");
      setResetCooldown(60);
      setResetStatus("If this email is an administrator, a code was sent.");
    } catch (err) {
      setResetStatus(err.message || "Unable to send reset code.");
    }
  };

  const verifyReset = async (e) => {
    e.preventDefault();
    setResetStatus("");
    try {
      const { verifyAdminPasswordReset } = await import("./supabase.js");
      await verifyAdminPasswordReset(email, resetCode, newPassword);
      setResetStatus("Password updated. You can sign in now.");
      setResetMode(false);
      setResetStep("request");
      setResetCode("");
      setNewPassword("");
    } catch (err) {
      setResetStatus(err.message || "Unable to reset password.");
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const data = await adminSignIn(email, password);
      const me = await appsApi({ action: "whoami" }, data.access_token);
      setAdminToken(data.access_token);
      setToken(data.access_token);
      setAdminInfo(me);
      setPassword("");
      await loadPortal(data.access_token);
    } catch (err) {
      setLoginError(err.message || "Unable to sign in.");
    }
  };

  const openConversation = async (id) => {
    const data = await adminCall(token, { action: "get_conversation", id });
    setSelected(data.conversation);
    setMessages(data.messages || []);
    setReply("");
    setStatus("");
  };

  const sendReply = async () => {
    if (!selected || reply.trim().length < 2) return;
    setStatus("Sending through Resend…");
    try {
      await adminCall(token, { action: "reply", id: selected.id, reply });
      setReply("");
      setStatus("Reply sent successfully.");
      await openConversation(selected.id);
      await loadConversations();
    } catch (err) {
      setStatus(err.message || "Reply failed.");
    }
  };

  const closeConversation = async () => {
    if (!selected) return;
    try {
      await adminCall(token, { action: "close", id: selected.id });
      await openConversation(selected.id);
      await loadConversations();
    } catch (err) {
      setStatus(err.message || "Unable to close enquiry.");
    }
  };

  const deleteEnquiry = async () => {
    if (!selected) return;
    const label = selected.subject || selected.requester_name || selected.name || "this enquiry";
    if (!window.confirm(`PERMANENT DELETE\\n\\nYou are about to permanently delete "${label}".\\n\\nThe enquiry and its message history will be permanently removed. This cannot be undone.\\n\\nContinue?`)) return;
    setDeletingEnquiry(selected.id);
    setStatus("");
    try {
      await adminDeleteCall(token, { action: "delete_enquiry", id: selected.id });
      setSelected(null);
      setMessages([]);
      await loadConversations();
      setStatus("Enquiry permanently deleted.");
    } catch (err) {
      setStatus(err.message || "Unable to permanently delete enquiry.");
    } finally {
      setDeletingEnquiry("");
    }
  };

  const decide = async (id, decision) => {
    setDeciding(id + decision);
    setAppStatus("");
    try {
      await appsApi({ action: "decide_application", id, decision, note: notes[id] || "" }, token);
      await loadApps();
      setAppStatus(decision === "accepted" ? "Application accepted and parent notified." : "Application rejected and parent notified.");
    } catch (err) {
      setAppStatus(err.message || "Decision failed.");
    } finally {
      setDeciding("");
    }
  };

  const deleteApplication = async (application) => {
    const label = application.learner_name || application.parent_name || "this application";
    if (!window.confirm(`PERMANENT DELETE\\n\\nYou are about to permanently delete the admission application for "${label}".\\n\\nThis removes the application from the admissions records. This cannot be undone.\\n\\nContinue?`)) return;
    setDeletingApp(application.id);
    setAppStatus("");
    try {
      await appsApi({ action: "delete_application", id: application.id }, token);
      await loadApps();
      setAppStatus("Admission application permanently deleted.");
    } catch (err) {
      setAppStatus(err.message || "Unable to permanently delete application.");
    } finally {
      setDeletingApp("");
    }
  };

  const sendCompose = async (e) => {
    e.preventDefault();
    setStatus("Sending…");
    try {
      await adminCall(token, {
        action: compose.kind === "newsletter" ? "send_newsletter" : "send_announcement",
        audience: compose.audience,
        subject: compose.subject,
        content: compose.content,
        recipients: compose.recipients,
      });
      setStatus("Message sent successfully.");
      setCompose({ kind: "newsletter", audience: "subscribers", subject: "", content: "", recipients: "" });
    } catch (err) {
      setStatus(err.message || "Send failed.");
    }
  };

  const logout = () => {
    clearAdminToken();
    setToken("");
    setAdminInfo(null);
    setSelected(null);
    setMessages([]);
    setConversations([]);
  };

  const go = (next) => {
    setTab(next);
    setStatus("");
    if (next === "applications") loadApps();
    if (next === "messages") loadConversations();
    if (next === "subscribers") loadSubscribers();
    if (next === "admins") loadAdmins();
  };

  if (!token) {
    return (
      <>
        <PageHead title="Admin Portal" text="Hill Springs Academy administration sign-in." />
        <section className="admin-login-page">
          <div className="admin-login-brand">
            <img src="/logo.png" alt="Hill Springs Academy" />
            <span>Hill Springs Academy</span>
            <small>ADMINISTRATION PORTAL</small>
          </div>
          {!resetMode ? (
            <form className="admin-login-card" onSubmit={login}>
              <span className="eyebrow">Secure access</span>
              <h1>Welcome back</h1>
              <p>Sign in to manage admissions, enquiries, communications and administrators.</p>
              <label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" /></label>
              <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label>
              {loginError && <p className="form-error" role="alert">{loginError}</p>}
              <button className="btn admin-primary-btn" type="submit">Sign in to portal</button>
              <button type="button" className="admin-link-btn" onClick={() => setResetMode(true)}>Forgot password?</button>
            </form>
          ) : (
            <form className="admin-login-card" onSubmit={resetStep === "request" ? requestReset : verifyReset}>
              <span className="eyebrow">Account recovery</span>
              <h1>Reset admin password</h1>
              {resetStep === "request" ? (
                <>
                  <p>Enter your administrator email and we will send a verification code.</p>
                  <label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                  <button className="btn admin-primary-btn" type="submit" disabled={resetCooldown > 0}>{resetCooldown > 0 ? `Wait ${resetCooldown}s` : "Send verification code"}</button>
                </>
              ) : (
                <>
                  <label>Verification code<input value={resetCode} onChange={(e) => setResetCode(e.target.value)} required /></label>
                  <label>New password<input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} /></label>
                  <button className="btn admin-primary-btn" type="submit">Update password</button>
                </>
              )}
              {resetStatus && <p className="form-success" role="status">{resetStatus}</p>}
              <button type="button" className="admin-link-btn" onClick={() => setResetMode(false)}>Back to sign in</button>
            </form>
          )}
        </section>
      </>
    );
  }

  return (
    <>
      <PageHead title="Admin Portal" text="Hill Springs Academy administration portal." />
      <div className="admin-portal">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <img src="/logo.png" alt="" />
            <div><strong>Hill Springs</strong><span>Administration</span></div>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar large">{(adminInfo?.name || adminInfo?.email || "A").slice(0, 1).toUpperCase()}</div>
            <div><strong>{adminInfo?.name || "Administrator"}</strong><span>{adminInfo?.role === "owner" ? "Owner" : adminInfo?.role === "editor" ? "Editor" : "Admin"}</span></div>
          </div>

          <nav className="admin-nav" aria-label="Administration">
            {NAV.map(([id, label, icon]) => (
              <button key={id} className={tab === id ? "active" : ""} onClick={() => go(id)}>
                <span>{icon}</span>{label}
                {id === "applications" && pendingCount > 0 && <b>{pendingCount}</b>}
                {id === "messages" && openEnquiries > 0 && <b>{openEnquiries}</b>}
              </button>
            ))}
          </nav>

          <div className="admin-sidebar-bottom">
            <a href="/" className="admin-nav-link">↗ View website</a>
            <button className="admin-nav-link" onClick={logout}>↪ Sign out</button>
          </div>
        </aside>

        <main className="admin-main">
          <header className="admin-topbar">
            <div><span className="admin-mobile-title">Hill Springs Academy</span><h1>{NAV.find((n) => n[0] === tab)?.[1] || "Overview"}</h1></div>
            <div className="admin-top-actions"><span className="portal-status"><i />Portal online</span><span className="admin-email">{adminInfo?.email}</span></div>
          </header>

          <div className="admin-content">
            {tab === "overview" && (
              <div className="admin-section">
                <div className="admin-page-heading">
                  <div><span className="eyebrow">Administration dashboard</span><h2>Good to see you, {adminInfo?.name || "Administrator"}.</h2><p>Here is the current activity across Hill Springs Academy.</p></div>
                  <button className="btn small ghost dark" onClick={() => loadPortal(token)}>Refresh dashboard</button>
                </div>

                <div className="admin-metric-grid">
                  <button className="admin-metric-card" onClick={() => go("applications")}><span>Pending admissions</span><strong>{pendingCount}</strong><small>Applications awaiting a decision →</small></button>
                  <button className="admin-metric-card" onClick={() => go("messages")}><span>Open enquiries</span><strong>{openEnquiries}</strong><small>Parent and student conversations →</small></button>
                  <button className="admin-metric-card" onClick={() => go("subscribers")}><span>Subscribers</span><strong>{subscribers.length}</strong><small>School communication audience →</small></button>
                  <button className="admin-metric-card" onClick={() => go("admins")}><span>Administrators</span><strong>{admins.length}</strong><small>Manage staff access →</small></button>
                </div>

                <div className="admin-dashboard-grid">
                  <div className="admin-panel-card">
                    <div className="admin-card-heading"><div className="admin-icon">✓</div><div><h3>Quick actions</h3><p>Common tasks from one place.</p></div></div>
                    <div className="quick-actions">
                      <button onClick={() => go("applications")}>Review admissions <span>→</span></button>
                      <button onClick={() => go("messages")}>Open enquiries <span>→</span></button>
                      <button onClick={() => go("compose")}>Send communication <span>→</span></button>
                      {adminInfo?.role === "owner" && <button onClick={() => go("admins")}>Manage administrators <span>→</span></button>}
                    </div>
                  </div>
                  <div className="admin-panel-card">
                    <div className="admin-card-heading"><div className="admin-icon">i</div><div><h3>Portal security</h3><p>Access and account protection.</p></div></div>
                    <ul className="admin-check-list">
                      <li><span>✓</span>Authenticated administrator session</li>
                      <li><span>✓</span>Owner-protected staff management</li>
                      <li><span>✓</span>Resend-powered school communication</li>
                      <li><span>✓</span>Audit logging for administrator changes</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {tab === "applications" && (
              <div className="admin-section">
                <div className="admin-page-heading"><div><span className="eyebrow">Admissions</span><h2>Application management</h2><p>Review applications and send admission decisions to parents.</p></div></div>
                <div className="chips">{["pending", "accepted", "rejected", "all"].map((x) => <button key={x} className={appFilter === x ? "on" : ""} onClick={() => { setAppFilter(x); loadApps(x); }}>{x}</button>)}</div>
                {appStatus && <div className="admin-alert success">{appStatus}</div>}
                <div className="admin-card-grid">
                  {apps.map((a) => (
                    <article className="admin-panel-card" key={a.id}>
                      <div className="admin-card-topline"><span className={"status-badge " + a.status}>{a.status}</span><small>{a.created_at ? new Date(a.created_at).toLocaleDateString() : ""}</small></div>
                      <h3>{a.learner_name}</h3><p className="muted">{a.requested_level} · {a.parent_name}</p><p>{a.parent_email}</p>
                      {a.status === "pending" && <><label>Decision note<textarea value={notes[a.id] || ""} onChange={(e) => setNotes({ ...notes, [a.id]: e.target.value })} /></label><div className="btns"><button className="btn small" disabled={!!deciding || !!deletingApp} onClick={() => decide(a.id, "accepted")}>Accept</button><button className="btn small ghost dark" disabled={!!deciding || !!deletingApp} onClick={() => decide(a.id, "rejected")}>Reject</button></div></>}
                      <div className="admin-record-actions"><span>{a.status === "pending" ? "Pending decision" : "Decision recorded"}</span><button type="button" className="btn small danger-btn" disabled={deletingApp === a.id} onClick={() => deleteApplication(a)}>{deletingApp === a.id ? "Deleting…" : "Delete permanently"}</button></div>
                    </article>
                  ))}
                  {!apps.length && <div className="admin-empty">No applications in this filter.</div>}
                </div>
              </div>
            )}

            {tab === "messages" && (
              <div className="admin-section">
                <div className="admin-page-heading"><div><span className="eyebrow">Parent communication</span><h2>Enquiries</h2><p>Read, reply to and close parent or student enquiries.</p></div></div>
                <div className="admin-message-layout">
                  <div className="admin-panel-card enquiry-list">
                    <input placeholder="Search enquiries…" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <div className="chips">{["all", "new", "open", "closed"].map((x) => <button key={x} className={filter === x ? "on" : ""} onClick={() => setFilter(x)}>{x}</button>)}</div>
                    {filtered.map((c) => <button key={c.id} className={"enquiry-item " + (selected?.id === c.id ? "selected" : "")} onClick={() => openConversation(c.id)}><strong>{c.requester_name || c.name || "Enquiry"}</strong><span>{c.subject || "No subject"}</span><small>{c.status}</small></button>)}
                    {!filtered.length && <div className="admin-empty">No enquiries found.</div>}
                  </div>
                  <div className="admin-panel-card enquiry-detail">
                    {!selected ? <div className="admin-empty">Select an enquiry to view the conversation.</div> : <>
                      <div className="admin-card-topline"><span className="status-badge">{selected.status}</span><span>{selected.requester_email || selected.email}</span></div>
                      <h3>{selected.subject}</h3>
                      <div className="message-thread">{messages.map((m, i) => <div className={"message-bubble " + (m.sender_type === "admin" ? "outgoing" : "incoming")} key={i}><small>{m.sender_type}</small><p>{m.body}</p></div>)}</div>
                      <label>Reply<textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write your reply…" /></label>
                      <div className="btns"><button className="btn small" onClick={sendReply}>Send through Resend</button><button className="btn small ghost dark" onClick={closeConversation} disabled={!!deletingEnquiry}>Close enquiry</button><button className="btn small danger-btn" onClick={deleteEnquiry} disabled={deletingEnquiry === selected.id}>{deletingEnquiry === selected.id ? "Deleting…" : "Delete permanently"}</button></div>
                      {status && <p className="form-success">{status}</p>}
                    </>}
                  </div>
                </div>
              </div>
            )}

            {tab === "subscribers" && <div className="admin-section"><div className="admin-page-heading"><div><span className="eyebrow">Communications</span><h2>Newsletter subscribers</h2><p>People who have subscribed to school updates.</p></div><span className="admin-count-large">{subscribers.length}</span></div><div className="admin-panel-card"><div className="subscriber-grid">{subscribers.map((s) => <div className="subscriber-item" key={s.email || s.id}><span>✉</span><strong>{s.email}</strong></div>)}</div>{!subscribers.length && <div className="admin-empty">No subscribers loaded.</div>}</div></div>}

            {tab === "compose" && <div className="admin-section"><div className="admin-page-heading"><div><span className="eyebrow">Communications</span><h2>Email centre</h2><p>Send newsletters and announcements through Resend.</p></div></div><form className="admin-panel-card compose-card" onSubmit={sendCompose}><div className="compose-grid"><label>Message type<select value={compose.kind} onChange={(e) => setCompose({ ...compose, kind: e.target.value })}><option value="newsletter">Newsletter</option><option value="announcement">Announcement</option></select></label><label>Audience<select value={compose.audience} onChange={(e) => setCompose({ ...compose, audience: e.target.value })}><option value="subscribers">Subscribers</option><option value="parents">Parents</option><option value="users">Users</option></select></label></div><label>Subject<input value={compose.subject} onChange={(e) => setCompose({ ...compose, subject: e.target.value })} required placeholder="Email subject" /></label><label>Content<textarea className="compose-body" value={compose.content} onChange={(e) => setCompose({ ...compose, content: e.target.value })} required placeholder="Write your message…" /></label><button className="btn" type="submit">Send message</button>{status && <p className="form-success">{status}</p>}</form></div>}

            {tab === "admins" && adminInfo?.role === "owner" && <AdminAdminsTab token={token} />}
            {tab === "admins" && adminInfo?.role !== "owner" && <div className="admin-section"><div className="admin-empty">Administrator management is available only to owner administrators.</div></div>}
          </div>
        </main>
      </div>
    </>
  );
}
