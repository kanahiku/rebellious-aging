import type { StructureBuilder } from 'sanity/structure';

const SINGLETONS: Record<string, string> = {
  siteNavigation: 'singleton-navigation',
  siteFooter: 'singleton-footer',
  homePage: 'singleton-home',
  contactPage: 'singleton-contact',
  reviewsPage: 'singleton-reviews',
};

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home')
        .child(S.document().schemaType('homePage').documentId('singleton-home').title('Home Page')),

      S.listItem()
        .title('Contact')
        .child(S.document().schemaType('contactPage').documentId('singleton-contact').title('Contact Page')),

      S.listItem()
        .title('Reviews')
        .child(S.document().schemaType('reviewsPage').documentId('singleton-reviews').title('Reviews Page')),

      S.listItem()
        .title('Service Pages')
        .schemaType('servicePage')
        .child(S.documentTypeList('servicePage').title('Service Pages')),

      S.divider(),

      S.listItem()
        .title('Navigation')
        .child(S.document().schemaType('siteNavigation').documentId('singleton-navigation').title('Navigation')),

      S.listItem()
        .title('Footer')
        .child(S.document().schemaType('siteFooter').documentId('singleton-footer').title('Footer')),

      S.divider(),

      S.listItem()
        .title('Leads')
        .child(S.documentTypeList('lead').title('Leads').defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])),

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
    ]);

export const singletonTypes = new Set(Object.keys(SINGLETONS));
