import { defineField, defineType } from 'sanity';

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'form', title: 'Form & map' },
    { name: 'touchpoints', title: 'Get in touch' },
    { name: 'unsure', title: 'Not sure' },
    { name: 'reasons', title: 'Common reasons' },
    { name: 'cta', title: 'CTA banner' },
  ],

  fields: [
    defineField({
      name: 'meta',
      title: 'SEO',
      type: 'object',
      group: 'meta',
      fields: [
        defineField({ name: 'title', title: 'Page title', type: 'string', validation: (r) => r.required() }),
        defineField({
          name: 'description',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'pageHero',
      group: 'hero',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'form',
      title: 'Form & map',
      type: 'object',
      group: 'form',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'intro', title: 'Intro paragraph', type: 'text', rows: 3 }),
        defineField({ name: 'topicLabel', title: 'Topic field label', type: 'string' }),
        defineField({ name: 'topicPlaceholder', title: 'Topic placeholder', type: 'string' }),
        defineField({
          name: 'helpOptions',
          title: 'Topic options',
          type: 'array',
          of: [{ type: 'formHelpOption' }],
          validation: (r) => r.min(1),
        }),
        defineField({ name: 'messageLabel', title: 'Message field label', type: 'string' }),
        defineField({ name: 'submitLabel', title: 'Submit button label', type: 'string' }),
        defineField({ name: 'mapHeading', title: 'Map heading', type: 'string' }),
        defineField({ name: 'addressLine1', title: 'Address line 1', type: 'string' }),
        defineField({ name: 'addressLine2', title: 'Address line 2', type: 'string' }),
        defineField({
          name: 'mapsQuery',
          title: 'Maps search query',
          type: 'string',
          description: 'Used for the embed and Get Directions link, e.g. Kailua, HI',
        }),
        defineField({ name: 'directionsLabel', title: 'Directions button label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'touchpoints',
      title: 'Get in touch',
      type: 'object',
      group: 'touchpoints',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
        defineField({
          name: 'items',
          title: 'Cards',
          type: 'array',
          of: [{ type: 'infoCardItem' }],
          validation: (r) => r.min(2).max(4),
        }),
        defineField({
          name: 'links',
          title: 'Contact links',
          type: 'array',
          of: [{ type: 'contactLink' }],
          description: 'Phone and email links shown under the cards.',
        }),
      ],
    }),
    defineField({
      name: 'unsureSection',
      title: 'Not sure which service',
      type: 'splitContentSection',
      group: 'unsure',
    }),
    defineField({
      name: 'reasons',
      title: 'Common reasons',
      type: 'linkedCardsSection',
      group: 'reasons',
    }),
    defineField({
      name: 'ctaBanner',
      title: 'CTA banner',
      type: 'ctaBanner',
      group: 'cta',
      validation: (r) => r.required(),
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Contact Page' };
    },
  },
});
