'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { Link } from '@/i18n/navigation'
import {
  PlanningMiniCalendar,
} from '@/components/events'
import { DayDetailsView } from '@/components/planning/DayDetailsView'
import { formatDateSafe, getToday } from '@/lib/date-utils'
import { ChevronLeft, Save } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button, LoadingOverlay, ErrorModal, LoadingSpinner } from '@/components/ui'
import { useEventBooks, useSyncEventBooks, useSyncEventBooksDelta } from '@/hooks/eventBooks'
import { useInitEventBooks } from '@/hooks/eventBooks/useInitEventBooks'
import { useEventId } from '@/hooks/planning'
import { useAddEventBookModels } from '@/hooks/bookInit'
import { usePlanningBookController, type SyncBookDeltaResponse } from '@/hooks/planning/usePlanningBookController'
import { useToast } from '@/components/ui/Toaster'
import { useIsRTL, useI18nTranslations } from '@/i18n/hooks'
import type { EventLine, EventLineCategory } from '@/../client/common/api/gen/ourbride-api'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'
import {
  type EventBookWithCategories,
  buildEventBookRequestFromLocal,
  convertLineToRequest,
  convertCategoryToRequest,
} from '@/utils/planning/mappers/eventsMappers'

/**
 * Convert date-time to day key (YYYY-MM-DD)
 */
const toDayKey = (dateTime: string | null | undefined): string => {
  if (!dateTime) return ''
  try {
    const date = new Date(dateTime)
    return formatDateSafe(date)
  } catch {
    return ''
  }
}


/**
 * Events Page Content
 * Displays the planning calendar with day details rendered in-place
 */
function EventsPageContent() {
  const { addToast } = useToast()
  const eventId = useEventId()
  const today = getToday()
  const isRtl = useIsRTL()
  const t = useI18nTranslations('eventsPlanning.sideMenu.tabs')
  const tEvents = useI18nTranslations('eventsPlanning.events')
  const [selectedDayId, setSelectedDayId] = useState(formatDateSafe(today))
  const [isMounted, setIsMounted] = useState(false)

  // Ensure we're mounted before enabling queries to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch event book (includes lines) - GET endpoint only
  const { data: eventBook, isLoading, error, refetch } = useEventBooks({
    eventId: eventId || undefined,
    userType: null as unknown as UserType | undefined,
    clientId: null as unknown as string | undefined,
    enabled: isMounted,
  })

  const syncMutation = useSyncEventBooks()
  const syncDeltaMutation = useSyncEventBooksDelta()
  const initMutation = useInitEventBooks()
  const addModelsMutation = useAddEventBookModels()

  const {
    localBook: localEventBook,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    save,
    applyLocalUpdate,
    getActiveCategories,
    getActiveLines,
    getCategoryById,
    isInitializing,
    isAddingModels,
  } = usePlanningBookController<EventBookWithCategories, EventLine, EventLineCategory>({
    book: eventBook as EventBookWithCategories | null,
    isLoading,
    eventId: eventId ?? undefined,
    requireEventId: true,
    syncFn: async (book) => {
      const bookRequest = buildEventBookRequestFromLocal(book)
      await syncMutation.mutateAsync({
        eventBook: bookRequest,
        params: {
          eventId: eventId || undefined,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        },
      })
      refetch()
    },
    syncDeltaFn: async (delta) => {
      const response = await syncDeltaMutation.mutateAsync({
        delta: delta as unknown as import('@/types/syncDelta').SyncBookDeltaRequest<import('@/../client/common/api/gen/ourbride-api').EventLineRequest, import('@/../client/common/api/gen/ourbride-api').EventLineCategoryRequest>,
        params: {
          eventId: eventId || undefined,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        },
      })
      return response as unknown as SyncBookDeltaResponse<EventBookWithCategories>
    },
    refetch,
    shouldInit: (b) => !b?.id,
    initFn: async () => {
      await initMutation.mutateAsync({
        eventId: eventId ?? undefined,
        userType: null as unknown as UserType | undefined,
        clientId: null as unknown as string | undefined,
      })
    },
    shouldAddModels: (b) => b?.isModelsAdd === false,
    addModelsFn: async () => {
      await addModelsMutation.mutateAsync({
        eventId: eventId ?? undefined,
        userType: null as unknown as UserType | undefined,
        clientId: null as unknown as string | undefined,
      })
    },
    initMutation,
    addModelsMutation,
    isSameBookBase: (current, last) =>
      current.id === last.id &&
      current.groomId === last.groomId &&
      current.brideId === last.brideId &&
      current.title === last.title &&
      current.clientName === last.clientName &&
      current.weddingDate === last.weddingDate &&
      current.eventLocation === last.eventLocation,
    getLines: (book) => book.lines || [],
    getCategories: (book) => {
      // If lineCategories exist, use them; otherwise extract from lines
      if (book.lineCategories && book.lineCategories.length > 0) {
        return book.lineCategories
      }
      // Extract categories from lines
      return (book.lines || [])
        .map(line => line.eventLineCategory)
        .filter((cat): cat is EventLineCategory => Boolean(cat))
        .filter((cat, index, self) =>
          // Remove duplicates by ID
          index === self.findIndex(c => c.id === cat.id)
        )
    },
    getLineId: (line) => line.id,
    getCategoryId: (cat) => cat.id,
    convertLineToRequest,
    convertCategoryToRequest,
    isSameLine: (current, last) =>
      current.time === last.time &&
      current.duration === last.duration &&
      current.nameEn === last.nameEn &&
      current.nameAr === last.nameAr &&
      current.descriptionEn === last.descriptionEn &&
      current.descriptionAr === last.descriptionAr &&
      current.lineCategoryId === last.lineCategoryId &&
      current.isDeleted === last.isDeleted &&
      current.isDone === last.isDone &&
      current.isFavorite === last.isFavorite &&
      Boolean(current.highlighted) === Boolean(last.highlighted),
    isSameCategory: (current, last) =>
      current.date === last.date &&
      current.name === last.name &&
      current.nameEn === last.nameEn &&
      current.nameAr === last.nameAr &&
      current.slug === last.slug &&
      current.isDeleted === last.isDeleted,
    getLineCategoryId: (line) => line.lineCategoryId ?? null,
    isLineDeleted: (line) => line.isDeleted ?? false,
    isLineDone: (line) => line.isDone ?? false,
    isCategoryDeleted: (cat) => cat.isDeleted ?? false,
  })

  // Get all active categories from controller
  const activeCategories = useMemo(() => {
    return getActiveCategories()
  }, [getActiveCategories])

  // Get event days with data: group by day and find category for each day
  const eventDaysWithData = useMemo(() => {
    const activeLines = getActiveLines()
    if (!activeLines.length || !activeCategories.length) return []

    // Get all unique days that have lines
    const daysWithLines = new Map<string, { dayId: string; category: EventLineCategory | null; lineDate: Date | null }>()

    activeLines
      .filter(line => line.time && line.lineCategoryId)
      .forEach(line => {
        const lineDayId = toDayKey(line.time)
        if (!lineDayId) return

        // If we haven't seen this day yet, add it
        if (!daysWithLines.has(lineDayId)) {
          // Find the category for this line using controller method
          const category = getCategoryById(line.lineCategoryId) as EventLineCategory | null
          const lineDate = line.time ? new Date(line.time) : null
          daysWithLines.set(lineDayId, { dayId: lineDayId, category, lineDate })
        }
      })

    // Convert to array and sort by date
    return Array.from(daysWithLines.values()).sort((a, b) => {
      const dateA = a.lineDate ? a.lineDate.getTime() : 0
      const dateB = b.lineDate ? b.lineDate.getTime() : 0
      return dateA - dateB
    })
  }, [getActiveLines, activeCategories, getCategoryById])

  // Auto-select first day with data if available (only once when data loads)
  useEffect(() => {
    if (eventDaysWithData.length > 0 && localEventBook && !isLoading && !isInitializing && !isAddingModels) {
      const firstDay = eventDaysWithData[0]
      if (firstDay.dayId && firstDay.dayId !== selectedDayId) {
        setSelectedDayId(firstDay.dayId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventDaysWithData.length, localEventBook?.id, isLoading, isInitializing, isAddingModels])

  // Get marked days set for calendar highlighting
  const markedDaysSet = useMemo(() => {
    return new Set(activeCategories.map(cat => toDayKey(cat.date)))
  }, [activeCategories])

  const eventDays = useMemo(() => {
    return Array.from(markedDaysSet)
  }, [markedDaysSet])

  const handleDateSelect = (date: Date) => {
    const safeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0)
    setSelectedDayId(formatDateSafe(safeDate))
  }

  const handleSave = async () => {
    const result = await save()
    if (!result.ok) {
      if (result.reason === 'loading' || result.reason === 'no-changes') {
        if (result.reason === 'no-changes') setHasUnsavedChanges(false)
        return
      }
      addToast(result.message || tEvents('toasts.failedToSave'), 'error')
      return
    }
    addToast(result.message || tEvents('toasts.changesSaved'), 'success')
  }

  // Loading State - Show loading only after mount to avoid hydration mismatch
  if (!isMounted || isLoading || isInitializing || isAddingModels) {
    const loadingTitle = !isMounted
      ? tEvents('loading.loadingEvents')
      : isInitializing
        ? tEvents('loading.initializingTitle')
        : isAddingModels
          ? tEvents('loading.addingModelsTitle')
          : tEvents('loading.loadingEvents')

    return (
      <div className="w-full sm:p-6 lg:p-8 flex items-center justify-center">
        <LoadingSpinner size="xl" fullScreen={true} open={true} text={loadingTitle}  />
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
        <ErrorModal
          open={true}
          title={tEvents('error.failedToLoadTitle')}
          message={tEvents('error.failedToLoadMessage')}
          onRetry={() => window.location.reload()}
          onClose={() => { }}
        />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen px-0 sm:px-2 lg:px-4 py-4 sm:py-6 lg:py-8">
      {/* Navigation Header */}
      <div className="mb-4">
        <Link
          href="/dashboard/my-events"
          className="flex items-center gap-3 text-gray-900 hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className={cn('h-5 w-5', isRtl ? 'rotate-180' : 'rotate-0')} />
          <h1 className="text-24 font-semibold text-gray-900">{t('events')}</h1>
        </Link>
      </div>

      {/* Save Row - directly under navigation */}
      {(hasUnsavedChanges || syncMutation.isPending) && (
        <div className="mb-4 flex items-center gap-3">
          <Button
            className="flex items-center gap-2 rounded-xl !text-white"
            onClick={handleSave}
            variant="brand"
            size="md"
            disabled={syncMutation.isPending || !localEventBook || isLoading}
            type="button"
          >
            <Save className="h-4 w-4" />
            {syncMutation.isPending ? tEvents('header.saving') : tEvents('header.saveChanges')}
          </Button>

          {hasUnsavedChanges && (
            <span className="text-16 text-brand-500 font-medium">{tEvents('header.unsavedChanges')}</span>
          )}
        </div>
      )}

      {/* Horizontal Scrollable Event Days List */}
      {eventDaysWithData.length > 0 && (
        <div className="mb-6">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-2 min-w-max">
              {eventDaysWithData.map((dayData) => {
                const isSelected = selectedDayId === dayData.dayId
                const categoryName = dayData.category
                  ? (dayData.category.nameEn || dayData.category.nameAr || dayData.category.name || tEvents('common.eventDay'))
                  : tEvents('common.eventDay')

                return (
                  <button
                    key={dayData.dayId}
                    onClick={() => setSelectedDayId(dayData.dayId)}
                    className={cn(
                      'flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all',
                      'min-w-[180px] text-left',
                      isSelected
                        ? 'bg-brand-50 border-brand-500 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div className="font-semibold text-14 text-gray-900 mb-1 line-clamp-1">
                      {categoryName}
                    </div>
                    {dayData.lineDate && (
                      <div className="text-12 text-gray-600">
                        {format(dayData.lineDate, 'MMM dd, yyyy')}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Single Layout with Responsive Order */}
      <div className="flex flex-col lg:grid lg:grid-cols-[70%_30%] gap-2">
        {/* Mini Calendar - Mobile: order-1 (top), Desktop: right sidebar */}
        <div className="order-1 lg:order-2 flex justify-center items-start px-0 sm:px-2 pb-3">
          <PlanningMiniCalendar
            value={selectedDayId}
            onChange={handleDateSelect}
            bigDay={eventDays.length > 0 ? eventDays : undefined}
          />
        </div>

        {/* Main Calendar Column - Mobile: order-2, Desktop: left column */}
        <div className="order-2 lg:order-1 flex flex-col gap-6">
          {/* Day Details */}
          <div className="bg-white shadow-[0px_0px_9px_0px_rgba(143,144,166,0.15)] p-5 rounded-3xl">
            <div className="overflow-x-auto">
              <DayDetailsView
                dayId={selectedDayId}
                localEventBook={localEventBook}
                applyLocalUpdate={applyLocalUpdate}
                eventId={eventId || undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Events Page
 * Wrapped in Suspense for useSearchParams compatibility
 */
export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <EventsPageContent />
    </Suspense>
  )
}
