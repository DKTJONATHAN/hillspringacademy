import { useState } from "react";
import { accountApi, passwordSignIn } from "./supabase.js";

export function AccountDeletionPanel({ session, onDeleted }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (confirmation !== "DELETE") {
      setError("Type DELETE exactly to confirm.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      // Re-authentication creates a fresh token. The server independently checks
      // that its auth_time is recent before permitting deletion.
      const reauthenticated = await passwordSignIn(session.email, password);
      if (!reauthenticated?.access_token) throw new Error("Please sign in again and try once more.");
      await accountApi(
        { action: "delete_my_account", confirmText: "DELETE" },
        reauthenticated.access_token
      );
      window.alert("Your parent account and linked online submissions have been deleted.");
      onDeleted();
    } catch (err) {
      setError(err?.message || "We could not delete your account. Please try again or contact the school.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card account-delete-panel" aria-labelledby="delete-account-title">
      <span className="eyebrow">Account controls</span>
      <h2 id="delete-account-title">Delete my parent account</h2>
      <p>
        This permanently deletes your parent login, profile, linked online admission
        applications, linked enquiries and newsletter subscription. This action cannot
        be undone. The school may separately retain records where required by law.
      </p>
      <form className="account-delete-form" onSubmit={submit}>
        <label>
          Current password (required to confirm your identity)
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <label>
          Type DELETE to confirm
          <input
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            autoComplete="off"
            required
            aria-describedby="delete-account-warning"
          />
        </label>
        <p id="delete-account-warning">
          Do not continue if you need to keep your application or enquiry history.
        </p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn" type="submit" disabled={busy || !password || confirmation !== "DELETE"}>
          {busy ? "Deleting account…" : "Permanently delete my account"}
        </button>
      </form>
    </section>
  );
}
