import { site, siteOrigin } from '~/config/site';

function hostnameOf(value: string): string | null {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isTemporaryHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.vercel.app') ||
    hostname.endsWith('.localhost')
  );
}

/**
 * Canonical public origin (apex or www from src/config/site.ts).
 * Never returns a Vercel preview/staging host — those must not appear in sitemaps.
 */
export function canonicalSiteOrigin(): string {
  const candidates = [site.url, import.meta.env.SITE_URL ?? ''];

  for (const raw of candidates) {
    const origin = raw.replace(/\/+$/, '');
    if (!origin) continue;
    const hostname = hostnameOf(origin);
    if (!hostname || isTemporaryHost(hostname)) continue;
    return origin;
  }

  return siteOrigin();
}

export function indexableHosts(): Set<string> {
  const hosts = new Set<string>();
  const hostname = hostnameOf(canonicalSiteOrigin());
  if (!hostname) return hosts;
  hosts.add(hostname);
  if (hostname.startsWith('www.')) {
    hosts.add(hostname.slice(4));
  } else {
    hosts.add(`www.${hostname}`);
  }
  return hosts;
}

/**
 * Indexing is allowed only on the real domain. Temp hosts (*.vercel.app, localhost)
 * stay noindex/disallow.
 */
export function isIndexableHost(hostHeader: string | null | undefined): boolean {
  if (!hostHeader) return false;
  const hostname = hostHeader.split(':')[0]?.toLowerCase();
  if (!hostname || isTemporaryHost(hostname)) return false;
  return indexableHosts().has(hostname);
}

/** Plain-text robots.txt. Preview hosts are disallowed; the public domain is allowed. */
export function robotsTxtBody(hostHeader: string | null | undefined): string {
  if (!isIndexableHost(hostHeader)) {
    return 'User-agent: *\nDisallow: /\n';
  }

  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${canonicalSiteOrigin()}/sitemap.xml`, ''].join('\n');
}
