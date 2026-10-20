import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageField, paragraphs, seoFields, str, txt } from './_fields';

/**
 * /fill-the-first-bucket: every editable string and image on the page.
 * Not editable here (lives in code): the animated three-bucket graphic.
 * In the pull quote, wrap words in **double asterisks** to highlight them.
 */
export const fillFirstBucketPage = defineType({
  name: 'fillFirstBucketPage',
  title: 'Fill the First Bucket',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'rules', title: 'Pull quote + rules' },
    { name: 'band', title: 'Image band' },
    { name: 'cta', title: 'Bottom banner' },
  ],

  fields: [
    defineField({
      name: 'meta',
      title: 'SEO',
      type: 'object',
      group: 'meta',
      fields: seoFields('Used as-is in the browser tab, include the site name.'),
    }),

    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        txt('title', 'Title', 'A line break becomes a visual line break.', 2),
        paragraphs('paragraphs', 'Intro paragraphs'),
        imageField('image', 'Hero image', 'Wide photo behind the title.'),
        imageField('imageMobile', 'Mobile hero image', 'Optional phone crop. Leave empty to reuse the desktop image.'),
      ],
    }),

    defineField({
      name: 'rules',
      title: 'Pull quote + four rules',
      type: 'object',
      group: 'rules',
      fields: [
        paragraphs('pullQuote', 'Pull quote paragraphs', 'Wrap words in **double asterisks** to highlight them.'),
        txt('heading', 'Rules heading', 'A line break becomes a line break on wider screens.', 2),
        defineField({
          name: 'items',
          title: 'Rules',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'rule',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Bold lead-in',
                  type: 'string',
                  description: 'e.g. "1. Overflow, not completion."',
                  validation: (r) => r.required(),
                }),
                defineField({ name: 'body', title: 'Text', type: 'text', rows: 4 }),
              ],
              preview: { select: { title: 'title' } },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'band',
      title: 'Image band',
      type: 'object',
      group: 'band',
      fields: [imageField('image', 'Wide image', 'Full-width band (about 1440 × 511).')],
    }),

    defineField({
      name: 'cta',
      title: 'Bottom banner',
      type: 'object',
      group: 'cta',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('title', 'Title'),
        txt('subtitle', 'Subtitle', undefined, 4),
        str('ctaText', 'Button label'),
        str('ctaHref', 'Button link'),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Fill the First Bucket' };
    },
  },
});
