import { PageHead } from '@/pages/PageHead'
import { Careers } from '@/components/sections/Careers'
import { Thinking } from '@/components/sections/Thinking'
import { Values } from '@/components/sections/Values'

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
      {/* VALUES SECOND, BETWEEN THE TWO IT EXPLAINS.

          `/company` was two sections deep and the thinnest route on the site.
          This is the block Norrin's own `/about-us` prints under "We believe
          in" and "Ways of working" - already sourced in `norrin.ts`, half of
          it never rendered - so the page gains real material rather than a
          third restatement of what is already here.

          IT SITS BETWEEN CAREERS AND THINKING RATHER THAN AFTER BOTH. Careers
          is the invitation and Thinking is the evidence that the invitation is
          worth taking; the values are the claim that sits under both, so they
          read as the ground the other two stand on rather than as a coda
          nobody scrolls to.

          §1.5, AND THE COST IS STATED RATHER THAN HIDDEN: Careers and Values
          now share the page's ground where the order before this alternated
          ground, surface, ground. Their OUTLINES still share nothing - Careers
          is a two-column split with a photograph, Values is a heading held
          left against a tab row on its own rule - which is what §1.5 actually
          measures. Thinking's surface panel still breaks the run underneath
          them. */}
      <Values />
      <Thinking />
    </>
  )
}
