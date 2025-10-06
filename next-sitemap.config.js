module.exports = {
  siteUrl: process.env.SITE_URL || 'https://pantaleone.net',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  changefreq: 'weekly',
  priority: 1.0,
  sitemapSize: 5000,
  additionalPaths: async (config) => {
    return [
      {
        loc: '/',
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
    ];
  },
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
}
