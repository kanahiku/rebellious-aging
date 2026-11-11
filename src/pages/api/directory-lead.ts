export const prerender = false;

import type { APIRoute } from 'astro';

/**
 * "Add my business" lead → email via Resend. No database; a person adds listings by hand.
 *
 * Server env (Vercel): RESEND_API_KEY, DIRECTORY_LEAD_TO, DIRECTORY_LEAD_FROM
 * (the sending domain must be verified in Resend).
 */

const FIELDS = [
  { name: 'name', label: 'Your name', required: true },
  { name: 'businessName', label: 'Business or group name', required: true },
  { name: 'email', label: 'Email', required: true },
  { name: 'phone', label: 'Phone' },
  { name: 'message', label: 'Message' },
] as const;

const MAX_LEN = 2000;
const clean = (v: unknown) =>
  String(v ?? '')
    .trim()
    .slice(0, MAX_LEN);
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Could not read that submission.' }, 400);
  }

  // Honeypot: accept silently so bots do not retry.
  if (clean(body.website_url)) return json({ ok: true });

  const missing = FIELDS.filter((f) => 'required' in f && f.required && !clean(body[f.name])).map((f) => f.label);
  if (missing.length) return json({ ok: false, error: `Still needed: ${missing.join(', ')}` }, 422);

  const email = clean(body.email);
  if (!isEmail(email)) return json({ ok: false, error: 'That email address does not look right.' }, 422);

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.DIRECTORY_LEAD_TO;
  const from = import.meta.env.DIRECTORY_LEAD_FROM;
  if (!apiKey || !to || !from) {
    console.error('[directory-lead] RESEND_API_KEY / DIRECTORY_LEAD_TO / DIRECTORY_LEAD_FROM not configured');
    return json({ ok: false, error: 'We could not send that just now. Please try again later.' }, 500);
  }

  const rows: (readonly [string, string])[] = FIELDS.map((f) => [f.label, clean(body[f.name])] as const).filter(
    ([, v]) => v
  );
  const page = clean(body.page);
  if (page) rows.push(['Sent from', page]);

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  const html = `
    <h2 style="font-family:Georgia,serif;margin:0 0 16px">New directory lead</h2>
    <table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) => `<tr>
        <td style="padding:6px 16px 6px 0;color:#667;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td>
        <td style="padding:6px 0;color:#111">${escapeHtml(v).replace(/\n/g, '<br>')}</td>
      </tr>`
        )
        .join('')}
    </table>
    <p style="font-family:system-ui,sans-serif;font-size:13px;color:#667;margin-top:20px">
      Reply to reach them directly. Nothing is published until someone adds it by hand.
    </p>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: to.split(',').map((s: string) => s.trim()),
        reply_to: email,
        subject: `[Directory] Add my business: ${clean(body.businessName)}`,
        text,
        html,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  } catch (error) {
    console.error('[directory-lead] send failed', error);
    return json({ ok: false, error: 'We could not send that just now. Please try again later.' }, 502);
  }

  return json({ ok: true });
};
