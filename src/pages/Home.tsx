import { Hero } from '@/components/sections/Hero'
import { TheGap } from '@/components/sections/TheGap'
import { Pillars } from '@/components/sections/Pillars'
import { Contact } from '@/components/sections/Contact'
import { PhotoInterlude } from '@/components/sections/PhotoInterlude'

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
      <PhotoInterlude />
      {/* WHAT YOU CAN BUY, DIRECTLY UNDER THE GAP.

          It came here from `/what-we-do`, which is deleted. It sits under The
          Gap because that is the argument continuing rather than a new one
          starting: The Gap says pilots stall between demo and production, and
          this is what you can buy to cross that. Problem, then offer.

          ROLES CAME WITH IT FOR ONE COMMIT AND HAS GONE TO `/work`. "What we
          take responsibility for" is an answer to "who did you do this for and
          how did it go", not to "what does this cost" — so it belongs under the
          customer cases, which is where it now is. Splitting the two halves of
          the old `/what-we-do` was the point rather than a side effect: they
          were adjacent because a nav item owned them both, not because they
          answered the same question.

          CAREERS LEFT IN THE SAME MOVE. It was here for one commit and is
          `/careers` now. A page for people deciding whether to work somewhere
          should not be four sections deep in the page for people deciding
          whether to hire them. */}
      <Pillars />
      <Contact />
    </>
  )
}
