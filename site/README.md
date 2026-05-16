# WebExpress landing page

This folder is the source of the static landing page that is deployed to GitHub Pages by `.github/workflows/generate-docs.yml`.

## What is in here

- `index.html` — landing page (hero, getting started, contribute, contact, legal).
- `privacy.html` — GDPR privacy notice.
- `imprint.html` — imprint (operator must complete the postal address).
- `404.html` — error page.
- `assets/css/styles.css` — local stylesheet, system fonts only.
- `assets/js/main.js` — small enhancement script (mobile menu, copyright year). No external requests.
- `assets/img/` — inline SVG logo, favicon and OpenGraph card.
- `robots.txt`, `sitemap.xml`, `.nojekyll` — site metadata.

## Design constraints

- No external resources (no fonts.googleapis.com, no CDN scripts, no analytics).
- No cookies, no `localStorage`, no `sessionStorage`.
- System fonts only.
- Responsive, mobile-first, WCAG AA in mind.

The workflow validates that no third-party origins are referenced from any
HTML file before it deploys to Pages.

## Local preview

Open `index.html` directly in a browser, or serve the folder with any static
file server, e.g.:

```
python -m http.server --directory site 8080
```
