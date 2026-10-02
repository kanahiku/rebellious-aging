import { defineField, defineType } from 'sanity';

const imageField = (name: string, title: string, description?: string) =>
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
        validation: (r) => r.required().warning('Alt text helps accessibility and SEO.'),
      }),
    ],
  });

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Images',
      type: 'object',
      fields: [
        imageField(
          'heroImage',
          'Desktop hero image',
          'Full-bleed overlay on tablet and desktop. Use crop/hotspot to keep the subject readable.'
        ),
        imageField(
          'heroImageMobile',
          'Mobile hero image',
          'Phone crop for the hero. Leave empty to reuse the desktop hero image.'
        ),
      ],
    }),

    defineField({
      name: 'pageImages',
      title: 'Page Images',
      type: 'object',
      description: 'Images used by the current home page sections.',
      fields: [
        imageField(
          'whyUrgentGraph',
          'Everything peaks graph',
          'The graph image in the "Everything peaks. Then it slopes." section.'
        ),
        imageField(
          'acceptChangeImage',
          'Half of this is not your problem image',
          'The portrait image in the "Half of this is not your problem." section.'
        ),
        imageField(
          'talkToDoctorImage',
          'Talk to your doctor image',
          'The image in the "Then talk to your doctor about it." section.'
        ),
        imageField(
          'locationsBackground',
          'Our locations background',
          'The background image for the home page locations section.'
        ),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Home Page' };
    },
  },
});
