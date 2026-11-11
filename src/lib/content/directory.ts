import { sanityClient } from '../sanity/client';
import { resolveContentImage, type SanityImageFields } from '../sanity/image';
import type { ContentImage } from './types';

export interface DirectoryBusiness {
  slug: string;
  name: string;
  shortDescription: string;
  /** Paragraphs, split on blank lines. */
  fullDescription: string[];
  types: string[];
  when: string;
  /** One or more areas, e.g. Kailua, Island-wide. */
  locations: string[];
  where: string;
  mapsUrl?: string;
  phone?: string;
  website?: string;
  email?: string;
  whoFor?: string;
  /** Short "Good to know" tags, e.g. Free, Insurance. */
  notes: string[];
  image?: ContentImage;
}

type RawBusiness = Omit<DirectoryBusiness, 'fullDescription' | 'image' | 'types' | 'locations' | 'notes'> & {
  fullDescription?: string;
  types?: string[];
  locations?: string[];
  notes?: string[];
  image?: SanityImageFields | null;
};

const BUSINESS_PROJECTION = /* groq */ `{
  "slug": slug.current,
  name, shortDescription, fullDescription, types, when, locations, where, mapsUrl,
  phone, website, email, whoFor, notes,
  "image": select(defined(image.asset) => {
    "src": image.asset->url,
    "alt": coalesce(image.alt, name),
    "crop": image.crop,
    "hotspot": image.hotspot,
    "asset": image.asset
  })
}`;

const LIST_QUERY = /* groq */ `
  *[_type == "directoryBusiness" && defined(slug.current)] | order(coalesce(order, 9999) asc, name asc) ${BUSINESS_PROJECTION}
`;

const clean = (v?: string | null) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);

function normalize(raw: RawBusiness): DirectoryBusiness {
  return {
    slug: raw.slug,
    name: raw.name,
    shortDescription: raw.shortDescription ?? '',
    fullDescription: (raw.fullDescription ?? '')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
    types: (raw.types ?? []).map((t) => t.trim()).filter(Boolean),
    when: raw.when ?? '',
    locations: (raw.locations ?? []).map((t) => t.trim()).filter(Boolean),
    where: raw.where ?? '',
    mapsUrl: clean(raw.mapsUrl),
    phone: clean(raw.phone),
    website: clean(raw.website),
    email: clean(raw.email),
    whoFor: clean(raw.whoFor),
    notes: (raw.notes ?? []).map((t) => t.trim()).filter(Boolean),
    image: resolveContentImage(raw.image),
  };
}

export async function getDirectoryBusinesses(): Promise<DirectoryBusiness[]> {
  try {
    const rows = await sanityClient.fetch<RawBusiness[]>(LIST_QUERY);
    return (rows ?? []).filter((r) => r?.slug && r.name).map(normalize);
  } catch (error) {
    console.warn('Sanity directory unavailable.', error);
    return [];
  }
}

export async function getDirectoryBusiness(slug: string): Promise<DirectoryBusiness | undefined> {
  const all = await getDirectoryBusinesses();
  return all.find((b) => b.slug === slug);
}

export async function getDirectorySitemapEntries(): Promise<{ slug: string; updatedAt?: string }[]> {
  try {
    const rows = await sanityClient.fetch<{ slug?: string; updatedAt?: string }[]>(/* groq */ `
      *[_type == "directoryBusiness" && defined(slug.current)] { "slug": slug.current, "updatedAt": _updatedAt }
    `);
    return (rows ?? []).filter((r): r is { slug: string; updatedAt?: string } => !!r?.slug);
  } catch {
    return [];
  }
}

export const directoryPermalink = (slug: string) => `/directory/${slug}`;

const key = (s: string) => s.trim().toLowerCase();

/** Distinct values (case-insensitive) with how many businesses carry each. */
function tally(items: DirectoryBusiness[], pick: (b: DirectoryBusiness) => string[]) {
  const map = new Map<string, { value: string; count: number }>();
  for (const item of items) {
    for (const v of new Set(pick(item).map(key))) {
      const original = pick(item).find((x) => key(x) === v)!;
      const hit = map.get(v);
      if (hit) hit.count++;
      else map.set(v, { value: original, count: 1 });
    }
  }
  return [...map.values()];
}

export interface FilterOption {
  value: string;
  count: number;
}

/** Filter options are built from the data: a new type typed in Sanity appears here, no code change. */
export function collectTypes(items: DirectoryBusiness[]): FilterOption[] {
  return tally(items, (b) => b.types).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

/** Locations sort by count; catch-all values go last (client's rule). */
const LAST_LOCATIONS = ['island-wide', 'online'];

export function collectLocations(items: DirectoryBusiness[]): FilterOption[] {
  const last = (v: string) => (LAST_LOCATIONS.includes(key(v)) ? 1 : 0);
  return tally(items, (b) => b.locations).sort(
    (a, b) => last(a.value) - last(b.value) || b.count - a.count || a.value.localeCompare(b.value)
  );
}

/**
 * "More like this" — fills itself in. Score = 2 per shared type + 1 per shared location;
 * only businesses that share something are returned.
 */
export function getRelatedBusinesses(
  current: DirectoryBusiness,
  all: DirectoryBusiness[],
  limit = 3
): DirectoryBusiness[] {
  const types = new Set(current.types.map(key));
  const locations = new Set(current.locations.map(key));
  return all
    .filter((b) => b.slug !== current.slug)
    .map((b) => ({
      b,
      score:
        b.types.filter((t) => types.has(key(t))).length * 2 + b.locations.filter((l) => locations.has(key(l))).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.b.name.localeCompare(b.b.name))
    .slice(0, limit)
    .map((x) => x.b);
}

/** `tel:` href from a display phone number. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
