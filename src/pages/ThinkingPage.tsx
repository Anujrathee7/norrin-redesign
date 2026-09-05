import { PageHead } from '@/pages/PageHead'
import { Thinking } from '@/components/sections/Thinking'

/**
 * `/thinking` — the writing, the podcast and the vision paper.
 *
 * One section, which is what "Thinking" owned in the bar already. It is left
 * alone rather than padded out: the three drawer rows under this item all point
 * at destinations inside it, and a page that carries exactly what its nav item
 * promised is not a page that needs filling.
 */
export function ThinkingPage() {
  return (
    <>
      <PageHead title="Thinking" />
      <Thinking />
    </>
  )
}
