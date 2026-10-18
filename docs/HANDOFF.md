# VERMONT AVENUE RECORDS — HANDOFF
> Updated 2026-09-26 after the client meeting and the Next.js rebuild.
> Read this before touching the site. Ground truth beats memory.

## 1. WHAT THIS IS
Marketing site + booking intake for **Vermont Avenue Records**, an independent
Los Angeles label and live music collective. "Created by musicians, for musicians."

- **Local repo:** `V:\vermont-avenue-records`
- **GitHub (PUBLIC):** `WYZdesign/Vermont-Avenue-Site`
- **Production branch:** `main`
- **Development branch:** `rebuild-nextjs` (merged into `main`)
- **Vercel project:** `vermont-avenue-records` (`prj_F9QRKgmo04628dvowIWZp54MufIv`)
  team `wyzdesigns-projects` (`team_JGtMzamqN3UGKwL50pboI6I3`)
- **Live:** https://vermont-avenue-records.vercel.app
- **Stack:** Next.js 16.3.1 (App Router), React 19.2.8, Tailwind CSS v4, TypeScript.

The root `index.html`, `styles.css`, `script.js`, `sw.js`, `manifest.webmanifest`
are the **legacy static site**. They are not served by Next. Leave them alone
unless reverting. The live app is `src/`.

## 2. CURRENT LIVE STATE (verified 2026-09-26)
- Production deployment `f5f3448` = **READY**. Vercel framework is now `nextjs`.
- `main` == `origin/main` == `f5f3448`.
- **Custom domain attached and verified on Vercel, but DNS still points at GoDaddy.**
  `vermontavenuerecords.com` + `www` are in the project. GoDaddy parking
  (`76.223.105.230`, `13.248.243.5`) still serves the "Launching Soon" page.
- GoDaddy login automation is **blocked** by their bot wall ("Your browser is a bit
  unusual"). Credentials are in the vault, but the DNS change is a manual two-minute job.

## 3. ROUTES
```
/                     home
/about                about (copy drafted, John will revise)
/services             all 8 acts
/services/dj          DJ
/services/dj-live     DJ + Live Combo
/services/solo        Solo
/services/duo         Duo
/services/trio        Trio
/services/quartet     Quartet
/services/quintet     Quintet
/services/full-band   Full Band (Vermont Avenue Allstars)
/releases             full catalog
/live                 The Stowaway open mic
/book                 booking request
/contact              contact + request
/api/book             POST booking intake (email via Resend if configured, else test mode)
/robots.txt, /sitemap.xml, /manifest.webmanifest
```

## 4. ARCHITECTURE
- `src/app/layout.tsx` — fonts, metadata, JSON-LD, header, footer.
- `src/app/page.tsx` — home.
- `src/app/services/[slug]/page.tsx` — generated from `src/lib/content.ts`.
- `src/lib/content.ts` — site, nav, acts, roster, releases, live night, about, booking fields.
- `src/components/` — `Logo`, `SiteHeader`, `SiteFooter`, `Marquee`, `ActCard`,
  `ReleaseCard`, `BookingForm`, `Reveal`, `SectionLabel` + `PageHero`.
- `src/app/api/book/route.ts` — validates, honeypot, Resend email when
  `RESEND_API_KEY` + `BOOKING_TO_EMAIL` are set, otherwise logs in test mode.
- `public/images/` — copied from the legacy `images/` folder. Replace with the
  Drive social content when curated.

## 5. DESIGN SYSTEM
```
--ink #0b0b0b   --coal #141412   --bone #f4f1e8   --paper #faf8f2
--forest #1f3d2b   --forest-bright #2f5d41   --sage #9db6a4   --fog #6f6a60
Fonts: Bodoni Moda (display) / Jost (sans) / Instrument Serif (italic accent)
```
- Direction: black + white with forest green accents, 1950s LA deco / mid-century.
- References: Blue Note, Apollo Jazz, Blitz Nation, Pickled Priest.
- The real logo is `public/images/label-art.jpg` (orange street sign, bird + note,
  dark green). It is used in the header and footer. Do not recreate it.
- Images get a forest duotone treatment via `.duotone`.

## 6. CONTENT GROUND TRUTH
`docs/BRAND_DOSSIER.md` has the full recon. Owner **John McGrath**.
Roster: The LA Limes, The Dante's Inferno, Sophia Morrow, Ryan Washington, Isaiah Harden.
Releases link to Bandcamp / Spotify. Live night: The Stowaway, 416 S Spring St, DTLA,
Thursdays, doors 8PM, hosted by The LA Limes.
Excluded: podcast "Vermont Ave" (Overtones Media).

Client feedback (meeting 2026-09-26) is in the vault as `VERMONT_CLIENT_BRIEF_20260926`.

## 7. LOCAL COMMANDS
```
npm install
npm run dev                    # local development
npm run build                  # must pass before pushing
npm run start -- -p 3210       # production build locally
python W:\WYZ_Command_Center\wyz_deploy_check_va.py <sha>   # must say DEPLOY IS LIVE
```

## 8. CREDENTIALS / TOOLING
- Vault: `vercel_TOKEN_FULL`, `wyzdesign_VERCEL_API_KEY`, `wyzdesign_VERCEL_OIDC_TOKEN`.
- Vault: `GODADDY_CUSTOMER_ID`, `GODADDY_PASSWORD` (GoDaddy bot wall blocks automation).
- `W:\WYZ_Command_Center\wyz_deploy_check_va.py` is the Vermont deploy checker.
- `wyz_deploy_check.py` (root) is hardcoded to **Muse**, not Vermont.

## 9. OPEN ITEMS
1. **DNS (blocked on GoDaddy automation).** In GoDaddy DNS for the domain:
   - `@` A -> `216.150.1.1` (remove `76.223.105.230` / `13.248.243.5`)
   - `www` CNAME -> `d55b16a5956c8bad.vercel-dns-016.com`
   Verify with Vercel: the domain config should stop reporting `misconfigured: true`.
2. ~~Admin backend v1~~ **DONE.** Neon `super-cherry-67821789` is live; the admin
   is active at `/admin` and bookings persist.
3. **Admin v1 modules live:** bookings/status, clients, invoices, contracts,
   campaigns, logistics, subscribers, content. Stripe link scaffolding is in
   (needs the key). Still open: e-sign, real campaign sending, GA4 reporting.
4. **Accounts:** John needs a Stripe account and a business email. Resend + e-sign
   can follow. Build in test mode until keys exist.
5. **Pricing:** `priceFrom` is `null` in `src/lib/content.ts`; the site says
   "Starting rate on request". Drop in John's numbers when provided.
6. **About copy:** drafted; John will write the final version.
7. **Service copy:** drafted close to the brand voice; placeholders where John's
   specifics are needed.
8. **Media:** use the Google Drive "Social Media Content" folder (LA Limes videos,
   April show, photos, album art). Currently the site uses the legacy images.
9. **Analytics:** GA4 (needs a measurement ID).
10. **Booking email:** set `BOOKING_TO_EMAIL` + `RESEND_API_KEY` + `RESEND_FROM`
    in Vercel env. Until then `/api/book` accepts and logs in test mode.
11. **Legal:** LLC name, address, phone, tax/EIN for contracts and invoices.
12. `images/og-share.jpg` is an untracked stray. Delete only with owner confirmation.

## 10. ADMIN BACKEND (added 2026-09-26)
- **DB:** Postgres via `pg`. Local dev container `va-postgres` on port 5433;
  production = **Neon** project `super-cherry-67821789` (`aws-us-east-2`, PG 17).
  Supabase Pro later.
- **Production env (set in Vercel):** `DATABASE_URL` (pooled),
  `DATABASE_URL_UNPOOLED` (direct), `OWNER_EMAIL`, `OWNER_PASSWORD`,
  `COOKIE_SECURE=true`, `NEXT_PUBLIC_SITE_URL`.
- **Vault keys:** `VERMONT_DATABASE_URL`, `VERMONT_DATABASE_URL_DIRECT`,
  `VERMONT_OWNER_EMAIL`, `VERMONT_OWNER_PASSWORD`, `NEON_API_KEY`.
- **Owner login:** `owner@vermontavenuerecords.com` (password in the vault).
  Change to John's real business email/password when it exists.
- **Status:** production admin is LIVE at `/admin`; bookings persist to Neon.
  Booking notification email still reports `delivery: "test"` until
  `RESEND_API_KEY` + `BOOKING_TO_EMAIL` are set.
- **Auth:** scrypt hashes, `va_session` HttpOnly cookie, 30 days.
  Roles: `owner`, `team`, `client`, `fan`.
- **Tables:** `users`, `sessions`, `bookings`, `clients`, `invoices`, `contracts`,
  `campaigns`, `logistics`, `subscribers`, `content_blocks`.
- **Routes:** `/login`, `/signup`, `/account`, `/admin` (overview, bookings,
  clients, invoices, contracts, campaigns, logistics, subscribers, content).
  APIs: `/api/auth/login|logout|signup`, `/api/admin/bookings/[id]`,
  `/api/admin/invoices/[id]/stripe`, `/api/subscribe`, `/api/book`.
- **Local commands:** `docker start va-postgres`, `npm run db:migrate`,
  `npm run db:seed`. Env template: `.env.example`.

## 11. RULES
- No framework surprises: this is Next App Router. Do not add a second router or build tool.
- Edit `src/lib/content.ts` for copy/data changes.
- Verify with `npm run build` before pushing. Vercel auto-deploys `main`.
- Never commit secrets. Vault only.
- Never touch the legacy static files unless intentionally reverting.
