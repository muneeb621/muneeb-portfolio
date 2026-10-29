# AGENTS.md

Static portfolio for Muhammad Muneeb (`MUNEEB.DEV`). Plain HTML/CSS/JS — **no build step, no package.json, no test framework.**

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All content, sections, inline SVG sprite, contact form |
| `style.css` | Dark theme, responsive layout, animations |
| `script.js` | Nav, mobile menu, reveal animations, contact form validation + Web3Forms submit |
| `chatbot.js` | Floating AI assistant (Puter.js + offline fallback) |
| `demos/*.html` | Three standalone demo pages (Vaccination System, Valencia Dial, Laravel E-commerce) linked from the project cards' **Live Demo** buttons |
| `assets/cv/Muhammad-Muneeb-CV.pdf` | CV served by both download buttons |
| `README.md` | Install / customize / deploy notes for the owner |

## Keep in sync — edit these together

1. **Web3Forms access key** — `d36b219d-5ae4-48dc-adbd-572dc9c571e6`
   - `index.html` → hidden `access_key` input inside `#contactForm`
   - `script.js` → `access_key` in the `fetch` body
2. **Phone number** `+923700144052` / display `+92 370 0144052` — four places in `index.html`:
   - `#contact .contact-list` first row (`tel:` link)
   - `.hero-socials` first link (`tel:` link)
   - `.footer-social` "Phone" link (`tel:` link)
   - `.whatsapp-fab` link (`https://wa.me/923700144052`)
3. **GitHub** `github.com/muneeb621` — hero, contact, footer. Do **not** "fix" this to `muneeb612`; the old username 404s.
4. **CV path** `assets/cv/Muhammad-Muneeb-CV.pdf` — the two download buttons and README must match. (A duplicate `Muhammad Muneeb.pdf` sits in the repo root; it is not referenced.)
5. **Chatbot knowledge** — `chatbot.js`:
   - `BRIEF` → what the AI model is told about Muneeb
   - `FALLBACK` → keyword answers used when Puter is blocked/offline/timed out
   Update both whenever projects, skills, services, education, availability or contact details change in `index.html`.
6. **Project links** — the three project cards' **Live Demo** buttons are `<a href="demos/…">` links to local demo pages; **GitHub** buttons remain `<span class="btn btn-small btn-outline btn-coming-soon">` placeholders. Only swap a GitHub span to `<a href="…">` once a real repo URL exists.
7. **Web3Forms → Domains allow-list** — after deploying, add the real domain in the Web3Forms dashboard or submissions get rejected.

## Notes on existing behaviour

- **AI chatbot:** Puter.js (`puter.ai.chat`, model `gpt-5.4-nano`). No API key, no cost to the owner — the *visitor* signs in to Puter once via a popup. First reply waits up to 20s, then falls back to `FALLBACK` and answers afterwards instantly from that local knowledge base.
- **Contact form must be tested from `http://`**, not `file://` — `fetch()` to `https://api.web3forms.com/submit` fails on a `null` origin. Web3Forms also returns 403 to non-browser User-Agents (e.g. headless Chrome's `HeadlessChrome/...` UA), so override `--user-agent` when automating a browser test.
- **Reveal animations** are gated on a `.js` class on `<html>`, so content stays visible if JavaScript fails to load.
- **Theme toggle** — a button in the navbar flips `html[data-theme="light"|"dark"]`; the choice is saved to `localStorage['theme']` and applied by a small inline script in `<head>` (before paint, so no flash). `style.css` section 25 holds the light-theme overrides.
- **WhatsApp FAB** — `.whatsapp-fab` (bottom-left) links to `wa.me/923700144052`, kept in sync with the phone number above.
- **Google Fonts** (Space Grotesk, Inter) are the only external stylesheet; the site still works without them.

## Verify after any change

```
node --check script.js
node --check chatbot.js
```

Then open the site **over `http://`** (e.g. `python -m http.server 8080`) and confirm:

- 0 console errors
- no horizontal scrollbar at 1440px **and** at 390px
- contact form shows `✓ Message sent!…`
- chatbot button opens, Escape closes it

CSS braces and HTML tag balance should stay even (`{`/`}` in `style.css`, `<div>`/`</div>` and `<svg>`/`</svg>` in `index.html`).
