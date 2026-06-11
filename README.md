# digrocer · brand concept

Brand exploration for **DiGrocer** — a decision lab plus a full iOS-27 concept of the real apps. Everything is plain HTML/CSS/JS: no build, no dependencies, open any file in a browser.

## ✦ The iOS-27 concept (`concept/`)

Every screen of the production **customer** and **rider** apps, mirrored detail-for-detail from the real codebase (screens, flows, copy, the Warm-Market palette from `Color.kt`, the Kente-D mark) — then transformed into the liquid-glass iOS-27 language with a graceful floor for older devices.

- [`concept/index.html`](concept/index.html) — hub
- [`concept/customer.html`](concept/customer.html) — 21 screens: splash (particle logo) → onboarding → auth → home (live-order pill, cart bar, one-tap steppers) → explore/search → deals → product → cart (promo codes, real fee math) → checkout (Paystack / wallet) → receipt (particle ✓) → live tracking (moving rider) → orders → order detail → favourites → wallet (MoMo methods) → profile → notifications → settings (working dark mode) → address edit/picker → support chat
- [`concept/rider.html`](concept/rider.html) — dark, map-centric: splash → auth → 2-step sign-up → pending review → the full delivery lifecycle (go online → 30s offer countdown → ride to store → item checklist → swipe-to-confirm pickup → deliver → photo proof → swipe to complete → payout celebration) → earnings (GH₵ 12 floor) → technical support
- `concept/shared.css` — the design system (Warm-Market tokens, glass, dock, springs)
- `concept/fx.js` — the particle engine (Kente-D assembles from motes, leaf bursts, check spirals, drift, pollen)

**Graceful floor:** glass → soft solids via `@supports`; `prefers-reduced-motion` → settled stills; particles pause off-screen; P3 color only where supported; prepaid only — no cash on delivery anywhere.

## ✦ The decision lab (`index.html`)

A single-file brand decision lab. Open [`index.html`](index.html) in any browser.

## What's inside

**Decisions 01–12** — the original comparison lab (v4), completely untouched: logo intro, wordmark, app icon, splash, price style, buttons, product cards, bottom nav, add-to-basket motion, favorite motion, screen transitions, loaders.

**Decisions 13–16** — additions layered on top, all driven by a canvas particle engine:

| # | Decision | What it explores |
|---|----------|------------------|
| 13 | Particle effect | The five ambient systems from particle lab v5 — leaf burst, falling leaves, vortex gather, pollen glow, bloom ripple |
| 14 | Logo from particles | Hundreds of motes assemble into the Sprout-d mark — and **exit** again: assemble & hold, breathe & release (loop), exit burst, spiral in & out |
| 15 | Particle moments | The same dust forms the wordmark, the basket, the heart, and the order-confirmed check |
| 16 | Liquid glass | The iOS-27 feel — frosted glass floating over live particles, with an automatic soft-solid fallback for older devices (option D forces it for comparison) |

## How it works

- Tap any option to **pick it** — one pick per decision, tracked in the bottom panel (17 decisions total).
- Animated options **replay on every tap**; particle formations re-sample and re-fly.
- Palette chips up top restyle everything live — every particle recolors on its next run.

## Progressive enhancement (the "lower versions still feel it" part)

- `backdrop-filter` glass → falls back to a soft solid surface via `@supports`.
- Scroll-driven card entrances (`animation-timeline: view()`) → simply skipped on engines without it.
- `prefers-reduced-motion` → particle scenes render their final formed state as a still.
- Off-screen particle systems pause via `IntersectionObserver` to keep scrolling smooth.

## Files

- `index.html` — the combined lab (v4 verbatim + appended addon script)
- `originals/digrocer-comparison-lab-v4.html` — untouched original
- `originals/digrocer-particle-lab-v5.html` — untouched original
