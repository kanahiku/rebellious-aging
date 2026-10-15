import { defineMiddleware } from 'astro:middleware';
import { isIndexableHost, robotsTxtBody } from '~/lib/indexing';

export const onRequest = defineMiddleware(async (context, next) => {
  // Answer robots.txt here so a misrouted sitemap response cannot replace it.
  if (context.url.pathname === '/robots.txt') {
    const indexable = isIndexableHost(context.url.host);
    return new Response(robotsTxtBody(context.url.host), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        ...(indexable ? {} : { 'X-Robots-Tag': 'noindex, nofollow' }),
      },
    });
  }

  const response = await next();

  if (isIndexableHost(context.url.host)) {
    response.headers.delete('X-Robots-Tag');
  } else {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
});
