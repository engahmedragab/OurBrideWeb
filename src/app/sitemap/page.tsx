import Link from 'next/link'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import type { Metadata } from 'next'
import {
  Home,
  User,
  Calendar,
  Users,
  Gift,
  HelpCircle,
  Settings,
  ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sitemap | OurBride',
  description: 'Browse all pages and sections of OurBride website',
}

export default function SitemapPage() {
  const sitemapSections = [
    {
      title: 'Main Pages',
      icon: Home,
      iconColor: 'bg-blue-100 text-blue-600',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Services', href: '/services' },
        { label: 'Community', href: '/community' },
      ],
    },
    {
      title: 'Account',
      icon: User,
      iconColor: 'bg-purple-100 text-purple-600',
      links: [
        { label: 'Profile', href: '/profile' },
        { label: 'Orders', href: '/orders' },
        { label: 'Cart', href: '/cart' },
        { label: 'Wishlist', href: '/wishlist' },
        { label: 'Favorites', href: '/favorites' },
        { label: 'Messages', href: '/messages' },
        { label: 'Notifications', href: '/notifications' },
      ],
    },
    {
      title: 'Wedding Planning',
      icon: Calendar,
      iconColor: 'bg-pink-100 text-pink-600',
      links: [
        { label: 'Events', href: '/events' },
        { label: 'My Events', href: '/dashboard/my-events' },
        { label: 'Calendar', href: '/dashboard/calendar' },
        { label: 'Budget Planning', href: '/events/planning/budget' },
        { label: 'Guest List', href: '/events/planning/events' },
        { label: 'To-Do List', href: '/events/planning/todo' },
      ],
    },
    {
      title: 'Community',
      icon: Users,
      iconColor: 'bg-green-100 text-green-600',
      links: [
        { label: 'Posts', href: '/community?tab=posts' },
        { label: 'Blogs', href: '/community?tab=blogs' },
        { label: 'Articles', href: '/community?tab=articles' },
        { label: 'Reels', href: '/community?tab=reels' },
        { label: 'Decision Groups', href: '/community?tab=decision-groups' },
        { label: 'Contests', href: '/community?tab=contests' },
      ],
    },
    {
      title: 'Gift Center',
      icon: Gift,
      iconColor: 'bg-yellow-100 text-yellow-600',
      links: [
        { label: 'Gift Center', href: '/dashboard/gift-center' },
        { label: 'Coupons', href: '/dashboard/gift-center/coupons' },
        { label: 'Offers', href: '/dashboard/gift-center/offers' },
        { label: 'Rewards', href: '/dashboard/gift-center/rewards' },
        { label: 'Ranking', href: '/dashboard/gift-center/ranking' },
      ],
    },
    {
      title: 'Support & Information',
      icon: HelpCircle,
      iconColor: 'bg-indigo-100 text-indigo-600',
      links: [
        { label: 'Help Center', href: '/dashboard/help-center' },
        { label: 'About Us', href: '/about' },
        { label: 'Shipping', href: '/shipping' },
        { label: 'Returns', href: '/returns' },
        { label: 'Download App', href: '/download-app' },
        { label: 'Sitemap', href: '/sitemap' },
      ],
    },
    {
      title: 'Settings',
      icon: Settings,
      iconColor: 'bg-gray-100 text-gray-600',
      links: [
        { label: 'Settings', href: '/dashboard/settings' },
        { label: 'Privacy', href: '/dashboard/settings/privacy' },
        { label: 'Terms', href: '/dashboard/settings/terms' },
        { label: 'Community Settings', href: '/dashboard/settings/community' },
      ],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 md:mb-12 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-brand-500" />
                </div>
                <h1 className="text-24 md:text-32 font-normal text-gray-900">
                  Sitemap
                </h1>
              </div>
              <div className="w-20 h-1 bg-brand-500 mx-auto md:mx-0" />
              <p className="text-16 text-gray-600 mt-4 max-w-2xl">
                Find all pages and sections of OurBride
              </p>
            </div>

            {/* Sitemap Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sitemapSections.map((section, index) => {
                const Icon = section.icon
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${section.iconColor}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="text-18 md:text-20 font-normal text-gray-900">
                        {section.title}
                      </h2>
                    </div>
                    <ul className="space-y-2">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                            href={link.href}
                            className="flex items-center gap-2 text-14 md:text-16 text-gray-700 hover:text-brand-500 transition-colors group"
                          >
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-brand-500 transition-colors" />
                            <span>{link.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
