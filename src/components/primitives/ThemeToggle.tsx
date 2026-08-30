import { cx } from '@/lib/cx'
import { setTheme, useTheme } from '@/hooks/useTheme'

/**
 * Light / dark.
 *
 * A single icon button in the bar's utilities, sized and padded exactly like
 * the hamburger next to it. Deliberately NOT a track-and-thumb switch: this
 * system has no shadows and one decorative device, and a sliding knob is a
 * second small moving object in the chrome, two hundred pixels above the
 * production line — the same argument that killed the runner-up navbar.
 *
 * The glyph shows where you are GOING, not where you are: in dark you see a
 * sun, and pressing it gives you the sun. An unlabelled icon that names the
 * current state reads, to everyone who has not been told, as a button that
 * does the thing it is showing. The accessible name says the same thing in
 * words, so the two never disagree.
 *
 * Two glyphs stacked in one grid cell rather than one path being re-pointed:
 * the crossfade needs both present, and a `d` swap cannot cross-fade. The
 * rotation is 90° and small — the sun turns up as it arrives — and the global
 * reduced-motion override collapses it to a cut without this file knowing.
 */
export function ThemeToggle({ inverted = false }: { inverted?: boolean }) {
  const theme = useTheme()
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      // Not aria-pressed: this is not a control that is on or off, it is a
      // control that swaps between two named states, and the label carries
      // which one you get. `aria-live` is deliberately absent — the label
      // changes as a consequence of a press the user just made.
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cx(
        'control grid p-2',
        inverted ? 'text-inverse-ink-2 hover:text-inverse-ink' : 'text-ink-2 hover:text-ink',
      )}
    >
      <Glyph show={dark} label="sun">
        {/* Sun. The disc is the same 4.6 radius as the locale chevron's optical
            weight; rays are separate strokes so they keep the 1.4 line the
            hamburger and the chevron are both drawn at. */}
        <circle cx="12" cy="12" r="4.4" />
        <path d="M12 2.4v2.2M12 19.4v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.4 12h2.2M19.4 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
      </Glyph>
      <Glyph show={!dark} label="moon">
        {/* Crescent. One closed path, not a disc with a disc punched out of it:
            a mask would need a fill, and everything else in the bar is a
            stroke. */}
        <path d="M20.4 14.2A8.6 8.6 0 0 1 9.8 3.6a8.6 8.6 0 1 0 10.6 10.6Z" />
      </Glyph>
    </button>
  )
}

/**
 * Both glyphs occupy the same grid cell, so the button never changes size and
 * nothing in the utilities row shifts as the icon swaps.
 */
function Glyph({
  show,
  label,
  children,
}: {
  show: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-glyph={label}
      className={cx(
        'col-start-1 row-start-1 transition-[opacity,transform] duration-300 ease-(--ease-entrance)',
        show ? 'scale-100 rotate-0 opacity-100' : 'pointer-events-none scale-75 -rotate-90 opacity-0',
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}
