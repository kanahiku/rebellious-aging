import { defineField, defineType } from 'sanity';
import { imageField, seoFields, str, txt } from './_fields';

/**
 * /podcast: page text around the episode list. Episodes are separate "Podcast Episodes" documents;
 * part names and descriptions come from the episodes themselves.
 */
export const podcastPage = defineType({
  name: 'podcastPage',
  title: 'Podcast Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'roadmap', title: 'Roadmap block' },
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
      fields: [str('title', 'Title'), txt('subtitle', 'Subtitle', undefined, 6), imageField('image', 'Hero image')],
    }),
    defineField({
      name: 'roadmap',
      title: 'Roadmap block',
      type: 'object',
      group: 'roadmap',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        txt('description', 'Description'),
        str('spotifyLabel', 'Spotify button label'),
        str('youtubeLabel', 'YouTube button label'),
        str('episodeCtaText', 'Episode card button label'),
      ],
    }),
  ],

  preview: { prepare: () => ({ title: 'Podcast Page' }) },
});
