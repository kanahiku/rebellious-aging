import type { SiteSettingsContent } from '~/lib/content/sanity-queries/seo';
import type { BusinessSchema, JsonLdNode, OpeningHoursSpecification } from './types';
import { absoluteUrl } from './urls';

/** Overlay the Sanity "Site Settings" values on the code defaults. Empty fields keep the default. */
export function applySiteSettings(base: BusinessSchema, s: SiteSettingsContent | null | undefined): BusinessSchema {
  if (!s) return base;
  const a = s.address ?? {};
  const hours: OpeningHoursSpecification[] = (s.hours ?? [])
    .filter((h) => h.days?.length && h.opens && h.closes)
    .map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days!, opens: h.opens!, closes: h.closes! }));

  return {
    ...base,
    name: s.businessName || base.name,
    businessType: s.businessType || base.businessType,
    description: s.description || base.description,
    telephone: s.telephone || base.telephone,
    email: s.email || base.email,
    priceRange: s.priceRange || base.priceRange,
    address: {
      streetAddress: a.street || base.address.streetAddress,
      addressLocality: a.city || base.address.addressLocality,
      addressRegion: a.region || base.address.addressRegion,
      postalCode: a.postalCode || base.address.postalCode,
      addressCountry: a.country || base.address.addressCountry,
    },
    geo: s.geo?.lat != null && s.geo?.lng != null ? { latitude: s.geo.lat, longitude: s.geo.lng } : base.geo,
    areaServed: s.serviceArea ? { '@type': 'AdministrativeArea', name: s.serviceArea } : base.areaServed,
    sameAs: s.socialLinks?.length ? s.socialLinks : base.sameAs,
    openingHoursSpecification: hours.length ? hours : base.openingHoursSpecification,
    logoUrl: s.logoUrl || base.logoUrl,
  };
}

/** Parse the editor's custom JSON-LD. Returns the nodes it contains, or null when invalid. */
export function parseCustomSchema(json: string | undefined): JsonLdNode[] | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json) as JsonLdNode;
    const nodes = Array.isArray(parsed['@graph']) ? (parsed['@graph'] as JsonLdNode[]) : [parsed];
    return nodes.map(({ '@context': _ctx, ...rest }) => rest as JsonLdNode);
  } catch {
    return null;
  }
}

export const logoSrc = (b: BusinessSchema) => b.logoUrl || (b.logoPath ? absoluteUrl(b.logoPath) : undefined);
