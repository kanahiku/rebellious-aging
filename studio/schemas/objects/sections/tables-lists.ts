import { defineField, defineType } from 'sanity';
import { headingField, introField, surfaceField } from './shared-fields';

export const comparisonRow = defineType({
  name: 'comparisonRow',
  title: 'Comparison row',
  type: 'object',
  fields: [
    defineField({ name: 'feature', title: 'Row label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'cell1', title: 'Column 1', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'cell2', title: 'Column 2', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({
      name: 'cell3',
      title: 'Column 3',
      type: 'text',
      rows: 3,
      description: 'Only used when a third column header is set (4-column matrix).',
    }),
  ],
  preview: { select: { title: 'feature' } },
});

export const comparisonTableSection = defineType({
  name: 'comparisonTableSection',
  title: 'Comparison table',
  type: 'object',
  fields: [
    surfaceField,
    headingField,
    introField,
    defineField({
      name: 'featureLabel',
      title: 'First column header',
      type: 'string',
      initialValue: 'Material Comparison',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'column1',
      title: 'Column 2 header',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'column2',
      title: 'Column 3 header',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'column3',
      title: 'Column 4 header',
      type: 'string',
      description: 'Leave empty for a 3-column table. Fill in for a 4-column matrix (e.g. the materials hub).',
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [{ type: 'comparisonRow' }],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Comparison table', subtitle: 'Comparison table' };
    },
  },
});

export const bulletCardItem = defineType({
  name: 'bulletCardItem',
  title: 'Bullet card',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'items',
      title: 'Bullets',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.min(1),
    }),
  ],
  preview: { select: { title: 'title' } },
});

export const bulletCardsSection = defineType({
  name: 'bulletCardsSection',
  title: 'Bullet cards',
  type: 'object',
  fields: [
    surfaceField,
    headingField,
    introField,
    defineField({
      name: 'items',
      title: 'Cards',
      type: 'array',
      of: [{ type: 'bulletCardItem' }],
      validation: (r) => r.min(2).max(4),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Bullet cards', subtitle: 'Title + bullet list' };
    },
  },
});

export const checklistItem = defineType({
  name: 'checklistItem',
  title: 'Checklist item',
  type: 'object',
  fields: [defineField({ name: 'text', title: 'Text', type: 'string', validation: (r) => r.required() })],
  preview: { select: { title: 'text' } },
});

export const checklistSection = defineType({
  name: 'checklistSection',
  title: 'Checklist',
  type: 'object',
  fields: [
    surfaceField,
    headingField,
    introField,
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'checklistItem' }],
      validation: (r) => r.min(2),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Checklist', subtitle: 'Check-icon list' };
    },
  },
});
