import { defineField, defineType } from 'sanity';

const headingField = defineField({
  name: 'heading',
  title: 'Heading',
  type: 'string',
  validation: (r) => r.required(),
});

const introField = defineField({
  name: 'intro',
  title: 'Intro paragraph',
  type: 'text',
  rows: 3,
});

const surfaceField = defineField({
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

export const linkedCard = defineType({
  name: 'linkedCard',
  title: 'Linked card',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'href', title: 'URL', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'linkText', title: 'Link label', type: 'string', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'href' } },
});

export const pageHero = defineType({
  name: 'pageHero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Heading', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'visualSubheading',
      title: 'Visual subheading',
      type: 'string',
      description: 'Optional line between the H1 and body copy. Leave empty to hide it.',
    }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({
      name: 'ctaText',
      title: 'Primary CTA label',
      type: 'string',
      description: 'Leave empty on informational pages (reviews, gallery) to hide the hero button.',
    }),
    defineField({ name: 'ctaHref', title: 'Primary CTA URL', type: 'string', initialValue: 'https://www.athenaclinic.com/contact/' }),
    defineField({ name: 'phoneCtaText', title: 'Phone CTA label', type: 'string', initialValue: 'Call Now' }),
    defineField({
      name: 'phoneCtaHref',
      title: 'Phone CTA URL',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Desktop hero image',
      type: 'image',
      options: { hotspot: true },
      description: 'Side image on tablet and desktop (768px and up).',
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'imageUrl',
      title: 'Desktop hero image URL',
      type: 'url',
      description: 'Used if no desktop image is uploaded. Leave empty to show the placeholder.',
    }),
    defineField({ name: 'imageAlt', title: 'Desktop image alt text (when using a URL)', type: 'string' }),
    defineField({
      name: 'imageMobile',
      title: 'Mobile hero image',
      type: 'image',
      options: { hotspot: true },
      description:
        'Stacked image on phones (below 768px). Use a tighter crop if the desktop photo is too wide. If empty, the desktop image is used.',
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'imageMobileUrl',
      title: 'Mobile hero image URL',
      type: 'url',
      description: 'Used if no mobile image is uploaded.',
    }),
    defineField({ name: 'imageMobileAlt', title: 'Mobile image alt text (when using a URL)', type: 'string' }),
    defineField({
      name: 'imagePlaceholder',
      title: 'Placeholder label',
      type: 'string',
      description: 'Shown when there is no hero image yet.',
    }),
  ],
});

export const ctaBanner = defineType({
  name: 'ctaBanner',
  title: 'CTA banner',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3 }),
    defineField({ name: 'ctaText', title: 'CTA label', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'CTA URL', type: 'string' }),
    defineField({
      name: 'showAfterHoursNote',
      title: 'Show after-hours note?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'extraLines',
      title: 'Extra contact lines',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Optional lines under the address (alternate phone, email, hours).',
    }),
    defineField({
      name: 'license',
      title: 'License line',
      type: 'string',
      description: 'e.g. Hawaii Contractor License C-33642',
    }),
  ],
});

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

export const yelpReviewItem = defineType({
  name: 'yelpReviewItem',
  title: 'Yelp review',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Reviewer name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'reviewId', title: 'Yelp review ID', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'userId', title: 'Yelp user ID', type: 'string', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'name', subtitle: 'reviewId' } },
});

export const yelpReviewsSection = defineType({
  name: 'yelpReviewsSection',
  title: 'Yelp reviews (live)',
  type: 'object',
  description:
    'Shows the latest Yelp reviews (up to 3) from the API. Saved review IDs are ignored. Prefer “Live reviews” to mix Google and Yelp.',
  fields: [
    surfaceField,
    headingField,
    introField,
    defineField({
      name: 'items',
      title: 'Reviews (unused)',
      type: 'array',
      hidden: true,
      of: [{ type: 'yelpReviewItem' }],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Yelp reviews', subtitle: 'Live Yelp feed (max 3)' };
    },
  },
});

export const liveReviewsSection = defineType({
  name: 'liveReviewsSection',
  title: 'Live reviews',
  type: 'object',
  description:
    'Latest Google (up to 3 shown of 5 fetched) and/or Yelp (up to 3) reviews, with View all links to each platform.',
  fields: [
    surfaceField,
    headingField,
    introField,
    defineField({
      name: 'sources',
      title: 'Sources',
      type: 'string',
      options: {
        list: [
          { title: 'Google + Yelp', value: 'both' },
          { title: 'Google only', value: 'google' },
          { title: 'Yelp only', value: 'yelp' },
        ],
        layout: 'radio',
      },
      initialValue: 'both',
    }),
  ],
  preview: {
    select: { title: 'heading', sources: 'sources' },
    prepare({ title, sources }) {
      const label = sources === 'google' ? 'Google' : sources === 'yelp' ? 'Yelp' : 'Google + Yelp';
      return { title: title || 'Live reviews', subtitle: label };
    },
  },
});

export const splitContentSection = defineType({
  name: 'splitContentSection',
  title: 'Split content (text + image)',
  type: 'object',
  fields: [
    surfaceField,
    headingField,
    defineField({
      name: 'isReversed',
      title: 'Image on the left',
      type: 'boolean',
      initialValue: false,
      description: 'Match Figma. Default is image on the right.',
    }),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [{ type: 'text' }],
      validation: (r) => r.min(1),
    }),
    defineField({ name: 'ctaText', title: 'CTA label', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'CTA URL', type: 'string' }),
    defineField({
      name: 'linkText',
      title: 'Text link label',
      type: 'string',
      description: 'Optional text link under the paragraphs (in addition to the CTA button).',
    }),
    defineField({ name: 'linkHref', title: 'Text link URL', type: 'string' }),
    defineField({
      name: 'image',
      title: 'Side image (upload)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'imageUrl',
      title: 'Side image URL',
      type: 'url',
      description: 'Used if no image is uploaded. Leave empty to show the placeholder.',
    }),
    defineField({ name: 'imageAlt', title: 'Image alt text (when using a URL)', type: 'string' }),
    defineField({
      name: 'imagePlaceholder',
      title: 'Placeholder label',
      type: 'string',
      description: 'Shown when there is no side image yet.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Split content', subtitle: 'Heading + paragraphs + side image' };
    },
  },
});

export const quoteCardItem = defineType({
  name: 'quoteCardItem',
  title: 'Quote card',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'name' } },
});

export const quoteCardsSection = defineType({
  name: 'quoteCardsSection',
  title: 'Quote cards',
  type: 'object',
  fields: [
    surfaceField,
    headingField,
    introField,
    defineField({
      name: 'items',
      title: 'Quotes',
      type: 'array',
      of: [{ type: 'quoteCardItem' }],
      validation: (r) => r.min(1).max(4),
    }),
  ],
  preview: {
    select: { title: 'heading', n: 'items' },
    prepare({ title, n }) {
      const count = Array.isArray(n) ? n.length : 0;
      return { title: title || 'Quote cards', subtitle: `${count} quote${count === 1 ? '' : 's'}` };
    },
  },
});

export const formHelpOption = defineType({
  name: 'formHelpOption',
  title: 'Form help option',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'value' } },
});

export const contactLink = defineType({
  name: 'contactLink',
  title: 'Contact link',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'href', title: 'URL', type: 'string', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'text', subtitle: 'href' } },
});

export const reviewPlatformItem = defineType({
  name: 'reviewPlatformItem',
  title: 'Review platform',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'ratingNote', title: 'Description', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'href', title: 'URL', type: 'url', validation: (r) => r.required() }),
    defineField({ name: 'linkText', title: 'Button label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Tabler icon name, e.g. tabler:brand-google',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'href' } },
});

export const previewImageItem = defineType({
  name: 'previewImageItem',
  title: 'Preview image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image (upload)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL',
      type: 'url',
      description: 'Used if no image is uploaded.',
    }),
    defineField({ name: 'imageAlt', title: 'Alt text (when using a URL)', type: 'string' }),
  ],
  preview: {
    select: { media: 'image', title: 'image.alt', url: 'imageUrl' },
    prepare({ media, title, url }) {
      return { title: title || url || 'Preview image', media };
    },
  },
});

export const faqsSection = defineType({
  name: 'faqsSection',
  title: 'FAQs',
  type: 'object',
  description: 'Page-level FAQ block. Not mixed into body sections.',
  fields: [
    defineField({ name: 'title', title: 'Section title', type: 'string', initialValue: 'Frequently Asked Questions' }),
    defineField({
      name: 'items',
      title: 'Questions & answers',
      type: 'array',
      of: [{ type: 'faqItem' }],
    }),
  ],
  preview: {
    select: { title: 'title', n: 'items' },
    prepare({ title, n }) {
      const count = Array.isArray(n) ? n.length : 0;
      return { title: title || 'FAQs', subtitle: `${count} question${count === 1 ? '' : 's'}` };
    },
  },
});
