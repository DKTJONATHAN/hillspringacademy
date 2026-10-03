# Security hardening — operator checklist

Code changes for CORS, rate limits, Turnstile hooks, password length, admin session storage, headers, and SQL helpers are in the repo. Complete the items below in the dashboards.

## Phase 0 — Exam material (DONE in code)

- Teacher copies and answer keys are **not** linked in `src/data.js`.
- Those three PDFs are **not** present under `public/reading-material/` on the current tree.
- **You still must:**
  1. Make the GitHub repo **private** (Settings → General → Danger Zone) or recreate without git history of the old PDFs.
  2. Cloudflare → Caching → **Configuration** → **Purge Everything** after the next deploy.
  3. Tell school staff that Grade 7 answers were briefly public so they can decide on reissuing assessments.

## Phase 1 — Supabase Auth (dashboard)

- Auth → Providers: disable public signup; disable anonymous and unused providers.
- Min password length **12** + letters and digits.
- Attack Protection: enable **Cloudflare Turnstile**; set secret (same as `TURNSTILE_SECRET`).
- Rate limits: lowest practical for sign-in / refresh / email.
- URL config: Site URL `https://hillspringsacademy.sc.ke` only (+ preview host if needed).
- Sessions: JWT 3600s; refresh reuse detection on.
- MFA: enable TOTP.
- API: prefer Edge Functions only; tighten Exposed schemas / Data API if possible.
- Delete unused function `school-admin-auth` if still deployed.
- Owner account: 2FA on.

## Phase 2 — SQL

Run in SQL Editor:

`supabase/migrations/20261003_security_hardening.sql`

Then verify:

```sql
select tablename, rowsecurity from pg_tables where schemaname='public';
```

## Phase 3 — Edge Functions deploy

Redeploy at least:

- `school-account` (updated)
- shared `util.ts` (all functions that import it)

Set secrets (Dashboard → Edge Functions → Secrets):

- `TURNSTILE_SECRET`
- `CODE_HMAC_KEY` (long random string, separate from service role)
- Optional: `REQUIRE_ADMIN_MFA=true` after admin TOTP is enrolled

Export and commit live `school-email-center` if the dashboard has code the repo does not (repo file is empty).

## Phase 4 — Frontend (partial)

Done:

- Admin token → `sessionStorage` helpers in `session.js`
- Removed admin email localStorage hints API
- `/admin` noindex via `_headers`
- robots.txt no longer lists `/admin`

Still needed when Turnstile site key exists:

- Add Turnstile widget to register / login / reset / admin login
- Wire `turnstileToken` into `accountApi` bodies
- Admin TOTP enroll/challenge UI
- Update `AdminEmailCentre.jsx` to use `getAdminToken` / `setAdminToken` and password minLength 12

## Phase 5 — Cloudflare

- Proxy (orange cloud), Full (strict) SSL, Always HTTPS, TLS 1.2+
- HSTS 6 months, DNSSEC, CAA
- Bot Fight Mode + Managed WAF
- Rate limit `/admin*`
- Create Turnstile widget; site key → Pages env `VITE_TURNSTILE_SITE_KEY`; secret → Supabase
- Optional: Cloudflare Access on `/admin*`
- Purge cache after deploy

## Phase 6 — GitHub

- 2FA on account
- Branch protection on `main`
- Dependabot: `.github/dependabot.yml` added
- Secret scanning / CodeQL if plan allows

## Phase 8 — Quick verify

1. Teacher/answer PDF URLs → 404 + cache purged.
2. REST with publishable key cannot read application rows.
3. Direct `/auth/v1/signup` refused if public signup is off.
4. `school-account` without Turnstile fails after secret is set.
5. Register does not set a user-chosen password until verify.
6. Admin reset response identical for admin/non-admin emails.
7. Full parent + admin flows still work after deploy.
