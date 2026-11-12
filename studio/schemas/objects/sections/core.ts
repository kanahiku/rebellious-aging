import { requiredAlt } from '../../../lib/validation';
import { defineField, defineType } from 'sanity';

export const linkedCard = defineType({
  name: 'linkedCard',
  title: 'Linked card',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'href', title: 'URL', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'linkText', title: 'Link label', type: 'string', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'href' } },
});

export const pageHero = defineType({
  name: 'pageHero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Heading', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'visualSubheading',
      title: 'Visual subheading',
      type: 'string',
      description: 'Optional line between the H1 and body copy. Leave empty to hide it.',
    }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({
      name: 'ctaText',
      title: 'Primary CTA label',
      type: 'string',
      description: 'Leave empty on informational pages (reviews, gallery) to hide the hero button.',
    }),
    defineField({ name: 'ctaHref', title: 'Primary CTA URL', type: 'string', initialValue: 'https://www.athenaclinic.com/contact/' }),
    defineField({ name: 'phoneCtaText', title: 'Phone CTA label', type: 'string', initialValue: 'Call Now' }),
    defineField({
      name: 'phoneCtaHref',
      title: 'Phone CTA URL',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Desktop hero image',
      type: 'image',
      options: { hotspot: true },
      description: 'Side image on tablet and desktop (768px and up).',
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: requiredAlt })],
    }),
    defineField({
      name: 'imageUrl',
      title: 'Desktop hero image URL',
      type: 'url',
      description: 'Used if no desktop image is uploaded. Leave empty to show the placeholder.',
    }),
    defineField({ name: 'imageAlt', title: 'Desktop image alt text (when using a URL)', type: 'string' }),
    defineField({
      name: 'imageMobile',
      title: 'Mobile hero image',
      type: 'image',
      options: { hotspot: true },
      description:
        'Stacked image on phones (below 768px). Use a tighter crop if the desktop photo is too wide. If empty, the desktop image is used.',
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: requiredAlt })],
    }),
    defineField({
      name: 'imageMobileUrl',
      title: 'Mobile hero image URL',
      type: 'url',
      description: 'Used if no mobile image is uploaded.',
    }),
    defineField({ name: 'imageMobileAlt', title: 'Mobile image alt text (when using a URL)', type: 'string' }),
    defineField({
      name: 'imagePlaceholder',
      title: 'Placeholder label',
      type: 'string',
      description: 'Shown when there is no hero image yet.',
    }),
  ],
});

export const ctaBanner = defineType({
  name: 'ctaBanner',
  title: 'CTA banner',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3 }),
    defineField({ name: 'ctaText', title: 'CTA label', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'CTA URL', type: 'string' }),
    defineField({
      name: 'showAfterHoursNote',
      title: 'Show after-hours note?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'extraLines',
      title: 'Extra contact lines',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Optional lines under the address (alternate phone, email, hours).',
    }),
    defineField({
      name: 'license',
      title: 'License line',
      type: 'string',
      description: 'e.g. Hawaii Contractor License C-33642',
    }),
  ],
});
