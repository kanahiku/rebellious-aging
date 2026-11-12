import type { ValidationContext } from 'sanity';

/** Minimal structural rule type so one helper works for string, slug and any field rule. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRule = { required(): any; custom(fn: (value: any, context: ValidationContext) => any): any };

/**
 * Publish-blocking validation shared by every schema (SOP: "Studio blocks publish
 * if title, slug or alt text is missing"). Import these instead of ad-hoc rules.
 */

/** Title (or any headline string) must be present and not just whitespace. */
export const requiredTitle = (rule: AnyRule) =>
  rule.required().custom((value: unknown) => (typeof value === 'string' && !value.trim() ? 'Title cannot be blank.' : true));

/** Slug must exist and have a current value. */
export const requiredSlug = (rule: AnyRule) =>
  rule.required().custom((value: unknown) => {
    const current = (value as { current?: string } | undefined)?.current;
    return current && current.trim() ? true : 'Click "Generate" or type a slug before publishing.';
  });

/**
 * Alt text on an image's `alt` subfield. Blocks publish when an image is set
 * but its alt text is empty. Place on the `alt` field, not the image itself.
 */
export const requiredAlt = (rule: AnyRule) =>
  rule.custom((alt: unknown, context: ValidationContext) => {
    const parent = context.parent as { asset?: unknown } | undefined;
    if (parent?.asset && !(typeof alt === 'string' && alt.trim())) {
      return 'Alt text is required for every image.';
    }
    return true;
  });
