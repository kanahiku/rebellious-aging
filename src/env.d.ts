// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="../vendor/integration/types.d.ts" />

interface ImportMetaEnv {
  readonly SANITY_PROJECT_ID?: string;
  readonly SANITY_DATASET?: string;
  readonly SANITY_API_TOKEN?: string;
  readonly SANITY_WRITE_TOKEN?: string;
  readonly ISR_BYPASS_TOKEN?: string;
  readonly SANITY_REVALIDATE_SECRET?: string;
  readonly PUBLIC_FORM_ENDPOINT?: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly PUBLIC_SITE_SLUG?: string;
  readonly SITE_NAME?: string;
  readonly SITE_URL?: string;
  readonly GOOGLE_PLACES_API_KEY?: string;
  readonly GOOGLE_PLACE_ID?: string;
  readonly GOOGLE_REVIEWS_URL?: string;
  readonly YELP_API_KEY?: string;
  readonly YELP_BUSINESS_ID?: string;
  readonly YELP_REVIEWS_URL?: string;
  readonly REVIEW_CACHE_TTL_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __gtmLoaded?: boolean;
}

declare namespace App {
  interface Locals {
    /** Extra schema.org nodes a route adds to the page's JSON-LD graph. */
    jsonLdNodes?: Record<string, unknown>[];
  }
}
