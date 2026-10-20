import { defineField, defineType } from 'sanity';
import { imageField } from './_fields';

export const siteFooter = defineType({
  name: 'siteFooter',
  title: 'Footer',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline (under the logo)',
      type: 'string',
    }),
    imageField('backgroundImage', 'Background photo', 'Full-width photo behind the footer on every page. Decorative, so no alt text is shown.'),
    defineField({
      name: 'cta',
      title: 'Assessment card (top of footer)',
      description: 'The coloured card above the links on every page.',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({
          name: 'title',
          title: 'Heading',
          type: 'text',
          rows: 2,
          description: 'Use a new line for a line break.',
        }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
        defineField({ name: 'buttonLabel', title: 'Button label', type: 'string' }),
        defineField({ name: 'buttonHref', title: 'Button URL', type: 'string' }),
      ],
    }),
    defineField({
      name: 'columns',
      title: 'Link Columns',
      description: 'Each column has a heading and a list of links.',
      type: 'array',
      of: [{ type: 'footerColumn' }],
    }),
    defineField({
      name: 'secondaryLinks',
      title: 'Bottom Links (Privacy Policy, Terms of Service)',
      type: 'array',
      of: [{ type: 'footerLink' }],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [{ type: 'socialLink' }],
    }),
    defineField({
      name: 'footNote',
      title: 'Footer Note (copyright)',
      type: 'string',
      description: 'e.g. © 2026 Rebellious Aging. All rights reserved.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Footer' };
    },
  },
});
