export type NavItem = {
  label: string
  href: string
  /**
   * Route paths this item is "current" for, used for the active state.
   *
   * This used to be a list of SECTION IDS, read off an IntersectionObserver
   * watching `main section[id]`. The sections are on separate documents now, so
   * there is nothing to observe and nothing to disagree about: the reader's
   * location is `useLocation().pathname` and the marker is exact rather than
   * inferred from what happens to be crossing a band 20% down the viewport.
   */
  owns: string[]
}

/**
 * A path is a route; anything else is a fragment on the page you are already
 * on. One predicate, used by the bar, the mobile sheet and the footer, so a
 * link's kind is decided in one place rather than three.
 */
export function isRoute(href: string) {
  return href.startsWith('/')
}

/**
 * THE BAR IS THE ROUTE TABLE. NOTHING MORE.
 *
 * ---------------------------------------------------------------------------
 * THE DRAWERS ARE GONE, AND SO IS EVERYTHING THAT FED THEM
 * ---------------------------------------------------------------------------
 * Three of the four items used to open a hover drawer — eleven rows in total,
 * with hover-intent timers, focus hand-off at both edges of the panel, an
 * `inert` collapsed state and a keyboard/mouse split on what activating a
 * parent even meant. All of it is deleted rather than hidden.
 *
 * It was built for a bar that stood in front of one long document, where an
 * item was a scroll target and a drawer was the only way to say what was inside
 * it. There are three routes now, and a route says what is inside it by being a
 * page. A drawer over a two-item bar is a mechanism with nothing left to
 * disclose.
 *
 * The eleven rows were mostly not destinations anyway. Four of the five under
 * "What we do" pointed at the same `#pillars` id with different labels, and all
 * three under "Thinking" pointed at `#thinking` — a menu whose rows differ in
 * text and agree in destination is a list of topics wearing a navigation's
 * clothes. §3 is about links promising things they do not deliver, and this is
 * the shape that rule takes in a nav.
 *
 * ---------------------------------------------------------------------------
 * THREE ITEMS: THE ROUTE TABLE, COMPLETE
 * ---------------------------------------------------------------------------
 * It was two for one commit, on the argument that `/` was already owned by the
 * wordmark and a "Home" item beside a logo that goes home is one destination
 * wearing two controls. That argument was answered by removing the other
 * control rather than the item: the wordmark is plain text now and routes
 * nowhere, so Home has to be here or `/` is unreachable from the bar.
 *
 * The list is therefore exactly the route table — every route, once, in reading
 * order. That is the property worth keeping: a bar you can check against
 * `routes.tsx` by counting.
 *
 * What the deleted items carried is still reachable and is not orphaned:
 * Careers and Contact are sections of `/` and are in the footer's Company
 * column; Track record is on `/work` and is in that same column; Thinking is on
 * `/work` too. Nothing lost a destination — two things lost a menu.
 *
 * CONTACT IS NOT AN ITEM AND IS NOT A BUTTON ANY MORE. The bar carried a solid
 * `/#contact` call to action in its utilities corner and no longer does. It is
 * not promoted into this list to compensate: this list is routes, and Contact is
 * a section. The footer links it.
 *
 * Norrin's own live nav exposes roughly 25 primary destinations, Services alone
 * fanning out to eleven links across three subgroups. This is the opposite
 * position, arrived at by deleting rather than by collapsing.
 */
export const NAV: NavItem[] = [
  { label: 'Home', href: '/', owns: ['/'] },
  { label: 'What we do', href: '/what-we-do', owns: ['/what-we-do'] },
  { label: 'Work', href: '/work', owns: ['/work'] },
]
