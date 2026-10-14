// Shared surface + action styles. One card material, one CTA shape, one motion curve.
// Motion is transform/opacity only (ease-out, 200ms) and gated behind motion-safe.

/** Resting card material: soft ring + hairline shadow instead of borders. */
export const SURFACE_CARD = "rounded-2xl bg-white ring-1 ring-neutral-900/[0.05] shadow-[0_1px_2px_rgba(15,23,42,0.04)]";

/** A whole-card link: lifts on hover, compresses on press. Pair with CARD_HOVER_SHADOW. */
export const INTERACTIVE_CARD = `group relative isolate flex flex-col ${SURFACE_CARD} transition-transform duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.985] motion-safe:active:duration-100`;

/** Deeper shadow on its own layer, so hover only animates opacity. Render as an aria-hidden first child. */
export const CARD_HOVER_SHADOW =
    "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)] transition-opacity duration-200 ease-out group-hover:opacity-100";

const PILL_BASE =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-[15px] font-semibold transition-[transform,background-color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97] motion-safe:active:duration-100";

/** Primary action on a light surface. primary-800 keeps white text at AA contrast. */
export const PILL_PRIMARY = `${PILL_BASE} bg-primary-800 text-white hover:bg-primary-900 focus-visible:outline-primary-500`;

/** Primary action on a dark or brand-gradient surface. */
export const PILL_ON_DARK = `${PILL_BASE} bg-white text-primary-800 hover:bg-primary-50 focus-visible:outline-white`;

/** Secondary action on a dark or brand-gradient surface. */
export const PILL_GHOST_ON_DARK = `${PILL_BASE} text-white ring-1 ring-inset ring-white/30 hover:bg-white/10 focus-visible:outline-white`;
