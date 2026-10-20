import { defineArrayMember, defineField, defineType } from 'sanity';
import { seoFields, str } from './_fields';

/**
 * Legal pages: /privacy-policy and /terms-of-service.
 * One schema, two fixed documents (`legal-privacy-policy`, `legal-terms-of-service`).
 *
 * Text markup:
 *   **bold lead-in**         bold text
 *   [label](/some-page)      link (also works with mailto: and https:)
 *   {{dba}} {{host}} {{entity}} {{legalName}} {{analytics}} {{governingState}} {{governingCounty}}
 *                            filled in automatically from the site config
 *   a line break             becomes a line break
 *
 * Not editable here (lives in code): the address block in the final "Contact" section,
 * which is built from the site contact config.
 */
export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'body', title: 'Sections' },
  ],

  fields: [
    defineField({
      name: 'meta',
      title: 'SEO',
      type: 'object',
      group: 'meta',
      description: 'You can use {{dba}} (site name) and {{host}} (domain) here.',
      fields: seoFields('Used as-is in the browser tab, include the site name.'),
    }),

    str('title', 'Page title (shown big at the top)'),

    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'body',
      description: 'In order. Numbering is part of the heading text, e.g. "3. Information we collect".',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'legalSection',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'blocks',
              title: 'Content',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'paragraph',
                  title: 'Paragraph',
                  fields: [defineField({ name: 'text', title: 'Text', type: 'text', rows: 5 })],
                  preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title, subtitle: 'Paragraph' }) },
                }),
                defineArrayMember({
                  type: 'object',
                  name: 'list',
                  title: 'Bullet list',
                  fields: [
                    defineField({
                      name: 'items',
                      title: 'Items',
                      type: 'array',
                      of: [defineArrayMember({ type: 'text', rows: 2 })],
                    }),
                  ],
                  preview: {
                    select: { items: 'items' },
                    prepare: ({ items }) => ({ title: (items?.[0] as string) ?? 'List', subtitle: `Bullet list (${items?.length ?? 0})` }),
                  },
                }),
                defineArrayMember({
                  type: 'object',
                  name: 'contact',
                  title: 'Contact address block',
                  description: 'Intro line only. The address itself comes from the site contact config.',
                  fields: [defineField({ name: 'text', title: 'Intro line', type: 'string' })],
                  preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title, subtitle: 'Contact block' }) },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'heading' } },
        }),
      ],
    }),
  ],

  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title ?? 'Legal page' }),
  },
});
