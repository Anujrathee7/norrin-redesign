import { useEffect } from 'react'

/**
 * The two things a page owns that a section never had to: a title and an h1.
 *
 * Both are defects the split CREATED, and both were measured rather than
 * assumed. `node tools/audit.mjs` against each of the four new routes reported
 * `page-has-heading-one` in light and dark, closed and drawer-open — six groups
 * per route — because the sections it renders all open at `h2`. And the audit's
 * structure block printed the identical `<title>` on all five documents, which
 * is WCAG 2.4.2 failing in the one place axe cannot see it: a rule that only
 * checks a title EXISTS cannot notice that five pages share one.
 *
 * ON `document.title` BEING SET IN AN EFFECT: this is a client-rendered SPA
 * with no SSR, so there is no other moment to set it in. The tab, the history
 * entry and the bookmark all read it, and all three were previously telling the
 * reader they had never left the homepage.
 *
 * ON THE h1 BEING `sr-only`, WHICH IS A COMPROMISE AND IS FLAGGED AS ONE.
 * CLAUDE.md §1.3 says to set the h1 like you mean it, and this one is not set
 * at all — it is a screen-reader-only line naming the page. The honest fix is
 * for the FIRST SECTION of each route to open at `h1` instead of `h2`, since
 * that heading is already the largest thing on the page and is already what the
 * page is about. That lives in `SectionHeader` and in the section files, which
 * this change does not own. Until then the choice is between a hidden h1 and no
 * h1, and no h1 means a screen-reader user landing on `/work` is given a list of
 * sibling h2s with nothing above them saying which page they are on.
 *
 * `/` does not use this: the hero sets a real, visible, 94px h1, which is what
 * §1.3 is describing and what the other four should eventually look like.
 */
export function PageHead({ title }: { title: string }) {
  useEffect(() => {
    const previous = document.title
    document.title = `${title} — Norrin`
    return () => {
      document.title = previous
    }
  }, [title])

  return <h1 className="sr-only">{title}</h1>
}
