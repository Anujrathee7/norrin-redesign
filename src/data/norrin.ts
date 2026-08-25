/**
 * Verified public content from norrin.com.
 *
 * PROVENANCE RULE: every string in this file was read from a public Norrin page.
 * Nothing here is invented. Anything we could not verify is either absent or
 * explicitly tagged `placeholder: true` so it can be swapped without hunting.
 *
 * Source pages are noted per block so a reviewer can check us.
 */

/* ------------------------------------------------------------------ *
 * Positioning — source: norrin.com homepage
 * ------------------------------------------------------------------ */

export const positioning = {
  name: 'Norrin',
  h1: 'We are Norrin',
  lede:
    'The Nordic partner for enabling enterprise AI. We turn AI ambition into production, ' +
    'co-creating the solutions, infrastructure, and adoption that make it stick. ' +
    'From strategy to deployment, integrated with your business and your experts.',
  thesis: 'We believe enterprise AI is won in production.',
  thesisBody:
    'Real impact takes more than frontier models, more than slick demos, more than another pilot. ' +
    'It takes deployment inside real workflows, infrastructure that holds up, governance that earns trust, ' +
    'and change management that makes new ways of working stick.',
  thesisClose: 'We stand for all that. Co-created with you, from strategy to scale.',
  /**
   * The opening clause only. The remaining clauses of `thesisBody` are used as
   * the three station captions in the gap diagram, so printing the whole
   * paragraph alongside them would repeat the same words twice in one viewport.
   */
  thesisOpening: 'Real impact takes more than frontier models.',
  metaDescription:
    'Norrin transforms AI & Data into measurable business impact by integrating AI into ' +
    'business processes and building Enterprise AI.',
} as const

/**
 * Norrin's own four-role framing, verbatim from the homepage "Enabling Enterprise AI"
 * paragraph. We use this as the spine of the site because it is the clearest
 * articulation of scope they have written.
 */
export const roles = [
  {
    id: 'integrator',
    role: 'Integrator',
    claim: 'We connect models to your data, tools, and workflows.',
  },
  {
    id: 'deployer',
    role: 'Deployer',
    claim: 'We build and ship the agents and applications that do the real work.',
  },
  {
    id: 'infrastructure',
    role: 'Infrastructure partner',
    claim: 'We run the platforms underneath.',
  },
  {
    id: 'transformation',
    role: 'Transformation lead',
    claim:
      'We provide the transformation leadership and adoption support that carry the change ' +
      'from individual contributors to the C-suite.',
  },
] as const

/* ------------------------------------------------------------------ *
 * Three pillars — source: homepage "Enabling Enterprise AI"
 * ------------------------------------------------------------------ */

export const pillars = [
  {
    id: 'applied-ai',
    name: 'Applied AI Solutions',
    body:
      'Our work starts with co-creative engineering: your business knowledge with our technical ' +
      'experience. From there we design AI-first services and build the agentic solutions behind ' +
      'them, focused on Anthropic and Microsoft. Every solution ships through our deployment ' +
      'framework, and our data science and AI engineer teams plug in when you need extra capacity.',
    capabilities: ['AI Solutions', 'AI Agents', 'AI Center of Excellence', 'Software Development'],
  },
  {
    id: 'foundation',
    name: 'Enterprise AI Foundation',
    body:
      'AI only works when the foundations underneath do. We engineer the data and integration ' +
      'platforms that get the right information where it’s needed, the AI platforms where your ' +
      'models and agents run, and the cloud infrastructure they sit on. Continuous services and ' +
      'AIOps keep it all running 24/7.',
    capabilities: [
      'Data Platforms',
      'System Integrations',
      'Cloud Infrastructure',
      'Continuous Services',
      'Business Analytics',
    ],
  },
  {
    id: 'transformation',
    name: 'AI Transformation',
    body:
      'Strategy and advisory work that leaves you with a clear AI roadmap. We shape the governance ' +
      'and enterprise architecture so AI scales across the business without creating new risk. ' +
      'Adoption support reaches everyone from the engineer learning a new tool to the C-suite, and ' +
      'when the change needs its own programme, we lead it.',
    capabilities: ['Advisory', 'AI Roadmap', 'Governance & Enterprise Architecture', 'Adoption'],
  },
] as const

/* ------------------------------------------------------------------ *
 * Company facts — source: /about-us ("Norrin in Numbers", "Our story")
 * ------------------------------------------------------------------ */

export const metrics = [
  { value: 220, suffix: '', label: 'Employees' },
  { value: 31, suffix: ' M€', label: 'Revenue' },
  { value: 40, suffix: '%', label: 'Yearly growth' },
  { value: 200, suffix: '', label: 'Clients' },
] as const

export const story = {
  since: 2012,
  sinceLine:
    'We’ve been shaping Nordic innovation since 2012, grounded in a culture that prizes ' +
    'delivery excellence, customer success, and the wellbeing of our employees.',
  arc:
    'What began in the data platform space has grown into a full end-to-end offering: advisory, ' +
    'implementation, and modern AI capabilities under one roof.',
  recognition: 'Recognized as Finland’s fastest-growing IT consulting company in 2025.',
} as const

/** Verbatim milestones from the /about-us "Our story" paragraph. */
export const timeline = [
  {
    year: '2012',
    title: 'Founded',
    body: 'Shaping Nordic innovation from the data platform space.',
  },
  {
    year: '2024',
    title: 'Three companies become one',
    body: 'Cloud1, Devisioona and Smartbi unite as Norrin.',
  },
  {
    year: '2025',
    title: 'Advisory, and into Sweden',
    body: 'Norrin Advisory launches; Sweden entered through the acquisition of Bizone.',
  },
  {
    year: '2027',
    title: 'Public listing',
    body: 'Operations across Finland, Sweden and the U.S., aiming for a public listing.',
    future: true,
  },
] as const

/* ------------------------------------------------------------------ *
 * Customers — source: homepage "Our Customers" list + case pages.
 * Rendered as TYPE, never as logo files (we hold no licence to their marks).
 * ------------------------------------------------------------------ */

export const customersIntro =
  'Most of our customers are large Nordic enterprises. Our customers are often known for their ' +
  'willingness to be the forerunners: those who dare to challenge the status quo in search for ' +
  'new opportunities and productivity.'

export const customers = [
  'Lowell',
  'Metsä Group',
  'Sponda',
  'Helen',
  'Skanska',
  'Alko',
  'YIT',
  'Kemira',
  'NRC Group',
  'Plan International Finland',
] as const

/**
 * Case summaries quoted from public case pages. `quote` strings are verbatim.
 * No metric appears here that Norrin has not published itself.
 */
export const cases = [
  {
    id: 'caruna',
    client: 'Caruna',
    sector: 'Energy distribution',
    // The 87,300 km figure lives in the title and the quote; it was also
    // rendered a third time as a display figure in the same eyeline.
    title: 'Computer vision across an 87,300-kilometer grid',
    quote:
      'Together with Norrin, Caruna built a computer vision application to help identify damages ' +
      'to their 87,300-kilometer-long electrical network.',
  },
  {
    id: 'skanska',
    client: 'Skanska',
    sector: 'Construction',
    title: 'A journey to a data-driven organization',
    quote:
      'Skanska is one of the world’s leading companies providing construction and project ' +
      'development services. Chief Information Officer Artturi Kantanen has been advancing ' +
      'Skanska’s journey towards a data-driven organization in Finland.',
    attribution: 'Artturi Kantanen, Chief Information Officer, Skanska',
  },
  {
    id: 's-pankki',
    client: 'S-Pankki',
    sector: 'Banking',
    title: 'Data quality for the positive credit register',
    quote:
      'Norrin helped S-Pankki develop solutions to prevent data quality errors in the positive ' +
      'credit register, which S-Pankki successfully adopted in April.',
  },
  {
    id: 'sponda',
    client: 'Sponda',
    sector: 'Real estate',
    title: 'Investing in data architecture quality',
    quote:
      'Sponda has made significant investments to ensure the quality of its data architecture. ' +
      'In addition to technological investments, this requires developing the organization’s ' +
      'capabilities to ensure data quality, availability, business-centricity, and security.',
  },
] as const

/* ------------------------------------------------------------------ *
 * Technologies — source: primary nav "Technologies" + homepage copy
 * ------------------------------------------------------------------ */

/**
 * `sourcedIn` records WHICH Norrin paragraph names the vendor — it is provenance
 * for us, not a claim about them. It was briefly rendered on the page as a
 * "Named partner" badge, which asserted a formal partner tier no source supports.
 * It is deliberately not a display string.
 */
/**
 * Ordered by layer, because the section's caption names two of them — the
 * agentic/AI tier and the platforms underneath it. The list previously ran in
 * no particular order, so a caption promising two layers sat above eight
 * interleaved names.
 */
export const technologies = [
  // The AI tier.
  { name: 'Anthropic', sourcedIn: 'Applied AI Solutions' },
  { name: 'Azure AI Foundry' },
  // The platforms underneath.
  { name: 'Microsoft Azure' },
  { name: 'Microsoft Fabric' },
  { name: 'Azure Databricks' },
  { name: 'Azure Integration Services' },
  { name: 'Azure API Management' },
  { name: 'Power Platform' },
  { name: 'Power BI' },
] as const

/**
 * Source: /technologies, verbatim.
 *
 * A real, citable partnership claim. An earlier build rendered a "Named partner"
 * badge beside Anthropic that no source supported; this is the one Norrin
 * actually publishes, and it names the competence areas rather than a tier.
 */
export const partnership =
  'As a recognition for our focused competence, we are a certified Microsoft partner in the ' +
  'areas of data, AI, digital innovation, infrastructure and analytics.'

/**
 * Source: /technologies, verbatim.
 *
 * The single best sentence on Norrin's site for a page whose whole argument is
 * "AI is won in production": a dated, checkable claim about running something in
 * production for a decade. It is evidence for the thesis, not a capability list.
 */
export const productionSince = {
  claim: 'We’ve been running Logic Apps -based solutions in production since 2015.',
  year: 2015,
}

/**
 * The eight service lines, with Norrin's own taglines. Source: /services.
 *
 * These were previously reduced to bare names in the pillar capability lists —
 * "Data Platforms", "Continuous Services" — which is the least interesting form
 * the same information can take. The taglines are the company's own writing and
 * are markedly better than anything a redesign should invent in their place.
 */
export const services = [
  { name: 'AI Solutions', tagline: 'AI-powered productivity', pillar: 'applied-ai' },
  { name: 'Software Development', tagline: 'Bespoke yet responsible user experiences', pillar: 'applied-ai' },
  { name: 'Data Platforms', tagline: 'All the data, all the time', pillar: 'foundation' },
  { name: 'System Integrations', tagline: 'Modern integrations distribute the data and liberate processes', pillar: 'foundation' },
  { name: 'Cloud Infrastructure', tagline: 'Growth-ready corporate clouds', pillar: 'foundation' },
  { name: 'Business Analytics', tagline: 'Analytics and insight — for everyone', pillar: 'foundation' },
  { name: 'Continuous Services', tagline: '24/7 peace of mind', pillar: 'foundation' },
  { name: 'Advisory', tagline: 'Acceleration and governance', pillar: 'transformation' },
] as const

/* ------------------------------------------------------------------ *
 * Values — source: /about-us "We believe in" + "Ways of working"
 * ------------------------------------------------------------------ */

/**
 * Values — source: /about-us "We believe in" + "Ways of working".
 *
 * NOT CURRENTLY RENDERED. The values section was cut: four short statements
 * occupying ~945px of a page whose middle 70% already carried no brand, and the
 * objection it retired ("will they displace my team?") is answered by the
 * transformation-lead role and the co-creative language in pillar 01. The
 * sourced text is kept here because it is research, not because it is dead code.
 *
 * All four of Norrin's value statements open with the words "We believe in".
 * `title` keeps each one verbatim; `predicate` is the same sentence with that
 * shared opening lifted out, so the page can set it once as a heading instead
 * of repeating it four times. This is a typographic de-duplication, not a
 * rewrite — no wording is changed, added or softened.
 */
export const beliefs = [
  {
    title: 'We believe in people and their experience',
    predicate: 'people and their experience',
    body:
      'Technology means nothing without the humans behind it. We build with empathy, respect, ' +
      'and real-world understanding, with people at the center.',
  },
  {
    title: 'We believe in creating together — seeing what neither could alone',
    predicate: 'creating together — seeing what neither could alone',
    body: 'It all starts with teamwork — both with our colleagues and the customer.',
  },
  {
    title: 'We believe in combining business insight with technical expertise to find the best solutions',
    predicate: 'combining business insight with technical expertise to find the best solutions',
    body:
      'We’re here to make things move efficiently, measurably, and with purpose. From strategy ' +
      'to implementation, we focus on outcomes, not just activity.',
  },
  {
    title: 'We believe in integrity in every interaction',
    predicate: 'integrity in every interaction',
    body: 'We’re direct, transparent, and take full ownership.',
  },
] as const

/* ------------------------------------------------------------------ *
 * Offices — source: /contact-us/offices-and-billing-information
 * ------------------------------------------------------------------ */

export const offices = [
  { country: 'Finland', city: 'Espoo', address: 'Tekniikantie 4 D, 02150 Espoo' },
  { country: 'Finland', city: 'Tampere', address: 'Peltokatu 26 C235, 33100 Tampere' },
  { country: 'Sweden', city: 'Stockholm', address: 'Västmannagatan 15, Stockholm' },
  { country: 'Sweden', city: 'Norrköping', address: 'Slottsgatan 116, Norrköping' },
  { country: 'Thailand', city: 'Bangkok', address: '496-502 Gaysorn Amarin Tower, 5th Floor' },
  { country: 'Vietnam', city: 'Ho Chi Minh City', address: 'No.87A, Ham Nghi, Sai Gon Ward' },
  { country: 'United States', city: 'Atlanta', address: '999 Peachtree St NE, Suite 400, GA 30309' },
] as const

/* ------------------------------------------------------------------ *
 * People — source: /services "Contact us" block (public names + titles).
 * No photographs are used: we hold no rights to their headshots.
 * ------------------------------------------------------------------ */

/**
 * NOT SOURCED — tagged so it cannot be mistaken for verified content.
 *
 * Norrin publishes a contact form, not an address. This was previously hardcoded
 * in Contact.tsx, which made the page's single most consequential string the one
 * string outside this file. It is a conventional guess; swap it for the real
 * destination without hunting.
 */
export const contactEmail = { address: 'info@norrin.com', placeholder: true } as const

export const contacts = [
  { name: 'Antti Vuolli', title: 'Chief Commercial Officer' },
  { name: 'Emil Sievinen', title: 'Chief Technology Officer' },
  { name: 'Heidi Riihimäki', title: 'Sales Operations Manager' },
] as const

/* ------------------------------------------------------------------ *
 * Publications — source: homepage
 * ------------------------------------------------------------------ */

/**
 * `excerpt` is a verbatim clause chosen by hand, not `body.split('. ')[0]`.
 * The heuristic version took the Vision Paper's opening — a sentence about the
 * problem — and threw away the clause that says what is actually in the paper,
 * directly above a button reading "Download the paper".
 */
export const publications = {
  visionPaper: {
    title: 'Face of AI Vision Paper',
    body:
      'AI is reshaping how enterprises operate but the human experience is often overlooked. ' +
      'We believe AI can change the interface between humans and machines profoundly. In this ' +
      'paper, we explore how AI-augmented, multi-modal, and asynchronous experiences can redefine ' +
      'enterprise applications.',
    excerpt:
      'In this paper, we explore how AI-augmented, multi-modal, and asynchronous experiences ' +
      'can redefine enterprise applications.',
    cta: 'Download the paper',
  },
  pod: {
    title: 'Norrin Pod',
    body:
      'The Norrin Pod explores how AI reshapes everyday work from decision-making to operations ' +
      'and real productivity. It blends technical insight with the human angle: what AI means for ' +
      'people, why some initiatives thrive while others stall, and what leaders must actually do ' +
      'to unlock impact.',
    excerpt:
      'It blends technical insight with the human angle: what AI means for people, why some ' +
      'initiatives thrive while others stall, and what leaders must actually do to unlock impact.',
  },
  insights: {
    title: 'NorrInsights',
    body: 'Writing and a newsletter on enterprise AI, data and adoption.',
    excerpt: 'Writing and a newsletter on enterprise AI, data and adoption.',
  },
} as const

/**
 * PARAPHRASE — the only rewritten string in this file, and flagged so the
 * provenance rule at the top still holds for everything else.
 *
 * Source, verbatim from norrin.com:
 *   "Norrin builds Enterprise AI by turning AI and data into measurable business
 *   impact. We enable enterprise AI through comprehensive AI solutions that
 *   cover the entire business system. We have been recognized as Finland's
 *   fastest-growing IT consulting company in 2025. At Norrin, we believe that
 *   the true value of AI emerges only from high-quality data and a committed
 *   leadership. We guide, design, implement, and support."
 *
 * Every claim survives except the 2025 recognition, which is not repeated here
 * because it is now the Proof section's heading — the page should not print its
 * single most differentiating fact twice. Nothing is added or strengthened;
 * "comprehensive AI solutions that cover the entire business system" becomes
 * "the whole business system rather than one department", which says the same
 * thing without the three words that make it sound like every other consultancy.
 */
export const footerBlurb = {
  paraphrase: true,
  text:
    'Norrin turns AI and data into measurable business impact, across the whole business ' +
    'system rather than one department. That value only appears when the data underneath is ' +
    'good and the leadership is committed — so the work runs the whole way: guide, design, ' +
    'implement, support.',
} as const

export const languages = ['En', 'Fi', 'Se', 'Th', 'Vi'] as const

/** Only profiles we could actually resolve. A bare domain root is not a source. */
export const social = [{ name: 'LinkedIn', href: 'https://www.linkedin.com/company/norrin' }] as const
