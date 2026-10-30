import { useEffect, useRef } from "react";

const SITE_KEY = "0x4AAAAAAFtIBQZiyrjMlnId";
const SCRIPT_ID = "cloudflare-turnstile-api";

export function TurnstileWidget({ action, onToken, resetKey = 0 }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const callbackRef = useRef(onToken);
  callbackRef.current = onToken;

  useEffect(() => {
    let cancelled = false;
    let timer = null;
    let attempts = 0;
    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        action,
        theme: "light",
        callback: (token) => callbackRef.current(token),
        "expired-callback": () => callbackRef.current(""),
        "error-callback": () => callbackRef.current(""),
      });
    };

    const existing = document.getElementById(SCRIPT_ID);
    if (window.turnstile) {
      renderWidget();
    } else if (existing) {
      timer = window.setInterval(() => {
        attempts += 1;
        if (window.turnstile) {
          window.clearInterval(timer);
          renderWidget();
        } else if (attempts > 100) {
          window.clearInterval(timer);
          callbackRef.current("");
        }
      }, 100);
    } else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      script.onerror = () => callbackRef.current("");
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [action, resetKey]);

  return <div ref={containerRef} className="turnstile-wrap" aria-label="Security verification" />;
}
