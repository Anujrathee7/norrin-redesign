import { Container, Grid, SectionHeader } from '@/components/primitives/Layout'
import { Card } from '@/components/primitives/Card'
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
 * HEADING LEFT, CARDS RIGHT
 * ---------------------------------------------------------------------------
 * A directed layout: the heading holds a narrow column on the left and the four
 * roles sit as cards in a 2x2 to its right, on a lifted surface with a hairline
 * and a soft radius.
 *
 * The split is the composition's whole job. A section header that runs the full
 * width and then hands off to a grid underneath is the shape six other sections
 * on this page already have; a header that stays beside its content for the
 * whole section is a different silhouette, and it puts information on the left
 * and the right of one horizontal band rather than stacking everything down a
 * single axis (§1.4).
 *
 * 2x2, NOT A ROW OF FOUR. Four cards abreast inside a seven-column span are
 * 180px wide and every claim sets to five or six lines.
 *
 * THE CLAIM IS ON TOP AND THE ROLE IS AT THE BOTTOM. `mt-auto` pins the role
 * name to the card's floor, so a card reads as a statement resolving into the
 * name for it — "We run the platforms underneath." → *Infrastructure partner*.
 * It also turns the four ragged claim lengths (53, 68, 32 and 137 characters)
 * from damage into air: every card in a row stretches to the tallest, and with
 * the names all sitting on the floor the leftover space reads as deliberate
 * rather than as a short column that failed to fill.
 *
 * NO SHADOW, ON PURPOSE. §2.7 allows one only for a genuinely floating layer —
 * a dropdown, a dialog, a sheet. These are page content, so they separate from
 * the ground the way everything else here does: a hairline and a one-step lift
 * from `--ground` to `--surface`. That lift is deliberately small in both
 * themes (#0e120f → #161b17 dark, #f8f7f3 → #f1f0ea light).
 *
 * `--radius-panel`, not `--radius-section`. The section step is for a whole
 * section lifted off the ground as one plate; these are component-scale objects
 * and 14px is the step the scale already carries for "anything that opens or
 * frames at component scale".
 *
 * ---------------------------------------------------------------------------
 * THE RULE
 * ---------------------------------------------------------------------------
 * One rule opens the section, running the full width of the viewport. It is a
 * sibling of `Container` rather than a child, so it crosses the container edge
 * by the gutter on both sides — 82px each at 1512 — and leaves the frame
 * (§1.6). It is also the page's own device at section scale: solid means
 * committed, and this section is the page's definition of what Norrin commits
 * to.
 *
 * `draw` is scaleX from `transform-origin: left center`, which is what makes it
 * draw rather than fade. It opens ahead of the cards so the line is already
 * across by the time they arrive — one orchestrated gesture rather than five
 * scattered ones.
 *
 * ---------------------------------------------------------------------------
 * WHAT WAS REMOVED, AND WHY IT IS NOT COMING BACK
 * ---------------------------------------------------------------------------
 * THE OLD INSET PANEL. This section used to be a single `--surface` plate with
 * `--radius-section` and a hairline, on the argument that it was "the first
 * section that is an OBJECT rather than a plane" and therefore broke the page's
 * band rhythm. Measured, it did the opposite: the panel's background computed
 * to `rgb(22, 27, 23)` and Pillars — the 2112px band that starts 113px below it
 * — computes to `rgb(22, 27, 23)`. Same token, same colour. The floating object
 * and the plane under it were one continuous field with a notch cut in it,
 * which is the §1.5 failure the panel was introduced to fix.
 *
 * The cards are not that mistake repeated at smaller scale. One plate the width
 * of the section reads as a plane and merges with the plane below it; four
 * separated objects with ground visible between and around them read as
 * objects, and the section's own ground still flips to Pillars' surface at the
 * boundary. Checked at 25% zoom, which is the only scale that question can be
 * answered at.
 *
 * THE SEAM RULE. A one-pixel accent rule at `mt-24 -mb-24 md:mt-36 md:-mb-36`,
 * described in twenty-five lines of comment as "seam 3 — the taper, and the
 * last of them". It has never rendered. A negative bottom margin on a last
 * child shortens the content box; it does not cancel the parent's
 * padding-bottom, which is still laid out after it. Measured at 1512: the
 * rule's box sat at y=4833 and the section's `overflow-clip` box ended at
 * y=4802 — thirty-one pixels outside its own clip, on every page load since it
 * was written. The decaying series it claimed to close had two members, not
 * three.
 *
 * THE PROPORTIONAL COLUMN TRACKS. A previous pass sized four flat columns by
 * their claim lengths — `minmax(11rem, 53fr) minmax(11rem, 68fr) …` — so that
 * line counts, and therefore column bottoms, came out equal. It worked;
 * measured, all four paragraphs set to 55px. It is gone because the layout it
 * solved is gone, not because it failed: cards in a stretched grid already
 * share a floor, and the names are pinned to it. Recorded so nobody re-derives
 * it from scratch.
 *
 * ---------------------------------------------------------------------------
 * STILL TRUE
 * ---------------------------------------------------------------------------
 * Not numbered inside the section, and not hoverable. These are four
 * responsibilities held at the same time, not four steps — numbering them
 * asserts a sequence that does not exist, and "03" would mean one thing here
 * and another in the section eyebrow beside it. Nothing here opens, so nothing
 * here gets a hover affordance.
 *
 * No dimming either, which the reference this layout was directed from uses to
 * favour its first card. §3: text is never faded for effect — ancestor opacity
 * folds into contrast maths and genuinely fails it — and past the mechanics,
 * four responsibilities held at the same time cannot have one of them turned
 * up.
 */
export function Roles() {
  return (
    <section
      id="roles"
      data-shot="roles"
      aria-labelledby="roles-heading"
      className="overflow-clip py-20 md:py-28"
    >
      {/* Outside `Container` on purpose — see THE RULE above. */}
      <div aria-hidden="true" className="h-px">
        <span
          data-scroll="draw"
          style={{
            ['--scrub-from' as string]: 'cover 4%',
            ['--scrub-to' as string]: 'cover 34%',
          }}
          className="block h-px w-full bg-hairline-strong"
        />
      </div>

      <Container>
        <Grid className="mt-14 md:mt-16">
          {/* The split is `lg` and up only. At 834 a four-column heading is
              250px and the seven-column card region is 440px, which puts each
              card at 208px — narrower than the phone layout it is meant to be
              an improvement on. Below `lg` the heading takes the full width and
              the cards follow underneath. */}
          <div className="col-span-4 mb-12 md:col-span-12 lg:col-span-4 lg:mb-0">
            <SectionHeader index="02" label="Scope" id="roles-heading" gap="none">
              What we take responsibility for.
            </SectionHeader>
          </div>

          {/* `col-start-6`, leaving column five empty. The grid's own 24px
              gutter is already the gap BETWEEN two cards; if it were also the
              gap between the heading and the cards, the heading would read as a
              fifth cell of the same grid rather than as the other side of a
              split. The empty column is what makes it a split. */}
          <ul
            data-scroll="drift-slow"
            className="col-span-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-12 md:gap-5 lg:col-span-7 lg:col-start-6"
          >
            {roles.map((r, i) => (
              <li
                key={r.id}
                data-scroll="enter"
                style={{
                  // Rises rather than slides. The old entrance travelled in from
                  // the left by four fifths of the gutter, which suited flat
                  // columns hanging off a rule; a card that already has an edge
                  // on every side has nowhere to have come from sideways.
                  ['--enter-y' as string]: '28px',
                  // Staggered in reading order — across the top row, then
                  // across the bottom. Each item is still timed against its own
                  // view range rather than the list's: at `lg` the four share a
                  // scroll fate, but at phone width this is a tall single column
                  // and a shared range would spend the last card's slot long
                  // before that card is anywhere near the screen.
                  ['--scrub-from' as string]: `cover ${14 + i * 5}%`,
                  ['--scrub-to' as string]: `cover ${14 + i * 5 + 26}%`,
                }}
              >
                {/* The box, the padding, the hairline and the floor rule now
                    live in `.card` / `Card.tsx`, shared with the customer
                    stack. The values moved across unchanged, so this is a
                    refactor with a zero-pixel diff and not a restyle — proved
                    with `--clip=roles` before and after, not asserted. What
                    stays on the `<li>` is what the `<li>` owns: the grid cell
                    and its own arrival. */}
                <Card body={r.claim} floor={r.role} />
              </li>
            ))}
          </ul>
        </Grid>
      </Container>
    </section>
  )
}
