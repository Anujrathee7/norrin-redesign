import { PageHead } from '@/pages/PageHead'
import { Work } from '@/components/sections/Work'
import { Roles } from '@/components/sections/Roles'
import { Proof } from '@/components/sections/Proof'
import { Thinking } from '@/components/sections/Thinking'

/**
 * `/work` — the customer cases, then the track record they came out of.
 *
 * PROOF MOVED HERE FROM COMPANY, and it is the one change the split makes to
 * the nav taxonomy that was already there. A track record is evidence ABOUT the
 * work: read beside the cases it came from it is corroboration, read under
 * "Company" it is a second, quieter set of claims in a section about who we
 * are. It is also what balances the split — Work alone was 0.78 of a screen
 * and Company was 4.7, which is one page too thin and one too long.
 */
export function WorkPage() {
  return (
    <>
      <PageHead title="Work" />
      <Work />
      {/* WHAT WE TAKE RESPONSIBILITY FOR, DIRECTLY UNDER THE CUSTOMERS.

          It was half of `/what-we-do` and spent one commit on `/` beneath
          Pillars. This is the better home for it and the reason is what the
          section answers: "what we take responsibility for" is a reply to "who
          did you do this for and how did it go", not to "what does this cost".
          The cases make the claim and this is the shape of the commitment behind
          them, so it reads as the same paragraph continuing.

          The two halves of the old `/what-we-do` are now on different pages, and
          that is the point rather than fallout: they were adjacent because one
          nav item owned them both, not because they answered the same question.

          §1.5 — Work is a full-bleed fixed night band with a card pile breaking
          its right edge; Roles is page-ground, heading left, with a slider
          running out past the container's gutter. Two silhouettes that were
          never going to agree, but checked at 25% rather than assumed, because
          this pairing has never been rendered before. */}
      <Roles />
      <Proof />
      {/* THINKING CAME HERE FROM ITS OWN ROUTE, WHICH IS NOW DELETED.
          `/thinking` was one 0.91-screen section, and a route that thin is a
          page you reach the bottom of before the bar has finished condensing.
          It reads better as the third movement of this one: who we did it for,
          what it produced, and what we think about it — evidence, then outcome,
          then argument, which is the order a reader who got this far is already
          travelling in.

          `ThinkingPage.tsx` is deleted rather than left unrouted, and the bar's
          Thinking item went with it. Everything it pointed at is still reachable
          — the Work drawer carries the row, and `#thinking` resolves on this
          page. */}
      <Thinking />
    </>
  )
}
