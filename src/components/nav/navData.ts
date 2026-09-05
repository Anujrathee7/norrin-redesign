export type NavChild = { label: string; href: string; note?: string }

export type NavItem = {
  label: string
  href: string
  /**
   * Route paths this item is "current" for, used for the active state.
   *
   * This used to be a list of SECTION IDS, read off an IntersectionObserver
   * watching `main section[id]`. The sections are on five documents now, so
   * there is nothing to observe and nothing to disagree about: the reader's
   * location is `useLocation().pathname` and the marker is exact rather than
   * inferred from what happens to be crossing a band 20% down the viewport.
   */
  owns: string[]
  children?: NavChild[]
}

/**
 * A path is a route; anything else is a fragment on the page you are already
 * on. One predicate, used by the bar, the drawer, the mobile sheet and the
 * footer, so a link's kind is decided in one place rather than four.
 */
export function isRoute(href: string) {
  return href.startsWith('/')
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
 *
 * EVERY `href` IS NOW EITHER A ROUTE PATH OR A FRAGMENT, and which one it is
 * decides how it renders: a path is a `<Link>` (client navigation, no reload),
 * a bare fragment is a plain `<a>` (the browser's own scroll, valid on every
 * route). `/what-we-do#pillars` is both — react-router pushes the path and
 * `<ScrollRestoration />` scrolls to the id once the page has rendered.
 *
 * The only bare fragments left are `#footer` and `#contact`, and they are bare
 * because both of those live in the shared layout: they are on whatever page
 * the reader is already on, so turning them into navigations would move
 * somebody who only asked to scroll.
 */
export const NAV: NavItem[] = [
  {
    label: 'What we do',
    href: '/what-we-do',
    owns: ['/what-we-do'],
    children: [
      {
        label: 'Applied AI Solutions',
        href: '/what-we-do#pillars',
        note: 'Agentic solutions · AI-first services · Software',
      },
      {
        label: 'Enterprise AI Foundation',
        href: '/what-we-do#pillars',
        note: 'Data · Integration · Cloud · Continuous services',
      },
      { label: 'AI Transformation', href: '/what-we-do#pillars', note: 'Advisory · Governance · Adoption' },
      { label: 'Platforms we run', href: '/what-we-do#platforms', note: 'Azure · Fabric · Databricks · Anthropic' },
    ],
  },
  { label: 'Work', href: '/work', owns: ['/work'] },
  {
    label: 'Thinking',
    href: '/thinking',
    owns: ['/thinking'],
    children: [
      { label: 'NorrInsights', href: '/thinking#thinking', note: 'Writing · Newsletter' },
      { label: 'Norrin Pod', href: '/thinking#thinking', note: 'The podcast' },
      { label: 'Face of AI Vision Paper', href: '/thinking#thinking', note: 'Gated download' },
    ],
  },
  {
    label: 'Company',
    href: '/company',
    owns: ['/company'],
    children: [
      // WAS "About us", POINTING AT `#proof`. Proof is on `/work` now — it is
      // evidence about the work and reads better beside the cases it came from
      // — so this row had to move with it. It is relabelled rather than
      // repointed, because "About us" promising a page the reader does not land
      // on is precisely the fabricated affordance §3 bans; "Track record" is
      // what the section's own eyebrow calls itself, and it is where the link
      // actually goes.
      { label: 'Track record', href: '/work#proof', note: 'Our story · Milestones' },
      // This used to point at the values section, which held no careers
      // content. There is a Careers section now, so the link is real.
      { label: 'Careers', href: '/company#careers', note: 'Work at Norrin' },
      { label: 'Offices & billing', href: '#footer', note: 'Seven offices · Five countries' },
    ],
  },
]
