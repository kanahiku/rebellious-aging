import type { NavigationContent } from '~/lib/content/types';
import { PRIMARY_CTA_LABEL, PRIMARY_CTA_HREF, SOCIAL } from '~/config';

export const navigationData: NavigationContent = {
  header: {
    links: [
      { text: 'The Buckets', href: '/how-aging-works' },
      { text: 'The Ohana', href: '/ohana' },
      { text: 'Ask Your Doctor', href: '/talk-to-your-doctor' },
      { text: 'Books', href: '/books' },
      { text: 'Podcast', href: '/podcast' },
      { text: 'About', href: '/about' },
    ],
    actions: [{ variant: 'primary', text: PRIMARY_CTA_LABEL, href: PRIMARY_CTA_HREF }],
  },

  footer: {
    links: [
      {
        title: 'Navigation',
        links: [
          { text: 'The Buckets', href: '/how-aging-works' },
          { text: 'The Ohana', href: '/ohana' },
          { text: 'Ask Your Doctor', href: '/talk-to-your-doctor' },
          { text: 'Books', href: '/books' },
          { text: 'Podcast', href: '/podcast' },
          { text: 'About', href: '/about' },
        ],
      },
      {
        title: 'Start with your decade',
        links: [
          { text: 'In your 30s', href: '/in-your-30s' },
          { text: 'In your 40s', href: '/in-your-40s' },
          { text: 'In your 50s', href: '/in-your-50s' },
          { text: 'In your 60s', href: '/in-your-60s' },
          { text: '70 and beyond', href: '/70-plus' },
        ],
      },
    ],
    secondaryLinks: [
      { text: 'Privacy Policy', href: '/privacy-policy' },
      { text: 'Terms of Service', href: '/terms-of-service' },
    ],
    socialLinks: SOCIAL.nav as unknown as NavigationContent['footer']['socialLinks'],
    footNote: 'Rebellious Aging is sponsored by Athena Clinic, which Dr. Peterson owns.',
  },
};
