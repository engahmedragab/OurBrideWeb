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
    { label: 'ToDo', href: '/events/planning/todo', value: 'todo' },
  ]

  const getActiveTab = () => {
    if (pathname?.includes('/items')) return 'items'
    if (pathname?.includes('/budget')) return 'budget'
    if (pathname?.includes('/overview')) return 'overview'
    if (pathname?.includes('/calender')) return 'calender'
    if (pathname?.includes('/invitation')) return 'invitation'
    if (pathname?.includes('/bookings')) return 'bookings'
    if (pathname?.includes('/todo')) return 'todo'
    return 'overview' // Default to coupons
  }

  const activeTab = getActiveTab()

  // Split tabs into two rows for mobile (3 tabs per row)
  const firstRowTabs = tabs.slice(0, 3)
  const secondRowTabs = tabs.slice(3)

  return (
    <div className="w-full">
      {/* Page Header with Tabs */}
      <div className="mb-6 sm:mb-8 px-4 md:px-10">
        <div className={cn(
          "flex flex-wrap items-center justify-center gap-y-2 gap-x-4 sm:gap-x-8 w-full",
          "grid grid-cols-2 sm:flex sm:justify-between"
        )}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.value
            return (
              <Link
                key={tab.value}
                href={tab.href}
                className={cn(
                  'px-1 py-3 text-[13px] sm:text-14 font-medium transition-all duration-200 text-center relative shrink-0',
                  'focus-visible:outline-none w-full sm:w-auto',
                  isActive
                    ? 'text-brand-600'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full animate-in fade-in slide-in-from-bottom-1" />
                )}
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

