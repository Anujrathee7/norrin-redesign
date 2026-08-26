import { useEffect, useState } from 'react'
import { Nav } from '@/components/nav/Nav'
import { MascotLab } from '@/components/sections/MascotLab'
import { Hero } from '@/components/sections/Hero'
import { TheGap } from '@/components/sections/TheGap'
import { Proof } from '@/components/sections/Proof'
import { Roles } from '@/components/sections/Roles'
import { Work } from '@/components/sections/Work'
import { Pillars } from '@/components/sections/Pillars'
import { Thinking } from '@/components/sections/Thinking'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'

/**
 * Page order is also nav order.
 *
 * The bar marks the section you are reading with its own length of the bottom
 * rule. That only reads as wayfinding if the marker travels one way: previously
 * it lit positions 4 → 1 → 2 → 1 → 3 on the way down, because "Company" pointed
 * at Proof (then the second section) while "What we do" owned Roles and Pillars,
 * which sat either side of Work. Two backward jumps.
 *
 * Each nav item now owns a contiguous run, in bar order:
 *   What we do → Roles, Pillars   Work → Work   Thinking → Thinking   Company → Proof
 *
 * The narrative it produces is the better one anyway: the problem, then what we
 * take responsibility for, then what you can buy, then who we did it for, then
 * the thinking, then the track record, then the ask.
 */
/**
 * The mascot lab hangs off #mascots rather than living in the page.
 *
 * It is a workbench: four characters against both grounds, down to 24px, with
 * motion off. That is worth having and is not worth putting in the nav — the
 * page has one argument to make and a gallery of mascots is not part of it.
 *
 * Gated on the hash rather than on a router because the project has no router
 * and does not need one for a single dev surface. `hashchange` does not fire
 * for the hash the page LOADED with, so the initial value is read from
 * `location` directly and not defaulted to empty.
 */
function useIsMascotLab() {
  const [hash, setHash] = useState(() =>
    typeof window === 'undefined' ? '' : window.location.hash,
  )
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash === '#mascots'
}

export default function App() {
  const mascotLab = useIsMascotLab()
  if (mascotLab) return <MascotLab />

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        {/* SEAM 1. The deck: two cards in one containing block, the lower one
            pinned, the upper one riding up over it. The wrapper is what makes
            it possible — `position: sticky` is clamped to its containing
            block, so this div is both what lets the hero hold and what
            guarantees it stops holding. It ends at TheGap's bottom, which is
            why nothing is ever left pinned behind `Roles`.

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
        <Roles />
        <Pillars />
        <Work />
        <Thinking />
        <Proof />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
