import { PageHead } from '@/pages/PageHead'
import { Work } from '@/components/sections/Work'
import { Roles } from '@/components/sections/Roles'
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
      {/* ONE SURFACE FROM THE BAR TO THE FOOTER.

          Work was the only `bg-surface` block on this page; Roles and Proof set
          no background, so the body's `--ground` showed through them. At 1920
          that read as a second, darker band starting at y=665 — Roles' own 56px
          top padding — directly under the customers, which the repo owner asked
          to be gone: the surface should carry all the way to the footer.

          On a wrapper rather than on Roles and Proof one at a time, because it
          is a property of the page, not of either section, and a section added
          here later inherits it instead of reopening the band. It is a plain
          block — not positioned, not a scroll container — so it changes no
          containing block: Proof's sticky pin still clamps to its own box.

          The footer stays on `--ground`. Its top hairline is where the page
          ends, and a ground change landing on that rule is a boundary rather
          than a band. */}
      <div className="bg-surface">
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
          its right edge; Roles, on the same surface now (see the wrapper
          above), heading left, with a slider running out past the container's
          gutter — the outline differs even where the colour no longer does. Two silhouettes that were
          never going to agree, but checked at 25% rather than assumed, because
          this pairing has never been rendered before. */}
      <Roles />
      {/* TRACK RECORD LAST, WHICH IS WHERE IT ENDS UP RATHER THAN WHERE IT
          STARTED. Thinking sat under it for two commits and has gone to
          `/company` with Careers; with that out, Proof is the page's floor and
          that is the right place for it. The page runs claim, commitment,
          evidence — who we did it for, what we take on, and the record that
          backs both — so the numbers are the last word rather than a middle
          movement. */}
      <Proof />
      </div>
    </>
  )
}
