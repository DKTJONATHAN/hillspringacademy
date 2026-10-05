# Hill Springs Academy: Supabase backend instructions

This document is for the AI/developer setting up the Supabase backend. The React front-end is finished and calls the functions below. **Do the steps in order.** Project URL and publishable key are already in `src/supabase.js`.

## 0. What the front-end expects

| Page | What it does |
|---|---|
| `/apply` | Parent registers (email code verification), signs in, resets password, fills the **admission form**, sees application status |
| `/enquire` | Same account system, but sends an **enquiry** instead |
| `/admin` | Admin signs in, sees **Applications** (Accept / Reject) and **Enquiries**, subscribers, newsletter |

Parents use normal **Supabase Auth** users (email + password). The 6-digit codes, "already registered" / "not registered" messages and admin checks are handled by Edge Functions, because Supabase's built-in reset sends links, not codes.

## 1. Run the SQL

Run `supabase/migrations/001_accounts_applications.sql` in the SQL editor. It creates:

- `school_admins(user_id, name, role, active)`: **who is an administrator** (the server's source of truth). Roles are `owner`, `admin`, or `editor`; only the active `owner` can add/deactivate/change administrators.
- `school_profiles(user_id, full_name, phone)`
- `school_codes`: hashed one-time 6-digit codes (`purpose` = `signup` | `reset`, 10-minute expiry, attempt counter)
- `school_applications`: status `pending | accepted | rejected`, decision note, who/when, email result
- `alter table school_conversations add column user_id` (links enquiries to the signed-in parent)

RLS is enabled with **no policies** on the new tables: the browser can read nothing directly; everything goes through Edge Functions using the secret key. Keep it that way.

The initial active administrator is promoted to the `owner` role by migration `002_admin_hierarchy_audit.sql`. After that, use the Admins tab in the admin panel to add administrators; do not manually insert email-only admin rows. New accounts are created as `admin` or `editor` and only the owner can manage them.

## 2. Auth settings

- Authentication > Sign In / Providers > Email: **turn OFF "Allow new users to sign up"**. Registration is done only by the `school-account` function (it uses the admin API). If public sign-up stays on, someone could bypass the code verification by calling Supabase's `/auth/v1/signup` directly.
- Keep "Confirm email" ON (harmless; the function creates users unconfirmed and confirms them after the code is entered).

## 3. Secrets

```
supabase secrets set RESEND_API_KEY=re_xxx
supabase secrets set SITE_URL=https://hillspringsacademy.sc.ke
```

`SUPABASE_URL` and the secret key are provided automatically. The Resend domain used for `FROM` (`hillspringacademy.sc.ke`) must be verified in Resend. Note the repo uses both spellings `hillspringacademy` (email domain) and `hillspringsacademy` (website). `SITE_URL` controls the logo/links inside emails: it must point to the live site that serves `/logo.png`.

## 4. Deploy the functions

The publishable key (`sb_publishable_...`) is not a JWT, so deploy with JWT verification **off**. Each function checks the user itself where needed.

```
supabase functions deploy school-account      --no-verify-jwt
supabase functions deploy school-applications --no-verify-jwt
supabase functions deploy school-submit       --no-verify-jwt
```

`supabase/functions/_shared/` (util.ts, email.ts) is imported by all of them.

### 4a. `school-account` (public, no login)
All requests: `POST { action, email, ... }`. Errors return `{ error, code }`.

| action | extra fields | behaviour |
|---|---|---|
| `check` | | `{exists, verified}` |
| `register` | fullName, phone, password | creates unconfirmed user + profile, emails 6-digit code. If already verified: 409 `ALREADY_REGISTERED` ("You already have an account... use Forgot password") |
| `verify_signup` | code | confirms email |
| `resend_signup` | | new code (60 s cooldown) |
| `request_reset` | `portal`: `parent` \| `admin` | **admin portal:** email must belong to an active `school_admins.user_id`; inactive admins cannot reset passwords. **Both:** no user -> 404 `NOT_REGISTERED` ("You do not have an account yet. Please register"); unverified -> 409 `NOT_VERIFIED`; else emails a 6-digit code |
| `verify_reset` | code, newPassword, portal | checks code, sets password, signs out other sessions |

Rules implemented: password minimum **8 characters**; code = cryptographically random, stored as SHA-256 hash, expires in 10 min, single use, max 5 wrong attempts, 60 s resend cooldown; a honeypot field `website` is ignored if filled.

### 4b. `school-applications` (needs `Authorization: Bearer <user access token>`)
Parent actions: `submit_application`, `submit_enquiry`, `my_submissions`.
Admin actions (caller must be an active `school_admins.user_id`): `whoami`, `list_applications {status?}`, `decide_application {id, decision: "accepted"|"rejected", note?}`.

`decide_application` updates only rows still `pending` (prevents double emails), then emails the parent using the branded **acceptance** or **rejection** template. No acceptance letter is needed; the template is the letter. The Resend result is stored in `decision_email_id` / `decision_email_error`.

### 4c. `school-submit` (existing)
Newsletter subscribe/unsubscribe and the old public contact form. Only change: the welcome email now uses `welcomeEmail()` from `_shared/email.ts`.

## 5. Two functions that are EMPTY in the repo: please check Supabase

`supabase/functions/school-email-center/index.ts` and `school-admin-auth/index.ts` are **empty files on GitHub** (they may be deployed in Supabase only).

- **`school-email-center`** (admin messages + newsletter) is still called by `/admin` with actions `list_conversations`, `get_conversation`, `reply`, `close`, `subscribers`, `send_newsletter`, `send_announcement`. Make sure it is deployed. **Restyle its emails:** wrap newsletter/announcement HTML with `newsletterEmail({ subject, contentHtml, kind })` and replies with `layout()` from `_shared/email.ts`, so they match the website, with logo and school name. Include an unsubscribe link via `unsubscribeUrl`.
- **`school-admin-auth`** is **replaced** by `school-account` (the front-end no longer calls it). It can be deleted.
- The admin UI reads `requester_name`, `requester_email`, `type`, `last_message_at` and `body_text`, while `school-submit` writes `name`, `email`, `kind` and `body`. Confirm which columns/views really exist and align them.

## 6. Email templates (all branded: red header with logo, school name and motto; palette red/grey/white/black)

`_shared/email.ts` exports: `codeEmail` (sign-up and reset code boxes), `acceptanceEmail`, `rejectionEmail` (gentle tone, optional admin note), `applicationReceivedEmail`, `enquiryReceivedEmail`, `welcomeEmail`, `newsletterEmail`, plus `layout`, `button`, `callout`, `sendEmail`. Edit wording there only.

## 7. Test checklist

1. `/apply` > Create account > code arrives > enter it > signed in.
2. Register the same email again > "You already have an account".
3. Forgot password with an unregistered email > "You do not have an account" > sent to Register.
4. Forgot password with a registered email > code > new password works; old one fails.
5. `/admin` > Forgot password with a non-admin email > "not an administrator" + masked hint, no email sent.
6. `/admin` with admin email > code arrives > reset works > sign in.
7. Submit an application as a parent > confirmation email + school alert; appears under Applications as *pending*.
8. Admin clicks **Accept** > parent gets the acceptance email; **Reject** on another > rejection email; status badges update; buttons disappear.
9. Parent signed in on `/admin` is refused ("not an administrator").

## 8. Security notes

- Admin rights = active row in `school_admins`, checked **server-side** on every admin call. Admin management is owner-only. Deactivation also revokes the target user's Auth sessions. Browser-stored admin information is never the authorization source.
- The "you already have an account / you do not have an account" messages reveal whether an email is registered (requested by the school). The 60 s code cooldown and 5-attempt limit reduce abuse. For stricter protection add per-IP rate limiting (e.g. Upstash) in `school-account`.
- `Access-Control-Allow-Origin` is `*` in `_shared/util.ts`; tighten to the production origin once the domain is final.
- Never put the Resend key or secret key in the React code.
- `school_audit_log` records admin creation, role changes, deactivation/reactivation and password resets.
- Configure `TURNSTILE_SECRET` in Supabase production secrets; without it, Turnstile cannot be enforced.
