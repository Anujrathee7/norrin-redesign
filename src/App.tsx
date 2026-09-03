import { useEffect, useState } from 'react'
import { Nav } from '@/components/nav/Nav'
import { Compare } from '@/components/sections/Compare'
import { StyleGuide } from '@/components/sections/StyleGuide'
import { GapBackdrops } from '@/components/sections/GapBackdrops'
import { FontLab } from '@/components/sections/FontLab'
import { Hero } from '@/components/sections/Hero'
import { TheGap } from '@/components/sections/TheGap'
import { Proof } from '@/components/sections/Proof'
import { Roles } from '@/components/sections/Roles'
import { Work } from '@/components/sections/Work'
import { Careers } from '@/components/sections/Careers'
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
 *   What we do → Roles, Pillars   Work → Work   Thinking → Thinking
 *   Company → Careers, Proof
 *
 * Careers is why Company owns two sections rather than one. It is content for
 * a different audience than the rest of the page, it belongs beside the track
 * record under "Company", and the contiguity rule above is what decides where
 * it goes: placed between Work and Thinking — which is Norrin’s own order —
 * it would split Company’s run and reintroduce the backward jump this note
 * exists to record. So it follows Thinking instead.
 *
 * The narrative it produces is the better one anyway: the problem, then what we
 * take responsibility for, then what you can buy, then who we did it for, then
 * the thinking, then who we are, then the track record, then the ask.
 */
/**
 * Three surfaces hang off the hash rather than living in the page.
 *
 * `#mascots` was one of them — a workbench rendering every Nori pose against
 * both grounds. It is gone: Nori was deleted from the codebase on the user's
 * instruction, so the surface, the component and its CSS all went with it.
 *
 * `#compare`: it is FOR sending. It puts each section of
 * norrin.com beside the same section rebuilt, because a redesign shown on its
 * own asks the viewer to hold the original in their head and do the diff
 * themselves, and a cold link does not get that much patience. It stays off the
 * page for the same reason the lab does — the homepage should make the argument,
 * not talk about making it.
 *
 * `#backdrops` is a workbench for one open question: whether The Gap carries
 * a picture behind it, and if so which one and where the type goes. Seven
 * rendered options rather than a description of seven options, for the same
 * reason the style guide is a page — a backdrop is not a thing you can judge by
 * reading about it.
 *
 * `#styleguide` is the system itself, rendered rather than written. It exists
 * because a spec for type, colour and spacing is the one thing you cannot judge
 * by reading it, and because a guide that restates values copied out of the
 * stylesheet starts lying the first time a token moves. Every number on it is
 * measured off the live DOM. It is a review gate, which is why it is here and
 * not in `docs/`.
 *
 * Gated on the hash rather than on a router because the project has no router
 * and needs none for two standalone surfaces; it also means both work on a
 * static host with no rewrite rules. `hashchange` does not fire for the hash the
 * page LOADED with, so the initial value is read from `location` directly and
 * not defaulted to empty.
 *
 * A surface OWNS the whole document when its hash matches — it is not a section
 * of the homepage — so anchors like `#contact` must never collide with these
 * two names. They do not: every in-page anchor is a section id, and `compare`
 * is not one.
 */
function useHashSurface() {
  const [hash, setHash] = useState(() =>
    typeof window === 'undefined' ? '' : window.location.hash,
  )
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  if (hash === '#compare') return 'compare'
  if (hash === '#styleguide') return 'styleguide'
  if (hash === '#backdrops') return 'backdrops'
  if (hash === '#fonts') return 'fonts'
  return null
}

export default function App() {
  const surface = useHashSurface()
  if (surface === 'compare') return <Compare />
  if (surface === 'styleguide') return <StyleGuide />
  if (surface === 'backdrops') return <GapBackdrops />
  if (surface === 'fonts') return <FontLab />

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
        <Careers />
        <Proof />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
