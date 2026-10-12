import { business } from './business';
import { pages } from './pages';
import type { BusinessSchema, JsonLdNode, PageSchema } from './types';
import { absoluteUrl, businessId, normalizePath, siteOrigin } from './urls';

const LANGUAGE = 'en-US';

const websiteId = () => `${siteOrigin()}/#website`;
const pageId = (path: string) => `${absoluteUrl(path)}#webpage`;
const breadcrumbId = (path: string) => `${absoluteUrl(path)}#breadcrumb`;
const founderId = (entity: BusinessSchema) =>
  entity.founder ? `${siteOrigin()}/#${entity.founder.idFragment}` : undefined;

function buildWebsite(entity: BusinessSchema): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': websiteId(),
    url: `${siteOrigin()}/`,
    name: entity.name,
    description: entity.description,
    inLanguage: LANGUAGE,
    publisher: { '@id': businessId(entity.idFragment) },
  };
}

function buildOrganization(entity: BusinessSchema): JsonLdNode {
  const out: JsonLdNode = {
    '@type': entity.businessType,
    '@id': businessId(entity.idFragment),
    name: entity.name,
    url: `${siteOrigin()}/`,
    email: entity.email,
    address: { '@type': 'PostalAddress', ...entity.address },
    description: entity.description,
  };

  if (entity.telephone) out.telephone = entity.telephone;
  if (entity.logoPath) {
    out.logo = { '@type': 'ImageObject', url: absoluteUrl(entity.logoPath), width: 180, height: 180 };
    out.image = absoluteUrl(entity.logoPath);
  }
  // LocalBusiness-only fields — emitted only when the entity defines them.
  if (entity.priceRange) out.priceRange = entity.priceRange;
  if (entity.openingHoursSpecification?.length) {
    out.openingHoursSpecification = entity.openingHoursSpecification;
  }
  if (entity.hasCredential?.length) out.hasCredential = entity.hasCredential;
  if (entity.memberOf) out.memberOf = entity.memberOf;
  if (entity.award?.length) out.award = entity.award;
  if (entity.sameAs?.length) out.sameAs = entity.sameAs;
  if (entity.areaServed) out.areaServed = entity.areaServed;
  if (entity.founder) out.founder = { '@id': founderId(entity) };
  if (entity.sponsor) {
    out.sponsor = { '@type': 'Organization', name: entity.sponsor.name, url: entity.sponsor.url };
  }

  return out;
}

function buildFounder(entity: BusinessSchema): JsonLdNode | null {
  const f = entity.founder;
  if (!f) return null;
  return {
    '@type': 'Person',
    '@id': founderId(entity),
    name: f.name,
    honorificPrefix: f.honorificPrefix,
    jobTitle: f.jobTitle,
    description: f.description,
    url: absoluteUrl(f.path),
    worksFor: { '@id': businessId(entity.idFragment) },
    ...(entity.sponsor
      ? { affiliation: { '@type': 'Organization', name: entity.sponsor.name, url: entity.sponsor.url } }
      : {}),
  };
}

function buildPageNodes(page: PageSchema, entity: BusinessSchema, description?: string): JsonLdNode[] {
  const nodes: JsonLdNode[] = [];

  if (page.schemaType !== 'FAQOnly') {
    const main: JsonLdNode = {
      '@type': page.schemaType,
      '@id': pageId(page.path),
      name: page.name,
      url: absoluteUrl(page.path),
      inLanguage: LANGUAGE,
      isPartOf: { '@id': websiteId() },
      about: { '@id': businessId(entity.idFragment) },
    };
    const desc = description || page.description;
    if (desc) main.description = desc;
    if (page.breadcrumb.length > 1) main.breadcrumb = { '@id': breadcrumbId(page.path) };
    if (page.schemaType === 'AboutPage' && entity.founder) {
      main.mainEntity = { '@id': founderId(entity) };
    }
    if (page.schemaType === 'Service') {
      main.serviceType = page.serviceType;
      main.provider = { '@id': businessId(entity.idFragment) };
      main.areaServed = entity.areaServed || { '@type': 'AdministrativeArea', name: 'Hawaiian Islands' };
    }
    nodes.push(main);
  }

  if (page.faq?.length) {
    nodes.push({
      '@type': 'FAQPage',
      mainEntity: page.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
  }

  if (page.breadcrumb.length > 1) {
    nodes.push({
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId(page.path),
      itemListElement: page.breadcrumb.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    });
  }

  return nodes;
}

const pagesByPath = new Map(pages.map((page) => [normalizePath(page.path), page]));

/** Every indexable static route — the single source for schema AND `/sitemap.xml`. */
export function getSchemaPaths(): string[] {
  return pages.map((page) => normalizePath(page.path));
}

export interface JsonLdContext {
  /** The page's real `<meta name="description">` — keeps schema in sync with the page. */
  description?: string;
  /** Extra nodes a dynamic route adds (e.g. a BlogPosting). */
  extraNodes?: JsonLdNode[];
}

/**
 * One self-contained `@graph` for the current path.
 * WebSite + Organization are included on every page so `@id` references always
 * resolve within the page (Google does not follow them across pages).
 */
export function getJsonLdGraph(pathname: string, ctx: JsonLdContext = {}): JsonLdNode | null {
  if (!siteOrigin()) return null;

  const path = normalizePath(pathname);
  const page = pagesByPath.get(path);
  const graph: JsonLdNode[] = [buildWebsite(business), buildOrganization(business)];

  const founderPath = business.founder ? normalizePath(business.founder.path) : null;
  if (path === '/' || path === founderPath) {
    const founder = buildFounder(business);
    if (founder) graph.push(founder);
  }

  if (page) graph.push(...buildPageNodes(page, business, ctx.description));
  if (ctx.extraNodes?.length) graph.push(...ctx.extraNodes);

  return { '@context': 'https://schema.org', '@graph': graph };
}

export interface ArticleSchemaInput {
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  updatedAt?: string;
  author?: string;
  imageUrl?: string;
}

/** BlogPosting + breadcrumb nodes for `/blog/[slug]` (data comes from the post). */
export function getArticleNodes(post: ArticleSchemaInput): JsonLdNode[] {
  if (!siteOrigin()) return [];
  const path = `/blog/${post.slug}`;
  const url = absoluteUrl(path);

  const article: JsonLdNode = {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: post.publishDate,
    dateModified: post.updatedAt || post.publishDate,
    inLanguage: LANGUAGE,
    isPartOf: { '@id': websiteId() },
    author: post.author ? { '@type': 'Person', name: post.author } : { '@id': businessId(business.idFragment) },
    publisher: { '@id': businessId(business.idFragment) },
    breadcrumb: { '@id': breadcrumbId(path) },
  };
  if (post.imageUrl) article.image = post.imageUrl;

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path },
  ];

  return [
    article,
    {
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId(path),
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: absoluteUrl(c.path),
      })),
    },
  ];
}
