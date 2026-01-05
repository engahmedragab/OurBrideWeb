'use client'

import { ReactNode, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

function PlanningLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const eventId = searchParams?.get('eventId')

  // Build href with eventId if present
  const buildHref = (path: string) => {
    if (eventId) {
      return `${path}?eventId=${eventId}`
    }
    return path
  }

  const tabs = [
    {
      label: 'overview',
      href: eventId
        ? `/dashboard/my-events?eventId=${eventId}`
        : '/dashboard/my-events',
      value: 'overview',
    },
    {
      label: 'budget',
      href: buildHref('/events/planning/budget'),
      value: 'budget',
    },
    {
      label: 'items',
      href: buildHref('/events/planning/items'),
      value: 'items',
    },
    {
      label: 'events',
      href: buildHref('/events/planning/events'),
      value: 'events',
    },
    {
      label: 'invitation',
      href: buildHref('/events/planning/invitation'),
      value: 'invitation',
    },
    {
      label: 'occasions',
      href: buildHref('/events/planning/occasion'),
      value: 'occasion',
    },
    {
      label: 'preparations',
      href: buildHref('/events/planning/preparations'),
      value: 'preparations',
    },
    { label: 'ToDo', href: buildHref('/events/planning/todo'), value: 'todo' },
    {
      label: 'notes',
      href: buildHref('/events/planning/notes'),
      value: 'notes',
    },
  ]

  const getActiveTab = () => {
    if (pathname?.includes('/items')) return 'items'
    if (pathname?.includes('/budget')) return 'budget'
    if (pathname?.includes('/overview')) return 'overview'
    if (pathname?.includes('/events/planning/events')) return 'events'
    if (pathname?.includes('/invitation')) return 'invitation'
    if (pathname?.includes('/occasion')) return 'occasion'
    if (pathname?.includes('/preparations')) return 'preparations'
    if (pathname?.includes('/todo')) return 'todo'
    if (pathname?.includes('/notes')) return 'notes'
    return 'overview' // Default to overview
  }

  const activeTab = getActiveTab()

  // Split tabs into two rows for mobile (3 tabs per row)
  const firstRowTabs = tabs.slice(0, 3)
  const secondRowTabs = tabs.slice(3)

  return (
    <div className="w-full">
      {/* Page Header with Tabs */}
      <div className="mb-6 sm:mb-8 px-4 md:px-10">
        <div
          className={cn(
            'flex flex-wrap items-center justify-center gap-y-2 gap-x-4 sm:gap-x-8 w-full',
            'grid grid-cols-2 sm:flex sm:justify-between'
          )}
        >
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

export default function PlanningLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="w-full">
          <div className="mb-6 sm:mb-8 px-4 md:px-10">
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-4 sm:gap-x-8 w-full">
              <div className="h-10 w-full animate-pulse bg-gray-200 rounded" />
            </div>
          </div>
          {children}
        </div>
      }
    >
      <PlanningLayoutContent>{children}</PlanningLayoutContent>
    </Suspense>
  )
}
