import { type ResendEmail, type Submission } from './types';
import { json } from './http';
import { hasRealResendKey, isPlaceholderEmail } from './limits';

export async function sendResend(
  apiKey: string | undefined,
  email: ResendEmail
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!hasRealResendKey(apiKey)) {
    console.warn('Resend skipped: set a real RESEND_API_KEY on the Worker');
    return { ok: false, error: 'Unable to send email right now. Download or print instead.' };
  }

  const payload: Record<string, unknown> = {
    from: email.from,
    to: [email.to],
    subject: email.subject,
    html: email.html,
    text: email.text,
  };
  if (email.replyTo && !isPlaceholderEmail(email.replyTo)) payload.reply_to = email.replyTo;
  if (email.attachments?.length) payload.attachments = email.attachments;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (email.idempotencyKey) headers['Idempotency-Key'] = email.idempotencyKey;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error('Resend failed', res.status, errText);
    return { ok: false, error: resendUserError(res.status, errText) };
  }
  return { ok: true };
}

export function resendUserError(status: number, errText: string): string {
  let message = '';
  try {
    const parsed = JSON.parse(errText) as { message?: string };
    if (typeof parsed.message === 'string') message = parsed.message;
  } catch {
    /* ignore */
  }
  if (
    status === 403 ||
    /testing emails|verify a domain|onboarding@resend\.dev/i.test(message)
  ) {
    return 'Resend is still in test mode. Use the email address on the Resend account, or verify a sending domain.';
  }
  return 'Unable to send email right now. Download or print instead.';
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function emailHtml(siteName: string, lead: Submission): string {
  return `
    <p>New inquiry from <strong>${escapeHtml(siteName)}</strong></p>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(lead.phone || 'Not provided')}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(lead.message).replace(/\n/g, '<br />')}</p>
  `;
}

export function emailText(siteName: string, lead: Submission): string {
  return [
    `New inquiry from ${siteName}`,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || 'Not provided'}`,
    '',
    lead.message,
  ].join('\n');
}

export function pdfEmailHtml(siteName: string): string {
  return `
    <p>Your ${escapeHtml(siteName)} check-up summary is attached as a PDF.</p>
    <p>We do not keep a copy of the file or of the answers in it. Download or print remains the option that never leaves your device.</p>
  `;
}

export function pdfEmailText(siteName: string): string {
  return [
    `Your ${siteName} check-up summary is attached as a PDF.`,
    '',
    'We do not keep a copy of the file or of the answers in it.',
    'Download or print remains the option that never leaves your device.',
  ].join('\n');
}
