/**
 * Single entry point for every Sanity (GROQ) query.
 * Queries live in ./sanity-queries/*.ts, grouped by page family, to stay under
 * the file-size limit. Import from this file only, never from the sub-modules.
 */
export * from './sanity-queries/home';
export * from './sanity-queries/about';
export * from './sanity-queries/decades';
export * from './sanity-queries/athena-legal-nav';
export * from './sanity-queries/service';
export * from './sanity-queries/contact-reviews';
export * from './sanity-queries/portable-text';
export * from './sanity-queries/blog';
export * from './sanity-queries/books-podcast';
export * from './sanity-queries/index-pages';
export * from './sanity-queries/seo';
