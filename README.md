<<<<<<< HEAD
# real-estate
=======
# XYZ Real Estate — Dholera Homepage

Ultra-premium, single-page real estate homepage for residential plots & large land parcels in Dholera, Gujarat.

## Files

```
project/
├── index.html     ← structure, content, inline SVG icon sprite
├── style.css      ← design system, layout, motion
├── script.js      ← CONFIG block + all interactions
├── README.md      ← this guide
└── assets/        ← create this folder (see below)
```

Open `index.html` directly in a browser — no build process, no server.

---

## 1. Replace company details (one place: `script.js`)

At the **top of `script.js`** is a clearly marked `SITE` configuration block.

| Field | Replace with | Used in |
|---|---|---|
| `name` | Company legal name | WhatsApp messages, form messages |
| `address` | Full registered office address | Office card, footer |
| `phone` | Display phone, e.g. `+91 98765 43210` | Office card, menu, final CTA, footer |
| `phoneHref` | Same number for `tel:` links | All phone links |
| `email` | Enquiry email | All mail links |
| `website` | `www.yourdomain.in` | Footer link |
| `whatsapp` | Digits only, with country code: `919876543210` (no `+`, spaces or dashes) | **Every** WhatsApp button, FAB, form |
| `mapsUrl` | Google Maps → Share → Copy link (your office) | "Get Directions" button (appears only when set), Maps links |
| `mapsEmbedUrl` | Google Maps → Share → **Embed a map** → copy the `src` value | Location section map (replaces the illustrative Dholera area map) |

Until a value is replaced, the page **keeps showing the bracketed placeholder** — nothing is fabricated.

### Logo (two places)

`index.html` → **Header** and **Footer** contain a text wordmark marked with `<!-- LOGO ... -->` comments.
Replace each `<a class="brand">…</a>` block with:

```html
<a class="brand" href="#home" aria-label="Your Company — home">
  <img src="assets/logo.png" alt="XYZ Real Estate" width="190" height="44" />
</a>
```

Use a **transparent PNG or SVG** (keep original proportions). Never add a background behind it.

---

## 2. Images — replace the illustrative placeholders

All images are currently licensed Pexels placeholders (clearly labelled in `alt` text and with
`<!-- PLACEHOLDER ... -->` comments). They are **not** photographs of Dholera — swap them for
client/government/site photography.

```
assets/
├── logo.png            (transparent, ~400×92 recommended)
├── og-image.jpg        (1200×630 for social shares — og:image meta in index.html)
├── dholera-hero.jpg    (hero — landscape ≥ 2560×1440; verified Dholera SIR aerial/infrastructure)
├── plots-residential.jpg  (slide 01 — ≥ 1600×1200)
├── parcels-large.jpg      (slide 02 — ≥ 1600×1200)
├── dholera-connectivity.jpg (slide 03 — ≥ 1600×1200)
├── dholera-aerial.jpg   (Why-Dholera sticky image — portrait 4:5, ≥ 1200×1500)
├── plot-r1.jpg  plot-r2.jpg   (listing cards — ≥ 1280×960, 4:3)
└── parcel-p1.jpg  parcel-p2.jpg
```

Search for each `<!-- PLACEHOLDER` comment in `index.html` to find every `src` to change.
The hero image is **not** lazy-loaded (intentional, it is the primary visual); all others are.

---

## 3. Property listings

The four listing cards in `index.html` and the `LISTINGS` object in `script.js`
(power the "View Details" dialog) are **sample formats**, visibly labelled with a "Sample"
chip and a disclosure note in the section.

To publish real inventory:
1. Update card markup in `index.html` (name, location, area, land use, image).
2. Mirror the same data in `LISTINGS` in `script.js`.
3. Replace "Request Price" only when the price is public; otherwise keep it.
4. Remove the `chip--sample` span and adjust `.featured-note` when listings are genuine.

---

## 4. Google Maps

* **Office embed** — `mapsEmbedUrl` in `script.js`. Until set, the map shows the Dholera
  *area* with a visible note that it is illustrative.
* **Directions / Maps links** — `mapsUrl` in `script.js`. The "Get Directions to Office"
  button stays hidden until it is set.
* **Plot locations** — by design, exact plot coordinates are *not* published; they are
  shared on enquiry (stated explicitly in the Location section).

---

## 5. WhatsApp

Every `[data-wa]` element gets a contextual, URL-encoded message built from `SITE.name`:

* `general` — header, hero, footer, FAB, mobile menu
* `residential` — Residential Plots category link
* `parcel` — Large Land Parcels category link
* `site-visit` — "Schedule a Site Visit"
* Per-listing messages via `[data-wa-listing]` and the detail dialog

The **enquiry form** has no backend by design: on valid submit it opens WhatsApp with the
full enquiry pre-filled and shows a success note. To wire a real backend (Formspree,
EmailJS, or your own endpoint), modify the `initForm` submit handler in `script.js`.

---

## 6. Factual claims about Dholera (kept honest)

The "Why Explore Dholera?" section separates **Operational / Under construction / Planned**,
with sources and a "last reviewed" date:

* NE-8 Ahmedabad–Dholera Expressway — 109 km, opened 31 Mar 2026 (NHAI/Wikipedia)
* Dholera International Airport (UDYN) — 3,200 m Code 4E runway complete, ≈80% done, target late 2026 (AAI/Wikipedia)
* 300 MW Phase-I solar park commissioned; 21,387 ha proposed SIR area (NICDC publications)
* Sarkhej–Dholera semi-HSR — CCEA-approved May 2026 (planned)

**Re-verify these quarterly** and update the "Last reviewed" `<time>` element and the
source links in `index.html` when statuses change.

---

## 7. Accessibility & performance notes

* `prefers-reduced-motion` disables Ken Burns, ticker, parallax, counters, split reveal,
  FAB pulse, and slide transitions.
* No-JS fallback: all content is visible; a static mobile nav is injected via `<noscript>`.
* Touch targets ≥ 44 px; keyboard-accessible menu (Esc, focus return) and dialog.
* Images carry `width`/`height` (no layout shift) and `loading="lazy"` below the fold.
>>>>>>> 98150cd (Initial commit)
