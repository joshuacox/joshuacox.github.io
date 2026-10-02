export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  author: string;
  locale: string;
  orgSummary: string;
  orgFullDescription: string;
  disqusShortname: string;
  googleAnalyticsId: string;
  googleAdsenseId: string;
  social: {
    github: string;
    twitter: string;
    facebook: string;
    instagram: string;
    email: string;
  };
  contact: {
    address: string;
    suite: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  tinyletterUsername: string;
}

export const siteConfig: SiteConfig = {
  name: 'Joshua Cox',
  title: 'The Blog of Joshua Cox',
  description: 'Where I blog about Jekyll, techromancy, docker, and other usually linux related stuff',
  url: 'https://joshuacox.github.io',
  author: 'Joshua Cox',
  locale: 'en-US',
  orgSummary: 'Techromancer',
  orgFullDescription: 'Have Portable Penetration Testing Hardware - will travel',
  disqusShortname: 'joshuacoxgithubio',
  googleAnalyticsId: '',
  googleAdsenseId: 'ca-pub-8973108060277483',
  social: {
    github: 'joshuacox',
    twitter: 'uberthoth',
    facebook: 'uberthoth',
    instagram: 'uberthoth',
    email: 'uberthoth@gmail.com',
  },
  contact: {
    address: '1105 West Oltorf',
    suite: 'Suite 100',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    phone: '(512) 441-5269',
  },
  tinyletterUsername: 'uberthoth',
};
