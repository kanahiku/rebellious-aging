/**
 * Fails when the file-based routes and `src/config/schema/pages.ts` disagree.
 *
 *   npm run check:seo
 *
 * - every static, indexable page under src/pages must be in pages.ts
 *   (that list drives both schema.org and /sitemap.xml)
 * - pages marked `noindex` must NOT be in pages.ts
 * - every pages.ts entry must have a real page
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { pages } from '../src/config/schema/pages';

const ROOT = 'src/pages';
// Non-HTML / non-content routes that live under src/pages.
const IGNORE_TOP_LEVEL = new Set(['api', '404']);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const routes = new Map<string, { file: string; noindex: boolean }>();
for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file).split(sep).join('/');
  if (!/(^|\/)index\.astro$/.test(rel) && rel !== 'index.astro') continue;
  if (rel.includes('[')) continue; // dynamic routes are handled separately (blog posts)
  const route = '/' + rel.replace(/\/?index\.astro$/, '');
  if (IGNORE_TOP_LEVEL.has(route.split('/')[1] ?? '')) continue;
  const noindex = /robots:\s*['"`]?[^,\n]*noindex/i.test(readFileSync(file, 'utf8'));
  routes.set(route === '/' ? '/' : route, { file, noindex });
}

const listed = new Set(pages.map((p) => p.path));
const errors: string[] = [];

for (const [route, { file, noindex }] of routes) {
  if (noindex && listed.has(route)) errors.push(`${route} is noindex but listed in pages.ts (${file})`);
  if (!noindex && !listed.has(route)) errors.push(`${route} is missing from src/config/schema/pages.ts (${file})`);
}
for (const path of listed) {
  if (!routes.has(path)) errors.push(`${path} is in pages.ts but has no src/pages route`);
}

if (errors.length) {
  console.error('✗ SEO route check failed:\n  - ' + errors.join('\n  - '));
  process.exit(1);
}
console.log(`✓ ${listed.size} indexable routes match schema + sitemap list`);
