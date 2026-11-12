import { type PdfSummary, type Submission } from './types';
import { DEFAULT_PDF_FILENAME, EMAIL_RE, MAX, MAX_PDF_B64 } from './config';

export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function isValidPhone(phone: string): boolean {
  const digits = phoneDigits(phone);
  if (digits.length === 11 && digits.startsWith('1')) return true;
  return digits.length >= 10 && digits.length <= 15;
}

export function validate(body: Record<string, string>): Submission | { error: string } {
  const site = (body.site || '').trim();
  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const message = (body.message || '').trim();
  const website = (body.website || '').trim();
  const turnstileToken = (body['cf-turnstile-response'] || body.turnstileToken || '').trim();

  if (!site) return { error: 'Missing site' };
  if (name.length < 1 || name.length > MAX.name) return { error: 'Enter your name' };
  if (!EMAIL_RE.test(email) || email.length > MAX.email) return { error: 'Enter a valid email' };
  if (!isValidPhone(phone) || phone.length > MAX.phone) return { error: 'Enter a valid phone number' };
  if (message.length < 1 || message.length > MAX.message) return { error: 'Enter a message' };
  if (!turnstileToken) return { error: 'Spam check is required' };

  return { site, name, email, phone, message, website, turnstileToken };
}

export function validatePdfSummary(body: Record<string, string>): PdfSummary | { error: string } {
  const site = (body.site || '').trim();
  const email = (body.email || '').trim();
  const website = (body.website || '').trim();
  const turnstileToken = (body['cf-turnstile-response'] || body.turnstileToken || '').trim();
  const pdf = normalizePdfBase64(body.pdf || '');
  const filename = sanitizeFilename(body.filename || '');

  if (!site) return { error: 'Missing site' };
  if (!EMAIL_RE.test(email) || email.length > MAX.email) return { error: 'Enter a valid email' };
  if (!pdf) return { error: 'Missing PDF' };
  if (pdf.length > MAX_PDF_B64) return { error: 'PDF is too large' };
  if (!turnstileToken) return { error: 'Spam check is required' };

  return { site, email, pdf, filename, website, turnstileToken };
}

export function normalizePdfBase64(raw: string): string {
  const trimmed = raw.trim().replace(/\s/g, '');
  const comma = trimmed.indexOf(',');
  if (trimmed.startsWith('data:') && comma !== -1) return trimmed.slice(comma + 1);
  return trimmed;
}

export function sanitizeFilename(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 80);
  return cleaned.toLowerCase().endsWith('.pdf') ? cleaned : DEFAULT_PDF_FILENAME;
}

export function parseOrigins(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}
