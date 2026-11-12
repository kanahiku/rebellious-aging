import { defineField, defineType } from 'sanity';
import { requiredAlt } from '../../../lib/validation';

/** Image that cannot be published without alt text. Use this instead of a bare `image`. */
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the image for screen readers and search engines.',
      validation: requiredAlt,
    }),
  ],
});
