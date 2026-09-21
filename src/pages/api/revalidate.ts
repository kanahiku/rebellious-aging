export const prerender = false;

import type { APIRoute } from 'astro';
import { timingSafeEqual } from 'node:crypto';
import { getPublicContentPaths } from '~/lib/content';

/**
 * Sanity webhook (Manage → API → Webhooks):
 * URL: https://rebelliousaging.org/api/revalidate
 * Method: POST
 * Header: Authorization: Bearer <SANITY_REVALIDATE_SECRET>
 * Trigger: Create / Update / Delete
 * Filter: !(_id in path("drafts.**"))
 * Projection: {_id,_type,"slug": slug.current}
 *
 * On publish, this refreshes cached HTML (ISR) so new blogs and CMS pages
 * go live without a Vercel rebuild.
 */

function secretsEqual(provided: string, expected: string) {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || a.length === 0) return false;
  return timingSafeEqual(a, b);
}

function bearerToken(request: Request) {
  const header = request.headers.get('authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (match?.[1]) return match[1].trim();
  return (
    request.headers.get('x-revalidate-secret')?.trim() || new URL(request.url).searchParams.get('secret')?.trim() || ''
  );
}

function asPath(path: string) {
  const trimmed = path.trim();
  if (!trimmed) return '/';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

async function revalidatePath(origin: string, path: string, bypassToken: string) {
  const url = new URL(asPath(path), origin).toString();
  const response = await fetch(url, {
    method: 'HEAD',
    headers: { 'x-prerender-revalidate': bypassToken },
    redirect: 'manual',
  });
  return {
    path: asPath(path),
    status: response.status,
    cache: response.headers.get('x-vercel-cache'),
  };
}

export const POST: APIRoute = async ({ request }) => {
  const secret = import.meta.env.SANITY_REVALIDATE_SECRET || '';
  const bypassToken = import.meta.env.ISR_BYPASS_TOKEN || '';

  if (!secret || !secretsEqual(bearerToken(request), secret)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!bypassToken) {
    return new Response(JSON.stringify({ error: 'ISR_BYPASS_TOKEN is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const origin = new URL(request.url).origin;
  const paths = [...new Set(await getPublicContentPaths())];

  const results = await Promise.all(
    paths.map(async (path) => {
      try {
        return await revalidatePath(origin, path, bypassToken);
      } catch (error) {
        return {
          path,
          status: 0,
          error: error instanceof Error ? error.message : 'revalidate failed',
        };
      }
    })
  );

  return new Response(
    JSON.stringify({
      revalidated: results.length,
      results,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
