import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { EnquiryForm } from "./EnquiryForm.jsx";
import { PageHead } from "./components.jsx";
import { SCHOOL } from "./data.js";
import { accountApi, appsApi, passwordSignIn, subscribeToSchoolUpdates } from "./supabase.js";
import { getToken, useParentSession } from "./session.js";

const COPY = {
  admissions: {
    title: "Apply to Hill Springs Academy",
    text: "Create a parent account, then complete the online admission form. No emails back and forth.",
    eyebrow: "Admissions",
  },
  enquiry: {
    title: "Make an enquiry",
    text: "Create a parent account so we can reply to you and keep your conversation in one place.",
    eyebrow: "Enquiries",
  },
  signup: {
    title: "Join Hill Springs Academy",
    text: "Create your free parent member account to apply online, track applications, and receive school updates.",
    eyebrow: "Membership",
  },
};

const PW_HINT = "At least 8 characters. Choose any password you prefer.";

function PasswordInput({ value, onChange, label = "Password", autoComplete = "current-password", minLength }) {
  const [show, setShow] = useState(false);
  return (
    <label>{label}
      <span className="pw-wrap">
        <input type={show ? "text" : "password"} value={value} onChange={onChange} required autoComplete={autoComplete} minLength={minLength} />
        <button type="button" className="pw-toggle" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? "Hide" : "Show"}</button>
      </span>
    </label>
  );
}

function CodeInput({ value, onChange }) {
  return (
    <label>6-digit code
      <input className="code-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))} required placeholder="000000" />
    </label>
  );
}

function AuthCard({ kind, onSignedIn }) {
  const startView = kind === "signup" ? "register" : "login";
  const [view, setView] = useState(startView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const go = (v, m = { type: "", text: "" }) => { setView(v); setMsg(m); setCode(""); };
  const err = (text) => setMsg({ type: "error", text });
  const ok = (text) => setMsg({ type: "success", text });
  const run = (fn) => async (e) => { e.preventDefault(); setBusy(true); setMsg({ type: "", text: "" }); try { await fn(); } finally { setBusy(false); } };

  const sendWelcome = async (name) => {
    try {
      await subscribeToSchoolUpdates({ email: email.trim(), name: name || fullName || email.split("@")[0] });
    } catch {
      // Welcome email is best-effort
    }
  };

  const login = run(async () => {
    try {
      onSignedIn(await passwordSignIn(email.trim(), password));
    } catch (e1) {
      const text = e1.message || "Unable to sign in.";
      if (/not confirmed|email not confirmed/i.test(text)) {
        await accountApi({ action: "resend_signup", email }).catch(() => {});
        setCooldown(60);
        return go("verify", { type: "success", text: "Your email is not verified yet. We sent you a new 6-digit code." });
      }
      err("That email or password is not correct. If you are new, create an account. If you forgot your password, use “Forgot password”.");
    }
  });

  const register = run(async () => {
    try {
      await accountApi({ action: "register", email, fullName, phone });
      setCooldown(60);
      go("verify", { type: "success", text: `We sent a 6-digit code to ${email}. Enter it (and keep your password) to finish setup.` });
    } catch (e1) {
      if (e1.message.includes("already have an account")) go("login", { type: "error", text: e1.message });
      else err(e1.message);
    }
  });

  const verify = run(async () => {
    try {
      await accountApi({ action: "verify_signup", email, code, password });
      await sendWelcome(fullName);
      onSignedIn(await passwordSignIn(email.trim(), password));
    } catch (e1) {
      if (e1.message.includes("Invalid login") || e1.message.includes("invalid")) {
        await sendWelcome(fullName);
        go("login", { type: "success", text: "Email verified. A welcome email is on its way. Please sign in." });
      } else err(e1.message);
    }
  });

  const resend = async () => {
    try { await accountApi({ action: "resend_signup", email }); setCooldown(60); ok("A new code is on its way."); }
    catch (e1) { err(e1.message); }
  };

  const forgot = run(async () => {
    try {
      await accountApi({ action: "request_reset", email, portal: "parent" });
      setCooldown(60);
      go("reset", { type: "success", text: `If this email is registered, a 6-digit code has been sent to ${email}.` });
    } catch (e1) {
      if (e1.message.includes("do not have an account")) go("register", { type: "error", text: "You do not have an account yet. Please register." });
      else if (e1.message.includes("not been verified")) { await accountApi({ action: "resend_signup", email }).catch(() => {}); setCooldown(60); go("verify", { type: "error", text: e1.message + " We sent you a verification code." }); }
      else err(e1.message);
    }
  });

  const reset = run(async () => {
    try {
      await accountApi({ action: "verify_reset", email, code, newPassword, portal: "parent" });
      setPassword("");
      go("login", { type: "success", text: "Password updated. Please sign in with your new password." });
    } catch (e1) { err(e1.message); }
  });

  const titles = { login: "Sign in", register: "Create your account", verify: "Verify your email", forgot: "Reset your password", reset: "Choose a new password" };
  const onSubmit = { login, register, verify, forgot, reset }[view];

  return (
    <form className="card enquiry-form auth-card" onSubmit={onSubmit} noValidate={false}>
      <span className="eyebrow">{COPY[kind]?.eyebrow || "Account"}</span>
      <h2>{titles[view]}</h2>
      {view === "login" && <p>Sign in to continue. New here? <button type="button" className="linklike" onClick={() => go("register")}>Create an account</button></p>}
      {view === "register" && <p>Already registered? <button type="button" className="linklike" onClick={() => go("login")}>Sign in</button></p>}
      {view === "forgot" && <p>Enter the email you registered with and we will send you a 6-digit code.</p>}
      {view === "verify" && <p>Enter the code from your email. Use the same password you chose when registering.</p>}
      {["login", "register", "forgot", "verify", "reset"].includes(view) && (
        <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" readOnly={view === "verify" || view === "reset"} /></label>
      )}
      {view === "register" && <>
        <label>Full name<input value={fullName} onChange={e => setFullName(e.target.value)} required autoComplete="name" /></label>
        <label>Phone<input value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" /></label>
      </>}
      {(view === "login" || view === "register" || view === "verify") && (
        <PasswordInput value={password} onChange={e => setPassword(e.target.value)} autoComplete={view === "login" ? "current-password" : "new-password"} minLength={view === "login" ? undefined : 8} />
      )}
      {(view === "register" || view === "verify") && <p className="field-hint">{PW_HINT}</p>}
      {(view === "verify" || view === "reset") && <CodeInput value={code} onChange={setCode} />}
      {view === "reset" && <><PasswordInput label="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} autoComplete="new-password" minLength={8} /><p className="field-hint">{PW_HINT}</p></>}
      {msg.text && <p className={msg.type === "error" ? "form-error" : "form-success"} role={msg.type === "error" ? "alert" : "status"}>{msg.text}</p>}
      <button className="btn" type="submit" disabled={busy}>
        {busy ? "Please wait…" : { login: "Sign in", register: "Create account", verify: "Verify email", forgot: "Send code", reset: "Update password" }[view]}
      </button>
      {view === "login" && <button type="button" className="btn small ghost dark" onClick={() => go("forgot")}>Forgot password?</button>}
      {(view === "verify" || view === "reset") && (
        <button type="button" className="btn small ghost dark" disabled={cooldown > 0} onClick={view === "verify" ? resend : forgot}>
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
      )}
      {(view === "forgot" || view === "reset" || view === "verify") && <button type="button" className="btn small ghost dark" onClick={() => go("login")}>Back to sign in</button>}
    </form>
  );
}

const STATUS_LABEL = { pending: "Under review", accepted: "Accepted", rejected: "Not successful", new: "Received", in_progress: "In progress", replied: "Replied", closed: "Closed" };

function SubmissionList({ items, title, titleOf }) {
  if (!items?.length) return null;
  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h3>{title}</h3>
      {items.map(i => (
        <div className="sub-row" key={i.id}>
          <div><strong>{titleOf(i)}</strong><small>{new Date(i.created_at).toLocaleDateString()}</small></div>
          <span className={"badge " + (i.status || "")}>{STATUS_LABEL[i.status] || i.status}</span>
        </div>
      ))}
    </div>
  );
}

function AdmissionForm({ profile, onDone }) {
  const [f, setF] = useState({ learnerName: "", learnerDob: "", gender: "", currentLevel: "", requestedLevel: "", previousSchool: "", entryTerm: "", notes: "", parentName: profile?.full_name || "", phone: profile?.phone || "" });
  const [state, setState] = useState({ busy: false, error: "", done: false });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setState({ busy: true, error: "", done: false });
    try {
      await appsApi({ action: "submit_application", ...f }, await getToken());
      setState({ busy: false, error: "", done: true }); onDone();
    } catch (err) { setState({ busy: false, error: err.message, done: false }); }
  };
  if (state.done) return (
    <div className="card portal-success-card"><span className="eyebrow">Application sent</span><h2>Thank you!</h2>
      <p>We have received your application and sent a confirmation to your email. The admissions team will review it and email you the decision. You can also follow the status below.</p>
      <button className="btn" onClick={() => setState({ busy: false, error: "", done: false })}>Apply for another learner</button></div>
  );
  return (
    <form className="card enquiry-form portal-form" onSubmit={submit}>
      <span className="eyebrow">Online admission form</span><h2>Learner application</h2>
      <div className="form-grid">
        <label>Parent/guardian name<input value={f.parentName} onChange={set("parentName")} required /></label>
        <label>Phone<input value={f.phone} onChange={set("phone")} autoComplete="tel" /></label>
        <label>Learner's full name<input value={f.learnerName} onChange={set("learnerName")} required /></label>
        <label>Date of birth<input type="date" value={f.learnerDob} onChange={set("learnerDob")} /></label>
        <label>Gender<select value={f.gender} onChange={set("gender")}><option value="">Select</option><option>Female</option><option>Male</option></select></label>
        <label>Level requested<select value={f.requestedLevel} onChange={set("requestedLevel")} required><option value="">Select level</option>{SCHOOL.applyLevels.map(l => <option key={l}>{l}</option>)}</select></label>
        <label>Current level<input value={f.currentLevel} onChange={set("currentLevel")} placeholder="e.g. PP2" /></label>
        <label>Previous school<input value={f.previousSchool} onChange={set("previousSchool")} /></label>
        <label>Preferred entry term<input value={f.entryTerm} onChange={set("entryTerm")} placeholder="e.g. Term 1, 2027" /></label>
      </div>
      <label>Anything we should know?<textarea value={f.notes} onChange={set("notes")} placeholder="Learning needs, transport, questions…" /></label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="btn" type="submit" disabled={state.busy}>{state.busy ? "Sending…" : "Submit application"}</button>
    </form>
  );
}

function PortalBrand({ kind }) {
  const c = COPY[kind] || COPY.signup;
  return (
    <div className="portal-brandbar">
      <div className="portal-brand-mark">
        <img src="/logo.png" alt="Hill Springs Academy" />
      </div>
      <div>
        <span className="portal-brand-kicker">Hill Springs Academy</span>
        <strong>{c.eyebrow}</strong>
        <p>{c.text}</p>
      </div>
    </div>
  );
}

function MemberWelcome({ profile }) {
  return (
    <div className="card">
      <span className="eyebrow">Welcome</span>
      <h2>You are a Hill Springs member{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</h2>
      <p>Your parent account is ready. A welcome email has been sent to your inbox. You can now apply online, make an enquiry, or return any time to track your submissions.</p>
      <div className="btns" style={{ marginTop: 16 }}>
        <Link className="btn" to="/apply">Apply for a learner</Link>
        <Link className="btn ghost" to="/enquire">Make an enquiry</Link>
      </div>
    </div>
  );
}

export function AccountPortal({ kind }) {
  const { session, signedIn, signOut } = useParentSession();
  const [data, setData] = useState({ profile: null, applications: [], enquiries: [] });
  const load = async () => {
    try { setData(await appsApi({ action: "my_submissions" }, await getToken())); }
    catch (e) { if (e.message.includes("sign in")) signOut(); }
  };
  useEffect(() => { if (session) load(); }, [session?.email]);
  const c = COPY[kind] || COPY.signup;
  const [params] = useSearchParams();
  const subjectHint = kind === "enquiry" ? (params.get("subject") || "").trim() : "";
  const pageTitle = subjectHint ? `Enquire: ${subjectHint}` : c.title;
  const pageText = subjectHint
    ? `Send an enquiry about ${subjectHint}. Sign in so we can reply by email.`
    : c.text;

  return (
    <>
      <PageHead title={pageTitle} text={pageText} path={kind === "enquiry" ? "/enquire" : undefined} />
      <section className={"section portal-section portal-" + kind}><div className="wrap portal">
        <PortalBrand kind={kind} />
        {!session ? (
          <div className="portal-grid portal-entry-grid">
            <AuthCard kind={kind} onSignedIn={signedIn} />
            <div className="card portal-side portal-info-card">
              <h3>{kind === "signup" ? "Why join?" : "Why an account?"}</h3>
              <ul className="checks">
                <li>Your details are saved securely, so you never retype them.</li>
                <li>Track the status of your application or enquiry.</li>
                <li>Receive decisions, replies, and school updates by email.</li>
                <li>Reset your password any time with a 6-digit code.</li>
              </ul>
              {kind === "signup" ? (
                <p>Ready to enrol a learner? <Link className="textlink" to="/apply">Apply online</Link> after you create your account.</p>
              ) : (
                <p>{kind === "admissions" ? "Just want to ask a question first?" : "Ready to enrol a learner?"} <Link className="textlink" to={kind === "admissions" ? "/enquire" : "/apply"}>{kind === "admissions" ? "Make an enquiry" : "Apply online"}</Link></p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="portal-toolbar">
              <div><strong>Signed in as {session.email}</strong></div>
              <div>
                {kind !== "signup" && (
                  <>
                    <Link className="btn small ghost dark" to={kind === "admissions" ? "/enquire" : "/apply"}>{kind === "admissions" ? "Make an enquiry" : "Apply online"}</Link>{" "}
                  </>
                )}
                <button className="btn small ghost dark" onClick={signOut}>Sign out</button>
              </div>
            </div>
            {kind === "signup" && <MemberWelcome profile={data.profile} />}
            {kind === "admissions" && <AdmissionForm profile={data.profile} onDone={load} />}
            {kind === "enquiry" && <EnquiryForm profile={data.profile} onDone={load} />}
            {kind === "admissions" && <SubmissionList title="Your applications" items={data.applications} titleOf={a => `${a.learner_name} · ${a.requested_level}`} />}
            {kind === "enquiry" && <SubmissionList title="Your enquiries" items={data.enquiries} titleOf={q => q.subject} />}
            {kind === "signup" && (
              <>
                <SubmissionList title="Your applications" items={data.applications} titleOf={a => `${a.learner_name} · ${a.requested_level}`} />
                <SubmissionList title="Your enquiries" items={data.enquiries} titleOf={q => q.subject} />
              </>
            )}
          </>
        )}
      </div></section>
    </>
  );
}
