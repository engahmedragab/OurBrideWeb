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
}

export default nextConfig
