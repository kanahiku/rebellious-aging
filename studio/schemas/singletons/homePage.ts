import { defineField, defineType } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO / Meta' },
    { name: 'hero', title: 'Hero' },
    { name: 'statsBar', title: 'Stats Bar' },
    { name: 'whyInspect', title: 'Intro split' },
    { name: 'servicesSection', title: 'Services Section' },
    { name: 'faqs', title: 'FAQs' },
    { name: 'ctaBanner', title: 'CTA Banner' },
  ],

  fields: [
    // ── Meta ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'meta',
      title: 'SEO',
      type: 'object',
      group: 'meta',
      fields: [
        defineField({ name: 'title', title: 'Page Title', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'description', title: 'Meta Description', type: 'text', rows: 3, validation: (r) => r.required() }),
      ],
    }),

    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'titleLine1',
          title: 'Heading Line 1',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'titleLine2',
          title: 'Heading Line 2',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'subtitleParagraph1',
          title: 'Subtitle: Paragraph 1',
          type: 'text',
          rows: 3,
          validation: (r) => r.required(),
        }),
        defineField({ name: 'ctaText', title: 'CTA Button Label', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'ctaHref', title: 'CTA Button URL', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'phoneCtaText', title: 'Phone CTA Label', type: 'string' }),
        defineField({ name: 'phoneCtaHref', title: 'Phone CTA URL', type: 'string' }),
        defineField({
          name: 'heroImage',
          title: 'Desktop hero image',
          type: 'image',
          options: { hotspot: true },
          description:
            'Full-bleed overlay on tablet and desktop (768px and up). Landscape crop, hotspot on the subject.',
          fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
        }),
        defineField({
          name: 'heroImageUrl',
          title: 'Desktop hero image URL',
          type: 'url',
          description: 'Used as fallback if no desktop image is uploaded above.',
        }),
        defineField({
          name: 'heroImageMobile',
          title: 'Mobile hero image',
          type: 'image',
          options: { hotspot: true },
          description:
            'Full-bleed overlay on phones (below 768px). Use a tighter portrait crop. If empty, the desktop image is used.',
          fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
        }),
        defineField({
          name: 'heroImageMobileUrl',
          title: 'Mobile hero image URL',
          type: 'url',
          description: 'Used as fallback if no mobile image is uploaded above.',
        }),
      ],
    }),

    // ── Stats Bar ─────────────────────────────────────────────────────────────
    defineField({
      name: 'statsBar',
      title: 'Stats Bar',
      type: 'array',
      group: 'statsBar',
      of: [{ type: 'statItem' }],
      description: 'The 4 stats shown in the dark bar below the hero.',
    }),

    // ── Why Inspect ───────────────────────────────────────────────────────────
    defineField({
      name: 'whyInspect',
      title: 'Intro Split Section',
      type: 'object',
      group: 'whyInspect',
      fields: [
        defineField({ name: 'heading', title: 'Section Heading', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'paragraph1', title: 'Paragraph 1', type: 'text', rows: 4, validation: (r) => r.required() }),
        defineField({ name: 'paragraph2', title: 'Paragraph 2', type: 'text', rows: 4 }),
        defineField({ name: 'ctaText', title: 'CTA Label', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'ctaHref', title: 'CTA URL', type: 'string', validation: (r) => r.required() }),
        defineField({
          name: 'image',
          title: 'Section Image (upload)',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
        }),
        defineField({
          name: 'imageUrl',
          title: 'Section Image URL (paste a URL instead of uploading)',
          type: 'url',
          description: 'Used as fallback if no image is uploaded above. Image sits on the right.',
        }),
        defineField({
          name: 'imageAlt',
          title: 'Image Alt Text (when using a URL)',
          type: 'string',
        }),
      ],
    }),

    // ── Services Section ──────────────────────────────────────────────────────
    defineField({
      name: 'servicesSection',
      title: 'Services Section',
      type: 'object',
      group: 'servicesSection',
      fields: [
        defineField({ name: 'title', title: 'Section Title', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'subtitle', title: 'Section Subtitle', type: 'string' }),
        defineField({
          name: 'services',
          title: 'Services',
          type: 'array',
          of: [{ type: 'serviceItem' }],
          description: 'Add, remove, or reorder services. Each becomes a card.',
        }),
      ],
    }),

    // ── FAQs ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'faqs',
      title: 'FAQs Section',
      type: 'object',
      group: 'faqs',
      fields: [
        defineField({ name: 'title', title: 'Section Title', type: 'string', validation: (r) => r.required() }),
        defineField({
          name: 'items',
          title: 'Questions & Answers',
          type: 'array',
          of: [{ type: 'faqItem' }],
          description: 'Add, remove, or reorder FAQ items.',
        }),
      ],
    }),

    // ── CTA Banner ────────────────────────────────────────────────────────────
    defineField({
      name: 'ctaBanner',
      title: 'CTA Banner (Bottom of Page)',
      type: 'object',
      group: 'ctaBanner',
      fields: [
        defineField({ name: 'title', title: 'Heading', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3 }),
        defineField({ name: 'ctaText', title: 'CTA Label', type: 'string' }),
        defineField({ name: 'ctaHref', title: 'CTA URL', type: 'string' }),
        defineField({
          name: 'showAfterHoursNote',
          title: 'Show After-Hours Note?',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Home Page' };
    },
  },
});
