module.exports = {
  images: {
    domains: ['gravatar.com'],
  },
  eslint: {
    // dirs: ['components', 'layouts', 'lib', 'pages']
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
