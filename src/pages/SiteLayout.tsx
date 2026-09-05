import { Outlet, ScrollRestoration } from 'react-router'
import { Nav } from '@/components/nav/Nav'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'

/**
 * The shell every route is poured into: skip link, bar, `<main>`, footer.
 *
 * CONTACT IS PART OF THE SHELL, NOT OF A PAGE, and that is a decision rather
 * than a convenience. The ask belongs at the end of whatever was just read, so
 * a reader who finishes the cases and a reader who finishes the careers page
 * both arrive at it — and it is what keeps `#contact` an IN-PAGE anchor on
 * every route. The bar's Contact button and the footer's Contact row stay plain
 * fragment links because of it; if Contact lived on one page they would become
 * a navigation AWAY from what the reader is in the middle of, which is the
 * opposite of what a closing ask is for.
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
 * `/thinking`, press Back, then click Contact — the URL said `#contact` and the
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
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollRestoration getKey={(location) => location.pathname + location.hash} />
      <Nav />
      <main id="main">
        <Outlet />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
