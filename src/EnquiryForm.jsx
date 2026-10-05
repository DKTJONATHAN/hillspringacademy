import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { appsApi } from "./supabase.js";
import { getToken } from "./session.js";

function topicFromParams(subject, topicParam) {
  if (topicParam === "contact" || topicParam === "admissions") return topicParam;
  const s = (subject || "").toLowerCase();
  if (!s) return "admissions";
  if (
    s.includes("fee") ||
    s.includes("admission") ||
    s.includes("apply") ||
    s.includes("enrol") ||
    s.includes("enroll")
  ) {
    return "admissions";
  }
  return "contact";
}

/** Enquiry form; reads ?subject= and ?topic= from the URL. */
export function EnquiryForm({ profile, onDone }) {
  const [params] = useSearchParams();
  const subjectFromUrl = (params.get("subject") || "").trim().slice(0, 160);
  const topicFromUrl = topicFromParams(subjectFromUrl, params.get("topic"));
  const [f, setF] = useState({ subject: subjectFromUrl, topic: topicFromUrl, message: "" });
  const [state, setState] = useState({ busy: false, error: "", done: false });

  useEffect(() => {
    const subject = (params.get("subject") || "").trim().slice(0, 160);
    const topic = topicFromParams(subject, params.get("topic"));
    setF((prev) => ({ ...prev, subject, topic }));
  }, [params]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: "", done: false });
    try {
      await appsApi({ action: "submit_enquiry", ...f }, await getToken());
      setF({ subject: "", topic: "admissions", message: "" });
      setState({ busy: false, error: "", done: true });
      onDone();
    } catch (err) {
      setState({ busy: false, error: err.message, done: false });
    }
  };

  return (
    <form className="card enquiry-form" onSubmit={submit}>
      <span className="eyebrow">Send an enquiry</span>
      <h2>How can we help{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}?</h2>
      {subjectFromUrl && (
        <p className="lede" style={{ marginTop: 0 }}>
          You are enquiring about: <strong>{subjectFromUrl}</strong>
        </p>
      )}
      <div className="form-grid">
        <label>
          Topic
          <select value={f.topic} onChange={set("topic")}>
            <option value="admissions">Admissions</option>
            <option value="contact">General</option>
          </select>
        </label>
        <label>
          Subject
          <input
            value={f.subject}
            onChange={set("subject")}
            placeholder="What is this about?"
            required
          />
        </label>
      </div>
      <label>
        Message
        <textarea value={f.message} onChange={set("message")} required />
      </label>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      {state.done && (
        <p className="form-success" role="status">
          Thank you. We have your enquiry and will reply by email.
        </p>
      )}
      <button className="btn" type="submit" disabled={state.busy}>
        {state.busy ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
