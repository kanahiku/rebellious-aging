import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageField, paragraphs, seoFields, str, txt } from './_fields';

/**
 * /four-pillars: every editable string and image on the page.
 * Not editable here (lives in code): the four card icons, matched by position
 * (1 diet, 2 exercise, 3 sleep, 4 social connection).
 */
export const fourPillarsPage = defineType({
  name: 'fourPillarsPage',
  title: 'The Basics (Four Pillars)',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'cards', title: 'Pillar cards' },
    { name: 'leftOut', title: 'What it leaves out' },
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
      name: 'cards',
      title: 'Pillar cards (keep 4, in this order: diet, exercise, sleep, social)',
      type: 'array',
      group: 'cards',
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pillarCard',
          fields: [
            str('preLabel', 'Small label above'),
            str('label', 'Label'),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
            txt('description', 'Description', undefined, 5),
            str('linkText', 'Link label', 'Optional.'),
            str('linkHref', 'Link URL'),
          ],
          preview: { select: { title: 'label', subtitle: 'title' } },
        }),
      ],
    }),

    defineField({
      name: 'leftOut',
      title: 'What the framework leaves out',
      type: 'object',
      group: 'leftOut',
      fields: [str('heading', 'Heading'), paragraphs('paragraphs', 'Paragraphs')],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'The Basics (Four Pillars)' };
    },
  },
});
