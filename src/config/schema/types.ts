export type SchemaType = 'Service' | 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'FAQOnly';

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
  /** Only valid on LocalBusiness subtypes — leave undefined for a plain Organization. */
  priceRange?: string;
  address: PostalAddress;
  description: string;
  openingHoursSpecification?: OpeningHoursSpecification[] | null;
  hasCredential?: Credential[] | null;
  memberOf?: { '@type': 'Organization'; name: string } | null;
  award?: string[] | null;
  sameAs?: string[] | null;
  areaServed?: AreaServed | null;
  /** Absolute path (from site root) to a square logo in /public. */
  logoPath?: string;
  founder?: FounderSchema | null;
  /** Organization that sponsors / operates alongside this entity. */
  sponsor?: { name: string; url: string } | null;
}

export interface FounderSchema {
  idFragment: string;
  name: string;
  honorificPrefix?: string;
  jobTitle: string;
  description: string;
  /** Path of the page that describes this person. */
  path: string;
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
