export type SchemaType = 'Service' | 'WebPage' | 'AboutPage' | 'ContactPage' | 'FAQOnly';

export interface FaqItem {
  q: string;
  a: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface PostalAddress {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface OpeningHoursSpecification {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

export interface Credential {
  '@type': 'EducationalOccupationalCredential';
  credentialCategory: string;
  name: string;
  recognizedBy?: {
    '@type': 'Organization';
    name: string;
  };
}

export interface AreaServed {
  '@type': 'AdministrativeArea';
  name: string;
}

export interface BusinessSchema {
  /** Fragment used in the business @id, e.g. "organization". */
  idFragment: string;
  name: string;
  businessType: string;
  telephone?: string;
  email: string;
  priceRange: string;
  address: PostalAddress;
  description: string;
  openingHoursSpecification?: OpeningHoursSpecification[] | null;
  hasCredential?: Credential[] | null;
  memberOf?: { '@type': 'Organization'; name: string } | null;
  award?: string[] | null;
  sameAs?: string[] | null;
  areaServed?: AreaServed | null;
}

export interface PageSchema {
  name: string;
  path: string;
  schemaType: SchemaType;
  serviceType?: string;
  description?: string | null;
  faq?: FaqItem[] | null;
  breadcrumb: BreadcrumbItem[];
}

export type JsonLdNode = Record<string, unknown>;
