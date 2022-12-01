/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
        pathname: '/static/img/**'
      }
    ]
  },
  swcMinify: true,
  compiler: {
    emotion: true
  }
}

module.exports = nextConfig
