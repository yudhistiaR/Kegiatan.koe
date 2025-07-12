/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com'
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev'
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com'
      }
    ]
  }
}

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})(nextConfig)
