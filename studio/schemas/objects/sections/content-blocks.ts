import { defineField, defineType } from 'sanity';
import { headingField, introField, surfaceField } from './shared-fields';
import { linkedCard } from './core';

export const iconPointsSection = defineType({
  name: 'iconPointsSection',
  title: 'Icon points',
  type: 'object',
  fields: [
    surfaceField,
    headingField,
    introField,
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Choose in Figma (default grid)', value: 'auto' },
          { title: '2×2 text grid', value: 'grid' },
          { title: 'One-row band', value: 'band' },
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'items',
      title: 'Points',
      type: 'array',
      of: [{ type: 'infoCardItem' }],
      validation: (r) => r.min(2).max(5),
    }),
  ],
  preview: {
    select: { title: 'heading', n: 'items' },
    prepare({ title, n }) {
      const count = Array.isArray(n) ? n.length : 0;
      return { title: title || 'Icon points', subtitle: `${count} point${count === 1 ? '' : 's'}` };
    },
  },
});

export const timelineSection = defineType({
  name: 'timelineSection',
  title: 'Timeline / process',
  type: 'object',
  fields: [
    surfaceField,
    headingField,
    introField,
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [{ type: 'timelineStep' }],
      validation: (r) => r.min(2),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Timeline', subtitle: 'Process steps' };
    },
  },
});

export const linkedCardsSection = defineType({
  name: 'linkedCardsSection',
  title: 'Linked cards / directory',
  type: 'object',
  fields: [
    surfaceField,
    headingField,
    introField,
    defineField({
      name: 'display',
      title: 'Display',
      type: 'string',
      description: 'Card grid or stacked directory rows, match the Figma frame.',
      options: {
        list: [
          { title: 'Card grid', value: 'cards' },
          { title: 'Directory rows', value: 'directory' },
        ],
        layout: 'radio',
      },
      initialValue: 'cards',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'linkedCard' }],
      validation: (r) => r.min(2),
    }),
  ],
  preview: {
    select: { title: 'heading', display: 'display' },
    prepare({ title, display }) {
      return { title: title || 'Linked items', subtitle: display === 'directory' ? 'Directory rows' : 'Card grid' };
    },
  },
});

export const infoCardsSection = defineType({
  name: 'infoCardsSection',
  title: 'Info cards',
  type: 'object',
  fields: [
    surfaceField,
    headingField,
    introField,
    defineField({
      name: 'items',
      title: 'Cards',
      type: 'array',
      of: [{ type: 'infoCardItem' }],
      validation: (r) => r.min(2).max(6),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Info cards', subtitle: 'Icon + heading + description' };
    },
  },
});

export const editorialSection = defineType({
  name: 'editorialSection',
  title: 'Editorial (full width)',
  type: 'object',
  fields: [
    surfaceField,
    headingField,
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [{ type: 'text' }],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Editorial', subtitle: 'Full-width narrative' };
    },
  },
});
