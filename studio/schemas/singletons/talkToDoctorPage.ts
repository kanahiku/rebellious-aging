import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * /talk-to-your-doctor — every editable string and image on the page.
 *
 * NOT editable here (lives in code on purpose):
 *   - the two icons beside the advice rows (matched by position: 1 capsule, 2 document)
 */

const str = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'string', description });

const txt = (name: string, title: string, description?: string, rows = 3) =>
  defineField({ name, title, type: 'text', rows, description });

const imageField = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    description,
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt Text',
        type: 'string',
        validation: (r) => r.required().warning('Alt text helps accessibility and SEO.'),
      }),
    ],
  });

const tableRows = (name: string, title: string, memberName: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        name: memberName,
        fields: [
          defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'description', title: 'Description', type: 'string' }),
        ],
        preview: { select: { title: 'name', subtitle: 'description' } },
      }),
    ],
  });

export const talkToDoctorPage = defineType({
  name: 'talkToDoctorPage',
  title: 'Talk to Your Doctor',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'measurement', title: 'What to measure' },
    { name: 'advice', title: 'Advice + disclosure' },
    { name: 'getMeasured', title: 'Get it measured' },
  ],

  fields: [
    defineField({
      name: 'meta',
      title: 'SEO',
      type: 'object',
      group: 'meta',
      fields: [
        defineField({
          name: 'title',
          title: 'Page title',
          type: 'string',
          description: 'Used as-is in the browser tab, include the site name.',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'description',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          validation: (r) => r.required().max(200),
        }),
      ],
    }),

    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        txt('title', 'Title', 'A line break becomes a visual line break.', 2),
        txt('subtitle', 'Subtitle', undefined, 4),
        imageField('image', 'Hero image', 'Wide photo behind the title (about 1800 × 600).'),
        imageField('imageMobile', 'Mobile hero image', 'Optional phone crop. Leave empty to reuse the desktop image.'),
      ],
    }),

    defineField({
      name: 'measurement',
      title: 'What to measure',
      type: 'object',
      group: 'measurement',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        txt('body', 'Body', undefined, 4),
        str('leftHeading', 'Left column heading'),
        tableRows('leftRows', 'Left column rows', 'homeMeasure'),
        str('rightHeading', 'Right column heading'),
        tableRows('rightRows', 'Right column rows', 'doctorMeasure'),
      ],
    }),

    defineField({
      name: 'advice',
      title: 'Advice rows + disclosure',
      type: 'object',
      group: 'advice',
      description: 'Row icons are fixed in code and matched by position: 1 capsule, 2 document.',
      fields: [
        defineField({
          name: 'items',
          title: 'Advice rows (keep 2, in this order)',
          type: 'array',
          validation: (r) => r.max(2),
          of: [
            defineArrayMember({
              type: 'object',
              name: 'adviceRow',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'body', title: 'Body', type: 'text', rows: 6 }),
              ],
              preview: { select: { title: 'title' } },
            }),
          ],
        }),
        txt('disclosure', 'Disclosure text', undefined, 5),
      ],
    }),

    defineField({
      name: 'getMeasured',
      title: 'Get it measured band',
      type: 'object',
      group: 'getMeasured',
      fields: [
        str('heading', 'Heading'),
        defineField({
          name: 'paragraphs',
          title: 'Paragraphs',
          type: 'array',
          of: [defineArrayMember({ type: 'text', rows: 4 })],
          description: 'One item per paragraph.',
        }),
        str('ctaText', 'Button label'),
        str('ctaHref', 'Button link'),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Talk to Your Doctor' };
    },
  },
});
