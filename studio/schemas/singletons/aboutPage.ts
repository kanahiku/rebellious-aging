import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageField, paragraphs, seoFields, str, txt } from './_fields';

/**
 * /about — every editable string and image on the page.
 * Layout, icons and section order live in code.
 */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'movement', title: 'The movement' },
    { name: 'doctor', title: 'Dr. Peterson' },
    { name: 'credentials', title: 'Credentials' },
    { name: 'publications', title: 'Publications' },
    { name: 'sponsor', title: 'Sponsor' },
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
        str('tagline', 'Tagline'),
        txt('title', 'Title', 'A line break becomes a visual line break.', 2),
        txt('content', 'Intro paragraph', undefined, 4),
        imageField('image', 'Portrait', 'Portrait shown beside the title.'),
      ],
    }),

    defineField({
      name: 'movement',
      title: 'The movement',
      type: 'object',
      group: 'movement',
      fields: [
        str('eyebrow', 'Eyebrow'),
        txt('heading', 'Heading', 'A line break becomes a visual line break.', 2),
        txt('lede', 'Lede paragraph', undefined, 3),
        txt('body', 'Body paragraph', undefined, 3),
        str('ctaText', 'Button label'),
        str('ctaHref', 'Button link'),
      ],
    }),

    defineField({
      name: 'doctor',
      title: 'Dr. Peterson',
      type: 'object',
      group: 'doctor',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        paragraphs('paragraphs', 'Paragraphs'),
        str('quote', 'Pull quote', 'Type it without surrounding quote marks only if you add them yourself; shown exactly as written.'),
        str('quoteAuthor', 'Quote attribution'),
      ],
    }),

    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'object',
      group: 'credentials',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        str('educationLabel', 'Education card label'),
        str('education', 'Education'),
        str('certificationsLabel', 'Certifications card label'),
        defineField({
          name: 'certifications',
          title: 'Certifications',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
        }),
        str('residenciesLabel', 'Residencies card label'),
        defineField({
          name: 'residencies',
          title: 'Residencies & fellowships (timeline, in order)',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'residency',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'institution', title: 'Institution', type: 'string' }),
              ],
              preview: { select: { title: 'title', subtitle: 'institution' } },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'publications',
      title: 'Publications',
      type: 'object',
      group: 'publications',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        defineField({
          name: 'items',
          title: 'Publications',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'publication',
              fields: [
                defineField({ name: 'count', title: 'Count label', type: 'string', description: 'e.g. "6 Volumes"' }),
                defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
              ],
              preview: { select: { title: 'title', subtitle: 'count' } },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'sponsor',
      title: 'Sponsor',
      type: 'object',
      group: 'sponsor',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        str('disclosureHeading', 'Disclosure card heading'),
        txt('body', 'Disclosure text', undefined, 5),
        str('linkText', 'Link label'),
        str('linkHref', 'Link URL'),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'About' };
    },
  },
});
