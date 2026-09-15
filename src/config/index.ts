/**
 * Barrel export for all site-level config.
 *
 *   src/config/site.ts     name, URL, GTM, GSC, SEO description
 *   src/config/contact.ts  phone, email, address, hours
 *   src/config/social.ts   profile URLs
 *   src/config/cta.ts      button labels
 *   src/brand.ts           colors, fonts, radius
 *
 *   import { site, CONTACT, SOCIAL, PRIMARY_CTA_LABEL } from '~/config';
 */
export { site, siteHost, siteOrigin } from './site';
export { CONTACT } from './contact';
export { SOCIAL } from './social';
export { THEME } from './theme';
export type { CardVariant, SectionVariant, HeroVariant } from './theme';
export { MOTIF, MOTIF_COLOR_VARS, MOTIF_OPACITY_VARS, motifFadeMask, parseMotifOpacity } from './motif';
export {
  PRIMARY_CTA_LABEL,
  PRIMARY_CTA_HREF,
  PRIMARY_CTA_NOTE,
  ATHENA_CONTACT_HREF,
  FOOTER_CTA_EYEBROW,
  FOOTER_CTA_TITLE,
  FOOTER_CTA_BODY,
  FOOTER_CTA_LABEL,
  FOOTER_CTA_HREF,
} from './cta';
export { business } from './schema/business';
