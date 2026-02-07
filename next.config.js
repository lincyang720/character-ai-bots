/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/characters/:id.html',
        destination: '/characters/:id',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
