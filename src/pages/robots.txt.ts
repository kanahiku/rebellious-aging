export const prerender = false;

import type { APIRoute } from 'astro';
import { canonicalSiteOrigin, isIndexableHost } from '~/lib/indexing';

export const GET: APIRoute = ({ request }) => {
  const indexable = isIndexableHost(request.headers.get('host'));
  const origin = canonicalSiteOrigin();

  const body = indexable
    ? [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${origin}/sitemap.xml`,
        '',
      ].join('\n')
    : ['User-agent: *', 'Disallow: /', ''].join('\n');

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      ...(indexable ? {} : { 'X-Robots-Tag': 'noindex, nofollow' }),
    },
  });
};
