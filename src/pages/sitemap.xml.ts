// Sitemap with hreflang alternates: only canonical, indexable URLs.
import type { APIRoute } from 'astro';
import { SITE, routes } from '../data/seo';

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = Object.values(routes).flatMap((r) =>
    (['de', 'en'] as const).map(
      (l) => `  <url>
    <loc>${SITE}${r[l]}</loc>
    <lastmod>${lastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="de" href="${SITE}${r.de}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${r.en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${r.de}"/>
  </url>`,
    ),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
