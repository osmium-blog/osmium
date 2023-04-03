module.exports = {
  title: 'An Osmium Site',
  description: 'Lorem ipsum dolor sit amet.',
  link: 'https://osmium-blog.vercel.app',
  since: 2023,
  author: 'Osmium user',
  email: 'osmium@example.com',
  socialLink: '',

  lang: 'en-US',
  timezone: 'Asia/Shanghai',
  appearance: 'auto',
  font: 'sans-serif',
  lightBackground: '#ffffff',
  darkBackground: '#191919',
  postsPerPage: 7,
  sortByDate: false,
  showAbout: true,

  path: '',
  ogImageGenerateURL: 'https://og-image-craigary.vercel.app',
  seo: {
    keywords: ['Blog', 'Website', 'Notion'],
    googleSiteVerification: '',
  },

  analytics: {
    provider: '',
    ackeeConfig: {
      tracker: '',
      dataAckeeServer: '',
      domainId: '',
    },
    gaConfig: {
      measurementId: '',
    },
  },

  comment: {
    provider: '',
    gitalkConfig: {
      repo: '',
      owner: '',
      admin: [],
      clientID: '',
      clientSecret: '',
      distractionFreeMode: false,
    },
    utterancesConfig: {
      repo: '',
    },
    cusdisConfig: {
      appId: '',
      host: 'https://cusdis.com',
      scriptSrc: 'https://cusdis.com/js/cusdis.es.js',
    },
  },
}
