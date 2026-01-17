'use client'

import { ReactNode, Suspense, useEffect, useState } from 'react'
import { usePathname } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useEventInfo } from '@/hooks/weddingEvents'
import { PlanningSideMenu, type PlanningSideMenuTab } from '@/components/planning'
import {
  LayoutDashboard,
  Wallet,
  Package,
  Calendar,
  Mail,
  Sparkles,
  CheckSquare,
  FileText,
} from 'lucide-react'

function PlanningLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const eventId = searchParams?.get('eventId')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const selectedEventId = eventId ? parseInt(eventId, 10) : null
  const { data: eventInfo } = useEventInfo(
    selectedEventId,
    isMounted && selectedEventId !== null
  )

  // Build href with eventId if present
  const buildHref = (path: string) => {
    if (eventId) {
      return `${path}?eventId=${eventId}`
    }
    return path
  }

  const getBookInitStatus = (bookType: string) => {
    if (!eventInfo) return false
    switch (bookType) {
      case 'budget':
        return !!eventInfo.budgetBook?.id
      case 'items':
        return !!eventInfo.itemBook?.id
      case 'events':
        return eventInfo.eventBook?.isBookInit ?? false
      case 'invitation':
        return !!eventInfo.guestBook?.id
      case 'occasion':
        return !!eventInfo.occasionBook?.id
      case 'preparations':
        return !!eventInfo.serviceBook?.id
      case 'todo':
        return !!eventInfo.todoBook?.id
      case 'notes':
        return !!eventInfo.noteBook?.id
      default:
        return false
    }
  }

  const tabs: PlanningSideMenuTab[] = [
    { label: 'overview', href: eventId ? `/dashboard/my-events?eventId=${eventId}` : '/dashboard/my-events', value: 'overview', icon: LayoutDashboard },
    { label: 'budget', href: buildHref('/events/planning/budget'), value: 'budget', needsInit: eventInfo ? !getBookInitStatus('budget') : false, icon: Wallet },
    { label: 'items', href: buildHref('/events/planning/items'), value: 'items', needsInit: eventInfo ? !getBookInitStatus('items') : false, icon: Package },
    { label: 'events', href: buildHref('/events/planning/events'), value: 'events', needsInit: eventInfo ? !getBookInitStatus('events') : false, icon: Calendar },
    { label: 'invitation', href: buildHref('/events/planning/invitation'), value: 'invitation', needsInit: eventInfo ? !getBookInitStatus('invitation') : false, icon: Mail },
    { label: 'occasions', href: buildHref('/events/planning/occasion'), value: 'occasion', needsInit: eventInfo ? !getBookInitStatus('occasion') : false, icon: Sparkles },
    { label: 'preparations', href: buildHref('/events/planning/preparations'), value: 'preparations', needsInit: eventInfo ? !getBookInitStatus('preparations') : false, icon: Sparkles },
    { label: 'ToDo', href: buildHref('/events/planning/todo'), value: 'todo', needsInit: eventInfo ? !getBookInitStatus('todo') : false, icon: CheckSquare },
    { label: 'notes', href: buildHref('/events/planning/notes'), value: 'notes', needsInit: eventInfo ? !getBookInitStatus('notes') : false, icon: FileText },
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

  return (
    <div className="w-full">
      <div className={cn('flex flex-col lg:flex-row gap-6 px-4 md:px-10')}>
        <div className="order-2 lg:order-1 flex-1 min-w-0">
          {children}
        </div>
        <aside className="order-1 lg:order-2 lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-6">
            <PlanningSideMenu
              tabs={tabs}
              activeValue={activeTab}
              showIndicators={true}
            />
          </div>
        </aside>
      </div>
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

