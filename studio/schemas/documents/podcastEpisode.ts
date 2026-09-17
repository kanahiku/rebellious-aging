import { defineArrayMember, defineField, defineType } from 'sanity';
import { PlayIcon } from '@sanity/icons';

export const podcastEpisode = defineType({
  name: 'podcastEpisode',
  title: 'Podcast Episode',
  type: 'document',
  icon: PlayIcon,

  groups: [
    { name: 'meta', title: 'Episode' },
    { name: 'part', title: 'Series Part' },
    { name: 'links', title: 'Links' },
  ],

  fields: [
    // ── Episode identity ──────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'meta',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'meta',
      description: 'Used as the page anchor — e.g. slug "hair-scalp" → /podcast#hair-scalp. Books link here using this exact value.',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Live Now', value: 'live' },
          { title: 'Coming Soon', value: 'coming-soon' },
        ],
        layout: 'radio',
      },
      initialValue: 'coming-soon',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'meta',
      rows: 3,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      group: 'meta',
      description: 'Global ordering across all parts (1–28).',
      initialValue: 1,
      validation: (r) => r.required().integer().min(1).max(28),
    }),

    // ── Series part ───────────────────────────────────────────────────────────
    defineField({
      name: 'part',
      title: 'Part number',
      type: 'number',
      group: 'part',
      description: '1 = Head & Senses, 2 = Core & Vital, 3 = Structural, 4 = Reproductive, 5 = Cellular.',
      validation: (r) => r.required().integer().min(1).max(5),
    }),
    defineField({
      name: 'partName',
      title: 'Part name',
      type: 'string',
      group: 'part',
      description: 'e.g. "Head & Senses"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'partDescription',
      title: 'Part description',
      type: 'text',
      group: 'part',
      rows: 2,
    }),

    // ── Links ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify episode URL',
      type: 'url',
      group: 'links',
      description:
        'Direct episode link (open.spotify.com/episode/…), not the show/playlist URL. Leave empty until published.',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube episode URL',
      type: 'url',
      group: 'links',
      description:
        'Direct video link (youtube.com/watch?v=…), not the playlist URL. Leave empty until published.',
    }),
    defineField({
      name: 'guidebookHref',
      title: 'Matching guidebook link',
      type: 'string',
      group: 'links',
      description: 'Deep-link to the matching book on /books. Use "book-" + the book slug as the anchor — e.g. /books#book-hair-scalp (where "hair-scalp" is the book slug).',
    }),
  ],

  orderings: [
    {
      title: 'Episode order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      part: 'partName',
      status: 'status',
    },
    prepare({ title, part, status }) {
      return {
        title: title || 'Untitled episode',
        subtitle: [part, status === 'live' ? '🎙 Live' : '⏳ Coming Soon'].filter(Boolean).join(' · '),
      };
    },
  },
});
