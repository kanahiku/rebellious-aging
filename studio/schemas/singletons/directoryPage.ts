import { defineField, defineType } from 'sanity';
import { imageField, str, txt } from './_fields';

/**
 * /directory: page text and hero image around the business list.
 * The businesses themselves are separate "Directory business" documents.
 */
export const directoryPage = defineType({
  name: 'directoryPage',
  title: 'Directory Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'intro', title: 'Intro' },
  ],

  fields: [
    defineField({
      name: 'meta',
      title: 'SEO',
      type: 'seo',
      group: 'meta',
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        str('title', 'Title'),
        txt('subtitle', 'Subtitle'),
        imageField('image', 'Hero image', 'Wide photo behind the title. Wide crops work best.'),
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'object',
      group: 'intro',
      fields: [txt('lede', 'Line above the filters', 'Shown just above the Type and Location filters.')],
    }),
  ],

  preview: { prepare: () => ({ title: 'Directory Page' }) },
});
