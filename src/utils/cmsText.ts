/**
 * Turn plain CMS text into safe inline HTML.
 *
 *   - HTML is escaped first, so editors cannot inject markup
 *   - "\n"          → <br />   (when `breaks` is true, the default)
 *   - **highlight** → <span class="…">…</span> (headings) or <strong> (body copy)
 */
const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface Options {
  /** Wrap **x** in a span with this class instead of <strong>. */
  accentClass?: string;
  breaks?: boolean;
}

export function cmsInline(value: string | undefined | null, { accentClass, breaks = true }: Options = {}): string {
  if (!value) return '';
  let html = escapeHtml(value.trim());
  html = html.replace(/\*\*(.+?)\*\*/g, (_m, inner: string) =>
    accentClass ? `<span class="${accentClass}">${inner}</span>` : `<strong>${inner}</strong>`
  );
  if (breaks) html = html.replace(/\r?\n/g, '<br />');
  return html;
}

/** Heading with highlighted words: **word** → accent span. */
export const cmsHeading = (value: string | undefined | null, accentClass = 'text-accent') =>
  cmsInline(value, { accentClass });

/** Array of paragraphs → "<p>…</p><p>…</p>". */
export const cmsParagraphsHtml = (paragraphs: string[] | undefined | null) =>
  (paragraphs ?? []).map((p) => `<p>${cmsInline(p, { breaks: false })}</p>`).join('');

/**
 * Legal-page text: fills {{tokens}} from `vars`, escapes HTML, then applies
 * **bold lead-in**, [label](href) links and line breaks.
 */
export function cmsLegal(value: string | undefined | null, vars: Record<string, string> = {}): string {
  if (!value) return '';
  const filled = value.replace(/\{\{(\w+)\}\}/g, (_m, key: string) => vars[key] ?? '');
  let html = escapeHtml(filled.trim());
  html = html.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_m, label: string, href: string) => `<a class="btn-link" href="${href}">${label}</a>`
  );
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium text-heading">$1</strong>');
  return html.replace(/\r?\n/g, '<br />');
}
