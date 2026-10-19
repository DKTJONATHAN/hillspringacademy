# Third-party services and frontend security audit

**Repository:** `DKTJONATHAN/hillspringacademy`  
**Website:** https://hillspringsacademy.sc.ke  
**Audit date:** 19 October 2026  
**Scope:** Current source files and configuration inspected in the repository. This is not a live vendor-dashboard audit, a scan of Git history, or a legal compliance certification.

## Third-party services identified in source

| Service | Observed use | Data that may be processed |
|---|---|---|
| Supabase Auth, database and Edge Functions | Parent registration/sign-in, password reset, profile storage, admissions, enquiries, admin tools and backend operations | Name, email, phone, password credentials (handled by Auth), account/session identifiers, learner name/date of birth/gender/grade/previous school/term/notes, enquiries/messages, IP/security request information, verification-code metadata |
| Resend | Backend email delivery for verification and reset codes, welcome messages, applications/decisions, enquiries and newsletters | Recipient/sender email addresses, message subject/body, delivery identifiers and provider logs |
| Cloudflare Pages | Static website hosting and delivery | Standard request metadata such as IP address, user agent, requested URLs, timestamps and security/operational logs according to hosting configuration |
| Cloudflare Turnstile | Backend verification code calls Cloudflare's siteverify endpoint when `TURNSTILE_SECRET` is configured | CAPTCHA response token and request IP supplied for verification |
| Google Fonts | `fonts.googleapis.com` stylesheet and `fonts.gstatic.com` font resources in `index.html` | Browser request metadata and font resource requests |
| Google Maps | External maps link and embedded map in page components | Request metadata when the map is loaded or opened; Google may receive the user's IP and browser information |
| YouTube | Educational video content embedded/linked from the site | Request metadata and video interactions when content is loaded; YouTube may use cookies or similar technologies depending on embed settings and user state |
| GitHub | Source-code repository and deployment source | Repository code, commit/author metadata and deployment-related activity; no evidence in the reviewed frontend that parent application form submissions are sent to GitHub |

### Browser storage observed

- `localStorage` stores the parent session (access/refresh tokens and email), theme preference and privacy choice.
- `sessionStorage` stores the admin access token for the current tab.
- These are browser storage mechanisms, not third-party vendors. Access tokens in browser storage are exposed to scripts running in the same origin, so XSS prevention remains important.

## Data categories collected by the app

1. **Account:** parent/guardian name, email, phone, password authentication data, session tokens and verification/reset metadata.
2. **Admissions:** parent name/email/phone and learner name, date of birth, gender, current/requested level, previous school, entry term and notes.
3. **Enquiries:** subject, message, contact details and optional learner-related information.
4. **Newsletter:** name, email, active/unsubscribe status and delivery metadata.
5. **Security:** request IP, rate-limit keys/counters, verification codes stored as hashes, and admin audit metadata.
6. **Public website interaction:** requested pages/assets and third-party resource requests. No Google Analytics or ad-tag installation was identified in the inspected source.

## API key / secret review

- `src/supabase.js` contains a Supabase URL and an `sb_publishable_...` key. A Supabase publishable key is designed to be shipped to the browser; its presence is not by itself a secret leak. Security depends on server-side authorization and database policies/RLS.
- The frontend file inspected does **not** contain a Supabase service-role/secret key or a Resend API key.
- Backend code reads privileged credentials from Supabase Edge Function environment secrets (`SUPABASE_SECRET_KEYS` / `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY`). These must remain server-side and must never be copied into `src/`, `index.html`, built assets, or public documentation.
- This review does not prove that no secret was ever committed in an older Git commit, deployment log, build artifact or an uninspected file. If a real secret is found in Git history, revoke/rotate it immediately; deleting the current file alone is insufficient.

## Important configuration findings

1. Backend code supports Turnstile verification only when `TURNSTILE_SECRET` is configured. The inspected account UI did not show a corresponding Turnstile widget/token being passed with registration/reset requests. Verify the live secret configuration and UI together: if the secret is enabled but no token is sent, protected actions may fail; if it is absent, the backend currently logs a warning and allows the request without CAPTCHA.
2. The current frontend stores parent refresh/access tokens in localStorage. This is a common implementation choice but increases the impact of a cross-site scripting (XSS) bug. Keep dependencies patched, avoid unsafe HTML injection, and consider a server-managed HttpOnly-cookie session if the architecture is later changed.
3. The website embeds Google Maps and educational videos, and loads Google Fonts from Google servers. These external requests can happen when a page is loaded, so the privacy notice should identify them accurately and the school should review whether consent or click-to-load controls are required for its actual audience and configuration.
4. The site currently publishes fee schedules but no online payment gateway was identified. The refund policy therefore describes school-handled payments and must be approved against the school's real written fee rules before being treated as final.

## Suggested next steps

- Keep the Supabase publishable key public, but verify RLS and server-side admin checks; never expose service-role/secret keys.
- Review Git history and Cloudflare build artifacts for accidentally committed secrets. Rotate any confirmed secret leak.
- Confirm Supabase, Resend, Cloudflare and any embedded Google/YouTube services' retention, processing regions and contractual safeguards.
- Decide whether Turnstile should be active, then wire its public site key/widget to the forms and keep the secret only in Supabase Edge Function secrets.
- Approve a specific school refund schedule before publishing the refund policy as final.
- Review retention periods for learner and admissions records and document the school's lawful basis and parental/guardian authorisation process.
