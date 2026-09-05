import { PageHead } from '@/pages/PageHead'
import { Roles } from '@/components/sections/Roles'
import { Pillars } from '@/components/sections/Pillars'

/**
 * `/what-we-do` — what we take responsibility for, then what you can buy.
 *
 * Roles and Pillars were already the contiguous run "What we do" owned in the
 * bar, so the page is the run, unchanged and in the same order. Roles names the
 * scope; Pillars is the catalogue underneath it, and it carries `#platforms`,
 * which the drawer links to directly.
 */
export function WhatWeDo() {
  return (
    <>
      <PageHead title="What we do" />
      <Roles />
      <Pillars />
    </>
  )
}
