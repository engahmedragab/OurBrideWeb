'use client'

import { useState, useMemo, useEffect, Suspense, type MouseEvent } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { EventCard, AddEventModal } from '@/components/events'
import { Button, LoadingSpinner } from '@/components/ui'
import { cn } from '@/lib/utils'
import {
  useWeddingEvents,
  useCreateWeddingEvent,
  useEventInfo,
} from '@/hooks/weddingEvents'
import { useToast } from '@/components/ui/Toaster'
import type { WeddingEventResponse } from '@/types/responses'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'
import {
  ItemBookCard,
  PreparationCard,
  BudgetBookCard,
  EventBookCard,
  GuestBookCard,
  NoteBookCard,
  TodoBookCard,
  OccasionBookCard,
} from '@/components/events'
import {
  useInitItemBooks,
  useInitServiceBooks,
  useInitBudgetBooks,
  useInitEventBooks,
  useInitGuestBooks,
  useInitNoteBooks,
  useInitTodoBooks,
  useInitOccasionBooks,
} from '@/hooks/bookInit'
import {
  EventSummaryCard,
  QuickStatsCard,
  TasksReminder,
  UpcomingBookings,
  BudgetPayments,
  GuestsInvitation,
  type Task,
  type Booking,
} from '@/components/overviews'
import authHeroImage from '@/assets/images/authHero.jpg'

/**
 * Format date from ISO string to DD/MM/YYYY
 */
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '00/00/0000'
  try {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return '00/00/0000'
  }
}

/**
 * Format time from ISO string to HH:MM am/pm
 */
const formatTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '00:00 am'
  try {
    const date = new Date(dateString)
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
  } catch {
    return '00:00 am'
  }
}

/**
 * Map WeddingEventResponse to EventCard format
 */
const mapWeddingEventToEventCard = (event: WeddingEventResponse) => {
  // Get creator name from bride or groom
  const brideName = event.bride?.displayName ||
    (event.bride?.firstName && event.bride?.lastName
      ? `${event.bride.firstName} ${event.bride.lastName}`
      : event.bride?.userName) ||
    null
  const groomName = event.groom?.displayName ||
    (event.groom?.firstName && event.groom?.lastName
      ? `${event.groom.firstName} ${event.groom.lastName}`
      : event.groom?.userName) ||
    null

  const creatorName = brideName || groomName || 'Unknown'

  // Get creator avatar from profileUrl
  const creatorAvatar = event.bride?.profileUrl ||
    event.groom?.profileUrl ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'

  return {
    id: String(event.id),
    eventName: event.title,
    date: formatDate(event.startDate),
    time: formatTime(event.startDate),
    creatorName: creatorName,
    creatorAvatar: creatorAvatar,
    attendeeCount: 0, // TODO: Get attendee count from API when available
    attendeeAvatars: [], // TODO: Get attendee avatars from API when available
  }
}

/**
 * My Events Page Component
 * Displays user's events and shared events with tabs
 */
function MyEventsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState<'my-events' | 'shared-events'>('my-events')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Track mount state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Get eventId from URL query params if present
  useEffect(() => {
    const eventIdParam = searchParams?.get('eventId')
    if (eventIdParam) {
      const eventIdNum = parseInt(eventIdParam, 10)
      if (!isNaN(eventIdNum)) {
        setSelectedEventId(eventIdNum)
      }
    }
  }, [searchParams])

  // Fetch wedding events - disable during SSR to prevent hydration mismatch
  const { data: weddingEvents = [], isLoading, error } = useWeddingEvents({
    enabled: isMounted,
  })
  const createEventMutation = useCreateWeddingEvent()

  // Fetch event info for selected event
  const { data: eventInfo, isLoading: isLoadingEventInfo } = useEventInfo(
    selectedEventId,
    isMounted && selectedEventId !== null
  )

  // Init mutation hooks for all book types
  const initItemBooks = useInitItemBooks()
  const initServiceBooks = useInitServiceBooks()
  const initBudgetBooks = useInitBudgetBooks()
  const initEventBooks = useInitEventBooks()
  const initGuestBooks = useInitGuestBooks()
  const initNoteBooks = useInitNoteBooks()
  const initTodoBooks = useInitTodoBooks()
  const initOccasionBooks = useInitOccasionBooks()

  // Helper function to handle book initialization and navigation
  const handleBookInit = async (
    bookType: 'item' | 'service' | 'budget' | 'event' | 'guest' | 'note' | 'todo' | 'occasion'
  ): Promise<void> => {
    if (!selectedEventId) return

    // Normalize params: set clientId and userType to null, pass eventId
    const params = {
      eventId: selectedEventId,
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
    }
    switch (bookType) {
      case 'item':
        await initItemBooks.mutateAsync(params)
        break
      case 'service':
        await initServiceBooks.mutateAsync(params)
        break
      case 'budget':
        await initBudgetBooks.mutateAsync(params)
        break
      case 'event':
        await initEventBooks.mutateAsync(params)
        break
      case 'guest':
        await initGuestBooks.mutateAsync(params)
        break
      case 'note':
        await initNoteBooks.mutateAsync(params)
        break
      case 'todo':
        await initTodoBooks.mutateAsync(params)
        break
      case 'occasion':
        await initOccasionBooks.mutateAsync(params)
        break
    }
  }

  const handleBookNavigate = (
    bookType: 'item' | 'service' | 'budget' | 'event' | 'guest' | 'note' | 'todo' | 'occasion'
  ) => {
    if (!selectedEventId) return

    const routes: Record<typeof bookType, string> = {
      item: '/events/planning/items',
      service: '/events/planning/preparations',
      budget: '/events/planning/budget',
      event: `/dashboard/my-events?eventId=${selectedEventId}`,
      guest: '/events/planning/invitation',
      note: `/dashboard/my-events?eventId=${selectedEventId}`,
      todo: '/events/planning/todo',
      occasion: '/events/planning/occasion',
    }
    router.push(`${routes[bookType]}?eventId=${selectedEventId}`)
  }

  const tabs = [
    { value: 'my-events', label: 'My Events' },
    { value: 'shared-events', label: 'Shared Events' },
  ]

  // Map wedding events to EventCard format
  const mappedEvents = useMemo(() => {
    return weddingEvents.map(mapWeddingEventToEventCard)
  }, [weddingEvents])

  // Filter events based on active tab
  // For now, all events are shown in "My Events". "Shared Events" can be filtered later
  const currentEvents = useMemo(() => {
    if (activeTab === 'my-events') {
      return mappedEvents
    }
    // TODO: Filter shared events when API supports it
    return []
  }, [activeTab, mappedEvents])

  const handleAddEvent = async (data: {
    title: string
    description?: string | null
    startDate?: string | null
    endDate?: string | null
    isDefault?: boolean
  }) => {
    if (!data.title.trim()) {
      addToast('Please enter an event title', 'error')
      return
    }

    try {
      await createEventMutation.mutateAsync({
        title: data.title.trim(),
        description: data.description || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        isDefault: data.isDefault || false,
      })
      addToast('Event created successfully', 'success')
      setIsModalOpen(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event'
      addToast(errorMessage, 'error')
    }
  }

  const handleEventClick = (eventId: string) => {
    const eventIdNum = parseInt(eventId, 10)
    if (!isNaN(eventIdNum)) {
      setSelectedEventId(eventIdNum)
    }
  }

  const handleBackToEvents = () => {
    setSelectedEventId(null)
  }

  // Get selected event data
  const selectedEvent = useMemo(() => {
    return weddingEvents.find(e => e.id === selectedEventId) || null
  }, [weddingEvents, selectedEventId])

  // Calculate stats from eventInfo
  const stats = useMemo(() => {
    if (!eventInfo) {
      return {
        bookings: { current: 0, total: 0, percentage: 0 },
        items: { current: 0, total: 0, percentage: 0 },
        guests: { current: 0, total: 0, percentage: 0 },
      }
    }

    const confirmedBookings = eventInfo.serviceBook?.completed || 0
    const totalBookings = (eventInfo.serviceBook?.lines?.length || 0) + (eventInfo.serviceBook?.pending || 0)
    const completedItems = eventInfo.itemBook?.completed || 0
    const totalItems = eventInfo.itemBook?.lines?.length || 0
    const invitedGuests = eventInfo.guestBook?.lines?.length || 0
    const maxGuests = 150 // TODO: Get from API when available

    return {
      bookings: {
        current: confirmedBookings,
        total: totalBookings || 1,
        percentage: totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0
      },
      items: {
        current: completedItems,
        total: totalItems || 1,
        percentage: totalItems > 0 ? (completedItems / totalItems) * 100 : 0
      },
      guests: {
        current: invitedGuests,
        total: maxGuests,
        percentage: (invitedGuests / maxGuests) * 100
      },
    }
  }, [eventInfo])

  // Budget statistics
  const budgetStats = useMemo(() => {
    if (!eventInfo?.budgetBook) {
      return { total: 0, paid: 0, remaining: 0, pending: 0, other: 0, actualRemaining: 0 }
    }

    const total = eventInfo.budgetBook.initialEstimated || 0
    const paid = 0 // TODO: Get from API when available
    const pending = 0 // TODO: Get from API when available
    const other = 0 // TODO: Get from API when available
    const remaining = total - paid
    const actualRemaining = remaining - pending - other

    return { total, paid, remaining, pending, other, actualRemaining }
  }, [eventInfo])

  // Budget chart data
  const budgetChartData = useMemo(() => [
    { label: 'Remaining', value: budgetStats.actualRemaining, color: '#E5E7EB' },
    { label: 'Paid', value: budgetStats.paid, color: '#059669' },
    { label: 'Pending', value: budgetStats.pending, color: '#F59E0B' },
    { label: 'Other', value: budgetStats.other, color: '#60A5FA' },
  ], [budgetStats])

  // Mock tasks (TODO: Get from todoBook when available)
  const mockTasks: Task[] = useMemo(() => [
    {
      id: '1',
      description: 'You must Go To Home & Prepare Everything For Wedding. You must Organize all items and check everything is ready.',
      dueDate: '2025-12-12',
      completed: true,
    },
    {
      id: '2',
      description: 'Finalize guest list and send invitations to all confirmed guests.',
      dueDate: '2025-12-10',
      completed: true,
    },
    {
      id: '3',
      description: 'Confirm all bookings and make final payments for services.',
      dueDate: '2025-12-15',
      completed: false,
    },
  ], [])

  // Mock bookings (TODO: Get from serviceBook when available)
  const upcomingBookings: Booking[] = useMemo(() => [
    {
      id: '1',
      title: 'Makeup Artist',
      providerUserName: 'Asmaa Mohamed',
      location: 'Olea, 6 Of October',
      date: '2025-12-12',
      time: '04:30 PM',
      status: 'pending',
      providerImage: '/placeholder-avatar.jpg',
      imageSrc: authHeroImage,
    },
    {
      id: '2',
      title: 'Photography',
      providerUserName: 'Photo Studio',
      location: 'Cairo',
      date: '2025-12-15',
      time: '10:00 AM',
      status: 'confirmed',
      providerImage: '/placeholder-avatar.jpg',
      imageSrc: authHeroImage,
    },
  ], [])

  // Build href with eventId for planning tabs
  const buildPlanningHref = (path: string) => {
    if (selectedEventId) {
      return `${path}?eventId=${selectedEventId}`
    }
    return path
  }

  // Get isBookInit status for each book type
  const getBookInitStatus = (bookType: string) => {
    if (!eventInfo) return false
    switch (bookType) {
      case 'budget':
        return eventInfo.budgetBook?.isBookInit ?? false
      case 'items':
        return eventInfo.itemBook?.isBookInit ?? false
      case 'occasion':
        return eventInfo.occasionBook?.isBookInit ?? false
      case 'preparations':
        return eventInfo.serviceBook?.isBookInit ?? false
      case 'todo':
        return eventInfo.todoBook?.isBookInit ?? false
      case 'invitation':
        return eventInfo.guestBook?.isBookInit ?? false
      case 'overview':
        return true // Overview doesn't have a book, always initialized
      default:
        return false
    }
  }

  // Planning tabs configuration with init status
  const planningTabs = [
    {
      label: 'overview',
      href: selectedEventId ? `/dashboard/my-events?eventId=${selectedEventId}` : '/dashboard/my-events',
      value: 'overview',
      needsInit: false // Overview doesn't have a book
    },
    {
      label: 'budget',
      href: buildPlanningHref('/events/planning/budget'),
      value: 'budget',
      needsInit: !getBookInitStatus('budget')
    },
    {
      label: 'items',
      href: buildPlanningHref('/events/planning/items'),
      value: 'items',
      needsInit: !getBookInitStatus('items')
    },
    {
      label: 'events',
      href: buildPlanningHref('/events/planning/events'),
      value: 'events',
      needsInit: false // Events doesn't have a book
    },
    {
      label: 'invitation',
      href: buildPlanningHref('/events/planning/invitation'),
      value: 'invitation',
      needsInit: !getBookInitStatus('invitation')
    },
    {
      label: 'occasions',
      href: buildPlanningHref('/events/planning/occasion'),
      value: 'occasion',
      needsInit: !getBookInitStatus('occasion')
    },
    {
      label: 'preparations',
      href: buildPlanningHref('/events/planning/preparations'),
      value: 'preparations',
      needsInit: !getBookInitStatus('preparations')
    },
    {
      label: 'ToDo',
      href: buildPlanningHref('/events/planning/todo'),
      value: 'todo',
      needsInit: !getBookInitStatus('todo')
    },
  ]

  // Get active tab based on current pathname (for when navigating to planning pages)
  const pathname = usePathname()
  const getActivePlanningTab = () => {
    if (pathname?.includes('/items')) return 'items'
    if (pathname?.includes('/budget')) return 'budget'
    if (pathname?.includes('/overview')) return 'overview'
    if (pathname?.includes('/events/planning/events')) return 'events'
    if (pathname?.includes('/invitation')) return 'invitation'
    if (pathname?.includes('/occasion')) return 'occasion'
    if (pathname?.includes('/preparations')) return 'preparations'
    if (pathname?.includes('/todo')) return 'todo'
    // When on my-events page with selected event, default to overview
    if (pathname?.includes('/my-events') && selectedEventId !== null) return 'overview'
    return 'overview'
  }

  const activePlanningTab = getActivePlanningTab()

  // If event is selected, show event info with overview and all books
  if (selectedEventId !== null) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToEvents}
            className="flex items-center gap-2"
          >
            ← Back to Events
          </Button>
        </div>

        {/* Planning Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className={cn(
            "flex flex-wrap items-center justify-center gap-y-2 gap-x-4 sm:gap-x-8 w-full",
            "grid grid-cols-2 sm:flex sm:justify-between"
          )}>
            {planningTabs.map(tab => {
              const isActive = activePlanningTab === tab.value

              // Handle tab click - if needs init, call init first then navigate
              const handleTabClick = async (e: MouseEvent<HTMLAnchorElement>) => {
                // Only handle init for occasion tab when it needs init
                if (tab.value === 'occasion' && tab.needsInit && selectedEventId) {
                  e.preventDefault()
                  try {
                    await handleBookInit('occasion')
                    // After init, navigate to the tab
                    router.push(tab.href)
                  } catch (error) {
                    console.error('Failed to initialize occasion book:', error)
                    // Still navigate even if init fails
                    router.push(tab.href)
                  }
                }
                // For other tabs or if no init needed, let Link handle navigation normally
              }

              return (
                <Link
                  key={tab.value}
                  href={tab.href}
                  onClick={handleTabClick}
                  className={cn(
                    'px-1 py-3 text-[13px] sm:text-14 font-medium transition-all duration-200 text-center relative shrink-0',
                    'focus-visible:outline-none w-full sm:w-auto flex items-center gap-2',
                    isActive
                      ? 'text-brand-600'
                      : 'text-gray-500 hover:text-gray-900'
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.needsInit && (
                    <span className={cn(
                      "px-1.5 py-0.5 text-10 font-medium rounded",
                      "bg-yellow-100 text-yellow-700"
                    )}>
                      Init
                    </span>
                  )}
                  {!tab.needsInit && tab.value !== 'overview' && tab.value !== 'events' && (
                    <span className={cn(
                      "px-1.5 py-0.5 text-10 font-medium rounded",
                      "bg-green-100 text-green-700"
                    )}>
                      ✓
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full animate-in fade-in slide-in-from-bottom-1" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Loading State */}
        {isMounted && isLoadingEventInfo && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading event details..." />
          </div>
        )}

        {/* Event Info with Overview and All Books */}
        {eventInfo && selectedEvent && !isLoadingEventInfo && (
          <div className="space-y-6 sm:space-y-8">
            {/* SECTION 1: Event Summary */}
            <div className="mb-6 sm:mb-8">
              <EventSummaryCard
                eventName={selectedEvent.title}
                eventDate={selectedEvent.startDate ? new Date(selectedEvent.startDate) : new Date()}
                imageSrc={authHeroImage}
              />
            </div>

            {/* SECTION 2: Quick Stats Cards */}
            <div className="mb-6 sm:mb-8">
              <div className={cn('grid gap-3 sm:gap-4', 'grid-cols-1', 'sm:grid-cols-3')}>
                <QuickStatsCard
                  title="Confirmed Booking"
                  current={stats.bookings.current}
                  total={stats.bookings.total}
                  percentage={stats.bookings.percentage}
                />
                <QuickStatsCard
                  title="Complete Lists"
                  current={stats.items.current}
                  total={stats.items.total}
                  percentage={stats.items.percentage}
                />
                <QuickStatsCard
                  title="Invite Your Guests"
                  current={stats.guests.current}
                  total={stats.guests.total}
                  percentage={stats.guests.percentage}
                />
              </div>
            </div>

            {/* SECTION 3: Tasks Reminder - Full Width */}
            <div className="mb-6 sm:mb-8">
              <TasksReminder tasks={mockTasks} />
            </div>

            {/* SECTION 4: Upcoming Bookings - Full Width */}
            <div className="mb-6 sm:mb-8">
              <UpcomingBookings bookings={upcomingBookings} imageSrc={authHeroImage} />
            </div>

            {/* SECTION 5: Budget & Guests - Two Columns */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 mb-6 sm:mb-8">
              <BudgetPayments
                total={budgetStats.total}
                remaining={budgetStats.remaining}
                chartData={budgetChartData}
              />
              <GuestsInvitation
                invitedGuests={stats.guests.current}
                remainingSeats={stats.guests.total}
                imageSrc={authHeroImage}
              />
            </div>

            {/* SECTION 6: Book Cards */}
            <div>
              <h2 className="text-24 font-semibold text-gray-900 mb-6">Planning Books</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventInfo.itemBook && (
                  <ItemBookCard
                    book={eventInfo.itemBook}
                    onInit={() => handleBookInit('item')}
                    onNavigate={() => handleBookNavigate('item')}
                    eventId={selectedEventId || undefined}
                  />
                )}
                {eventInfo.serviceBook && (
                  <PreparationCard
                    book={eventInfo.serviceBook}
                    onInit={() => handleBookInit('service')}
                    onNavigate={() => handleBookNavigate('service')}
                    eventId={selectedEventId || undefined}
                  />
                )}
                {eventInfo.budgetBook && (
                  <BudgetBookCard
                    book={eventInfo.budgetBook}
                    onInit={() => handleBookInit('budget')}
                    onNavigate={() => handleBookNavigate('budget')}
                    eventId={selectedEventId || undefined}
                  />
                )}
                {eventInfo.eventBook && (
                  <EventBookCard
                    book={eventInfo.eventBook}
                    onInit={() => handleBookInit('event')}
                    onNavigate={() => handleBookNavigate('event')}
                    eventId={selectedEventId || undefined}
                  />
                )}
                {eventInfo.guestBook && (
                  <GuestBookCard
                    book={eventInfo.guestBook}
                    onInit={() => handleBookInit('guest')}
                    onNavigate={() => handleBookNavigate('guest')}
                    eventId={selectedEventId || undefined}
                  />
                )}
                {eventInfo.noteBook && (
                  <NoteBookCard
                    book={eventInfo.noteBook}
                    onInit={() => handleBookInit('note')}
                    onNavigate={() => handleBookNavigate('note')}
                    eventId={selectedEventId || undefined}
                  />
                )}
                {eventInfo.todoBook && (
                  <TodoBookCard
                    book={eventInfo.todoBook}
                    onInit={() => handleBookInit('todo')}
                    onNavigate={() => handleBookNavigate('todo')}
                    eventId={selectedEventId || undefined}
                  />
                )}
                {eventInfo.occasionBook && (
                  <OccasionBookCard
                    book={eventInfo.occasionBook}
                    onInit={() => handleBookInit('occasion')}
                    onNavigate={() => handleBookNavigate('occasion')}
                    eventId={selectedEventId || undefined}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {isMounted && !eventInfo && !isLoadingEventInfo && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-16 text-red-600 mb-4">
              Failed to load event details. Please try again.
            </p>
            <Button variant="outline" onClick={handleBackToEvents}>
              Back to Events
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header with Tabs and Add Button */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between gap-6 sm:gap-8 w-full">
          {tabs.map(tab => {
            const isActive = activeTab === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as 'my-events' | 'shared-events')}
                className={cn(
                  'px-2 py-2 !text-14 font-normal transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-center w-full',
                  isActive
                    ? 'border-b-2 border-brand-500 text-gray-900'
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-900'
                )}
              >
                {tab.label}
              </button>
            )
          })}

          {/* Add New Event Button */}
          <Button
            variant="ghost"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-end gap-2 !text-14 font-normal text-brand-500 hover:text-brand-600 flex-shrink-0 lg:w-1/2"
          >
            <Plus className="size-4 sm:size-5" />
            Add New Event
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isMounted && isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading events..." />
        </div>
      )}

      {/* Error State */}
      {isMounted && error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-16 text-red-600 mb-4">
            Failed to load events. Please try again.
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Events Grid */}
      {isMounted && !isLoading && !error && (
        <>
          {currentEvents.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {currentEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event.id)}
                  className="cursor-pointer"
                >
                  <EventCard
                    eventName={event.eventName}
                    date={event.date}
                    time={event.time}
                    creatorName={event.creatorName}
                    creatorAvatar={event.creatorAvatar}
                    attendeeCount={event.attendeeCount}
                    attendeeAvatars={event.attendeeAvatars}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-16 text-gray-500 mb-4">
                {activeTab === 'my-events' ? 'No events found. Create your first event!' : 'No shared events found.'}
              </p>
              {activeTab === 'my-events' && (
                <Button
                  variant="brand"
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="size-4" />
                  Add New Event
                </Button>
              )}
            </div>
          )}
        </>
      )}

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEvent}
      />
    </div>
  )
}

export default function MyEventsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" text="Loading events..." />
          </div>
        </div>
      }
    >
      <MyEventsPageContent />
    </Suspense>
  )
}
