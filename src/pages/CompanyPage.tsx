import { PageHead } from '@/pages/PageHead'
import { Careers } from '@/components/sections/Careers'
import { Thinking } from '@/components/sections/Thinking'

/**
 * Company: how we think, and the invitation that follows from it.
 *
 * ---------------------------------------------------------------------------
 * WHY THESE TWO ARE ONE PAGE
 * ---------------------------------------------------------------------------
 * Thinking and Careers are addressed to the same reader. Everything on `/` and
 * `/work` is written for somebody deciding whether to hire Norrin; these two are
 * written for somebody deciding what Norrin is like — what it publishes, what it
 * argues, and whether they want to work there. NorrInsights is the evidence for
 * the claim Careers is making, so putting them on one page lets the second
 * follow from the first instead of restating it.
 *
 * The order was "how we think, then come and do it with us" for one commit and
 * is now the other way round: Careers opens and Thinking follows. A page reached
 * from a bar item called Company should start on who Norrin is, and the writing
 * then supports that claim rather than delaying it.
 *
 * ---------------------------------------------------------------------------
 * "COMPANY", AND WHY THE NAME MOVED AGAIN
 * ---------------------------------------------------------------------------
 * This page has been `/company` (Careers plus Proof), then nothing, then
 * `/careers` (Careers alone), and is `/company` again — now holding Thinking and
 * Careers. The name follows the contents rather than the history: "Careers" stops
 * describing a page that opens with a writing and podcast section, and "Thinking"
 * stops describing one that closes on an invitation to apply. Company is the
 * umbrella both sit under, and it is a word Norrin's own navigation already uses.
 *
 * Both retired names redirect here rather than 404 — see `routes.tsx`. `/careers`
 * in particular was live on production, and a careers link is exactly the kind
 * somebody keeps.
 *
 * It is ~3.3 screens with the footer, which is the first page on this site to
 * land inside the 3–4 the whole restructure was aiming at.
 */
export function CompanyPage() {
  return (
    <>
      <PageHead title="Company" />
      {/* CAREERS FIRST, THINKING UNDER IT — reversed from the order this page
          shipped with. The page is named Company and reached from a bar item
          called Company, so it should open on who Norrin is rather than on what
          it published; Thinking then reads as the evidence for the invitation
          instead of a preamble to it. */}
      <Careers />
      {/* VALUES LIVE INSIDE CAREERS NOW, not as a section of their own.

          They were a separate band between Careers and Thinking — Norrin's own
          "We believe in" and "Ways of working" from `/about-us`. The repo owner
          merged the two into one photograph band, the invitation on the left
          and the values as tabs on the right, which also settles the §1.5 cost
          the old order carried: Careers and Values shared the page's ground
          back to back. Now an inverse photograph band is followed by
          Thinking's surface panel, and the two share nothing. */}
      <Thinking />
    </>
  )
}
