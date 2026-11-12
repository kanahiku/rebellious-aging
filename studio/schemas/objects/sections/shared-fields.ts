import { defineField } from 'sanity';

export const headingField = defineField({
  name: 'heading',
  title: 'Heading',
  type: 'string',
  validation: (r) => r.required(),
});

export const introField = defineField({
  name: 'intro',
  title: 'Intro paragraph',
  type: 'text',
  rows: 3,
});

export const surfaceField = defineField({
  name: 'surface',
  title: 'Background',
  type: 'string',
  options: {
    list: [
      { title: 'White', value: 'white' },
      { title: 'Grey', value: 'grey' },
      { title: 'Dark', value: 'dark' },
    ],
    layout: 'radio',
  },
  initialValue: 'white',
  description: 'Match the Figma frame. Do not auto-cycle colors.',
});
