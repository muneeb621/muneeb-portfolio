# Muhammad Muneeb — Developer Portfolio

A responsive, premium dark portfolio built with plain HTML, CSS, and JavaScript.

## Files

- `index.html` — portfolio content and sections
- `style.css` — responsive dark theme and animations
- `script.js` — mobile navigation, reveal animations, contact form validation and submission
- `chatbot.js` — floating AI chat assistant
- `demos/` — three standalone demo pages linked from the project cards' Live Demo buttons
- `Start Portfolio.bat` — double-click to start a local server and open the site (Windows)
- `AGENTS.md` — **keep-in-sync checklist** (access key, phone, GitHub, CV path, chatbot knowledge). Read this before editing, so nothing goes stale.
- `assets/cv/` — drop your CV PDF here

## Run locally

1. Extract the ZIP.
2. **Easiest:** double-click `Start Portfolio.bat` — it starts a local server and opens the site in your browser automatically.
3. Or open `index.html` in VS Code and use the **Live Server** extension (**Open with Live Server**).
4. Or open `index.html` directly — the site works, but the AI chatbot runs in offline mode because Puter.js needs an `http://` origin (no console error; it just uses the local knowledge base).

No build step or package installation is required. The Google Fonts link needs an internet connection; the site still works if fonts cannot load.

## Important customization

### CV download
Both CV buttons point to `assets/cv/Muhammad-Muneeb-CV.pdf`. Drop your PDF in `assets/cv/` with exactly that filename. Until then the buttons show a toast telling you where to put the file.

### Contact form
The form validates fields in the browser, then submits to **Web3Forms**, which emails the message to you. Your access key lives in two places and must stay in sync:

- `index.html` → the hidden `access_key` input inside `#contactForm`
- `script.js` → the `access_key` value in the `fetch` body

Also add your deployed domain to the **Web3Forms dashboard → Domains** allow-list, otherwise submissions from your site will be rejected.

### Phone
The number `+923700144052` appears in four places and must stay in sync:

- `index.html` → the `tel:` link in the contact list (`#contact .contact-list`)
- `index.html` → the phone `social-link` in `.hero-socials`
- `index.html` → the `Phone` link in `.footer-social`
- `index.html` → the `.whatsapp-fab` link (`https://wa.me/923700144052`)

Display text is `+92 370 0144052`; the `tel:` href is `tel:+923700144052`.

### Theme toggle
A sun/moon button in the navbar switches between dark and light themes. The choice is stored in `localStorage['theme']` and applied by a small inline script in `<head>` before paint (no flash). Light-theme overrides live in `style.css` section 25 (`html[data-theme="light"]`).

### WhatsApp button
A green floating button (bottom-left) opens WhatsApp chat at `wa.me/923700144052` with a pre-filled greeting. Keep the number in sync with the phone links above.

### AI chatbot
A floating assistant sits in the bottom-right corner and answers visitor questions about the portfolio.

- `index.html` loads `https://js.puter.com/v2/` (only when the page is served over `http://` or `https://`) and then `chatbot.js`. On `file://` Puter is skipped so no "Unsupported Origin" error appears and the bot runs fully offline.
- Answers come from **Puter.js** (`puter.ai.chat`, model `gpt-5.4-nano`). There is no API key and no cost to you — the visitor signs in to Puter once and covers their own usage. The first message opens a Puter sign-in popup.
- The system prompt combines a curated brief (in `chatbot.js` → `BRIEF`) with the rendered page text, so answers stay grounded in what is actually on the site. Update `BRIEF` when you change projects, skills or contact details.
- If Puter is blocked, offline or the visitor cancels the sign-in, `chatbot.js` falls back to a local keyword knowledge base (`FALLBACK`) so basic questions still work.
- The bot replies in the language the visitor uses.

### Project links
Each project card has a **Live Demo** button that opens a standalone interactive demo page from the `demos/` folder (`vaccination-system.html`, `valencia-dial.html`, `laravel-ecommerce.html`). The **GitHub** buttons are disabled "Coming soon" placeholders. When a real repo exists, swap the `<span class="btn ... btn-coming-soon">` for that card to `<a href="https://github.com/..." class="btn btn-small btn-outline">GitHub</a>`.

### GitHub
The site links to `github.com/muneeb621` (hero, contact, and footer). The three project cards' **GitHub** buttons still show **"Coming soon"** because none of the portfolio's showcased projects have a public repo yet. Swap a project's GitHub `<span>` to an `<a href="...">` once its repository exists.

### Profile image
The hero uses an SVG person placeholder labelled "Your Photo". Replace it in `index.html` with an `<img>` when you have a photo, then add the image styling in `style.css`.


## Deploy to Netlify
1. Visit Netlify and sign in.
2. Choose **Add new site** / manual deploy (the label may vary).
3. Drag the extracted `muneeb-portfolio` folder or deploy the project folder using the Netlify dashboard instructions.
4. After deployment, open the generated site URL and test all links and the CV download.
