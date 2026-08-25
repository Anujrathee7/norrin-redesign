import { useEffect, useId, useRef, useState } from 'react'
import { cx } from '@/lib/cx'

/**
 * Locale switcher.
 *
 * This replaces a native `<select>`. A real select cannot be styled below the
 * control itself — the open list is drawn by the operating system, so it
 * arrived with a blue system highlight, a white panel and a hard border, on a
 * page built from warm paper, hairlines and moss. It was the one element on the
 * site that ignored the design system entirely.
 *
 * The trade for that control is that accessibility now has to be built by hand,
 * so this follows the ARIA listbox pattern properly rather than approximating
 * it with a div:
 *   - the trigger is a real button with `aria-haspopup` / `aria-expanded`
 *   - the list is `role="listbox"`, options are `role="option"` + `aria-selected`
 *   - focus moves to the list, and `aria-activedescendant` tracks the option,
 *     which is what lets arrow keys work without stealing focus per item
 *   - Home/End jump, Escape closes and returns focus to the trigger,
 *     Tab and outside clicks dismiss
 *
 * Language names are given in their own language, and each option carries a
 * `lang` attribute so a screen reader pronounces it correctly rather than
 * reading "Suomi" with an English voice.
 */

type Locale = { code: string; label: string; native: string }

const LOCALES: Locale[] = [
  { code: 'en', label: 'En', native: 'English' },
  { code: 'fi', label: 'Fi', native: 'Suomi' },
  { code: 'sv', label: 'Se', native: 'Svenska' },
  { code: 'th', label: 'Th', native: 'ไทย' },
  { code: 'vi', label: 'Vi', native: 'Tiếng Việt' },
]

export function LocaleMenu({ inverted = false }: { inverted?: boolean }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(0)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const baseId = useId().replace(/:/g, '')

  const optionId = (i: number) => `${baseId}-opt-${i}`

  useEffect(() => {
    if (!open) return
    // Focus the list itself; aria-activedescendant carries the rest.
    listRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open])

  const close = (returnFocus = true) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  const choose = (i: number) => {
    setSelected(i)
    setActive(i)
    close()
  }

  const onListKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActive((i) => (i + 1) % LOCALES.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActive((i) => (i - 1 + LOCALES.length) % LOCALES.length)
        break
      case 'Home':
        e.preventDefault()
        setActive(0)
        break
      case 'End':
        e.preventDefault()
        setActive(LOCALES.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        choose(active)
        break
      case 'Escape':
        e.preventDefault()
        close()
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setActive(selected)
      setOpen(true)
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${LOCALES[selected].native}`}
        onClick={() => {
          setActive(selected)
          setOpen((o) => !o)
        }}
        onKeyDown={onTriggerKeyDown}
        className={cx(
          'control label flex items-center gap-1.5 px-2.5 py-2',
          inverted ? 'text-inverse-ink-2 hover:text-inverse-ink' : 'text-ink-2 hover:text-ink',
        )}
      >
        <span aria-hidden="true">{LOCALES[selected].label}</span>
        <svg
          width="9"
          height="6"
          viewBox="0 0 9 6"
          fill="none"
          aria-hidden="true"
          className={cx(
            'transition-transform duration-300 ease-(--ease-entrance)',
            open && 'rotate-180',
          )}
        >
          <path d="M1 1.25 4.5 4.75 8 1.25" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>

      {open ? (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-label="Language"
          aria-activedescendant={optionId(active)}
          onKeyDown={onListKeyDown}
          className={cx(
            'panel absolute top-full right-0 z-10 mt-2 w-[11.5rem] p-1.5 outline-none',
            inverted ? 'focus-visible:border-signal' : 'focus-visible:border-accent',
          )}
        >
          {LOCALES.map((l, i) => (
            <li
              key={l.code}
              id={optionId(i)}
              role="option"
              aria-selected={selected === i}
              lang={l.code}
              onClick={() => choose(i)}
              onPointerEnter={() => setActive(i)}
              className={cx(
                'flex cursor-pointer items-center gap-2.5 rounded-control px-2.5 py-2 ui transition-colors duration-100',
                // The pointer/keyboard cursor is a background shift, never the
                // browser's blue — that was the whole problem with the select.
                // Now that the row is a rounded shape the shift has something to
                // fill, so it reads as a cursor rather than as a full-bleed stripe.
                inverted
                  ? active === i
                    ? 'bg-inverse-tint text-inverse-ink'
                    : 'text-inverse-ink-2'
                  : active === i
                    ? 'bg-tint text-ink'
                    : 'text-ink-2',
              )}
            >
              <span
                aria-hidden="true"
                // Moss measures 1.40:1 on forest, so on an inverted bar the
                // selected mark was drawn and then not visible. Sun is the
                // band's stand-in for moss, as it is for the focus ring.
                className={cx(
                  'h-1.5 w-1.5 shrink-0',
                  selected === i ? (inverted ? 'bg-signal' : 'bg-accent') : 'bg-transparent',
                )}
              />
              {/* Fixed-width code column keeps the language names on a single
                  left edge; right-aligning them left a ragged rag. */}
              {/* --ink-2, not --ink-3: this column is the one place a label sits
                  on the hover wash, where --ink-3 measures 4.53:1 — a pass with
                  no margin left in it. */}
              <span
                className={cx('label w-5 shrink-0', inverted ? 'text-inverse-ink-2' : 'text-ink-2')}
              >
                {l.label}
              </span>
              <span>{l.native}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
