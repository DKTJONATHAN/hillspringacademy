# Hill Spring Academy website

React + Vite + React Router. Built by Jonathan Mwaniki (zandani.co.ke).

## Run locally
    npm install
    npm run dev

## Edit content
- Text, emails, phone, address, notices: `src/data.js`
- Gallery photos: add files to `public/gallery/`, then set `src` for each item in `GALLERY` (`src/data.js`)
- Logo: save as `public/logo.png` (shows a "LOGO" placeholder until it exists)
- Colours: CSS variables at the top of `src/styles.css`

## Accounts, applications and admin

- `/apply` and `/enquire`: parent accounts (email code verification, password reset by 6-digit code), online admission form and enquiry form.
- `/admin`: admins accept or reject applications (parent is emailed automatically), read enquiries, send newsletters.
- Backend setup for Supabase: see `docs/SUPABASE_SETUP.md`. SQL is in `supabase/migrations/`.

## Deploy on Cloudflare Pages (from GitHub)
1. Push this folder to a GitHub repository.
2. Cloudflare dashboard > Workers & Pages > Create > Pages > Connect to Git, pick the repo.
3. Framework preset: Vite (or set manually). Build command: `npm run build`. Output directory: `dist`.
4. Deploy, then add the custom domain under Custom domains.

Pages serves `index.html` for unknown paths when there is no `404.html`, so routes like `/gallery` work on refresh. Do not add a `404.html`.

## App-like features
Page transitions, scroll progress bar, light/dark toggle, hero carousel, tabbed levels, step-by-step admissions, FAQ accordion, gallery lightbox with keyboard arrows, and a mobile bottom tab bar.
