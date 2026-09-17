/**
 * Pre-generate hero WebP files for the homepage LCP image.
 *
 * These static files in public/ bypass the /_image Sharp endpoint so the
 * browser gets the LCP image in 1ms instead of 1s+ (dev) or using Vercel
 * Image Optimization credits (prod).
 *
 * Run after replacing src/assets/images/people-walking.png:
 *   node scripts/gen-hero-webp.mjs
 */
import sharp from 'sharp';
import { promises as fs } from 'fs';

const SRC = 'src/assets/images/people-walking.png';
const ASPECT = 800 / 1440; // original aspect ratio

const sizes = [640, 828, 1200, 1440];

await Promise.all(sizes.map(w => {
  const h = Math.round(w * ASPECT);
  return sharp(SRC)
    .resize(w, h, { fit: 'cover', position: 'center' })
    .webp({ quality: 85 })
    .toFile(`public/hero-home-${w}.webp`);
}));

const results = await Promise.all(sizes.map(async w => {
  const stat = await fs.stat(`public/hero-home-${w}.webp`);
  return `  ${w}w → ${Math.round(stat.size / 1024)}KB`;
}));
console.log('✓ Generated hero WebP files:\n' + results.join('\n'));
