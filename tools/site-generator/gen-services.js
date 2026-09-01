const fs = require('fs');
const path = require('path');
const base = require('./gen-index.js');

const { head, header, footer, btn, estimateForm, ARROW, CHECK, SITE_URL, PHONE_HREF, PHONE_DISPLAY, EMAIL, TOWNS, FAQS, img, stockImg } = base;

const ROOT = 'C:\\Users\\felipefreitas_trajet\\Desktop\\COSTA LVM HOME SERVICE';
const SITE = path.join(ROOT, 'site');

/* Expanded copy. Grounded in the client's approved one-pager and in the photographed
   work. No claim here goes beyond what the client has stated or the photos show. */

const DETAIL = [
  {
    id: 'bathroom-remodeling',
    name: 'Bathroom Remodeling',
    media: { type: 'photo', slug: 'bathroom-remodel-12' },
    body: [
      'A Cape Cod bathroom has to cope with salt air, damp winters and, on a rental property, a whole season of hard use in twelve weeks. We rebuild them so they hold up. That means waterproofing behind the tile, a shower pan that drains where it should, and niches and benches framed into the wall rather than screwed onto it afterwards.',
      'Most of the bathrooms we are called into started as dated rooms with beige tile, a builder vanity and a tub nobody uses. The value is usually in the layout: taking out the tub for a walk-in shower, or turning a shallow closet into built-in storage that actually fits towels. We handle demolition, framing, tile, vanity, fixtures and trim, then clean the room before you see it.',
    ],
    bullets: [
      'Full demolition and rebuild',
      'Waterproofed, tiled walk-in showers',
      'Custom niches, benches and built-in linen storage',
      'Vanities, countertops, mirrors and fixtures',
      'Tile and luxury vinyl floors',
      'Post-construction deep clean included',
    ],
  },
  {
    id: 'kitchen-remodel',
    name: 'Kitchen Remodel',
    media: { type: 'photo', slug: 'kitchen-remodel-06' },
    body: [
      'Kitchens are the job where sequencing matters most, because every trade waits on the one before it. Running the carpentry, the painting and the final clean with one crew is what keeps a kitchen from sitting half-finished for three weeks while you wash dishes in the bathroom.',
      'We take kitchens from demolition through to the last piece of trim: cabinets set and shimmed level, countertops templated and fitted, backsplash tiled, appliances placed, crown returns cut to the ceiling line. If the layout is wrong, we say so before the order goes in &mdash; moving a peninsula or opening a wall to the living room is often worth more than upgrading the cabinet doors.',
    ],
    bullets: [
      'Layout changes and opening walls to living space',
      'Cabinet installation, islands and peninsulas',
      'Countertops and tile backsplashes',
      'Crown molding, light rail and toe-kick detail',
      'Flooring and trim to match the rest of the house',
      'Full clean-down before handover',
    ],
  },
  {
    id: 'interior-finish-carpentry',
    name: 'Interior Finish Carpentry',
    media: { type: 'photo', slug: 'finish-carpentry-15' },
    body: [
      'Finish carpentry is the trade the rest of the house is judged by. It is also the one where the difference between good and average is a couple of millimetres at every joint &mdash; a mitre that stays closed through a Cape winter, a reveal that runs the same width the length of a wall, a scribe cut to a plaster wall that was never straight to begin with.',
      'This is where Marco started, and it is still the work we are known for. Window benches with drawers under the seat, recessed bookcases built into the stud bay, fireplace mantels, wood slat accent walls, shiplap, wainscoting, staircases, crown and base. If you have an awkward corner and a rough idea, that is usually enough for us to price it.',
    ],
    bullets: [
      'Custom built-in shelving and bookcases',
      'Window seats and benches with concealed storage',
      'Fireplace mantels and surrounds',
      'Wood slat accent walls, shiplap and wainscoting',
      'Crown molding, baseboards, casing and window trim',
      'Stairs, treads and railings',
    ],
  },
  {
    id: 'kitchen-cabinets',
    name: 'Kitchen Cabinets',
    media: { type: 'photo', slug: 'kitchen-remodel-04' },
    body: [
      'Cabinets are only as good as the install. A run of boxes that is a quarter-inch out of level will show on every door gap along the wall, and no amount of hardware adjustment hides it. We set a laser line, shim off the high point of the floor, and fasten into studs before a single door goes back on.',
      'We install stock, semi-custom and supplier-provided cabinetry, fit fillers and end panels so nothing reads as a gap, align every pull and knob off the same jig, and scribe the crown to a ceiling that is rarely as flat as it looks. If you have already bought cabinets from a supplier, we are happy to be the crew that hangs them properly.',
    ],
    bullets: [
      'Installation of stock, semi-custom and supplied cabinetry',
      'Islands, peninsulas and tall pantry runs',
      'Fillers, end panels and scribed crown returns',
      'Precision door, drawer and hardware alignment',
      'Custom open shelving and pantry fit-outs',
      'Removal and disposal of the old kitchen',
    ],
  },
  {
    id: 'windows-and-doors',
    name: 'Windows and Doors Installation',
    media: { type: 'photo', slug: 'finish-carpentry-02' },
    body: [
      'Doors and windows are carpentry problems disguised as product purchases. An interior door that binds in August and rattles in February was hung out of plumb, not built wrong. We hang doors to the jamb rather than to the wall, shim the hinge side true, and set the reveal even top to bottom before the casing goes on.',
      'On windows, the detail that matters on the Cape is what happens at the trim and the sill &mdash; where wind-driven rain and salt air get in if the flashing and the caulk line are sloppy. We replace interior doors, upgrade entry doors, and install and trim windows, then paint or stain the casing to match the rest of the room.',
    ],
    bullets: [
      'Interior door replacement, hung and trimmed',
      'Entry and exterior door upgrades',
      'Window installation with interior and exterior trim',
      'Casing, jamb extensions and sill detail',
      'Hardware, locksets and weatherstripping',
      'Paint or stain finish to match the room',
    ],
  },
  {
    id: 'interior-painting',
    name: 'Interior Painting',
    media: { type: 'photo', slug: 'interior-remodel-04' },
    body: [
      'Most of a good paint job happens before any paint is opened. We fill, sand and caulk first, mask the floors and cover the furniture, tape off the trim line, and only then start cutting in. Sprayed work gets full containment so the dust and overspray stay in the room they belong in.',
      'Because we also do the cleaning, the end of a paint job looks different from what most homeowners are used to: tape pulled while the paint is still workable so the line stays sharp, plastic and drop cloths bagged out, and the floors vacuumed and wiped before we leave. Ceilings, walls, trim, doors and closets &mdash; and we will tell you honestly when a room needs primer rather than a third coat.',
    ],
    bullets: [
      'Full surface preparation: fill, sand, caulk and prime',
      'Complete floor and furniture protection',
      'Walls, ceilings, trim, doors and closets',
      'Brush, roller and airless spray application',
      'Containment barriers on occupied houses',
      'Clean, sharp trim lines and a vacuumed room at the end',
    ],
  },
  {
    id: 'exterior-painting',
    name: 'Exterior Painting',
    media: { type: 'stock', slug: 'exterior-painting', alt: 'Exterior house painting on a residential wall' },
    body: [
      'Coastal exposure is hard on paint. Salt air, summer humidity and New England freeze-thaw cycles will find every unsealed end grain and every bare nail head, and a coat applied over a poorly prepared surface will start lifting inside two seasons.',
      'We scrape and sand back to sound material, spot-prime bare wood, re-caulk the joints that have opened, and use exterior products rated for coastal conditions. We paint clapboard, shingle, trim, soffits, doors and railings, and we schedule exterior work for the window where temperature and humidity will let the paint cure properly &mdash; late spring through autumn on the Cape.',
    ],
    bullets: [
      'Scraping, sanding and spot-priming of bare wood',
      'Re-caulking of open joints and trim seams',
      'Weather-resistant coatings rated for coastal exposure',
      'Clapboard, shingle, trim, soffits and railings',
      'Entry doors and shutters',
      'Scheduled for the right cure window, not the first free week',
    ],
  },
  {
    id: 'power-washing',
    name: 'Power Washing',
    media: { type: 'stock', slug: 'power-washing', alt: 'Power washing white clapboard siding on a house exterior' },
    body: [
      'Cape houses grow a green film on the north side whether you like it or not. Power washing takes it off, and it is also the step that decides whether an exterior paint job lasts &mdash; paint will not bond to a surface with mildew still on it.',
      'We wash siding, decks, driveways, walkways, patios and fences, matching the pressure to the material so that soft cedar and older clapboard do not get furred up in the process. On a rental property this is often the single cheapest thing you can do before listing photographs are taken.',
    ],
    bullets: [
      'Siding, clapboard and shingle',
      'Decks, porches and railings',
      'Driveways, walkways and patios',
      'Fences and outdoor structures',
      'Pressure matched to the material',
      'Pre-paint washing as part of an exterior job',
    ],
  },
  {
    id: 'house-cleaning',
    name: 'House Cleaning',
    media: { type: 'photo', slug: 'interior-remodel-03' },
    body: [
      'This is the service that changed how we work. Construction dust does not stay in the room it was made in &mdash; it settles on top of door casings, inside light fixtures and in the tracks of every window, and a general contractor who hands the keys back at that point has left you half a job.',
      'Our crew does a full post-construction clean at the end of every project: dust removal from every horizontal surface, fixtures and vents wiped, floors vacuumed and washed, windows and tracks cleaned. We also take on standalone deep cleans and rental turnovers, which is what most property managers on the Cape actually call us for between bookings.',
    ],
    bullets: [
      'Post-construction dust removal and deep clean',
      'Seasonal rental and turnover cleaning',
      'Fixtures, vents, casings and window tracks',
      'Floors vacuumed and washed',
      'Move-in and move-out cleans',
      'Included at no extra charge on every project we build',
    ],
  },
];

/* ---------------- schema ---------------- */

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: SITE_URL + '/services/' },
  ],
};

const serviceList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: DETAIL.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name: s.name,
      description: s.body[0].replace(/&mdash;/g, '-').slice(0, 250),
      serviceType: s.name,
      provider: { '@id': SITE_URL + '/#business' },
      areaServed: TOWNS.map((t) => ({ '@type': 'City', name: t })),
      url: SITE_URL + '/services/#' + s.id,
    },
  })),
};

/* ---------------- page ---------------- */

const html = `${head({
  title: 'Remodeling & Carpentry Services on Cape Cod | Free Estimate',
  description:
    'Nine trades, one crew: bathroom and kitchen remodels, cabinets, windows, doors, painting and post-construction cleaning on Cape Cod. Free estimate.',
  canonical: SITE_URL + '/services/',
  prefix: '../',
  schema: [breadcrumb, serviceList],
})}${header('../')}

  <main id="main">

    <section class="page-hero">
      <div class="container">
        <ol class="breadcrumb">
          <li><a href="../">Home</a></li>
          <li aria-current="page">Services</li>
        </ol>
        <h1 class="h-hero">Nine trades, one crew, <span class="gold">one point of contact</span></h1>
        <p class="lede" style="margin-top:1.25rem">Everything we do on Cape Cod, in detail &mdash; from the framing of a built-in bench to the vacuuming of the floor on the last day.</p>
        <div class="btn-row" style="margin-top:1.75rem">
          ${btn('../estimate/', 'Get your free estimate')}
        </div>
      </div>
    </section>

    <section class="section" style="padding-block:var(--sp-6)">
      <div class="container">
        <h2 class="visually-hidden">Jump to a service</h2>
        <ul class="service-index">
${DETAIL.map(
  (s, i) => `          <li><a href="#${s.id}"><span class="num">${String(i + 1).padStart(2, '0')}</span>${s.name}</a></li>`
).join('\n')}
        </ul>
      </div>
    </section>

${/* One fold per service, alternating light and dark exactly like the home.
      Each is its own full-bleed <section> rather than nine articles stacked
      inside one container — that is what makes the ground actually change. */ ''}
${DETAIL.map(
  (s, i) => `    <section class="section${i % 2 === 0 ? ' section--light' : ''} service-fold" id="${s.id}">
      <div class="container">
        <article class="service-detail">
          <div class="service-detail__copy">
            <span class="step__label">${String(i + 1).padStart(2, '0')} &mdash; Service</span>
            <h2>${s.name}</h2>
${s.body.map((p) => `            <p>${p}</p>`).join('\n')}
            <ul>
${s.bullets.map((b) => `              <li>${b}</li>`).join('\n')}
            </ul>
            <div class="btn-row service-detail__cta">
              ${btn('../estimate/', 'Request a custom quote')}
            </div>
          </div>
          <figure class="service-detail__figure" style="margin:0">
            ${
              s.media.type === 'photo'
                ? img(s.media.slug, { sizes: '(min-width:880px) 46vw, 100vw', prefix: '../' })
                : stockImg(s.media.slug, s.media.alt, '(min-width:880px) 46vw, 100vw', '../')
            }
          </figure>
        </article>
      </div>
    </section>`
).join('\n')}

    <section class="section cta-band">
      <div class="container">
        <h2 class="h-section">Tell us what you <span class="gold">want done</span></h2>
        <p class="lede" style="margin-inline:auto">Estimates are free, and we cover Cape Cod from Barnstable to Plymouth. Mon&ndash;Sat, 7:00&nbsp;am &ndash; 6:00&nbsp;pm.</p>
        <div class="btn-row btn-row--center">
          ${btn('../estimate/', 'Get your free estimate')}
          ${btn('tel:' + PHONE_HREF, 'Call ' + PHONE_DISPLAY, 'ghost')}
        </div>
      </div>
    </section>

  </main>

${footer('../')}
</body>
</html>
`;

fs.mkdirSync(path.join(SITE, 'services'), { recursive: true });
fs.writeFileSync(path.join(SITE, 'services', 'index.html'), html);

/* ---------------- estimate ---------------- */

const estimate = `${head({
  title: 'Free Estimate on Cape Cod | COSTA LVM Home Service',
  description: 'Tell us the project, the town and the timing. Free estimates across Cape Cod, Barnstable to Plymouth — we usually reply the same working day.',
  canonical: SITE_URL + '/estimate/',
  prefix: '../',
})}${header('../')}

  <main id="main">
    <section class="page-hero page-hero--compact page-hero--center">
      <div class="container">
        <ol class="breadcrumb">
          <li><a href="../">Home</a></li>
          <li aria-current="page">Free estimate</li>
        </ol>
        <h1 class="h-hero">Request your <span class="gold">free estimate</span></h1>
        <p class="lede" style="margin-top:1.25rem">Tell us what you need, where the property is, and when you would like the work done. COSTA LVM replies the same working day.</p>
      </div>
    </section>

    <section class="section section--light estimate-page" id="estimate">
      <div class="container">
        <div class="contact-card contact-card--narrow">
          ${estimateForm({ extra: true, source: 'Dedicated estimate page' })}
        </div>
      </div>
    </section>
  </main>

${footer('../')}
</body>
</html>
`;

fs.mkdirSync(path.join(SITE, 'estimate'), { recursive: true });
fs.writeFileSync(path.join(SITE, 'estimate', 'index.html'), estimate);

/* ---------------- redirect link hub ---------------- */

const redirectServices = DETAIL.map((service) => ({
  name: service.name,
  blurb: service.body[0].replace(/&mdash;/g, '-').split('. ').slice(0, 2).join('. ') + '.',
}));

const redirectWhy = [
  ['20 years of local experience', 'Proven expertise in handling Cape Cod properties with superior craftsmanship.'],
  ['Fully insured for your protection', 'Complete peace of mind knowing your home and assets are fully protected.'],
  ['Unmatched property respect', 'We cover floors, protect furniture, and maintain an organized, safe work environment.'],
  ['All-in-one solution', 'We build, remodel and clean up thoroughly before handing over the keys.'],
  ['Flexible operating hours', 'Extended weekday hours and Saturday availability.'],
];

const redirectIcon = {
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.5 3 3.7 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.6.6 4 .6.7 0 1.2.5 1.2 1.2v3.5c0 .7-.5 1.2-1.2 1.2C10.7 21.4 2.6 13.3 2.6 3.4c0-.7.5-1.2 1.2-1.2h3.5c.7 0 1.2.5 1.2 1.2 0 1.4.2 2.8.6 4 .1.4 0 .9-.3 1.2l-2.2 2.2Z"/></svg>',
  email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm2.2.1 6.8 5.2 6.8-5.2"/></svg>',
  form: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v14H7V3Zm7 0v5h5M9.5 12h5M9.5 16h5"/></svg>',
  website: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-8-9h16M12 3c2.3 2.3 3.5 5.3 3.5 9S14.3 18.7 12 21c-2.3-2.3-3.5-5.3-3.5-9S9.7 5.3 12 3Z"/></svg>',
  services: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
};

function redirectButton(href, label, icon, attrs = '') {
  return `<a class="redirect-btn" href="${href}"${attrs}>${redirectIcon[icon]}<span>${label}</span></a>`;
}

const redirectPage = `${head({
  title: 'Contact COSTA LVM Home Service | Cape Cod, MA',
  description: 'Call, email or request a free estimate — carpentry, remodeling and cleaning across Cape Cod, from Barnstable to Plymouth. Mon–Sat, 7am–6pm.',
  canonical: SITE_URL + '/redirect/',
  prefix: '../',
})}
  <main id="main" class="redirect-page">
    <section class="redirect-hero" aria-label="COSTA LVM quick links">
      <div class="redirect-card">
        <img src="../assets/img/logo/logo-white.webp" alt="COSTA LVM Home Service" width="300" height="146">
        <h1>Meticulous carpentry, remodeling &amp; cleaning across Cape Cod</h1>
        <p>20 years of craftsmanship, family-owned dedication, and total property protection from Barnstable to Plymouth.</p>
        <div class="redirect-actions">
          ${redirectButton('tel:' + PHONE_HREF, 'Phone', 'phone')}
          ${redirectButton('mailto:' + EMAIL, 'Email', 'email')}
          ${redirectButton('../estimate/', 'Free Estimate', 'form')}
          ${redirectButton('../services/', 'Services', 'services')}
          ${redirectButton('../', 'Website', 'website')}
        </div>
      </div>
    </section>
  </main>
</body>
</html>
`;

fs.mkdirSync(path.join(SITE, 'redirect'), { recursive: true });
fs.writeFileSync(path.join(SITE, 'redirect', 'index.html'), redirectPage);

/* ---------------- privacy ---------------- */

function legalPage({ slug, title, description, heading, updated, sections }) {
  return `${head({
    title,
    description,
    canonical: SITE_URL + '/' + slug + '/',
    prefix: '../',
  })}${header('../')}

  <main id="main">
    <section class="page-hero page-hero--compact">
      <div class="container">
        <ol class="breadcrumb">
          <li><a href="../">Home</a></li>
          <li aria-current="page">${heading}</li>
        </ol>
        <h1 class="h-hero">${heading}</h1>
        <p class="lede" style="margin-top:1.25rem">Last updated: ${updated}</p>
      </div>
    </section>

    <section class="section section--light legal-page">
      <div class="container">
        <div class="legal-content">
${sections.map((section) => `          <section>
            <h2>${section.h}</h2>
${section.p.map((p) => `            <p>${p}</p>`).join('\n')}
          </section>`).join('\n')}
        </div>
      </div>
    </section>
  </main>

${footer('../')}
</body>
</html>
`;
}

const privacy = legalPage({
  slug: 'privacy',
  title: 'Privacy Policy | COSTA LVM Home Service',
  description: 'Privacy policy for COSTA LVM Home Service, including how estimate request information is collected and used.',
  heading: 'Privacy Policy',
  updated: 'September 1, 2026',
  sections: [
    {
      h: 'Information we collect',
      p: [
        'When you request an estimate, we collect the information you choose to submit through the form, including your name, phone number, email address, ZIP code, selected service, project details, and any optional project information you provide.',
        'We may also receive basic technical information handled by standard web servers and form providers, such as the page used to send the request and anti-spam signals from the form submission.',
      ],
    },
    {
      h: 'How we use your information',
      p: [
        'We use submitted information to reply to your project request, confirm whether the property is in our service area, schedule a consultation, prepare an estimate, and communicate about the work you asked us to review.',
        'We do not use estimate requests for newsletters, and we do not sell submitted contact information.',
      ],
    },
    {
      h: 'Form processing and analytics',
      p: [
        'The estimate form is processed through Web3Forms. The website also uses Google Tag Manager to help measure page visits, phone clicks, and form conversions so marketing can be reviewed and improved.',
        'These services may process technical information according to their own privacy practices. COSTA LVM uses them only for website operation, lead delivery, spam prevention, and measurement.',
      ],
    },
    {
      h: 'Sharing and retention',
      p: [
        'We share request details only as needed to respond to your inquiry, operate the website, deliver the form submission, or comply with legal obligations.',
        'We keep project inquiry information for as long as reasonably needed to respond, provide service, keep business records, and resolve follow-up questions.',
      ],
    },
    {
      h: 'Contact',
      p: [
        `To ask about your information, call ${PHONE_DISPLAY} or email <a href="mailto:contact@costalvmhomeservice.com">contact@costalvmhomeservice.com</a>.`,
      ],
    },
  ],
});

const terms = legalPage({
  slug: 'terms',
  title: 'Terms of Use | COSTA LVM Home Service',
  description: 'Website terms of use for COSTA LVM Home Service.',
  heading: 'Terms of Use',
  updated: 'September 1, 2026',
  sections: [
    {
      h: 'Website use',
      p: [
        'This website provides general information about COSTA LVM Home Service and the services the company offers across Cape Cod and Plymouth, Massachusetts.',
        'By using this website, you agree not to misuse the site, interfere with its operation, or submit false, abusive, or unauthorized information through its forms.',
      ],
    },
    {
      h: 'Estimates and project work',
      p: [
        'Submitting the estimate form does not create a contract or guarantee availability, pricing, scheduling, or project acceptance. Any project scope, schedule, materials, and price must be confirmed directly with COSTA LVM.',
        'Website descriptions are general service summaries. Final work details depend on property conditions, product availability, customer approvals, and any permits or requirements that apply to the project.',
      ],
    },
    {
      h: 'Website content',
      p: [
        'Text, images, layout, logos, and other website materials are provided for informational and marketing purposes and may not be copied or reused without permission.',
        'Photos are representative of work, materials, services, or visual references used to explain the business offering.',
      ],
    },
    {
      h: 'No warranties for the website',
      p: [
        'The website is provided as available. COSTA LVM works to keep information accurate, but the site may contain updates, omissions, temporary errors, or links that change over time.',
      ],
    },
    {
      h: 'Contact',
      p: [
        `Questions about these terms can be sent to <a href="mailto:contact@costalvmhomeservice.com">contact@costalvmhomeservice.com</a> or handled by phone at ${PHONE_DISPLAY}.`,
      ],
    },
  ],
});

fs.mkdirSync(path.join(SITE, 'privacy'), { recursive: true });
fs.writeFileSync(path.join(SITE, 'privacy', 'index.html'), privacy);

fs.mkdirSync(path.join(SITE, 'terms'), { recursive: true });
fs.writeFileSync(path.join(SITE, 'terms', 'index.html'), terms);

/* ---------------- thank you ---------------- */

const thanks = `${head({
  title: 'Thank you - we have your request | COSTA LVM Home Service',
  description: 'Your estimate request has reached COSTA LVM Home Service. We usually reply the same working day.',
  canonical: SITE_URL + '/thank-you/',
  prefix: '../',
  extraHead: '<meta name="robots" content="noindex, follow">',
})}
${header('../')}

  <main id="main" class="centered-page">
    <div class="container">
      <h1 class="h-hero">Thank you &mdash; <span class="gold">we have your project</span></h1>
      <p class="lede" style="margin-inline:auto">We usually reply the same working day. If it is urgent, call us on ${PHONE_DISPLAY} between 7:00&nbsp;am and 6:00&nbsp;pm, Monday to Saturday.</p>
      <div class="btn-row btn-row--center">
        ${btn('tel:' + PHONE_HREF, 'Call ' + PHONE_DISPLAY)}
        ${btn('../', 'Back to the homepage', 'ghost')}
      </div>
    </div>
  </main>

${footer('../')}
</body>
</html>
`;

fs.mkdirSync(path.join(SITE, 'thank-you'), { recursive: true });
fs.writeFileSync(path.join(SITE, 'thank-you', 'index.html'), thanks);

const thanksRedirect = `${head({
  title: 'Redirecting | COSTA LVM Home Service',
  description: 'Redirecting to the COSTA LVM Home Service thank-you page.',
  canonical: SITE_URL + '/thank-you/',
  prefix: '../',
  extraHead: '<meta name="robots" content="noindex, follow">\\n<meta http-equiv="refresh" content="0; url=../thank-you/">',
})}
  <main id="main" class="centered-page">
    <div class="container">
      <h1 class="h-hero">Redirecting</h1>
      <p class="lede" style="margin-inline:auto">Taking you to the thank-you page.</p>
      <div class="btn-row btn-row--center">
        ${btn('../thank-you/', 'Continue')}
      </div>
    </div>
  </main>
</body>
</html>
`;

fs.mkdirSync(path.join(SITE, 'thanks'), { recursive: true });
fs.writeFileSync(path.join(SITE, 'thanks', 'index.html'), thanksRedirect);

/* ---------------- 404 ---------------- */

const notFound = `${head({
  title: 'Page not found | COSTA LVM Home Service',
  description: 'That page does not exist. Head back to the homepage or call us on ' + PHONE_DISPLAY + '.',
  canonical: SITE_URL + '/404.html',
  prefix: '/',
  extraHead: '<meta name="robots" content="noindex, follow">',
})}
${header('/')}

  <main id="main" class="centered-page">
    <div class="container">
      <h1 class="h-hero">That page <span class="gold">isn&rsquo;t here</span></h1>
      <p class="lede" style="margin-inline:auto">The link may be out of date. Everything we do is on the homepage and the services page.</p>
      <div class="btn-row btn-row--center">
        ${btn('/', 'Back to the homepage')}
        ${btn('/services/', 'See all services', 'ghost')}
      </div>
    </div>
  </main>

${footer('/')}
</body>
</html>
`;

fs.writeFileSync(path.join(SITE, '404.html'), notFound);

/* ---------------- favicon, robots, sitemap ---------------- */

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="6" fill="#0f0c08"/>
  <path d="M8 30 32 12l24 18" fill="none" stroke="#e3cb92" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="32" cy="42" r="11" fill="none" stroke="#e3cb92" stroke-width="5"/>
</svg>
`;
fs.writeFileSync(path.join(SITE, 'favicon.svg'), favicon);

/* Content-Signal declares what AI systems may do with this content
   (contentsignals.org). search=yes and ai-input=yes because being found and
   being cited in an AI answer both bring this client work; ai-train=no
   because the photos and copy are the client's, not training material. */
fs.writeFileSync(
  path.join(SITE, 'robots.txt'),
  `User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /
Disallow: /thank-you/
Disallow: /thanks/

Sitemap: ${SITE_URL}/sitemap.xml
`
);

fs.writeFileSync(
  path.join(SITE, '.htaccess'),
  `RewriteEngine On
RewriteRule ^thanks/?$ /thank-you/ [R=301,L]
RewriteRule ^estimate\\.html$ /estimate/ [R=301,L]
RewriteRule ^privacy\\.html$ /privacy/ [R=301,L]
RewriteRule ^terms\\.html$ /terms/ [R=301,L]
RewriteRule ^redirect\\.html$ /redirect/ [R=301,L]

# ---------------------------------------------------------------------------
# Markdown for agents (content negotiation)
# An agent that asks for text/markdown gets the .md twin written by
# gen-markdown.js; a browser asks for text/html and never matches these rules.
# ---------------------------------------------------------------------------
AddType text/markdown .md

<IfModule mod_rewrite.c>
  RewriteCond %{HTTP:Accept} text/markdown [NC]
  RewriteCond %{DOCUMENT_ROOT}/index.md -f
  RewriteRule ^$ /index.md [L]

  RewriteCond %{HTTP:Accept} text/markdown [NC]
  RewriteCond %{DOCUMENT_ROOT}/$1/index.md -f
  RewriteRule ^(services|estimate|privacy|terms|redirect)/?$ /$1/index.md [L]
</IfModule>

<IfModule mod_headers.c>
  # Without Vary, a shared cache hands the markdown to a browser (or the
  # HTML to an agent) depending on whoever asked first.
  <FilesMatch "\\.(html|md)$">
    Header append Vary Accept
  </FilesMatch>

  # -------------------------------------------------------------------------
  # Link headers (RFC 8288)
  # Only IANA-registered relation types, and only resources that exist. No
  # api-catalog or service-doc: this is a contractor site with no API, and
  # advertising one that does not exist is worse than advertising nothing.
  # -------------------------------------------------------------------------
  <FilesMatch "^index\\.(html|md)$">
    Header set Link "</privacy/>; rel=\\"privacy-policy\\", </terms/>; rel=\\"terms-of-service\\", </index.md>; rel=\\"describedby\\"; type=\\"text/markdown\\""
  </FilesMatch>
</IfModule>

# ---------------------------------------------------------------------------
# Caching
#
# HTML and markdown: never cached. They are small, they change on every
# deploy, and a stale page is the difference between a lead seeing the
# current phone number or an old one. no-cache means "revalidate", not "do
# not store", so a 304 still costs almost nothing.
#
# CSS and JS: cached hard, for a year, because gen-index.js stamps a content
# hash into their URLs (main.css?v=abc12345). Edit the file and the URL
# changes, so there is no such thing as a stale asset. Without that hash this
# block would be actively harmful.
#
# Images, video and fonts: cached for a month. Their names are stable, so a
# photo replaced under the same filename takes up to 30 days to reach a
# returning visitor — the swap should come with a new filename.
# ---------------------------------------------------------------------------
<IfModule mod_headers.c>
  <FilesMatch "\\.(html|md)$">
    Header set Cache-Control "no-cache, must-revalidate"
  </FilesMatch>

  <FilesMatch "\\.(css|js)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>

  <FilesMatch "\\.(webp|jpg|jpeg|png|gif|svg|ico|mp4|webm)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>

  <FilesMatch "\\.(woff2|woff|ttf)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>

<IfModule mod_expires.c>
  # Fallback for hosts that run mod_expires but not mod_headers.
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/markdown "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType video/mp4 "access plus 1 month"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>
`
);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(SITE, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>
  <url><loc>${SITE_URL}/services/</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/estimate/</loc><lastmod>${today}</lastmod><priority>0.7</priority></url>
  <url><loc>${SITE_URL}/redirect/</loc><lastmod>${today}</lastmod><priority>0.5</priority></url>
  <url><loc>${SITE_URL}/privacy/</loc><lastmod>${today}</lastmod><priority>0.3</priority></url>
  <url><loc>${SITE_URL}/terms/</loc><lastmod>${today}</lastmod><priority>0.3</priority></url>
</urlset>
`
);

console.log('services/index.html -', (html.length / 1024).toFixed(1), 'KB');
console.log('estimate/, redirect/, privacy/, terms/, thank-you/, thanks/, 404.html, favicon.svg, robots.txt, sitemap.xml written');
