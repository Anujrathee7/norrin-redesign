import { Navigate, createBrowserRouter } from 'react-router'
import { SiteLayout } from '@/pages/SiteLayout'
import { Home } from '@/pages/Home'
import { WorkPage } from '@/pages/WorkPage'
import { CompanyPage } from '@/pages/CompanyPage'

/**
 * Three routes, and the table is still the nav taxonomy.
 *
 * The site was one document 13.6 viewport-heights tall — measured at 1512x860,
 * not estimated — with The Gap, Pillars and Proof carrying eight of those
 * screens between them. The bar already required each nav item to own a
 * CONTIGUOUS run of sections, so that its marker travelled one direction down
 * the page; that requirement is exactly what makes the runs separable, and each
 * route below is one of them.
 *
 * THE CURRENT HAND: the argument on `/`, the evidence on `/work`, and who we
 * are on `/company`. Three pages, three audiences — somebody deciding whether
 * to hire Norrin reads the first two; somebody deciding what Norrin is like
 * reads the third.
 *
 * `/what-we-do` is gone because Pillars and Roles were the whole of it and the
 * two have been split: Pillars sits under The Gap, continuing that section's
 * argument instead of restating it a click away, and Roles sits under the
 * customer cases on `/work`, where the commitment follows the claim. They were
 * adjacent because one nav item owned them both, not because they answered the
 * same question.
 *
 * `/careers` lasted one commit as a page of its own and is now half of
 * `/company`, with Thinking. The two are addressed to the same reader and
 * NorrInsights is the evidence for the claim Careers makes, so the second
 * follows from the first. It also fixes the thinness that was accepted rather
 * than answered when Careers was alone: 1.42 screens becomes ~3.3. `/thinking` and `/company` went earlier, for being
 * a single section each. Careers came back OUT of `/` in the same move that
 * brought those two in — not because it is long enough to be a page, but because
 * it addresses a different reader than every other page here.
 *
 * THE COST IS ON `/` AND IT IS NOT SMALL. Home is Hero, The Gap, Pillars and
 * Contact — measurably the longest page on the site and past the "3-4 scrolls"
 * this whole restructure started from, because The Gap alone is 3.12 screens and
 * Pillars 2.46. That is a deliberate choice about narrative, taken with the
 * number known rather than discovered.
 *
 * All three retired paths redirect rather than 404; see the routes below.
 *
 * BROWSER HISTORY, NOT HASH HISTORY, which is what puts a rewrite rule on the
 * host: a deep link to `/work` is a request a static server has no file for and
 * will 404 unless it is told to serve `index.html` at 200 instead. Both files
 * that say so ship in this repo — `public/_redirects` for Netlify and
 * Cloudflare Pages, `vercel.json` for Vercel — because getting this wrong fails
 * in the one place nobody tests: the second visit, from someone else's link.
 */
export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'work', element: <WorkPage /> },
      { path: 'company', element: <CompanyPage /> },

      /* RETIRED PATHS, KEPT AS REDIRECTS RATHER THAN DELETED.
         `/what-we-do`, `/thinking` and `/company` were all live on production
         at some point during this restructure, so a link to any of them may
         exist — in somebody's tab, a message, or an index. Without these, each
         one renders react-router's default error page, which is the worst
         possible answer: an unstyled framework screen on a site that is
         otherwise finished.
         Each points at wherever its content actually went, so the redirect is
         a real answer rather than a dump to the homepage. `replace` so the dead
         URL does not sit in history behind the live one. */
      { path: 'what-we-do', element: <Navigate to="/" replace /> },
      { path: 'thinking', element: <Navigate to="/company" replace /> },
      { path: 'careers', element: <Navigate to="/company" replace /> },
    ],
  },
])
