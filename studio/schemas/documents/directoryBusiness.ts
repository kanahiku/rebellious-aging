import { defineField, defineType } from 'sanity';
import { PinIcon } from '@sanity/icons';

/**
 * One business / group in the directory (`/directory` and `/directory/[slug]`).
 *
 * `types` and `location` are free text on purpose: the directory filters build
 * themselves from whatever values the businesses have. A new type or town is
 * just typed on a business — no code change. Optional fields hide when empty.
 */
export const directoryBusiness = defineType({
  name: 'directoryBusiness',
  title: 'Directory business',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      description: 'Becomes /directory/<slug>. Do not change after publishing.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 2,
      description: 'Shown on the list card only. One or two lines.',
      validation: (r) => r.required().max(240),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full description',
      type: 'text',
      rows: 8,
      description: 'Shown on the profile page only. Leave a blank line between paragraphs.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'types',
      title: 'Type',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description:
        'One or more, e.g. Exercise, Diet, Sleep. Not a fixed list — type a new one and it appears as a filter. Keep spelling consistent.',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'when',
      title: 'When',
      type: 'string',
      description: 'Plain text: "Every Thursday", "Tuesdays and Thursdays", "Every weekday", "By appointment".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'locations',
      title: 'Location (area)',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description:
        'One or more areas, e.g. Kailua, Honolulu, Island-wide, Online. Not a fixed list — type a new one and it appears as a filter. Keep spelling consistent.',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'where',
      title: 'Where',
      type: 'string',
      description: 'Text shown to the reader, e.g. "Kailua District Park".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'mapsUrl',
      title: 'Google Maps link',
      type: 'url',
      description:
        'Optional. The exact spot. Shows the map and the "Open in Google Maps" button; both hide when empty.',
      validation: (r) => r.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', description: 'Optional.' }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Optional. Shows a website button on the profile.',
      validation: (r) => r.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({ name: 'email', title: 'Email', type: 'string', description: 'Optional.' }),
    defineField({
      name: 'whoFor',
      title: 'Who it is for',
      type: 'string',
      description: 'Optional. e.g. "55+, all fitness levels".',
    }),
    defineField({
      name: 'notes',
      title: 'Good to know',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Optional short tags shown on the profile, e.g. Free, Insurance, Needs an order.',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Optional. Lower numbers appear first on the list; ties sort by name.',
    }),
    defineField({
      name: 'image',
      title: 'Photo or logo',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional. Profile page only.',
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
    { title: 'Name', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', locations: 'locations', types: 'types', media: 'image' },
    prepare({ title, locations, types, media }) {
      return {
        title,
        subtitle: [Array.isArray(types) ? types.join(', ') : '', Array.isArray(locations) ? locations.join(', ') : '']
          .filter(Boolean)
          .join(' · '),
        media,
      };
    },
  },
});
