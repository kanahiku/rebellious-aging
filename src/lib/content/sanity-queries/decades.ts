import { sanityClient } from '../../sanity/client';
import { resolveContentImage } from '../../sanity/image';
import type { DecadePageContent, DecadeKey, FillFirstBucketContent, FourPillarsContent } from '../types';
import { type FetchedImage, homeImage, list, text } from './shared';
import { type Nullable } from './about';

export const DECADE_QUERY = /* groq */ `
  *[_type == "decadePage" && _id == $id][0] {
    meta,
    hero { eyebrow, heading, description, ctaText, ctaHref },
    whereYouAre { eyebrow, paragraphs, rightEyebrow, "rows": rows[] { name, description } },
    fillFirst { eyebrow, text, rightEyebrow, "rows": rows[] { name, description }, note },
    doctorTests { eyebrow, heading, text, rightEyebrow, "rows": rows[] { name, description } },
    blackSwan { eyebrow, heading, paragraphs, ctaText, ctaHref },
    stayingHome { heading, lead, body, source, bullets },
    cta { title, subtitle, primaryText, primaryHref, secondaryText, secondaryHref }
  }
`;

/** Null-safe: an unfilled object/array in Studio comes back as null. */
export async function getSanityDecade(key: DecadeKey): Promise<DecadePageContent | null> {
  type Row = { name?: string | null; description?: string | null };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await sanityClient.fetch<Record<string, any> | null>(DECADE_QUERY, { id: `decade-${key}` });
  if (!raw) return null;
  const rows = (value?: Row[] | null) =>
    list(value).map((r) => ({ name: text(r.name), description: text(r.description) }));

  const doctor = raw.doctorTests;
  const swan = raw.blackSwan;
  const home = raw.stayingHome;

  return {
    meta: { title: text(raw.meta?.title), description: text(raw.meta?.description) },
    hero: {
      eyebrow: text(raw.hero?.eyebrow),
      heading: text(raw.hero?.heading),
      description: text(raw.hero?.description),
      ctaText: text(raw.hero?.ctaText),
      ctaHref: text(raw.hero?.ctaHref),
    },
    whereYouAre: {
      eyebrow: text(raw.whereYouAre?.eyebrow),
      paragraphs: list(raw.whereYouAre?.paragraphs),
      rightEyebrow: text(raw.whereYouAre?.rightEyebrow),
      rows: rows(raw.whereYouAre?.rows),
    },
    fillFirst: {
      eyebrow: text(raw.fillFirst?.eyebrow),
      text: text(raw.fillFirst?.text),
      rightEyebrow: text(raw.fillFirst?.rightEyebrow),
      rows: rows(raw.fillFirst?.rows),
      note: text(raw.fillFirst?.note),
    },
    doctorTests: doctor?.heading
      ? {
          eyebrow: text(doctor.eyebrow),
          heading: text(doctor.heading),
          text: text(doctor.text),
          rightEyebrow: text(doctor.rightEyebrow),
          rows: rows(doctor.rows),
        }
      : undefined,
    blackSwan: swan?.heading
      ? {
          eyebrow: text(swan.eyebrow),
          heading: text(swan.heading),
          paragraphs: list(swan.paragraphs),
          ctaText: text(swan.ctaText),
          ctaHref: text(swan.ctaHref),
        }
      : undefined,
    stayingHome: home?.heading
      ? {
          heading: text(home.heading),
          lead: text(home.lead),
          body: text(home.body),
          source: text(home.source),
          bullets: list(home.bullets),
        }
      : undefined,
    cta: {
      title: text(raw.cta?.title),
      subtitle: text(raw.cta?.subtitle),
      primaryText: text(raw.cta?.primaryText),
      primaryHref: text(raw.cta?.primaryHref),
      secondaryText: text(raw.cta?.secondaryText),
      secondaryHref: text(raw.cta?.secondaryHref),
    },
  };
}

export const FILL_FIRST_BUCKET_QUERY = /* groq */ `
  *[_type == "fillFirstBucketPage" && _id == "singleton-fill-first-bucket"][0] {
    meta,
    hero {
      title, paragraphs,
      "image": ${homeImage('image')},
      "imageMobile": ${homeImage('imageMobile')}
    },
    rules { pullQuote, heading, "items": items[] { title, body } },
    band { "image": ${homeImage('image')} },
    cta { eyebrow, title, subtitle, ctaText, ctaHref }
  }
`;

/** Null-safe: an unfilled object/array in Studio comes back as null. */
export async function getSanityFillFirstBucket(): Promise<FillFirstBucketContent | null> {
  const raw = await sanityClient.fetch<{
    meta?: Nullable<FillFirstBucketContent['meta']> | null;
    hero?: {
      title?: string | null;
      paragraphs?: string[] | null;
      image?: FetchedImage;
      imageMobile?: FetchedImage;
    } | null;
    rules?: {
      pullQuote?: string[] | null;
      heading?: string | null;
      items?: { title?: string | null; body?: string | null }[] | null;
    } | null;
    band?: { image?: FetchedImage } | null;
    cta?: Nullable<FillFirstBucketContent['cta']> | null;
  } | null>(FILL_FIRST_BUCKET_QUERY);
  if (!raw) return null;

  return {
    meta: { title: text(raw.meta?.title), description: text(raw.meta?.description) },
    hero: {
      title: text(raw.hero?.title),
      paragraphs: list(raw.hero?.paragraphs),
      image: resolveContentImage(raw.hero?.image),
      imageMobile: resolveContentImage(raw.hero?.imageMobile),
    },
    rules: {
      pullQuote: list(raw.rules?.pullQuote),
      heading: text(raw.rules?.heading),
      items: list(raw.rules?.items).map((i) => ({ title: text(i.title), body: text(i.body) })),
    },
    band: { image: resolveContentImage(raw.band?.image) },
    cta: {
      eyebrow: text(raw.cta?.eyebrow),
      title: text(raw.cta?.title),
      subtitle: text(raw.cta?.subtitle),
      ctaText: text(raw.cta?.ctaText),
      ctaHref: text(raw.cta?.ctaHref),
    },
  };
}

export const FOUR_PILLARS_QUERY = /* groq */ `
  *[_type == "fourPillarsPage" && _id == "singleton-four-pillars"][0] {
    meta,
    hero {
      title, paragraphs,
      "image": ${homeImage('image')},
      "imageMobile": ${homeImage('imageMobile')}
    },
    "cards": cards[] { preLabel, label, title, description, linkText, linkHref },
    leftOut { heading, paragraphs }
  }
`;

/** Null-safe: an unfilled object/array in Studio comes back as null. */
export async function getSanityFourPillars(): Promise<FourPillarsContent | null> {
  const raw = await sanityClient.fetch<{
    meta?: Nullable<FourPillarsContent['meta']> | null;
    hero?: {
      title?: string | null;
      paragraphs?: string[] | null;
      image?: FetchedImage;
      imageMobile?: FetchedImage;
    } | null;
    cards?: Nullable<FourPillarsContent['cards'][number]>[] | null;
    leftOut?: { heading?: string | null; paragraphs?: string[] | null } | null;
  } | null>(FOUR_PILLARS_QUERY);
  if (!raw) return null;

  return {
    meta: { title: text(raw.meta?.title), description: text(raw.meta?.description) },
    hero: {
      title: text(raw.hero?.title),
      paragraphs: list(raw.hero?.paragraphs),
      image: resolveContentImage(raw.hero?.image),
      imageMobile: resolveContentImage(raw.hero?.imageMobile),
    },
    cards: list(raw.cards).map((c) => ({
      preLabel: text(c.preLabel),
      label: text(c.label),
      title: text(c.title),
      description: text(c.description),
      linkText: c.linkText || undefined,
      linkHref: c.linkHref || undefined,
    })),
    leftOut: { heading: text(raw.leftOut?.heading), paragraphs: list(raw.leftOut?.paragraphs) },
  };
}
