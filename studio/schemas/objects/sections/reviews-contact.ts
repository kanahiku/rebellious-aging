import { requiredAlt } from '../../../lib/validation';
import { defineField, defineType } from 'sanity';
import { headingField, introField, surfaceField } from './shared-fields';

export const yelpReviewItem = defineType({
  name: 'yelpReviewItem',
  title: 'Yelp review',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Reviewer name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'reviewId', title: 'Yelp review ID', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'userId', title: 'Yelp user ID', type: 'string', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'name', subtitle: 'reviewId' } },
});

export const yelpReviewsSection = defineType({
  name: 'yelpReviewsSection',
  title: 'Yelp reviews (live)',
  type: 'object',
  description:
    'Shows the latest Yelp reviews (up to 3) from the API. Saved review IDs are ignored. Prefer “Live reviews” to mix Google and Yelp.',
  fields: [
    surfaceField,
    headingField,
    introField,
    defineField({
      name: 'items',
      title: 'Reviews (unused)',
      type: 'array',
      hidden: true,
      of: [{ type: 'yelpReviewItem' }],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Yelp reviews', subtitle: 'Live Yelp feed (max 3)' };
    },
  },
});

export const liveReviewsSection = defineType({
  name: 'liveReviewsSection',
  title: 'Live reviews',
  type: 'object',
  description:
    'Latest Google (up to 3 shown of 5 fetched) and/or Yelp (up to 3) reviews, with View all links to each platform.',
  fields: [
    surfaceField,
    headingField,
    introField,
    defineField({
      name: 'sources',
      title: 'Sources',
      type: 'string',
      options: {
        list: [
          { title: 'Google + Yelp', value: 'both' },
          { title: 'Google only', value: 'google' },
          { title: 'Yelp only', value: 'yelp' },
        ],
        layout: 'radio',
      },
      initialValue: 'both',
    }),
  ],
  preview: {
    select: { title: 'heading', sources: 'sources' },
    prepare({ title, sources }) {
      const label = sources === 'google' ? 'Google' : sources === 'yelp' ? 'Yelp' : 'Google + Yelp';
      return { title: title || 'Live reviews', subtitle: label };
    },
  },
});

export const formHelpOption = defineType({
  name: 'formHelpOption',
  title: 'Form help option',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'value' } },
});

export const contactLink = defineType({
  name: 'contactLink',
  title: 'Contact link',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'href', title: 'URL', type: 'string', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'text', subtitle: 'href' } },
});

export const reviewPlatformItem = defineType({
  name: 'reviewPlatformItem',
  title: 'Review platform',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'ratingNote', title: 'Description', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'href', title: 'URL', type: 'url', validation: (r) => r.required() }),
    defineField({ name: 'linkText', title: 'Button label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Tabler icon name, e.g. tabler:brand-google',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'href' } },
});

export const previewImageItem = defineType({
  name: 'previewImageItem',
  title: 'Preview image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image (upload)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: requiredAlt })],
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL',
      type: 'url',
      description: 'Used if no image is uploaded.',
    }),
    defineField({ name: 'imageAlt', title: 'Alt text (when using a URL)', type: 'string' }),
  ],
  preview: {
    select: { media: 'image', title: 'image.alt', url: 'imageUrl' },
    prepare({ media, title, url }) {
      return { title: title || url || 'Preview image', media };
    },
  },
});
