const config = require('./osmium-config.json')

module.exports = {
  basePath: config.path,
  images: {
    domains: ['gravatar.com'],
  },
  async headers () {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=()',
          },
        ],
      },
    ]
  },
  transpilePackages: ['dayjs'],
}
