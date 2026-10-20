import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * /how-aging-works — every editable string and image on the page.
 *
 * NOT editable here (lives in code on purpose):
 *   - the three-bucket diagram (ThreeBuckets); only its intro text is editable
 *   - the "Your aging curve" chart section (AgingCurve): SVG chart, its legend and its four Peak/Slope/Floor/Reserve cards
 */

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

const str = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'string', description });

const txt = (name: string, title: string, description?: string, rows = 3) =>
  defineField({ name, title, type: 'text', rows, description });

const paragraphs = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [defineArrayMember({ type: 'text', rows: 4 })],
    description: 'One item per paragraph.',
  });

export const howAgingWorksPage = defineType({
  name: 'howAgingWorksPage',
  title: 'How Aging Works (The Buckets)',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'intro', title: 'Intro + concept cards' },
    { name: 'buckets', title: 'Three buckets' },
    { name: 'blackSwan', title: 'Black Swan' },
    { name: 'bucketThree', title: 'Bucket 3' },
    { name: 'decades', title: 'Decades' },
    { name: 'weStop', title: 'And then we stop' },
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
        defineField({
          name: 'words',
          title: 'Hero words',
          type: 'array',
          description: 'Shown over the photo, left / centre / right. Keep three.',
          validation: (r) => r.max(3),
          of: [
            defineArrayMember({
              type: 'object',
              name: 'heroWord',
              fields: [
                defineField({ name: 'text', title: 'Word', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'italic', title: 'Italic', type: 'boolean', initialValue: false }),
                defineField({
                  name: 'align',
                  title: 'Vertical position',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Top', value: 'start' },
                      { title: 'Middle', value: 'center' },
                      { title: 'Bottom', value: 'end' },
                    ],
                    layout: 'radio',
                  },
                  initialValue: 'start',
                }),
              ],
              preview: { select: { title: 'text', subtitle: 'align' } },
            }),
          ],
        }),
        imageField('image', 'Hero image', 'Full-width photo behind the words (about 2160 × 869).'),
        imageField('imageMobile', 'Mobile hero image', 'Optional phone crop. Leave empty to reuse the desktop image.'),
      ],
    }),

    defineField({
      name: 'intro',
      title: 'Intro + concept cards',
      type: 'object',
      group: 'intro',
      fields: [
        txt('heading', 'Heading'),
        paragraphs('body', 'Body paragraphs'),
        str('ctaText', 'Button label'),
        str('ctaHref', 'Button link'),
        defineField({
          name: 'cards',
          title: 'Concept cards',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'conceptCard',
              fields: [
                defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'description', title: 'Description', type: 'text', rows: 5 }),
              ],
              preview: { select: { title: 'title', subtitle: 'label' } },
            }),
          ],
        }),
        imageField('image', 'Chart image', 'Function-vs-age chart (about 1695 × 928).'),
      ],
    }),

    defineField({
      name: 'buckets',
      title: 'Three buckets — intro',
      type: 'object',
      group: 'buckets',
      description: 'Intro text only. The three-bucket diagram below it is fixed in code.',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        txt('body', 'Body', undefined, 4),
        str('ctaText', 'Button label'),
        str('ctaHref', 'Button link'),
      ],
    }),

    defineField({
      name: 'blackSwan',
      title: 'Black Swan band (dark)',
      type: 'object',
      group: 'blackSwan',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        paragraphs('paragraphs', 'Paragraphs'),
        str('ctaText', 'Button label'),
        str('ctaHref', 'Button link'),
      ],
    }),

    defineField({
      name: 'bucketThree',
      title: 'Bucket 3 band',
      type: 'object',
      group: 'bucketThree',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        paragraphs('paragraphs', 'Paragraphs'),
        str('boldNote', 'Bold closing line'),
      ],
    }),

    defineField({
      name: 'decades',
      title: 'Start with your decade',
      type: 'object',
      group: 'decades',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        defineField({
          name: 'cards',
          title: 'Cards',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'howDecadeCard',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'body', title: 'Body', type: 'string' }),
                defineField({ name: 'href', title: 'Link URL', type: 'string', validation: (r) => r.required() }),
              ],
              preview: { select: { title: 'title', subtitle: 'body' } },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'weStop',
      title: 'And then we stop',
      type: 'object',
      group: 'weStop',
      fields: [
        str('heading', 'Heading'),
        paragraphs('body', 'Body paragraphs'),
        imageField('image', 'Image', 'About 852 × 568.'),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'How Aging Works (The Buckets)' };
    },
  },
});
