import { defineField, defineType } from 'sanity';
import { requiredTitle } from '../../../lib/validation';

type SeoDoc = { schemaMode?: string };

/**
 * One SEO panel for every page (Yoast replacement).
 * Field names `title` / `description` match what existing pages already store.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      description: 'Shown in the browser tab and Google. Aim for 50-60 characters.',
      validation: (r) => requiredTitle(r).max(70).warning('Over 70 characters may be cut off in Google.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'Aim for 120-160 characters.',
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      type: 'url',
      description: 'Leave empty to use the page address. Only set this to point at a different primary page.',
      validation: (r) => r.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines (noindex)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'ogTitle', title: 'Social share title', type: 'string', description: 'Defaults to the page title.' }),
    defineField({ name: 'ogDescription', title: 'Social share text', type: 'text', rows: 2, description: 'Defaults to the meta description.' }),
    defineField({ name: 'ogImage', title: 'Social share image', type: 'imageWithAlt', description: '1200 x 630 works best.' }),
    defineField({
      name: 'schemaMode',
      title: 'Structured data (schema)',
      type: 'string',
      initialValue: 'auto',
      options: {
        layout: 'radio',
        list: [
          { title: 'Use automatic schema', value: 'auto' },
          { title: 'Add my JSON-LD to the automatic schema', value: 'add' },
          { title: 'Replace automatic schema with my JSON-LD', value: 'replace' },
        ],
      },
    }),
    defineField({
      name: 'schemaJson',
      title: 'Custom JSON-LD',
      type: 'text',
      rows: 10,
      description: 'Paste valid JSON-LD (an object with "@context"/"@type", or one with "@graph"). Checked before publish.',
      hidden: ({ parent }) => !parent || (parent as SeoDoc).schemaMode === 'auto' || !(parent as SeoDoc).schemaMode,
      validation: (r) =>
        r.custom((value, ctx) => {
          const mode = (ctx.parent as SeoDoc | undefined)?.schemaMode;
          if (!mode || mode === 'auto') return true;
          if (typeof value !== 'string' || !value.trim()) return 'Paste JSON-LD or switch back to automatic schema.';
          try {
            const parsed = JSON.parse(value);
            if (!parsed || typeof parsed !== 'object') return 'JSON-LD must be an object.';
            if (!parsed['@type'] && !parsed['@graph']) return 'JSON-LD needs an "@type" or an "@graph".';
            return true;
          } catch (e) {
            return `Invalid JSON: ${(e as Error).message}`;
          }
        }),
    }),
  ],
});
