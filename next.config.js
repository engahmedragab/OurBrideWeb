/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Exclude old pages directory from being treated as Pages Router
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Removed static export to support dynamic routes (orders, user profiles, etc.)
  // Use SSR/standalone mode for dynamic content
  // output: 'export', // ❌ Removed - incompatible with dynamic routes
}

export default nextConfig
