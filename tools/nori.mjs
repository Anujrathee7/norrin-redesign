/**
 * NORI — the mascot generator.
 *
 * Every pose is the same character doing something different, so the character
 * lives here once and each pose states only what it is doing. Editing the head
 * means editing it once instead of in twelve files.
 *
 * Output is plain, readable SVG in `public/`. The app never sees this file.
 * Run it with `node tools/nori.mjs`.
 *
 * ------------------------------------------------------------------------
 * THE ART STYLE — soft contour, not hard ink
 * ------------------------------------------------------------------------
 * The earlier Nori was drawn the way an icon is drawn: a flat white shape
 * inside a heavy near-black outline, every stroke the same weight, no volume
 * anywhere. That reads as a pictogram. Four rules move it to a drawing:
 *
 *   1. THE CONTOUR IS DARK AND THIN. `#26283F` at 5.5 units. A pale blue-grey
 *      outline was tried and it is wrong: on a white character it washes out
 *      and the figure stops holding its own shape. Dark, but THIN — weight is
 *      what made the first version read as a pictogram, not colour.
 *   2. NO SHADING MASSES. Soft `#E9ECF5` fills were tried inside the head, body
 *      and tail to give them volume. On a white character they read as a blue
 *      tint across the whole figure rather than as light, and they made the
 *      arms — themselves white — impossible to pick out. Form comes from the
 *      contour and from where shapes overlap, nothing else.
 *   3. INTERIOR LINES ARE LIGHTER THAN THE CONTOUR. `#AFB7CE`, thinner. A
 *      belly seam drawn at contour weight reads as a crack.
 *   4. THE SILHOUETTE HAS TO SURVIVE 24px. Cat ears, not a wire antenna —
 *      at nav size the eyes are two dots and the outline is all that is left.
 *   5. THE EYES CARRY THE CHARACTER, AND THEY ARE BIGGER THAN FEELS SENSIBLE.
 *      Each eye is 72 units across on a 252-unit head — 29% of the face, set
 *      wide enough to nearly touch the cheeks and low enough to sit in the
 *      bottom third. Undersized, well-spaced eyes are the single most common
 *      way a cute character comes out looking merely tidy.
 *
 * PROPORTION, which the style sits on top of: head 228 units, body 118. A head
 * roughly two thirds of the figure is the whole chibi trick, and the eyes sit
 * BELOW the head's centre line — high-set eyes read as adult.
 */
import { writeFileSync } from 'node:fs'

/* ---------------------------------------------------------------------- */
/* Palette                                                                 */
/* ---------------------------------------------------------------------- */

const LINE = '#26283F' // outer contour — dark, but thin
const LINE_SOFT = '#B9BFD2' // interior seams — always much lighter than LINE
const WHITE = '#FFFFFF'
const SHADE = '#E9ECF5' // soft volume inside a form
const SHADE_DEEP = '#D8DEEE'
const EYE_TOP = '#2E3354'
const EYE_BOT = '#12152A'
const ACCENT = '#AEB6E8' // periwinkle: bud, ear inners, panel marks
const ACCENT_DEEP = '#8B95D6'
const BLUSH = '#F7D6E6'
const PANEL = '#F4F6FC'
const MOON = '#FBE7A6'

/* ---------------------------------------------------------------------- */
/* Anatomy — every number the poses share                                  */
/* ---------------------------------------------------------------------- */

/**
 * The face: a pear. Narrow across the crown, full at the cheeks, tucked back in
 * at the chin.
 *
 * It replaced a squircle, and the reason is the same one that governs the eye
 * position: weight low in a face reads as young, weight high reads as adult. A
 * rounded rectangle is symmetric top to bottom and therefore reads as neither —
 * a tidy container with features on it.
 *
 * It is also NARROWER than the squircle was at eye level (236 units against
 * 252), which is why the eyes moved inward and the cheeks moved up. Features
 * fitted to the old outline hang off the edges of this one.
 */
const HEAD_PATH =
  'M134 176 C134 108 186 82 256 82 C326 82 378 108 378 176 C378 244 352 318 256 318 C160 318 134 244 134 176 Z'
const HEAD = { x: 134, y: 82, w: 244, h: 236 }
const MID = 256
// 156 wide against a 244 head. It was widened to 188 once, to give the arms
// somewhere to live, and that was the wrong trade: a wider torso flattens the
// head-to-body ratio and the whole figure goes squat. The ratio is the cuteness;
// the arms were made narrow instead.
const BODY = { x: 178, y: 288, w: 156, h: 118, r: 54 }
const FEET_Y = 414
const EYE = { y: 226, dx: 68, rx: 36, ry: 40 }
const SHOULDER = { l: 186, r: 326, y: 320 }

// Sentinels. `limb` wraps its output so `pose` can find the arms and move them
// behind the torso; `BODY_MARK` is a string the torso is guaranteed to contain.
const ARM_TAG = '\u0001'
const BODY_MARK = 'clipBody-anchor'

const W = 5.5 // outer contour weight
const W_IN = 3.5 // interior seam weight

/** Shared defs. Every file carries its own copy; they are standalone assets. */
const defs = `  <defs>
    <linearGradient id="eye" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${EYE_TOP}"/>
      <stop offset="1" stop-color="${EYE_BOT}"/>
    </linearGradient>
    <clipPath id="clipHead">
      <path d="${HEAD_PATH}"/>
    </clipPath>
    <clipPath id="clipBody">
      <rect x="${BODY.x}" y="${BODY.y}" width="${BODY.w}" height="${BODY.h}" rx="${BODY.r}"/>
    </clipPath>
  </defs>`

// No ground shadow either. It was the same blue and it pooled under every pose.
const groundShadow = () => ''

/**
 * Cat ears.
 *
 * This is the third head-top this character has had and the first one that
 * works. The long wire antenna read as an insect feeler; the little horns that
 * replaced it came out as two nubs, because their bases sat below the crown and
 * the head — drawn after them — covered everything but the tips.
 *
 * Big ears fix the proportion problem as well as the cuteness one. The head is
 * a 252-unit squircle with nothing above it, which leaves the silhouette flat
 * on top; ears reaching to y=30 give it a shape you can recognise at 24px, when
 * the eyes have long since turned into two dots.
 *
 * They are drawn BEFORE the head so their bases are covered by it and the join
 * needs no masking. `tilt` droops them — sleep and read use it.
 */
function catEars(tilt = 0) {
  const t = tilt * 0.35
  const ear = (dir) => {
    const x = (v) => 256 + dir * (v - 256)
    return [
      `  <path d="M${x(174)} ${162 - t * 0.2} C${x(140)} ${104 + t * 0.4} ${x(126)} ${56 + t} ${x(134)} ${34 + t * 1.4} C${x(176)} ${52 + t} ${x(216)} 74 ${x(244)} 100 C${x(218)} 112 ${x(194)} 132 ${x(174)} 162 Z" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}" stroke-linejoin="round"/>`,
      `  <path d="M${x(180)} ${144 - t * 0.2} C${x(154)} ${102 + t * 0.4} ${x(142)} ${68 + t} ${x(147)} ${52 + t * 1.4} C${x(178)} ${66 + t} ${x(206)} 82 ${x(226)} 100 C${x(206)} 110 ${x(192)} 124 ${x(180)} 144 Z" fill="${ACCENT}"/>`,
      `  <path d="M${x(176)} ${130 - t * 0.2} C${x(158)} ${100 + t * 0.4} ${x(148)} ${76 + t} ${x(152)} ${60 + t * 1.4} C${x(170)} ${74 + t} ${x(186)} 86 ${x(200)} 98 Z" fill="${WHITE}" opacity=".35"/>`,
    ].join('\n')
  }
  return ear(1) + '\n' + ear(-1)
}

// The old side tabs are gone: a character with cat ears on top and rounded tabs
// on the sides has four ears.
const ears = ''

/** The head, with its volume shaded in rather than left flat. */
const head = `  <path d="${HEAD_PATH}" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}" stroke-linejoin="round"/>`

const body = [
  `  <rect id="clipBody-anchor" x="${BODY.x}" y="${BODY.y}" width="${BODY.w}" height="${BODY.h}" rx="${BODY.r}" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}"/>`,
  // The belly seam, at interior weight. At contour weight it reads as a crack
  // across the body rather than as a soft fold.
  `  <path d="M214 314 Q256 344 298 314" stroke="${LINE_SOFT}" stroke-width="${W_IN}" stroke-linecap="round" fill="none"/>`,
].join('\n')

/**
 * The tail.
 *
 * Drawn BEFORE the body so it emerges from behind it and needs no masking, and
 * built as a filled outline rather than a stroke: a stroked tail has the same
 * thickness at the tip as at the base, which is the one thing a tail must not
 * do. The curl reads at 40px, which the tuft detail does not, so the tuft is
 * only a shade.
 *
 * `curl` swings the tip — up for alert poses, down for sleep and read.
 */
const tail = (curl = 0) =>
  [
    `  <path d="M312 392 C358 426 420 424 444 ${390 - curl} C456 ${372 - curl} 446 ${352 - curl} 432 ${357 - curl} C420 ${361 - curl} 422 ${376 - curl} 430 ${380 - curl} C410 404 358 404 306 378 Z" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}" stroke-linejoin="round"/>`,
    `  <ellipse cx="437" cy="${370 - curl}" rx="12" ry="10" fill="${ACCENT}" opacity=".5"/>`,
  ].join('\n')

/**
 * The chest mark: Norrin's initial.
 *
 * Chosen over three alternatives — the production line, three rising bars, and
 * nothing at all. The line was the most meaningful of them and the first thing
 * to fail: at 34px a dashed segment, a crossing dot and a solid segment inside
 * a 46-unit panel collapse into a smudge. A letter degrades far better, because
 * a letterform is a shape the eye already knows.
 *
 * Set in the accent rather than filled, and kept to a 52-unit panel, so it stays
 * a mark on the belly instead of becoming a second focal point under the face.
 */
const panel = [
  `  <rect x="216" y="320" width="80" height="52" rx="18" fill="${WHITE}" stroke="${LINE}" stroke-width="5"/>`,
  `  <path d="M238 358 V334 L274 358 V334" stroke="${ACCENT_DEEP}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
].join('\n')

const foot = (cx, cy, rot = 0) =>
  [
    `  <ellipse cx="${cx}" cy="${cy}" rx="32" ry="17" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`,
    `  <path d="M${cx - 17} ${cy + 5} Q${cx} ${cy + 13} ${cx + 17} ${cy + 5}" stroke="${LINE_SOFT}" stroke-width="3.5" stroke-linecap="round" fill="none"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`,
  ].join('\n')

const feet = (lx = 214, rx = 298, y = FEET_Y, rot = 0) =>
  foot(lx, y, rot) + '\n' + foot(rx, y, -rot)

/**
 * Eyes. `look` slides the highlights, which is how the character looks at
 * something without the head being redrawn. `lid` shortens the eye from the
 * top for a downcast or sleepy read.
 */
function eyes({ look = 0, lid = 0, y = EYE.y } = {}) {
  const ry = EYE.ry - lid
  const cy = y + lid * 0.5
  const one = (cx) =>
    [
      `  <ellipse cx="${cx}" cy="${cy}" rx="${EYE.rx}" ry="${ry}" fill="url(#eye)"/>`,
      `  <ellipse cx="${cx - 2}" cy="${(cy - ry * 0.52).toFixed(1)}" rx="${(EYE.rx * 0.72).toFixed(1)}" ry="${(ry * 0.3).toFixed(1)}" fill="${WHITE}" opacity=".13"/>`,
      `  <circle cx="${cx - 10 + look}" cy="${(cy - ry * 0.34).toFixed(1)}" r="11.5" fill="${WHITE}"/>`,
      `  <circle cx="${cx + 12 + look}" cy="${(cy + ry * 0.4).toFixed(1)}" r="5.5" fill="${WHITE}" opacity=".92"/>`,
    ].join('\n')
  return one(MID - EYE.dx) + '\n' + one(MID + EYE.dx)
}

/** Closed, contented eyes. */
const eyesClosed = [
  `  <path d="M${MID - EYE.dx - 30} 222 Q${MID - EYE.dx} 252 ${MID - EYE.dx + 30} 222" stroke="${EYE_BOT}" stroke-width="9" stroke-linecap="round" fill="none"/>`,
  `  <path d="M${MID + EYE.dx - 30} 222 Q${MID + EYE.dx} 252 ${MID + EYE.dx + 30} 222" stroke="${EYE_BOT}" stroke-width="9" stroke-linecap="round" fill="none"/>`,
].join('\n')

/**
 * The nose. One small dot, level with the bottom of the eyes.
 *
 * The old face had no nose at all and a wide ink smile doing the work of one,
 * which is why it read as a mouth stuck on a blank. A dot gives the features a
 * centre to hang off, and the mouth can then be almost nothing — which is what
 * keeps the eyes the loudest thing on the character.
 */
const nose = (y = 266) => `  <ellipse cx="256" cy="${y}" rx="6" ry="5" fill="${LINE}"/>`

// Pushed out and down: the eyes now reach x148 and x364, so the old cheek
// position sat underneath them.
// Fitted to the pear, not to the old squircle: at y=278 this face is 216 wide,
// so the cheeks sit at 166 and 346 rather than out at 152 and 360.
const blush = [
  `  <ellipse cx="166" cy="278" rx="21" ry="11" fill="${BLUSH}" opacity=".8"/>`,
  `  <ellipse cx="346" cy="278" rx="21" ry="11" fill="${BLUSH}" opacity=".8"/>`,
].join('\n')

const smile = (y = 284, w = 13, d = 9) =>
  `  <path d="M${256 - w} ${y} Q256 ${y + d} ${256 + w} ${y}" stroke="${LINE}" stroke-width="5" stroke-linecap="round" fill="none"/>`

const openMouth = (cy = 286, r = 10) =>
  [
    `  <ellipse cx="256" cy="${cy}" rx="${r}" ry="${(r * 0.92).toFixed(1)}" fill="${EYE_BOT}"/>`,
    `  <ellipse cx="256" cy="${(cy + r * 0.34).toFixed(1)}" rx="${(r * 0.55).toFixed(1)}" ry="${(r * 0.38).toFixed(1)}" fill="${BLUSH}" opacity=".8"/>`,
  ].join('\n')

/**
 * A limb.
 *
 * ONE design. Whether a pose has both paws down, one up, or none is a property
 * of the POSE — it is not a different arm.
 *
 * Three things make it read as part of the animal rather than as something
 * attached to it:
 *
 *   1. IT IS DRAWN BEHIND THE BODY. `pose()` hoists every limb to just before
 *      the torso, so the arm's root is covered and only the part that extends
 *      past the outline is visible. Drawn on top — which is what every earlier
 *      version did — the rounded shoulder end sits on the belly like a sticker,
 *      and no amount of reshaping fixes that.
 *   2. NO SEPARATE PAW. The limb thickens toward the tip and stops. A paw
 *      attached as its own outlined ellipse adds a join, and a join goes
 *      ambiguous as soon as the outline weight approaches the gap it crosses.
 *   3. ONE SPLIT NEAR THE TIP. A short curve inside the shape, standing in for
 *      a thumb. That curve is the whole hand, and being interior it simply gets
 *      shorter as the drawing shrinks instead of breaking up.
 */
function limb(d, { w = 30, hand = null, handR = 0, hoist = true } = {}) {
  void handR
  const out = [
    `  <path d="${d}" stroke="${LINE}" stroke-width="${w + 2 * W}" stroke-linecap="round" fill="none"/>`,
    `  <path d="${d}" stroke="${WHITE}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`,
  ]
  if (hand) {
    // The split, set across the tip and perpendicular-ish to the limb.
    const [hx, hy] = hand
    out.push(
      `  <path d="M${(hx - w * 0.34).toFixed(1)} ${(hy - w * 0.1).toFixed(1)} Q${hx} ${(hy + w * 0.3).toFixed(1)} ${(hx + w * 0.34).toFixed(1)} ${(hy - w * 0.1).toFixed(1)}" stroke="${LINE}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`,
    )
  }
  const drawn = out.join('\n')
  // `hoist: false` for anything that is not an arm attached to the torso. The
  // seated pose draws its legs with this helper, and they belong in front of the
  // figure in the order the pose lists them — hoisting them behind the body
  // left the feet orphaned below a detached torso.
  return hoist ? ARM_TAG + drawn + ARM_TAG : drawn
}

const armsRest = [
  limb(`M${SHOULDER.l} ${SHOULDER.y} Q158 344 154 368`, { hand: [152, 377] }),
  limb(`M${SHOULDER.r} ${SHOULDER.y} Q354 344 358 368`, { hand: [360, 377] }),
].join('\n')

/** One resting arm, for the poses whose other arm is busy. */
const armRestL = limb(`M${SHOULDER.l} ${SHOULDER.y} Q158 344 154 368`, { hand: [152, 377] })

/* ---------------------------------------------------------------------- */
/* Poses                                                                   */
/* ---------------------------------------------------------------------- */

/**
 * Assemble a pose.
 *
 * Limbs are hoisted to sit immediately before the torso, wherever the pose
 * happens to list them. That is what makes an arm part of the body instead of
 * an object resting on it — see the note on `limb`. A pose with no torso in it
 * (peek is only a head) keeps its limbs where they are.
 */
function pose(parts, { box = '0 0 512 512', note = '' } = {}) {
  const flat = parts.filter(Boolean)
  const arms = []
  const rest = []
  for (const part of flat) {
    if (typeof part === 'string' && part.startsWith(ARM_TAG)) {
      arms.push(part.slice(ARM_TAG.length, -ARM_TAG.length))
    } else {
      rest.push(part)
    }
  }
  const at = rest.findIndex((part) => typeof part === 'string' && part.includes(BODY_MARK))
  if (arms.length) rest.splice(at < 0 ? rest.length : at, 0, ...arms)
  parts = rest

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" fill="none">\n` +
    (note ? `  <!-- ${note} -->\n` : '') +
    defs +
    '\n' +
    parts.join('\n') +
    '\n</svg>\n'
  )
}

const POSES = {
  wave: pose(
    [
      groundShadow(),
      catEars(),
      tail(),
      feet(),
      ears,
      body,
      panel,
      head,
      eyes({ look: 4 }),
      blush,
      nose(),
      smile(),
      armRestL,
      // Clear of the ear box (x370-412, y178-254). Drawn any lower and the hand
      // lands inside the ear and Nori appears to be scratching it.
      limb('M330 316 Q404 300 428 250', { hand: [434, 236] }),
      `  <path d="M462 216 A34 34 0 0 1 476 254" stroke="${ACCENT}" stroke-width="6" stroke-linecap="round" fill="none"/>`,
      `  <path d="M482 194 A58 58 0 0 1 502 242" stroke="${ACCENT}" stroke-width="6" stroke-linecap="round" fill="none"/>`,
    ],
    { note: 'WAVE — the greeting. Hero, contact.' },
  ),

  idea: pose(
    [
      groundShadow(),
      catEars(),
      tail(),
      feet(),
      ears,
      body,
      panel,
      head,
      eyes({ y: 210 }),
      blush,
      nose(),
      openMouth(286, 11),
      armRestL,
      limb('M330 316 Q400 306 424 274', { hand: [430, 262] }),
      `  <circle cx="438" cy="168" r="44" fill="${MOON}" stroke="${LINE}" stroke-width="${W}"/>`,
      `  <ellipse cx="450" cy="184" rx="26" ry="26" fill="#F2D98A" opacity=".5"/>`,
      `  <path d="M422 200 h32" stroke="${LINE}" stroke-width="7" stroke-linecap="round"/>`,
      `  <path d="M427 218 h22" stroke="${LINE}" stroke-width="7" stroke-linecap="round"/>`,
      `  <path d="M438 104 v-20 M492 132 l16 -14 M384 132 l-16 -14" stroke="${ACCENT_DEEP}" stroke-width="7" stroke-linecap="round"/>`,
    ],
    { note: 'IDEA — thinking, insight.' },
  ),

  laptop: pose(
    [
      groundShadow(),
      catEars(),
      tail(),
      feet(206, 306),
      ears,
      body,
      head,
      eyes({ lid: 8 }),
      blush,
      nose(),
      smile(284, 11, 8),
      limb('M190 328 Q182 352 190 374', { w: 28 }),
      limb('M322 328 Q330 352 322 374', { w: 28 }),
      `  <rect x="186" y="338" width="140" height="56" rx="14" fill="${PANEL}" stroke="${LINE}" stroke-width="${W}"/>`,
      `  <path d="M206 358 Q220 349 234 358 T262 358" stroke="${ACCENT_DEEP}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`,
      `  <path d="M212 376 Q226 368 240 376 T268 376" stroke="${ACCENT}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`,
      `  <circle cx="296" cy="364" r="5" fill="${ACCENT_DEEP}"/>`,
      `  <path d="M176 394 L336 394 L358 424 L154 424 Z" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}" stroke-linejoin="round"/>`,
      `  <path d="M190 410 H322" stroke="${LINE_SOFT}" stroke-width="3.5" stroke-linecap="round"/>`,
    ],
    { note: 'LAPTOP — build, careers.' },
  ),

  data: pose(
    [
      groundShadow(),
      catEars(),
      tail(),
      feet(),
      ears,
      body,
      head,
      eyes({ lid: 6 }),
      blush,
      nose(),
      smile(284, 11, 8),
      limb('M188 326 Q180 352 188 374', { w: 28 }),
      limb('M324 326 Q332 352 324 374', { w: 28 }),
      `  <rect x="192" y="336" width="128" height="84" rx="16" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}"/>`,
      `  <rect x="210" y="382" width="18" height="24" rx="5" fill="#CDD3F0" stroke="${LINE}" stroke-width="4"/>`,
      `  <rect x="238" y="368" width="18" height="38" rx="5" fill="${ACCENT}" stroke="${LINE}" stroke-width="4"/>`,
      `  <rect x="266" y="352" width="18" height="54" rx="5" fill="${ACCENT_DEEP}" stroke="${LINE}" stroke-width="4"/>`,
      `  <path d="M212 358 L248 344 L292 352" stroke="${ACCENT_DEEP}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
      `  <circle cx="192" cy="402" r="15" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}"/>`,
      `  <circle cx="320" cy="402" r="15" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}"/>`,
    ],
    { note: 'DATA — proof, platforms, numbers.' },
  ),

  rocket: pose(
    [
      // Streaming behind, not curled: it is under thrust.
      `  <g transform="rotate(-20 380 392)">${tail(10)}</g>`,
      catEars(),
      ears,
      body,
      panel,
      head,
      eyes({ y: 210 }),
      blush,
      nose(),
      openMouth(286, 12),
      limb('M186 314 Q120 288 100 232', { hand: [96, 218] }),
      limb('M326 314 Q392 288 412 232', { hand: [416, 218] }),
      // The flame, then the exhaust bloom. Drawn big: a small flame on a figure
      // this round reads as a stray shape rather than as thrust.
      `  <path d="M214 400 Q256 500 298 400 Z" fill="${MOON}" stroke="${LINE}" stroke-width="${W}" stroke-linejoin="round"/>`,
      `  <path d="M234 404 Q256 456 278 404 Z" fill="#FFF4CE"/>`,
      `  <circle cx="200" cy="446" r="26" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}"/>`,
      `  <circle cx="312" cy="446" r="26" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}"/>`,
      `  <circle cx="256" cy="478" r="22" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}"/>`,
      `  <path d="M96 150 v-36 M416 150 v-36 M64 208 l-26 -16 M448 208 l26 -16" stroke="${ACCENT}" stroke-width="7" stroke-linecap="round"/>`,
    ],
    { note: 'ROCKET — production. The thesis pose.' },
  ),

  sleep: pose(
    [
      groundShadow(),
      catEars(42),
      tail(-30),
      feet(),
      ears,
      body,
      panel,
      head,
      eyesClosed,
      blush,
      nose(),
      `  <ellipse cx="256" cy="290" rx="9" ry="11" fill="none" stroke="${LINE}" stroke-width="5"/>`,
      armsRest,
      `  <path d="M400 132 L426 132 L400 162 L426 162" stroke="${ACCENT_DEEP}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
      `  <path d="M436 82 L470 82 L436 122 L470 122" stroke="${ACCENT}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    ],
    { note: 'SLEEP — footer, 24/7, empty states.' },
  ),

  /* --- composed poses: drawn to meet an edge ---------------------------- */

  lean: pose(
    [
      `  <g transform="rotate(-11 256 424)">`,
      groundShadow(),
      catEars(-8),
      tail(),
      feet(222, 292, FEET_Y, 12),
      ears,
      body,
      panel,
      head,
      eyes({ look: -6 }),
      blush,
      nose(),
      smile(284, 13, 9),
      limb('M188 326 Q152 352 148 384', { hand: [147, 394] }),
      limb('M326 322 Q368 344 340 372', { hand: [332, 378] }),
      `  </g>`,
    ],
    {
      note:
        'LEAN — shoulder against a vertical edge. Tilted about the feet, one hand\n       on the hip. Contact edge is at 10.67% of the box; see NORI_ANCHOR.',
    },
  ),

  sit: pose(
    [
      `  <ellipse cx="256" cy="330" rx="86" ry="9" fill="${SHADE_DEEP}" opacity=".8"/>`,
      // Seated: the tail hangs off the edge rather than curling up behind.
      `  <g transform="translate(-30 -96) scale(0.86)">${tail(-40)}</g>`,
      limb('M224 336 Q216 372 220 398', { w: 38, hoist: false }),
      limb('M288 336 Q296 372 292 398', { w: 38, hoist: false }),
      foot(216, 414),
      foot(296, 414),
      // Scaled 0.8 about the seat. Any larger and the antenna runs off the top
      // of the box: the figure is 400 units crown to hem and the seat sits 330
      // down, so 330/400 is the ceiling.
      `  <g transform="translate(256 330) scale(0.8) translate(-256 -406)">`,
      catEars(),
      ears,
      body,
      panel,
      head,
      eyes(),
      blush,
      nose(),
      smile(),
      `  </g>`,
      limb('M186 262 Q146 296 150 322', { hand: [150, 332], handR: 16 }),
      limb('M326 262 Q366 296 362 322', { hand: [362, 332], handR: 16 }),
    ],
    {
      note:
        'SIT — hips on a rule at y=330, legs hanging below it. The seat line is a\n       fixed number so a section can align to it; see NORI_ANCHOR.',
    },
  ),

  peek: pose(
    [
      catEars(),
      ears,
      head,
      eyes({ y: 192 }),
      `  <ellipse cx="150" cy="252" rx="20" ry="10" fill="${BLUSH}" opacity=".8"/>`,
      `  <ellipse cx="362" cy="252" rx="20" ry="10" fill="${BLUSH}" opacity=".8"/>`,
      nose(234),
      `  <circle cx="186" cy="256" r="22" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}"/>`,
      `  <circle cx="326" cy="256" r="22" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}"/>`,
      `  <path d="M173 250 Q186 238 199 250" stroke="${LINE_SOFT}" stroke-width="4" stroke-linecap="round" fill="none"/>`,
      `  <path d="M313 250 Q326 238 339 250" stroke="${LINE_SOFT}" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    ],
    {
      box: '0 0 512 274',
      note:
        'PEEK — its own drawing, not a crop. The bottom of the viewBox IS the edge\n       being peeked over, so the file butts flush against a rule with no offset.',
    },
  ),

  point: pose(
    [
      groundShadow(),
      catEars(),
      tail(),
      feet(),
      ears,
      body,
      panel,
      head,
      eyes({ look: 9 }),
      blush,
      nose(),
      smile(284, 13, 9),
      armRestL,
      limb('M328 324 Q378 320 408 312', { hand: [418, 310], handR: 20 }),
      `  <path d="M438 306 L468 302" stroke="${LINE}" stroke-width="12" stroke-linecap="round"/>`,
      `  <circle cx="488" cy="299" r="6" fill="${ACCENT_DEEP}"/>`,
    ],
    {
      note:
        'POINT — the arm crosses out of the drawing and into whatever is set beside\n       it. The highlights follow the hand; that is what makes it point AT something.',
    },
  ),

  hold: pose(
    [
      groundShadow(),
      catEars(),
      tail(),
      feet(206, 306),
      ears,
      body,
      head,
      eyes(),
      blush,
      nose(),
      smile(284, 13, 9),
      limb('M188 326 Q152 340 128 348', { w: 28 }),
      limb('M324 326 Q360 340 384 348', { w: 28 }),
      `  <path d="M14 348 H498" stroke="${ACCENT}" stroke-width="9" stroke-linecap="round"/>`,
      `  <circle cx="120" cy="349" r="19" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}"/>`,
      `  <circle cx="392" cy="349" r="19" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}"/>`,
      `  <path d="M108 342 Q120 331 132 342" stroke="${LINE_SOFT}" stroke-width="4" stroke-linecap="round" fill="none"/>`,
      `  <path d="M380 342 Q392 331 404 342" stroke="${LINE_SOFT}" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    ],
    {
      note:
        'HOLD — carries the rule in FRONT of the body at y=348. Overhead was tried\n       first and read as headphones on a head this round.',
    },
  ),

  read: pose(
    [
      groundShadow(),
      catEars(-12),
      tail(-18),
      feet(),
      ears,
      body,
      head,
      eyes({ lid: 12 }),
      blush,
      nose(),
      smile(286, 10, 6),
      limb('M188 326 Q182 350 190 372', { w: 28 }),
      limb('M324 326 Q330 350 322 372', { w: 28 }),
      `  <rect x="190" y="338" width="132" height="72" rx="14" fill="${PANEL}" stroke="${LINE}" stroke-width="${W}"/>`,
      `  <path d="M210 360 H288" stroke="${ACCENT_DEEP}" stroke-width="4.5" stroke-linecap="round"/>`,
      `  <path d="M210 378 H298" stroke="${ACCENT}" stroke-width="4.5" stroke-linecap="round"/>`,
      `  <path d="M210 396 H268" stroke="${ACCENT}" stroke-width="4.5" stroke-linecap="round" opacity=".7"/>`,
      `  <circle cx="190" cy="398" r="14" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}"/>`,
      `  <circle cx="322" cy="398" r="14" fill="${WHITE}" stroke="${LINE}" stroke-width="${W}"/>`,
    ],
    { note: 'READ — eyes down on a held page. The one pose not looking at you.' },
  ),
}

for (const [name, svg] of Object.entries(POSES)) {
  writeFileSync(`public/nori-${name}.svg`, svg)
  console.log(`public/nori-${name}.svg  ${svg.length} bytes`)
}



/**
 * The favicon: the same head-and-ears crop the nav mark uses, baked standalone
 * so a browser can render it without an outer coordinate system.
 *
 * Emitted here rather than maintained by hand, because a favicon that has
 * quietly drifted away from the mascot is the kind of thing nobody notices for
 * a year. Taken from `data` for the reason given in Nori.tsx: `wave` puts its
 * raised arm inside any box tight enough to be a head.
 */
const CROP = '112 22 288 302'
const markInner = POSES.data.slice(POSES.data.indexOf('>') + 1, POSES.data.lastIndexOf('</svg>'))
const mark =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${CROP}" fill="none">
` +
  `  <!-- Head-and-ears crop of nori-data.svg. Generated by tools/nori.mjs. -->` +
  markInner +
  `</svg>
`
writeFileSync('public/nori-mark.svg', mark)
console.log(`public/nori-mark.svg  ${mark.length} bytes`)
