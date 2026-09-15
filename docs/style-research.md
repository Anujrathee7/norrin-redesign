# Style research — the reference set

Companion to `research-brief.md`, which covers Norrin itself. This one covers the
four Finnish tech consultancies used as the comparison set, and what was extracted
from them.

Every value below was read from the sites' **own CSS bundles**, not inferred from
rendered pages. Where a value could not be found it says so rather than estimating.

Read 2026-09-01. Sources: `reaktor.com`, `futurice.com`, `vincit.com`, `solita.fi`.

---

## 1. WHY THIS SET

Norrin sells enterprise AI and data consulting to large Nordic enterprises. Reaktor,
Futurice, Vincit and Solita sell the same thing to the same buyer from the same
country. Solita is the closest direct competitor — a Finnish data & AI consultancy.

Design-studio sites would show better craft but would not survive contact with
enterprise content, so they were left out deliberately.

---

## 2. WHAT THE SET AGREES ON

These are unanimous, 4/4. They are the strongest evidence available and should be
treated as settled.

| Agreement | Evidence |
|---|---|
| **No decorative box-shadow.** Separation is hairlines or nothing. | Reaktor: 5 shadow declarations, all form-state rings. Futurice: 4, all focus rings. Vincit: 3, header only. Solita: a real 4-step elevation scale at `.04`–`.06` alpha, i.e. near-invisible, and barely used on the homepage. |
| **No duotone, tint, filter or overlay on photographs.** | All four. The only `filter:` uses anywhere are `invert()` / `grayscale()` on *client logos*, to normalise them. Solita and Reaktor both do this; Vincit conspicuously does not. |
| **No numbered section markers (01 / 02 / 03).** | Grepped all four. Zero occurrences on any of them. |
| **No decorative gradients.** | Reaktor: zero `gradient(` in 12 stylesheets. Futurice and Solita: only functional two-stop state/hover gradients. Vincit's only gradient is a six-stop loop inside a GLSL shader. |
| **Hard corners on images and cards.** | Reaktor: zero radius on any image. Solita: `border-radius:0` except pills and circular portraits. Vincit: pills only. Futurice is the one partial exception at `12px`. |

**All five already hold in this build.** They are not changes to make; they are
confirmation that the existing rules are defensible, and they should be stated as
such rather than re-litigated.

---

## 3. WHERE THE SET DISAGREES — and which side to take

### Section rhythm: uniform padding, varied composition

This is the finding that **overturned an earlier decision in this project**, which
was to vary vertical padding by section role.

| | Section padding |
|---|---|
| Reaktor | `clamp(72px, 6vw, 144px)` top and bottom. **Uniform**, no homepage overrides. |
| Solita | One token: `--block-spacing: clamp(10rem, calc(9.42rem + 2.56vw), 22.5rem)`. **Uniform**, every section. |
| Futurice | Varied *by module type* — 48/64/80/120px margins, bands get 64/96/120px padding. |
| Vincit | 0 / 32 / 42 / 80 / 113 / 142 / 160 / 166 / **266**px, plus fractional values like `13.92px`. |

Vincit's varied spacing is not a system — the fractional pixels are the fingerprint
of someone dragging handles in a visual editor. It is the weakest page of the four.

Solita is the strongest, and it is perfectly regular. Its variety comes from three
other levers:

1. **Theme inversion** — two `theme-dark` bands break up nine light ones.
2. **Column-span asymmetry** — 6/6, 4/8, 4-of-9, 8-offset-5. Almost nothing centred.
3. **Full-height blocks** — hero and carousel take `min-h-screen`.

**Conclusion: keep vertical rhythm uniform. Put the variety in the composition.**

### Display type: a characterful face, rationed hard

| | Display face |
|---|---|
| Reaktor | **Larken Thin** — a decorative *serif*, weight 100, the only master loaded — against Scto Grotesk A for body. Headlines up to 94px at `line-height:100%`. A true serif/grotesk pairing. |
| Vincit | A bespoke Studio Feixen cut. The Display face appears **exactly once on the entire homepage**, on the single word "Plan". |
| Solita | Sharp Sans Display No1 vs Sharp Sans — same superfamily, deliberate pairing, `font-feature-settings: "ss01"` on headlines. |
| Futurice | Manrope only. One variable family doing everything, weights 400–700 including 425 and 450. |

Three of four run a deliberate display/body pairing rather than one family. None uses
a script — but Reaktor proves a *decorative* display face survives in enterprise
context, and Vincit proves a one-word display accent is a real technique.

**This supports the planned script accent**, used at display size on a single word,
with the grotesk carrying all real reading.

### Faces and names

| | Named employees on the homepage |
|---|---|
| Solita | **Four**, credited: Ossi Lindroos (CEO), Marika Piispanen, Juha-Pekka Joutsenlahti, Kseniia Bacho. Circular crops, and `figcaption` carrying name, role, venue and date. |
| Reaktor | **Zero.** One candid team photo near the bottom, uncaptioned, alt text `"reaktor people"`. |
| Futurice | **Zero.** One candid workshop photo, filename an unrenamed iPhone export, no names. |
| Vincit | **Zero.** A commissioned 2026 brand shoot exists, three frames are used as article thumbnails, and one of the three thumbnails beside them is Stocksy stock. |

Every one of these firms sells people. Only Solita puts a name to a face.

**Naming the three real contacts in `Contact.tsx` and giving two of them portraits
puts this page level with the best of the set and ahead of the other three.**

### Heroes

Reaktor's hero is **text only** — no image, no video, no canvas: 300px of black, a
20px `HELLO!` at 65% opacity, and one 94px serif sentence. Futurice's hero image is a
**flat vector illustration**, not a photograph. Solita's is a **ragged three-video
portrait grid** where the third column is deliberately half-height. Vincit's is a
100vh looping video over a WebGL ribbon.

**A text-only hero is well-precedented by the strongest typographic site in the set.**
That supports leaving the hero photograph-free after the mascot is removed.

---

## 4. MOTION

| | Approach |
|---|---|
| Reaktor | GSAP + ScrollTrigger + SplitText + anime.js + Flickity (loaded twice) + jQuery 1.7.1. Ships `body{opacity:0 !important}` as the starting state. **No `prefers-reduced-motion` anywhere** — so a reduced-motion or JS-failure visitor gets a blank page. |
| Futurice | **No animation library at all.** CSS transitions toggled by IntersectionObserver, four named easing tokens, one choreographed 2.4s page-load overture, and a proper `prefers-reduced-motion` branch collapsing it to a cross-fade. |
| Solita | GSAP + ScrollTrigger, but only **8 parallax targets** on the whole page. Ten named easing curves, fourteen named transition groups, nine short keyframes. |
| Vincit | A bespoke three.js/Perlin ribbon; exactly **one** `@keyframes` in 15 stylesheets; no scroll-reveal system at all — content is just there. |

Reaktor's `body{opacity:0}` with no reduced-motion fallback is the single worst
decision found anywhere in the set, and it is a direct vindication of this project's
choice to drop GSAP for native `animation-timeline`: a ScrollTrigger misfire there
does not degrade, it blanks the page.

**But note Vincit: no scroll-reveal system whatsoever, and the page does not suffer
for it.** Content simply being present is a legitimate option. This build currently
has 17 `enter` effects plus drift, pan, pop, curtain, condense and draw — denser than
three of the four references. Thinning it is supported.

---

## 5. COPY

Neither Reaktor nor Futurice nor Vincit nor Solita ships **any Finnish** on its
homepage. Vincit's `/fi` 301-redirects to English; Solita's `/fi/` returns 403. Worth
knowing, since Norrin ships five locales — that is a genuine point of difference for
Norrin, not a gap to close.

The best lines in the set, for register calibration:

- **Solita:** "Regulated markets. Critical systems. Nasty integrations. We get excited about the kind of complexity that might scare away others."
- **Solita:** "We wonder." — set at `headline-xl`, `max-w-[10ch]`, standing alone as a section label.
- **Futurice:** "Doing things differently has given us the expertise to do it again. And again."
- **Reaktor:** "Hello!" — the whole hero eyebrow, set at 20px above a 94px sentence.

The pattern: short declaratives and fragments, and the confidence to let one very
short line occupy display scale. Norrin's own "Enterprise AI is won in production"
belongs in that company.

---

## 6. WHAT THIS CHANGES IN THE BUILD

1. **Keep vertical rhythm uniform.** Drop the plan to vary padding by section role.
   Get variety from column asymmetry and full-height blocks instead.
2. **Strip the 01–08 section numbering.** Zero of four references use it. Keep it only
   where content is a genuine sequence.
3. **Proceed with the script accent**, one word at display size — Vincit's precedent.
4. **Proceed with named contacts and portraits** — Solita's precedent, and it beats
   three of the four. *Done:* the Contact band now puts the ask and a form on the left
   and the three people on the right, portraits stepped in two columns, each with
   their published email and phone. Separated by heading, space and type contrast,
   never rules — as Siili (/contact), Bekk (/kontakt) and Futurice (/contact) do.
5. **Leave the hero photograph-free** — Reaktor's precedent.
6. **Thin the motion.** Denser here than three of the four references.
7. **Do not change** the no-shadow, no-gradient, no-filter, hard-corner rules. All four
   references agree with what this build already does.
