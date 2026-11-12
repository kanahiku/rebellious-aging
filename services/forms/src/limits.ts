import { DEFAULT_RESEND_DAILY_LIMIT } from './config';

export async function verifyTurnstile(
  token: string,
  secret: string,
  request: Request,
  expectedAction: string
): Promise<boolean> {
  if (!secret) return false;
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean; action?: string };
  if (!data.success) return false;
  // Dummy Turnstile keys may omit `action`. The live Worker requires it to match the site slug.
  if (typeof data.action === 'string' && data.action !== expectedAction) return false;
  return true;
}

export function parseDailyLimit(raw?: string): number {
  const n = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(n) || n < 0) return DEFAULT_RESEND_DAILY_LIMIT;
  return n;
}

export function utcDayStartIso(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function emailsSentToday(db: D1Database, siteSlug: string, sinceIso: string): Promise<number> {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM leads
       WHERE site_slug = ?
         AND email_sent_at IS NOT NULL
         AND email_sent_at >= ?`
    )
    .bind(siteSlug, sinceIso)
    .first<{ n: number | string }>();
  return Number(row?.n ?? 0);
}

export async function outboundSentToday(
  db: D1Database,
  siteSlug: string,
  kind: string,
  sinceIso: string
): Promise<number> {
  try {
    const row = await db
      .prepare(
        `SELECT COUNT(*) AS n FROM outbound_sends
         WHERE site_slug = ?
           AND kind = ?
           AND created_at >= ?`
      )
      .bind(siteSlug, kind, sinceIso)
      .first<{ n: number | string }>();
    return Number(row?.n ?? 0);
  } catch (err) {
    console.warn('outbound_sends lookup failed — run schema.sql', err);
    return 0;
  }
}

export async function recordOutboundSend(db: D1Database, id: string, siteSlug: string, kind: string): Promise<void> {
  try {
    await db
      .prepare(`INSERT INTO outbound_sends (id, site_slug, kind, created_at) VALUES (?, ?, ?, ?)`)
      .bind(id, siteSlug, kind, new Date().toISOString())
      .run();
  } catch (err) {
    console.warn('outbound_sends insert failed — run schema.sql', err);
  }
}

export function hasRealResendKey(apiKey?: string): boolean {
  if (!apiKey) return false;
  return apiKey.startsWith('re_') && apiKey.length > 20 && !/x{4,}/i.test(apiKey);
}

export function isPlaceholderEmail(value: string): boolean {
  return /@example\.com$/i.test(value.trim());
}
