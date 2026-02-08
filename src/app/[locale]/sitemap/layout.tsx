import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sitemap | OurBride',
  description: 'Browse all pages and sections of OurBride website',
}

export default function SitemapLayout({ children }: { children: React.ReactNode }) {
  return children
}