/**
 * gen-icons.mjs
 * Regenerates all brand identity assets from the favicon SVG.
 * Run after any logo or brand colour change:
 *   node --env-file=.env scripts/gen-icons.mjs
 *
 * Outputs
 *   public/apple-touch-icon.png   — 180×180 PNG  (iOS / Safari)
 *   public/favicon.ico            — 32×32  PNG-in-ICO (legacy fallback)
 *   src/assets/images/og-image.jpg — 1200×630 JPG (OG / Twitter card)
 *
 * Update the constants below when the logo or brand colours change.
 */
import sharp from 'sharp';

// ── Brand tokens — keep in sync with src/brand.ts ────────────────────────────
const BRAND_DARK   = '#1B2A32';  // brand.colors.sectionDark
const BRAND_CARD   = '#2C4A5B';  // brand.colors.cardDark
const BRAND_ACCENT = '#567F9B';  // brand.colors.accent
const BRAND_SECONDARY = '#7BA3BD'; // brand.colors.secondary

// ── Site identity — keep in sync with src/config.yaml ────────────────────────
const SITE_NAME  = 'Rebellious Aging';
const MONOGRAM   = 'RA';                               // 1–3 chars shown in small icons
const TAGLINE    = 'The science of living long, on your own terms.';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Small square monogram SVG — used for favicon.ico and apple-touch-icon.
 * Uses plain text so librsvg can parse it (complex logo paths sometimes
 * contain control characters that break libvips/librsvg).
 */
function monogramSvg(size, rx) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
    `<rect width="${size}" height="${size}" rx="${rx}" fill="${BRAND_DARK}"/>` +
    `<text x="${size * 0.5}" y="${size * 0.72}" text-anchor="middle" ` +
    `font-family="Georgia,serif" font-size="${Math.round(size * 0.49)}" font-weight="400" fill="white">${MONOGRAM}</text>` +
    `</svg>`
  );
}

/** 1200×630 branded OG social card SVG. */
const ogSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${BRAND_DARK}"/>
  <defs>
    <radialGradient id="g" cx="18%" cy="35%" r="55%">
      <stop offset="0%" stop-color="${BRAND_ACCENT}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${BRAND_DARK}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="70" y="60" width="200" height="260" rx="20" fill="${BRAND_CARD}"/>
  <text x="170" y="228" text-anchor="middle" font-family="Georgia,serif" font-size="130" font-weight="400" fill="white">${MONOGRAM}</text>
  <rect x="308" y="90" width="3" height="200" fill="${BRAND_ACCENT}" opacity="0.5"/>
  <text x="340" y="160" font-family="Georgia,serif" font-size="72" font-weight="400" fill="white">${SITE_NAME}</text>
  <text x="342" y="220" font-family="Arial,sans-serif" font-size="28" font-weight="300" fill="${BRAND_SECONDARY}">${TAGLINE}</text>
  <rect x="0" y="610" width="1200" height="4" fill="${BRAND_ACCENT}" opacity="0.35"/>
</svg>`);

// ─────────────────────────────────────────────────────────────────────────────
// Generate
// ─────────────────────────────────────────────────────────────────────────────
console.log('Generating brand identity assets…\n');

await Promise.all([
  sharp(monogramSvg(180, 36))
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png')
    .then(() => console.log('  ✓  public/apple-touch-icon.png   (180×180)')),

  sharp(monogramSvg(32, 6))
    .resize(32, 32)
    .png()
    .toFile('public/favicon.ico')
    .then(() => console.log('  ✓  public/favicon.ico             (32×32)')),

  sharp(ogSvg)
    .resize(1200, 630)
    .jpeg({ quality: 92 })
    .toFile('src/assets/images/og-image.jpg')
    .then(() => console.log('  ✓  src/assets/images/og-image.jpg (1200×630)')),
]);

console.log('\nDone. Also check:');
console.log('  • public/favicon.svg         — update SVG paths to match new logo');
console.log('  • src/components/Favicons.astro  — mask-icon color = brand.colors.accent');
console.log('  • src/config.yaml            — site_name, title.default, title.template');
