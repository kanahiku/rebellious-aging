import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Home page — every editable string and image on `/`.
 *
 * NOT editable here (lives in code on purpose):
 *   - "Do the basics first" section + the three-bucket diagram (HowAgingWorks)
 *   - Pillar card icons (matched to Bucket 1 cards by position: Diet, Exercise, Sleep, Social Connection)
 *
 * Text markup supported in headings / paragraphs:
 *   - a line break becomes <br>
 *   - **word** is highlighted (accent colour in headings, bold in body copy)
 */

const MARKUP_HELP = 'Line breaks are kept. Wrap words in **double asterisks** to highlight them.';

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

const str = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'string', description });

const txt = (name: string, title: string, description?: string, rows = 3) =>
  defineField({ name, title, type: 'text', rows, description });

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'whyUrgent', title: 'Why urgent' },
    { name: 'decades', title: 'Decades' },
    { name: 'cost', title: 'Cost comparison' },
    { name: 'acceptChange', title: 'Accept & change' },
    { name: 'bucketOne', title: 'Bucket 1' },
    { name: 'assessment', title: 'Self-assessment CTA' },
    { name: 'locations', title: 'Locations' },
    { name: 'doctor', title: 'Ask your doctor' },
    { name: 'voices', title: 'Testimonials' },
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
          validation: (r) => r.required().max(200),
        }),
      ],
    }),

    // ── Hero ──────────────────────────────────────────────────────────────
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        str('tagline', 'Tagline above the title'),
        txt('title', 'Title', `Each line break is a visual line break. ${MARKUP_HELP}`),
        defineField({
          name: 'subtitle',
          title: 'Subtitle paragraphs',
          type: 'array',
          of: [defineArrayMember({ type: 'text', rows: 4 })],
          description: 'One item per paragraph.',
        }),
        str('primaryCtaText', 'Primary button label'),
        str('primaryCtaHref', 'Primary button link'),
        str('secondaryCtaText', 'Secondary button label'),
        str('secondaryCtaHref', 'Secondary button link'),
        defineField({
          name: 'secondaryCtaNewTab',
          title: 'Open secondary button in a new tab',
          type: 'boolean',
          initialValue: false,
        }),
        str('note', 'Small note under the buttons'),
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

    // ── Why urgent ────────────────────────────────────────────────────────
    defineField({
      name: 'whyUrgent',
      title: 'Why any of this is urgent',
      type: 'object',
      group: 'whyUrgent',
      fields: [
        str('eyebrow', 'Eyebrow'),
        txt('heading', 'Heading', MARKUP_HELP),
        defineField({
          name: 'body',
          title: 'Body paragraphs',
          type: 'array',
          of: [defineArrayMember({ type: 'text', rows: 4 })],
        }),
        str('ctaText', 'Link label'),
        str('ctaHref', 'Link URL'),
        imageField('image', 'Graph image', 'Wide graph (about 1695 × 928).'),
      ],
    }),

    // ── Decades ───────────────────────────────────────────────────────────
    defineField({
      name: 'decades',
      title: 'Start with your decade',
      type: 'object',
      group: 'decades',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        defineField({
          name: 'cards',
          title: 'Cards',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'decadeCard',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'body', title: 'Body', type: 'string' }),
                defineField({ name: 'href', title: 'Link URL', type: 'string', validation: (r) => r.required() }),
              ],
              preview: { select: { title: 'title', subtitle: 'body' } },
            }),
          ],
        }),
      ],
    }),

    // ── Cost comparison ───────────────────────────────────────────────────
    defineField({
      name: 'cost',
      title: 'Cost comparison',
      type: 'object',
      group: 'cost',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('heading', 'Heading'),
        str('leftHeading', 'Left column heading'),
        defineField({
          name: 'leftBody',
          title: 'Left column paragraphs',
          type: 'array',
          of: [defineArrayMember({ type: 'text', rows: 4 })],
        }),
        str('leftCtaText', 'Left link label'),
        str('leftCtaHref', 'Left link URL'),
        str('rightHeading', 'Right column heading'),
        defineField({
          name: 'rows',
          title: 'Cost rows',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'costRow',
              fields: [
                defineField({ name: 'cost', title: 'Cost', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
              ],
              preview: { select: { title: 'cost', subtitle: 'label' } },
            }),
          ],
        }),
        str('rightCtaText', 'Right link label'),
        str('rightCtaHref', 'Right link URL'),
        str('footer', 'Footer line'),
      ],
    }),

    // ── Accept & change ───────────────────────────────────────────────────
    defineField({
      name: 'acceptChange',
      title: 'Accept, and change',
      type: 'object',
      group: 'acceptChange',
      fields: [
        str('eyebrow', 'Eyebrow'),
        txt('heading', 'Heading', MARKUP_HELP),
        defineField({
          name: 'body',
          title: 'Body paragraphs',
          type: 'array',
          of: [defineArrayMember({ type: 'text', rows: 4 })],
        }),
        str('emphasis', 'Bold closing sentence'),
        str('linkText', 'Link label (after the bold sentence)'),
        str('linkHref', 'Link URL'),
        imageField('image', 'Portrait image', 'Portrait crop, about 507 × 657.'),
      ],
    }),

    // ── Bucket 1 ──────────────────────────────────────────────────────────
    defineField({
      name: 'bucketOne',
      title: 'Bucket 1 — the basics',
      type: 'object',
      group: 'bucketOne',
      description: 'Card icons are fixed in code and matched by position: 1 Diet, 2 Exercise, 3 Sleep, 4 Social Connection.',
      fields: [
        str('eyebrow', 'Eyebrow'),
        txt('heading', 'Heading'),
        txt('body', 'Body', MARKUP_HELP, 5),
        defineField({
          name: 'cards',
          title: 'Pillar cards (keep 4, in this order)',
          type: 'array',
          validation: (r) => r.max(4),
          of: [
            defineArrayMember({
              type: 'object',
              name: 'pillarCard',
              fields: [
                defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
              ],
              preview: { select: { title: 'label', subtitle: 'heading' } },
            }),
          ],
        }),
      ],
    }),

    // ── Self-assessment CTA ───────────────────────────────────────────────
    defineField({
      name: 'assessment',
      title: 'Self-assessment CTA band',
      type: 'object',
      group: 'assessment',
      fields: [
        str('eyebrow', 'Eyebrow'),
        str('title', 'Title'),
        txt('subtitle', 'Subtitle'),
        str('ctaText', 'Button label'),
        str('ctaHref', 'Button link'),
        txt('disclaimer', 'Disclaimer under the button'),
      ],
    }),

    // ── Locations ─────────────────────────────────────────────────────────
    defineField({
      name: 'locations',
      title: 'Our locations',
      type: 'object',
      group: 'locations',
      fields: [
        str('eyebrow', 'Eyebrow'),
        imageField('backgroundImage', 'Background image'),
        defineField({
          name: 'items',
          title: 'Locations',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'locationItem',
              fields: [
                defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'memberCount', title: 'Member count', type: 'number' }),
                defineField({ name: 'href', title: 'Link URL', type: 'url', validation: (r) => r.uri({ scheme: ['http', 'https'] }) }),
              ],
              preview: { select: { title: 'name', subtitle: 'memberCount' } },
            }),
          ],
        }),
      ],
    }),

    // ── Ask your doctor ───────────────────────────────────────────────────
    defineField({
      name: 'doctor',
      title: 'Then talk to your doctor',
      type: 'object',
      group: 'doctor',
      fields: [
        str('eyebrow', 'Eyebrow'),
        txt('heading', 'Heading', MARKUP_HELP),
        str('lead', 'Lead line (larger text)'),
        defineField({
          name: 'body',
          title: 'Body paragraphs',
          type: 'array',
          of: [defineArrayMember({ type: 'text', rows: 4 })],
        }),
        str('ctaText', 'Button label'),
        str('ctaHref', 'Button link'),
        str('linkText', 'Text link label'),
        str('linkHref', 'Text link URL'),
        imageField('image', 'Image', 'About 568 × 439.'),
      ],
    }),

    // ── Testimonials heading (the quotes are Testimonial documents) ───────
    defineField({
      name: 'voices',
      title: 'Voices from the Ohana',
      type: 'object',
      group: 'voices',
      description: 'The quotes themselves are managed under "Testimonials".',
      fields: [str('eyebrow', 'Eyebrow'), txt('heading', 'Heading', MARKUP_HELP)],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Home Page' };
    },
  },
});
