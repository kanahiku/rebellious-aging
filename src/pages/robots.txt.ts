export const prerender = false;

import type { APIRoute } from 'astro';
import { isIndexableHost, robotsTxtBody } from '~/lib/indexing';

export const GET: APIRoute = ({ request }) => {
  const indexable = isIndexableHost(request.headers.get('host'));

  return new Response(robotsTxtBody(request.headers.get('host')), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      ...(indexable ? {} : { 'X-Robots-Tag': 'noindex, nofollow' }),
    },
  });
};
