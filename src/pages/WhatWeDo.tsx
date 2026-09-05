import { PageHead } from '@/pages/PageHead'
import { Pillars } from '@/components/sections/Pillars'
import { Roles } from '@/components/sections/Roles'

/**
 * `/what-we-do` — what we take responsibility for, then what you can buy.
 *
 * Roles and Pillars were already the contiguous run "What we do" owned in the
 * bar, so the page is that run — but no longer in that order; see the note at
 * the sections themselves. Pillars is the catalogue and it carries `#platforms`,
 * which the drawer links to directly.
 */
export function WhatWeDo() {
  return (
    <>
      <PageHead title="What we do" />
      {/* WHAT YOU CAN BUY, THEN THE SCOPE IT IS BOUGHT UNDER — and the order
          is reversed from what shipped. Roles ("Scope") opened this page and
          Pillars ("What you can buy") followed.

          A reader who arrives on `/what-we-do` from the bar is asking what is on
          offer, and Pillars is the answer to that question; Scope is the answer
          to the one after it, which is what Norrin is on the hook for once you
          have bought. Leading with the qualification and following with the
          offer is the order of a contract, not of a page.

          IT ALSO PUTS THE HEAVIER SECTION FIRST. Pillars is 2.46 screens and
          Roles 0.73, so the page now opens with its substance rather than with a
          single row of cards.

          §1.5 still holds and was re-checked at 25% rather than assumed: Pillars
          is a full-bleed surface band with a three-up column set, Roles is a
          heading-left/slider-right split on the page ground running off the
          gutter. Swapping two silhouettes that already differ does not make them
          agree. */}
      <Pillars />
      <Roles />
    </>
  )
}
