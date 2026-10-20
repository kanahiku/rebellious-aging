import { defineArrayMember, defineField, defineType } from 'sanity';
import { paragraphs, seoFields, str, txt } from './_fields';

/**
 * Decade pages: /in-your-30s, /in-your-40s, /in-your-50s, /in-your-60s, /70-plus.
 * One schema, five fixed documents (ids `decade-30s` … `decade-70-plus`).
 *
 * NOT editable here (lives in code on purpose): the aging-curve graphic in the hero.
 * The extra section (doctor tests / Black Swan / staying home) only appears on the decade that has it.
 */
const onlyFor = (suffix: string) => ({ document }: { document?: { _id?: string } }) =>
  !String(document?._id ?? '').endsWith(suffix);

const rows = (name: string, title: string, memberName: string, hidden?: ReturnType<typeof onlyFor>) =>
  defineField({
    name,
    title,
    type: 'array',
    hidden,
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

export const decadePage = defineType({
  name: 'decadePage',
  title: 'Decade page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'whereYouAre', title: 'Where you are' },
    { name: 'fillFirst', title: 'What to fill first' },
    { name: 'extra', title: 'Extra section' },
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
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        txt('description', 'Description', undefined, 3),
        str('ctaText', 'Button label'),
        str('ctaHref', 'Button link'),
      ],
    }),

    defineField({
      name: 'whereYouAre',
      title: 'Where you are on the curve',
      type: 'object',
      group: 'whereYouAre',
      fields: [
        str('eyebrow', 'Left eyebrow'),
        paragraphs('paragraphs', 'Left paragraphs'),
        str('rightEyebrow', 'Right eyebrow'),
        rows('rows', 'Likely weakest links', 'weakLink'),
      ],
    }),

    defineField({
      name: 'fillFirst',
      title: 'What to fill first',
      type: 'object',
      group: 'fillFirst',
      fields: [
        str('eyebrow', 'Left eyebrow'),
        txt('text', 'Left text', undefined, 4),
        str('rightEyebrow', 'Right eyebrow'),
        rows('rows', 'At-home checks', 'homeCheck'),
        txt('note', 'Note under the table', undefined, 2),
      ],
    }),

    defineField({
      name: 'doctorTests',
      title: 'Ask your doctor (50s only)',
      type: 'object',
      group: 'extra',
      hidden: onlyFor('decade-50s'),
      fields: [
        str('eyebrow', 'Left eyebrow'),
        str('heading', 'Left heading'),
        txt('text', 'Left text', undefined, 3),
        str('rightEyebrow', 'Right eyebrow'),
        rows('rows', 'Doctor orders', 'doctorTest'),
      ],
    }),

    defineField({
      name: 'blackSwan',
      title: 'Black Swan band (60s only)',
      type: 'object',
      group: 'extra',
      hidden: onlyFor('decade-60s'),
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        paragraphs('paragraphs', 'Paragraphs'),
        str('ctaText', 'Button label'),
        str('ctaHref', 'Button link'),
      ],
    }),

    defineField({
      name: 'stayingHome',
      title: 'Staying in your home (70+ only)',
      type: 'object',
      group: 'extra',
      hidden: onlyFor('decade-70-plus'),
      fields: [
        str('heading', 'Heading'),
        str('lead', 'Lead line'),
        txt('body', 'Body', undefined, 3),
        str('source', 'Source label'),
        defineField({
          name: 'bullets',
          title: 'Checklist',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
        }),
      ],
    }),

    defineField({
      name: 'cta',
      title: 'Bottom banner',
      type: 'object',
      group: 'cta',
      fields: [
        str('title', 'Title'),
        txt('subtitle', 'Subtitle', undefined, 3),
        str('primaryText', 'Primary button label'),
        str('primaryHref', 'Primary button link'),
        str('secondaryText', 'Secondary button label'),
        str('secondaryHref', 'Secondary button link'),
      ],
    }),
  ],

  preview: {
    select: { title: 'hero.heading' },
    prepare: ({ title }) => ({ title: title ?? 'Decade page' }),
  },
});
