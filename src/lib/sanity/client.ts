import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID ?? '',
  dataset: import.meta.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  // useCdn: true → serves reads from Sanity's global CDN cache (~1-2 min TTL).
  // This eliminates 300-500ms of database round-trip on every SSR request.
  // Keep false only for write-client (writeClient.ts) or preview sessions.
  useCdn: true,
  perspective: 'published',
  token: import.meta.env.SANITY_API_TOKEN,
});
