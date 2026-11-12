import { sanityClient } from '../../sanity/client';

/** Per-page SEO fields editors can set in the studio's shared `seo` object. */
export interface SeoOverride {
  canonical?: string;
  noIndex?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  schemaMode?: 'auto' | 'add' | 'replace';
  schemaJson?: string;
}

/** Business details from the Site Settings singleton (feeds Organization / LocalBusiness JSON-LD). */
export interface SiteSettingsContent {
  businessName?: string;
  businessType?: string;
  description?: string;
  logoUrl?: string;
  telephone?: string;
  email?: string;
  address?: { street?: string; city?: string; region?: string; postalCode?: string; country?: string };
  geo?: { lat?: number; lng?: number };
  serviceArea?: string;
  priceRange?: string;
  hours?: { days?: string[]; opens?: string; closes?: string }[];
  socialLinks?: string[];
}

export interface SeoData {
  byPath: Map<string, SeoOverride>;
  settings: SiteSettingsContent | null;
}

const SEO_PROJECTION = /* groq */ `{
  canonical, noIndex, ogTitle, ogDescription,
  "ogImageUrl": ogImage.asset->url,
  schemaMode, schemaJson
}`;

const SEO_QUERY = /* groq */ `{
  "pages": *[!(_id in path("drafts.**")) && defined(meta)]{ _id, _type, "slug": slug.current, "seo": meta${SEO_PROJECTION} },
  "posts": *[_type == "blogPost" && defined(seo) && defined(slug.current)]{ "slug": slug.current, "seo": seo${SEO_PROJECTION} },
  "settings": *[_type == "siteSettings" && _id == "singleton-site-settings"][0]{
    businessName, businessType, description, telephone, email, address, serviceArea, priceRange, socialLinks,
    "logoUrl": logo.asset->url,
    "geo": geo{lat, lng},
    hours[]{days, opens, closes}
  }
}`;

/** Fixed documents -> route. Service pages use their slug; posts use /blog/<slug>. */
const DOC_PATHS: Record<string, string> = {
  'singleton-home': '/',
  'singleton-how-aging-works': '/how-aging-works',
  'singleton-talk-to-doctor': '/talk-to-your-doctor',
  'singleton-about': '/about',
  'singleton-ohana': '/ohana',
  'singleton-fill-first-bucket': '/fill-the-first-bucket',
  'singleton-four-pillars': '/four-pillars',
  'singleton-athena-evaluation': '/athena-evaluation',
  'singleton-reviews': '/reviews',
  'singleton-books': '/books',
  'singleton-podcast': '/podcast',
  'singleton-blog-index': '/blog',
  'singleton-directory': '/directory',
  'legal-privacy-policy': '/privacy-policy',
  'legal-terms-of-service': '/terms-of-service',
  'decade-30s': '/in-your-30s',
  'decade-40s': '/in-your-40s',
  'decade-50s': '/in-your-50s',
  'decade-60s': '/in-your-60s',
  'decade-70-plus': '/70-plus',
};

type RawSeo = Record<string, unknown> | null | undefined;
const clean = (raw: RawSeo): SeoOverride | null => {
  if (!raw) return null;
  const out: SeoOverride = {};
  if (typeof raw.canonical === 'string' && raw.canonical) out.canonical = raw.canonical;
  if (raw.noIndex === true) out.noIndex = true;
  if (typeof raw.ogTitle === 'string' && raw.ogTitle) out.ogTitle = raw.ogTitle;
  if (typeof raw.ogDescription === 'string' && raw.ogDescription) out.ogDescription = raw.ogDescription;
  if (typeof raw.ogImageUrl === 'string' && raw.ogImageUrl) out.ogImageUrl = raw.ogImageUrl;
  if (raw.schemaMode === 'add' || raw.schemaMode === 'replace') {
    out.schemaMode = raw.schemaMode;
    if (typeof raw.schemaJson === 'string') out.schemaJson = raw.schemaJson;
  }
  return Object.keys(out).length ? out : null;
};

const TTL_MS = 60_000;
let cache: { at: number; data: SeoData } | null = null;

/** All SEO overrides + site settings in one request, cached for a minute. Never throws. */
export async function getSanitySeoData(): Promise<SeoData> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;
  const data: SeoData = { byPath: new Map(), settings: null };
  try {
    const res = await sanityClient.fetch<{
      pages?: { _id: string; _type: string; slug?: string; seo?: RawSeo }[];
      posts?: { slug: string; seo?: RawSeo }[];
      settings?: SiteSettingsContent | null;
    }>(SEO_QUERY);
    for (const p of res?.pages ?? []) {
      const path = DOC_PATHS[p._id] ?? (p._type === 'servicePage' && p.slug ? `/${p.slug}` : undefined);
      const seo = clean(p.seo);
      if (path && seo) data.byPath.set(path, seo);
    }
    for (const p of res?.posts ?? []) {
      const seo = clean(p.seo);
      if (seo) data.byPath.set(`/blog/${p.slug}`, seo);
    }
    data.settings = res?.settings ?? null;
  } catch {
    return cache?.data ?? data;
  }
  cache = { at: Date.now(), data };
  return data;
}
