import { PageHead } from '@/pages/PageHead'
import { Work } from '@/components/sections/Work'
import { Proof } from '@/components/sections/Proof'

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
    </>
  )
}
