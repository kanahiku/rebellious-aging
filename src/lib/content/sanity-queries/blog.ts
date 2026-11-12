import { sanityClient } from '../../sanity/client';
import type { BlogPost } from '../types';
import { text } from './shared';
import { type SanityBlogPost } from './contact-reviews';
import { normalizeBlogPost } from './portable-text';

export const BLOG_POST_CARD_PROJECTION = /* groq */ `
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

export const BLOG_POST_PROJECTION = /* groq */ `
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

export const BLOG_POSTS_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current)] | order(publishDate desc) {
    ${BLOG_POST_CARD_PROJECTION}
  }
`;

export const BLOG_POST_BY_SLUG_QUERY = /* groq */ `
  *[_type == "blogPost" && slug.current == $slug][0] {
    ${BLOG_POST_PROJECTION}
  }
`;

export const BLOG_POSTS_RELATED_TO_QUERY = /* groq */ `
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

export const SERVICE_PAGE_SLUGS_QUERY = /* groq */ `
  *[_type == "servicePage" && defined(slug.current)].slug.current
`;

export const BLOG_POST_SLUGS_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current)].slug.current
`;

export async function getSanityServicePageSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<string[]>(SERVICE_PAGE_SLUGS_QUERY);
  return (slugs ?? []).filter((slug): slug is string => typeof slug === 'string' && slug.length > 0);
}

export const BLOG_POST_SITEMAP_QUERY = /* groq */ `
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
