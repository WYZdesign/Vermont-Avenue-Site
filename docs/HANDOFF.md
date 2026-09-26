# VERMONT AVENUE RECORDS — HANDOFF
> Compiled 2026-09-25 from repo + vault + Vercel API + recovery corpus.
> Read this before touching the site. Ground truth beats memory.

## 1. WHAT THIS IS
Award-target static marketing site for **Vermont Avenue Records**, an independent
LA record label. "Created by musicians, for musicians."
- **Local repo:** `V:\vermont-avenue-records`
- **GitHub (PUBLIC):** `WYZdesign/Vermont-Avenue-Site` · default branch `main`
- **Vercel project:** `vermont-avenue-records` (`prj_F9QRKgmo04628dvowIWZp54MufIv`)
  team `wyzdesigns-projects` (`team_JGtMzamqN3UGKwL50pboI6I3`)
- **Production branch:** `main` (the old "master + force-push" workaround is STALE)
- **Live:** https://vermont-avenue-records.vercel.app
- **No framework.** Plain HTML/CSS/JS. No build step. Vercel = static host.

## 2. CURRENT LIVE STATE (verified 2026-09-25)
- Production deployment `1b4293cc4` = **READY**.
- Local HEAD `1b4293cc429f1eda219ed81117937c71771ea7b5` == `origin/main` == `origin/master`.
- **Custom domain attached to Vercel (verified) but DNS still points at GoDaddy.**
  `vermontavenuerecords.com` + `www` were added to the project; both show `verified: true`.
  GoDaddy nameservers (`ns33/ns34.domaincontrol.com`) still serve the "Launching Soon"
  placeholder (`76.223.105.230`, `13.248.243.5`). Vercel reports `misconfigured: true`.
- Untracked working-tree files: `gen_share_image.py`, `images/og-share.jpg`.
  (`images/og-share.png` IS tracked and is what `index.html` references.)

## 3. STACK / ARCHITECTURE
- CSS entry `styles.css`, JS `script.js`, markup `index.html`, PWA `sw.js` + `manifest.webmanifest`.
- CDN libs (pinned): GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.18. Google Fonts: Anton,
  Instrument Serif, Space Grotesk.
- `script.js` systems: Lenis smooth scroll; custom cursor (desktop only, respects
  `prefers-reduced-motion` + coarse pointer); letter-split hero; preloader counter;
  fixed-timestep canvas EQ (10–25s breathing, immune to scroll bursts); rotating vinyl;
  GSAP marquee (pause on hover); roster floating-image rows; pinned horizontal releases
  rail (only ≥768px); generic `.reveal`; PWA SW registration.
- Sections: Hero → Marquee → 01 Manifesto → 02 Roster → 03 Releases → 04 Live →
  Join (newsletter) → Footer.
- `.js` class added in `<head>`; 5s no-JS preloader/reveal fallback.

## 4. DESIGN TOKENS (`styles.css :root`)
```
--ink #0b0908   --coal #14100c   --panel #1a1510
--amber #ffa233 --amber-soft #ffc37a
--cream #f1e8d6 --fog #a79b88
--serif "Instrument Serif"  --disp "Anton"  --grotesk "Space Grotesk"
--ease cubic-bezier(0.16,1,0.3,1)  --ease-snap cubic-bezier(0.83,0,0.17,1)
```
Theme color `#0b0908`. PWA `standalone`, `display_override window-controls-overlay`,
`portrait-primary`.

## 5. CONTENT GROUND TRUTH
See `docs/BRAND_DOSSIER.md` (full recon). Owner **John McGrath**.
Roster: The LA Limes, The Dante's Inferno, Sophia Morrow, Ryan Washington, Isaiah Harden.
Release links point to Bandcamp / Spotify. Live night = The Stowaway, 416 S Spring St, DTLA,
Thursdays doors 8PM, hosted by The LA Limes. Excluded: podcast "Vermont Ave" (Overtones Media).

## 6. GIT HISTORY (origin/main)
```
1b4293c 2026-08-17 deploy trigger: force Vercel webhook after repo rename to Vermont-Avenue-Site
760af84 2026-08-17 feat: branded 1200x630 og-share image from label-art.jpg, Twitter Card, og:image swap
14dede8 2026-08-10 feat: EQ entrance reorder, mobile 100dvh fix, scroll-to-top, blur-up LQIP, live EQ parallax, :focus-within, marquee GSAP pause, tap feedback, edge-fade rail
bd1ab44 2026-08-10 fix: EQ flicker on scroll — phase advances by real elapsed dt
8bbd8cb 2026-08-10 fix: roster image slides in from left
78dd375 2026-08-10 fix: roster hover image/name overlap, safe-margin PWA icons, fixed-timestep EQ
a2e748b 2026-08-10 tune EQ to clean 10-25s breathing cycles
e5f02e5 2026-08-10 feat: super-slow EQ, SVG icon system, favicon/PWA suite, mobile overflow fix, WYZ Design credit
4503f8c 2026-08-10 feat: Vermont Avenue Records site — The Avenue build
```

## 7. CREDENTIALS / TOOLING
- Vault keys: `vercel_TOKEN_FULL` (prod Vercel API), `wyzdesign_VERCEL_API_KEY`,
  `wyzdesign_VERCEL_OIDC_TOKEN`. No domain/DNS credential exists yet.
- `W:\WYZ_Command_Center\wyz_deploy_check_va.py` — Vermont deploy verifier (use this).
- `W:\WYZ_Command_Center\wyz_deploy_check.py` is hardcoded to the **Muse** project — do not
  use it for Vermont.

## 8. OPEN ITEMS (do these next)
1. **Finish the domain.** Added + verified on Vercel. Remaining = replace GoDaddy DNS:
   - `@` A → `216.150.1.1` (or the legacy `76.76.21.21`) — remove the current
     `76.223.105.230` / `13.248.243.5` parking records.
   - `www` CNAME → `d55b16a5956c8bad.vercel-dns-016.com` (or `cname.vercel-dns.com`).
   No GoDaddy/DNS credential exists in the vault yet; that is the blocker.
2. **Newsletter is a frontend placeholder** — `script.js:442-462` fakes success; `#joinForm`
   posts nowhere. Wire a real endpoint (Vercel function / Mailchimp / Resend).
3. Commit `gen_share_image.py` (and decide on `og-share.jpg`).
4. `sw.js` cache name is `"var-site-v1"` (fine) — bump on any shell change.
5. Optional: `robots.txt`, `sitemap.xml`, JSON-LD (MusicGroup/Organization), analytics.

## 9. RULES
- No build step: edit source, commit to `main`, Vercel auto-deploys. Verify with
  `python W:\WYZ_Command_Center\wyz_deploy_check_va.py <full-sha>` → must say `DEPLOY IS LIVE`.
- Never hand-edit generated images; regenerate via `gen_share_image.py`.
- Keep protected/global WYZMIND rules (no secrets in output, append-only `wyz_os.ps1`).
