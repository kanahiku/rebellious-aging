import { requiredAlt } from '../../../lib/validation';
import { defineField, defineType } from 'sanity';
import { headingField, introField, surfaceField } from './shared-fields';

export const splitContentSection = defineType({
  name: 'splitContentSection',
  title: 'Split content (text + image)',
  type: 'object',
  fields: [
    surfaceField,
    headingField,
    defineField({
      name: 'isReversed',
      title: 'Image on the left',
      type: 'boolean',
      initialValue: false,
      description: 'Match Figma. Default is image on the right.',
    }),
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
      name: 'linkText',
      title: 'Text link label',
      type: 'string',
      description: 'Optional text link under the paragraphs (in addition to the CTA button).',
    }),
    defineField({ name: 'linkHref', title: 'Text link URL', type: 'string' }),
    defineField({
      name: 'image',
      title: 'Side image (upload)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: requiredAlt })],
    }),
    defineField({
      name: 'imageUrl',
      title: 'Side image URL',
      type: 'url',
      description: 'Used if no image is uploaded. Leave empty to show the placeholder.',
    }),
    defineField({ name: 'imageAlt', title: 'Image alt text (when using a URL)', type: 'string' }),
    defineField({
      name: 'imagePlaceholder',
      title: 'Placeholder label',
      type: 'string',
      description: 'Shown when there is no side image yet.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Split content', subtitle: 'Heading + paragraphs + side image' };
    },
  },
});

export const quoteCardItem = defineType({
  name: 'quoteCardItem',
  title: 'Quote card',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'name' } },
});

export const quoteCardsSection = defineType({
  name: 'quoteCardsSection',
  title: 'Quote cards',
  type: 'object',
  fields: [
    surfaceField,
    headingField,
    introField,
    defineField({
      name: 'items',
      title: 'Quotes',
      type: 'array',
      of: [{ type: 'quoteCardItem' }],
      validation: (r) => r.min(1).max(4),
    }),
  ],
  preview: {
    select: { title: 'heading', n: 'items' },
    prepare({ title, n }) {
      const count = Array.isArray(n) ? n.length : 0;
      return { title: title || 'Quote cards', subtitle: `${count} quote${count === 1 ? '' : 's'}` };
    },
  },
});

export const faqsSection = defineType({
  name: 'faqsSection',
  title: 'FAQs',
  type: 'object',
  description: 'Page-level FAQ block. Not mixed into body sections.',
  fields: [
    defineField({ name: 'title', title: 'Section title', type: 'string', initialValue: 'Frequently Asked Questions' }),
    defineField({
      name: 'items',
      title: 'Questions & answers',
      type: 'array',
      of: [{ type: 'faqItem' }],
    }),
  ],
  preview: {
    select: { title: 'title', n: 'items' },
    prepare({ title, n }) {
      const count = Array.isArray(n) ? n.length : 0;
      return { title: title || 'FAQs', subtitle: `${count} question${count === 1 ? '' : 's'}` };
    },
  },
});
