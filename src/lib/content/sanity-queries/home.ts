import { sanityClient } from '../../sanity/client';
import { resolveContentImage } from '../../sanity/image';
import type { HomePageContent, HowAgingWorksContent, TalkToDoctorContent } from '../types';
import { type FetchedImage, homeImage, list, text } from './shared';

export const HOME_QUERY = /* groq */ `
  *[_type == "homePage" && _id == "singleton-home"][0] {
    meta,
    hero {
      tagline, title, subtitle,
      primaryCtaText, primaryCtaHref,
      secondaryCtaText, secondaryCtaHref, secondaryCtaNewTab,
      note,
      "heroImage": ${homeImage('heroImage')},
      "heroImageMobile": ${homeImage('heroImageMobile')}
    },
    whyUrgent {
      eyebrow, heading, body, ctaText, ctaHref,
      "image": ${homeImage('image')}
    },
    decades { eyebrow, heading, "cards": cards[] { title, body, href } },
    cost {
      eyebrow, heading, leftHeading, leftBody, leftCtaText, leftCtaHref,
      rightHeading, "rows": rows[] { cost, label }, rightCtaText, rightCtaHref, footer
    },
    acceptChange {
      eyebrow, heading, body, emphasis, linkText, linkHref,
      "image": ${homeImage('image')}
    },
    bucketOne { eyebrow, heading, body, "cards": cards[] { label, heading, description } },
    assessment { eyebrow, title, subtitle, ctaText, ctaHref, disclaimer },
    locations {
      eyebrow,
      "backgroundImage": ${homeImage('backgroundImage')},
      "items": items[] { name, memberCount, href }
    },
    doctor {
      eyebrow, heading, lead, body, ctaText, ctaHref, linkText, linkHref,
      "image": ${homeImage('image')}
    },
    voices { eyebrow, heading }
  }
`;

export type RawHome = Omit<HomePageContent, 'hero' | 'whyUrgent' | 'acceptChange' | 'locations' | 'doctor'> & {
  hero: Omit<HomePageContent['hero'], 'heroImage' | 'heroImageMobile'> & {
    heroImage?: FetchedImage;
    heroImageMobile?: FetchedImage;
  };
  whyUrgent: Omit<HomePageContent['whyUrgent'], 'image'> & { image?: FetchedImage };
  acceptChange: Omit<HomePageContent['acceptChange'], 'image'> & { image?: FetchedImage };
  locations: Omit<HomePageContent['locations'], 'backgroundImage'> & { backgroundImage?: FetchedImage };
  doctor: Omit<HomePageContent['doctor'], 'image'> & { image?: FetchedImage };
};

/** Null-safe: an unfilled object/array in Studio comes back as null. */
export async function getSanityHomeContent(): Promise<HomePageContent | null> {
  const raw = await sanityClient.fetch<RawHome | null>(HOME_QUERY);
  if (!raw) return null;

  return {
    meta: { title: raw.meta?.title ?? '', description: raw.meta?.description ?? '' },
    hero: {
      ...raw.hero,
      title: raw.hero?.title ?? '',
      subtitle: raw.hero?.subtitle ?? [],
      heroImage: resolveContentImage(raw.hero?.heroImage),
      heroImageMobile: resolveContentImage(raw.hero?.heroImageMobile),
    },
    whyUrgent: {
      ...raw.whyUrgent,
      heading: raw.whyUrgent?.heading ?? '',
      body: raw.whyUrgent?.body ?? [],
      image: resolveContentImage(raw.whyUrgent?.image),
    },
    decades: {
      ...raw.decades,
      heading: raw.decades?.heading ?? '',
      cards: (raw.decades?.cards ?? []).map((card) => ({ ...card, body: card.body ?? '' })),
    },
    cost: {
      ...raw.cost,
      heading: raw.cost?.heading ?? '',
      leftHeading: raw.cost?.leftHeading ?? '',
      leftBody: raw.cost?.leftBody ?? [],
      rightHeading: raw.cost?.rightHeading ?? '',
      rows: raw.cost?.rows ?? [],
    },
    acceptChange: {
      ...raw.acceptChange,
      heading: raw.acceptChange?.heading ?? '',
      body: raw.acceptChange?.body ?? [],
      image: resolveContentImage(raw.acceptChange?.image),
    },
    bucketOne: { ...raw.bucketOne, heading: raw.bucketOne?.heading ?? '', cards: raw.bucketOne?.cards ?? [] },
    assessment: { ...raw.assessment, title: raw.assessment?.title ?? '' },
    locations: {
      ...raw.locations,
      backgroundImage: resolveContentImage(raw.locations?.backgroundImage),
      items: raw.locations?.items ?? [],
    },
    doctor: {
      ...raw.doctor,
      heading: raw.doctor?.heading ?? '',
      body: raw.doctor?.body ?? [],
      image: resolveContentImage(raw.doctor?.image),
    },
    voices: { ...raw.voices },
  };
}

export const HOW_AGING_QUERY = /* groq */ `
  *[_type == "howAgingWorksPage" && _id == "singleton-how-aging-works"][0] {
    meta,
    hero {
      "words": words[] { text, italic, align },
      "image": ${homeImage('image')},
      "imageMobile": ${homeImage('imageMobile')}
    },
    intro {
      heading, body, ctaText, ctaHref,
      "cards": cards[] { label, title, description },
      "image": ${homeImage('image')}
    },
    buckets { eyebrow, heading, body, ctaText, ctaHref },
    blackSwan { eyebrow, heading, paragraphs, ctaText, ctaHref },
    bucketThree { eyebrow, heading, paragraphs, boldNote },
    decades { eyebrow, heading, "cards": cards[] { title, body, href } },
    weStop { heading, body, "image": ${homeImage('image')} }
  }
`;

export type RawHowAging = {
  meta?: HowAgingWorksContent['meta'];
  hero?: { words?: HowAgingWorksContent['hero']['words']; image?: FetchedImage; imageMobile?: FetchedImage };
  intro?: Omit<Partial<HowAgingWorksContent['intro']>, 'image'> & { image?: FetchedImage };
  buckets?: HowAgingWorksContent['buckets'];
  blackSwan?: Partial<HowAgingWorksContent['blackSwan']>;
  bucketThree?: Partial<HowAgingWorksContent['bucketThree']>;
  decades?: Partial<HowAgingWorksContent['decades']>;
  weStop?: Omit<Partial<HowAgingWorksContent['weStop']>, 'image'> & { image?: FetchedImage };
};

/** Null-safe: an unfilled object/array in Studio comes back as null. */
export async function getSanityHowAgingWorks(): Promise<HowAgingWorksContent | null> {
  const raw = await sanityClient.fetch<RawHowAging | null>(HOW_AGING_QUERY);
  if (!raw) return null;

  return {
    meta: { title: raw.meta?.title ?? '', description: raw.meta?.description ?? '' },
    hero: {
      words: raw.hero?.words ?? [],
      image: resolveContentImage(raw.hero?.image),
      imageMobile: resolveContentImage(raw.hero?.imageMobile),
    },
    intro: {
      ...raw.intro,
      heading: raw.intro?.heading ?? '',
      body: raw.intro?.body ?? [],
      cards: raw.intro?.cards ?? [],
      image: resolveContentImage(raw.intro?.image),
    },
    buckets: { ...raw.buckets },
    blackSwan: { ...raw.blackSwan, heading: raw.blackSwan?.heading ?? '', paragraphs: raw.blackSwan?.paragraphs ?? [] },
    bucketThree: {
      ...raw.bucketThree,
      heading: raw.bucketThree?.heading ?? '',
      paragraphs: raw.bucketThree?.paragraphs ?? [],
    },
    decades: {
      ...raw.decades,
      heading: raw.decades?.heading ?? '',
      cards: (raw.decades?.cards ?? []).map((card) => ({ ...card, body: card.body ?? '' })),
    },
    weStop: {
      ...raw.weStop,
      heading: raw.weStop?.heading ?? '',
      body: raw.weStop?.body ?? [],
      image: resolveContentImage(raw.weStop?.image),
    },
  };
}

export const TALK_TO_DOCTOR_QUERY = /* groq */ `
  *[_type == "talkToDoctorPage" && _id == "singleton-talk-to-doctor"][0] {
    meta,
    hero {
      title, subtitle,
      "image": ${homeImage('image')},
      "imageMobile": ${homeImage('imageMobile')}
    },
    measurement {
      eyebrow, heading, body,
      leftHeading, "leftRows": leftRows[] { name, description },
      rightHeading, "rightRows": rightRows[] { name, description }
    },
    advice { "items": items[] { title, body }, disclosure },
    getMeasured { heading, paragraphs, ctaText, ctaHref }
  }
`;

export type RawTalkToDoctor = {
  meta?: TalkToDoctorContent['meta'];
  hero?: { title?: string; subtitle?: string; image?: FetchedImage; imageMobile?: FetchedImage };
  measurement?: Partial<TalkToDoctorContent['measurement']>;
  advice?: Partial<TalkToDoctorContent['advice']>;
  getMeasured?: Partial<TalkToDoctorContent['getMeasured']>;
};

/** Null-safe: an unfilled object/array in Studio comes back as null. */
export async function getSanityTalkToDoctor(): Promise<TalkToDoctorContent | null> {
  const raw = await sanityClient.fetch<RawTalkToDoctor | null>(TALK_TO_DOCTOR_QUERY);
  if (!raw) return null;
  const rows = (list?: { name: string; description?: string }[]) =>
    (list ?? []).map((row) => ({ name: row.name, description: row.description ?? '' }));

  return {
    meta: { title: raw.meta?.title ?? '', description: raw.meta?.description ?? '' },
    hero: {
      title: raw.hero?.title ?? '',
      subtitle: raw.hero?.subtitle ?? '',
      image: resolveContentImage(raw.hero?.image),
      imageMobile: resolveContentImage(raw.hero?.imageMobile),
    },
    measurement: {
      ...raw.measurement,
      heading: raw.measurement?.heading ?? '',
      leftHeading: raw.measurement?.leftHeading ?? '',
      rightHeading: raw.measurement?.rightHeading ?? '',
      leftRows: rows(raw.measurement?.leftRows),
      rightRows: rows(raw.measurement?.rightRows),
    },
    advice: { ...raw.advice, items: (raw.advice?.items ?? []).map((i) => ({ title: i.title, body: i.body ?? '' })) },
    getMeasured: {
      ...raw.getMeasured,
      heading: raw.getMeasured?.heading ?? '',
      paragraphs: raw.getMeasured?.paragraphs ?? [],
    },
  };
}
