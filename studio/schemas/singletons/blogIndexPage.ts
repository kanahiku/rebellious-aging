import { defineField, defineType } from 'sanity';
import { str, txt } from './_fields';

/** /blog and the blog article chrome. Posts themselves are separate "Blog posts" documents. */
export const blogIndexPage = defineType({
  name: 'blogIndexPage',
  title: 'Blog Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  fields: [
    defineField({
      name: 'meta',
      title: 'SEO',
      type: 'seo',
    }),
    str('heading', 'Page heading'),
    txt('emptyMessage', 'Message shown while there are no posts', undefined, 2),
    str('backLabel', 'Back link on an article ("All articles")'),
    defineField({
      name: 'cta',
      title: 'Bottom banner',
      type: 'object',
      fields: [str('title', 'Heading'), txt('subtitle', 'Subtitle', undefined, 2), str('ctaText', 'Button label')],
    }),
  ],

  preview: { prepare: () => ({ title: 'Blog Page' }) },
});
