import { useEffect, useMemo, useState } from "react";
import { PageHead } from "./components.jsx";
import { adminCall, adminSignIn, requestAdminPasswordReset, verifyAdminPasswordReset } from "./supabase.js";

export function AdminEmailCentre() {
  const [token, setToken] = useState(() => localStorage.getItem("hsa_admin_token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetStep, setResetStep] = useState("request");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [tab, setTab] = useState("messages");
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [compose, setCompose] = useState({ kind: "newsletter", audience: "subscribers", subject: "", content: "", recipients: "" });

  const loadConversations = async (t = token) => {
    const data = await adminCall(t, { action: "list_conversations" });
    setConversations(data.conversations || []);
  };
  const loadSubscribers = async () => {
    const data = await adminCall(token, { action: "subscribers" });
    setSubscribers(data.subscribers || []);
  };

  useEffect(() => {
    if (token) loadConversations().catch(() => { localStorage.removeItem("hsa_admin_token"); setToken(""); });
  }, []);

  const requestReset = async (e) => {
    e.preventDefault(); setResetStatus("");
    try { await requestAdminPasswordReset(email); setResetStep("verify"); setResetStatus("If that email belongs to an administrator, a 6-digit verification code has been sent."); }
    catch (err) { setResetStatus(err.message || "Unable to request a password reset."); }
  };

  const verifyReset = async (e) => {
    e.preventDefault(); setResetStatus("");
    try { await verifyAdminPasswordReset(email, resetCode, newPassword); setResetStatus("Password updated successfully. You can now sign in."); setResetMode(false); setResetStep("request"); setResetCode(""); setNewPassword(""); }
    catch (err) { setResetStatus(err.message || "Unable to reset password."); }
  };

  const login = async (e) => {
    e.preventDefault(); setLoginError("");
    try {
      const data = await adminSignIn(email, password);
      localStorage.setItem("hsa_admin_token", data.access_token);
      setToken(data.access_token);
      setPassword("");
      await loadConversations(data.access_token);
    } catch (err) { setLoginError(err.message || "Unable to sign in."); }
  };

  const openConversation = async (id) => {
    const data = await adminCall(token, { action: "get_conversation", id });
    setSelected(data.conversation); setMessages(data.messages || []); setReply(""); setStatus("");
  };

  const sendReply = async () => {
    if (!selected || reply.trim().length < 2) return;
    setStatus("Sending through Resend…");
    try {
      await adminCall(token, { action: "reply", id: selected.id, reply });
      setReply(""); setStatus("Reply sent successfully.");
      await openConversation(selected.id); await loadConversations();
    } catch (err) { setStatus(err.message || "Reply failed."); }
  };

  const closeConversation = async () => {
    if (!selected) return;
    try {
      await adminCall(token, { action: "close", id: selected.id });
      await openConversation(selected.id); await loadConversations();
    } catch (err) { setStatus(err.message || "Unable to close enquiry."); }
  };

  const sendCampaign = async (e) => {
    e.preventDefault(); setStatus("");
    const recipients = compose.recipients.split(",").map(x => x.trim()).filter(Boolean);
    if (!compose.subject.trim() || !compose.content.trim()) { setStatus("Subject and message are required."); return; }
    if (compose.audience === "specific" && recipients.length === 0) { setStatus("Enter at least one recipient email."); return; }
    setStatus("Sending through Resend…");
    try {
      const action = compose.kind === "newsletter" ? "send_newsletter" : "send_announcement";
      const data = await adminCall(token, {
        action, audience: compose.audience, subject: compose.subject,
        htmlContent: compose.content.replace(/\n/g, "<br>"),
        recipients
      });
      setStatus(`Campaign sent. ${data.sent || 0} email(s) accepted by Resend.`);
      setCompose({ kind: "newsletter", audience: "subscribers", subject: "", content: "", recipients: "" });
    } catch (err) { setStatus(err.message || "Campaign failed."); }
  };

  const logout = () => { localStorage.removeItem("hsa_admin_token"); setToken(""); setSelected(null); };

  const filtered = useMemo(() => conversations.filter(c => {
    const matchesFilter = filter === "all" || c.status === filter;
    const q = search.trim().toLowerCase();
    return matchesFilter && (!q || [c.subject, c.requester_name, c.requester_email, c.type].some(v => String(v || "").toLowerCase().includes(q)));
  }), [conversations, filter, search]);

  if (!token) return (
    <>
      <PageHead title="Admin Email Centre" text="Secure Hill Springs Academy communications." />
      <section className="section"><div className="wrap admin-login">
        <form className="card enquiry-form" onSubmit={resetMode ? (resetStep === "request" ? requestReset : verifyReset) : login}>
          <span className="eyebrow">Staff only</span><h2>Sign in</h2>
          <p>{resetMode ? "Reset your Hill Springs Academy administrator password using a verification code sent by email." : "Use the Supabase administrator account created for Hill Springs Academy."}</p>
          <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="username" /></label>
          {!resetMode && <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" /></label>}
          {resetMode && resetStep === "verify" && <><label>Verification code<input inputMode="numeric" maxLength="6" value={resetCode} onChange={e => setResetCode(e.target.value.replace(/\D/g, "").slice(0,6))} required placeholder="6-digit code" /></label><label>New password<input type="password" minLength="8" value={newPassword} onChange={e => setNewPassword(e.target.value)} required autoComplete="new-password" /></label></>}
          {loginError && <p className="form-error" role="alert">{loginError}</p>}
          {resetStatus && <p className={resetStatus.includes("successfully") || resetStatus.includes("sent") ? "form-success" : "form-error"} role="status">{resetStatus}</p>}
          <button className="btn" type="submit">{resetMode ? (resetStep === "request" ? "Send verification code" : "Reset password") : "Sign in"}</button>
          <button type="button" className="btn small ghost dark" onClick={() => { setResetMode(!resetMode); setResetStep("request"); setResetStatus(""); setResetCode(""); setNewPassword(""); }}>{resetMode ? "Back to sign in" : "Forgot password?"}</button>
        </form>
      </div></section>
    </>
  );

  return (
    <>
      <PageHead title="Admin Email Centre" text="Manage parent enquiries, admissions, subscribers and school email." />
      <section className="section"><div className="wrap">
        <div className="admin-toolbar">
          <div>
            {["messages","subscribers","compose"].map(x => <button key={x} className={tab===x?"btn small":"btn small ghost dark"} onClick={() => { setTab(x); if (x==="subscribers") loadSubscribers().catch(err=>setStatus(err.message)); }}>
              {x==="messages"?"Messages":x==="subscribers"?"Subscribers":"Compose email"}
            </button>)}
          </div>
          <button className="btn small ghost dark" onClick={logout}>Sign out</button>
        </div>

        {tab==="messages" && <div className="admin-grid">
          <div className="card admin-list">
            <div className="chips">
              {["all","new","in_progress","replied","closed"].map(x => <button key={x} className={filter===x?"on":""} onClick={()=>setFilter(x)}>{x.replace("_"," ")}</button>)}
            </div>
            <label>Search<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name, email or subject" /></label>
            <h3 style={{marginTop:"18px"}}>Enquiries ({filtered.length})</h3>
            {filtered.length===0 && <p>No enquiries match the current filter.</p>}
            {filtered.map(c => <button key={c.id} className={"admin-item"+(selected?.id===c.id?" selected":"")} onClick={()=>openConversation(c.id)}>
              <strong>{c.subject}</strong><span>{c.requester_name} · {c.status}</span><small>{new Date(c.last_message_at).toLocaleString()}</small>
            </button>)}
          </div>
          <div className="card admin-thread">
            {!selected ? <div><h3>Select an enquiry</h3><p>Choose a parent or admissions enquiry to view the full conversation.</p></div> : <>
              <div className="thread-head"><div><span className="eyebrow">{selected.type}</span><h3>{selected.subject}</h3><p>{selected.requester_name} · {selected.requester_email}{selected.requester_phone ? ` · ${selected.requester_phone}` : ""}</p>
              {selected.student_name && <p><strong>Learner:</strong> {selected.student_name}{selected.requested_level ? ` · Requested: ${selected.requested_level}` : ""}</p>}</div>
              {selected.status!=="closed" && <button className="btn small ghost dark" onClick={closeConversation}>Close</button>}</div>
              <div className="thread">{messages.map(m => <div className={"thread-message "+m.sender_type} key={m.id}><small>{m.sender_type==="visitor"?"Parent / visitor":"Hill Springs Academy"} · {new Date(m.created_at).toLocaleString()}</small><p>{m.body_text}</p>{m.delivery_status && <span>{m.delivery_status}</span>}</div>)}</div>
              {selected.status!=="closed" && <div className="reply-box"><textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Write your reply to the parent or student…" /><button className="btn" onClick={sendReply}>Send reply by email</button></div>}
              {status && <p className="form-success" role="status">{status}</p>}
            </>}
          </div>
        </div>}

        {tab==="subscribers" && <div className="card">
          <div className="admin-toolbar"><div><h3>Newsletter subscribers</h3><p>{subscribers.length} subscriber(s) loaded.</p></div><button className="btn small" onClick={()=>loadSubscribers().catch(err=>setStatus(err.message))}>Refresh</button></div>
          <div className="subscriber-list">{subscribers.map(s=><div className="subscriber-row" key={s.id}><strong>{s.name || "No name"}</strong><span>{s.email}</span><small>{s.active?"Active":"Unsubscribed"}</small></div>)}</div>
        </div>}

        {tab==="compose" && <form className="card enquiry-form" onSubmit={sendCampaign}>
          <span className="eyebrow">Communications</span><h2>Compose email</h2>
          <div className="form-grid">
            <label>Message type<select value={compose.kind} onChange={e=>setCompose({...compose,kind:e.target.value})}><option value="newsletter">Newsletter</option><option value="announcement">Parent announcement</option></select></label>
            <label>Audience<select value={compose.audience} onChange={e=>setCompose({...compose,audience:e.target.value})}><option value="subscribers">Active newsletter subscribers</option><option value="specific">Specific recipients</option></select></label>
          </div>
          {compose.audience==="specific" && <label>Recipient emails<input value={compose.recipients} onChange={e=>setCompose({...compose,recipients:e.target.value})} placeholder="parent@example.com, another@example.com" /></label>}
          <label>Subject<input value={compose.subject} onChange={e=>setCompose({...compose,subject:e.target.value})} required /></label>
          <label>Message<textarea value={compose.content} onChange={e=>setCompose({...compose,content:e.target.value})} required placeholder="Write your announcement or newsletter content here." /></label>
          <p className="coming">Emails are sent from the verified Hill Springs Academy domain through Resend.</p>
          {status && <p className={status.startsWith("Campaign sent")?"form-success":"form-error"} role="status">{status}</p>}
          <button className="btn" type="submit">Send email</button>
        </form>}
      </div></section>
    </>
  );
}