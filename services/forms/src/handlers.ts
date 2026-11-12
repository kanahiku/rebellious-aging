import { type Env, type SiteRow } from './types';
import { PDF_KIND, resolveTurnstileSecret } from './config';
import { json, originAllowed, readBody, withCors } from './http';
import { parseOrigins, validate, validatePdfSummary } from './validate';
import { emailsSentToday, isPlaceholderEmail, outboundSentToday, parseDailyLimit, recordOutboundSend, utcDayStartIso, verifyTurnstile } from './limits';
import { emailHtml, emailText, pdfEmailHtml, pdfEmailText, sendResend } from './email';

export async function handleSubmit(request: Request, env: Env, origin: string, patterns: string[]): Promise<Response> {
  try {
    const body = await readBody(request);

    if (body.website) {
      return withCors(origin, patterns, json({ ok: true }));
    }

    const parsed = validate(body);
    if ('error' in parsed) {
      return withCors(origin, patterns, json({ ok: false, error: parsed.error }, 400));
    }

    const site = await env.DB.prepare('SELECT * FROM sites WHERE slug = ?')
      .bind(parsed.site)
      .first<SiteRow>();

    if (!site) {
      return withCors(origin, patterns, json({ ok: false, error: 'Unknown site' }, 400));
    }

    const allowed = [...patterns, ...parseOrigins(site.allowed_origins)];
    if (origin && !originAllowed(origin, allowed)) {
      return json({ ok: false, error: 'Origin not allowed' }, 403);
    }

    const turnstileOk = await verifyTurnstile(
      parsed.turnstileToken,
      resolveTurnstileSecret(env, parsed.site),
      request,
      site.slug
    );
    if (!turnstileOk) {
      return withCors(origin, allowed, json({ ok: false, error: 'Spam check failed' }, 400));
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO leads (id, site_slug, name, email, phone, message, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, site.slug, parsed.name, parsed.email, parsed.phone || null, parsed.message, createdAt)
      .run();

    const dailyLimit = parseDailyLimit(env.RESEND_DAILY_LIMIT);
    const sentToday = await emailsSentToday(env.DB, site.slug, utcDayStartIso());

    if (sentToday >= dailyLimit) {
      console.warn(`Resend skipped: ${site.slug} hit daily cap (${dailyLimit})`);
    } else {
      const notifyTo = site.notify_email;
      const from = site.from_email;

      const sent = await sendResend(env.RESEND_API_KEY, {
        from,
        to: notifyTo,
        replyTo: parsed.email,
        subject: `New website inquiry: ${parsed.name}`,
        html: emailHtml(site.name, parsed),
        text: emailText(site.name, parsed),
        idempotencyKey: `lead/${site.slug}/${id}`,
      });

      if (sent.ok) {
        await env.DB.prepare('UPDATE leads SET email_sent_at = ? WHERE id = ?')
          .bind(new Date().toISOString(), id)
          .run();
      }
    }

    // Lead is in D1. Never tell the visitor whether Resend ran.
    return withCors(origin, allowed, json({ ok: true }));
  } catch (err) {
    console.error('submit failed', err);
    return withCors(origin, patterns, json({ ok: false, error: 'Unable to submit right now' }, 500));
  }
}

export async function handleEmailSummary(request: Request, env: Env, origin: string, patterns: string[]): Promise<Response> {
  try {
    const body = await readBody(request);

    if (body.website) {
      return withCors(origin, patterns, json({ ok: true }));
    }

    const parsed = validatePdfSummary(body);
    if ('error' in parsed) {
      return withCors(origin, patterns, json({ ok: false, error: parsed.error }, 400));
    }

    const site = await env.DB.prepare('SELECT * FROM sites WHERE slug = ?')
      .bind(parsed.site)
      .first<SiteRow>();

    if (!site) {
      return withCors(origin, patterns, json({ ok: false, error: 'Unknown site' }, 400));
    }

    const allowed = [...patterns, ...parseOrigins(site.allowed_origins)];
    if (origin && !originAllowed(origin, allowed)) {
      return json({ ok: false, error: 'Origin not allowed' }, 403);
    }

    const turnstileOk = await verifyTurnstile(
      parsed.turnstileToken,
      resolveTurnstileSecret(env, parsed.site),
      request,
      site.slug
    );
    if (!turnstileOk) {
      return withCors(origin, allowed, json({ ok: false, error: 'Spam check failed' }, 400));
    }

    const dailyLimit = site.pdf_daily_limit === 0
      ? Infinity
      : site.pdf_daily_limit != null
        ? site.pdf_daily_limit
        : parseDailyLimit(env.RESEND_DAILY_LIMIT);

    if (isFinite(dailyLimit)) {
      const sentToday = await outboundSentToday(env.DB, site.slug, PDF_KIND, utcDayStartIso());
      if (sentToday >= dailyLimit) {
        return withCors(
          origin,
          allowed,
          json({ ok: false, error: 'Daily email limit reached. Download or print instead.' }, 429)
        );
      }
    }

    const from = site.from_email;
    const sendId = crypto.randomUUID();
    const replyTo = isPlaceholderEmail(site.notify_email) ? undefined : site.notify_email;

    const sent = await sendResend(env.RESEND_API_KEY, {
      from,
      to: parsed.email,
      replyTo,
      subject: `Your ${site.name} check-up summary`,
      html: pdfEmailHtml(site.name),
      text: pdfEmailText(site.name),
      attachments: [
        {
          filename: parsed.filename,
          content: parsed.pdf,
        },
      ],
      idempotencyKey: `checkup-pdf/${site.slug}/${sendId}`,
    });

    if (!sent.ok) {
      return withCors(origin, allowed, json({ ok: false, error: sent.error }, 502));
    }

    await recordOutboundSend(env.DB, sendId, site.slug, PDF_KIND);

    return withCors(origin, allowed, json({ ok: true }));
  } catch (err) {
    console.error('email-summary failed', err);
    return withCors(origin, patterns, json({ ok: false, error: 'Unable to send right now' }, 500));
  }
}
