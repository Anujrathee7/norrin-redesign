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
/**
 * ANCHORED POSES MUST NOT IDLE — pass `animated={false}`.
 *
 * `.nori--float` translates the drawing vertically forever. A pose placed by
 * one of these anchors is placed to TOUCH something, and a drawing that is
 * bobbing is a drawing that spends most of its time not touching it: measured
 * at ~8px off the rule it was sitting on, which at a 112px mascot is most of
 * the contact. Anchored poses get their motion from the section moving around
 * them, not from moving on their own.
 *
 * That rule is about the FLOAT specifically, and it is not a ban on motion.
 * The float translates, and translation moves the contact point. A ROTATION
 * about the contact point does not: `[data-scroll='nori-sway']` in index.css
 * takes one of these anchors as its `--pivot` and rocks the figure around the
 * thing it is holding, which is why the anchored poses are no longer static
 * while their feet, hips and fingers stay exactly where they were put.
 *
 * `hold` carries one further restriction: the drawing contains its OWN rule, in
 * periwinkle, at this anchor height. It composes only against a rule drawn to
 * meet its ends — run against a page hairline it produces one line in two
 * colours. `sit` has no prop and rests on anything.
 */
export const NORI_ANCHOR = {
  /**
   * The ground. Every upright pose puts its feet on the same line — `feet()`
   * at y=414 in the drawings' 512 box, plus the foot ellipse's 17 radius and
   * half of the 5.5 contour, so the painted sole bottoms out at 433.75.
   *
   * Use it to stand a pose ON a rule instead of floating it above one.
   */
  stand: { y: '84.72%' },
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
