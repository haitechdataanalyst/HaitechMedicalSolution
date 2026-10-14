// Shared look for every selectable option tile (variant, size, grit, colour, upholstery…).
// Selection reads as a primary ring; motion is press-scale only, gated behind motion-safe.

/** Base tile: ≥44px, rounded, visible focus, press feedback. Pair with OPTION_SELECTED / OPTION_IDLE. */
export const OPTION_TILE =
    "relative min-h-11 rounded-xl bg-white text-[15px] text-neutral-900 transition-[transform,box-shadow,background-color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 motion-safe:active:scale-[0.97] motion-safe:active:duration-100";

export const OPTION_SELECTED = "ring-2 ring-primary-700 font-medium";

export const OPTION_IDLE = "ring-1 ring-neutral-900/10 hover:ring-neutral-900/25";

/** Label above an option group. */
export const OPTION_LABEL = "mb-3 block text-[15px] font-semibold tracking-[-0.01em] text-neutral-900";
