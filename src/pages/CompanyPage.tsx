import { PageHead } from '@/pages/PageHead'
import { Careers } from '@/components/sections/Careers'

/**
 * `/company` — who we are, from the side a candidate reads it from.
 *
 * Company owned Careers and Proof; Proof is on `/work` now (see the note
 * there), so what is left is the part that is genuinely about the company as an
 * employer rather than as a supplier. The drawer keeps a row pointing at
 * `/work#proof` so the track record is still reachable from under "Company" —
 * it moved, it did not disappear.
 */
export function CompanyPage() {
  return (
    <>
      <PageHead title="Company" />
      <Careers />
    </>
  )
}
