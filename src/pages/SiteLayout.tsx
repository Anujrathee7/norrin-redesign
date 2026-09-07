import { Outlet, ScrollRestoration } from 'react-router'
import { Nav } from '@/components/nav/Nav'
import { Footer } from '@/components/sections/Footer'
import { useSceneArrival } from '@/hooks/useSceneArrival'

/**
 * The shell every route is poured into: skip link, bar, `<main>`, footer.
 *
 * CONTACT IS NO LONGER PART OF THE SHELL, AND THAT REVERSES WHAT THIS COMMENT
 * USED TO ARGUE. It was rendered here after every route's outlet, so the ask
 * landed at the end of whatever had just been read and `#contact` stayed an
 * in-page anchor everywhere.
 *
 * What that actually produced was five copies of one section and four pages
 * ending identically — which is where §1.5 was weakest across the site, since
 * two of the five routes were a single section followed by the same forest
 * Contact and the same paper footer. Contact belongs to `/` now; see the note in
 * `Home.tsx`.
 *
 * The cost is paid in the two links that pointed at it: the bar's Contact button
 * and the footer's Contact row are `/#contact` and are navigations rather than
 * scrolls. Both say so at their call sites. The `getKey` note below is what
 * makes them land on the section rather than at the top of the page.
 *
 * `<ScrollRestoration />` rather than a hand-rolled scroll-to-top (§2.1: never
 * hand-roll what the library ships). It is three behaviours, not one, and the
 * second and third are the ones people forget: top on a new navigation, the
 * SAVED position on back and forward, and `scrollIntoView` on the element named
 * by the hash — which is what makes a cross-page link like `/work#proof` land
 * on the section instead of at the top of the page that contains it.
 *
 * `getKey` IS NOT DECORATION. IT IS THE FIX FOR A REPRODUCED BUG, and the bug
 * is the reason every plain `#contact` anchor on this site keeps working.
 *
 * Chrome fires `popstate` for a SAME-DOCUMENT fragment navigation — clicking
 * `<a href="#contact">` is a history entry, and the spec has said so since the
 * navigation rewrite. React Router's history listens to `popstate` and nothing
 * else, so it reads that click as a back/forward traversal and asks
 * `<ScrollRestoration />` for the position saved against the key it lands on.
 * Under the DEFAULT key — `location.key`, which a fragment entry does not carry
 * and which therefore falls back to the literal string `"default"` — that lookup
 * hits the position saved for the page the reader was already on. The effect
 * takes the `typeof number` branch, scrolls back to it, and the anchor does
 * nothing. Measured, from `.shots/probe/routing.mjs`: load `/`, scroll, go to
 * another route, press Back, then click Contact — the URL said `#contact` and the
 * page sat at 569px, and stayed there for every anchor for the rest of the
 * visit.
 *
 * Keying on `pathname + hash` gives that fragment entry a key of its own, which
 * has no saved position, so `restoreScrollPosition` comes back `null` and the
 * effect falls through to the branch that was always the right one for a
 * fragment: `scrollIntoView` on the named element.
 *
 * It is also the better key on its own terms. `location.key` is per-VISIT, so
 * arriving at `/work` a second time restores nothing; `pathname + hash` is
 * per-PLACE, which is what "put me back where I was on the work page" means.
 */
export function SiteLayout() {
  /* Scenes already on screen at first paint arrive without a scroll. Here
     rather than per-section because it is a property of the route, and every
     route is poured through this shell. */
  useSceneArrival()

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollRestoration getKey={(location) => location.pathname + location.hash} />
      <Nav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
