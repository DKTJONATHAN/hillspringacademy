import { useEffect, useMemo, useState } from "react";
import { PageHead } from "./components.jsx";
import { adminCall, adminSignIn, accountApi, appsApi } from "./supabase.js";
import { AdminAdminsTab } from "./AdminAdminsTab.jsx";
import { getAdminToken, setAdminToken, clearAdminToken } from "./session.js";

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
  const [tab, setTab] = useState("applications");
  const [apps, setApps] = useState([]);
  const [appFilter, setAppFilter] = useState("pending");
  const [appStatus, setAppStatus] = useState("");
  const [notes, setNotes] = useState({});
  const [deciding, setDeciding] = useState("");
  const [resetCooldown, setResetCooldown] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [compose, setCompose] = useState({ kind: "newsletter", audience: "subscribers", subject: "", content: "", recipients: "" });

  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow";
    return () => {
      robots.content = "index, follow";
    };
  }, []);

  const loadConversations = async (t = token) => {
    const data = await adminCall(t, { action: "list_conversations" });
    setConversations(data.conversations || []);
  };
  const loadSubscribers = async () => {
    const data = await adminCall(token, { action: "subscribers" });
    setSubscribers(data.subscribers || []);
  };

  useEffect(() => {
    if (token) {
      loadApps();
      loadConversations().catch(() => {
        clearAdminToken();
        setToken("");
      });
    }
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
      return [c.requester_name, c.requester_email, c.subject, c.type].filter(Boolean).join(" ").toLowerCase().includes(q);
    });
  }, [conversations, filter, search]);

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
      try {
        await appsApi({ action: "whoami" }, data.access_token);
      } catch {
        throw new Error("This account is not an administrator. Parents can sign in on the Admissions page.");
      }
      setAdminToken(data.access_token);
      setToken(data.access_token);
      setPassword("");
      await loadConversations(data.access_token);
      loadApps();
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

  const loadApps = async (status = appFilter) => {
    setAppStatus("");
    try {
      const body = { action: "list_applications" };
      if (status && status !== "all") body.status = status;
      const data = await appsApi(body, token);
      setApps(data.applications || []);
    } catch (err) {
      setAppStatus(err.message || "Unable to load applications.");
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
      setStatus("Message sent.");
      setCompose({ kind: "newsletter", audience: "subscribers", subject: "", content: "", recipients: "" });
    } catch (err) {
      setStatus(err.message || "Send failed.");
    }
  };

  const logout = () => {
    clearAdminToken();
    setToken("");
    setSelected(null);
    setMessages([]);
    setConversations([]);
  };

  if (!token) {
    return (
      <>
        <PageHead title="Admin" text="School administration sign-in." />
        <section className="section">
          <div className="wrap" style={{ maxWidth: 420 }}>
            {!resetMode ? (
              <form className="card" onSubmit={login}>
                <h2>Admin sign in</h2>
                <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
                {loginError && <p className="form-error" role="alert">{loginError}</p>}
                <button className="btn" type="submit">Sign in</button>
                <button type="button" className="btn ghost dark" style={{ marginTop: 8 }} onClick={() => setResetMode(true)}>Forgot password</button>
              </form>
            ) : (
              <form className="card" onSubmit={resetStep === "request" ? requestReset : verifyReset}>
                <h2>Reset admin password</h2>
                {resetStep === "request" ? (
                  <>
                    <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                    <button className="btn" type="submit" disabled={resetCooldown > 0}>{resetCooldown > 0 ? `Wait ${resetCooldown}s` : "Send code"}</button>
                  </>
                ) : (
                  <>
                    <label>Code<input value={resetCode} onChange={(e) => setResetCode(e.target.value)} required /></label>
                    <label>New password<input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} /></label>
                    <button className="btn" type="submit">Update password</button>
                  </>
                )}
                {resetStatus && <p className="form-success" role="status">{resetStatus}</p>}
                <button type="button" className="btn ghost dark" style={{ marginTop: 8 }} onClick={() => setResetMode(false)}>Back to sign in</button>
              </form>
            )}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHead title="Admin Email Centre" text="Manage parent enquiries, admissions, subscribers and school email." />
      <section className="section">
        <div className="wrap">
          <div className="admin-toolbar">
            <div>
              {["applications", "messages", "subscribers", "compose", "admins"].map((x) => (
                <button
                  key={x}
                  className={tab === x ? "btn small" : "btn small ghost dark"}
                  onClick={() => {
                    setTab(x);
                    if (x === "subscribers") loadSubscribers().catch((err) => setStatus(err.message));
                    if (x === "applications") loadApps();
                  }}
                >
                  {x === "applications"
                    ? "Applications"
                    : x === "messages"
                      ? "Enquiries"
                      : x === "subscribers"
                        ? "Subscribers"
                        : x === "compose"
                          ? "Compose email"
                          : "Admins"}
                </button>
              ))}
            </div>
            <button className="btn small ghost dark" onClick={logout}>
              Sign out
            </button>
          </div>

          {tab === "applications" && (
            <div>
              <div className="chips">
                {["pending", "accepted", "rejected", "all"].map((x) => (
                  <button
                    key={x}
                    className={appFilter === x ? "on" : ""}
                    onClick={() => {
                      setAppFilter(x);
                      loadApps(x);
                    }}
                  >
                    {x}
                  </button>
                ))}
              </div>
              {appStatus && <p className="form-success" role="status">{appStatus}</p>}
              <div className="cols" style={{ marginTop: 16 }}>
                {apps.map((a) => (
                  <article className="card" key={a.id}>
                    <h3>{a.learner_name}</h3>
                    <p>{a.requested_level} · {a.status}</p>
                    <p>{a.parent_name} · {a.parent_email}</p>
                    {a.status === "pending" && (
                      <>
                        <label>Note<textarea value={notes[a.id] || ""} onChange={(e) => setNotes({ ...notes, [a.id]: e.target.value })} /></label>
                        <div className="btns">
                          <button className="btn small" disabled={!!deciding} onClick={() => decide(a.id, "accepted")}>Accept</button>
                          <button className="btn small ghost dark" disabled={!!deciding} onClick={() => decide(a.id, "rejected")}>Reject</button>
                        </div>
                      </>
                    )}
                  </article>
                ))}
                {!apps.length && <p>No applications in this filter.</p>}
              </div>
            </div>
          )}

          {tab === "messages" && (
            <div className="split">
              <div>
                <input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                <div className="chips" style={{ marginTop: 8 }}>
                  {["all", "new", "open", "closed"].map((x) => (
                    <button key={x} className={filter === x ? "on" : ""} onClick={() => setFilter(x)}>{x}</button>
                  ))}
                </div>
                <ul className="checks" style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
                  {filtered.map((c) => (
                    <li key={c.id}>
                      <button type="button" className="btn small ghost dark" onClick={() => openConversation(c.id)}>
                        {(c.requester_name || c.name || "Enquiry") + " — " + (c.subject || "")}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card">
                {!selected && <p>Select an enquiry.</p>}
                {selected && (
                  <>
                    <h3>{selected.subject}</h3>
                    <p>{selected.requester_name || selected.name} · {selected.requester_email || selected.email}</p>
                    <div style={{ maxHeight: 240, overflow: "auto", marginBottom: 12 }}>
                      {messages.map((m, i) => (
                        <p key={i}><strong>{m.sender_type}:</strong> {m.body}</p>
                      ))}
                    </div>
                    <label>Reply<textarea value={reply} onChange={(e) => setReply(e.target.value)} /></label>
                    <div className="btns">
                      <button className="btn small" type="button" onClick={sendReply}>Send reply</button>
                      <button className="btn small ghost dark" type="button" onClick={closeConversation}>Close</button>
                    </div>
                    {status && <p role="status">{status}</p>}
                  </>
                )}
              </div>
            </div>
          )}

          {tab === "subscribers" && (
            <div className="card">
              <h3>Newsletter subscribers</h3>
              <ul className="checks">
                {subscribers.map((s) => (
                  <li key={s.email || s.id}>{s.email}</li>
                ))}
              </ul>
              {!subscribers.length && <p>No subscribers loaded.</p>}
            </div>
          )}

          {tab === "compose" && (
            <form className="card" onSubmit={sendCompose}>
              <h3>Compose email</h3>
              <label>
                Type
                <select value={compose.kind} onChange={(e) => setCompose({ ...compose, kind: e.target.value })}>
                  <option value="newsletter">Newsletter</option>
                  <option value="announcement">Announcement</option>
                </select>
              </label>
              <label>Subject<input value={compose.subject} onChange={(e) => setCompose({ ...compose, subject: e.target.value })} required /></label>
              <label>Content<textarea value={compose.content} onChange={(e) => setCompose({ ...compose, content: e.target.value })} required /></label>
              <button className="btn" type="submit">Send</button>
              {status && <p role="status">{status}</p>}
            </form>
          )}

          {tab === "admins" && <AdminAdminsTab token={token} />}
        </div>
      </section>
    </>
  );
}
