# PawQuest landing page

Static, dependency-free website built on the PawQuest design system. Upload this whole folder to any static host (GitHub Pages, Netlify, Vercel, S3) — `index.html` is the entry point.

- `index.html` — semantic single-page site (Home, About/Mission, Adopt + process, Rescue & rehabilitation, Get involved / Volunteer / Donate, Success stories, Footer)
- `styles.css` + `tokens/` — design-system tokens (copied from the DS root)
- `css/components.css` — Button, NavBar, PetCard styles copied verbatim from the DS components
- `css/site.css` — page layout, built only on tokens
- `js/main.js` — mobile nav, active-section highlighting, pet filters, pet profile dialog, volunteer & donate forms
- `assets/` — logo, photos, self-hosted fonts

Only external dependency: Lucide icons from unpkg (icons are decorative; the page works without them).
Forms are prototypes — nothing is submitted or charged.
