import type { BusinessSchema } from './types';
import { CONTACT } from '~/config/contact';
import { SOCIAL } from '~/config/social';
import { site } from '~/config/site';

/**
 * Client-specific entity for schema.org JSON-LD.
 *
 * Rebellious Aging is a movement (member-led clubs), not a storefront, so it is
 * modelled as a plain `Organization`. `priceRange` / `openingHoursSpecification`
 * are LocalBusiness-only properties and are intentionally omitted.
 */
export const business: BusinessSchema = {
  idFragment: 'organization',
  name: CONTACT.businessName,
  businessType: 'Organization',
  ...(CONTACT.phone.schema ? { telephone: CONTACT.phone.schema } : {}),
  email: CONTACT.email,
  address: {
    streetAddress: CONTACT.address.street,
    addressLocality: CONTACT.address.city,
    addressRegion: CONTACT.address.state,
    postalCode: CONTACT.address.zip,
    addressCountry: CONTACT.address.country,
  },
  description: site.description,
  hasCredential: [],
  memberOf: null,
  award: [],
  sameAs: SOCIAL.sameAs as unknown as string[],
  areaServed: { '@type': 'AdministrativeArea', name: CONTACT.areaServed },
  logoPath: '/apple-touch-icon.png',
  founder: {
    idFragment: 'robert-peterson',
    name: 'Robert Peterson',
    honorificPrefix: 'Dr.',
    jobTitle: 'Surgeon, engineer and founder of Rebellious Aging',
    description:
      'Surgeon and engineer. Former plastic surgeon who has spent thirty years studying the science of aging; author of the Athena Textbook of Longevity Medicine and the Rebellious Aging guidebooks.',
    path: '/about',
  },
  sponsor: { name: 'Athena Clinic', url: 'https://www.athenaclinic.com' },
};
