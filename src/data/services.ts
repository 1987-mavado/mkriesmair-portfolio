// Content of the three service pages (Art Director / Creative Director / Creative Strategist),
// in German and English. Every statement here is taken from the portfolio's own case data.
import type { Lang, RouteKey } from './seo';

type CaseRef = {
  key: string; // case anchor on the home page: /#case-<anchor>
  anchor: string;
  img: string;
  brand: string;
  title: string;
  body: string;
  role: string;
};
type Focus = { title: string; body: string };
export type Service = {
  route: Exclude<RouteKey, 'home'>;
  metaTitle: string;
  metaDescription: string;
  label: string;
  h1: string;
  lead: string;
  focusLabel: string;
  focus: Focus[];
  workLabel: string;
  workIntro: string;
  cases: CaseRef[];
  expLabel: string;
  exp: string[];
};

const IMG = {
  ducati: '/slots/m3-case-ducati.webp',
  o2: '/slots/m3-case-o2.webp',
  bmw2: '/assets/bmw2-coupe.webp',
  bmwx4: '/assets/bmwx4-ooh-front.webp',
  tonline: '/slots/m3-case-tonline-v2.webp',
  saturn: '/slots/m3-case-saturn.webp',
  db: '/slots/m3-case-db.webp',
};

export const services: Record<Lang, Record<Exclude<RouteKey, 'home'>, Service>> = {
  de: {
    art: {
      route: 'art',
      metaTitle: 'Art Director München | Markus Kriesmair – Freelance',
      metaDescription: 'Markus Kriesmair – Freelance Art Director in München. Visuelle Konzeption, Art Direction und kreative Kampagnen.',
      label: '(art direction)',
      h1: 'Freelance Art Director in München',
      lead: 'Visuelle Konzeption, Art Direction und Kampagnen – von der ersten Skizze bis zum fertigen Motiv. Für Agenturen und für Marken direkt.',
      focusLabel: '(01) schwerpunkte',
      focus: [
        { title: 'Visuelle Konzeption', body: 'Aus einer Idee ein Bild machen, das trägt: Key Visuals, Kampagnenlooks und Filmkonzepte, früh skizziert und visualisiert.' },
        { title: 'Art Direction', body: 'Komposition, Typografie, Bildbearbeitung. Beim BMW X4 entstanden zwei eigens für Deutschland komponierte und retuschierte Motive.' },
        { title: 'Kampagnen-Design', body: 'Ein Look für alle Kanäle. Für Saturn habe ich das Corporate Campaign Design und die Design-Guidelines für Partner entwickelt.' },
        { title: 'Produktion', body: 'Shootings, Film, Postproduktion und die Auslieferung aller Assets – betreut bis zum fertigen Ergebnis.' },
        { title: 'Art Direction mit GenAI', body: 'Bildgenerierung dort, wo sie Konzepte schneller sichtbar macht – wie beim Key Visual für das O₂ Record Race.' },
      ],
      workLabel: '(02) ausgewählte arbeiten',
      workIntro: 'Vier Kampagnen, bei denen die Art Direction den Unterschied gemacht hat.',
      cases: [
        { key: 'bmwx4', anchor: 'case-bmwx4', img: IMG.bmwx4, brand: 'BMW X4', title: 'Ein neues Segment, eingeführt mit Haltung.', body: 'Eine eigenständige deutsche Launch-Kampagne statt einer Adaption – mit zwei neu komponierten Key-Motiven rund um die Coupé-Linie.', role: 'Art Director' },
        { key: 'saturn', anchor: 'case-saturn', img: IMG.saturn, brand: 'Saturn Tech-Nick', title: 'Technik, bei der man sich zu fragen traut.', body: 'Eine Figur als Kampagnenplattform: visuelle Gestaltung, Corporate Campaign Design und ganzjährige Qualitätssicherung über alle Kanäle.', role: 'Art Director, Leitung des Art-Teams' },
        { key: 'bmw2', anchor: 'case-bmw2', img: IMG.bmw2, brand: 'BMW 2er', title: 'Ein Auto für Amerika – relevant gemacht für Deutschland.', body: 'Art Direction der Heritage-Route: das 2er Coupé als Erbe des BMW 2002, vollendet von den Fans.', role: 'Art Director, deutsche Adaption' },
        { key: 'o2', anchor: 'case-o2', img: IMG.o2, brand: 'O₂ Record Race', title: 'Ein Weltrekord, den die Gaming-Community selbst aufgestellt hat.', body: 'Art Direction und Key Visual für den Weltrekordversuch mit PlayStation – inklusive KI-generiertem Artwork.', role: 'Kreativkonzept & Kampagnenarchitektur' },
      ],
      expLabel: '(03) erfahrung',
      exp: [
        '14+ Jahre Art Direction in führenden Agenturen: Heye & Partner, Serviceplan, Grabarz & Partner, GGH MullenLowe und thjnk – dort als Senior Art Director für Deutsche Bahn und Commerzbank.',
        'Ausgezeichnete Arbeiten, unter anderem bei Cannes Lions, ADC Deutschland, GWA Effie und Red Dot.',
      ],
    },
    cd: {
      route: 'cd',
      metaTitle: 'Creative Director München | Markus Kriesmair',
      metaDescription: 'Markus Kriesmair – Creative Director in München. Creative Leadership, Kampagnenentwicklung und kreative Markenkommunikation.',
      label: '(creative direction)',
      h1: 'Freelance Creative Director in München',
      lead: 'Kreative Führung vom Briefing bis zur Auslieferung: Teams leiten, Ideen auswählen, Kunden beraten – auf Agentur- und auf Unternehmensseite.',
      focusLabel: '(01) schwerpunkte',
      focus: [
        { title: 'Kreative Gesamtverantwortung', body: 'Integrierte Kampagnen von der Leitidee bis on air – für die Deutsche Bahn über TV, OOH, Karriere-Content und Karrierefilme.' },
        { title: 'Teams führen', body: 'Leitung von Art-Teams bei Serviceplan und thjnk, dort 2,5 Jahre disziplinarische Führung im Tandem mit einem Creative Director Text.' },
        { title: 'Partner steuern', body: 'Freelancer, Produktionen, Sound-Studios und interne Teams briefen, koordinieren und auf ein Ergebnis ausrichten.' },
        { title: 'Kunden und C-Level', body: 'Arbeit präsentieren, beraten und abstimmen. Bei Ströer habe ich Projektbudgets über Business Cases beim C-Level gesichert.' },
        { title: 'Einspringen und übergeben', body: 'Als Art / Creative Director für den Übergang bei O₂ gebucht: Wissen ins neue Team gebracht und die Arbeit am Laufen gehalten.' },
      ],
      workLabel: '(02) ausgewählte arbeiten',
      workIntro: 'Vier Projekte, bei denen es um Führung und Gesamtverantwortung ging.',
      cases: [
        { key: 'db', anchor: 'case-db', img: IMG.db, brand: 'Deutsche Bahn', title: 'Jobs, gezeigt, wie sie wirklich sind.', body: 'Leitung des Art-Teams für die Arbeitgebermarke: Kundenbriefing geschärft, die kreative Arbeit ausgewählt, die Produktion bis zur Auslieferung geführt.', role: 'Senior Art Director, Leitung des Art-Teams' },
        { key: 'tonline', anchor: 'case-tonline', img: IMG.tonline, brand: 't-online', title: 'Vertrauen braucht Konsistenz.', body: 'Die Neupositionierung auf Unternehmensseite geführt: Narrativ, Corporate Design, Kampagne und Sound Branding mit externen Partnern und internen Teams.', role: 'Markenführung auf Unternehmensseite' },
        { key: 'saturn', anchor: 'case-saturn', img: IMG.saturn, brand: 'Saturn Tech-Nick', title: 'Technik, bei der man sich zu fragen traut.', body: 'Ganzjährige Kampagnenleitung mit drei Junior Art Directors und einem Praktikanten – spontane Markenbekanntheit 80 % über Ziel.', role: 'Art Director, Leitung des Art-Teams' },
        { key: 'o2', anchor: 'case-o2', img: IMG.o2, brand: 'O₂ Record Race', title: 'Ein Weltrekord, den die Gaming-Community selbst aufgestellt hat.', body: 'Kreativkonzept und Kampagnenarchitektur, die Live-Event, Microsite, Gaming-Creator und Social verbindet.', role: 'Kreativkonzept & Kampagnenarchitektur' },
      ],
      expLabel: '(03) erfahrung',
      exp: [
        'Selbstständiger Creative Director für Agenturen und direkt für Marken – O₂, Ducati, AOK, EDEKA, Mondelēz, BioNTech, Das Handwerk.',
        'Davor Kreation und Führung in Agenturen sowie Inhouse-Brand-Management bei der Ströer Content Group für t-online und watson. Dozent für Kampagnenentwicklung an der htk Hamburg und bei Burke München.',
      ],
    },
    strategy: {
      route: 'strategy',
      metaTitle: 'Creative Strategist München | Markus Kriesmair',
      metaDescription: 'Markus Kriesmair – Creative Strategist in München. Kreative Strategie, Markenpositionierung und Entwicklung wirkungsvoller Kampagnen.',
      label: '(creative strategy)',
      h1: 'Creative Strategist in München',
      lead: 'Strategie, die in einer Idee endet: Positionierung, Insight und Leitgedanke – entwickelt von jemandem, der sie danach auch gestalten und umsetzen kann.',
      focusLabel: '(01) schwerpunkte',
      focus: [
        { title: 'Positionierung', body: 'Einer Marke oder einem Modell eine klare Rolle geben. Für Ducati Deutschland: drei Modelle, drei Träume, ein Jahresthema.' },
        { title: 'Insight', body: 'Die eine menschliche Wahrheit finden, die eine Marke für sich besetzen kann – durch Recherche, Gespräche, Daten und Hinschauen.' },
        { title: 'Kreative Leitidee', body: 'Aus der Strategie einen Gedanken machen, der eine Kampagne trägt – wie die Familiengeschichte für Union Investment.' },
        { title: 'Briefing', body: 'Kundenbriefings schärfen und Strategie in ein Kreativbriefing übersetzen, mit dem ein Team arbeiten kann.' },
        { title: 'Kampagnenarchitektur', body: 'Die Idee so aufbauen, dass sie über Kanäle und Phasen funktioniert – vom Markenfilm bis zur Conversion.' },
      ],
      workLabel: '(02) ausgewählte arbeiten',
      workIntro: 'Vier Projekte, bei denen die Strategie die kreative Arbeit geprägt hat.',
      cases: [
        { key: 'ducati', anchor: 'case-ducati', img: IMG.ducati, brand: 'Ducati Deutschland', title: 'Einen Traum verkaufen – in einem Land der Reiseenduros.', body: 'Modellspezifische Positionierung für drei Modelle unter einem Jahresthema: der Traum. Cost per Lead −43 %, Conversion Rate +110 % in der Gesamtkampagne.', role: 'Externer Kreativ- und Strategieberater' },
        { key: 'tonline', anchor: 'case-tonline', img: IMG.tonline, brand: 't-online', title: 'Vertrauen braucht Konsistenz.', body: 'Vom Telekom-Portal zur unabhängigen journalistischen Marke – gebaut um den Wert des Verstehens, nicht nur um Information.', role: 'Markenführung auf Unternehmensseite' },
        { key: 'bmw2', anchor: 'case-bmw2', img: IMG.bmw2, brand: 'BMW 2er', title: 'Ein Auto für Amerika – relevant gemacht für Deutschland.', body: 'Kein neues Auto einführen, sondern eine Legende fortsetzen: ein US-getriebenes Produkt, neu positioniert als Erbe des BMW 2002.', role: 'Art Director, deutsche Adaption' },
        { key: 'db', anchor: 'case-db', img: IMG.db, brand: 'Deutsche Bahn', title: 'Jobs, gezeigt, wie sie wirklich sind.', body: 'Eine Zielgruppenanalyse zeigte: Azubis müssen anders angesprochen werden. Daraus entstand eine eigene, jüngere Designvariante der Arbeitgebermarke.', role: 'Senior Art Director, Leitung des Art-Teams' },
      ],
      expLabel: '(03) erfahrung',
      exp: [
        'Strategie und Kreation aus einer Hand: Kreativkonzept und Kampagnenstrategie für Union Investment, Positionierung für Ducati, Markenführung für t-online.',
        'Beide Seiten des Tisches: Agenturen wie Serviceplan, thjnk und GGH MullenLowe – und Inhouse-Brand-Management bei der Ströer Content Group.',
      ],
    },
  },
  en: {
    art: {
      route: 'art',
      metaTitle: 'Art Director Munich | Markus Kriesmair – Freelance',
      metaDescription: 'Markus Kriesmair – freelance Art Director in Munich. Visual concepts, art direction and creative campaigns for agencies and brands.',
      label: '(art direction)',
      h1: 'Freelance Art Director in Munich',
      lead: 'Visual concepts, art direction and campaigns — from the first sketch to the finished motif. For agencies and for brands directly.',
      focusLabel: '(01) focus',
      focus: [
        { title: 'Visual concepts', body: 'Turning an idea into an image that carries it: key visuals, campaign looks and film concepts, sketched and visualised early.' },
        { title: 'Art direction', body: 'Composition, typography, retouching. For the BMW X4, that meant two motifs composed and retouched specifically for Germany.' },
        { title: 'Campaign design', body: 'One look across every channel. For Saturn, I developed the corporate campaign design and the design guidelines for partners.' },
        { title: 'Production', body: 'Shoots, film, post-production and the delivery of all assets — supervised through to the finished result.' },
        { title: 'Art direction with GenAI', body: 'Image generation where it makes concepts visible faster — as with the key visual for the O₂ Record Race.' },
      ],
      workLabel: '(02) selected work',
      workIntro: 'Four campaigns where the art direction made the difference.',
      cases: [
        { key: 'bmwx4', anchor: 'case-bmwx4', img: IMG.bmwx4, brand: 'BMW X4', title: 'A new segment, launched with attitude.', body: 'A standalone German launch campaign instead of an adaptation — with two newly composed key motifs built around the coupé line.', role: 'Art Director' },
        { key: 'saturn', anchor: 'case-saturn', img: IMG.saturn, brand: 'Saturn Tech-Nick', title: 'Making technology feel easy to ask about.', body: 'One character as a campaign platform: visual design, corporate campaign design and year-round quality assurance across every channel.', role: 'Art Director, lead of the art team' },
        { key: 'bmw2', anchor: 'case-bmw2', img: IMG.bmw2, brand: 'BMW 2 Series', title: 'A car built for America, made to matter in Germany.', body: 'Art direction for the heritage-led route: the 2 Series Coupé as heir to the BMW 2002, finished by the fans.', role: 'Art Director, German adaptation' },
        { key: 'o2', anchor: 'case-o2', img: IMG.o2, brand: 'O₂ Record Race', title: 'A world record the gaming community set themselves.', body: 'Art direction and key visual for the world record attempt with PlayStation — including AI-generated artwork.', role: 'Creative concept & campaign architecture' },
      ],
      expLabel: '(03) experience',
      exp: [
        '14+ years of art direction at leading agencies: Heye & Partner, Serviceplan, Grabarz & Partner, GGH MullenLowe and thjnk — there as Senior Art Director for Deutsche Bahn and Commerzbank.',
        'Award-winning work, including Cannes Lions, ADC Germany, GWA Effie and Red Dot.',
      ],
    },
    cd: {
      route: 'cd',
      metaTitle: 'Creative Director Munich | Markus Kriesmair',
      metaDescription: 'Markus Kriesmair – Creative Director in Munich. Creative leadership, campaign development and brand communication for agencies and brands.',
      label: '(creative direction)',
      h1: 'Freelance Creative Director in Munich',
      lead: 'Creative leadership from brief to delivery: leading teams, choosing ideas, advising clients — on the agency side and the client side.',
      focusLabel: '(01) focus',
      focus: [
        { title: 'Owning the work end to end', body: 'Integrated campaigns from the lead idea to air — for Deutsche Bahn across TV, OOH, career content and career films.' },
        { title: 'Leading teams', body: 'Led art teams at Serviceplan and thjnk, including 2.5 years as line manager in tandem with a Creative Director Copy.' },
        { title: 'Steering partners', body: 'Briefing and coordinating freelancers, production companies, sound studios and internal teams towards one result.' },
        { title: 'Clients and C-level', body: 'Presenting, advising and aligning. At Ströer, I secured project budgets through business cases to C-level.' },
        { title: 'Stepping in, handing over', body: 'Booked as interim Art / Creative Director on O₂: brought my knowledge into the new team and kept the work running.' },
      ],
      workLabel: '(02) selected work',
      workIntro: 'Four projects that were about leadership and overall responsibility.',
      cases: [
        { key: 'db', anchor: 'case-db', img: IMG.db, brand: 'Deutsche Bahn', title: 'Jobs shown as they really are.', body: 'Led the art team for the employer brand: sharpened the client brief, selected the creative work and led production through to delivery.', role: 'Senior Art Director, lead of the art team' },
        { key: 'tonline', anchor: 'case-tonline', img: IMG.tonline, brand: 't-online', title: 'Trust needs consistency.', body: 'Led the repositioning from the client side: narrative, corporate design, campaign and sound branding with external partners and internal teams.', role: 'Brand management, client side' },
        { key: 'saturn', anchor: 'case-saturn', img: IMG.saturn, brand: 'Saturn Tech-Nick', title: 'Making technology feel easy to ask about.', body: 'Year-round campaign lead with three Junior Art Directors and an intern — spontaneous brand awareness 80 % above target.', role: 'Art Director, lead of the art team' },
        { key: 'o2', anchor: 'case-o2', img: IMG.o2, brand: 'O₂ Record Race', title: 'A world record the gaming community set themselves.', body: 'Creative concept and a campaign architecture connecting live event, microsite, gaming creators and social.', role: 'Creative concept & campaign architecture' },
      ],
      expLabel: '(03) experience',
      exp: [
        'Independent Creative Director for agencies and brands directly — O₂, Ducati, AOK, EDEKA, Mondelēz, BioNTech, Das Handwerk.',
        'Before that, creative work and leadership at agencies, and in-house brand management at Ströer Content Group for t-online and watson. Lecturer in campaign development at htk Hamburg and Burke Munich.',
      ],
    },
    strategy: {
      route: 'strategy',
      metaTitle: 'Creative Strategist Munich | Markus Kriesmair',
      metaDescription: 'Markus Kriesmair – Creative Strategist in Munich. Creative strategy, brand positioning and lead ideas for campaigns that work.',
      label: '(creative strategy)',
      h1: 'Creative Strategist in Munich',
      lead: 'Strategy that ends in an idea: positioning, insight and lead thought — developed by someone who can then design and deliver it.',
      focusLabel: '(01) focus',
      focus: [
        { title: 'Positioning', body: 'Giving a brand or a model a clear role. For Ducati Germany: three models, three dreams, one theme for the year.' },
        { title: 'Insight', body: 'Finding the one human truth a brand can own — through research, conversations, data and a lot of looking.' },
        { title: 'Lead idea', body: 'Turning strategy into a thought that carries a campaign — like the family story for Union Investment.' },
        { title: 'Briefing', body: 'Sharpening client briefs and translating strategy into a creative brief a team can work with.' },
        { title: 'Campaign architecture', body: 'Building the idea so it works across channels and phases — from brand film to conversion.' },
      ],
      workLabel: '(02) selected work',
      workIntro: 'Four projects where strategy shaped the creative work.',
      cases: [
        { key: 'ducati', anchor: 'case-ducati', img: IMG.ducati, brand: 'Ducati Germany', title: 'Selling a dream to a country of touring bikes.', body: 'Model-specific positioning for three models under one theme for the year: the dream. Cost per lead −43 %, conversion rate +110 % for the overall campaign.', role: 'External creative & strategy consultant' },
        { key: 'tonline', anchor: 'case-tonline', img: IMG.tonline, brand: 't-online', title: 'Trust needs consistency.', body: 'From Telekom portal to independent journalistic brand — built around the value of understanding, not just information.', role: 'Brand management, client side' },
        { key: 'bmw2', anchor: 'case-bmw2', img: IMG.bmw2, brand: 'BMW 2 Series', title: 'A car built for America, made to matter in Germany.', body: 'Don’t launch a new car — continue a legend: a US-led product repositioned as heir to the BMW 2002.', role: 'Art Director, German adaptation' },
        { key: 'db', anchor: 'case-db', img: IMG.db, brand: 'Deutsche Bahn', title: 'Jobs shown as they really are.', body: 'An audience analysis showed that apprentices need to be addressed differently. The result: a dedicated, younger design variant of the employer brand.', role: 'Senior Art Director, lead of the art team' },
      ],
      expLabel: '(03) experience',
      exp: [
        'Strategy and creative work from one source: creative concept and campaign strategy for Union Investment, positioning for Ducati, brand management for t-online.',
        'Both sides of the table: agencies such as Serviceplan, thjnk and GGH MullenLowe — and in-house brand management at Ströer Content Group.',
      ],
    },
  },
};

export const ui = {
  de: {
    navHome: 'portfolio', navArt: 'art direction', navCd: 'creative direction', navStrategy: 'creative strategy', navContact: 'kontakt',
    role: 'Rolle', seeCase: 'Case ansehen', also: '(04) auch', alsoIntro: 'Drei Rollen, eine durchgängige Kompetenz – von der Strategie über die Idee bis zur Umsetzung.',
    contactLabel: '(05) kontakt', contactH: 'Sprechen wir über Ihr Projekt.', contactLead: 'Freelance als Art Director, Creative Director oder Creative Strategist. Vollständige Case-Präsentationen und Referenzen auf Anfrage.',
    email: 'e-mail', phone: 'telefon', profile: 'profil', allWork: 'Alle Arbeiten ansehen', imprint: 'Impressum', footer: 'Markus Kriesmair — Portfolio 2026', langLabel: 'Sprache',
    names: { art: 'Art Direction', cd: 'Creative Direction', strategy: 'Creative Strategy' },
  },
  en: {
    navHome: 'portfolio', navArt: 'art direction', navCd: 'creative direction', navStrategy: 'creative strategy', navContact: 'contact',
    role: 'Role', seeCase: 'See the case', also: '(04) also', alsoIntro: 'Three roles, one continuous skill — from strategy to idea to delivery.',
    contactLabel: '(05) contact', contactH: 'Let’s talk about your project.', contactLead: 'Freelance as Art Director, Creative Director or Creative Strategist. Full case decks and references on request.',
    email: 'email', phone: 'phone', profile: 'profile', allWork: 'See all work', imprint: 'Imprint', footer: 'Markus Kriesmair — Portfolio 2026', langLabel: 'Language',
    names: { art: 'Art Direction', cd: 'Creative Direction', strategy: 'Creative Strategy' },
  },
} as const;
