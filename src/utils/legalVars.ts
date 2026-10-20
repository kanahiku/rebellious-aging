import { CONTACT } from '~/config/contact';
import { site, siteHost } from '~/config/site';

/**
 * Values behind the {{tokens}} editors can use in legal-page text. They stay in code on purpose:
 * they must always match the live site config, never a stale copy typed into the CMS.
 */
export function legalVars(): Record<string, string> {
  const legalName = CONTACT.businessName;
  const dba = site.name;
  const analyticsProviders = [
    site.analytics.googleTagManagerId.trim() && 'Google Tag Manager',
    site.analytics.googleAnalyticsId.trim() && 'Google Analytics',
  ].filter(Boolean);

  return {
    host: siteHost(),
    legalName,
    dba,
    entity: legalName === dba ? legalName : `${legalName} (doing business as ${dba})`,
    analytics: analyticsProviders.length
      ? `The analytics tools currently in use are ${analyticsProviders.join(' and ')}.`
      : 'No third-party analytics tools are currently configured.',
    governingState: CONTACT.address.state === 'HI' ? 'Hawaii' : CONTACT.address.state,
    governingCounty: 'Honolulu',
  };
}

/** Fill {{tokens}} in plain text (SEO fields). */
export const fillTokens = (value: string, vars: Record<string, string>) =>
  value.replace(/\{\{(\w+)\}\}/g, (_m, key: string) => vars[key] ?? '');
