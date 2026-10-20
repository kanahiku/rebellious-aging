import type { StructureBuilder } from 'sanity/structure';

/**
 * Studio sidebar.
 *
 * "Pages" mirrors the live website one-to-one. When a page is moved into Sanity,
 * add it to PAGES below; when a page is removed from the site, delete its entry
 * (and its schema) so editors never see a page that does not exist.
 *
 * Migrated so far: Home, How Aging Works, Talk to Your Doctor, About, Ohana, the five decade pages, the two legal pages. Reviews and CMS service pages were already in Sanity.
 */
const SINGLETONS: Record<string, string> = {
  siteNavigation: 'singleton-navigation',
  siteFooter: 'singleton-footer',
  homePage: 'singleton-home',
  howAgingWorksPage: 'singleton-how-aging-works',
  talkToDoctorPage: 'singleton-talk-to-doctor',
  aboutPage: 'singleton-about',
  ohanaPage: 'singleton-ohana',
  fillFirstBucketPage: 'singleton-fill-first-bucket',
  fourPillarsPage: 'singleton-four-pillars',
  athenaEvaluationPage: 'singleton-athena-evaluation',
  reviewsPage: 'singleton-reviews',
  booksPage: 'singleton-books',
  podcastPage: 'singleton-podcast',
  blogIndexPage: 'singleton-blog-index',
};

/** Legal pages share one schema; each has its own fixed document. */
const LEGALS: [title: string, id: string][] = [
  ['Privacy Policy  ( /privacy-policy )', 'legal-privacy-policy'],
  ['Terms of Service  ( /terms-of-service )', 'legal-terms-of-service'],
];

/** Decade pages share one schema; each has its own fixed document. */
const DECADES: [title: string, id: string][] = [
  ['In your 30s  ( /in-your-30s )', 'decade-30s'],
  ['In your 40s  ( /in-your-40s )', 'decade-40s'],
  ['In your 50s  ( /in-your-50s )', 'decade-50s'],
  ['In your 60s  ( /in-your-60s )', 'decade-60s'],
  ['70 and beyond  ( /70-plus )', 'decade-70-plus'],
];

export const structure = (S: StructureBuilder) => {
  const singleton = (schemaType: string, title: string) =>
    S.listItem()
      .title(title)
      .id(schemaType)
      .child(S.document().schemaType(schemaType).documentId(SINGLETONS[schemaType]!).title(title));

  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              singleton('homePage', 'Home  ( / )'),
              singleton('howAgingWorksPage', 'The Buckets  ( /how-aging-works )'),
              singleton('talkToDoctorPage', 'Ask Your Doctor  ( /talk-to-your-doctor )'),
              singleton('aboutPage', 'About  ( /about )'),
              singleton('ohanaPage', 'The Ohana  ( /ohana )'),
              singleton('fillFirstBucketPage', 'Fill the First Bucket  ( /fill-the-first-bucket )'),
              singleton('fourPillarsPage', 'The Basics  ( /four-pillars )'),
              singleton('athenaEvaluationPage', 'Athena Evaluation  ( /athena-evaluation )'),
              S.listItem()
                .title('Decade pages')
                .child(
                  S.list()
                    .title('Decade pages')
                    .items(
                      DECADES.map(([title, id]) =>
                        S.listItem()
                          .title(title)
                          .id(id)
                          .child(S.document().schemaType('decadePage').documentId(id).title(title))
                      )
                    )
                ),
              S.listItem()
                .title('Legal pages')
                .child(
                  S.list()
                    .title('Legal pages')
                    .items(
                      LEGALS.map(([title, id]) =>
                        S.listItem()
                          .title(title)
                          .id(id)
                          .child(S.document().schemaType('legalPage').documentId(id).title(title))
                      )
                    )
                ),
              singleton('booksPage', 'Books  ( /books )'),
              singleton('podcastPage', 'Podcast  ( /podcast )'),
              singleton('blogIndexPage', 'Blog  ( /blog )'),
              singleton('reviewsPage', 'Reviews  ( /reviews )'),
              S.listItem()
                .title('Service pages')
                .schemaType('servicePage')
                .child(S.documentTypeList('servicePage').title('Service pages')),
            ])
        ),

      S.divider(),

      S.listItem()
        .title('Blog')
        .schemaType('blogPost')
        .child(
          S.documentTypeList('blogPost').title('Blog posts').defaultOrdering([{ field: 'publishDate', direction: 'desc' }])
        ),

      S.listItem()
        .title('Books')
        .schemaType('book')
        .child(
          S.documentTypeList('book').title('Books').defaultOrdering([
            { field: 'order', direction: 'asc' },
            { field: 'title', direction: 'asc' },
          ])
        ),

      S.listItem()
        .title('Podcast Episodes')
        .schemaType('podcastEpisode')
        .child(
          S.documentTypeList('podcastEpisode').title('Podcast Episodes').defaultOrdering([
            { field: 'order', direction: 'asc' },
          ])
        ),

      S.listItem()
        .title('Testimonials')
        .schemaType('testimonial')
        .child(
          S.documentTypeList('testimonial').title('Testimonials').defaultOrdering([
            { field: 'order', direction: 'asc' },
            { field: 'name', direction: 'asc' },
          ])
        ),

      S.divider(),

      singleton('siteNavigation', 'Navigation'),
      singleton('siteFooter', 'Footer'),

      S.divider(),

      S.listItem()
        .title('Leads')
        .child(S.documentTypeList('lead').title('Leads').defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])),
    ]);
};

export const singletonTypes = new Set(Object.keys(SINGLETONS));
