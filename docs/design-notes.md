# Design notes

The reasoning behind the decisions the [README](../README.md) states. Kept out of
the README so that file describes what the site *is* rather than arguing for it.

## Nori — why the mascot is built this way

**The app never recolours or re-paths the drawings.** `Nori.tsx` places, sizes and idles
them and nothing else; editing a pose means editing the file. That is why the poses are
referenced as files rather than inlined as JSX — a component that *can* repaint authored
artwork will eventually repaint it by accident.

**The small mark is a crop, not a second asset.** At nav size a full-body Nori collapses
into a grey pill — antenna, arms and feet all disappear into the silhouette — so
`crop="head"` re-declares the viewBox over the same file to keep the eyes, which are the
only part that has to survive. The favicon (`public/nori-mark.svg`) is the same crop baked
into a standalone file, since a favicon cannot reliably reference another SVG.

Motion is placement-level only and obeys the same contract as everything else here:
transform and opacity, no filters, no JS in the motion path, `data-static` to kill it, and
`prefers-reduced-motion` resolving to the resting frame. The float is deliberately slow and
shallow because the drawings already carry their own implied motion — the wave arcs, the
rising Zzz, the rocket's speed lines — and a lively bob on top of those reads as two
animations arguing rather than one character breathing.

**A known inconsistency, stated rather than hidden:** Nori's palette (lavender `#B7A7E8`,
ink `#2E2A40`) is not drawn from the Norrin token system, which is moss / sun / forest /
lichen. The character is legible and holds its silhouette on both the paper ground and the
forest bands, so nothing is broken — but it is the one element on the site whose colour is
not derived from Norrin's own published theme.

The pilot → production diagram in `TheGap` still uses the earlier **spar-buoy** drawing
(`src/components/mascot/Fyr.tsx`, `Lunni.tsx`). That is a diagram rather than a mascot: its
four states borrow real IALA buoyage grammar and the section's copy names it directly
("unlit, unmoored, marking nothing"; "isolated danger"). Swapping it for Nori is a copy
rewrite, not an asset swap, and has deliberately been left as a separate decision.
