/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Exclude old pages directory from being treated as Pages Router
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Static export for nginx serving
  output: 'export',
}

export default nextConfig
