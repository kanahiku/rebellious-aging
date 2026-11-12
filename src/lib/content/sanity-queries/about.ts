import { sanityClient } from '../../sanity/client';
import { resolveContentImage } from '../../sanity/image';
import type { AboutPageContent, OhanaPageContent } from '../types';
import { type FetchedImage, homeImage, list, text } from './shared';

export const ABOUT_QUERY = /* groq */ `
  *[_type == "aboutPage" && _id == "singleton-about"][0] {
    meta,
    hero { tagline, title, content, "image": ${homeImage('image')} },
    movement { eyebrow, heading, lede, body, ctaText, ctaHref },
    doctor { eyebrow, heading, paragraphs, quote, quoteAuthor },
    credentials {
      eyebrow, heading, educationLabel, education, certificationsLabel, certifications,
      residenciesLabel, "residencies": residencies[] { title, institution }
    },
    publications { eyebrow, heading, "items": items[] { count, title, description } },
    sponsor { eyebrow, heading, disclosureHeading, body, linkText, linkHref }
  }
`;

export type Nullable<T> = { [K in keyof T]?: T[K] | null };

/** Null-safe: an unfilled object/array in Studio comes back as null. */
export async function getSanityAbout(): Promise<AboutPageContent | null> {
  const raw = await sanityClient.fetch<{
    meta?: Nullable<AboutPageContent['meta']> | null;
    hero?: (Nullable<Omit<AboutPageContent['hero'], 'image'>> & { image?: FetchedImage }) | null;
    movement?: Nullable<AboutPageContent['movement']> | null;
    doctor?: Nullable<AboutPageContent['doctor']> | null;
    credentials?: Nullable<AboutPageContent['credentials']> | null;
    publications?: Nullable<AboutPageContent['publications']> | null;
    sponsor?: Nullable<AboutPageContent['sponsor']> | null;
  } | null>(ABOUT_QUERY);
  if (!raw) return null;

  return {
    meta: { title: text(raw.meta?.title), description: text(raw.meta?.description) },
    hero: {
      tagline: text(raw.hero?.tagline),
      title: text(raw.hero?.title),
      content: text(raw.hero?.content),
      image: resolveContentImage(raw.hero?.image),
    },
    movement: {
      eyebrow: text(raw.movement?.eyebrow),
      heading: text(raw.movement?.heading),
      lede: text(raw.movement?.lede),
      body: text(raw.movement?.body),
      ctaText: text(raw.movement?.ctaText),
      ctaHref: text(raw.movement?.ctaHref),
    },
    doctor: {
      eyebrow: text(raw.doctor?.eyebrow),
      heading: text(raw.doctor?.heading),
      paragraphs: list(raw.doctor?.paragraphs),
      quote: text(raw.doctor?.quote),
      quoteAuthor: text(raw.doctor?.quoteAuthor),
    },
    credentials: {
      eyebrow: text(raw.credentials?.eyebrow),
      heading: text(raw.credentials?.heading),
      educationLabel: text(raw.credentials?.educationLabel),
      education: text(raw.credentials?.education),
      certificationsLabel: text(raw.credentials?.certificationsLabel),
      certifications: list(raw.credentials?.certifications),
      residenciesLabel: text(raw.credentials?.residenciesLabel),
      residencies: list(raw.credentials?.residencies).map((r) => ({
        title: text(r.title),
        institution: text(r.institution),
      })),
    },
    publications: {
      eyebrow: text(raw.publications?.eyebrow),
      heading: text(raw.publications?.heading),
      items: list(raw.publications?.items).map((i) => ({
        count: text(i.count),
        title: text(i.title),
        description: text(i.description),
      })),
    },
    sponsor: {
      eyebrow: text(raw.sponsor?.eyebrow),
      heading: text(raw.sponsor?.heading),
      disclosureHeading: text(raw.sponsor?.disclosureHeading),
      body: text(raw.sponsor?.body),
      linkText: text(raw.sponsor?.linkText),
      linkHref: text(raw.sponsor?.linkHref),
    },
  };
}

export const OHANA_QUERY = /* groq */ `
  *[_type == "ohanaPage" && _id == "singleton-ohana"][0] {
    meta,
    hero {
      title,
      "image": ${homeImage('image')},
      "imageMobile": ${homeImage('imageMobile')}
    },
    intro { heading, body, ctaText, ctaHref, "stats": stats[] { number, label } },
    loneliness { heading, pullQuote, body, caption, "image": ${homeImage('image')} },
    blueZones {
      "cards": cards[] { eyebrow, heading, body, "image": ${homeImage('image')} },
      footerNote
    },
    moai {
      moaiHeading, moaiBody, adherenceHeading, adherenceBody,
      "duoCards": duoCards[] { eyebrow, heading, body }
    },
    activities {
      heading, subtitle,
      "items": items[] { frequency, title, body },
      "image": ${homeImage('image')}
    },
    purpose {
      "image": ${homeImage('image')},
      heading, body, noChapterHeading, noChapterBody, noChapterLinkText, noChapterLinkHref
    },
    community { testimonialsEyebrow, testimonialsHeading, joinEyebrow, joinHeading, joinDescription },
    comeHome { heading, body, primaryText, primaryHref, secondaryText, secondaryHref }
  }
`;

/** Null-safe: an unfilled object/array in Studio comes back as null. */
export async function getSanityOhana(): Promise<OhanaPageContent | null> {
  type Img = { image?: FetchedImage; imageMobile?: FetchedImage };
  const raw = await sanityClient.fetch<{
    meta?: Nullable<OhanaPageContent['meta']> | null;
    hero?: (Nullable<Pick<OhanaPageContent['hero'], 'title'>> & Img) | null;
    intro?: Nullable<OhanaPageContent['intro']> | null;
    loneliness?: (Nullable<Omit<OhanaPageContent['loneliness'], 'image'>> & Img) | null;
    blueZones?: {
      cards?: (Nullable<Omit<OhanaPageContent['blueZones']['cards'][number], 'image'>> & Img)[] | null;
      footerNote?: string | null;
    } | null;
    moai?: Nullable<OhanaPageContent['moai']> | null;
    activities?: (Nullable<Omit<OhanaPageContent['activities'], 'image'>> & Img) | null;
    purpose?: (Nullable<Omit<OhanaPageContent['purpose'], 'image'>> & Img) | null;
    community?: Nullable<OhanaPageContent['community']> | null;
    comeHome?: Nullable<OhanaPageContent['comeHome']> | null;
  } | null>(OHANA_QUERY);
  if (!raw) return null;

  return {
    meta: { title: text(raw.meta?.title), description: text(raw.meta?.description) },
    hero: {
      title: text(raw.hero?.title),
      image: resolveContentImage(raw.hero?.image),
      imageMobile: resolveContentImage(raw.hero?.imageMobile),
    },
    intro: {
      heading: text(raw.intro?.heading),
      body: text(raw.intro?.body),
      ctaText: text(raw.intro?.ctaText),
      ctaHref: text(raw.intro?.ctaHref),
      stats: list(raw.intro?.stats).map((i) => ({ number: text(i.number), label: text(i.label) })),
    },
    loneliness: {
      heading: text(raw.loneliness?.heading),
      pullQuote: text(raw.loneliness?.pullQuote),
      body: list(raw.loneliness?.body),
      caption: list(raw.loneliness?.caption),
      image: resolveContentImage(raw.loneliness?.image),
    },
    blueZones: {
      cards: list(raw.blueZones?.cards).map((c) => ({
        eyebrow: text(c.eyebrow),
        heading: text(c.heading),
        body: text(c.body),
        image: resolveContentImage(c.image),
      })),
      footerNote: text(raw.blueZones?.footerNote),
    },
    moai: {
      moaiHeading: text(raw.moai?.moaiHeading),
      moaiBody: list(raw.moai?.moaiBody),
      adherenceHeading: text(raw.moai?.adherenceHeading),
      adherenceBody: list(raw.moai?.adherenceBody),
      duoCards: list(raw.moai?.duoCards).map((c) => ({
        eyebrow: text(c.eyebrow),
        heading: text(c.heading),
        body: text(c.body),
      })),
    },
    activities: {
      heading: text(raw.activities?.heading),
      subtitle: text(raw.activities?.subtitle),
      items: list(raw.activities?.items).map((i) => ({
        frequency: text(i.frequency),
        title: text(i.title),
        body: text(i.body),
      })),
      image: resolveContentImage(raw.activities?.image),
    },
    purpose: {
      image: resolveContentImage(raw.purpose?.image),
      heading: text(raw.purpose?.heading),
      body: list(raw.purpose?.body),
      noChapterHeading: text(raw.purpose?.noChapterHeading),
      noChapterBody: list(raw.purpose?.noChapterBody),
      noChapterLinkText: text(raw.purpose?.noChapterLinkText),
      noChapterLinkHref: text(raw.purpose?.noChapterLinkHref),
    },
    community: {
      testimonialsEyebrow: text(raw.community?.testimonialsEyebrow),
      testimonialsHeading: text(raw.community?.testimonialsHeading),
      joinEyebrow: text(raw.community?.joinEyebrow),
      joinHeading: text(raw.community?.joinHeading),
      joinDescription: text(raw.community?.joinDescription),
    },
    comeHome: {
      heading: text(raw.comeHome?.heading),
      body: text(raw.comeHome?.body),
      primaryText: text(raw.comeHome?.primaryText),
      primaryHref: text(raw.comeHome?.primaryHref),
      secondaryText: text(raw.comeHome?.secondaryText),
      secondaryHref: text(raw.comeHome?.secondaryHref),
    },
  };
}
