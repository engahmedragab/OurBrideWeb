import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Enable Next.js image optimization
    unoptimized: false,
    // Cache optimized images for 1 day (86400 seconds)
    minimumCacheTTL: 60 * 60 * 24, // 1 day cache
    // Allow images from various sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      // Allow images from API base URL (supports multiple environments)
      {
        protocol: 'https',
        hostname: '*.our-bride.com',
      },
      {
        protocol: 'https',
        hostname: 'preprod.our-bride.com',
      },
      {
        protocol: 'https',
        hostname: 'prod.our-bride.com',
      },
      // Allow any HTTPS domain for API images (can be restricted later)
      // This is useful for development and staging environments
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Image formats to use (WebP/AVIF when supported)
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Exclude old pages directory from being treated as Pages Router
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Add cache headers for static assets
  async headers() {
    return [
      {
        // Apply caching headers to optimized images
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Apply caching headers to static images in public folder
        source: '/:path*\\.(png|jpg|jpeg|gif|webp|avif|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
