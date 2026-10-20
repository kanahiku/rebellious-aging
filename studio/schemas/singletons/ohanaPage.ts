import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageField, paragraphs, seoFields, str, txt } from './_fields';

/**
 * /ohana — every editable string and image on the page.
 *
 * Fixed in code on purpose:
 *   - section order and layout
 *   - the two "alone / together" cards keep their dark / outlined styling by position
 *   - the join form's field labels and submit behaviour
 *   - testimonials come from the Testimonial documents, not from this page
 *
 * In headings, wrap words in **double asterisks** to highlight them.
 */
const itemList = (name: string, title: string, memberName: string, fields: ReturnType<typeof defineField>[], previewTitle: string, max?: number) =>
  defineField({
    name,
    title,
    type: 'array',
    validation: max ? (r) => r.max(max) : undefined,
    of: [
      defineArrayMember({
        type: 'object',
        name: memberName,
        fields,
        preview: { select: { title: previewTitle } },
      }),
    ],
  });

export const ohanaPage = defineType({
  name: 'ohanaPage',
  title: 'The Ohana',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'intro', title: 'Intro + stats' },
    { name: 'loneliness', title: 'Loneliness' },
    { name: 'blueZones', title: 'Blue Zones cards' },
    { name: 'moai', title: 'Moai + adherence' },
    { name: 'activities', title: 'Activities' },
    { name: 'purpose', title: 'Purpose' },
    { name: 'community', title: 'Testimonials + join' },
    { name: 'comeHome', title: 'Come home' },
  ],

  fields: [
    defineField({
      name: 'meta',
      title: 'SEO',
      type: 'object',
      group: 'meta',
      fields: seoFields('The site name is appended automatically.'),
    }),

    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        str('title', 'Title'),
        imageField('image', 'Hero image', 'Wide photo behind the title.'),
        imageField('imageMobile', 'Mobile hero image', 'Optional phone crop. Leave empty to reuse the desktop image.'),
      ],
    }),

    defineField({
      name: 'intro',
      title: 'Intro + stats',
      type: 'object',
      group: 'intro',
      fields: [
        str('heading', 'Heading'),
        txt('body', 'Body', undefined, 5),
        str('ctaText', 'Link label'),
        str('ctaHref', 'Link URL', 'Use #join to jump to the form.'),
        itemList(
          'stats',
          'Stats (3)',
          'stat',
          [
            defineField({ name: 'number', title: 'Number', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
          'number',
          3
        ),
      ],
    }),

    defineField({
      name: 'loneliness',
      title: 'Loneliness',
      type: 'object',
      group: 'loneliness',
      fields: [
        str('heading', 'Heading'),
        str('pullQuote', 'Pull quote'),
        paragraphs('body', 'Body paragraphs', 'Left column. One item per paragraph.', 6),
        paragraphs('caption', 'Right column paragraphs', 'One item per paragraph.', 6),
        imageField('image', 'Wide image', 'Full-bleed band under the text (about 1440 × 511).'),
      ],
    }),

    defineField({
      name: 'blueZones',
      title: 'Blue Zones cards',
      type: 'object',
      group: 'blueZones',
      fields: [
        itemList(
          'cards',
          'Cards (3)',
          'blueZoneCard',
          [
            defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
            defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
            imageField('image', 'Image', 'About 3:2 (378 × 252).'),
          ],
          'heading',
          3
        ),
        txt('footerNote', 'Footer note', undefined, 2),
      ],
    }),

    defineField({
      name: 'moai',
      title: 'Moai + adherence',
      type: 'object',
      group: 'moai',
      fields: [
        str('moaiHeading', 'Moai heading', 'Wrap words in **double asterisks** to highlight them.'),
        paragraphs('moaiBody', 'Moai paragraphs'),
        str('adherenceHeading', 'Adherence heading', 'Wrap words in **double asterisks** to highlight them.'),
        paragraphs('adherenceBody', 'Adherence paragraphs'),
        itemList(
          'duoCards',
          'Alone / together cards (2, in this order: alone, together)',
          'duoCard',
          [
            defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
            defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
          ],
          'heading',
          2
        ),
      ],
    }),

    defineField({
      name: 'activities',
      title: 'Activities',
      type: 'object',
      group: 'activities',
      fields: [
        str('heading', 'Heading'),
        txt('subtitle', 'Subtitle', undefined, 3),
        itemList(
          'items',
          'Activities (4)',
          'activity',
          [
            defineField({ name: 'frequency', title: 'Frequency', type: 'string', description: 'e.g. Weekly' }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
          ],
          'title'
        ),
        imageField('image', 'Image', 'About 568 × 368.'),
      ],
    }),

    defineField({
      name: 'purpose',
      title: 'Purpose',
      type: 'object',
      group: 'purpose',
      fields: [
        imageField('image', 'Background photo', 'Full-bleed photo behind both cards.'),
        str('heading', 'Purpose card heading'),
        paragraphs('body', 'Purpose card paragraphs'),
        str('noChapterHeading', '"No chapter" heading'),
        paragraphs('noChapterBody', '"No chapter" paragraphs'),
        str('noChapterLinkText', '"No chapter" link label'),
        str('noChapterLinkHref', '"No chapter" link URL', 'Use #join to jump to the form.'),
      ],
    }),

    defineField({
      name: 'community',
      title: 'Testimonials + join form',
      type: 'object',
      group: 'community',
      description: 'The testimonials themselves are managed under Testimonials.',
      fields: [
        str('testimonialsEyebrow', 'Testimonials eyebrow'),
        str('testimonialsHeading', 'Testimonials heading'),
        str('joinEyebrow', 'Join form eyebrow'),
        str('joinHeading', 'Join form heading'),
        txt('joinDescription', 'Join form description', undefined, 3),
      ],
    }),

    defineField({
      name: 'comeHome',
      title: 'Come home',
      type: 'object',
      group: 'comeHome',
      fields: [
        str('heading', 'Heading'),
        txt('body', 'Body', undefined, 4),
        str('primaryText', 'Primary button label'),
        str('primaryHref', 'Primary button link', 'Opens in a new tab.'),
        str('secondaryText', 'Secondary button label'),
        str('secondaryHref', 'Secondary button link'),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'The Ohana' };
    },
  },
});
