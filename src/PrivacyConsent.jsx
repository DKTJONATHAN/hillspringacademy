import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CONSENT_KEY = "hsa_privacy_consent_v1";

function readConsent() {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function getPrivacyConsent() {
  return readConsent();
}

export function clearPrivacyConsent() {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {}
}

export function PrivacyConsent() {
  const [choice, setChoice] = useState(() => readConsent());

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("hsa-consent-ready", { detail: choice }));
  }, [choice]);

  if (choice) return null;

  const save = (optional) => {
    const value = {
      necessary: true,
      optional,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
    } catch {}
    setChoice(value);
    window.dispatchEvent(new CustomEvent("hsa-consent-change", { detail: value }));
  };

  return (
    <aside className="privacy-consent" aria-label="Privacy choices">
      <div className="privacy-consent-inner">
        <div>
          <strong>Your privacy matters</strong>
          <p>
            Hill Springs Academy uses essential browser storage for functions such as
            sign-in sessions and your theme preference. Optional analytics or advertising
            storage is currently off.
          </p>
          <Link to="/privacy" className="privacy-consent-link">Read our Privacy & Data Protection Notice</Link>
        </div>
        <div className="privacy-consent-actions">
          <button type="button" className="btn small ghost dark" onClick={() => save(false)}>
            Necessary only
          </button>
          <button type="button" className="btn small" onClick={() => save(true)}>
            Allow optional
          </button>
        </div>
      </div>
    </aside>
  );
}
