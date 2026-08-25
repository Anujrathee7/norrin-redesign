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
    owns: ['proof'],
    children: [
      { label: 'About us', href: '#proof', note: 'Track record · Story' },
      // Careers pointed at the values section, which held no careers content.
      { label: 'Offices & billing', href: '#footer', note: 'Seven offices · Five countries' },
    ],
  },
]
