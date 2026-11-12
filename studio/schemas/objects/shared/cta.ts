import { defineField, defineType } from 'sanity';

/** Button / link. Matches the site's `Button` atom variants. */
export const cta = defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'A path such as /about, or a full https:// URL.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
      initialValue: 'primary',
      options: { list: [{ title: 'Primary', value: 'primary' }, { title: 'Ghost', value: 'ghost' }, { title: 'Link', value: 'link' }] },
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
});
