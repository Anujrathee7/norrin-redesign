import { Container, Grid } from '@/components/primitives/Layout'
import { footerBlurb, offices, social } from '@/data/norrin'
import { Nori } from '@/components/mascot/nori/Nori'

/**
 * Footer.
 *
 * Also the footprint section: procurement and risk functions need entity data,
 * and "is this a Finland-only supplier?" is a real objection for a buyer with a
 * Nordic or global estate. Seven offices across five countries answers it, so
 * the addresses are given properly rather than hidden behind a menu item.
 *
 * Mono throughout, hairline-ruled, no ornament.
 *
 * Deliberately not a sitemap of itself. This was three columns of eleven links,
 * six of which were aliases for two anchors — four separate labels all landing
 * on #pillars, three all landing on #thinking — plus a "Careers" link pointing at
 * a values section with no careers content. A one-page document does not need a
 * menu of its own headings, and the bar above already carries every one of them.
 * What survives is what a footer is actually for: where the company is, what it
 * is, where else it lives, and who built this.
 */

const COMPANY_LINKS = [
  { label: 'About us', href: '#proof' },
  // Was "Customer cases"; the bar calls the same section Work. One name per thing.
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

export function Footer() {
  // Group offices by country so the footprint reads as five countries, not
  // seven addresses.
  const byCountry = offices.reduce<Record<string, typeof offices[number][]>>((acc, o) => {
    ;(acc[o.country] ??= []).push(o)
    return acc
  }, {})

  return (
    <footer id="footer" data-shot="footer" className="border-t border-hairline pt-20 pb-10">
      <Container>
        {/* Footprint */}
        <Grid className="gap-y-10">
          <div className="col-span-4 md:col-span-3">
            <p className="label text-ink-3">Footprint</p>
          </div>
          <ul className="col-span-4 grid grid-cols-2 gap-x-6 gap-y-8 md:col-span-9 lg:grid-cols-5">
            {Object.entries(byCountry).map(([country, list]) => (
              <li key={country}>
                <p className="label mb-3 border-b border-hairline pb-2 text-ink">{country}</p>
                <ul className="space-y-2.5">
                  {list.map((o) => (
                    <li key={o.city}>
                      <p className="ui text-ink-2">{o.city}</p>
                      <p className="caption text-ink-3">{o.address}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Grid>

        {/* Navigation */}
        <Grid className="mt-20 gap-y-10 border-t border-hairline pt-12">
          <div className="col-span-4 md:col-span-3">
            <a href="#top" className="flex w-fit items-center gap-2.5 text-accent">
              <Nori pose="wave" size={24} crop="head" animated={false} />
              <span className="wordmark text-ink">
                Norrin
              </span>
            </a>
            <p className="caption mt-5 max-w-[38ch] text-ink-3">{footerBlurb.text}</p>
          </div>

          <nav aria-label="Company" className="col-span-2 md:col-span-2 md:col-start-6">
            <p className="label mb-4 text-ink-3">Company</p>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="ui text-ink-2 transition-colors hover:text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Same construction as its sibling — these are the only links that
              leave the site, so they are the last ones that should lack a landmark. */}
          <nav aria-label="Elsewhere" className="col-span-2 md:col-span-2 md:col-start-9">
            <p className="label mb-4 text-ink-3">Elsewhere</p>
            <ul className="space-y-2.5">
              {social.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    className="ui text-ink-2 transition-colors hover:text-ink"
                    rel="noreferrer"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Grid>

        {/* Legal */}
        <div className="mt-16 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-ink-3">© {new Date().getFullYear()} Norrin</p>
          {/* Was `.label` — an 18-word sentence in 11px uppercase mono at 0.14em,
              wrapping to three lines, while the addresses above it are set in sans.
              `.label` is for indices, units and telemetry, not for prose. */}
          <p className="caption max-w-[62ch] text-ink-3">
            Speculative redesign concept — not affiliated with or endorsed by Norrin. Built from
            publicly available information.
          </p>
        </div>
      </Container>
    </footer>
  )
}
