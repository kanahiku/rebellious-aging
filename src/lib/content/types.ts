// ─── Shared primitives ────────────────────────────────────────────────────────

import type { CallToAction } from '~/types';

export interface ContentImage {
  src: string;
  alt: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavSubLink {
  text: string;
  href: string;
}

export interface NavColumn {
  title: string;
  links: NavSubLink[];
}

export interface NavLink {
  text: string;
  href?: string;
  links?: NavSubLink[];
  columns?: NavColumn[];
}

export interface NavPhone {
  text: string;
  href: string;
}

export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  ariaLabel: string;
  icon: string;
  href: string;
}

export interface NavigationContent {
  header: {
    links: NavLink[];
    actions: CallToAction[];
    phone?: NavPhone;
  };
  footer: {
    links: FooterColumn[];
    secondaryLinks: FooterLink[];
    socialLinks: SocialLink[];
    footNote: string;
    tagline?: string | null;
    /** Sanity CDN URL of the footer background photo (decorative). */
    backgroundImage?: string | null;
    cta?: {
      eyebrow?: string | null;
      title?: string | null;
      body?: string | null;
      buttonLabel?: string | null;
      buttonHref?: string | null;
    } | null;
  };
}

// ─── Homepage section types ───────────────────────────────────────────────────

export interface StatItem {
  stat: string;
  label: string;
}

export interface InfoCardItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

export interface TimelineStep {
  title: string;
  description: string;
  icon: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ─── Full homepage content ─────────────────────────────────────────────────────

export interface HomePageContent {
  meta: { title: string; description: string };

  hero: {
    tagline?: string;
    title: string;
    subtitle: string[];
    primaryCtaText?: string;
    primaryCtaHref?: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
    secondaryCtaNewTab?: boolean;
    note?: string;
    heroImage?: ContentImage;
    heroImageMobile?: ContentImage;
  };

  whyUrgent: {
    eyebrow?: string;
    heading: string;
    body: string[];
    ctaText?: string;
    ctaHref?: string;
    image?: ContentImage;
  };

  decades: {
    eyebrow?: string;
    heading: string;
    cards: { title: string; body: string; href: string }[];
  };

  cost: {
    eyebrow?: string;
    heading: string;
    leftHeading: string;
    leftBody: string[];
    leftCtaText?: string;
    leftCtaHref?: string;
    rightHeading: string;
    rows: { cost: string; label: string }[];
    rightCtaText?: string;
    rightCtaHref?: string;
    footer?: string;
  };

  acceptChange: {
    eyebrow?: string;
    heading: string;
    body: string[];
    emphasis?: string;
    linkText?: string;
    linkHref?: string;
    image?: ContentImage;
  };

  bucketOne: {
    eyebrow?: string;
    heading: string;
    body?: string;
    cards: { label: string; heading: string; description?: string }[];
  };

  assessment: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    ctaText?: string;
    ctaHref?: string;
    disclaimer?: string;
  };

  locations: {
    eyebrow?: string;
    backgroundImage?: ContentImage;
    items: { name: string; memberCount?: number; href?: string }[];
  };

  doctor: {
    eyebrow?: string;
    heading: string;
    lead?: string;
    body: string[];
    ctaText?: string;
    ctaHref?: string;
    linkText?: string;
    linkHref?: string;
    image?: ContentImage;
  };

  voices: { eyebrow?: string; heading?: string };
}

export interface HowAgingWorksContent {
  meta: { title: string; description: string };
  hero: {
    words: { text: string; italic?: boolean; align?: 'start' | 'center' | 'end' }[];
    image?: ContentImage;
    imageMobile?: ContentImage;
  };
  intro: {
    heading: string;
    body: string[];
    ctaText?: string;
    ctaHref?: string;
    cards: { label: string; title: string; description: string }[];
    image?: ContentImage;
  };
  buckets: { eyebrow?: string; heading?: string; body?: string; ctaText?: string; ctaHref?: string };
  blackSwan: { eyebrow?: string; heading: string; paragraphs: string[]; ctaText?: string; ctaHref?: string };
  bucketThree: { eyebrow?: string; heading: string; paragraphs: string[]; boldNote?: string };
  decades: { eyebrow?: string; heading: string; cards: { title: string; body: string; href: string }[] };
  weStop: { heading: string; body: string[]; image?: ContentImage };
}

export interface TalkToDoctorContent {
  meta: { title: string; description: string };
  hero: { title: string; subtitle: string; image?: ContentImage; imageMobile?: ContentImage };
  measurement: {
    eyebrow?: string;
    heading: string;
    body?: string;
    leftHeading: string;
    leftRows: { name: string; description: string }[];
    rightHeading: string;
    rightRows: { name: string; description: string }[];
  };
  advice: { items: { title: string; body: string }[]; disclosure?: string };
  getMeasured: { heading: string; paragraphs: string[]; ctaText?: string; ctaHref?: string };
}

export interface AboutPageContent {
  meta: { title: string; description: string };
  hero: { tagline: string; title: string; content: string; image?: ContentImage };
  movement: { eyebrow: string; heading: string; lede: string; body: string; ctaText: string; ctaHref: string };
  doctor: { eyebrow: string; heading: string; paragraphs: string[]; quote: string; quoteAuthor: string };
  credentials: {
    eyebrow: string;
    heading: string;
    educationLabel: string;
    education: string;
    certificationsLabel: string;
    certifications: string[];
    residenciesLabel: string;
    residencies: { title: string; institution: string }[];
  };
  publications: { eyebrow: string; heading: string; items: { count: string; title: string; description: string }[] };
  sponsor: {
    eyebrow: string;
    heading: string;
    disclosureHeading: string;
    body: string;
    linkText: string;
    linkHref: string;
  };
}

export interface OhanaPageContent {
  meta: { title: string; description: string };
  hero: { title: string; image?: ContentImage; imageMobile?: ContentImage };
  intro: {
    heading: string;
    body: string;
    ctaText: string;
    ctaHref: string;
    stats: { number: string; label: string }[];
  };
  loneliness: { heading: string; pullQuote: string; body: string[]; caption: string[]; image?: ContentImage };
  blueZones: {
    cards: { eyebrow: string; heading: string; body: string; image?: ContentImage }[];
    footerNote: string;
  };
  moai: {
    moaiHeading: string;
    moaiBody: string[];
    adherenceHeading: string;
    adherenceBody: string[];
    duoCards: { eyebrow: string; heading: string; body: string }[];
  };
  activities: {
    heading: string;
    subtitle: string;
    items: { frequency: string; title: string; body: string }[];
    image?: ContentImage;
  };
  purpose: {
    image?: ContentImage;
    heading: string;
    body: string[];
    noChapterHeading: string;
    noChapterBody: string[];
    noChapterLinkText: string;
    noChapterLinkHref: string;
  };
  community: {
    testimonialsEyebrow: string;
    testimonialsHeading: string;
    joinEyebrow: string;
    joinHeading: string;
    joinDescription: string;
  };
  comeHome: {
    heading: string;
    body: string;
    primaryText: string;
    primaryHref: string;
    secondaryText: string;
    secondaryHref: string;
  };
}

export interface DecadeRow {
  name: string;
  description: string;
}

export type DecadeKey = '30s' | '40s' | '50s' | '60s' | '70-plus';

export interface DecadePageContent {
  meta: { title: string; description: string };
  hero: { eyebrow: string; heading: string; description: string; ctaText: string; ctaHref: string };
  whereYouAre: { eyebrow: string; paragraphs: string[]; rightEyebrow: string; rows: DecadeRow[] };
  fillFirst: { eyebrow: string; text: string; rightEyebrow: string; rows: DecadeRow[]; note: string };
  /** 50s only */
  doctorTests?: { eyebrow: string; heading: string; text: string; rightEyebrow: string; rows: DecadeRow[] };
  /** 60s only */
  blackSwan?: { eyebrow: string; heading: string; paragraphs: string[]; ctaText: string; ctaHref: string };
  /** 70+ only */
  stayingHome?: { heading: string; lead: string; body: string; source: string; bullets: string[] };
  cta: { title: string; subtitle: string; primaryText: string; primaryHref: string; secondaryText: string; secondaryHref: string };
}

export interface FillFirstBucketContent {
  meta: { title: string; description: string };
  hero: { title: string; paragraphs: string[]; image?: ContentImage; imageMobile?: ContentImage };
  rules: { pullQuote: string[]; heading: string; items: { title: string; body: string }[] };
  band: { image?: ContentImage };
  cta: { eyebrow: string; title: string; subtitle: string; ctaText: string; ctaHref: string };
}

export interface FourPillarsContent {
  meta: { title: string; description: string };
  hero: { title: string; paragraphs: string[]; image?: ContentImage; imageMobile?: ContentImage };
  cards: {
    preLabel: string;
    label: string;
    title: string;
    description: string;
    linkText?: string;
    linkHref?: string;
  }[];
  leftOut: { heading: string; paragraphs: string[] };
}

export interface AthenaEvaluationContent {
  meta: { title: string; description: string };
  hero: { tagline: string; title: string; subtitle: string; ctaText: string; ctaHref: string };
  overview: {
    eyebrow: string;
    heading: string;
    intro: string;
    itemsEyebrow: string;
    items: { title: string; body: string }[];
  };
  pricing: {
    priceEyebrow: string;
    price: string;
    priceNote: string;
    afterEyebrow: string;
    afterText: string;
    tiers: { label: string; price: string }[];
    perLabel: string;
  };
  booking: {
    heading: string;
    body: string;
    listLinkText: string;
    listLinkHref: string;
    disclosureEyebrow: string;
    disclosureText: string;
    ctaText: string;
    ctaHref: string;
    note: string;
  };
}

export type LegalBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'contact'; text: string };

export interface LegalPageContent {
  meta: { title: string; description: string };
  title: string;
  sections: { heading: string; blocks: LegalBlock[] }[];
}

// ─── Shared CMS sections (service pages and later templates) ───────────────────

export interface LinkedCardItem {
  title: string;
  description: string;
  href: string;
  linkText: string;
}

export interface PageHero {
  title: string;
  visualSubheading?: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  phoneCtaText?: string;
  phoneCtaHref?: string;
  image?: ContentImage;
  imageMobile?: ContentImage;
  imagePlaceholder?: string;
}

export interface CtaBannerContent {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  showAfterHoursNote?: boolean;
  extraLines?: string[];
  license?: string;
}

export interface IconPointsSection {
  _type: 'iconPointsSection';
  heading: string;
  intro?: string;
  layout?: 'auto' | 'grid' | 'band';
  items: InfoCardItem[];
}

export interface TimelineSection {
  _type: 'timelineSection';
  heading: string;
  intro?: string;
  steps: TimelineStep[];
}

export interface LinkedCardsSection {
  _type: 'linkedCardsSection';
  heading: string;
  intro?: string;
  display?: 'cards' | 'directory';
  items: LinkedCardItem[];
}

export interface InfoCardsSection {
  _type: 'infoCardsSection';
  heading: string;
  intro?: string;
  items: InfoCardItem[];
}

export interface EditorialSection {
  _type: 'editorialSection';
  heading: string;
  paragraphs: string[];
}

export interface ComparisonRow {
  feature: string;
  cell1: string;
  cell2: string;
  cell3?: string;
}

export interface ComparisonTableSection {
  _type: 'comparisonTableSection';
  heading: string;
  intro?: string;
  featureLabel: string;
  column1: string;
  column2: string;
  column3?: string;
  rows: ComparisonRow[];
}

export interface BulletCardItem {
  title: string;
  items: string[];
}

export interface BulletCardsSection {
  _type: 'bulletCardsSection';
  heading: string;
  intro?: string;
  items: BulletCardItem[];
}

export interface ChecklistSection {
  _type: 'checklistSection';
  heading: string;
  intro?: string;
  items: Array<{ text: string }>;
}

export interface YelpReviewItem {
  name: string;
  reviewId: string;
  userId: string;
}

export interface YelpReviewsSection {
  _type: 'yelpReviewsSection';
  heading: string;
  intro?: string;
  items?: YelpReviewItem[];
}

export interface LiveReviewsSection {
  _type: 'liveReviewsSection';
  heading: string;
  intro?: string;
  sources?: 'both' | 'google' | 'yelp';
}

export interface SplitContentSection {
  _type: 'splitContentSection';
  heading: string;
  paragraphs: string[];
  ctaText?: string;
  ctaHref?: string;
  linkText?: string;
  linkHref?: string;
  image?: ContentImage;
  imagePlaceholder?: string;
  isReversed?: boolean;
}

export interface QuoteCardItem {
  name: string;
  quote: string;
}

export interface QuoteCardsSection {
  _type: 'quoteCardsSection';
  heading: string;
  intro?: string;
  items: QuoteCardItem[];
}

export interface PageFaqs {
  title: string;
  items: Array<{ title: string; description: string }>;
}

export type ServiceSection = (
  | IconPointsSection
  | TimelineSection
  | LinkedCardsSection
  | InfoCardsSection
  | EditorialSection
  | ComparisonTableSection
  | BulletCardsSection
  | ChecklistSection
  | YelpReviewsSection
  | LiveReviewsSection
  | SplitContentSection
  | QuoteCardsSection
) & { surface?: 'white' | 'grey' | 'dark' };

export interface ServicePageContent {
  title: string;
  slug: string;
  meta: {
    title: string;
    description: string;
  };
  hero: PageHero;
  sections: ServiceSection[];
  faqs?: PageFaqs;
  ctaBanner: CtaBannerContent;
}

export interface FormHelpOption {
  label: string;
  value: string;
}

export interface ContactLinkItem {
  text: string;
  href: string;
}

export interface ContactPageContent {
  meta: {
    title: string;
    description: string;
  };
  hero: PageHero;
  form: {
    heading: string;
    intro?: string;
    topicLabel?: string;
    topicPlaceholder?: string;
    helpOptions: FormHelpOption[];
    messageLabel?: string;
    submitLabel?: string;
    mapHeading?: string;
    addressLine1?: string;
    addressLine2?: string;
    mapsQuery?: string;
    directionsLabel?: string;
  };
  touchpoints: {
    heading: string;
    items: InfoCardItem[];
    links?: ContactLinkItem[];
  };
  unsureSection: SplitContentSection;
  reasons: LinkedCardsSection;
  ctaBanner: CtaBannerContent;
}

export interface ReviewPlatformItem {
  title: string;
  ratingNote: string;
  href: string;
  linkText: string;
  icon?: string;
}

export interface ReviewsPageContent {
  meta: {
    title: string;
    description: string;
  };
  hero: PageHero;
  liveReviews: {
    heading: string;
    intro?: string;
  };
  platforms: {
    heading: string;
    intro?: string;
    items: ReviewPlatformItem[];
  };
  gallerySection: SplitContentSection & {
    previewImages?: ContentImage[];
  };
  ctaBanner: CtaBannerContent;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  publishDate: string;
  /** ISO timestamp of the last CMS edit (Sanity `_updatedAt`). */
  updatedAt?: string;
  author?: string;
  image?: ContentImage;
  imagePlaceholder?: string;
  meta: {
    title: string;
    description: string;
  };
  /** Page paths (no leading slash) where this post should appear in Related blogs. */
  relatedPages: string[];
  heroParagraphs: string[];
  sections: ServiceSection[];
  ctaBanner: CtaBannerContent;
  /** Fallback plain paragraphs when a CMS post has no structured sections. */
  body: string[];
  /** Article body in document order, including inline images from Sanity. */
  contentBlocks?: BlogContentBlock[];
}

export type BlogContentBlock =
  | BlogContentParagraph
  | BlogContentHeading
  | BlogContentImage
  | BlogContentList
  | BlogContentTable
  | BlogContentCallout;

export interface BlogContentParagraph {
  _type: 'paragraph';
  _key: string;
  /** Plain text — used for excerpts, lead paragraphs, and TOC. */
  text: string;
  /** HTML string with inline formatting (bold, italic, links). Use set:html to render. */
  html: string;
  quote?: boolean;
}

export interface BlogContentHeading {
  _type: 'heading';
  _key: string;
  level: 2 | 3;
  text: string;
}

export interface BlogContentImage {
  _type: 'image';
  _key: string;
  image: ContentImage;
  caption?: string;
}

export interface BlogContentList {
  _type: 'list';
  _key: string;
  listType: 'bullet' | 'number';
  items: BlogContentListItem[];
}

export interface BlogContentListItem {
  _key: string;
  /** HTML string with inline formatting. Use set:html to render. */
  html: string;
  level: number;
}

export interface BlogContentTable {
  _type: 'table';
  _key: string;
  caption?: string;
  headerRow: string[];
  rows: { _key: string; cells: string[] }[];
}

export interface BlogContentCallout {
  _type: 'callout';
  _key: string;
  calloutType: 'tip' | 'info' | 'warning' | 'note';
  text: string;
}

// ─── Books ────────────────────────────────────────────────────────────────────

export type BookSeries = 'textbook' | 'guidebook' | 'bargaining';

export interface BookCta {
  _key?: string;
  label: string;
  href: string;
}

export interface Book {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: ContentImage;
  badges: string[];
  publisherName?: string;
  publisherYear?: number;
  publisherNote?: string;
  ctas: BookCta[];
  podcastHref?: string;
  series: BookSeries;
  order: number;
}

// ─── Podcast ──────────────────────────────────────────────────────────────────

export type PodcastEpisodeStatus = 'live' | 'coming-soon';

export interface PodcastEpisode {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  status: PodcastEpisodeStatus;
  order: number;
  part: number;
  partName: string;
  partDescription?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  guidebookHref?: string;
}

/** Episodes grouped by part number (1–5). */
export type PodcastPartGroup = {
  part: number;
  partName: string;
  partDescription?: string;
  episodes: PodcastEpisode[];
};

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  age?: number;
  location?: string;
  tenure: string;
  order: number;
}

// ─── Books / Podcast / Blog index pages ──────────────────────────────────────

export interface SeriesIntro {
  eyebrow: string;
  heading: string;
  description: string;
}

export interface BooksPageContent {
  meta: { title: string; description: string };
  hero: { title: string; subtitle: string; image?: ContentImage };
  tabs: { textbook: string; guidebook: string; bargaining: string; podcast: string };
  series: { textbook: SeriesIntro; guidebook: SeriesIntro; bargaining: SeriesIntro; podcastLinkLabel: string };
}

export interface PodcastPageContent {
  meta: { title: string; description: string };
  hero: { title: string; subtitle: string; image?: ContentImage };
  roadmap: {
    eyebrow: string;
    heading: string;
    description: string;
    spotifyLabel: string;
    youtubeLabel: string;
    episodeCtaText: string;
  };
}

export interface BlogIndexContent {
  meta: { title: string; description: string };
  heading: string;
  emptyMessage: string;
  backLabel: string;
  cta: { title: string; subtitle: string; ctaText: string };
}
