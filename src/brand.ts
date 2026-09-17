/**
 * Brand tokens — the only file to edit when a Figma file (or a new client)
 * changes colors, type, or radius.
 *
 * Flow:
 * 1. Paste values extracted from Figma (MCP `get_variable_defs`, or walk
 *    fills/text if there is no Variables / Design System frame).
 * 2. `CustomStyles.astro` and `astro.config.ts` read this file at build time.
 * 3. Components never hardcode hex — they use Tailwind tokens backed by these CSS vars.
 *
 * Do not put contact data, GTM, nav links, or page copy here.
 * Those live in `src/config/site.ts`, `src/config/contact.ts`, and siblings.
 */

export const brand = {
  fonts: {
    heading: {
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      weights: ['400'] as string[],
      styles: ['normal', 'italic'] as string[],
      subsets: ['latin'] as string[],
      fallbacks: ['serif'] as string[],
    },
    body: {
      name: 'Hanken Grotesk',
      cssVariable: '--font-hanken-grotesk',
      weights: ['300', '400', '500', '600'] as string[],
      styles: ['normal', 'italic'] as string[],
      subsets: ['latin'] as string[],
      fallbacks: ['sans-serif'] as string[],
    },
  },

  /** From Homepage (node 1:3). Repeating fills only — not one-off photo colors. */
  colors: {
    accent: '#567F9B',
    accentHover: '#7BA3BD',
    heading: '#1E2A30',
    muted: '#45555D',
    eyebrow: '#64727A',
    page: '#F5F4EF',
    sectionGrey: '#D2E1EA',
    sectionDark: '#1B2A32',
    card: '#FAFAF8',
    cardMist: '#E4EDF2',
    cardDark: '#2C4A5B',
    ctaBg: '#E8DFCF',
    ctaEnd: '#CFB28A',
    ctaTan: '#B29A77',
    tanText: '#665844',
    tanBody: '#332C22',
    ctaPink: '#F2E4E4',
    ctaPinkText: '#BD7B7B',
    featureCard: '#F1F5F8',
    primary: '#2C4A5B',
    secondary: '#7BA3BD',
    navy: '#1B2A32',
    white: '#FFFFFF',
    cream: '#F5F4EF',
    nav: '#1D1D1D',
    black: '#1E2A30',
  },

  type: {
    /**
     * Desktop `size` + phone `mobile` from Figma when the file has both.
     * Fallback (this file — desktop type only): h1 ~50%, h2 ~60%, h3 ~65%, h4 ~80%; body unchanged.
     */
    h1: { size: '62px', mobile: '28px', lineHeight: '1', tracking: '0' },
    h2: { size: '46px', mobile: '26px', lineHeight: '1', tracking: '0' },
    h3: { size: '32px', mobile: '20px', lineHeight: '1', tracking: '0' },
    /** Card / subsection titles. */
    h4: { size: '28px', mobile: '18px', lineHeight: '1.2', tracking: '0' },
    body: { size: '16px', lineHeight: '1.3', tracking: '0' },
    bodyLg: { size: '16px', lineHeight: '1.3', tracking: '0' },
    button: { size: '14px', lineHeight: '1.25', tracking: '0' },
    eyebrow: { size: '14px', lineHeight: '1', tracking: '0.06em' },
    small: { size: '12px', lineHeight: '1.3', tracking: '0' },
    caption: { size: '11px', lineHeight: '1.3', tracking: '0' },
  },

  radius: {
    base: '12px',
    lg: '16px',
    xl: '32px',
    hero: '64px',
    full: '9999px',
  },

  motif: {
    heroOpacity: 0,
    darkOpacity: 0,
    greyOpacity: 0,
    whiteOpacity: 0,
    ctaOpacity: 0,
    ctaColor: '#1E2A30',
  },
} as const;

export type Brand = typeof brand;

/** Strip # and expand 3-digit hex. */
export function hexToChannels(hex: string): string {
  const raw = hex.replace('#', '').trim();
  const h =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  const n = Number.parseInt(h, 16);
  if (Number.isNaN(n)) return '0 0 0';
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** `rgb(237 217 116)` or `rgb(237 217 116 / 50%)`. */
export function rgb(hex: string, alpha?: number): string {
  const channels = hexToChannels(hex);
  if (alpha === undefined) return `rgb(${channels})`;
  const a = alpha <= 1 ? `${Math.round(alpha * 100)}%` : String(alpha);
  return `rgb(${channels} / ${a})`;
}

/** Per-variant CTA colors from brand.colors. */
function ctaButtonVars(c: Brand['colors']): string {
  // Primary: #2C4A5B → hover #1B2A32, white text
  const primary = `
    --aw-color-btn-primary-bg: ${rgb(c.primary)};
    --aw-color-btn-primary-text: ${rgb(c.white)};
    --aw-color-btn-primary-border: ${rgb(c.primary)};
    --aw-color-btn-primary-bg-hover: ${rgb(c.navy)};
    --aw-color-btn-primary-text-hover: ${rgb(c.white)};
    --aw-color-btn-primary-border-hover: ${rgb(c.navy)};`;

  // Secondary: #B29A77 (ctaTan) → hover #665844 (tanText), white text
  const secondary = `
    --aw-color-btn-secondary-bg: ${rgb(c.ctaTan)};
    --aw-color-btn-secondary-text: ${rgb(c.white)};
    --aw-color-btn-secondary-border: ${rgb(c.ctaTan)};
    --aw-color-btn-secondary-bg-hover: ${rgb(c.tanText)};
    --aw-color-btn-secondary-text-hover: ${rgb(c.white)};
    --aw-color-btn-secondary-border-hover: ${rgb(c.tanText)};`;

  // Ghost on light: transparent, #1E2A30 border+text → hover #2C4A5B bg, white text
  const ghostLight = `
    --aw-color-btn-ghost-light-bg: transparent;
    --aw-color-btn-ghost-light-text: ${rgb(c.black)};
    --aw-color-btn-ghost-light-border: ${rgb(c.black)};
    --aw-color-btn-ghost-light-bg-hover: ${rgb(c.primary)};
    --aw-color-btn-ghost-light-text-hover: ${rgb(c.white)};
    --aw-color-btn-ghost-light-border-hover: ${rgb(c.primary)};`;

  // Ghost on dark/photos: white glass default → brighter white glass hover.
  // Using white-based opacity instead of primary-based because #2C4A5B at 20-35%
  // on navy #1B2A32 produces near-zero visible contrast. White tint scales clearly.
  const ghostDark = `
    --aw-color-btn-ghost-dark-bg: ${rgb(c.primary, 0.2)};
    --aw-color-btn-ghost-dark-text: ${rgb(c.cream)};
    --aw-color-btn-ghost-dark-border: ${rgb(c.cream)};
    --aw-color-btn-ghost-dark-bg-hover: rgba(255 255 255 / 0.25);
    --aw-color-btn-ghost-dark-text-hover: ${rgb(c.cream)};
    --aw-color-btn-ghost-dark-border-hover: ${rgb(c.cream)};`;

  return [primary, secondary, ghostLight, ghostDark].join('');
}

function rootVars(b: Brand): string {
  const { colors: c, fonts: f, radius: r, motif: m, type: t } = b;
  const accent = rgb(c.accent);
  const accentHover = rgb(c.accentHover);
  const heading = rgb(c.heading);
  const muted = rgb(c.muted);

  return `
    --aw-font-sans: var(${f.body.cssVariable});
    --aw-font-serif: var(${f.heading.cssVariable});
    --aw-font-heading: var(${f.heading.cssVariable});

    --aw-text-h1: ${t.h1.size};
    --aw-text-h1-mobile: ${t.h1.mobile};
    --aw-leading-h1: ${t.h1.lineHeight};
    --aw-text-h2: ${t.h2.size};
    --aw-text-h2-mobile: ${t.h2.mobile};
    --aw-leading-h2: ${t.h2.lineHeight};
    --aw-text-h3: ${t.h3.size};
    --aw-text-h3-mobile: ${t.h3.mobile};
    --aw-leading-h3: ${t.h3.lineHeight};
    --aw-text-h4: ${t.h4.size};
    --aw-text-h4-mobile: ${t.h4.mobile};
    --aw-leading-h4: ${t.h4.lineHeight};
    --aw-text-body: ${t.body.size};
    --aw-leading-body: ${t.body.lineHeight};
    --aw-text-body-lg: ${t.bodyLg.size};
    --aw-text-button: ${t.button.size};
    --aw-text-eyebrow: ${t.eyebrow.size};
    --aw-tracking-eyebrow: ${t.eyebrow.tracking};
    --aw-text-small: ${t.small.size};
    --aw-leading-small: ${t.small.lineHeight};
    --aw-text-caption: ${t.caption.size};

    --aw-color-primary: ${rgb(c.primary)};
    --aw-color-secondary: ${rgb(c.secondary)};
    --aw-color-accent: ${accent};
    --aw-color-accent-hover: ${accentHover};

    --aw-color-text-heading: ${heading};
    --aw-color-text-default: ${muted};
    --aw-color-text-muted: ${muted};
    --aw-color-text-eyebrow: ${rgb(c.eyebrow)};
    --aw-color-bg-page: ${rgb(c.page)};
    --aw-color-bg-page-end: ${rgb(c.white)};
    --aw-color-bg-section-white: ${rgb(c.page)};
    --aw-color-bg-section-grey: ${rgb(c.sectionGrey)};
    --aw-color-bg-section-dark: ${rgb(c.sectionDark)};
    --aw-color-bg-card: ${rgb(c.card)};
    --aw-color-bg-card-dark: ${rgb(c.cardDark)};
    --aw-color-bg-card-light: ${rgb(c.cardMist)};
    --aw-color-bg-feature-card: ${rgb(c.featureCard)};
    --aw-color-bg-cta: ${rgb(c.ctaBg)};
    --aw-color-bg-cta-end: ${rgb(c.ctaEnd)};
    --aw-color-text-tan: ${rgb(c.tanText)};
    --aw-color-text-tan-body: ${rgb(c.tanBody)};
    --aw-color-bg-cta-pink: ${rgb(c.ctaPink)};
    --aw-color-text-cta-pink: ${rgb(c.ctaPinkText)};
    --aw-shadow-card-mist: 4px 4px 30px rgb(0 0 0 / 5%), 3px 3px 0 ${rgb(c.cardMist)};
    --aw-shadow-card-pink: 4px 4px 30px rgb(0 0 0 / 5%), 3px 3px 0 ${rgb(c.ctaPink)};
    --aw-color-nav-glass: ${rgb(c.nav, 0.25)};

    --aw-color-card-heading-dark: ${rgb(c.white)};
    --aw-color-card-body-dark: ${rgb(c.white, 0.6)};
    --aw-color-card-link-dark: ${rgb(c.cream)};

    --aw-color-card-heading-light: var(--aw-color-text-heading);
    --aw-color-card-body-light: var(--aw-color-text-muted);
    --aw-color-card-link-light: var(--aw-color-btn-link);

    --aw-color-card-border-dark: ${rgb(c.accent, 0.6)};
    --aw-color-card-border-light: transparent;

    --aw-color-bg-card-outlined: ${rgb(c.white)};
    --aw-color-card-border-outlined: ${rgb(c.black, 0.12)};
    --aw-color-card-heading-outlined: var(--aw-color-text-heading);
    --aw-color-card-body-outlined: var(--aw-color-text-muted);
    --aw-color-card-link-outlined: var(--aw-color-btn-link);

    --aw-color-bg-card-glass: ${rgb(c.white, 0.08)};
    --aw-color-card-border-glass: ${rgb(c.white, 0.15)};
    --aw-color-card-heading-glass: ${rgb(c.white)};
    --aw-color-card-body-glass: ${rgb(c.white, 0.7)};
    --aw-color-card-link-glass: ${rgb(c.cream)};

    ${ctaButtonVars(c)}

    --aw-color-btn-link: ${rgb(c.primary)};
    --aw-color-btn-link-hover: ${accent};

    --aw-color-headline-light: var(--aw-color-text-heading);
    --aw-color-headline-dark: ${rgb(c.white)};
    --aw-color-headline-subtitle-light: var(--aw-color-text-muted);
    --aw-color-headline-subtitle-dark: ${rgb(c.white, 0.7)};

    --aw-color-timeline-icon-light: var(--aw-color-text-heading);
    --aw-color-timeline-icon-border-light: transparent;
    --aw-color-timeline-icon-bg-light: var(--aw-color-bg-cta);
    --aw-color-timeline-step-light: var(--aw-color-text-muted);
    --aw-color-timeline-title-light: var(--aw-color-text-heading);
    --aw-color-timeline-desc-light: var(--aw-color-text-muted);

    --aw-color-timeline-icon-dark: var(--aw-color-text-heading);
    --aw-color-timeline-icon-border-dark: transparent;
    --aw-color-timeline-icon-bg-dark: var(--aw-color-bg-cta);
    --aw-color-timeline-title-dark: ${rgb(c.white)};
    --aw-color-timeline-desc-dark: ${rgb(c.white, 0.6)};

    --aw-color-testimonial-card-bg-light: ${rgb(c.card)};
    --aw-color-testimonial-card-border-light: transparent;
    --aw-color-testimonial-text-light: var(--aw-color-text-muted);
    --aw-color-testimonial-name-light: var(--aw-color-text-heading);
    --aw-color-testimonial-job-light: var(--aw-color-text-muted);
    --aw-color-testimonial-hr-light: rgb(226 232 240);

    --aw-color-testimonial-card-bg-dark: ${rgb(c.white, 0.05)};
    --aw-color-testimonial-card-border-dark: ${rgb(c.white, 0.15)};
    --aw-color-testimonial-text-dark: ${rgb(c.white, 0.7)};
    --aw-color-testimonial-name-dark: ${rgb(c.white)};
    --aw-color-testimonial-job-dark: ${rgb(c.white, 0.5)};
    --aw-color-testimonial-hr-dark: ${rgb(c.white, 0.1)};

    --aw-color-faq-border-light: ${rgb(c.secondary, 0.45)};
    --aw-color-faq-question-light: var(--aw-color-text-heading);
    --aw-color-faq-answer-light: var(--aw-color-text-muted);
    --aw-color-faq-toggle-border-light: rgb(209 213 219);
    --aw-color-faq-toggle-text-light: rgb(107 114 128);
    --aw-color-faq-toggle-active-light: var(--aw-color-accent);

    --aw-color-faq-border-dark: ${rgb(c.white, 0.2)};
    --aw-color-faq-question-dark: ${rgb(c.white)};
    --aw-color-faq-answer-dark: var(--aw-color-accent);
    --aw-color-faq-toggle-border-dark: ${rgb(c.white, 0.3)};
    --aw-color-faq-toggle-text-dark: ${rgb(c.white, 0.5)};
    --aw-color-faq-toggle-active-dark: var(--aw-color-accent);

    --aw-color-projects-card-bg-light: ${rgb(c.card)};
    --aw-color-projects-card-border-light: transparent;
    --aw-color-projects-title-light: var(--aw-color-text-heading);
    --aw-color-projects-desc-light: var(--aw-color-text-muted);

    --aw-color-projects-card-bg-dark: ${rgb(c.cardDark)};
    --aw-color-projects-card-border-dark: ${rgb(c.accent, 0.6)};
    --aw-color-projects-title-dark: ${rgb(c.white)};
    --aw-color-projects-desc-dark: ${rgb(c.white, 0.6)};

    --aw-color-bg-page-dark: ${rgb(c.navy)};

    --aw-color-motif-hero: var(--aw-color-accent);
    --aw-color-motif-dark: var(--aw-color-accent);
    --aw-color-motif-grey: var(--aw-color-accent);
    --aw-color-motif-white: var(--aw-color-accent);
    --aw-color-motif-cta: ${rgb(m.ctaColor)};

    --aw-opacity-motif-hero: ${m.heroOpacity};
    --aw-opacity-motif-dark: ${m.darkOpacity};
    --aw-opacity-motif-grey: ${m.greyOpacity};
    --aw-opacity-motif-white: ${m.whiteOpacity};
    --aw-opacity-motif-cta: ${m.ctaOpacity};

    --aw-shadow-card: 4px 4px 30px rgb(0 0 0 / 5%), 3px 3px 0 ${rgb(c.secondary)};
    --aw-shadow-header: 0 0.25rem 3.5rem 0 color-mix(in srgb, var(--aw-color-text-heading) 8%, transparent);
    --aw-border-card: ${rgb(c.secondary, 0.16)};

    --aw-radius: ${r.base};
    --aw-radius-lg: ${r.lg};
    --aw-radius-xl: ${r.xl};
    --aw-radius-hero: ${r.hero};
    --aw-radius-full: ${r.full};
  `.trim();
}

function darkVars(b: Brand): string {
  const { colors: c, fonts: f, motif: m } = b;
  const accent = rgb(c.accent);

  return `
    --aw-font-sans: var(${f.body.cssVariable});
    --aw-font-serif: var(${f.heading.cssVariable});
    --aw-font-heading: var(${f.heading.cssVariable});

    --aw-color-primary: ${accent};
    --aw-color-secondary: ${rgb(c.accentHover)};
    --aw-color-accent: ${accent};
    --aw-color-accent-hover: ${rgb(c.accentHover)};

    --aw-color-text-heading: rgb(247 250 252);
    --aw-color-text-default: rgb(226 232 240);
    --aw-color-text-muted: ${rgb(c.secondary)};
    --aw-color-bg-page: ${rgb(c.navy)};
    --aw-color-bg-page-end: ${rgb(c.navy)};
    --aw-color-bg-section-white: ${rgb(c.navy)};
    --aw-color-bg-section-grey: rgb(12 45 90);
    --aw-color-bg-section-dark: ${rgb(c.black)};
    --aw-color-bg-card-dark: ${rgb(c.cardDark)};
    --aw-color-bg-card-light: rgb(12 45 90);
    --aw-color-bg-cta: ${rgb(c.ctaBg)};

    --aw-color-card-heading-dark: ${rgb(c.white)};
    --aw-color-card-body-dark: ${rgb(c.white, 0.6)};
    --aw-color-card-link-dark: var(--aw-color-accent);

    --aw-color-card-heading-light: rgb(247 250 252);
    --aw-color-card-body-light: ${rgb(c.secondary)};
    --aw-color-card-link-light: var(--aw-color-accent);

    --aw-color-card-border-dark: ${rgb(c.accent, 0.6)};
    --aw-color-card-border-light: ${rgb(c.accent, 0.5)};

    ${ctaButtonVars(c)}
    --aw-color-btn-link: ${rgb(c.primary)};
    --aw-color-btn-link-hover: ${accent};

    --aw-color-motif-hero: var(--aw-color-accent);
    --aw-color-motif-dark: var(--aw-color-accent);
    --aw-color-motif-grey: var(--aw-color-accent);
    --aw-color-motif-white: var(--aw-color-accent);
    --aw-color-motif-cta: ${rgb(m.ctaColor)};

    --aw-opacity-motif-hero: ${m.heroOpacity};
    --aw-opacity-motif-dark: ${m.darkOpacity};
    --aw-opacity-motif-grey: ${m.greyOpacity};
    --aw-opacity-motif-white: ${m.whiteOpacity};
    --aw-opacity-motif-cta: ${m.ctaOpacity};
  `.trim();
}

/** Full stylesheet injected by CustomStyles.astro. */
export function brandStylesheet(b: Brand = brand): string {
  const accent = rgb(b.colors.accent, 0.3);
  return `:root {
  ${rootVars(b)}

  ::selection {
    background-color: ${accent};
  }
}

.dark {
  ${darkVars(b)}

  ::selection {
    background-color: ${accent};
    color: snow;
  }
}`;
}

/** Astro Fonts API entries — used by astro.config.ts. */
export function brandFontConfig() {
  return [brand.fonts.heading, brand.fonts.body].map((font) => ({
    name: font.name,
    cssVariable: font.cssVariable,
    weights: font.weights,
    styles: font.styles,
    subsets: font.subsets,
    fallbacks: font.fallbacks,
  }));
}
