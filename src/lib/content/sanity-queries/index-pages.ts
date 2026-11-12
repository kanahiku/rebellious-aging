import { sanityClient } from '../../sanity/client';
import { resolveContentImage } from '../../sanity/image';
import type { BooksPageContent, PodcastPageContent, BlogIndexContent, DirectoryPageContent } from '../types';
import { type FetchedImage, homeImage, text } from './shared';
import { type Nullable } from './about';

// ─── Books / Podcast / Blog index pages ──────────────────────────────────────

export const BOOKS_PAGE_QUERY = /* groq */ `
  *[_type == "booksPage" && _id == "singleton-books"][0] {
    meta,
    hero { title, subtitle, "image": ${homeImage('image')} },
    tabs { textbook, guidebook, bargaining, podcast },
    series {
      textbook { eyebrow, heading, description },
      guidebook { eyebrow, heading, description },
      bargaining { eyebrow, heading, description },
      podcastLinkLabel
    }
  }
`;

export type RawSeries = { eyebrow?: string | null; heading?: string | null; description?: string | null } | null | undefined;
export const series = (s: RawSeries) => ({
  eyebrow: text(s?.eyebrow),
  heading: text(s?.heading),
  description: text(s?.description),
});

export async function getSanityBooksPage(): Promise<BooksPageContent | null> {
  const raw = await sanityClient.fetch<{
    meta?: Nullable<BooksPageContent['meta']> | null;
    hero?: { title?: string | null; subtitle?: string | null; image?: FetchedImage } | null;
    tabs?: Nullable<BooksPageContent['tabs']> | null;
    series?: {
      textbook?: RawSeries;
      guidebook?: RawSeries;
      bargaining?: RawSeries;
      podcastLinkLabel?: string | null;
    } | null;
  } | null>(BOOKS_PAGE_QUERY);
  if (!raw) return null;
  return {
    meta: { title: text(raw.meta?.title), description: text(raw.meta?.description) },
    hero: {
      title: text(raw.hero?.title),
      subtitle: text(raw.hero?.subtitle),
      image: resolveContentImage(raw.hero?.image),
    },
    tabs: {
      textbook: text(raw.tabs?.textbook),
      guidebook: text(raw.tabs?.guidebook),
      bargaining: text(raw.tabs?.bargaining),
      podcast: text(raw.tabs?.podcast),
    },
    series: {
      textbook: series(raw.series?.textbook),
      guidebook: series(raw.series?.guidebook),
      bargaining: series(raw.series?.bargaining),
      podcastLinkLabel: text(raw.series?.podcastLinkLabel),
    },
  };
}

export const DIRECTORY_PAGE_QUERY = /* groq */ `
  *[_type == "directoryPage" && _id == "singleton-directory"][0] {
    meta,
    hero { title, subtitle, "image": ${homeImage('image')} },
    intro { lede }
  }
`;

export async function getSanityDirectoryPage(): Promise<DirectoryPageContent | null> {
  const raw = await sanityClient.fetch<{
    meta?: Nullable<DirectoryPageContent['meta']> | null;
    hero?: { title?: string | null; subtitle?: string | null; image?: FetchedImage } | null;
    intro?: { lede?: string | null } | null;
  } | null>(DIRECTORY_PAGE_QUERY);
  if (!raw) return null;
  return {
    meta: { title: text(raw.meta?.title), description: text(raw.meta?.description) },
    hero: {
      title: text(raw.hero?.title),
      subtitle: text(raw.hero?.subtitle),
      image: resolveContentImage(raw.hero?.image),
    },
    intro: { lede: text(raw.intro?.lede) },
  };
}

export const PODCAST_PAGE_QUERY = /* groq */ `
  *[_type == "podcastPage" && _id == "singleton-podcast"][0] {
    meta,
    hero { title, subtitle, "image": ${homeImage('image')} },
    roadmap { eyebrow, heading, description, spotifyLabel, youtubeLabel, episodeCtaText }
  }
`;

export async function getSanityPodcastPage(): Promise<PodcastPageContent | null> {
  const raw = await sanityClient.fetch<{
    meta?: Nullable<PodcastPageContent['meta']> | null;
    hero?: { title?: string | null; subtitle?: string | null; image?: FetchedImage } | null;
    roadmap?: Nullable<PodcastPageContent['roadmap']> | null;
  } | null>(PODCAST_PAGE_QUERY);
  if (!raw) return null;
  return {
    meta: { title: text(raw.meta?.title), description: text(raw.meta?.description) },
    hero: {
      title: text(raw.hero?.title),
      subtitle: text(raw.hero?.subtitle),
      image: resolveContentImage(raw.hero?.image),
    },
    roadmap: {
      eyebrow: text(raw.roadmap?.eyebrow),
      heading: text(raw.roadmap?.heading),
      description: text(raw.roadmap?.description),
      spotifyLabel: text(raw.roadmap?.spotifyLabel),
      youtubeLabel: text(raw.roadmap?.youtubeLabel),
      episodeCtaText: text(raw.roadmap?.episodeCtaText),
    },
  };
}

export const BLOG_INDEX_QUERY = /* groq */ `
  *[_type == "blogIndexPage" && _id == "singleton-blog-index"][0] {
    meta, heading, emptyMessage, backLabel, cta { title, subtitle, ctaText }
  }
`;

export async function getSanityBlogIndex(): Promise<BlogIndexContent | null> {
  const raw = await sanityClient.fetch<{
    meta?: Nullable<BlogIndexContent['meta']> | null;
    heading?: string | null;
    emptyMessage?: string | null;
    backLabel?: string | null;
    cta?: Nullable<BlogIndexContent['cta']> | null;
  } | null>(BLOG_INDEX_QUERY);
  if (!raw) return null;
  return {
    meta: { title: text(raw.meta?.title), description: text(raw.meta?.description) },
    heading: text(raw.heading),
    emptyMessage: text(raw.emptyMessage),
    backLabel: text(raw.backLabel),
    cta: { title: text(raw.cta?.title), subtitle: text(raw.cta?.subtitle), ctaText: text(raw.cta?.ctaText) },
  };
}
