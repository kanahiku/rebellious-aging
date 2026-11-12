export interface CardProps {
  /** Visual treatment. Default: 'bordered'. */
  variant?: 'bordered' | 'pillar' | 'schedule' | 'testimonial' | 'feature' | 'dark' | 'outlined' | 'podcast';

  /**
   * Unused for podcast card chrome (Figma 121:924 and 121:1293 share the same
   * cream fill). Kept so callers can still pass the section tone through.
   */
  tone?: 'light' | 'dark';

  // ── shared ──
  /** Optional eyebrow line shown before the main label on pillar cards. */
  preLabel?: string;
  /** Eyebrow / category label shown in the header area. */
  label?: string;
  /** Extra classes on the card root (e.g. to swap the shadow utility). */
  class?: string;

  // ── bordered only ──
  /** CSS class(es) for the header band background. */
  labelBg?: string;
  /** CSS class(es) for the header band label text. */
  labelTextColor?: string;

  // ── testimonial only ──
  /** The quote text (Fraunces italic, 22px). Used by variant="testimonial". */
  quote?: string;

  // ── podcast only ──
  /** 'live' shows a green Live badge + platform links. 'coming-soon' shows a muted badge. */
  status?: 'live' | 'coming-soon';
  /** Spotify episode / show URL. Shown only when status='live'. */
  spotifyUrl?: string;
  /** YouTube episode / playlist URL. Shown only when status='live'. */
  youtubeUrl?: string;

  // ── feature only ──
  /** Card heading (Fraunces 28px text-primary). Used by variant="feature". */
  title?: string;
  /** Body paragraph. Used by variant="feature". */
  description?: string;
  /** CTA button text. Used by variant="feature". Default: "Explore". */
  ctaText?: string;
  /** CTA button href. Used by variant="feature". */
  ctaHref?: string;
  /** Icon shown in the header tile: 'calendar' | 'book'. Default: 'book'. */
  iconType?: 'calendar' | 'book';
  /**
   * When true, renders the tall featured layout: image placeholder (grey box) above
   * the title+description, and a solid primary CTA button. Default: false.
   */
  featured?: boolean;
  /**
   * Speaker / attribution line (session cards). When set on variant="feature"
   * (and featured is false), renders the people-icon row and pins the CTA
   * to the bottom-right so a grid of cards lines up.
   */
  speaker?: string;

  // ── pillar only ──
  /**
   * When true, wraps the `icon` slot in a `bg-cta rounded-bl-[12px]` container.
   * Use for small (≤20px) icons that need the tan background tile treatment.
   * Default: false — the icon SVG fills the 50×50 area directly (for icons that
   * already carry their own background, like the Movement / Food SVGs).
   */
  iconBg?: boolean;
  /**
   * Tailwind class for the icon tile background when iconBg=true.
   * Default: 'bg-cta' (tan, matches the homepage Bucket section).
   * Pass 'bg-section-grey' for cards on a white/page background (e.g. Four Pillars page).
   */
  iconBgClass?: string;
  /**
   * Pillar card fill. 'white' (default) pops off cream/tan sections
   * (Four Pillars, homepage buckets). 'page' is the cream page colour —
   * How Aging Works (Figma 62:71).
   */
  surface?: 'white' | 'page';
}
