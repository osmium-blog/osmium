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
  webpack: config => {
    const rules = config.module.rules.find(r => r.oneOf)
    rules.oneOf.forEach(loaders => {
      if (Array.isArray(loaders.use)) {
        loaders.use.forEach(l => {
          if (
            typeof l !== 'string' &&
            typeof l.loader === 'string' &&
            /(?<!post)css-loader/.test(l.loader)
          ) {
            if (!l.options.modules) return
            const { getLocalIdent, ...others } = l.options.modules
            l.options = {
              ...l.options,
              modules: {
                ...others,
                getLocalIdent: (ctx, localIdentName, localName) => {
                  return localName === 'dark'
                    ? localName
                    : getLocalIdent(ctx, localIdentName, localName)
                },
              },
            }
          }
        })
      }
    })
    return config
  },
  transpilePackages: ['dayjs'],
}
