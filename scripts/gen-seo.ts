/**
 * Writes a static copy of the sitemap for hand-off.
 *
 *   npx tsx --env-file=.env scripts/gen-seo.ts
 *
 * Output: seo/sitemap.xml (same rules as src/pages/sitemap.xml.ts).
 * The live site serves /sitemap.xml itself; this is only a snapshot.
 * Schema.org JSON-LD is supplied by the client, so it is not generated here.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@sanity/client';

import { getSchemaPaths } from '../src/config/schema';
import { siteOrigin } from '../src/config/site';

const origin = siteOrigin();
const staticPaths = getSchemaPaths();

mkdirSync('seo', { recursive: true });

// ── Sitemap (same rules as src/pages/sitemap.xml.ts) ─────────────────────────
type Entry = { path: string; lastmod?: string };
const entries: Entry[] = staticPaths.map((path) => ({ path }));

if (process.env.SANITY_PROJECT_ID) {
  const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
    perspective: 'published',
    token: process.env.SANITY_API_TOKEN,
  });
  const posts = await client.fetch<{ slug: string; updated: string }[]>(
    `*[_type == "blogPost" && defined(slug.current)] | order(publishDate desc) { "slug": slug.current, "updated": _updatedAt }`
  );
  for (const post of posts) entries.push({ path: `/blog/${post.slug}`, lastmod: post.updated.slice(0, 10) });
} else {
  console.warn('SANITY_PROJECT_ID not set — blog posts omitted from seo/sitemap.xml');
}

const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const urls = entries
  .map(({ path, lastmod }) => {
    const loc = esc(`${origin}${path === '/' ? '/' : path}`);
    return `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;
  })
  .join('\n');
writeFileSync(
  'seo/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

console.log(`✓ ${entries.length} sitemap URLs → seo/sitemap.xml`);
