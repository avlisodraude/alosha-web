# Alosha Studio — Implementation Plan

Turns the strategic roadmap into a sequenced, actionable backlog. Scope: the **Short-Term (0–6 month)** goals — refactor Alosha architecture, consolidate PixSqueeze branding, launch the Open Source page, reach first npm traction. Monitor and Stride are scoped as groundwork only.

---

## 1. Current reality (what the repos actually are)

The roadmap describes the *target*. Here is the *starting point*, which changes the work.

**`pixsqueeze` package** (`compressorjs` repo, npm v1.3.1)
- npm name is already `pixsqueeze`, but CompressMe is still wired throughout: README "Website" link → `avlisodraude.github.io/compressme`; `repository.url` and codecov badge → `github.com/avlisodraude/compressme`.
- Ships a client compressor **and** a server-side conversion API (HEIC/TIFF/RAW), deployed on Railway (`railway.json`).
- `MONETIZATION_ROADMAP.md` already exists in-repo.

**`alosha-web`** (Nuxt 3, `@nuxt/ui`, `@nuxtjs/supabase`, deployed alosha.dev on Vercel)
- This is **already the PixSqueeze commercial product app**, not a portfolio site. Pages: `index` (product landing), `login`/`confirm`/`reset-password` (Supabase auth), `dashboard/{index,usage,billing,api-key}`, `docs`. Composable: `usePixsqueeze.ts`.

**Implication:** the pivot is a **split**, not a new build. The product app moves to `pixsqueeze.alosha.dev`; `alosha.dev` is rebuilt as the umbrella hub. Most of the existing code is product code that needs *relocating*, not deleting.

---

## 2. Decisions to make first (blocking)

These gate everything else. Recommended default in **bold**.

1. **Hosting topology for the split.** **Option A — one Nuxt app, two domains:** keep `alosha-web`, add hub routes, serve `alosha.dev` (marketing/hub) and `pixsqueeze.alosha.dev` (product/dashboard) from the same Vercel project via domain config + middleware. Lowest effort, one codebase, shared components. *Option B — two repos/deployments:* cleaner separation, more overhead, duplicated tooling. **Recommend A** for a solo founder; revisit if products diverge.
2. **Blog engine.** **Nuxt Content (markdown in-repo)** vs hosted CMS. **Recommend Nuxt Content** — no new service, Git-based, fits the AI-assisted workflow. Adds `@nuxt/content`.
3. **Open Source page data.** Static JSON now vs live npm/GitHub stats. **Recommend static now**, wire live badges later (avoids a blocker for launch).
4. **CompressMe redirect mechanism.** GitHub Pages `compressme` repo → add a redirect (meta-refresh / `_redirects`) to `pixsqueeze.alosha.dev`. Confirm you still control that repo.

---

## 3. Workstreams & backlog

Tasks are grouped by workstream. Each has an ID, a concrete "where", and dependencies. Priority: **P0** = do first, **P1** = next, **P2** = after launch.

### WS-A · PixSqueeze brand consolidation (retire CompressMe) — *package repo*

| ID | Task | Where | Pri | Deps |
|----|------|-------|-----|------|
| A1 | Update README: replace `avlisodraude.github.io/compressme` "Website" link with `https://pixsqueeze.alosha.dev` | `compressorjs/README.md` | P0 | D4 |
| A2 | Add "Built by [Alosha](https://alosha.dev)" line to README header + footer | `compressorjs/README.md` | P0 | — |
| A3 | Fix `repository.url` and badges (codecov, build) to the canonical repo; rename GitHub repo `compressme`→`pixsqueeze` or set as canonical | `package.json`, `README.md` badges | P0 | — |
| A4 | Audit all in-repo `compressme`/`CompressMe` strings and replace | grep across `compressorjs` (docs/, src/, html) | P1 | A1–A3 |
| A5 | Publish a patch release so npm README reflects new links | npm `pixsqueeze` | P1 | A1–A4 |
| A6 | Add CompressMe→PixSqueeze redirect on the old GitHub Pages site | `compressme` GH repo | P0 | D4 |

### WS-B · alosha.dev → portfolio hub — *web repo*

| ID | Task | Where | Pri | Deps |
|----|------|-------|-----|------|
| B1 | Decide topology (Section 2.1); add domain + middleware so product routes serve under `pixsqueeze.alosha.dev` | `nuxt.config.ts`, `vercel.json`, middleware | P0 | D1 |
| B2 | New hub homepage: headline "Building privacy-first tools and developer products powered by open source", flagship showcase, CTAs | new `app/pages/index.vue` (hub) | P0 | B1 |
| B3 | `Products` page — card per product (problem, features, screenshots, pricing, CTA); PixSqueeze first | `app/pages/products/` | P1 | B2 |
| B4 | `About` page — Product-Owner + AI-accelerated philosophy | `app/pages/about.vue` | P1 | B2 |
| B5 | `Contact` page | `app/pages/contact.vue` | P2 | B2 |
| B6 | Hub nav/footer/layout (Products · Open Source · Blog · About · Contact) | `app/layouts/default.vue`, `AppLogo.vue` | P0 | B2 |

### WS-C · pixsqueeze.alosha.dev product subdomain — *web repo*

| ID | Task | Where | Pri | Deps |
|----|------|-------|-----|------|
| C1 | Relocate existing product landing/dashboard/docs/auth under the product subdomain (move or namespace routes) | `app/pages/*` (existing), middleware | P0 | B1 |
| C2 | Ensure Supabase auth redirects + `redirectOptions` still resolve on the subdomain | `nuxt.config.ts` supabase block | P0 | C1 |
| C3 | Add "Built by Alosha" / back-to-hub link in product chrome | product layout | P1 | C1, B6 |
| C4 | Verify Stripe billing + api-key flows unaffected by domain change | `dashboard/billing.vue`, `api-key.vue` | P0 | C1 |

### WS-D · Open Source page + Blog foundation — *web repo*

| ID | Task | Where | Pri | Deps |
|----|------|-------|-----|------|
| D-OS | `Open Source` page: PixSqueeze entry (description, npm downloads, GitHub link, status, link to premium) | `app/pages/open-source.vue` | P1 | B6, Dec 2.3 |
| D-B1 | Add `@nuxt/content`, blog index + post layout | `nuxt.config.ts`, `app/pages/blog/` | P1 | Dec 2.2 |
| D-B2 | Seed 1–2 launch posts (e.g. "Why we retired CompressMe", "Maintaining OSS with AISDLC") | `content/blog/*.md` | P2 | D-B1 |

### WS-E · Monitor & Stride groundwork (later — do NOT build yet)

| ID | Task | Where | Pri | Deps |
|----|------|-------|-----|------|
| E1 | Run each through the roadmap's 4-gate framework (Distribution / Improvement / Commercial / Automation) before any code | planning doc | P2 | — |
| E2 | Reserve subdomains `monitor.` / `stride.`; add "coming soon" cards to Products page | DNS, `products/` | P2 | B3 |

---

## 4. Sequencing

```
Decisions (D1–D4)
      │
      ├─ A1,A2,A3,A6 ──► A4 ──► A5         (PixSqueeze branding — can run in parallel with B/C)
      │
      └─ B1 ─┬─ B2 ─► B3,B4,B5
             │       └─ B6 ──► D-OS, D-B1 ──► D-B2
             └─ C1 ─► C2,C3,C4
```

Critical path to a launchable pivot: **D1 → B1 → (B2,B6 + C1,C2,C4)**. Branding (WS-A) is independent and can ship first as a quick, visible win.

---

## 5. Definition of done — 0–6 month milestone

- `alosha.dev` serves the portfolio hub (Home, Products, Open Source, About; Blog + Contact ideally).
- `pixsqueeze.alosha.dev` serves the full product app with working auth, billing, and docs.
- CompressMe is retired: no live CompressMe-branded surface, old URLs redirect, npm README points to the new homepage with "Built by Alosha".
- Open Source page is live with the PixSqueeze entry.
- npm traction is being tracked (downloads/stars/list signups) as the Phase-1 trust metric.

---

## 6. Suggested first move

WS-A (branding consolidation) is low-risk, high-visibility, and only blocked by deciding the canonical PixSqueeze URL. Knock out A1–A3 + A6 first while you settle the Section 2 decisions, then start the B1 split.
