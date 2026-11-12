import type { Env } from './types';
import { defaultPatterns, json, cors, withCors, originAllowed } from './http';
import { handleSubmit, handleEmailSummary } from './handlers';

export type { Env } from './types';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);

    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      return json({ ok: true, service: 'massic-forms' });
    }

    if (request.method === 'OPTIONS') {
      if (!originAllowed(origin, defaultPatterns(env))) {
        return json({ ok: false, error: 'Origin not allowed' }, 403);
      }
      return cors(origin, new Response(null, { status: 204 }));
    }

    const patterns = defaultPatterns(env);

    if (request.method !== 'POST') {
      return withCors(origin, patterns, json({ ok: false, error: 'Method not allowed' }, 405));
    }

    if (url.pathname === '/email-summary') {
      return handleEmailSummary(request, env, origin, patterns);
    }

    if (url.pathname !== '/submit' && url.pathname !== '/') {
      return withCors(origin, patterns, json({ ok: false, error: 'Not found' }, 404));
    }

    return handleSubmit(request, env, origin, patterns);
  },
};

