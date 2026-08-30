export type NavChild = { label: string; href: string; note?: string }

export type NavItem = {
  label: string
  href: string
  /** Section ids this item is "current" for, used for the active state. */
  owns: string[]
  children?: NavChild[]
}

/**
 * Norrin's live nav exposes roughly 25 primary destinations — Services alone
 * fans out to eleven links across three subgroups, Technologies to seven, and
 * five locales sit alongside them as if they were content. This collapses that
 * to five items on the three pillars, a taxonomy Norrin already uses internally
 * and which absorbs every one of the eleven service links.
 *
 * Shared by every navbar variant so the options differ in layout and character,
 * never in what the site actually offers.
 */
export const NAV: NavItem[] = [
  {
    label: 'What we do',
    href: '#roles',
    owns: ['roles', 'pillars'],
    children: [
      {
        label: 'Applied AI Solutions',
        href: '#pillars',
        note: 'Agentic solutions · AI-first services · Software',
      },
      {
        label: 'Enterprise AI Foundation',
        href: '#pillars',
        note: 'Data · Integration · Cloud · Continuous services',
      },
      { label: 'AI Transformation', href: '#pillars', note: 'Advisory · Governance · Adoption' },
      { label: 'Platforms we run', href: '#platforms', note: 'Azure · Fabric · Databricks · Anthropic' },
    ],
  },
  { label: 'Work', href: '#work', owns: ['work'] },
  {
    label: 'Thinking',
    href: '#thinking',
    owns: ['thinking'],
    children: [
      { label: 'NorrInsights', href: '#thinking', note: 'Writing · Newsletter' },
      { label: 'Norrin Pod', href: '#thinking', note: 'The podcast' },
      { label: 'Face of AI Vision Paper', href: '#thinking', note: 'Gated download' },
    ],
  },
  {
    label: 'Company',
    href: '#proof',
    // Careers and Proof are one contiguous run, which is what lets the bar's
    // marker travel in one direction down the page. See the note in App.tsx.
    owns: ['careers', 'proof'],
    children: [
      { label: 'About us', href: '#proof', note: 'Track record · Story' },
      // This used to point at the values section, which held no careers
      // content. There is a Careers section now, so the link is real.
      { label: 'Careers', href: '#careers', note: 'Work at Norrin' },
      { label: 'Offices & billing', href: '#footer', note: 'Seven offices · Five countries' },
    ],
  },
]
