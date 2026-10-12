import type { BreadcrumbItem, PageSchema } from './types';

const HOME: BreadcrumbItem = { name: 'Home', path: '/' };

const crumb = (name: string, path: string): BreadcrumbItem[] => [HOME, { name, path }];

/**
 * Per-page schema.org data — one entry per public route.
 * This list also drives `/sitemap.xml` (see `STATIC_PATHS` in `src/lib/content`),
 * so adding a route here adds it to both schema and sitemap.
 * The page description is NOT stored here: it is read from each page's real
 * `metadata.description` at render time, so schema can never drift from the page.
 * Not listed on purpose: `/contact` (redirects to Athena Clinic) and any page
 * marked `noindex` (e.g. `/form`). `npm run check:seo` enforces this.
 */
export const pages: PageSchema[] = [
  {
    name: 'Rebellious Aging',
    path: '/',
    schemaType: 'WebPage',
    faq: [],
    breadcrumb: [HOME],
  },
  {
    name: 'About Dr. Peterson',
    path: '/about',
    schemaType: 'AboutPage',
    faq: [],
    breadcrumb: crumb('About', '/about'),
  },
  {
    name: 'The Buckets: How Aging Works',
    path: '/how-aging-works',
    schemaType: 'WebPage',
    faq: [],
    breadcrumb: crumb('How aging works', '/how-aging-works'),
  },
  {
    name: 'Fill the First Bucket',
    path: '/fill-the-first-bucket',
    schemaType: 'WebPage',
    faq: [],
    breadcrumb: crumb('Fill the first bucket', '/fill-the-first-bucket'),
  },
  {
    name: 'The Basics: Four Pillars',
    path: '/four-pillars',
    schemaType: 'WebPage',
    faq: [],
    breadcrumb: crumb('The basics', '/four-pillars'),
  },
  {
    name: 'The Ohana',
    path: '/ohana',
    schemaType: 'WebPage',
    faq: [],
    breadcrumb: crumb('The Ohana', '/ohana'),
  },
  {
    name: 'In your 30s',
    path: '/in-your-30s',
    schemaType: 'WebPage',
    description: "You're at or near your peak. This is the cheapest decade to build the reserve you'll spend later.",
    faq: [],
    breadcrumb: [
      HOME,
      { name: 'How aging works', path: '/how-aging-works' },
      { name: 'In your 30s', path: '/in-your-30s' },
    ],
  },
  {
    name: 'In your 40s',
    path: '/in-your-40s',
    schemaType: 'WebPage',
    faq: [],
    breadcrumb: [
      HOME,
      { name: 'How aging works', path: '/how-aging-works' },
      { name: 'In your 40s', path: '/in-your-40s' },
    ],
  },
  {
    name: 'In your 50s',
    path: '/in-your-50s',
    schemaType: 'WebPage',
    description: 'The slope starts to show.',
    faq: [],
    breadcrumb: [
      HOME,
      { name: 'How aging works', path: '/how-aging-works' },
      { name: 'In your 50s', path: '/in-your-50s' },
    ],
  },
  {
    name: 'In your 60s',
    path: '/in-your-60s',
    schemaType: 'WebPage',
    description: 'Build your reserve before a Black Swan.',
    faq: [],
    breadcrumb: [
      HOME,
      { name: 'How aging works', path: '/how-aging-works' },
      { name: 'In your 60s', path: '/in-your-60s' },
    ],
  },
  {
    name: '70 and beyond',
    path: '/70-plus',
    schemaType: 'WebPage',
    description: "Protect your independence. You can change how fast you decline. You can't climb back up.",
    faq: [],
    breadcrumb: [
      HOME,
      { name: 'How aging works', path: '/how-aging-works' },
      { name: '70 and beyond', path: '/70-plus' },
    ],
  },
  {
    name: 'Athena Evaluation',
    path: '/athena-evaluation',
    schemaType: 'WebPage',
    faq: [],
    breadcrumb: crumb('Athena evaluation', '/athena-evaluation'),
  },
  {
    name: 'Ask Your Doctor',
    path: '/talk-to-your-doctor',
    schemaType: 'WebPage',
    faq: [],
    breadcrumb: crumb('Ask your doctor', '/talk-to-your-doctor'),
  },
  {
    name: 'Chapters',
    path: '/chapters',
    schemaType: 'CollectionPage',
    faq: [],
    breadcrumb: crumb('Chapters', '/chapters'),
  },
  {
    name: 'Guidebooks',
    path: '/guidebooks',
    schemaType: 'CollectionPage',
    faq: [],
    breadcrumb: crumb('Guidebooks', '/guidebooks'),
  },
  {
    name: 'Books',
    path: '/books',
    schemaType: 'CollectionPage',
    faq: [],
    breadcrumb: crumb('Books', '/books'),
  },
  {
    name: 'Podcast',
    path: '/podcast',
    schemaType: 'CollectionPage',
    faq: [],
    breadcrumb: crumb('Podcast', '/podcast'),
  },
  {
    name: 'Reviews',
    path: '/reviews',
    schemaType: 'CollectionPage',
    description: 'Read recent Google and Yelp reviews for Rebellious Aging.',
    faq: [],
    breadcrumb: crumb('Reviews', '/reviews'),
  },
  {
    name: 'Blog',
    path: '/blog',
    schemaType: 'CollectionPage',
    description: 'Articles and updates from Rebellious Aging.',
    faq: [],
    breadcrumb: crumb('Blog', '/blog'),
  },
  {
    name: 'Privacy Policy',
    path: '/privacy-policy',
    schemaType: 'WebPage',
    description: null,
    faq: [],
    breadcrumb: crumb('Privacy Policy', '/privacy-policy'),
  },
  {
    name: 'Terms of Service',
    path: '/terms-of-service',
    schemaType: 'WebPage',
    description: null,
    faq: [],
    breadcrumb: crumb('Terms of Service', '/terms-of-service'),
  },
];
