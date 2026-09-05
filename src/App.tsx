import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router'
import { Compare } from '@/components/sections/Compare'
import { StyleGuide } from '@/components/sections/StyleGuide'
import { GapBackdrops } from '@/components/sections/GapBackdrops'
import { FontLab } from '@/components/sections/FontLab'
import { router } from '@/routes'

/**
 * PAGE ORDER IS STILL NAV ORDER — it is just spread over five documents now.
 *
 * The bar marks the item you are reading with its own length of the bottom
 * rule. That only reads as wayfinding if the marker travels one way: it used to
 * light positions 4 → 1 → 2 → 1 → 3 on the way down, because "Company" pointed
 * at Proof (then the second section) while "What we do" owned Roles and
 * Pillars, which sat either side of Work. Two backward jumps. The fix was to
 * give each nav item a CONTIGUOUS run of sections, in bar order.
 *
 * That constraint is why this split was possible at all, and it is worth
 * saying plainly: a run of adjacent sections owned by one nav item is already a
 * page in everything but URL. The runs became the routes — five of them at
 * first, three now that the two thinnest were merged into their neighbours:
 *   /            → Hero, The Gap, Pillars, Contact
 *   /work        → Work, Roles, Proof
 *   /company     → Thinking, Careers
 *
 * What forced it was length. The single document measured 13.6 viewport-heights
 * at 1512x860 — measured with Playwright, not estimated — with The Gap (3.12),
 * Pillars (2.46) and Proof (2.46) carrying eight of those screens between them.
 * The repo owner's reading: "everything is congested in one page, each page
 * should be 3-4 scrolls, right now it is up to 10."
 *
 * ONE THING MOVED: Proof, from Company to Work. Careers used to be why Company
 * owned two sections; it now owns only itself, and Proof sits with the cases it
 * is evidence for. The narrative each page tells is the same one the scroll
 * told: the problem, then what we take responsibility for and what you can buy,
 * then who we did it for and what that record is, then the thinking, then who
 * we are — and the ask at the end of every one of them, because Contact is
 * rendered by the layout rather than by a page. See `SiteLayout.tsx`.
 *
 * The route table itself lives in `routes.tsx`, not here, because this file's
 * remaining job is the one below: deciding whether the hash has taken the
 * document over before a router ever gets a say.
 */
/**
 * Three surfaces hang off the hash rather than living in the page.
 *
 * `#mascots` was one of them — a workbench rendering every Nori pose against
 * both grounds. It is gone: Nori was deleted from the codebase on the user's
 * instruction, so the surface, the component and its CSS all went with it.
 *
 * `#compare`: it is FOR sending. It puts each section of
 * norrin.com beside the same section rebuilt, because a redesign shown on its
 * own asks the viewer to hold the original in their head and do the diff
 * themselves, and a cold link does not get that much patience. It stays off the
 * page for the same reason the lab does — the homepage should make the argument,
 * not talk about making it.
 *
 * `#backdrops` is a workbench for one open question: whether The Gap carries
 * a picture behind it, and if so which one and where the type goes. Seven
 * rendered options rather than a description of seven options, for the same
 * reason the style guide is a page — a backdrop is not a thing you can judge by
 * reading about it.
 *
 * `#styleguide` is the system itself, rendered rather than written. It exists
 * because a spec for type, colour and spacing is the one thing you cannot judge
 * by reading it, and because a guide that restates values copied out of the
 * stylesheet starts lying the first time a token moves. Every number on it is
 * measured off the live DOM. It is a review gate, which is why it is here and
 * not in `docs/`.
 *
 * STILL GATED ON THE HASH, AND STILL AHEAD OF THE ROUTER, though the sentence
 * that used to justify it — "the project has no router and needs none" — is no
 * longer true. Three reasons it did not become four more routes when the site
 * became five pages. They are not nav items and must never appear as URLs
 * anyone could arrive at by guessing. They are documented as hashes in
 * CLAUDE.md §6, and `tools/compare.mjs`, `tools/backdrops.mjs` and the style
 * guide probes navigate to them by that name. And a hash needs no rewrite rule,
 * so a review surface keeps working on any static host even if the SPA
 * fallbacks below ever get lost.
 *
 * `hashchange` does not fire for the hash the page LOADED with, so the initial
 * value is read from `location` directly and not defaulted to empty.
 *
 * A surface OWNS the whole document when its hash matches — it is not a section
 * of any page — so anchors like `#contact` must never collide with these four
 * names. They do not: every in-page anchor is a section id, and `compare` is
 * not one. The listener is what makes the reverse true as well — clicking
 * `#contact` on any route sets a hash these four do not match, so the router
 * keeps the document and nothing swaps out underneath the reader.
 */
const SURFACES: Record<string, string> = {
  '#compare': 'compare',
  '#styleguide': 'styleguide',
  '#backdrops': 'backdrops',
  '#fonts': 'fonts',
}

function readSurface() {
  if (typeof window === 'undefined') return null
  return SURFACES[window.location.hash] ?? null
}

/**
 * THE STATE IS THE SURFACE, NOT THE HASH.
 *
 * This used to hold `window.location.hash` and derive the surface from it on
 * every render, which meant every in-page anchor on the site — `#contact` in the
 * bar, `#gap` in the hero, `#footer` in the drawer — wrote a new string into
 * React state and re-rendered the whole application, router included, for a
 * scroll that changed nothing this hook cares about. Storing the derived value
 * ends that: the four anchors all map to `null`, and React bails out of a
 * re-render when the next state is the value it already holds.
 *
 * WHAT THIS IS NOT, recorded because it was written down as a fix before it was
 * checked: it is not what made in-page anchors work again after a back-restore.
 * That bug looked exactly like a stray re-render and this change did not move it
 * one pixel. The cause was Chrome firing `popstate` for same-document fragment
 * navigations and react-router restoring a saved scroll position off the back of
 * it, and the fix is the `getKey` on `<ScrollRestoration />` — see the note in
 * `SiteLayout.tsx`. This one stands on its own merits, which are smaller and
 * honest: not re-rendering the application on every anchor click.
 */
function useHashSurface() {
  const [surface, setSurface] = useState(readSurface)
  useEffect(() => {
    const onChange = () => setSurface(readSurface())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return surface
}

export default function App() {
  const surface = useHashSurface()
  if (surface === 'compare') return <Compare />
  if (surface === 'styleguide') return <StyleGuide />
  if (surface === 'backdrops') return <GapBackdrops />
  if (surface === 'fonts') return <FontLab />

  return <RouterProvider router={router} />
}
