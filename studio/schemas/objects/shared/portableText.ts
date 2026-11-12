import { defineArrayMember, defineType } from 'sanity';

/** Rich text with headings, lists, links and images (alt text enforced). */
export const portableText = defineType({
  name: 'portableText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bulleted', value: 'bullet' }, { title: 'Numbered', value: 'number' }],
      marks: {
        decorators: [{ title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' }],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [{ name: 'href', type: 'url', title: 'URL', validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }) }],
          },
        ],
      },
    }),
    defineArrayMember({ type: 'imageWithAlt' }),
  ],
});
