'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Gift Center Layout Component
 * Provides shared layout with tabs navigation for Gift Center pages
 */
export default function GiftCenterLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()

  const tabs = [
    { value: 'offers', label: 'Offers', href: '/dashboard/gift-center/offers' },
    {
      value: 'coupons',
      label: 'Coupons',
      href: '/dashboard/gift-center/coupons',
    },
    {
      value: 'ranking',
      label: 'Ranking',
      href: '/dashboard/gift-center/ranking',
    },
  ]

  const getActiveTab = () => {
    if (pathname?.includes('/offers')) return 'offers'
    if (pathname?.includes('/coupons')) return 'coupons'
    if (pathname?.includes('/ranking') || pathname?.includes('/rewards'))
      return 'ranking'
    return 'coupons' // Default to coupons
  }

  const activeTab = getActiveTab()

  return (
    <div className="w-full">
      {/* Page Header with Tabs */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between gap-6 sm:gap-8 w-full">
          {tabs.map(tab => {
            const isActive = activeTab === tab.value
            return (
              <Link
                key={tab.value}
                href={tab.href}
                className={cn(
                  'px-2 py-2 text-12 sm:text-14 font-normal transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-center w-full',
                  isActive
                    ? 'border-b-2 border-brand-500 text-gray-900'
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-900'
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Nested Page Content */}
      {children}
    </div>
  )
}
