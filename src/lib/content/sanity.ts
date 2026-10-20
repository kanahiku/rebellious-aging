import { sanityClient } from '../sanity/client';
import {
  resolveContentImage,
  type SanityImageFields,
} from '../sanity/image';
import type {
  BlogContentBlock,
  BlogPost,
  Book,
  BookCta,
  BookSeries,
  PodcastEpisode,
  PodcastEpisodeStatus,
  PodcastPartGroup,
  Testimonial,
  ContactPageContent,
  ContentImage,
  FormHelpOption,
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
  LegalBlock,
  NavigationContent,
  BooksPageContent,
  PodcastPageContent,
  BlogIndexContent,
  ReviewsPageContent,
  ServicePageContent,
  ServiceSection,
  SplitContentSection,
} from './types';

const IMAGE_PROJECTION = /* groq */ `
  "src": coalesce(image.asset->url, imageUrl, ""),
  "alt": coalesce(image.alt, imageAlt, ""),
  "crop": image.crop,
  "hotspot": image.hotspot,
  "asset": image.asset
`;

const IMAGE_MOBILE_PROJECTION = /* groq */ `
  "src": coalesce(imageMobile.asset->url, imageMobileUrl, ""),
  "alt": coalesce(imageMobile.alt, imageMobileAlt, ""),
  "crop": imageMobile.crop,
  "hotspot": imageMobile.hotspot,
  "asset": imageMobile.asset
`;

type FetchedImage = ContentImage & SanityImageFields;

const homeImage = (field: string) => /* groq */ `{
      "src": coalesce(${field}.asset->url, ""),
      "alt": coalesce(${field}.alt, ""),
      "crop": ${field}.crop,
      "hotspot": ${field}.hotspot,
      "asset": ${field}.asset
    }`;

const HOME_QUERY = /* groq */ `
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

type RawHome = Omit<HomePageContent, 'hero' | 'whyUrgent' | 'acceptChange' | 'locations' | 'doctor'> & {
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

const HOW_AGING_QUERY = /* groq */ `
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

type RawHowAging = {
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

const TALK_TO_DOCTOR_QUERY = /* groq */ `
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

type RawTalkToDoctor = {
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

const ABOUT_QUERY = /* groq */ `
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

type Nullable<T> = { [K in keyof T]?: T[K] | null };
const text = (value?: string | null) => value ?? '';
const list = <T>(value?: T[] | null) => value ?? [];

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

const OHANA_QUERY = /* groq */ `
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

const DECADE_QUERY = /* groq */ `
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
  const rows = (value?: Row[] | null) => list(value).map((r) => ({ name: text(r.name), description: text(r.description) }));

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

const FILL_FIRST_BUCKET_QUERY = /* groq */ `
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
    hero?: { title?: string | null; paragraphs?: string[] | null; image?: FetchedImage; imageMobile?: FetchedImage } | null;
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

const FOUR_PILLARS_QUERY = /* groq */ `
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
    hero?: { title?: string | null; paragraphs?: string[] | null; image?: FetchedImage; imageMobile?: FetchedImage } | null;
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

const ATHENA_EVALUATION_QUERY = /* groq */ `
  *[_type == "athenaEvaluationPage" && _id == "singleton-athena-evaluation"][0] {
    meta,
    hero { tagline, title, subtitle, ctaText, ctaHref },
    overview { eyebrow, heading, intro, itemsEyebrow, "items": items[] { title, body } },
    pricing {
      priceEyebrow, price, priceNote, afterEyebrow, afterText,
      "tiers": tiers[] { label, price }, perLabel
    },
    booking {
      heading, body, listLinkText, listLinkHref, disclosureEyebrow, disclosureText,
      ctaText, ctaHref, note
    }
  }
`;

/** Null-safe: an unfilled object/array in Studio comes back as null. */
export async function getSanityAthenaEvaluation(): Promise<AthenaEvaluationContent | null> {
  const raw = await sanityClient.fetch<{
    meta?: Nullable<AthenaEvaluationContent['meta']> | null;
    hero?: Nullable<AthenaEvaluationContent['hero']> | null;
    overview?: (Nullable<Omit<AthenaEvaluationContent['overview'], 'items'>> & {
      items?: Nullable<{ title: string; body: string }>[] | null;
    }) | null;
    pricing?: (Nullable<Omit<AthenaEvaluationContent['pricing'], 'tiers'>> & {
      tiers?: Nullable<{ label: string; price: string }>[] | null;
    }) | null;
    booking?: Nullable<AthenaEvaluationContent['booking']> | null;
  } | null>(ATHENA_EVALUATION_QUERY);
  if (!raw) return null;

  return {
    meta: { title: text(raw.meta?.title), description: text(raw.meta?.description) },
    hero: {
      tagline: text(raw.hero?.tagline),
      title: text(raw.hero?.title),
      subtitle: text(raw.hero?.subtitle),
      ctaText: text(raw.hero?.ctaText),
      ctaHref: text(raw.hero?.ctaHref),
    },
    overview: {
      eyebrow: text(raw.overview?.eyebrow),
      heading: text(raw.overview?.heading),
      intro: text(raw.overview?.intro),
      itemsEyebrow: text(raw.overview?.itemsEyebrow),
      items: list(raw.overview?.items).map((i) => ({ title: text(i.title), body: text(i.body) })),
    },
    pricing: {
      priceEyebrow: text(raw.pricing?.priceEyebrow),
      price: text(raw.pricing?.price),
      priceNote: text(raw.pricing?.priceNote),
      afterEyebrow: text(raw.pricing?.afterEyebrow),
      afterText: text(raw.pricing?.afterText),
      tiers: list(raw.pricing?.tiers).map((t) => ({ label: text(t.label), price: text(t.price) })),
      perLabel: text(raw.pricing?.perLabel),
    },
    booking: {
      heading: text(raw.booking?.heading),
      body: text(raw.booking?.body),
      listLinkText: text(raw.booking?.listLinkText),
      listLinkHref: text(raw.booking?.listLinkHref),
      disclosureEyebrow: text(raw.booking?.disclosureEyebrow),
      disclosureText: text(raw.booking?.disclosureText),
      ctaText: text(raw.booking?.ctaText),
      ctaHref: text(raw.booking?.ctaHref),
      note: text(raw.booking?.note),
    },
  };
}

const LEGAL_QUERY = /* groq */ `
  *[_type == "legalPage" && _id == $id][0] {
    meta, title,
    "sections": sections[] {
      heading,
      "blocks": blocks[] { _type, text, items }
    }
  }
`;

/** Null-safe: an unfilled object/array in Studio comes back as null. */
export async function getSanityLegal(slug: 'privacy-policy' | 'terms-of-service'): Promise<LegalPageContent | null> {
  const raw = await sanityClient.fetch<{
    meta?: Nullable<LegalPageContent['meta']> | null;
    title?: string | null;
    sections?: {
      heading?: string | null;
      blocks?: { _type: string; text?: string | null; items?: string[] | null }[] | null;
    }[] | null;
  } | null>(LEGAL_QUERY, { id: `legal-${slug}` });
  if (!raw) return null;

  return {
    meta: { title: text(raw.meta?.title), description: text(raw.meta?.description) },
    title: text(raw.title),
    sections: list(raw.sections).map((section) => ({
      heading: text(section.heading),
      blocks: list(section.blocks).flatMap((block): LegalBlock[] => {
        if (block._type === 'list') return [{ type: 'list', items: list(block.items) }];
        if (block._type === 'contact') return [{ type: 'contact', text: text(block.text) }];
        if (block._type === 'paragraph') return [{ type: 'paragraph', text: text(block.text) }];
        return [];
      }),
    })),
  };
}

const NAVIGATION_QUERY = /* groq */ `
  {
    "header": *[_type == "siteNavigation" && _id == "singleton-navigation"][0] {
      "links": links[] {
        text,
        href,
        "links": subLinks[] { text, href },
        "columns": columns[] {
          title,
          "links": links[] { text, href }
        }
      },
      "actions": actions[] { variant, text, href },
      phone
    },
    "footer": *[_type == "siteFooter" && _id == "singleton-footer"][0] {
      "links": columns[] {
        title,
        "links": links[] { text, href }
      },
      "secondaryLinks": secondaryLinks[] { text, href },
      "socialLinks": socialLinks[] { ariaLabel, icon, href },
      footNote,
      tagline,
      "backgroundImage": backgroundImage.asset->url,
      cta { eyebrow, title, body, buttonLabel, buttonHref }
    }
  }
`;

export async function getSanityNavigationContent(): Promise<NavigationContent> {
  return sanityClient.fetch<NavigationContent>(NAVIGATION_QUERY);
}

const SERVICE_PAGE_QUERY = /* groq */ `
  *[_type == "servicePage" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    meta,
    hero {
      title,
      visualSubheading,
      subtitle,
      ctaText,
      ctaHref,
      phoneCtaText,
      phoneCtaHref,
      imagePlaceholder,
      "image": {
        ${IMAGE_PROJECTION}
      },
      "imageMobile": {
        ${IMAGE_MOBILE_PROJECTION}
      }
    },
    "sections": sections[_type != "faqsSection"] {
      _type,
      heading,
      intro,
      layout,
      display,
      title,
      paragraphs,
      featureLabel,
      column1,
      column2,
      column3,
      ctaText,
      ctaHref,
      linkText,
      linkHref,
      surface,
      isReversed,
      sources,
      imagePlaceholder,
      "image": {
        ${IMAGE_PROJECTION}
      },
      "items": select(
        _type == "linkedCardsSection" => items[] { title, description, linkText, href },
        _type == "bulletCardsSection" => items[] { title, items },
        _type == "checklistSection" => items[] { text },
        _type == "yelpReviewsSection" => items[] { name, reviewId, userId },
        _type == "quoteCardsSection" => items[] { name, quote },
        items[] { title, description, icon }
      ),
      "steps": steps[] { title, description, icon },
      "rows": rows[] { feature, cell1, cell2, cell3 }
    },
    faqs {
      title,
      "items": items[] { "title": question, "description": answer }
    },
    ctaBanner {
      title,
      subtitle,
      ctaText,
      ctaHref,
      showAfterHoursNote,
      extraLines,
      license
    }
  }
`;

function normalizeHeroImage<T extends { image?: FetchedImage | ContentImage; imageMobile?: FetchedImage | ContentImage }>(
  hero: T
): T {
  return {
    ...hero,
    image: resolveContentImage(hero.image as FetchedImage | undefined),
    imageMobile: resolveContentImage(hero.imageMobile as FetchedImage | undefined),
  };
}

function normalizeSplit(section: SplitContentSection & { image?: FetchedImage | ContentImage }): SplitContentSection {
  return { ...section, image: resolveContentImage(section.image as FetchedImage | undefined) };
}

function resolveSectionImage<T extends { image?: FetchedImage | ContentImage }>(section: T): T {
  return { ...section, image: resolveContentImage(section.image as FetchedImage | undefined) };
}

const HERO_PROJECTION = /* groq */ `
  title,
  visualSubheading,
  subtitle,
  ctaText,
  ctaHref,
  phoneCtaText,
  phoneCtaHref,
  imagePlaceholder,
  "image": {
    ${IMAGE_PROJECTION}
  },
  "imageMobile": {
    ${IMAGE_MOBILE_PROJECTION}
  }
`;

const SPLIT_PROJECTION = /* groq */ `
  heading,
  paragraphs,
  ctaText,
  ctaHref,
  linkText,
  linkHref,
  isReversed,
  imagePlaceholder,
  "image": {
    ${IMAGE_PROJECTION}
  }
`;

const CTA_BANNER_PROJECTION = /* groq */ `
  title,
  subtitle,
  ctaText,
  ctaHref,
  showAfterHoursNote,
  extraLines,
  license
`;

export async function getSanityServicePage(slug: string): Promise<ServicePageContent | null> {
  const page = await sanityClient.fetch<ServicePageContent | null>(SERVICE_PAGE_QUERY, { slug });
  if (!page) return null;

  return {
    ...page,
    sections: ((page.sections ?? []) as ServiceSection[]).map((section) => {
      const withImage = resolveSectionImage(section as ServiceSection & { image?: FetchedImage });
      if (withImage._type !== 'splitContentSection') return withImage;
      return normalizeSplit(withImage as SplitContentSection);
    }),
    faqs: page.faqs?.items?.length ? page.faqs : undefined,
    hero: normalizeHeroImage(page.hero),
  };
}

const CONTACT_PAGE_QUERY = /* groq */ `
  *[_type == "contactPage" && _id == "singleton-contact"][0] {
    meta,
    hero { ${HERO_PROJECTION} },
    form {
      heading,
      intro,
      topicLabel,
      topicPlaceholder,
      "helpOptions": helpOptions[] { label, value },
      messageLabel,
      submitLabel,
      mapHeading,
      addressLine1,
      addressLine2,
      mapsQuery,
      directionsLabel
    },
    touchpoints {
      heading,
      "items": items[] { title, description, icon },
      "links": links[] { text, href }
    },
    unsureSection { ${SPLIT_PROJECTION} },
    reasons {
      heading,
      intro,
      display,
      "items": items[] { title, description, linkText, href }
    },
    ctaBanner { ${CTA_BANNER_PROJECTION} }
  }
`;

export async function getSanityContactPage(): Promise<ContactPageContent> {
  const page = await sanityClient.fetch<ContactPageContent | null>(CONTACT_PAGE_QUERY);
  if (!page) {
    throw new Error('Sanity contactPage document is missing (singleton-contact).');
  }
  return {
    ...page,
    hero: normalizeHeroImage(page.hero),
    unsureSection: normalizeSplit({ ...page.unsureSection, _type: 'splitContentSection' }),
    reasons: { ...page.reasons, _type: 'linkedCardsSection' },
  };
}

const CONTACT_HELP_OPTIONS_QUERY = /* groq */ `
  *[_type == "contactPage" && _id == "singleton-contact"][0].form.helpOptions[] { label, value }
`;

export async function getSanityContactHelpOptions(): Promise<FormHelpOption[]> {
  const options = await sanityClient.fetch<FormHelpOption[] | null>(CONTACT_HELP_OPTIONS_QUERY);
  return (options ?? []).filter((option) => option?.label && option?.value);
}

const REVIEWS_PAGE_QUERY = /* groq */ `
  *[_type == "reviewsPage" && _id == "singleton-reviews"][0] {
    meta,
    hero { ${HERO_PROJECTION} },
    liveReviews { heading, intro },
    platforms {
      heading,
      intro,
      "items": items[] { title, ratingNote, href, linkText, icon }
    },
    gallerySection {
      heading,
      paragraphs,
      ctaText,
      ctaHref,
      "previewImages": previewImages[] {
        ${IMAGE_PROJECTION}
      }
    },
    ctaBanner { ${CTA_BANNER_PROJECTION} }
  }
`;

export async function getSanityReviewsPage(): Promise<ReviewsPageContent> {
  const page = await sanityClient.fetch<ReviewsPageContent | null>(REVIEWS_PAGE_QUERY);
  if (!page) {
    throw new Error('Sanity reviewsPage document is missing (singleton-reviews).');
  }
  return {
    ...page,
    hero: normalizeHeroImage(page.hero),
    gallerySection: {
      ...page.gallerySection,
      _type: 'splitContentSection',
      previewImages: (page.gallerySection?.previewImages ?? [])
        .map((image) => resolveContentImage(image as FetchedImage))
        .filter((image): image is ContentImage => Boolean(image?.src)),
    },
  };
}

type SanityMarkDef = {
  _type: string;
  _key: string;
  href?: string;
  blank?: boolean;
};

type SanitySpan = {
  _type: string;
  _key?: string;
  text?: string;
  marks?: string[];
};

type SanityPortableBlock = {
  _type?: string;
  _key?: string;
  style?: string;
  listItem?: 'bullet' | 'number';
  level?: number;
  children?: SanitySpan[];
  markDefs?: SanityMarkDef[];
  // image fields
  src?: string;
  alt?: string;
  caption?: string;
  // table fields
  headerRow?: string[];
  rows?: Array<{ _key?: string; cells?: string[] }>;
  // callout fields (projected as calloutType from the "type" Sanity field)
  calloutType?: string;
  text?: string;
} & SanityImageFields;

type SanityBlogPost = Omit<BlogPost, 'image' | 'relatedPages' | 'body' | 'contentBlocks'> & {
  image?: ContentImage;
  relatedPages?: string[] | null;
  body?: SanityPortableBlock[] | null;
};

function portableBlockText(block: SanityPortableBlock): string {
  return Array.isArray(block.children) ? block.children.map((child) => child.text ?? '').join('') : '';
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function spansToHtml(
  children: SanitySpan[] | undefined,
  markDefs: SanityMarkDef[] | undefined
): string {
  if (!Array.isArray(children)) return '';
  const defsMap = new Map((markDefs ?? []).map((d) => [d._key, d]));

  return children
    .map((span) => {
      if (span._type !== 'span') return '';
      let html = escapeHtml(span.text ?? '');
      for (const mark of span.marks ?? []) {
        const def = defsMap.get(mark);
        if (def?._type === 'link') {
          const targetAttr = def.blank !== false ? ' target="_blank" rel="noopener noreferrer"' : '';
          html = `<a href="${escapeHtml(def.href ?? '')}"${targetAttr}>${html}</a>`;
        } else if (mark === 'strong') {
          html = `<strong>${html}</strong>`;
        } else if (mark === 'em') {
          html = `<em>${html}</em>`;
        } else if (mark === 'underline') {
          html = `<u>${html}</u>`;
        } else if (mark === 'strike-through') {
          html = `<s>${html}</s>`;
        } else if (mark === 'code') {
          html = `<code>${html}</code>`;
        }
      }
      return html;
    })
    .join('');
}

function portableTextToContentBlocks(body: SanityPortableBlock[] | null | undefined): BlogContentBlock[] {
  if (!Array.isArray(body)) return [];

  const result: BlogContentBlock[] = [];

  // Buffer for consecutive list items of the same type
  let listBuffer: { _key: string; html: string; level: number }[] = [];
  let listType: 'bullet' | 'number' | null = null;
  let listStartKey = '';

  function flushList() {
    if (!listBuffer.length || !listType) return;
    result.push({ _type: 'list', _key: `list-${listStartKey}`, listType, items: listBuffer });
    listBuffer = [];
    listType = null;
    listStartKey = '';
  }

  body.forEach((block, index) => {
    const key = block._key || `block-${index}`;

    // ── Image ─────────────────────────────────────────────────────────────────
    if (block._type === 'image') {
      flushList();
      const image = resolveContentImage({
        src: block.src,
        alt: block.alt,
        crop: block.crop,
        hotspot: block.hotspot,
        asset: block.asset,
      });
      if (!image?.src) return;
      const caption = typeof block.caption === 'string' ? block.caption.trim() : '';
      result.push({ _type: 'image', _key: key, image, ...(caption ? { caption } : {}) });
      return;
    }

    // ── Table ─────────────────────────────────────────────────────────────────
    if (block._type === 'table') {
      flushList();
      const headerRow = (block.headerRow ?? []).filter(Boolean);
      if (headerRow.length < 2) return;
      result.push({
        _type: 'table',
        _key: key,
        ...(block.caption ? { caption: block.caption } : {}),
        headerRow,
        rows: (block.rows ?? []).map((row, ri) => ({
          _key: row._key || `row-${ri}`,
          cells: row.cells ?? [],
        })),
      });
      return;
    }

    // ── Callout ───────────────────────────────────────────────────────────────
    if (block._type === 'callout') {
      flushList();
      if (!block.text?.trim()) return;
      const calloutType = (['tip', 'info', 'warning', 'note'] as const).includes(
        block.calloutType as 'tip' | 'info' | 'warning' | 'note'
      )
        ? (block.calloutType as 'tip' | 'info' | 'warning' | 'note')
        : 'note';
      result.push({ _type: 'callout', _key: key, calloutType, text: block.text.trim() });
      return;
    }

    // ── Standard block ────────────────────────────────────────────────────────
    if (block._type !== 'block') return;

    const text = portableBlockText(block).trim();
    if (!text) return;

    const html = spansToHtml(block.children, block.markDefs) || escapeHtml(text);

    // Headings
    if (block.style === 'h1' || block.style === 'h2') {
      flushList();
      result.push({ _type: 'heading', _key: key, level: 2, text });
      return;
    }
    if (block.style === 'h3' || block.style === 'h4') {
      flushList();
      result.push({ _type: 'heading', _key: key, level: 3, text });
      return;
    }

    // List items
    if (block.listItem === 'bullet' || block.listItem === 'number') {
      if (listType !== block.listItem) {
        flushList();
        listType = block.listItem;
        listStartKey = key;
      }
      listBuffer.push({ _key: key, html, level: block.level ?? 1 });
      return;
    }

    // Paragraph / blockquote
    flushList();
    result.push({
      _type: 'paragraph',
      _key: key,
      text,
      html,
      ...(block.style === 'blockquote' ? { quote: true } : {}),
    });
  });

  flushList();
  return result;
}

function portableTextToParagraphs(body: SanityPortableBlock[] | null | undefined): string[] {
  return portableTextToContentBlocks(body)
    .filter((block): block is Extract<BlogContentBlock, { _type: 'paragraph' }> => block._type === 'paragraph')
    .map((block) => block.text); // plain text only — used for excerpts and lead paragraphs
}

function normalizeBlogPost(post: SanityBlogPost): BlogPost {
  const contentBlocks = portableTextToContentBlocks(post.body);
  const body = portableTextToParagraphs(post.body);
  const excerpt = post.excerpt || body[0] || '';
  return {
    title: post.title,
    slug: post.slug,
    excerpt,
    publishDate: post.publishDate,
    updatedAt: post.updatedAt,
    author: post.author,
    image: resolveContentImage(post.image as FetchedImage | undefined),
    relatedPages: (post.relatedPages ?? []).map((key) => key.replace(/^\/+/, '')).filter(Boolean),
    meta: {
      title: post.title,
      description: excerpt,
    },
    heroParagraphs: body.slice(0, 2),
    sections:
      body.length > 2
        ? [
            {
              _type: 'editorialSection',
              heading: post.title,
              paragraphs: body.slice(2),
            },
          ]
        : [],
    ctaBanner: {
      title: 'Get in touch',
      subtitle: 'Replace this banner copy from the Figma file.',
      ctaText: 'Start the assessment',
      ctaHref: '/form',
    },
    body,
    contentBlocks,
  };
}

const BLOG_POST_CARD_PROJECTION = /* groq */ `
  title,
  "slug": slug.current,
  excerpt,
  publishDate,
  "updatedAt": _updatedAt,
  author,
  "image": {
    "src": coalesce(image.asset->url, imageUrl, ""),
    "alt": coalesce(image.alt, imageAlt, title),
    "crop": image.crop,
    "hotspot": image.hotspot,
    "asset": image.asset
  },
  relatedPages
`;

const BLOG_POST_PROJECTION = /* groq */ `
  ${BLOG_POST_CARD_PROJECTION},
  body[] {
    ...,
    _type == "image" => {
      ...,
      "src": asset->url,
      "alt": coalesce(alt, ""),
      caption,
      crop,
      hotspot,
      asset
    },
    _type == "callout" => {
      _type,
      _key,
      "calloutType": type,
      text
    },
    _type == "table" => {
      _type,
      _key,
      caption,
      headerRow,
      "rows": rows[] { _key, cells }
    }
  }
`;

const BLOG_POSTS_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current)] | order(publishDate desc) {
    ${BLOG_POST_CARD_PROJECTION}
  }
`;

const BLOG_POST_BY_SLUG_QUERY = /* groq */ `
  *[_type == "blogPost" && slug.current == $slug][0] {
    ${BLOG_POST_PROJECTION}
  }
`;

const BLOG_POSTS_RELATED_TO_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current) && $pageSlug in relatedPages] | order(publishDate desc) [0...3] {
    ${BLOG_POST_CARD_PROJECTION}
  }
`;

export async function getSanityBlogPosts(): Promise<BlogPost[]> {
  const posts = await sanityClient.fetch<SanityBlogPost[]>(BLOG_POSTS_QUERY);
  return (posts ?? []).filter((post) => post?.slug && post?.title).map(normalizeBlogPost);
}

export async function getSanityBlogPost(slug: string): Promise<BlogPost | null> {
  const post = await sanityClient.fetch<SanityBlogPost | null>(BLOG_POST_BY_SLUG_QUERY, { slug });
  if (!post?.slug || !post.title) return null;
  return normalizeBlogPost(post);
}

export async function getSanityBlogPostsRelatedTo(pageSlug: string): Promise<BlogPost[]> {
  const posts = await sanityClient.fetch<SanityBlogPost[]>(BLOG_POSTS_RELATED_TO_QUERY, { pageSlug });
  return (posts ?? []).filter((post) => post?.slug && post?.title).map(normalizeBlogPost);
}

const SERVICE_PAGE_SLUGS_QUERY = /* groq */ `
  *[_type == "servicePage" && defined(slug.current)].slug.current
`;

const BLOG_POST_SLUGS_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current)].slug.current
`;

export async function getSanityServicePageSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<string[]>(SERVICE_PAGE_SLUGS_QUERY);
  return (slugs ?? []).filter((slug): slug is string => typeof slug === 'string' && slug.length > 0);
}

const BLOG_POST_SITEMAP_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current)] | order(publishDate desc) {
    "slug": slug.current,
    "updatedAt": _updatedAt
  }
`;

export async function getSanityBlogPostSitemapEntries(): Promise<{ slug: string; updatedAt?: string }[]> {
  const rows = await sanityClient.fetch<{ slug?: string; updatedAt?: string }[]>(BLOG_POST_SITEMAP_QUERY);
  return (rows ?? []).filter((r): r is { slug: string; updatedAt?: string } => !!r?.slug);
}

export async function getSanityBlogPostSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<string[]>(BLOG_POST_SLUGS_QUERY);
  return (slugs ?? []).filter((slug): slug is string => typeof slug === 'string' && slug.length > 0);
}

type SanityBook = {
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

const BOOKS_QUERY = /* groq */ `
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

const BOOK_SERIES: BookSeries[] = ['textbook', 'guidebook', 'bargaining'];

function isBookSeries(value: string | null | undefined): value is BookSeries {
  return BOOK_SERIES.includes(value as BookSeries);
}

function normalizeBook(doc: SanityBook): Book | null {
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

const PODCAST_EPISODES_QUERY = /* groq */ `
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

type SanityPodcastEpisode = {
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

function isPodcastStatus(s: unknown): s is PodcastEpisodeStatus {
  return s === 'live' || s === 'coming-soon';
}

function normalizePodcastEpisode(doc: SanityPodcastEpisode): PodcastEpisode | null {
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
  return (docs ?? [])
    .map(normalizePodcastEpisode)
    .filter((ep): ep is PodcastEpisode => Boolean(ep));
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS_QUERY = /* groq */ `
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

type SanityTestimonial = {
  _id: string;
  quote?: string;
  name?: string;
  age?: number;
  location?: string;
  tenure?: string;
  order?: number;
};

function normalizeTestimonial(doc: SanityTestimonial): Testimonial | null {
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

// ─── Books / Podcast / Blog index pages ──────────────────────────────────────

const BOOKS_PAGE_QUERY = /* groq */ `
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

type RawSeries = { eyebrow?: string | null; heading?: string | null; description?: string | null } | null | undefined;
const series = (s: RawSeries) => ({
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

const PODCAST_PAGE_QUERY = /* groq */ `
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

const BLOG_INDEX_QUERY = /* groq */ `
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
