import { Hero } from '@/components/sections/Hero'
import { TheGap } from '@/components/sections/TheGap'
import { Careers } from '@/components/sections/Careers'
import { Contact } from '@/components/sections/Contact'

/**
 * `/` — the hero and the problem it names.
 *
 * The homepage used to be the whole site: one document 13.6 viewport-heights
 * tall, measured at 1512x860 rather than estimated, with three sections
 * carrying eight of those screens. "Everything is congested in one page, each
 * page should be 3-4 scrolls, right now it is up to 10." Every nav item already
 * owned a CONTIGUOUS run of sections — a property the bar's travelling marker
 * needed, and the same property that makes those runs separable — so the split
 * follows the runs that were already there rather than inventing new ones.
 *
 * What stays here is the pair that has to stay together: the hero and the gap
 * it opens, because they are one mechanism (see the deck below) and not two
 * sections that happen to be adjacent.
 */
export function Home() {
  return (
    <>
      {/* SEAM 1. The deck: two cards in one containing block, the lower one
          pinned, the upper one riding up over it. The wrapper is what makes
          it possible — `position: sticky` is clamped to its containing
          block, so this div is both what lets the hero hold and what
          guarantees it stops holding. It ends at TheGap's bottom, which is
          why nothing is ever left pinned behind whatever follows — that used
          to be `Roles` and is now the Contact strip the layout closes every
          page with. The clamp is what makes that sentence true for either.

          The order matters and is doing real work: both sections are
          positioned with `z-index: auto`, so they paint in tree order and
          TheGap covers the hero with no z-index anywhere. Never give TheGap
          a negative one — it would drop behind the hero's own plate. */}
      <div data-deck>
        <Hero />
        {/* The hold. A real box, because `position: sticky` is clamped to its
            containing block and this is what gives the card something to
            travel against — the same lesson the hero's own curtain learned
            the expensive way: padding does not extend sticky travel at all.

            TheGap is OUTSIDE the deck and pulled back up over this box by
            exactly its height, so the page is not one pixel taller than it
            was and TheGap starts exactly where it always started. It still
            covers the pinned hero: both are positioned, neither sets a
            z-index, and TheGap is later in tree order. Never give it a
            negative one — it would drop behind the hero's own plate. */}
        <div aria-hidden="true" data-deck-hold />
      </div>
      <TheGap />
      {/* CAREERS CAME HERE FROM `/company`, AND IT TOOK THAT ROUTE WITH IT.
          Careers was the only section on `/company`, so moving it did not
          rebalance that page, it emptied it — the route and its nav item are
          deleted rather than left pointing at nothing. `CompanyPage.tsx` is
          gone for the same reason.

          It follows The Gap rather than opening the page: the argument runs
          problem, then the people who answer it, then the ask. */}
      <Careers />
      {/* CONTACT IS HOME'S ALONE NOW, AND THAT REVERSES A DECISION MADE HERE
          THREE COMMITS AGO. It was rendered in `SiteLayout` after every route's
          outlet, on the argument that the ask belongs at the end of whatever was
          just read and that `#contact` then resolved from anywhere.

          The cost of that was five copies of one section and four pages ending
          the same way — which is also what weakened §1.5 across pages: two of
          the five were a single section followed by the same forest Contact and
          the same paper footer. One page owns the ask now.

          What it costs in return is written down rather than hidden: the bar's
          Contact button and the footer's Contact row are no longer scrolls. They
          are `/#contact`, a navigation, and from any other route they move the
          reader off the page they were on. That is the trade, and it is the
          reason those two links had to change kind in the same commit. */}
      <Contact />
    </>
  )
}
