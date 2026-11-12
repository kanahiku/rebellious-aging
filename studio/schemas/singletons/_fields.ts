import { requiredAlt } from '../../lib/validation';
import { defineArrayMember, defineField } from 'sanity';

/** Small field builders shared by the page singletons. */

export const str = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'string', description });

export const txt = (name: string, title: string, description?: string, rows = 3) =>
  defineField({ name, title, type: 'text', rows, description });

export const paragraphs = (name: string, title: string, description = 'One item per paragraph.', rows = 4) =>
  defineField({
    name,
    title,
    type: 'array',
    description,
    of: [defineArrayMember({ type: 'text', rows })],
  });

export const imageField = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    description,
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt Text',
        type: 'string',
        validation: requiredAlt,
      }),
    ],
  });
