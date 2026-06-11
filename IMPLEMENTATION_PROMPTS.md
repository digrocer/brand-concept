# DiGrocer · lab-theme implementation prompts

Four ready-to-paste prompts — **one Claude Code session per app**. Each is fully
self-contained: open a fresh session in the DigrocerProduction repo, paste the
matching block, nothing else needed.

**Read this first (you, the human):**

- These target the **real production apps** — real product images, real Google
  Maps, real Paystack, real Supabase. The HTML files in this repo are the
  *visual spec*, not the implementation. Every prompt says this explicitly.
- Android sessions can self-verify with `assembleDebug` on this machine.
  **iOS sessions cannot compile on Windows** — Xcode needs the Mac. Run those
  sessions for the code work, then build on the Mac (same workflow as
  `BUILD_ON_MAC.md`).
- Keep the matching HTML prototype open in a browser during the session so you
  can compare what Claude builds against the spec.

---

## Prompt 1 — Android customer (`apps/android-customer`)

```
GOAL
Implement the approved "lab theme" redesign in the REAL DiGrocer Android
customer app. The visual spec exists as a working HTML prototype — translate
that design faithfully into the production Kotlin/Compose code. Do NOT invent
a new design; when in doubt, the prototype wins.

VISUAL SPEC (read-only — open in a browser and interact):
- C:\Users\Dee\Desktop\brand-concept\android\customer.html   (the spec for this session)
- C:\Users\Dee\Desktop\brand-concept\android\shared.css      (token + component source of truth)
- C:\Users\Dee\Desktop\brand-concept\index.html              (the decision lab the theme comes from)

TARGET
apps/android-customer — re-theme every screen: splash, onboarding, auth,
home, explore/search, deals, product detail, cart, checkout, receipt,
track order, orders, order detail, favourites, wallet, profile,
notifications, settings, address edit, address picker, support chat.

THIS IS A REAL APP — NOT A MOCKUP
The HTML prototype uses placeholders; the production app does not. Non-negotiable:
- Product imagery: keep the real image pipeline (Coil/AsyncImage from the
  product image URLs). The prototype's emoji-on-mint-gradient tiles translate
  to: mint gradient as the image CONTAINER/loading background, real photo on
  top. Never ship emoji as product art.
- Maps: keep the real Google Map (maps-compose) on tracking and address
  picker. The prototype's stylized SVG map is art direction only — express it
  as a Google Maps custom style JSON (warm ivory roads/landscape for light)
  if practical, otherwise keep the default map. Never replace the map with
  static art.
- Data & payments: every screen stays wired to the existing ViewModels,
  NetworkRepository, Supabase RPCs, realtime rider feed, Paystack/MoMo and
  wallet flows. No simulated payments, no canned data.
- Support chat: stays on SupportRepository — no canned replies.
- Push/FCM, RemoteConfig, control-plane screens: untouched in behavior.

DESIGN TOKENS (exact — do not improvise)
Light "Market Classic":  canvas #F7EFDF · surface #FFFDF7 · ink #22271F ·
  inkMuted #6F7466 · hairline #E9E0C9 · primary/grocer #1F5130 ·
  forest #143B22 · mint #EAF0E0 · mintDeep #CFE0C4 · harvest #F5C84C ·
  harvestSoft #FBF0CF · berry #E0452B · onBrand #FFFDF7
Dark "Evening Delivery": canvas #121D16 · surface #1C2B21 · ink #F4EEDF ·
  inkMuted #A9B3A2 · hairline #2C3A2F · primary #E9C24A (gold; text on it
  #1B2A20) · mint #1E3526 · mintDeep #2C4A35 · berry #E05842 ·
  highlight green #7FB069
Brand mark: the "Sprout-d" — bowl ring (circle stroke) + stem + two leaves,
  second leaf in berry. Geometry: brand-concept\ios\fx.js SHAPES.logo
  (viewBox 120: circle cx46 cy74 r30 strokeWidth 13; rect 80,14,13x92 r6.5;
  leaf paths "M86 14 q2 -12 14 -14 q0 12 -14 14z" and mirrored in berry).
Wordmark: lowercase "digrocer." — the dot in berry.
Type: Roboto Flex for UI text, Baloo 2 for the wordmark and display moments
  (both OFL on Google Fonts — bundle in res/font or use downloadable fonts).

PLATFORM FEEL — Android 16 / Material 3 Expressive (match the prototype):
tonal surfaces (no blur), ink ripples, shape-morph on press (pill → 16dp
radius), flush M3 navigation bar with animated pill indicator, M3 switches,
emphasized easing (cubic-bezier(.3,0,0,1) — no overshoot), floating cart bar
as extended-FAB flavour, live-order pill on Home.

HARD RULES
1. Do NOT touch data/model, data/network, data/local, or any ViewModel —
   frozen backend contracts (see apps/android-customer/DESIGN.md "Carried
   over"). Re-skin ui/theme, ui/components, ui/screens only.
2. No Cash on Delivery anywhere — DiGrocer is prepaid only.
3. Do not change applicationId, signing, or build configuration.
4. Work on a new branch. Run assembleDebug after each screen group and fix
   failures before moving on. Commit incrementally. Do not merge to main.

WORKING METHOD
Read apps/android-customer/DESIGN.md, ui/theme/* and 2–3 screens first to
learn existing patterns. Then: tokens (Color.kt/Theme.kt/Type.kt) → shared
components (DgKit, ProductTile, buttons, CartBar, LiveOrderPill) → screens in
the order listed above. If an emulator is available, install and visually
compare each flow against the open prototype.
```

---

## Prompt 2 — Android rider (`apps/android-rider`)

```
GOAL
Implement the approved "lab theme" redesign in the REAL DiGrocer Android
rider app. The visual spec exists as a working HTML prototype — translate it
faithfully into the production Kotlin/Compose code. The prototype wins every
visual argument.

VISUAL SPEC (read-only — open in a browser and interact):
- C:\Users\Dee\Desktop\brand-concept\android\rider.html      (the spec for this session)
- C:\Users\Dee\Desktop\brand-concept\android\shared.css      (token + component source of truth)

TARGET
apps/android-rider — re-theme: splash, auth, 2-step sign-up, pending review,
the map-centric DeliveryNavScreen (all phases: OFFLINE, ONLINE_IDLE, OFFER
with countdown, TO_STORE, AT_STORE checklist + swipe, TO_CUSTOMER, AT_CUSTOMER
photo proof + swipe), earnings, settings, technical-support chat.

THIS IS A REAL APP — NOT A MOCKUP
- The map is the real GoogleMap (maps-compose) with the real route polyline
  from the directions edge function, real rider GPS, real markers. The
  prototype's SVG map is art direction only — express light/dark mood via
  Google Maps style JSON per theme if practical; never replace the live map.
- Offers, phase transitions, photo proof upload, earnings: real
  RiderRepository RPCs and realtime assignments. No simulated flows.
- Support chat stays on SupportRepository.
- Keep SwipeToConfirm semantics (real state transitions behind the swipes).

CRITICAL BEHAVIOR CHANGE (already approved, mirrors the prototype):
- The app starts in LIGHT mode (Market Classic), not dark.
- Top-level Support entry is REPLACED by Settings (gear icon on the map
  chrome and on Earnings). Settings menu, exactly this order:
    1. Dark mode (toggle, off by default — switches to Evening Delivery)
    2. Biometric login (toggle)
    3. Sign out
    4. Help & support (opens the existing technical-support chat)
    5. Policies (Terms of Service & Privacy Policy)
    6. Delete account (destructive styling, confirm step)
- Dark toggle re-themes everything live, including the map style.

DESIGN TOKENS (exact)
Light "Market Classic":  canvas #F7EFDF · surface #FFFDF7 · ink #22271F ·
  inkMuted #6F7466 · hairline #E9E0C9 · primary #1F5130 · forest #143B22 ·
  mint #EAF0E0 · mintDeep #CFE0C4 · harvest #F5C84C · berry #E0452B ·
  onBrand #FFFDF7
Dark "Evening Delivery": canvas #121D16 · surface #1C2B21 · ink #F4EEDF ·
  inkMuted #A9B3A2 · hairline #2C3A2F · primary #E9C24A (text on it #1B2A20) ·
  mint #1E3526 · mintDeep #2C4A35 · berry #E05842 · highlight #7FB069
Brand mark: "Sprout-d" (geometry in brand-concept\ios\fx.js SHAPES.logo).
Wordmark: lowercase "digrocer. rider", dot in berry.
Type: Roboto Flex UI, Baloo 2 wordmark/display (both OFL).

PLATFORM FEEL — Android 16 / Material 3 Expressive: tonal surfaces (no blur),
ripples, shape-morph button presses, emphasized easing, edge-to-edge bottom
sheet for the phase UI, M3 switches.

HARD RULES
1. Do NOT touch data/*, network, RiderRepository, ViewModels — frozen
   contracts (see apps/android-rider/DESIGN.md). UI layer only.
2. No cash anywhere — keep "Prepaid — no cash needed" messaging. Earnings
   copy may mention the GH₵ 12.00 per-delivery floor (config-driven).
3. Do not change applicationId, signing, or build configuration.
4. New branch; assembleDebug green after each screen group; incremental
   commits; no merge to main.

WORKING METHOD
Read apps/android-rider/DESIGN.md, ui/theme/*, DeliveryNavScreen.kt and
SwipeToConfirm.kt first. Then tokens → shared components → screens, phase by
phase. Compare each phase against the prototype in the browser.
```

---

## Prompt 3 — iOS customer (`apps/ios-customer`)

```
GOAL
Implement the approved "lab theme" redesign in the REAL DiGrocer iOS customer
app (SwiftUI). The visual spec exists as a working HTML prototype — translate
it faithfully. The prototype wins every visual argument.

NOTE ON VERIFICATION
This machine cannot run Xcode. Write and refactor the Swift code, keep it
syntactically coherent and consistent with the existing project structure,
and leave a short BUILD_NOTES section in the final summary listing anything
that must be checked when compiling on the Mac. Do not pretend to have built.

VISUAL SPEC (read-only — open in a browser and interact):
- C:\Users\Dee\Desktop\brand-concept\ios\customer.html       (the spec for this session)
- C:\Users\Dee\Desktop\brand-concept\ios\shared.css          (token + component source of truth)

TARGET
apps/ios-customer/DiGrocer — re-theme every screen mirroring the prototype's
21: splash, onboarding, auth (3-step create), home (live-order pill, floating
cart bar, one-tap steppers), explore/search, deals, product detail, cart,
checkout, receipt, live tracking, orders, order detail, favourites, wallet,
profile, notifications, settings (working dark mode), address edit, address
picker, support chat.

THIS IS A REAL APP — NOT A MOCKUP
- Product imagery: real photos via the existing async image loading; the
  prototype's mint-gradient tiles are the image container/placeholder
  treatment behind real photos, never a replacement.
- Maps: the real map view (existing MapKit/Google Maps usage) with the real
  rider feed on tracking and real pin-drop on address picker.
- Payments, wallet, orders, realtime: existing services/view models, real
  Paystack — no simulation.
- Support chat stays on the real support service.

DESIGN TOKENS (exact)
Light "Market Classic":  canvas #F7EFDF · surface #FFFDF7 · ink #22271F ·
  inkMuted #6F7466 · hairline #E9E0C9 · primary #1F5130 · forest #143B22 ·
  mint #EAF0E0 · mintDeep #CFE0C4 · harvest #F5C84C · harvestSoft #FBF0CF ·
  berry #E0452B · onBrand #FFFDF7
Dark "Evening Delivery": canvas #121D16 · surface #1C2B21 · ink #F4EEDF ·
  inkMuted #A9B3A2 · hairline #2C3A2F · primary #E9C24A (text on it #1B2A20) ·
  mint #1E3526 · mintDeep #2C4A35 · berry #E05842 · highlight #7FB069
Brand mark: "Sprout-d" (geometry in brand-concept\ios\fx.js SHAPES.logo —
  reproduce as a SwiftUI Shape/Path).
Wordmark: lowercase "digrocer." with berry dot.
Type: DM Sans body, Baloo 2 display/wordmark, Fraunces italic for whisper
  taglines (all OFL — bundle in the app target + Info.plist UIAppFonts).

PLATFORM FEEL — iOS-27 liquid glass with a graceful floor:
.ultraThinMaterial / blurred bars, sheets, dock-style floating tab bar —
each with a solid-color fallback path; spring animations
(spring(response:dampingFraction:) with slight overshoot); press-scale on
tappables; Dynamic-Island-aware safe areas; particle moments (splash logo
assembling, leaf burst on add-to-cart and order placed) where feasible with
Canvas/TimelineView, always behind a Reduce Motion check.

HARD RULES
1. Do NOT touch models, networking/services, or view models — frozen backend
   contracts. Views/theme layer only.
2. No Cash on Delivery anywhere — prepaid only.
3. Do not change bundle id, signing, Config.xcconfig values, or entitlements.
4. New branch; incremental commits; no merge to main.

WORKING METHOD
Read the project layout under DiGrocer/ first (theme/colors, components, 2–3
screens) to learn patterns. Then tokens → shared components → screens in the
prototype's order. Respect Reduce Motion and Dynamic Type throughout.
```

---

## Prompt 4 — iOS rider (`apps/ios-rider`)

```
GOAL
Implement the approved "lab theme" redesign in the REAL DiGrocer iOS rider
app (SwiftUI). Visual spec is a working HTML prototype — translate it
faithfully; the prototype wins.

NOTE ON VERIFICATION
This machine cannot run Xcode — write coherent Swift, list anything to check
in a BUILD_NOTES section for the Mac build. Do not pretend to have built.

VISUAL SPEC (read-only — open in a browser and interact):
- C:\Users\Dee\Desktop\brand-concept\ios\rider.html          (the spec for this session)
- C:\Users\Dee\Desktop\brand-concept\ios\shared.css          (tokens/components)

TARGET
apps/ios-rider/DiGrocerRiderIOS — splash, auth, sign-up, pending, the
map-centric delivery flow (all phases incl. offer countdown, store checklist,
swipe-to-confirm, photo proof), earnings, settings, support chat.

THIS IS A REAL APP — NOT A MOCKUP
- Real map + real GPS broadcasting (LocationManager — recently fixed so the
  customer tracking map receives live positions; do not regress it), real
  route/ETA, real offers and phase RPCs, real photo upload, real earnings.
- The prototype's SVG map is art direction only.

CRITICAL BEHAVIOR CHANGE (already approved, mirrors the prototype):
- App starts in LIGHT mode (Market Classic).
- Support entry is replaced by SETTINGS (gear), menu exactly:
  1. Dark mode (off by default → Evening Delivery, re-themes live incl. map)
  2. Biometric login  3. Sign out  4. Help & support (existing chat)
  5. Policies  6. Delete account (destructive, confirm step)

DESIGN TOKENS — identical to Prompt 3 (Market Classic light / Evening
Delivery dark). Wordmark "digrocer. rider". Type: DM Sans + Baloo 2 (OFL,
bundled). Brand mark: Sprout-d as a SwiftUI Shape.

PLATFORM FEEL — iOS-27 liquid glass with graceful floor: blurred phase sheet
over the live map (solid fallback), springs, swipe-to-confirm with spring
return, pulse ring on the waiting state, payout celebration with leaf-burst
particles (Canvas/TimelineView, Reduce Motion respected).

HARD RULES
1. Do NOT touch models, networking, repositories, or view models. Views only.
2. No cash — keep "Prepaid — no cash needed". GH₵ 12.00 floor copy stays
   config-driven.
3. Do not change bundle id, signing, Config.xcconfig, entitlements, or the
   location/background-mode Info.plist entries.
4. New branch; incremental commits; no merge to main.

WORKING METHOD
Read the existing SwiftUI sources first to learn patterns, then tokens →
components → phase-by-phase screens, comparing against the prototype.
```
