import { sanityClient } from '../../sanity/client';
import { resolveContentImage } from '../../sanity/image';
import type { Book, BookCta, BookSeries, PodcastEpisode, PodcastEpisodeStatus, PodcastPartGroup, Testimonial } from '../types';
import { type FetchedImage, IMAGE_PROJECTION } from './shared';
import { series } from './index-pages';

export type SanityBook = {
  _id: string;
  slug?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: FetchedImage | null;
  badges?: string[] | null;
  publisher?: { name?: string; year?: number } | null;
  ctas?: { _key?: string; label?: string; href?: string }[] | null;
  podcastHref?: string | null;
  series?: string | null;
  order?: number | null;
};

export const BOOKS_QUERY = /* groq */ `
  *[_type == "book" && defined(slug.current)] | order(order asc, title asc) {
    _id,
    "slug": slug.current,
    title,
    subtitle,
    description,
    "image": {
      ${IMAGE_PROJECTION}
    },
    badges,
    publisher { name, year },
    ctas[] { _key, label, href },
    podcastHref,
    series,
    order
  }
`;

export const BOOK_SERIES: BookSeries[] = ['textbook', 'guidebook', 'bargaining'];

export function isBookSeries(value: string | null | undefined): value is BookSeries {
  return BOOK_SERIES.includes(value as BookSeries);
}

export function normalizeBook(doc: SanityBook): Book | null {
  if (!doc._id || !doc.slug || !doc.title) return null;

  const ctas: BookCta[] = (doc.ctas ?? [])
    .filter((cta): cta is { _key?: string; label: string; href: string } => Boolean(cta?.label && cta?.href))
    .map((cta) => ({ _key: cta._key, label: cta.label, href: cta.href }));

  const publisherName = doc.publisher?.name?.trim();
  const publisherYear = doc.publisher?.year;
  const publisherNote = [publisherName, publisherYear].filter(Boolean).join(' · ') || undefined;

  return {
    _id: doc._id,
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle || undefined,
    description: doc.description || undefined,
    image: resolveContentImage(doc.image),
    badges: (doc.badges ?? []).filter((badge): badge is string => Boolean(badge?.trim())),
    publisherName,
    publisherYear,
    publisherNote,
    ctas,
    podcastHref: doc.podcastHref || undefined,
    series: isBookSeries(doc.series) ? doc.series : 'guidebook',
    order: typeof doc.order === 'number' ? doc.order : 0,
  };
}

export async function getSanityBooks(): Promise<Book[]> {
  const docs = await sanityClient.fetch<SanityBook[]>(BOOKS_QUERY);
  return (docs ?? []).map(normalizeBook).filter((book): book is Book => Boolean(book));
}

// ─── Podcast ──────────────────────────────────────────────────────────────────

export const PODCAST_EPISODES_QUERY = /* groq */ `
  *[_type == "podcastEpisode"] | order(order asc) {
    _id,
    "slug": slug.current,
    title,
    description,
    status,
    order,
    part,
    partName,
    partDescription,
    spotifyUrl,
    youtubeUrl,
    guidebookHref,
  }
`;

export type SanityPodcastEpisode = {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  status: string;
  order: number;
  part: number;
  partName: string;
  partDescription?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  guidebookHref?: string;
};

export function isPodcastStatus(s: unknown): s is PodcastEpisodeStatus {
  return s === 'live' || s === 'coming-soon';
}

export function normalizePodcastEpisode(doc: SanityPodcastEpisode): PodcastEpisode | null {
  if (!doc?._id || !doc.title) return null;
  return {
    _id: doc._id,
    slug: doc.slug || doc._id,
    title: doc.title,
    description: doc.description || undefined,
    status: isPodcastStatus(doc.status) ? doc.status : 'coming-soon',
    order: typeof doc.order === 'number' ? doc.order : 0,
    part: typeof doc.part === 'number' ? doc.part : 1,
    partName: doc.partName || '',
    partDescription: doc.partDescription || undefined,
    spotifyUrl: doc.spotifyUrl || undefined,
    youtubeUrl: doc.youtubeUrl || undefined,
    guidebookHref: doc.guidebookHref || undefined,
  };
}

export async function getSanityPodcastEpisodes(): Promise<PodcastEpisode[]> {
  const docs = await sanityClient.fetch<SanityPodcastEpisode[]>(PODCAST_EPISODES_QUERY);
  return (docs ?? []).map(normalizePodcastEpisode).filter((ep): ep is PodcastEpisode => Boolean(ep));
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const TESTIMONIALS_QUERY = /* groq */ `
  *[_type == "testimonial" && defined(quote) && defined(name)] | order(order asc, name asc) {
    _id,
    quote,
    name,
    age,
    location,
    tenure,
    order
  }
`;

export type SanityTestimonial = {
  _id: string;
  quote?: string;
  name?: string;
  age?: number;
  location?: string;
  tenure?: string;
  order?: number;
};

export function normalizeTestimonial(doc: SanityTestimonial): Testimonial | null {
  if (!doc?._id || !doc.quote?.trim() || !doc.name?.trim() || !doc.tenure?.trim()) return null;
  return {
    _id: doc._id,
    quote: doc.quote.trim(),
    name: doc.name.trim(),
    age: typeof doc.age === 'number' ? doc.age : undefined,
    location: doc.location?.trim() || undefined,
    tenure: doc.tenure.trim(),
    order: typeof doc.order === 'number' ? doc.order : 0,
  };
}

export async function getSanityTestimonials(): Promise<Testimonial[]> {
  const docs = await sanityClient.fetch<SanityTestimonial[]>(TESTIMONIALS_QUERY);
  return (docs ?? []).map(normalizeTestimonial).filter((item): item is Testimonial => Boolean(item));
}

/** Returns episodes grouped by part (sorted by part number, then episode order). */
export function groupEpisodesByPart(episodes: PodcastEpisode[]): PodcastPartGroup[] {
  const map = new Map<number, PodcastPartGroup>();
  for (const ep of episodes) {
    if (!map.has(ep.part)) {
      map.set(ep.part, {
        part: ep.part,
        partName: ep.partName,
        partDescription: ep.partDescription,
        episodes: [],
      });
    }
    map.get(ep.part)!.episodes.push(ep);
  }
  return [...map.values()].sort((a, b) => a.part - b.part);
}
