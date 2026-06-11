# digrocer · brand concept lab

A single-file brand decision lab for **digrocer**. Open [`index.html`](index.html) in any browser — no build, no dependencies.

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
