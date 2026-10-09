# mkriesmair.online — portfolio

One-page portfolio for Markus Kriesmair, built from the "Portfolio Site v11" design handoff.
Static Astro site with a single React island.

    npm install
    npm run dev      # http://localhost:4321
    npm run build    # static output in dist/

## Where things live

- `src/components/Portfolio.jsx` — the whole page (markup, case data, interactions)
- `src/components/Slot.jsx` — image slots; images and crops come from `src/data/slots.json`
- `src/styles/` — design tokens, keyframes, hover rules, self-hosted fonts
- `public/` — images, videos, audio, fonts

## Deploy (Vercel)

Framework preset "Astro", build command `npm run build`, output `dist`. No environment variables.

## Open items

- Imprint and privacy pages (footer links are placeholders)
- `[...]` placeholders in the BMW 2 Series case; unverified reach claim in the BMW 1 Series case
- Vimeo embeds and thumbnails load from vimeo.com without a consent step
