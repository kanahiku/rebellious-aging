import { defineArrayMember, defineField, defineType } from 'sanity';
import { DocumentsIcon } from '@sanity/icons';

export const book = defineType({
  name: 'book',
  title: 'Book',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used as the in-page anchor on /books (e.g. /books#book-hair).',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Cover image',
      type: 'image',
      description: 'Used for the small cover grid and the large guidebook cards.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (r) => r.required().warning('Describe the cover for accessibility.'),
        }),
      ],
    }),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      validation: (r) => r.min(2).max(4).required(),
    }),
    defineField({
      name: 'publisher',
      title: 'Publish details',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Publisher name',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'year',
          title: 'Year',
          type: 'number',
          validation: (r) => r.required().integer().min(1900).max(2100),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'ctas',
      title: 'Buy links',
      type: 'array',
      description: 'Exactly two CTAs (e.g. eBook and paperback).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'bookCta',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              validation: (r) =>
                r.required().uri({ scheme: ['http', 'https'], allowRelative: true }),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        }),
      ],
      validation: (r) => r.min(2).max(2).required(),
    }),
    defineField({
      name: 'podcastHref',
      title: 'Related podcast',
      type: 'string',
      description: 'Deep-link to the matching episode on the podcast page. Use the episode slug as the anchor: e.g. /podcast#hair-scalp (where "hair-scalp" is the episode slug).',
      validation: (r) =>
        r.uri({ scheme: ['http', 'https'], allowRelative: true }),
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'string',
      options: {
        list: [
          { title: 'Textbook Series', value: 'textbook' },
          { title: 'Rebellious Aging Guidebook Series', value: 'guidebook' },
          { title: 'Bargaining with Aging Series', value: 'bargaining' },
        ],
        layout: 'radio',
      },
      initialValue: 'guidebook',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 0,
      validation: (r) => r.integer(),
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
      series: 'series',
    },
    prepare({ title, subtitle, media, series }) {
      return {
        title: title || 'Untitled book',
        subtitle: [series, subtitle].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
