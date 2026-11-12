import { sanityClient } from '../../sanity/client';
import { resolveContentImage } from '../../sanity/image';
import type { ContentImage, ServicePageContent, ServiceSection, SplitContentSection } from '../types';
import { type FetchedImage, IMAGE_MOBILE_PROJECTION, IMAGE_PROJECTION, text } from './shared';

export const SERVICE_PAGE_QUERY = /* groq */ `
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

export function normalizeHeroImage<
  T extends { image?: FetchedImage | ContentImage; imageMobile?: FetchedImage | ContentImage },
>(hero: T): T {
  return {
    ...hero,
    image: resolveContentImage(hero.image as FetchedImage | undefined),
    imageMobile: resolveContentImage(hero.imageMobile as FetchedImage | undefined),
  };
}

export function normalizeSplit(section: SplitContentSection & { image?: FetchedImage | ContentImage }): SplitContentSection {
  return { ...section, image: resolveContentImage(section.image as FetchedImage | undefined) };
}

export function resolveSectionImage<T extends { image?: FetchedImage | ContentImage }>(section: T): T {
  return { ...section, image: resolveContentImage(section.image as FetchedImage | undefined) };
}

export const HERO_PROJECTION = /* groq */ `
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

export const SPLIT_PROJECTION = /* groq */ `
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

export const CTA_BANNER_PROJECTION = /* groq */ `
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
