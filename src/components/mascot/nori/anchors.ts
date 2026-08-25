/**
 * Where each composed pose actually touches the thing it is composed with,
 * as a percentage of the rendered box. MEASURED off the files, not guessed —
 * and measured by scanning the PAINTED pixels of each rendered drawing, not by
 * `getBBox()`. On a rotated group getBBox reports the transformed geometry box,
 * which for `lean` is 8 points left of anything actually drawn; trusting it put
 * a visible gap between the mascot and the rule it was supposed to be resting
 * against. `.shots/poses` holds the scan.
 *
 * This is what makes these poses usable without magic numbers: a section that
 * wants Nori sitting on a rule positions it by `NORI_ANCHOR.sit` rather than
 * by a hand-tuned `-translate-y-[58%]` that silently goes wrong the next time
 * the drawing is edited. If a pose file changes, this table changes with it and
 * every placement follows.
 *
 *   `y` — distance from the drawing's TOP to the contact line.
 *   `x` — distance from the drawing's LEFT to the contact edge.
 */
export const NORI_ANCHOR = {
  /** Shoulder against a vertical edge. */
  lean: { x: '10.67%' },
  /** Hips on a horizontal rule; legs dangle below it. */
  sit: { y: '64.45%' },
  /** The edge is the bottom of the drawing itself. */
  peek: { y: '100%' },
  /** The rule it carries, passing in front of the body. */
  hold: { y: '67.97%' },
  /** Where the finger ends up, for aligning the gesture with a line of type. */
  point: { x: '96.33%', y: '59%' },
} as const
