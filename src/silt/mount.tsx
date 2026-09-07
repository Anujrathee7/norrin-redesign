import type { ReactElement } from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { SiteLayout } from '@/pages/SiteLayout'
import { Home } from '@/pages/Home'
import { WorkPage } from '@/pages/WorkPage'
import { CompanyPage } from '@/pages/CompanyPage'
import '@/index.css'

/**
 * Mounts for Silt captures. NOT part of the site.
 *
 * Two things the app's own entry does that a component-level capture does not:
 * it imports `index.css` — which is the entire design system, so a section
 * rendered without it is unstyled text — and it puts a router above everything,
 * which Nav, Contact and Footer all read. A memory router rather than the real
 * browser one, because the capture frame's own URL is not the route we want.
 *
 * `document.documentElement.classList.add('js')` mirrors `main.tsx`: every
 * reveal's hidden state is scoped to that class, so without it the captures
 * render in the degraded always-visible mode rather than the real one.
 */
document.documentElement.classList.add('js')

export function siteAt(path: string): ReactElement {
  const router = createMemoryRouter(
    [
      {
        element: <SiteLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'work', element: <WorkPage /> },
          { path: 'company', element: <CompanyPage /> },
        ],
      },
    ],
    { initialEntries: [path] },
  )
  return <RouterProvider router={router} />
}
