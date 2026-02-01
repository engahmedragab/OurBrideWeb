'use client'

import { useState, useMemo, useEffect, Suspense, type MouseEvent } from 'react'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { ArrowLeftIcon, Plus } from 'lucide-react'
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
import { EventCard, AddEventModal } from '@/components/events'
import { ErrorModal } from '@/components/ui/ErrorModal'
import { Button, LoadingOverlay, LoadingSpinner } from '@/components/ui'
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
import { PlanningSideMenu } from '@/components/planning'
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
  ItemsOverview,
  NotesOverview,
  OccasionsOverview,
} from '@/components/overviews'
import authHeroImage from '@/assets/images/authHero.jpg'
import { useI18nTranslations, useIsRTL } from '@/i18n/hooks'

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
  const t = useI18nTranslations('eventsPlanning.overview')
  const isRTL = useIsRTL()
 
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState<'my-events' | 'shared-events'>('my-events')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isInitializingTab, setIsInitializingTab] = useState<string | null>(null)

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
    if (pathname?.includes('/notes')) return 'noteBook'
    // When on my-events page with selected event, default to overview
    if (pathname?.includes('/my-events') && selectedEventId !== null) return 'overview'
    return 'overview'
  }

  const activePlanningTab = getActivePlanningTab()

  // Fetch event info for selected event - Always load to show correct tab indicators
  // Individual tabs will fetch their own book data
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


  // Helper function to map tab value to book type
  const getBookTypeFromTabValue = (tabValue: string): 'item' | 'service' | 'budget' | 'event' | 'guest' | 'note' | 'todo' | 'occasion' | null => {
    switch (tabValue) {
      case 'items':
        return 'item'
      case 'preparations':
        return 'service'
      case 'budget':
        return 'budget'
      case 'events':
        return 'event'
      case 'invitation':
        return 'guest'
      case 'noteBook':
        return 'note'
      case 'todo':
        return 'todo'
      case 'occasion':
        return 'occasion'
      default:
        return null
    }
  }

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
    bookType: 'item' | 'service' | 'budget' | 'event' | 'guest' | 'note' | 'todo' | 'occasion' | 'noteBook'
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
      noteBook: '/events/planning/notes',
    }
    router.push(`${routes[bookType]}?eventId=${selectedEventId}`)
  }

  const tabs = [
    { value: 'my-events', label: t('tabsHeader.myEvents') },
    { value: 'shared-events', label: t('tabsHeader.sharedEvents') },
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
      addToast(t('toasts.enterTitle'), 'error')
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
      addToast(t('toasts.createdSuccess'), 'success')
      setIsModalOpen(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('toasts.createFailed')
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

  // Tasks from todoBook (not used, kept for future reference)
  // const tasks = useMemo(() => {
  //   if (!eventInfo?.todoBook?.lines) return []
  //   // TODO: Map todoBook lines to Task format when API structure is available
  //   return []
  // }, [eventInfo])

  // Bookings from serviceBook (not used, kept for future reference)
  // const upcomingBookings = useMemo(() => {
  //   if (!eventInfo?.serviceBook?.lines) return []
  //   // TODO: Map serviceBook lines to Booking format when API structure is available
  //   return []
  // }, [eventInfo])

  // Build href with eventId for planning tabs
  const buildPlanningHref = (path: string) => {
    if (selectedEventId) {
      return `${path}?eventId=${selectedEventId}`
    }
    return path
  }

  // Get isBookInit status for each book type
  // Always try to get from eventInfo if available, otherwise assume needs init
  const getBookInitStatus = (bookType: string) => {
    // If eventInfo is not loaded, we can't determine status - assume needs init
    if (!eventInfo) {
      return false // Needs init
    }
    switch (bookType) {
      case 'budget':
        return eventInfo.budgetBook?.isBookInit ?? false
      case 'items':
        return eventInfo.itemBook?.isBookInit ?? false
      case 'events':
        return eventInfo.eventBook?.isBookInit ?? false
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
      case 'noteBook':
        return eventInfo.noteBook?.isBookInit ?? false
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
      needsInit: false, // Overview doesn't have a book
      icon: LayoutDashboard
    },
    {
      label: 'budget',
      href: buildPlanningHref('/events/planning/budget'),
      value: 'budget',
      needsInit: !getBookInitStatus('budget'),
      icon: Wallet
    },
    {
      label: 'items',
      href: buildPlanningHref('/events/planning/items'),
      value: 'items',
      needsInit: !getBookInitStatus('items'),
      icon: Package
    },
    {
      label: 'events',
      href: buildPlanningHref('/events/planning/events'),
      value: 'events',
      needsInit: !getBookInitStatus('events'),
      icon: Calendar
    },
    {
      label: 'invitation',
      href: buildPlanningHref('/events/planning/invitation'),
      value: 'invitation',
      needsInit: !getBookInitStatus('invitation'),
      icon: Mail
    },
    {
      label: 'occasions',
      href: buildPlanningHref('/events/planning/occasion'),
      value: 'occasion',
      needsInit: !getBookInitStatus('occasion'),
      icon: Sparkles
    },
    {
      label: 'preparations',
      href: buildPlanningHref('/events/planning/preparations'),
      value: 'preparations',
      needsInit: !getBookInitStatus('preparations'),
      icon: Sparkles
    },
    {
      label: 'ToDo',
      href: buildPlanningHref('/events/planning/todo'),
      value: 'todo',
      needsInit: !getBookInitStatus('todo'),
      icon: CheckSquare
    },
    {
      label: 'notes',
      href: buildPlanningHref('/events/planning/notes'),
      value: 'noteBook',
      needsInit: !getBookInitStatus('noteBook'),
      icon: FileText
    },
  ]

  const handlePlanningTabClick = async (
    tab: { label: string; href: string; value: string; needsInit?: boolean },
    e: MouseEvent<HTMLAnchorElement>
  ) => {
    // If tab needs initialization, prevent default navigation and init first
    if (tab.needsInit && selectedEventId) {
      e.preventDefault()
      const bookType = getBookTypeFromTabValue(tab.value)

      if (bookType) {
        setIsInitializingTab(tab.value)
        try {
          await handleBookInit(bookType)
          // After init, navigate to the tab
          router.push(tab.href)
        } catch (error) {
          console.error(`Failed to initialize ${tab.value} book:`, error)
          const errorMessage = error instanceof Error ? error.message : `Failed to initialize ${tab.label}`
          addToast(errorMessage, 'error')
          // Still navigate even if init fails
          router.push(tab.href)
        } finally {
          setIsInitializingTab(null)
        }
      } else {
        // If no book type mapping, just navigate
        router.push(tab.href)
      }
    }
    // For tabs that don't need init, let Link handle navigation normally
  }

  // Check if any book initialization is in progress
  const isAnyInitPending =
    initItemBooks.isPending ||
    initServiceBooks.isPending ||
    initBudgetBooks.isPending ||
    initEventBooks.isPending ||
    initGuestBooks.isPending ||
    initNoteBooks.isPending ||
    initTodoBooks.isPending ||
    initOccasionBooks.isPending ||
    isInitializingTab !== null

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
            <ArrowLeftIcon className={cn("w-4 h-4", isRTL ? 'rotate-180' : '')} />
            {t('actions.backToEvents')}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="order-2 lg:order-1 flex-1 min-w-0">
            {/* Loading State for Event Info - Only show on overview tab */}
            {isMounted && isLoadingEventInfo && activePlanningTab === 'overview' && (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" text={t('loading.eventDetails')} />
              </div>
            )}

            {/* Loading State for Book Initialization - Only show on overview tab */}
            {isMounted && isAnyInitPending && !isLoadingEventInfo && activePlanningTab === 'overview' && (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" text={isInitializingTab ? `${t('loading.settingUpBook', { book: planningTabs.find(t => t.value === isInitializingTab)?.label || 'book' })}...` : t('loading.pleaseWait')} />
                 
                 
               
                
              </div>
            )}

            {/* Event Info with Overview and All Books - Only show on overview tab */}
            {activePlanningTab === 'overview' && eventInfo && selectedEvent && !isLoadingEventInfo && !isAnyInitPending && (
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
                      title={t('stats.completedServices')}
                      book={eventInfo.serviceBook}
                      eventId={selectedEventId || undefined}
                    />
                    <QuickStatsCard
                      title={t('stats.completeLists')}
                      book={eventInfo.todoBook}
                      eventId={selectedEventId || undefined}

                    />
                    <ItemsOverview
                      book={eventInfo.itemBook}
                      onInit={() => handleBookInit('item')}
                      onNavigate={() => handleBookNavigate('item')}
                      eventId={selectedEventId || undefined}
                    />
                    {/* <QuickStatsCard
                  title="Invite Your Guests"
                  book={eventInfo.guestBook} 
                  eventId={selectedEventId || undefined}
                /> */}
                  </div>
                </div>

                {/* SECTION 3: Tasks Reminder - Full Width */}
                <div className="mb-6 sm:mb-8">
                  <TasksReminder
                    
                    book={eventInfo.todoBook}
                    onInit={() => handleBookInit('todo')}
                    onNavigate={() => handleBookNavigate('todo')}
                    eventId={selectedEventId || undefined} />
                </div> 

                {/* SECTION 4: Upcoming Bookings - Full Width */}
                <div className="mb-6 sm:mb-8">
                  <UpcomingBookings
                    book={eventInfo.serviceBook}
                    onInit={() => handleBookInit('service')}
                    onNavigate={() => handleBookNavigate('service')}
                    eventId={selectedEventId || undefined}
                    imageSrc={authHeroImage} />
                </div>

                {/* SECTION 5: Budget & Guests - Two Columns */}
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 mb-6 sm:mb-8">
                  <BudgetPayments
                    book={eventInfo.budgetBook}
                    onInit={() => handleBookInit('budget')}
                    onNavigate={() => handleBookNavigate('budget')}
                    eventId={selectedEventId || undefined}
                  />
                  <GuestsInvitation
                    book={eventInfo.guestBook}
                    onInit={() => handleBookInit('guest')}
                    onNavigate={() => handleBookNavigate('guest')}
                    eventId={selectedEventId || undefined}
                    imageSrc={authHeroImage}
                  />
                </div>

                {/* SECTION 6: Items, Notes & Occasions - Three Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start mb-6 sm:mb-8">
                  {/* <div className="self-start h-fit">
    <ItemsOverview
      book={eventInfo.itemBook}
      onInit={() => handleBookInit('item')}
      onNavigate={() => handleBookNavigate('item')}
      eventId={selectedEventId || undefined}
    />
  </div> */}

                  <div className="self-start h-fit">
                    <NotesOverview
                      book={eventInfo.noteBook}
                      onInit={() => handleBookInit('note')}
                      onNavigate={() => handleBookNavigate('note')}
                      eventId={selectedEventId || undefined}
                    />
                  </div>

                  <div className="self-start h-fit">
                    <OccasionsOverview
                      book={eventInfo.occasionBook}
                      onInit={() => handleBookInit('occasion')}
                      onNavigate={() => handleBookNavigate('occasion')}
                      eventId={selectedEventId || undefined}
                    />
                  </div>
                </div>


                {/* SECTION 6: Book Cards */}
                {/* <div>
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
            </div> */}
              </div>
            )}

            {/* Error State - Only show on overview tab */}
            {isMounted && activePlanningTab === 'overview' && !eventInfo && !isLoadingEventInfo && (
              <div className="flex flex-col items-center justify-center py-12">
                <ErrorModal
                  open={true}
                  title={t('errors.loadEventDetailsTitle')}
                  message={t('errors.loadEventDetailsMessage')}
                  onRetry={() => window.location.reload()}
                  onClose={handleBackToEvents}
                />
              </div>
            )}
          </div>
          <aside className="order-1 lg:order-2 lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-6">
              <PlanningSideMenu
                tabs={planningTabs}
                activeValue={activePlanningTab}
                isInitializingTab={isInitializingTab}
                onTabClick={handlePlanningTabClick}
              />
            </div>
          </aside>
        </div>
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
            {t('actions.addNewEvent')}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isMounted && isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoadingOverlay open={true} title={t('loading.events')} />
        </div>
      )}

      {/* Error State */}
      {isMounted && error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <ErrorModal
            open={true}
            title={t('errors.loadEventsTitle')}
            message={t('errors.loadEventsMessage')}
            onRetry={() => window.location.reload()}
            onClose={() => { }}
          />
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
                {activeTab === 'my-events' ? t('empty.noMyEvents') : t('empty.noSharedEvents')}
              </p>
              {activeTab === 'my-events' && (
                <Button
                  variant="brand"
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="size-4" />
                  {t('actions.addNewEvent')}
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
          <LoadingSpinner  size="lg" />
        </div>
      }
    >
      <MyEventsPageContent />
    </Suspense>
  )
}
