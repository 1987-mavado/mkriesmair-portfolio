# mkriesmair.online — portfolio

One-page portfolio for Markus Kriesmair, built from the "Portfolio Site v11" design handoff.
Static Astro site with a single React island.

    npm install
    npm run dev      # http://localhost:4321
    npm run build    # static output in dist/

## Where things live

- `src/pages/` — German pages at the root, English under `en/`; `sitemap.xml.ts` builds the sitemap
- `src/components/Portfolio.jsx` — the home page (markup, case data, interactions); English is the source language
- `src/i18n/de.json` — German strings, looked up by their English text (`ui` = page copy, `data` = case data)
- `src/components/ServicePage.astro` + `src/data/services.ts` — the three service pages in both languages
- `src/data/seo.ts` — routes per language, contact data, structured data
- `src/layouts/Base.astro` — meta tags, canonical, hreflang, Open Graph, JSON-LD
- `src/components/Slot.jsx` — image slots; images and crops come from `src/data/slots.json`
- `src/styles/` — design tokens, keyframes, hover rules, self-hosted fonts
- `public/` — images, videos, audio, fonts, `robots.txt`, `og-image.jpg`

Changing copy: edit the English text in `Portfolio.jsx` and the matching key in `de.json` together —
a German entry whose English key no longer matches silently falls back to English.

## Deploy (Vercel)

Framework preset "Astro", build command `npm run build`, output `dist`. No environment variables.

## Open items

- Privacy page (footer link is a placeholder)
- `[...]` placeholders in the BMW 2 Series case; unverified reach claim in the BMW 1 Series case
- Vimeo embeds and thumbnails load from vimeo.com without a consent step
