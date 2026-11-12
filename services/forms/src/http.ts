import { type Env } from './types';
import { DEFAULT_ORIGIN_PATTERNS } from './config';

export function defaultPatterns(env: Env): string[] {
  return [...DEFAULT_ORIGIN_PATTERNS, ...parseEnvOrigins(env.ALLOWED_ORIGINS)];
}

export function withCors(origin: string, patterns: string[], response: Response): Response {
  if (origin && originAllowed(origin, patterns)) {
    return cors(origin, response);
  }
  return response;
}

export function cors(origin: string, response: Response): Response {
  const headers = new Headers(response.headers);
  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  headers.set('Access-Control-Max-Age', '86400');
  return new Response(response.body, { status: response.status, headers });
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export function originMatches(origin: string, pattern: string): boolean {
  if (!origin || !pattern) return false;
  if (origin === pattern) return true;
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*');
  return new RegExp(`^${escaped}$`, 'i').test(origin);
}

export function originAllowed(origin: string, patterns: string[]): boolean {
  return patterns.some((pattern) => originMatches(origin, pattern));
}

export function parseEnvOrigins(raw?: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    /* comma-separated */
  }
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function readBody(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    const data = (await request.json()) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v == null ? '' : String(v)]));
  }

  const form = await request.formData();
  const out: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string') out[key] = value;
  }
  return out;
}
