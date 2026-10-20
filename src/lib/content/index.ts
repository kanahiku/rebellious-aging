import type {
  BlogPost,
  Book,
  BookSeries,
  ContactPageContent,
  HomePageContent,
  HowAgingWorksContent,
  TalkToDoctorContent,
  AboutPageContent,
  OhanaPageContent,
  DecadePageContent,
  DecadeKey,
  FillFirstBucketContent,
  FourPillarsContent,
  AthenaEvaluationContent,
  LegalPageContent,
  NavigationContent,
  BooksPageContent,
  PodcastPageContent,
  BlogIndexContent,
  NavLink,
  PodcastEpisode,
  PodcastPartGroup,
  ReviewsPageContent,
  ServicePageContent,
  Testimonial,
} from './types';
import {
  getSanityBlogPost,
  getSanityBlogPosts,
  getSanityBlogPostSlugs,
  getSanityBlogPostSitemapEntries,
  getSanityBooks,
  getSanityPodcastEpisodes,
  getSanityTestimonials,
  groupEpisodesByPart,
  getSanityContactPage,
  getSanityHomeContent,
  getSanityHowAgingWorks,
  getSanityTalkToDoctor,
  getSanityAbout,
  getSanityOhana,
  getSanityDecade,
  getSanityFillFirstBucket,
  getSanityFourPillars,
  getSanityAthenaEvaluation,
  getSanityLegal,
  getSanityBooksPage,
  getSanityPodcastPage,
  getSanityBlogIndex,
  getSanityNavigationContent,
  getSanityReviewsPage,
  getSanityServicePage,
  getSanityServicePageSlugs,
} from './sanity';
import { ATHENA_CONTACT_HREF } from '~/config/cta';
import { getSchemaPaths } from '~/config/schema';
import { blogPosts as localBlogPosts } from '../../data/pages/blogPosts';
/* contact page removed */
import { navigationData } from '../../data/navigation';

export async function getHomeContent(): Promise<HomePageContent> {
  const page = await getSanityHomeContent();
  if (!page) {
    throw new Error('Sanity homePage document is missing (singleton-home).');
  }
  return page;
}

export async function getHowAgingWorksContent(): Promise<HowAgingWorksContent> {
  const page = await getSanityHowAgingWorks();
  if (!page) {
    throw new Error('Sanity howAgingWorksPage document is missing (singleton-how-aging-works).');
  }
  return page;
}

export async function getTalkToDoctorContent(): Promise<TalkToDoctorContent> {
  const page = await getSanityTalkToDoctor();
  if (!page) {
    throw new Error('Sanity talkToDoctorPage document is missing (singleton-talk-to-doctor).');
  }
  return page;
}

export async function getAboutContent(): Promise<AboutPageContent> {
  const page = await getSanityAbout();
  if (!page) {
    throw new Error('Sanity aboutPage document is missing (singleton-about).');
  }
  return page;
}

export async function getOhanaContent(): Promise<OhanaPageContent> {
  const page = await getSanityOhana();
  if (!page) {
    throw new Error('Sanity ohanaPage document is missing (singleton-ohana).');
  }
  return page;
}

export async function getDecadeContent(key: DecadeKey): Promise<DecadePageContent> {
  const page = await getSanityDecade(key);
  if (!page) {
    throw new Error(`Sanity decadePage document is missing (decade-${key}).`);
  }
  return page;
}

export async function getFillFirstBucketContent(): Promise<FillFirstBucketContent> {
  const page = await getSanityFillFirstBucket();
  if (!page) {
    throw new Error('Sanity fillFirstBucketPage document is missing (singleton-fill-first-bucket).');
  }
  return page;
}

export async function getBooksPageContent(): Promise<BooksPageContent> {
  const page = await getSanityBooksPage();
  if (!page) throw new Error('Sanity booksPage document is missing (singleton-books).');
  return page;
}

export async function getPodcastPageContent(): Promise<PodcastPageContent> {
  const page = await getSanityPodcastPage();
  if (!page) throw new Error('Sanity podcastPage document is missing (singleton-podcast).');
  return page;
}

export async function getBlogIndexContent(): Promise<BlogIndexContent> {
  const page = await getSanityBlogIndex();
  if (!page) throw new Error('Sanity blogIndexPage document is missing (singleton-blog-index).');
  return page;
}

export async function getFourPillarsContent(): Promise<FourPillarsContent> {
  const page = await getSanityFourPillars();
  if (!page) {
    throw new Error('Sanity fourPillarsPage document is missing (singleton-four-pillars).');
  }
  return page;
}

export async function getAthenaEvaluationContent(): Promise<AthenaEvaluationContent> {
  const page = await getSanityAthenaEvaluation();
  if (!page) {
    throw new Error('Sanity athenaEvaluationPage document is missing (singleton-athena-evaluation).');
  }
  return page;
}

export async function getLegalContent(slug: 'privacy-policy' | 'terms-of-service'): Promise<LegalPageContent> {
  const page = await getSanityLegal(slug);
  if (!page) {
    throw new Error(`Sanity legalPage document is missing (legal-${slug}).`);
  }
  return page;
}

export async function getContactPage(): Promise<ContactPageContent | null> {
  try {
    return await getSanityContactPage();
  } catch (error) {
    console.warn('Sanity contact page unavailable; using local form fallback.', error);
    return null;
  }
}

export async function getReviewsPage(): Promise<ReviewsPageContent | null> {
  try {
    return await getSanityReviewsPage();
  } catch (error) {
    console.warn('Sanity reviews page unavailable; using live review feed fallback.', error);
    return null;
  }
}

/* getContactHelpOptions removed — contact page deleted */

const LEGAL_FOOTER_LINKS = [
  { text: 'Privacy Policy', href: '/privacy-policy' },
  { text: 'Terms of Service', href: '/terms-of-service' },
];

const HIDDEN_NAV_HREFS = new Set(['/chapters', '/guidebooks', '/accessibility']);
const HIDDEN_NAV_LABELS = new Set(['chapters', 'guidebooks', 'guidebook series']);

function isHiddenNavLink(link: { text: string; href?: string }): boolean {
  return (
    (link.href != null && HIDDEN_NAV_HREFS.has(link.href)) ||
    HIDDEN_NAV_LABELS.has(link.text.toLowerCase())
  );
}

function isInternalContactHref(href?: string): boolean {
  if (!href) return false;
  const path = href.split('?')[0]?.replace(/\/+$/, '') ?? '';
  return path === '/contact';
}

function remapContactHref(href: string): string {
  return isInternalContactHref(href) ? ATHENA_CONTACT_HREF : href;
}

function remapNavLink(link: NavLink): NavLink {
  return {
    ...link,
    href: link.href ? remapContactHref(link.href) : link.href,
    links: link.links?.map((item) => ({ ...item, href: remapContactHref(item.href) })),
    columns: link.columns?.map((col) => ({
      ...col,
      links: col.links.map((item) => ({ ...item, href: remapContactHref(item.href) })),
    })),
  };
}

function hidePagesFromUi(nav: NavigationContent): NavigationContent {
  return {
    ...nav,
    header: {
      ...nav.header,
      links: nav.header.links.filter((link) => !isHiddenNavLink(link)).map(remapNavLink),
      actions: nav.header.actions.map((action) =>
        action.href ? { ...action, href: remapContactHref(action.href) } : action
      ),
    },
    footer: {
      ...nav.footer,
      links: nav.footer.links
        .filter((column) => column.title.toLowerCase() !== 'chapters')
        .map((column) => ({
          ...column,
          links: column.links
            .filter((link) => !isHiddenNavLink(link))
            .map((link) => ({ ...link, href: remapContactHref(link.href) })),
        })),
      secondaryLinks: nav.footer.secondaryLinks
        .filter((link) => !isHiddenNavLink(link))
        .map((link) => ({
          ...link,
          href: remapContactHref(link.href),
        })),
    },
  };
}

function ensureLegalFooterLinks(nav: NavigationContent): NavigationContent {
  const existing = nav.footer.secondaryLinks ?? [];
  const byHref = new Map(existing.map((link) => [link.href, link]));
  const merged = LEGAL_FOOTER_LINKS.map((link) => byHref.get(link.href) ?? link);

  for (const link of existing) {
    if (!merged.some((item) => item.href === link.href)) merged.push(link);
  }

  return {
    ...nav,
    footer: { ...nav.footer, secondaryLinks: merged },
  };
}

export async function getNavigationContent(): Promise<NavigationContent> {
  try {
    const nav = await getSanityNavigationContent();
    if (nav?.header && nav?.footer) {
      return hidePagesFromUi(ensureLegalFooterLinks(nav));
    }
  } catch (error) {
    console.warn('Sanity navigation unavailable; using local fallback.', error);
  }
  return hidePagesFromUi(ensureLegalFooterLinks(navigationData));
}

export async function findServicePage(slug: string): Promise<ServicePageContent | null> {
  return getSanityServicePage(slug);
}

export async function getServicePage(slug: string): Promise<ServicePageContent> {
  const page = await findServicePage(slug);
  if (!page) {
    throw new Error(`Sanity servicePage document is missing for slug "${slug}".`);
  }
  return page;
}

export async function getServicePageSlugs(): Promise<string[]> {
  try {
    return await getSanityServicePageSlugs();
  } catch (error) {
    console.warn('Sanity service page slugs unavailable.', error);
    return [];
  }
}

export async function getBlogPostSlugs(): Promise<string[]> {
  const [sanitySlugs, localSlugs] = await Promise.all([
    getSanityBlogPostSlugs().catch(() => [] as string[]),
    Promise.resolve(localBlogPosts.map((post) => post.slug)),
  ]);
  return [...new Set([...localSlugs, ...sanitySlugs])];
}

/** Every static route — shared with schema.org (`src/config/schema/pages.ts`). */
const STATIC_PATHS = getSchemaPaths();

export interface SitemapEntry {
  path: string;
  /** ISO date (YYYY-MM-DD). Only set where we know the real last-modified date. */
  lastmod?: string;
}

const toDate = (value?: string) => (value && !Number.isNaN(Date.parse(value)) ? value.slice(0, 10) : undefined);

/**
 * Every public URL for `/sitemap.xml`: static routes (from the schema page list),
 * CMS service pages, and blog posts with a real `lastmod` from Sanity.
 */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const [pageSlugs, sanityPosts] = await Promise.all([
    getServicePageSlugs(),
    getSanityBlogPostSitemapEntries().catch(() => [] as { slug: string; updatedAt?: string }[]),
  ]);

  const posts = new Map<string, SitemapEntry>();
  for (const post of localBlogPosts) {
    posts.set(post.slug, { path: `/blog/${post.slug}`, lastmod: toDate(post.updatedAt || post.publishDate) });
  }
  for (const post of sanityPosts) {
    posts.set(post.slug, { path: `/blog/${post.slug}`, lastmod: toDate(post.updatedAt) });
  }

  const entries: SitemapEntry[] = [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...pageSlugs.map((slug) => ({ path: `/${slug.replace(/^\/+/, '')}` })),
    ...posts.values(),
  ];

  const seen = new Set<string>();
  return entries.filter((entry) => !seen.has(entry.path) && seen.add(entry.path));
}

export async function getPublicContentPaths(): Promise<string[]> {
  return (await getSitemapEntries()).map((entry) => entry.path);
}

export function getBlogPermalink(slug: string): string {
  return `/blog/${slug}`;
}

function overlayCmsFields(local: BlogPost, sanity: BlogPost): BlogPost {
  return {
    ...local,
    title: sanity.title || local.title,
    excerpt: sanity.excerpt || local.excerpt,
    publishDate: sanity.publishDate || local.publishDate,
    updatedAt: sanity.updatedAt || local.updatedAt,
    author: sanity.author || local.author,
    image: sanity.image?.src ? sanity.image : local.image,
    relatedPages: sanity.relatedPages.length ? sanity.relatedPages : local.relatedPages,
    contentBlocks: sanity.contentBlocks?.length ? sanity.contentBlocks : local.contentBlocks,
  };
}

function mergeBlogPosts(sanityPosts: BlogPost[], localPosts: BlogPost[]): BlogPost[] {
  const localBySlug = new Map(localPosts.map((post) => [post.slug, post]));
  const sanityBySlug = new Map(sanityPosts.map((post) => [post.slug, post]));
  const slugs = new Set([...localBySlug.keys(), ...sanityBySlug.keys()]);

  return [...slugs]
    .map((slug) => {
      const sanity = sanityBySlug.get(slug);
      const local = localBySlug.get(slug);
      if (sanity && local) return overlayCmsFields(local, sanity);
      return (sanity ?? local)!;
    })
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await getSanityBlogPosts();
    if (posts.length) return mergeBlogPosts(posts, localBlogPosts);
  } catch (error) {
    console.warn('Sanity blog posts unavailable; using local articles.', error);
  }
  return [...localBlogPosts].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const local = localBlogPosts.find((post) => post.slug === slug);
  let sanity: BlogPost | undefined;
  try {
    sanity = (await getSanityBlogPost(slug)) ?? undefined;
  } catch (error) {
    console.warn(`Sanity blog post "${slug}" unavailable; checking local articles.`, error);
  }

  if (sanity && local) return overlayCmsFields(local, sanity);
  return sanity ?? local;
}

export async function getBlogPostsRelatedTo(pageSlug: string): Promise<BlogPost[]> {
  const key = pageSlug.replace(/^\/+/, '');
  const posts = await getBlogPosts();
  return posts.filter((post) => post.relatedPages.includes(key)).slice(0, 3);
}

export async function getBooks(): Promise<Book[]> {
  try {
    return await getSanityBooks();
  } catch (error) {
    console.warn('Sanity books unavailable.', error);
    return [];
  }
}

export async function getRelatedBlogPosts(post: BlogPost, max = 3): Promise<BlogPost[]> {
  const keys = new Set(post.relatedPages);
  if (!keys.size) return [];

  const posts = await getBlogPosts();
  return posts
    .filter((item) => item.slug !== post.slug)
    .map((item) => ({
      item,
      score: item.relatedPages.filter((key) => keys.has(key)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.item.publishDate.localeCompare(a.item.publishDate))
    .slice(0, max)
    .map(({ item }) => item);
}

export type {
  BlogPost,
  Book,
  BookSeries,
  ContactPageContent,
  HomePageContent,
  HowAgingWorksContent,
  TalkToDoctorContent,
  AboutPageContent,
  OhanaPageContent,
  DecadePageContent,
  FillFirstBucketContent,
  FourPillarsContent,
  AthenaEvaluationContent,
  LegalPageContent,
  NavigationContent,
  PodcastEpisode,
  PodcastPartGroup,
  ReviewsPageContent,
  ServicePageContent,
  Testimonial,
};

export { groupEpisodesByPart };

export async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
  try {
    return await getSanityPodcastEpisodes();
  } catch (error) {
    console.warn('Sanity podcast episodes unavailable.', error);
    return [];
  }
}

export function formatTestimonialAttribution(item: Testimonial): string {
  const identity = typeof item.age === 'number' ? `${item.name}, ${item.age}` : item.name;
  return [identity, item.location, item.tenure].filter(Boolean).join(' · ');
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await getSanityTestimonials();
  } catch (error) {
    console.warn('Sanity testimonials unavailable.', error);
    return [];
  }
}
