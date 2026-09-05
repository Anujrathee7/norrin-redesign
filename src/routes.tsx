import { createBrowserRouter } from 'react-router'
import { SiteLayout } from '@/pages/SiteLayout'
import { Home } from '@/pages/Home'
import { WhatWeDo } from '@/pages/WhatWeDo'
import { WorkPage } from '@/pages/WorkPage'
import { ThinkingPage } from '@/pages/ThinkingPage'
import { CompanyPage } from '@/pages/CompanyPage'

/**
 * Five routes, and the table is the nav taxonomy that was already in the bar.
 *
 * The site was one document 13.6 viewport-heights tall — measured at 1512x860,
 * not estimated — with The Gap, Pillars and Proof carrying eight of those
 * screens between them. The bar already required each nav item to own a
 * CONTIGUOUS run of sections, so that its marker travelled one direction down
 * the page; that requirement is exactly what makes the runs separable, and each
 * route below is one of them.
 *
 * The one taxonomy change is Proof, which moves from Company to Work. See the
 * note in `WorkPage.tsx`.
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
      { path: 'thinking', element: <ThinkingPage /> },
      { path: 'company', element: <CompanyPage /> },
    ],
  },
])
