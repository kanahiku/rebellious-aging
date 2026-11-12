import { sanityClient } from '../../sanity/client';
import { resolveContentImage, type SanityImageFields } from '../../sanity/image';
import type { BlogPost, ContactPageContent, ContentImage, FormHelpOption, ReviewsPageContent } from '../types';
import { type FetchedImage, IMAGE_PROJECTION, text } from './shared';
import { CTA_BANNER_PROJECTION, HERO_PROJECTION, SPLIT_PROJECTION, normalizeHeroImage, normalizeSplit } from './service';

export const CONTACT_PAGE_QUERY = /* groq */ `
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

export const CONTACT_HELP_OPTIONS_QUERY = /* groq */ `
  *[_type == "contactPage" && _id == "singleton-contact"][0].form.helpOptions[] { label, value }
`;

export async function getSanityContactHelpOptions(): Promise<FormHelpOption[]> {
  const options = await sanityClient.fetch<FormHelpOption[] | null>(CONTACT_HELP_OPTIONS_QUERY);
  return (options ?? []).filter((option) => option?.label && option?.value);
}

export const REVIEWS_PAGE_QUERY = /* groq */ `
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

export type SanityMarkDef = {
  _type: string;
  _key: string;
  href?: string;
  blank?: boolean;
};

export type SanitySpan = {
  _type: string;
  _key?: string;
  text?: string;
  marks?: string[];
};

export type SanityPortableBlock = {
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

export type SanityBlogPost = Omit<BlogPost, 'image' | 'relatedPages' | 'body' | 'contentBlocks'> & {
  image?: ContentImage;
  relatedPages?: string[] | null;
  body?: SanityPortableBlock[] | null;
};
