import { defineArrayMember, defineField, defineType } from 'sanity';

export const reviewsPage = defineType({
  name: 'reviewsPage',
  title: 'Reviews Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'liveReviews', title: 'Featured reviews' },
    { name: 'platforms', title: 'Review platforms' },
    { name: 'gallery', title: 'Gallery split' },
    { name: 'cta', title: 'CTA banner' },
  ],

  fields: [
    defineField({
      name: 'meta',
      title: 'SEO',
      type: 'object',
      group: 'meta',
      fields: [
        defineField({ name: 'title', title: 'Page title', type: 'string', validation: (r) => r.required() }),
        defineField({
          name: 'description',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'pageHero',
      group: 'hero',
      validation: (r) => r.required(),
      description: 'Leave the hero CTA empty. This is an informational page. Google and Yelp reviews are fetched live.',
    }),
    defineField({
      name: 'liveReviews',
      title: 'Featured reviews',
      type: 'object',
      group: 'liveReviews',
      description: 'Heading and intro only. Review cards are fetched live from Google and Yelp.',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'intro', title: 'Intro paragraph', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'platforms',
      title: 'Review platforms',
      type: 'object',
      group: 'platforms',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'intro', title: 'Intro paragraph', type: 'text', rows: 3 }),
        defineField({
          name: 'items',
          title: 'Platforms',
          type: 'array',
          of: [{ type: 'reviewPlatformItem' }],
          validation: (r) => r.min(1).max(4),
        }),
      ],
    }),
    defineField({
      name: 'gallerySection',
      title: 'Gallery split',
      type: 'object',
      group: 'gallery',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
        defineField({
          name: 'paragraphs',
          title: 'Paragraphs',
          type: 'array',
          of: [{ type: 'text' }],
          validation: (r) => r.min(1),
        }),
        defineField({ name: 'ctaText', title: 'CTA label', type: 'string' }),
        defineField({ name: 'ctaHref', title: 'CTA URL', type: 'string' }),
        defineField({
          name: 'previewImages',
          title: 'Preview images',
          type: 'array',
          description: 'Four photos in the 2×2 grid. Drag to reorder. Empty slots stay as placeholders.',
          of: [defineArrayMember({ type: 'previewImageItem' })],
          validation: (r) => r.max(4),
        }),
      ],
    }),
    defineField({
      name: 'ctaBanner',
      title: 'CTA banner',
      type: 'ctaBanner',
      group: 'cta',
      validation: (r) => r.required(),
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Reviews Page' };
    },
  },
});
