import { PageHead } from '@/pages/PageHead'
import { Work } from '@/components/sections/Work'
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
