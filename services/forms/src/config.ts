import { type Env } from './types';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX = { name: 120, email: 254, phone: 40, message: 5000 };
export const MAX_PDF_B64 = 3_500_000;
export const DEFAULT_RESEND_DAILY_LIMIT = 1000;
export const PDF_KIND = 'checkup-pdf';
export const DEFAULT_PDF_FILENAME = 'rebellious-aging-check-up.pdf';

/**
 * Resolve the Turnstile secret for a given site slug.
 * Checks TURNSTILE_SECRET_<SLUG_UPPER> first, falls back to global TURNSTILE_SECRET.
 * Never reads RESEND_FROM or NOTIFY_EMAIL_OVERRIDE — those must not be set globally.
 */
export function resolveTurnstileSecret(env: Env, siteSlug: string): string {
  const key = `TURNSTILE_SECRET_${siteSlug.toUpperCase().replace(/-/g, '_')}`;
  const perSite = (env as Record<string, unknown>)[key];
  if (typeof perSite === 'string' && perSite) return perSite;
  return typeof env.TURNSTILE_SECRET === 'string' ? env.TURNSTILE_SECRET : '';
}

/** Always allowed so local + Vercel preview/prod work before a custom domain exists. */
export const DEFAULT_ORIGIN_PATTERNS = [
  'http://localhost:*',
  'http://127.0.0.1:*',
  'https://*.vercel.app',
];
