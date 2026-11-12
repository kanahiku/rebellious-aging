import { sanityClient } from '../../sanity/client';
import type { AthenaEvaluationContent, LegalPageContent, LegalBlock, NavigationContent } from '../types';
import { list, text } from './shared';
import { type Nullable } from './about';

export const ATHENA_EVALUATION_QUERY = /* groq */ `
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
    overview?:
      | (Nullable<Omit<AthenaEvaluationContent['overview'], 'items'>> & {
          items?: Nullable<{ title: string; body: string }>[] | null;
        })
      | null;
    pricing?:
      | (Nullable<Omit<AthenaEvaluationContent['pricing'], 'tiers'>> & {
          tiers?: Nullable<{ label: string; price: string }>[] | null;
        })
      | null;
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

export const LEGAL_QUERY = /* groq */ `
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
    sections?:
      | {
          heading?: string | null;
          blocks?: { _type: string; text?: string | null; items?: string[] | null }[] | null;
        }[]
      | null;
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

export const NAVIGATION_QUERY = /* groq */ `
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
