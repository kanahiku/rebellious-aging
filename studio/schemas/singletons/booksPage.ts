import { defineField, defineType } from 'sanity';
import { imageField, seoFields, str, txt } from './_fields';

/**
 * /books: page text around the book list. The books themselves are separate "Books" documents.
 * The jump-tab links, section order and series assignment are fixed in code.
 */
const seriesIntro = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    options: { collapsible: true, collapsed: false },
    fields: [str('eyebrow', 'Eyebrow'), str('heading', 'Heading'), txt('description', 'Description')],
  });

export const booksPage = defineType({
  name: 'booksPage',
  title: 'Books Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'tabs', title: 'Jump tabs' },
    { name: 'series', title: 'Series intros' },
  ],

  fields: [
    defineField({
      name: 'meta',
      title: 'SEO',
      type: 'object',
      group: 'meta',
      fields: seoFields('Used as-is in the browser tab, include the site name.'),
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        txt('title', 'Title', 'A line break becomes a visual line break.', 2),
        txt('subtitle', 'Subtitle'),
        imageField('image', 'Hero image'),
      ],
    }),
    defineField({
      name: 'tabs',
      title: 'Jump-tab labels',
      type: 'object',
      group: 'tabs',
      description: 'Labels only. Where each tab links to is fixed.',
      fields: [
        str('textbook', 'Textbook series tab'),
        str('guidebook', 'Guidebook series tab'),
        str('bargaining', 'Bargaining series tab'),
        str('podcast', 'Podcast tab (links to /podcast)'),
      ],
    }),
    defineField({
      name: 'series',
      title: 'Series intros',
      type: 'object',
      group: 'series',
      fields: [
        seriesIntro('textbook', 'Textbook series'),
        seriesIntro('guidebook', 'Guidebook series'),
        seriesIntro('bargaining', 'Bargaining series'),
        str('podcastLinkLabel', 'Podcast link label (on book cards that have an episode)'),
      ],
    }),
  ],

  preview: { prepare: () => ({ title: 'Books Page' }) },
});
