import { defineArrayMember, defineField, defineType } from 'sanity';
import { seoFields, str, txt } from './_fields';

/** /athena-evaluation: every editable string on the page (no images on this page). */
const pairList = (name: string, title: string, memberName: string, first: [string, string], second: [string, string], max?: number) =>
  defineField({
    name,
    title,
    type: 'array',
    validation: max ? (r) => r.max(max) : undefined,
    of: [
      defineArrayMember({
        type: 'object',
        name: memberName,
        fields: [
          defineField({ name: first[0], title: first[1], type: 'string', validation: (r) => r.required() }),
          defineField({ name: second[0], title: second[1], type: 'text', rows: 3 }),
        ],
        preview: { select: { title: first[0] } },
      }),
    ],
  });

export const athenaEvaluationPage = defineType({
  name: 'athenaEvaluationPage',
  title: 'Athena Evaluation',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'overview', title: 'What it is' },
    { name: 'pricing', title: 'Pricing' },
    { name: 'booking', title: 'Own doctor + booking' },
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
        str('title', 'Title'),
        txt('subtitle', 'Subtitle', undefined, 3),
        str('ctaText', 'Button label'),
        str('ctaHref', 'Button link', 'Opens in a new tab.'),
      ],
    }),

    defineField({
      name: 'overview',
      title: 'What it is',
      type: 'object',
      group: 'overview',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        txt('intro', 'Intro', undefined, 4),
        str('itemsEyebrow', 'Included-items eyebrow'),
        pairList('items', 'What is included', 'includedItem', ['title', 'Title'], ['body', 'Text']),
      ],
    }),

    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'object',
      group: 'pricing',
      fields: [
        str('priceEyebrow', 'Price eyebrow'),
        str('price', 'Price', 'e.g. $999'),
        str('priceNote', 'Price note'),
        str('afterEyebrow', 'After-evaluation eyebrow'),
        txt('afterText', 'After-evaluation text', undefined, 3),
        defineField({
          name: 'tiers',
          title: 'Support tiers',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'tier',
              fields: [
                defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'price', title: 'Price', type: 'string' }),
              ],
              preview: { select: { title: 'label', subtitle: 'price' } },
            }),
          ],
        }),
        str('perLabel', 'Text after each tier price', 'e.g. "/ month"'),
      ],
    }),

    defineField({
      name: 'booking',
      title: 'Own doctor + booking',
      type: 'object',
      group: 'booking',
      fields: [
        str('heading', 'Heading'),
        txt('body', 'Body', undefined, 4),
        str('listLinkText', 'List link label'),
        str('listLinkHref', 'List link URL'),
        str('disclosureEyebrow', 'Disclosure eyebrow'),
        txt('disclosureText', 'Disclosure text', undefined, 3),
        str('ctaText', 'Button label'),
        str('ctaHref', 'Button link', 'Opens in a new tab.'),
        str('note', 'Note under the button'),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Athena Evaluation' };
    },
  },
});
