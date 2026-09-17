import type { NavigationContent } from '~/lib/content/types';
import { CONTACT, PRIMARY_CTA_LABEL, PRIMARY_CTA_HREF, SOCIAL } from '~/config';

export const navigationData: NavigationContent = {
  header: {
    links: [
      { text: 'How Aging Works', href: '/how-aging-works' },
      { text: 'Four Pillars', href: '/four-pillars' },
      { text: 'Books', href: '/books' },
      { text: 'Podcasts', href: '/podcast' },
      { text: 'About', href: '/about' },
    ],
    actions: [{ variant: 'primary', text: PRIMARY_CTA_LABEL, href: PRIMARY_CTA_HREF }],
  },

  footer: {
    links: [
      {
        title: 'Navigation',
        links: [
          { text: 'How Aging Works', href: '/how-aging-works' },
          { text: 'Four Pillars', href: '/four-pillars' },
          { text: 'Books', href: '/books' },
          { text: 'Podcasts', href: '/podcast' },
          { text: 'About', href: '/about' },
        ],
      },
    ],
    secondaryLinks: [
      { text: 'Privacy Policy', href: '/privacy-policy' },
      { text: 'Terms of Service', href: '/terms-of-service' },
    ],
    socialLinks: SOCIAL.nav as unknown as NavigationContent['footer']['socialLinks'],
    footNote: `&copy; ${new Date().getFullYear()} ${CONTACT.businessName}. All rights reserved.`,
  },
};
