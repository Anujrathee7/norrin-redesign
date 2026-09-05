import { Container, Grid, SectionHeader } from '@/components/primitives/Layout'
import { CardSlider } from '@/components/primitives/CardSlider'
import { roles } from '@/data/norrin'

/**
 * The four roles.
 *
 * Norrin states these in a single dense sentence on their homepage — as an
 * integrator, a deployer, an infrastructure partner, and the transformation
 * lead. It is the clearest articulation of scope they have written and it is
 * buried in body copy.
 *
 * ---------------------------------------------------------------------------
 * HEADING ON TOP, ROW CENTRED UNDERNEATH
 * ---------------------------------------------------------------------------
 * The heading runs across the top of the section and the roles sit in a
 * three-across slider centred beneath it: one card popped out at the front, one
 * legible card either side, and real controls under the row. The mechanism and
 * every reason it is shaped the way it is live in `CardSlider.tsx`; what belongs
 * here is why this section has one at all, and what the arrangement costs.
 *
 * IT USED TO BE HEADING LEFT, CARDS RIGHT. That split was the section's answer
 * to §1.5 — a header that stays beside its content for the whole section is a
 * different silhouette from a header that runs the full width and hands off to a
 * grid underneath, which is the shape most of this page already has. Moving the
 * row underneath gives that up, and it is worth saying plainly rather than
 * quietly: this section now opens the way its neighbours open. What carries the
 * silhouette instead is the row itself. A three-across slider with a popped-out
 * centre card, arrows level with it in the outer margins and a dot row beneath
 * traces nothing else on this page — TheGap above it is a pinned scene and
 * Pillars below it is a ruled surface band. Checked at 25% zoom, which is the
 * only scale that question can be answered at.
 *
 * A ROW, NOT A 2x2. The grid was the honest layout for four claims that are all
 * true at once, and it is still what a reduced-motion reader gets — every part
 * of the slider lives inside `prefers-reduced-motion: no-preference` and the
 * grid is the resting state. What the row buys is a focal point: four equal
 * cards have no subject. What it costs is that only three of the four are on
 * screen at a time, which is payable because the fourth is behind the front card
 * rather than deleted, because it rotates in on its own, and because a reader
 * can reach any of them directly with a dot.
 *
 * ---------------------------------------------------------------------------
 * THE CARD
 * ---------------------------------------------------------------------------
 * CENTRED, LIKE THE CUSTOMER CARD, BUT WITHOUT ITS QUOTATION MARK. The two share
 * the `.card` shell and its composition: copy centred, the name on the floor at
 * the left. What Scope does NOT take is the quote mark. These four claims are
 * Norrin's own words about itself, not quoted matter, and a quotation mark over
 * them would say something untrue about where they came from.
 *
 * THE CLAIM IS ON TOP AND THE ROLE IS AT THE BOTTOM. `mt-auto` pins the role
 * name to the card's floor, so a card reads as a statement resolving into the
 * name for it — "We run the platforms underneath." → *Infrastructure partner*.
 * It also turns the four ragged claim lengths (53, 68, 32 and 137 characters)
 * from damage into air: all four cards share one grid cell, so every one of them
 * stretches to the tallest, and with the names sitting on the floor the leftover
 * space reads as deliberate rather than as a short column that failed to fill.
 *
 * ONE SHADOW, ON THE FRONT CARD ONLY. §2.7 allows a shadow for "a genuinely
 * floating layer" and refuses it everywhere else. A card lifted out of a row of
 * three is that case, and it is the cue that turns the front card from the
 * middle item into the active one. It is deliberately small and it is on nothing
 * else in the section; the flanking cards separate on a hairline like everything
 * else on this page. The value and the alpha are argued at the declaration.
 *
 * `--radius-panel`, not `--radius-section`. The section step is for a whole
 * section lifted off the ground as one plate; these are component-scale objects
 * and 14px is the step the scale already carries for "anything that opens or
 * frames at component scale".
 *
 * ---------------------------------------------------------------------------
 * WHAT WAS REMOVED, AND WHY IT IS NOT COMING BACK
 * ---------------------------------------------------------------------------
 * THE OPENING RULE — REMOVED, ON THE USER'S CALL. A one-pixel `--hairline-strong`
 * span ran the full width of the viewport at the top of this section, drawn on
 * scroll by `data-scroll="draw"`. Unlike the seam rule below it DID render, and
 * it did the two jobs written down for it: it crossed the container edge by the
 * gutter on both sides, which was one of the page's frame-breaks (§1.6), and it
 * opened the section with a committed line ahead of the cards.
 *
 * It is gone because the user does not want a line there. Two consequences are
 * paid for rather than left to be discovered. The §1.6 count is one lower, and
 * this section no longer contributes a full-bleed one — the slider's arrows sit
 * in the page gutter beyond the container's content edge, which is a smaller
 * gesture, so the page's budget should be re-counted rather than assumed. And
 * the rule was carrying 1px of layout plus the 56/64px of margin under it that
 * existed to clear it; that space is now spent as the section's own top padding
 * instead, so the join does not jump.
 *
 * THE SEAM RULE. A one-pixel accent rule at `mt-24 -mb-24 md:mt-36 md:-mb-36`,
 * described in twenty-five lines of comment as "seam 3 — the taper, and the last
 * of them". It never rendered, which is the difference between it and the
 * opening rule above. A negative bottom margin on a last child shortens the
 * content box; it does not cancel the parent's padding-bottom, which is still
 * laid out after it. Measured at 1512: the rule's box sat at y=4833 and the
 * section's `overflow-clip` box ended at y=4802 — thirty-one pixels outside its
 * own clip, on every page load since it was written.
 *
 * THE OLD INSET PANEL. This section used to be a single `--surface` plate with
 * `--radius-section` and a hairline, on the argument that it was "the first
 * section that is an OBJECT rather than a plane". Measured, it did the opposite:
 * the panel's background computed to `rgb(22, 27, 23)` and Pillars — the band
 * that starts below it — computes to `rgb(22, 27, 23)`. Same token, same colour.
 * The floating object and the plane under it were one continuous field with a
 * notch cut in it, which is the §1.5 failure the panel was introduced to fix.
 *
 * THE PROPORTIONAL COLUMN TRACKS. A previous pass sized four flat columns by
 * their claim lengths — `minmax(11rem, 53fr) minmax(11rem, 68fr) …` — so that
 * line counts, and therefore column bottoms, came out equal. It worked;
 * measured, all four paragraphs set to 55px. It is gone because the layout it
 * solved is gone, not because it failed. Recorded so nobody re-derives it.
 *
 * ---------------------------------------------------------------------------
 * STILL TRUE
 * ---------------------------------------------------------------------------
 * Not numbered inside the section. These are four responsibilities held at the
 * same time, not four steps — numbering them asserts a sequence that does not
 * exist, and "03" would mean one thing here and another in the section eyebrow
 * above it. The dots are a position indicator for a rotation, not an order.
 *
 * No dimming, which the reference this layout was directed from uses to favour
 * its centre card. §3: text is never faded for effect — ancestor opacity folds
 * into contrast maths and genuinely fails it. The flanking cards recede on size
 * and on a measured tone instead, and every word on them clears AA against the
 * surface it is painted on.
 */
/**
 * THE ROW IS A SET OF TONES, NOT FOUR OF THE SAME CARD.
 *
 * `TONES` is the FLAT layout's composition — what renders under reduced motion,
 * where all four cards are on screen at once and their arrangement is the whole
 * design. Four cards, three tones, so one tone repeats — and the one that
 * repeats is the quiet one. Repeating a loud tone would say the two cards
 * carrying it are a pair, which is a claim about the content that is not true;
 * repeating the paper tone says nothing, because paper is what a card is when it
 * is not making a point of its surface.
 *
 * WHERE THEY SIT. `dark, paper, paper, signal` puts the two loud tones on the
 * leading diagonal at 2x2 — dark in the top-left corner the eye starts at,
 * signal in the bottom-right corner it leaves from — with the two quiet ones on
 * the other diagonal. Collapsed to one column it is the same decision seen
 * end-on: the loud pair bookends the stack and the quiet pair sits between them.
 * Every other arrangement fails one of the two. Putting both loud tones in the
 * top row leaves a dead bottom row at 2x2; putting them adjacent anywhere makes
 * them a pair rather than a span.
 *
 * IN THE SLIDER THE TONE IS KEYED TO POSITION INSTEAD, and it has to be. A
 * position-keyed tone cannot follow the item: if the tones travelled with the
 * cards, the row would be a different arrangement of colour every five seconds.
 * So the row holds still and the cards move through it — sun at the front, and a
 * muted surface on the two flanking cards and on the one behind them. That
 * binding lives in `index.css` at SCOPE — THE ROW, because it is keyed to a
 * depth this file does not compute.
 *
 * The argument above survives the move intact, which is why it was made this way
 * rather than by picking new tones. The tone that repeats is still the quiet
 * one, and it now repeats for a structural reason rather than a chosen one: the
 * two flanking cards are the same depth, so they are the same tone. And sun at
 * the front is what makes the active card unmistakable without a drop of opacity
 * (§3) — it is the only saturated object in the section, on both grounds,
 * because all these tones are fixed in both themes.
 *
 * NO COLOUR IS WRITTEN HERE (§2.4). The call site names a tone; every value
 * behind that name lives in the token layer at the end of `index.css`, which is
 * also where the dark tone is flagged as pending the §4 palette pick.
 */
const TONES = ['dark', 'paper', 'paper', 'signal'] as const

export function Roles() {
  return (
    <section
      id="roles"
      data-shot="roles"
      aria-labelledby="roles-heading"
      // THE ASYMMETRIC PADDING IS GONE, AND THE SPLIT IS WHAT RETIRED IT.
      //
      // It used to run `pt-8 md:pt-10` — about a third of the page's usual
      // `py-20 md:py-28` — and the argument was sound at the time: this section
      // followed The Gap, whose own `pb-28 md:pb-12` was already paying for the
      // join, and an opening rule that needed air above it had been deleted, so
      // keeping the old value would have left a hole exactly the size of the
      // thing taken out of it.
      //
      // Every clause of that argument assumed a section with another section
      // above it. Roles now OPENS `/what-we-do`, so what is above it is not The
      // Gap's bottom padding, it is a 72px opaque fixed header. At `md:pt-10`
      // the "Scope" eyebrow rendered at y=40 and the bar covered it outright —
      // measured, not inferred, and invisible in both themes.
      //
      // So it takes the page's usual value, which is also what every other
      // route-opening section already clears the bar with: Work and Thinking
      // open at 112px and were never affected. One number, one reason, no
      // special case.
      className="overflow-clip py-20 md:py-28"
    >
      <Container>
        <Grid>
          {/* Seven of twelve. The heading runs across the top now, but it does
              not run the full width — a full-bleed h2 with a row under it is the
              band shape §1.5 is about, and stopping the measure at column seven
              leaves the right-hand fifth of the section open above the row. */}
          <div className="col-span-4 md:col-span-10 lg:col-span-7">
            <SectionHeader label="Scope" id="roles-heading" gap="none">
              What we take responsibility for.
            </SectionHeader>
          </div>
        </Grid>
      </Container>

      {/* OUTSIDE `Container`, ON PURPOSE. The row is a sibling of the measure
          rather than a child of it, so the arrows sit in the page gutter beyond
          the container's content edge — 36px outside it at 1512 — and the row of
          cards gets the width the viewport can give it rather than the width the
          text measure happens to be. It is also what is left of this section's
          frame-break (§1.6) now that the opening rule is gone.

          The arrival is on this wrapper rather than on the cards. The scroll
          layer animates `transform` and the slider's positions ARE a transform,
          so on the cards the two would fight over one property on one element —
          and four staggered arrivals into a thing that then rotates on its own
          is two motion ideas in one place, which is the density §3 warns about.
          One arrival, one rotation. */}
      <div
        data-scroll="enter"
        style={{ ['--enter-y' as string]: '28px' }}
        className="mt-10 px-(--spacing-gutter) md:mt-14"
      >
        <CardSlider
          items={roles.map((r, i) => ({
            id: r.id,
            body: r.claim,
            floor: r.role,
            label: r.role,
            tone: TONES[i] ?? 'paper',
          }))}
        />
      </div>
    </section>
  )
}
