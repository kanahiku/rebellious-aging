import { type SanityImageFields } from '../../sanity/image';
import type { ContentImage } from '../types';

export const IMAGE_PROJECTION = /* groq */ `
  "src": coalesce(image.asset->url, imageUrl, ""),
  "alt": coalesce(image.alt, imageAlt, ""),
  "crop": image.crop,
  "hotspot": image.hotspot,
  "asset": image.asset
`;

export const IMAGE_MOBILE_PROJECTION = /* groq */ `
  "src": coalesce(imageMobile.asset->url, imageMobileUrl, ""),
  "alt": coalesce(imageMobile.alt, imageMobileAlt, ""),
  "crop": imageMobile.crop,
  "hotspot": imageMobile.hotspot,
  "asset": imageMobile.asset
`;

export type FetchedImage = ContentImage & SanityImageFields;

export const homeImage = (field: string) => /* groq */ `{
      "src": coalesce(${field}.asset->url, ""),
      "alt": coalesce(${field}.alt, ""),
      "crop": ${field}.crop,
      "hotspot": ${field}.hotspot,
      "asset": ${field}.asset
    }`;

export const text = (value?: string | null) => value ?? '';
export const list = <T>(value?: T[] | null) => value ?? [];
