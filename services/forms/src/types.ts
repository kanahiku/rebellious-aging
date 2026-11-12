export interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  /** Extra origins as JSON array or comma-separated list. */
  ALLOWED_ORIGINS?: string;
  /** Notify emails per site per UTC day. Extra leads still save. Default 1000. */
  RESEND_DAILY_LIMIT?: string;
  /**
   * Per-site Turnstile secrets — TURNSTILE_SECRET_<SLUG_UPPERCASE_UNDERSCORED>
   * e.g. TURNSTILE_SECRET_REBELLIOUS_AGING
   * Falls back to global TURNSTILE_SECRET if per-site not found.
   */
  TURNSTILE_SECRET?: string;
  [key: string]: unknown;
}

export interface SiteRow {
  slug: string;
  name: string;
  notify_email: string;
  from_email: string;
  from_name: string;
  allowed_origins: string;
  /** NULL = use global RESEND_DAILY_LIMIT. 0 = no cap. Positive = per-site override. */
  pdf_daily_limit: number | null;
}

export interface Submission {
  site: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
  turnstileToken: string;
}

export interface PdfSummary {
  site: string;
  email: string;
  pdf: string;
  filename: string;
  website: string;
  turnstileToken: string;
}

export interface ResendEmail {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  attachments?: { filename: string; content: string }[];
  idempotencyKey?: string;
}
