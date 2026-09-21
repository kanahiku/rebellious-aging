/**
 * Site identity and public analytics IDs.
 *
 * Edit this file for every client. Secrets (Sanity, Resend, Places, Yelp) stay in `.env`.
 *
 * Sibling files:
 *   src/brand.ts           colors, fonts, radius
 *   src/config/contact.ts  phone, email, address, hours
 *   src/config/social.ts   profile URLs
 *   src/config/cta.ts      button labels
 *   src/config/schema/business.ts  schema.org extras (price range, credentials)
 */
export const site = {
  name: 'Rebellious Aging',
  url: 'https://rebelliousaging.org',
  description:
    'Member-led clubs across the Hawaiian Islands teaching the basics of longevity: how aging works, and what you can do about it.',
  footerTagline:
    'A network of member-led clubs across the Hawaiian Islands practising the foundational science of long life, together.',
  trailingSlash: false,

  /** Cloudflare Worker `sites.slug`. `PUBLIC_SITE_SLUG` in env overrides this. */
  formSlug: 'rebellious-aging',

  analytics: {
    /** Google Tag Manager container. Empty until the client GTM is created. */
    googleTagManagerId: '',
    /** Optional. Leave empty when tags are installed through GTM. */
    googleAnalyticsId: '',
    /** Search Console HTML-tag verification (`content=` value only). */
    googleSiteVerificationId: '',
  },
} as const;

export type SiteConfig = typeof site;

export function siteOrigin(): string {
  return site.url.replace(/\/$/, '');
}

export function siteHost(): string {
  return siteOrigin().replace(/^https?:\/\//, '');
}
