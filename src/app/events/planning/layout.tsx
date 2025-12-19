'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'


export default function PlanningLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const tabs = [
    { label: 'overview', href: '/events/planning/overview', value: 'overview',},
    { label: 'budget', href: '/events/planning/budget', value: 'budget'},
    { label: 'items', href: '/events/planning/items', value: 'items' },
    { label: 'calender', href: '/events/planning/calender', value: 'calender' },
    { label: 'invitation', href: '/events/planning/invitation', value: 'invitation'},
    { label: 'bookings', href: '/events/planning/bookings', value: 'bookings' },
  ]

  const getActiveTab = () => {
    if (pathname?.includes('/items')) return 'items'
    if (pathname?.includes('/budget')) return 'budget'
    if (pathname?.includes('/overview')) return 'overview'
    if (pathname?.includes('/calender')) return 'calender'
    if (pathname?.includes('/invitation')) return 'invitation'
    if (pathname?.includes('/bookings')) return 'bookings'
    return 'overview' // Default to coupons
  }

  const activeTab = getActiveTab()

  // Split tabs into two rows for mobile (3 tabs per row)
  const firstRowTabs = tabs.slice(0, 3)
  const secondRowTabs = tabs.slice(3)

  return (
    <div className="w-full">
      {/* Page Header with Tabs */}
      <div className="mb-6 sm:mb-8">
        {/* Mobile: Two rows (like Figma design) */}
        <div className="sm:hidden -mx-4 px-4">
          <div className="flex flex-col gap-4">
            {/* First Row */}
            <div className="border-b border-gray-100 flex gap-2">
              {firstRowTabs.map(tab => {
                const isActive = activeTab === tab.value
                return (
                  <Link
                    key={tab.value}
                    href={tab.href}
                    className={cn(
                      'flex flex-1 flex-col items-center justify-center pb-2 pt-2 px-0 text-12 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-center whitespace-nowrap relative',
                      isActive
                        ? 'border-b-2 border-brand-500 text-gray-900 font-medium'
                        : 'border-b-2 border-transparent text-gray-500 font-normal'
                    )}
                  >
                    {tab.label}
                  </Link>
                )
              })}
            </div>

            {/* Second Row */}
            {secondRowTabs.length > 0 && (
              <div className="border-b border-gray-100 flex gap-2">
                {secondRowTabs.map(tab => {
                  const isActive = activeTab === tab.value
                  return (
                    <Link
                      key={tab.value}
                      href={tab.href}
                      className={cn(
                        'flex flex-1 flex-col items-center justify-center pb-2 pt-0 px-0 text-12 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-center whitespace-nowrap relative',
                        isActive
                          ? 'border-b-2 border-gray-500 text-gray-900 font-medium'
                          : 'border-b-2 border-transparent text-gray-500 font-normal'
                      )}
                    >
                      {tab.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Desktop: Single row */}
        <div className="hidden sm:flex items-center justify-between gap-6 sm:gap-8 w-full">
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

