// ── bordered ──
export const borderedBase =
  'bg-card rounded-xl overflow-hidden shadow-card flex flex-col gap-4 items-start pb-4';

// ── pillar ──
// Single soft drop-shadow (no coloured offset), overflow-hidden so
// the icon's rounded-bl-[12px] corner clips properly at the card edge.
// White fill on tan/cream sections; page (cream) fill on How Aging Works.
export const pillarBase = (surface: 'white' | 'page') =>
  `${surface === 'page' ? 'bg-page' : 'bg-white'} rounded-[var(--aw-radius-lg)] overflow-hidden flex flex-col items-end shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)]`;

// ── schedule ──
// Flat mist-color offset shadow, card-light bg (slightly off-white), overflow-hidden.
// Header band: bg-card-light, calendar icon + day label.
// Default slot holds event rows.
export const scheduleBase =
  'bg-card rounded-xl overflow-hidden flex flex-col gap-4 items-start pb-4 shadow-mist-offset';

// ── testimonial ──
// Dark glass gradient card. Fixed 512px width is applied at the slide level (Swiper).
// Quote mark SVG (mix-blend-overlay) + Fraunces italic quote + small uppercase attribution.
export const testimonialBase =
  'bg-gradient-to-r from-white/10 to-white/[0.02] rounded-[16px] overflow-hidden flex flex-col gap-4 p-6 shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] h-full';

// ── feature ──
// Cool-tinted light card (bg-feature-card). Border + rounded-[16px] + overflow-clip.
// Header: 40×40 icon tile + category label. Body: Fraunces 28px title + description + CTA.
// featured=false → compact with ghost/frosted CTA.
// featured=true  → tall, grey image placeholder, solid primary CTA.
export const featureBase =
  'bg-feature-card border border-card-border-light rounded-[16px] overflow-clip flex flex-col items-start';

// ── dark / outlined (promo shells, Figma 64:1086) ──
// Shared layout: equal-height flex column, CTA pinned via mt-auto in the slot.
export const promoBase =
  'flex h-full min-w-0 flex-col items-start gap-10 rounded-[32px] p-8 md:gap-16 md:rounded-[64px] md:p-12';
export const darkBase =
  `${promoBase} bg-[linear-gradient(93.6deg,var(--aw-color-bg-section-dark)_5.27%,var(--aw-color-primary)_97.29%)]`;
export const outlinedBase = `${promoBase} border-4 border-section-dark`;

// ── podcast ──
// Cream card (≈ bg-page), navy type, tan tag, ghost-light CTA.
// Same shell on the tan wash (121:916) and the white section (121:1286).
export const podcastBase =
  'flex h-full min-w-0 flex-col items-start gap-3 rounded-[16px] bg-page p-6';

export const variantBase: Record<string, string> = {
  bordered: borderedBase,
  schedule: scheduleBase,
  testimonial: testimonialBase,
  feature: featureBase,
  dark: darkBase,
  outlined: outlinedBase,
  podcast: podcastBase,
};

// Header icon tiles are 36px (size-9) on mobile for every card type.
// Desktop restores Figma sizes: pillar 50px, feature 40px.
export const pillarIconTile = 'size-9 shrink-0 sm:size-[50px]';
export const featureIconTile = 'size-9 shrink-0 sm:size-[40px]';
export const iconBgGlyph = '[&>svg]:size-3.5 sm:[&>svg]:size-5';
