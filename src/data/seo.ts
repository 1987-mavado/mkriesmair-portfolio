// Shared SEO data: canonical routes per language, person/site structured data.
export const SITE = 'https://mkriesmair.online';
export type Lang = 'de' | 'en';

export const routes = {
  home: { de: '/', en: '/en/' },
  art: { de: '/art-director-muenchen/', en: '/en/art-director-munich/' },
  cd: { de: '/creative-director-muenchen/', en: '/en/creative-director-munich/' },
  strategy: { de: '/creative-strategist-muenchen/', en: '/en/creative-strategist-munich/' },
} as const;
export type RouteKey = keyof typeof routes;

export const contact = {
  email: 'mail@mkriesmair.de',
  phone: '+49 (0)176 32 838 362',
  phoneHref: 'tel:+4917632838362',
  linkedin: 'https://www.linkedin.com/in/markus-kriesmair-15847934/',
};

export const OG_IMAGE = '/og-image.jpg';

export const personLd = (lang: Lang) => ({
  '@type': 'Person',
  '@id': `${SITE}/#person`,
  name: 'Markus Kriesmair',
  url: `${SITE}/`,
  image: `${SITE}${OG_IMAGE}`,
  jobTitle: ['Art Director', 'Creative Director', 'Creative Strategist'],
  description:
    lang === 'de'
      ? 'Art Director, Creative Director und Creative Strategist in München. Strategie, Konzeption und kreative Führung.'
      : 'Art Director, Creative Director and Creative Strategist in Munich. Strategy, concepts and creative leadership.',
  address: { '@type': 'PostalAddress', addressLocality: lang === 'de' ? 'München' : 'Munich', addressCountry: 'DE' },
  email: `mailto:${contact.email}`,
  knowsLanguage: ['de', 'en'],
  sameAs: [contact.linkedin],
});

export const websiteLd = (lang: Lang) => ({
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: `${SITE}/`,
  name: 'Markus Kriesmair',
  inLanguage: ['de', 'en'],
  publisher: { '@id': `${SITE}/#person` },
});

// Which case studies each service page shows, in display order. Keys are the case ids used
// in Portfolio.jsx (see CASE_SLUGS there). Edit here to change the assignment.
// Requested but not in the portfolio data yet (art): "Pferdeschwänze" (position 4) and
// "McDonald's Corporate Responsibility Report" (position 6) — add their keys once the cases exist.
export const serviceCases = {
  art: ['bmwx4', 'saturn', 'bmw2', 'yelp', 'aokback', 'bmw1'],
  cd: ['ducati', 'tonline', 'o2'],
  strategy: ['ducati', 'tonline', 'o2'],
} as const;

export const caseRoute = (slug: string) => ({ de: `/cases/${slug}/`, en: `/en/cases/${slug}/` });
