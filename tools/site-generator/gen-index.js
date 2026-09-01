const fs = require('fs');
const path = require('path');

const ROOT = 'C:\\Users\\felipefreitas_trajet\\Desktop\\COSTA LVM HOME SERVICE';
const SITE = path.join(ROOT, 'site');
const manifest = JSON.parse(
  fs.readFileSync(path.join(SITE, 'assets', 'img', 'gallery', 'manifest.json'), 'utf8')
);

const SITE_URL = 'https://costalvmhomeservice.com';
const PHONE_DISPLAY = '(551) 508-3606';
const PHONE_HREF = '+15515083606';
const EMAIL = 'contact@costalvmhomeservice.com';
const WEB3FORMS_ACCESS_KEY = '65ccf5e7-7263-4915-bcfd-96dcea32afcf';
const GTM_ID = 'GTM-5KW7DQSS';
const TS_URL = 'https://eusouts.com/';

const TOWNS = ['Barnstable', 'Yarmouth', 'Dennis', 'Brewster', 'Harwich', 'Chatham',
  'Orleans', 'Eastham', 'Mashpee', 'Sandwich', 'Falmouth', 'Bourne', 'Plymouth'];

const GROUP = {
  'bathroom-remodel': { key: 'bathrooms', label: 'Bathrooms' },
  'kitchen-remodel': { key: 'kitchens', label: 'Kitchens' },
  'kitchen-cabinets': { key: 'kitchens', label: 'Kitchens' },
  'finish-carpentry': { key: 'carpentry', label: 'Carpentry & built-ins' },
  'interior-painting': { key: 'painting', label: 'Painting' },
  'windows-doors': { key: 'doors', label: 'Windows & doors' },
  'interior-remodel': { key: 'interiors', label: 'Full interiors' },
};

const ALT = {
  'bathroom-remodel': (b) => b
    ? 'Cape Cod bathroom photographed before renovation by COSTA LVM Home Service'
    : 'Completed bathroom remodel on Cape Cod by COSTA LVM Home Service',
  'kitchen-remodel': (b) => b
    ? 'Cape Cod kitchen photographed before renovation by COSTA LVM Home Service'
    : 'Completed kitchen remodel on Cape Cod by COSTA LVM Home Service',
  'kitchen-cabinets': () => 'Kitchen cabinet installation in progress on Cape Cod by COSTA LVM Home Service',
  'finish-carpentry': () => 'Custom built-ins and finish carpentry on Cape Cod by COSTA LVM Home Service',
  'interior-painting': () => 'Interior painting with floors and furniture fully protected by COSTA LVM Home Service',
  'windows-doors': () => 'Interior door and window trim installation on Cape Cod by COSTA LVM Home Service',
  'interior-remodel': (b) => b
    ? 'Cape Cod interior photographed before renovation by COSTA LVM Home Service'
    : 'Completed interior remodel on Cape Cod by COSTA LVM Home Service',
};

const bySlug = Object.fromEntries(manifest.map((m) => [m.slug, m]));

/* ---------------- shared bits ---------------- */

const ARROW =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';

const CHECK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

/* The band under the hero. Each icon is drawn for its own claim rather than
   reusing one generic tick. */
const TRUST = [
  {
    label: '20 years of local experience',
    // award medal: the claim is time served, so a medal reads faster than a calendar
    icon: '<circle cx="12" cy="8.5" r="5.5"/><path d="M8.4 13.6 7.2 22 12 19.2 16.8 22l-1.2-8.4"/>',
  },
  {
    label: 'Fully insured',
    // shield with a tick
    icon: '<path d="M12 21.6s7.2-3.6 7.2-9V5.2L12 2.4 4.8 5.2v7.4c0 5.4 7.2 9 7.2 9Z"/><path d="m9.2 11.8 2 2 3.6-3.6"/>',
  },
  {
    label: 'Family-owned',
    // a roof with a heart under it
    icon: '<path d="M3.2 10.4 12 3.2l8.8 7.2"/><path d="M5.4 9.4V21h13.2V9.4"/><path d="M12 18.4c-1.5-1.1-3-2.1-3-3.3 0-1.3 1.5-2.2 3-.9 1.5-1.3 3-.4 3 .9 0 1.2-1.5 2.2-3 3.3Z"/>',
  },
  {
    label: 'We clean up after ourselves',
    // sparkles: the finished-and-spotless promise
    icon: '<path d="M10 2.8l1.5 4.1 4.1 1.5-4.1 1.5L10 14l-1.5-4.1L4.4 8.4l4.1-1.5L10 2.8Z"/><path d="M17.6 14.2l.85 2.35 2.35.85-2.35.85-.85 2.35-.85-2.35-2.35-.85 2.35-.85.85-2.35Z"/>',
  },
];

function trustBand() {
  return `    <section class="trust-band" aria-label="What you get with COSTA LVM">
      <div class="container">
        <ul class="trust-band__list">
${TRUST.map(
  (t) => `          <li>
            <span class="trust-band__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${t.icon}</svg></span>
            <span>${t.label}</span>
          </li>`
).join('\n')}
        </ul>
      </div>
    </section>`;
}

function btn(href, label, variant = 'primary', attrs = '') {
  return `<a class="btn btn--${variant}" href="${href}"${attrs}>${label}<span class="btn__badge">${ARROW}</span></a>`;
}

function estimatePath(prefix = '') {
  return prefix ? `${prefix}estimate/` : '/estimate/';
}

function gtmHead() {
  return `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>
<!-- End Google Tag Manager -->`;
}

function gtmNoScript() {
  return `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
}

function img(slug, { sizes, loading = 'lazy', fetchpriority, prefix = '' }) {
  const m = bySlug[slug];
  if (!m) throw new Error('unknown asset: ' + slug);
  const base = prefix + 'assets/img/gallery/';
  const srcset = m.srcset.map((s) => `${base}${s.file} ${s.w}w`).join(', ');
  const largest = m.srcset[m.srcset.length - 1];
  const h = Math.round((largest.w / m.natural.w) * m.natural.h);
  return `<img src="${base}${largest.file}" srcset="${srcset}" sizes="${sizes}"
        width="${largest.w}" height="${h}" alt="${ALT[m.category](m.before)}"
        loading="${loading}" decoding="async"${fetchpriority ? ` fetchpriority="${fetchpriority}"` : ''}>`;
}

function stockImg(slug, alt, sizes, prefix = '') {
  const base = prefix + 'assets/img/services/';
  const srcset = [480, 960, 1440].map((w) => `${base}${slug}-${w}.webp ${w}w`).join(', ');
  return `<img src="${base}${slug}-960.webp" srcset="${srcset}" sizes="${sizes}"
          width="1440" height="1080" alt="${alt}" loading="lazy" decoding="async">`;
}

/* ---------------- services (copy verbatim from the approved one-pager) --------------- */

/* `blurb` is verbatim from the client-approved one-pager. `highlights` are
   lifted from the bullets already published on /services/ — no new capability
   is claimed anywhere in this array. */
const SERVICES = [
  { id: 'bathroom-remodeling', name: 'Bathroom Remodeling',
    blurb: 'Turnkey bathroom updates, tile installations, modern layout redesigns, and fixture replacements.',
    highlights: [
      'Waterproofed, tiled walk-in showers',
      'Custom niches, benches and built-in linen storage',
      'Vanities, countertops, mirrors and fixtures',
    ],
    media: { type: 'photo', slug: 'bathroom-remodel-31' } },
  { id: 'kitchen-remodel', name: 'Kitchen Remodel',
    blurb: 'Full kitchen transformations, layout enhancements, tile backsplashes, and functional upgrades.',
    highlights: [
      'Cabinet installation, islands and peninsulas',
      'Countertops and tile backsplashes',
      'Layout changes and opening walls to living space',
    ],
    media: { type: 'photo', slug: 'kitchen-remodel-06' } },
  { id: 'interior-finish-carpentry', name: 'Interior Finish Carpentry',
    blurb: 'Millimeter-precise crown molding, baseboards, wainscoting, trim work, and custom architectural details.',
    highlights: [
      'Built-in shelving, bookcases and window seats',
      'Fireplace mantels and wood slat accent walls',
      'Crown molding, baseboards, casing and stairs',
    ],
    media: { type: 'photo', slug: 'finish-carpentry-15' } },
  { id: 'kitchen-cabinets', name: 'Kitchen Cabinets',
    blurb: 'Professional cabinet installation, custom shelving solutions, and precision hardware alignment.',
    highlights: [
      'Stock, semi-custom and supplied cabinetry',
      'Fillers, end panels and scribed crown returns',
      'Precision door, drawer and hardware alignment',
    ],
    media: { type: 'photo', slug: 'kitchen-remodel-04' } },
  { id: 'windows-and-doors', name: 'Windows and Doors Installation',
    blurb: 'Energy-efficient interior door replacements, entry door upgrades, and precision window installations.',
    highlights: [
      'Interior door replacement, hung and trimmed',
      'Entry and exterior door upgrades',
      'Window installation with interior and exterior trim',
    ],
    media: { type: 'photo', slug: 'finish-carpentry-02' } },
  { id: 'interior-painting', name: 'Interior Painting',
    blurb: 'Smooth, crisp interior painting with complete wall preparation and full furniture protection.',
    highlights: [
      'Fill, sand, caulk and prime before any paint opens',
      'Complete floor and furniture protection',
      'Walls, ceilings, trim, doors and closets',
    ],
    media: { type: 'photo', slug: 'interior-remodel-04' } },
  { id: 'exterior-painting', name: 'Exterior Painting',
    blurb: 'Weather-resistant exterior paint applications tailored to withstand coastal salt air and severe winter weather.',
    highlights: [
      'Scraping, sanding and spot-priming of bare wood',
      'Coatings rated for coastal salt-air exposure',
      'Clapboard, shingle, trim, soffits and railings',
    ],
    media: { type: 'stock', slug: 'exterior-painting', alt: 'Exterior house painting on a residential wall' } },
  { id: 'power-washing', name: 'Power Washing',
    blurb: 'High-pressure exterior cleaning to restore siding, decks, driveways, walkways, and patios.',
    highlights: [
      'Siding, clapboard and shingle',
      'Decks, porches, driveways and patios',
      'Pressure matched to the material, so cedar is safe',
    ],
    media: { type: 'stock', slug: 'power-washing', alt: 'Power washing white clapboard siding on a house exterior' } },
  { id: 'house-cleaning', name: 'House Cleaning',
    blurb: 'Thorough deep cleaning, post-construction dust elimination, and routine turnover cleaning for homes and rentals.',
    highlights: [
      'Post-construction dust removal and deep clean',
      'Seasonal rental and turnover cleaning',
      'Included at no extra charge on every project we build',
    ],
    media: { type: 'photo', slug: 'interior-remodel-03' } },
];

const REASONS = [
  { icon: '<path d="M12 2 3 7v6c0 5 3.8 8.4 9 9 5.2-.6 9-4 9-9V7Z"/><path d="m9 12 2 2 4-4"/>',
    title: '20 years of local experience',
    body: 'Proven expertise in handling Cape Cod properties with superior craftsmanship.' },
  { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    title: 'Fully insured for your protection',
    body: 'Complete peace of mind knowing your home and assets are fully protected.' },
  { icon: '<path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-6h6v6"/>',
    title: 'Unmatched property respect',
    body: 'We cover floors, protect furniture, and maintain an organized, safe work environment.' },
  { icon: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/>',
    // non-breaking hyphens: at card width it was breaking as "All-in-" / "one solution"
    title: 'All&#8209;in&#8209;one solution',
    body: 'No need to hire separate cleaning crews, we build, remodel, and clean up thoroughly before handing over the keys.' },
  /* "Flexible operating hours" was the fifth approved bullet. Dropped here at
     the client's request for a four-card row — it is the only one of the five
     already stated elsewhere on the page (footer, contact block and FAQ all
     carry the Mon–Sat 7–6 hours), so nothing is lost from the site. */
];

/* `head` renders white, `tail` picks up the gold italic treatment — the split
   the client's new How-it-works reference uses on every step title. */
const STEPS = [
  { head: 'Initial quote', tail: '& planning',
    body: 'Contact us to discuss your goals, receive expert guidance, and get an accurate project estimate.' },
  { head: 'Site preparation', tail: '& protection',
    body: 'We set up protective floor coverings and shield your furniture before tools ever touch the space.' },
  { head: 'Expert', tail: 'tradeswork',
    body: 'Our experienced crew executes your carpentry, painting, remodeling, or installation project with high precision.' },
  { head: 'Post-job', tail: 'deep clean',
    body: 'We finish every project with a thorough interior clean, leaving your home spotless and ready to enjoy.' },
];

const FAQS = [
  { q: 'How do you prevent construction dust and paint fumes from spreading through the house?',
    a: 'We build containment barriers, seal off HVAC vents in active work zones, and cover all flooring and furniture with heavy-duty protective sheeting before work begins. Because we provide integrated house cleaning, our crew performs a thorough post-construction cleanup and dust removal service before turning the space back over to you.' },
  { q: 'Can I hire one team for remodeling, interior painting, and post-job cleaning?',
    a: 'Yes. One of our key advantages in Cape Cod is combining trades - such as finish carpentry, window and door installation, and interior painting - with professional house cleaning. This eliminates the hassle and added cost of hiring and scheduling multiple separate subcontractors.' },
  { q: 'How long does a kitchen or bathroom remodel usually take on a Cape Cod rental or investment property?',
    a: 'Timelines depend on the scope of work and custom orders, but our integrated crew streamlines execution by managing the demo, cabinetry installation, painting, and final deep clean under one team. We offer flexible scheduling, extended hours, and Saturday service to help realtors and investors hit tight listing or rental turnaround dates.' },
  { q: 'What is the best time of year to power wash and paint a house exterior in Cape Cod?',
    a: 'Late spring through autumn provides the ideal humidity and temperature windows for exterior painting and power washing on the Cape. We use weather-resistant exterior paints engineered specifically to withstand coastal salt air, moisture, and harsh New England winter freeze-thaw cycles.' },
  { q: 'Do you handle small interior updates like trim, crown molding, and door replacements?',
    a: 'Absolutely. Our interior finish carpentry covers everything from custom kitchen cabinets and crown molding to interior door replacements, wainscoting, and window trims. No project is too detailed for our 20 years of hands-on experience.' },
];

/* ---------------- gallery ---------------- */

/* Curated from the 2026-09-01 photo audit. The first batch deliberately includes
   before/after material so the transformation story appears before any click. */
const CURATED_GALLERY_SLUGS = [
  'kitchen-remodel-01-before',
  'kitchen-remodel-06',
  'kitchen-remodel-02-before',
  'kitchen-remodel-04',
  'bathroom-remodel-07-before',
  'bathroom-remodel-12',
  'bathroom-remodel-22-before',
  'bathroom-remodel-26',
  'finish-carpentry-15',
  'bathroom-remodel-34',
  'bathroom-remodel-09',
  'interior-remodel-03',
  'bathroom-remodel-11',
  'bathroom-remodel-31',
  'interior-remodel-04',
  'bathroom-remodel-10',
  'bathroom-remodel-14',
  'bathroom-remodel-15',
  'bathroom-remodel-17',
  'bathroom-remodel-30',
  'finish-carpentry-02',
  'finish-carpentry-03',
  'finish-carpentry-06',
  'kitchen-remodel-05',
  'bathroom-remodel-08-before',
];

const galleryItems = CURATED_GALLERY_SLUGS.map((slug) => {
  const item = bySlug[slug];
  if (!item) throw new Error('curated gallery asset missing: ' + slug);
  return item;
});

const groupsPresent = [];
for (const m of galleryItems) {
  const g = GROUP[m.category];
  if (!groupsPresent.some((x) => x.key === g.key)) groupsPresent.push(g);
}

const galleryHTML = galleryItems
  .map((m) => {
    const g = GROUP[m.category];
    return `        <figure data-category="${g.key}">
          ${img(m.slug, { sizes: '(min-width:1100px) 285px, (min-width:700px) 33vw, 50vw' })}
          ${m.before ? '<figcaption>Before</figcaption>' : ''}
        </figure>`;
  })
  .join('\n');

const filtersHTML = [{ key: 'all', label: 'All work' }, ...groupsPresent]
  .map(
    (g, i) =>
      `        <button type="button" class="filter-btn" data-filter="${g.key}" aria-pressed="${i === 0}">${g.label}</button>`
  )
  .join('\n');

/* ---------------- structured data ---------------- */

const business = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  '@id': SITE_URL + '/#business',
  name: 'COSTA LVM Home Service',
  url: SITE_URL + '/',
  telephone: PHONE_DISPLAY,
  email: EMAIL,
  image: SITE_URL + '/assets/img/logo/logo-color.webp',
  logo: SITE_URL + '/assets/img/logo/logo-color.webp',
  description:
    'Family-owned carpentry, remodeling, painting and cleaning company serving Cape Cod homeowners, realtors and property managers. 20 years of experience, fully insured.',
  founder: { '@type': 'Person', name: 'Marco Aurelio' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'West Yarmouth',
    addressRegion: 'MA',
    addressCountry: 'US',
  },
  areaServed: TOWNS.map((t) => ({
    '@type': 'City',
    name: t,
    address: { '@type': 'PostalAddress', addressRegion: 'MA', addressCountry: 'US' },
  })),
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '07:00',
      closes: '18:00',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Remodeling, painting and home care services',
    itemListElement: SERVICES.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name, description: s.blurb },
    })),
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/* ---------------- chrome ---------------- */

const NAV = [
  ['#services', 'Services'],
  ['#why-us', 'Why us'],
  ['#process', 'Process'],
  ['#work', 'Our work'],
  ['#faq', 'FAQ'],
];

function header(prefix = '') {
  return `  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header" id="site-header">
    <div class="container">
      <div class="site-header__pill">
        <a class="site-logo" href="${prefix || '/'}" aria-label="COSTA LVM Home Service - home">
          <img src="${prefix}assets/img/logo/logo-white.webp" alt="COSTA LVM Home Service" width="78" height="38">
        </a>

        <div class="site-header__nav" id="site-nav">
          <ul class="nav">
${NAV.map(([h, l]) => `            <li><a href="${prefix}${h}">${l}</a></li>`).join('\n')}
            <li><a href="${prefix}services/">All services</a></li>
            <li><a href="${estimatePath(prefix)}">Free estimate</a></li>
            <li><a href="tel:${PHONE_HREF}">${PHONE_DISPLAY}</a></li>
          </ul>
        </div>

        <div class="header-cta">
          ${btn(estimatePath(prefix), 'Free estimate')}
        </div>

        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">
          <svg class="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
    </div>
  </header>`;
}

function footer(prefix = '') {
  return `  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-logo">
          <img src="${prefix}assets/img/logo/logo-white.webp" alt="COSTA LVM Home Service" width="90" height="44">
          <p>Family-owned carpentry, remodeling, painting and cleaning across Cape Cod. Twenty years of hands-on experience, fully insured.</p>
        </div>

        <div>
          <h3>Services</h3>
          <ul>
${SERVICES.slice(0, 5).map((s) => `            <li><a href="${prefix}services/#${s.id}">${s.name}</a></li>`).join('\n')}
            <li><a href="${prefix}services/">All nine services</a></li>
          </ul>
        </div>

        <div>
          <h3>Company</h3>
          <ul>
            <li><a href="${prefix}#about">About us</a></li>
            <li><a href="${prefix}#work">Our work</a></li>
            <li><a href="${prefix}#faq">FAQ</a></li>
            <li><a href="${estimatePath(prefix)}">Free estimate</a></li>
            <li><a href="${prefix}privacy/">Privacy</a></li>
            <li><a href="${prefix}terms/">Terms</a></li>
          </ul>
        </div>

        <div>
          <h3>Get in touch</h3>
          <address>
            <ul>
              <li><a href="tel:${PHONE_HREF}">${PHONE_DISPLAY}</a></li>
              <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
              <li>West Yarmouth, Massachusetts</li>
              <li>Mon&ndash;Sat, 7:00&nbsp;am &ndash; 6:00&nbsp;pm</li>
            </ul>
          </address>
        </div>
      </div>

      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} COSTA LVM Home Service. All rights reserved.</span>
        <span>Serving ${TOWNS.slice(0, 6).join(', ')} and the wider Cape.</span>
        <span>Site by <a href="${TS_URL}" target="_blank" rel="noopener">Eu sou TS</a></span>
      </div>
    </div>
  </footer>

  <nav class="mobile-bar" aria-label="Quick contact">
    <a class="btn btn--ghost" href="tel:${PHONE_HREF}" aria-label="Call COSTA LVM Home Service on ${PHONE_DISPLAY}">Call now</a>
    <a class="btn btn--primary" href="${estimatePath(prefix)}">Free estimate</a>
  </nav>

  <script src="${prefix}assets/js/main.js" defer></script>`;
}

function head({ title, description, canonical, prefix = '', schema = [], extraHead = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${gtmHead()}
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="COSTA LVM Home Service">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE_URL}/assets/img/gallery/kitchen-remodel-06-1440.webp">
<meta name="twitter:card" content="summary_large_image">

<link rel="preload" href="${prefix}assets/fonts/poppins-700-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${prefix}assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${prefix}assets/fonts/poppins-300-italic-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${prefix}assets/css/main.css">
<link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#0a0908">
${extraHead}

${schema.map((s) => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n')}
</head>
<body>
${gtmNoScript()}
`;
}

function estimateForm({ extra = false, source = 'Home estimate form' } = {}) {
  return `<form id="estimate-form" action="https://api.web3forms.com/submit" method="POST" novalidate>
                <input type="hidden" name="access_key" value="${WEB3FORMS_ACCESS_KEY}">
                <input type="hidden" name="subject" value="New estimate request - costalvmhomeservice.com">
                <input type="hidden" name="from_name" value="COSTA LVM website">
                <input type="hidden" name="page_source" value="${source}">
                <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off">

                <div class="field-grid">
                  <div class="field">
                    <label for="name">Name <span class="req" aria-hidden="true">*</span></label>
                    <input id="name" name="name" type="text" placeholder="Your name" autocomplete="name" required aria-describedby="name-error">
                    <p class="field__error" id="name-error"></p>
                  </div>

                  <div class="field">
                    <label for="phone">Phone <span class="req" aria-hidden="true">*</span></label>
                    <input id="phone" name="phone" type="tel" placeholder="(508) 555-0134" autocomplete="tel" required aria-describedby="phone-error">
                    <p class="field__error" id="phone-error"></p>
                  </div>

                  <div class="field">
                    <label for="email">Email <span class="req" aria-hidden="true">*</span></label>
                    <input id="email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required aria-describedby="email-error">
                    <p class="field__error" id="email-error"></p>
                  </div>

                  <div class="field">
                    <label for="zip">ZIP code <span class="req" aria-hidden="true">*</span></label>
                    <input id="zip" name="zip" type="text" placeholder="02673" inputmode="numeric" autocomplete="postal-code" required aria-describedby="zip-error">
                    <p class="field__error" id="zip-error"></p>
                  </div>

                  <div class="field field--full">
                    <label for="service">What do you need? <span class="req" aria-hidden="true">*</span></label>
                    <select id="service" name="service" required aria-describedby="service-error">
                      <option value="">Choose a service</option>
${SERVICES.map((s) => `                      <option value="${s.name}">${s.name}</option>`).join('\n')}
                      <option value="Something else">Something else</option>
                    </select>
                    <p class="field__error" id="service-error"></p>
                  </div>
${extra ? `
                  <div class="field">
                    <label for="property-type">Property type</label>
                    <select id="property-type" name="property_type">
                      <option value="">Choose if helpful</option>
                      <option>Primary home</option>
                      <option>Seasonal rental</option>
                      <option>Investment property</option>
                      <option>Listing preparation</option>
                      <option>Property managed home</option>
                    </select>
                  </div>

                  <div class="field">
                    <label for="timeline">Ideal timeline</label>
                    <select id="timeline" name="timeline">
                      <option value="">Choose if helpful</option>
                      <option>As soon as possible</option>
                      <option>Within 1-4 weeks</option>
                      <option>Within 1-3 months</option>
                      <option>Flexible timing</option>
                    </select>
                  </div>

                  <div class="field">
                    <label for="town">Project town</label>
                    <input id="town" name="project_town" type="text" placeholder="Yarmouth, Plymouth, Hyannis...">
                  </div>

                  <div class="field">
                    <label for="preferred-contact">Preferred contact</label>
                    <select id="preferred-contact" name="preferred_contact">
                      <option value="">Choose if helpful</option>
                      <option>Phone call</option>
                      <option>Text message</option>
                      <option>Email</option>
                    </select>
                  </div>
` : ''}
                  <div class="field field--full">
                    <label for="details">Project details <span class="req" aria-hidden="true">*</span></label>
                    <textarea id="details" name="details" placeholder="Tell us what you'd like done, and roughly when." required aria-describedby="details-error"></textarea>
                    <p class="field__error" id="details-error"></p>
                  </div>
                </div>

                <div class="btn-row" style="margin-top:var(--sp-4)">
                  <button class="btn btn--primary" type="submit">Send my estimate request<span class="btn__badge">${ARROW}</span></button>
                </div>

                <p class="form-status" id="form-status" role="status" aria-live="polite"></p>
                <p class="form-note">We only use your details to reply about your project. No newsletters, no third parties.</p>
              </form>`;
}

/* ---------------- page ---------------- */

const html = `${head({
  /* Title and description carry the region and an offer, because the job of
     the SERP entry is the click and the job of the page is the conversion.
     Every claim here is verified in project-context.md §2 — 20 years,
     family-owned, fully insured, free estimates, same-day reply. No licence
     number is implied anywhere, because there is not one yet. */
  title: 'Cape Cod Remodeling & Carpentry — Free Estimate | COSTA LVM',
  description:
    'Family-owned, fully insured, 20 years on Cape Cod. Remodels, finish carpentry and post-construction cleanup, Barnstable to Plymouth. Free estimate.',
  canonical: SITE_URL + '/',
  schema: [business, faqSchema],
})}${header()}

  <main id="main">

    <!-- ================= HERO ================= -->
    <section class="hero">
      <div class="hero__media">
        <picture>
          <source media="(max-width: 760px)" srcset="assets/video/hero-poster-mobile.webp">
          <img src="assets/video/hero-poster-desktop.webp" alt="" aria-hidden="true"
               width="1280" height="720" fetchpriority="high" decoding="async">
        </picture>
        <video class="hero__video" id="hero-video" muted loop playsinline preload="none"
               aria-hidden="true" tabindex="-1"
               data-src-desktop="assets/video/hero-desktop.mp4"
               data-src-mobile="assets/video/hero-mobile.mp4"></video>
      </div>
      <div class="hero__scrim"></div>

      <div class="container">
        <div class="hero__copy">
          <h1 class="h-hero">Meticulous carpentry, remodeling &amp; cleaning <span class="gold">across Cape Cod</span></h1>
          <p class="hero__sub">20 years of craftsmanship, family-owned dedication, and total property protection, delivering pristine remodels and spotless finishes from Barnstable to Plymouth.</p>
          <div class="btn-row">
            ${btn(estimatePath(), 'Get your free estimate')}
            ${btn('tel:' + PHONE_HREF, 'Call ' + PHONE_DISPLAY, 'ghost')}
          </div>
        </div>
      </div>
    </section>

${trustBand()}

    <!-- ================= ABOUT (light) ================= -->
    <section class="section section--light" id="about">
      <div class="container">
        <div class="contact-card">
          <div class="about-grid">
            <figure class="about-grid__media">
              ${img('finish-carpentry-02', { sizes: '(min-width:900px) 40vw, 100vw' })}
            </figure>

            <div class="about-grid__text">
              <h2 class="h-section">We treat your house like <span class="gold">someone still lives in it</span></h2>
              <div class="prose">
                <p>COSTA LVM Home Service is a family-owned company built on two decades of hands-on experience in Cape Cod. Led by Marco Aur&eacute;lio, we treat every residence with the utmost respect, care, and attention to detail.</p>
                <p>Unlike contractors who leave dirt and dust behind, we combine skilled finish carpentry and remodeling with professional interior cleanup. We protect your furniture, safeguard your floors, and maintain an organized workspace from start to finish. Whether you are a homeowner upgrading your living space, a realtor preparing a listing, or a property manager maintaining seasonal turnarounds, we deliver reliable results with complete integrity.</p>
              </div>
              <div class="btn-row" style="margin-top:var(--sp-2)">
                ${btn(estimatePath(), 'Schedule a consultation')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= SERVICES (dark + texture) ================= -->
    <section class="section section--texture" id="services" style="--texture:url('/assets/img/texture/texture-slat.webp')">
      <div class="container">
        <div class="section-head section-head--center">
          <h2 class="h-section">Complete remodeling, painting &amp; <span class="gold">home care services</span></h2>
          <p class="lede">Nine trades under one crew, so you are not scheduling four different companies to finish one job.</p>
        </div>
      </div>

      <!-- outside the container on purpose: the track runs edge to edge so the
           neighbouring slides peek properly on both sides -->
      <div class="carousel">
          <div class="carousel__track" id="services-track" tabindex="0" role="group"
               aria-label="Services, use the arrow keys or swipe to browse">
${SERVICES.map((s, i) => {
  const words = s.name.split(' ');
  const tail = words.pop();
  const headWords = words.join(' ');
  const sizes = '(min-width:1100px) 420px, (min-width:780px) 38vw, 90vw';
  return `            <article class="slide" id="slide-${s.id}" aria-roledescription="slide" aria-label="${i + 1} of ${SERVICES.length}: ${s.name}">
              <div class="slide__inner">
                <figure class="slide__media">
                  ${
                    s.media.type === 'photo'
                      ? img(s.media.slug, { sizes })
                      : stockImg(s.media.slug, s.media.alt, sizes)
                  }
                </figure>
                <div class="slide__body">
                  <p class="slide__label">${String(i + 1).padStart(2, '0')} &mdash; Service</p>
                  <h3 class="slide__title">${headWords ? headWords + ' ' : ''}<span class="gold">${tail}</span></h3>
                  <div class="slide__claim">
                    <span class="slide__check">${CHECK}</span>
                    <p>${s.blurb}</p>
                  </div>
                  <ul class="slide__list">
${s.highlights.map((h) => `                    <li>${CHECK}<span>${h}</span></li>`).join('\n')}
                  </ul>
                  <a class="slide__more" href="services/#${s.id}">Read more ${ARROW}</a>
                </div>
              </div>
            </article>`;
}).join('\n')}
          </div>

          <button class="carousel__nav carousel__nav--prev" type="button" data-dir="-1" aria-label="Previous service">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button class="carousel__nav carousel__nav--next" type="button" data-dir="1" aria-label="Next service">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
          </button>
      </div>

      <div class="container">
        <div class="carousel__controls">
          <button class="carousel__play" id="services-play" type="button" aria-label="Pause the services carousel">
            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/></svg>
            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z"/></svg>
          </button>

          <div class="carousel__dots" id="services-dots">
${SERVICES.map(
  (s, i) =>
    `            <button class="carousel__dot" type="button" data-index="${i}" aria-label="Go to ${s.name}"${i === 0 ? ' aria-current="true"' : ''}></button>`
).join('\n')}
          </div>
        </div>

        <div class="btn-row btn-row--center" style="margin-top:var(--sp-5)">
          ${btn(estimatePath(), 'Request a custom quote')}
          ${btn('services/', 'See all nine services', 'ghost')}
        </div>
      </div>
    </section>

    <!-- ================= WHY US (light) ================= -->
    <section class="section section--light" id="why-us">
      <div class="container">
        <div class="section-head section-head--center">
          <h2 class="h-section">Why Cape Cod homeowners &amp; real estate investors <span class="gold">choose COSTA LVM</span></h2>
        </div>

        <div class="reasons">
${REASONS.map(
  (r) => `          <div class="card reason">
            <span class="reason__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${r.icon}</svg></span>
            <h3 class="h-card">${r.title}</h3>
            <p>${r.body}</p>
          </div>`
).join('\n')}
        </div>

        <div class="btn-row btn-row--center" style="margin-top:var(--sp-5)">
          ${btn(estimatePath(), 'Book your project today')}
        </div>
      </div>
    </section>

    <!-- ================= PROCESS (dark + texture) ================= -->
    <section class="section section--texture" id="process" style="--texture:url('/assets/img/texture/texture-oak.webp')">
      <div class="container">
        <div class="section-head section-head--center">
          <h2 class="h-section">Simple, seamless execution.<br><span class="gold">And a spotless house at the end.</span></h2>
          <p class="lede">No juggling four subcontractors and no dust left in the vents. One crew, start to finish.</p>
        </div>

        <ol class="steps">
${STEPS.map(
  (s, i) => `          <li class="step">
            <div class="step__rail">
              <span class="step__num" aria-hidden="true">${i + 1}</span>
              <span class="step__track" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
              </span>
            </div>
            <h3 class="step__title"><span class="visually-hidden">Step ${i + 1}: </span>${s.head} <span class="gold">${s.tail}</span></h3>
            <p>${s.body}</p>
          </li>`
).join('\n')}
        </ol>

        <div class="btn-row btn-row--center" style="margin-top:var(--sp-5)">
          ${btn(estimatePath(), 'Start your transformation')}
        </div>
      </div>
    </section>

    <!-- ================= WORK (light) ================= -->
    <section class="section section--light" id="work">
      <div class="container">
        <div class="section-head section-head--center">
          <h2 class="h-section">Proven results across <span class="gold">Cape Cod communities</span></h2>
          <p class="lede">Every photograph below is our own work on a real Cape Cod property.</p>
        </div>

        <div class="gallery-filters" role="group" aria-label="Filter projects by type">
${filtersHTML}
        </div>

        <p class="eyebrow eyebrow--plain gallery-count" id="gallery-count" aria-live="polite"></p>

        <div class="gallery" id="gallery">
${galleryHTML}
        </div>

        <div class="gallery-more">
          <button class="btn btn--ghost" type="button" id="gallery-more">Show more photos<span class="btn__badge">${ARROW}</span></button>
        </div>

        <div class="btn-row btn-row--center" style="margin-top:var(--sp-5)">
          ${btn(estimatePath(), 'Get results like this')}
        </div>
      </div>
    </section>

    <!-- ================= FAQ (dark + texture) ================= -->
    <section class="section section--texture" id="faq" style="--texture:url('/assets/img/texture/texture-tile.webp')">
      <div class="container">
        <div class="section-head section-head--center">
          <h2 class="h-section">What people ask <span class="gold">before they hire us</span></h2>
        </div>

        <div class="faq" style="margin-inline:auto">
${FAQS.map(
  (f) => `          <details>
            <summary>${f.q}<span class="faq__icon" aria-hidden="true"></span></summary>
            <div class="faq__answer">${f.a}</div>
          </details>`
).join('\n')}
        </div>

        <div class="btn-row btn-row--center" style="margin-top:var(--sp-5)">
          ${btn(estimatePath(), 'Have more questions? Contact us')}
        </div>
      </div>
    </section>

    <!-- ================= AREAS + FORM (light) ================= -->
    <section class="section section--light" id="estimate">
      <div class="container">
        <div class="contact-card">
          <div class="contact-grid">
            <div>
              <h2 class="h-section">Tell us about the project.<br><span class="gold">We reply the same day.</span></h2>
              <figure class="contact-map">
                <!-- The region, not a pin. This is a service-area business with no
                     public address, so the map shows coverage rather than a location. -->
                <iframe
                  src="https://maps.google.com/maps?q=Cape+Cod%2C+Massachusetts&amp;z=9&amp;hl=en&amp;output=embed"
                  title="Map of the Cape Cod area served by COSTA LVM Home Service, from Plymouth across to Chatham"
                  loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                <figcaption>${TOWNS.join(' &middot; ')} &mdash; all in Massachusetts.</figcaption>
              </figure>
            </div>

            <div>
              ${estimateForm()}
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>

${footer()}
</body>
</html>
`;

fs.writeFileSync(path.join(SITE, 'index.html'), html);
console.log('index.html -', (html.length / 1024).toFixed(1), 'KB |', galleryItems.length, 'gallery figures');

module.exports = { head, header, footer, btn, img, stockImg, estimateForm, estimatePath,
  bySlug, ARROW, CHECK, SERVICES, FAQS, SITE_URL, PHONE_DISPLAY, PHONE_HREF, EMAIL, TOWNS };
