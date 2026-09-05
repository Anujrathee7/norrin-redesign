import { createBrowserRouter } from 'react-router'
import { SiteLayout } from '@/pages/SiteLayout'
import { Home } from '@/pages/Home'
import { WhatWeDo } from '@/pages/WhatWeDo'
import { WorkPage } from '@/pages/WorkPage'

/**
 * Three routes, down from five, and the table is still the nav taxonomy.
 *
 * The site was one document 13.6 viewport-heights tall — measured at 1512x860,
 * not estimated — with The Gap, Pillars and Proof carrying eight of those
 * screens between them. The bar already required each nav item to own a
 * CONTIGUOUS run of sections, so that its marker travelled one direction down
 * the page; that requirement is exactly what makes the runs separable, and each
 * route below is one of them.
 *
 * IT WAS FIVE AND TWO OF THEM WERE TOO THIN TO BE PAGES. `/thinking` was one
 * 0.91-screen section and `/company` one 0.77-screen section; both were under
 * the shared footer's own height, so each was mostly chrome. Thinking joined
 * `/work` (evidence, outcome, argument) and Careers joined `/` — see the notes
 * in `WorkPage.tsx` and `Home.tsx`. Proof had already moved from Company to
 * Work, which is what left Company holding one section in the first place.
 *
 * THE CONSEQUENCE IS STATED RATHER THAN DISCOVERED: the bar is two primary
 * items now. Everything the other two carried is still reachable — the Work
 * drawer lists what is on that page, and Careers and the offices are in the
 * footer's Company column — but a two-item bar is a real change to how the site
 * presents itself and is not a side effect of tidying routes.
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
      { path: 'what-we-do', element: <WhatWeDo /> },
      { path: 'work', element: <WorkPage /> },
    ],
  },
])
