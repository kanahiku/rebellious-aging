/**
 * Site-level component theme defaults.
 *
 * Card variants map to CSS tokens in src/brand.ts.
 * Do not cycle section colors by index — Figma (or an explicit surface field) decides.
 */

export type CardVariant = 'dark' | 'light' | 'outlined' | 'glass';

export type SectionVariant = 'white' | 'grey' | 'dark';

export type HeroVariant = 'split' | 'overlay' | 'words' | 'page';

export const THEME = {
  card: {
    onGrey: 'dark' as CardVariant,
    onWhite: 'light' as CardVariant,
    onDark: 'dark' as CardVariant,
  },

  hero: {
    variant: 'split' as HeroVariant,
  },

  widgets: {
    featuresOnGrey: {
      isDark: false,
      cardClass: 'border border-accent/60 bg-card-dark',
    },

    featuresOnDark: {
      isDark: true,
      cardClass: undefined as string | undefined,
    },

    testimonialsOnGrey: {
      isDark: true,
      cardClass: 'border border-accent/60 bg-card-dark',
      classes: {
        headline: {
          title: 'text-h2 font-normal leading-[120%] text-heading',
          subtitle: 'text-[16px] font-normal leading-[160%] text-muted',
        },
      },
    },

    testimonialsOnDark: {
      isDark: true,
      cardClass: undefined as string | undefined,
    },
  },
} as const;
