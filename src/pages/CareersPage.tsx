import { PageHead } from '@/pages/PageHead'
import { Careers } from '@/components/sections/Careers'

/**
 * Careers: a page of its own, on the second attempt.
 *
 * It has been three things in this restructure. It was `/company`'s only
 * section; then, when that route was judged too thin to be a page, it moved onto
 * `/` under The Gap; and it is now its own route again on the repo owner's call.
 *
 * The thinness objection has not gone away — this is ~2.2 screens with the
 * footer, the smallest page on the site — and it is accepted rather than
 * answered, because the audience argument beats the length one. Everything else
 * on this site is written for somebody deciding whether to hire Norrin. This is
 * written for somebody deciding whether to work there, and burying that four
 * sections down a page addressed to buyers makes it hard to link, hard to find,
 * and read in the wrong frame of mind.
 *
 * A short page a candidate can be sent a link to is worth more than a tall page
 * they have to scroll past a service catalogue to reach. It is left short rather
 * than padded: the honest amount of careers content this build has is one
 * section, and inventing more would be inventing content (§3).
 */
export function CareersPage() {
  return (
    <>
      {/* WITHOUT THIS THE ROUTE HAS NO h1 AND NO TITLE OF ITS OWN, and both were
          measured rather than assumed: `tools/audit.mjs` reported
          `page-has-heading-one` here in light and dark, closed and at the top —
          four groups — because Careers opens at `h2` like every section does,
          and the tab said "Norrin" the same as every other page.

          It was missed when this page was created, which is the argument for
          `PageHead` existing at all: a route is not a section, and the two things
          a route owns have to be added deliberately every time one is added. */}
      <PageHead title="Careers" />
      <Careers />
    </>
  )
}
