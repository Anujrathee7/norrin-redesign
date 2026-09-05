import { PageHead } from '@/pages/PageHead'
import { Thinking } from '@/components/sections/Thinking'
import { Careers } from '@/components/sections/Careers'

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
 * The order is that argument: how we think, then come and do it with us. Careers
 * closes the page because it is the ask, the same way Contact closes `/`.
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
      <Thinking />
      <Careers />
    </>
  )
}
