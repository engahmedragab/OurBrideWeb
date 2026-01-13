'use client'

import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { Link } from '@/i18n/navigation'
import {
  PlanningMiniCalendar,
} from '@/components/events'
import { DayDetailsView } from '@/components/planning/DayDetailsView'
import { formatDateSafe, getToday } from '@/lib/date-utils'
import { ChevronLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useEventBooks, useSyncEventBooks, useGetEventBooksCategories } from '@/hooks/eventBooks'
import { useInitEventBooks } from '@/hooks/eventBooks/useInitEventBooks'
import { useEventId } from '@/hooks/planning'
import { useToast } from '@/components/ui/Toaster'
import type { UseMutationResult } from '@tanstack/react-query'
import type { EventBook, EventLine, EventLineCategory } from '@/../client/common/api/gen/ourbride-api'
import type { EventBookRequest, EventLineRequest, EventLineCategoryRequest, UserType } from '@/../client/common/api/gen/ourbride-api'

/**
 * Extended EventBook type with categories for local state management
 */
interface EventBookWithCategories extends EventBook {
  lineCategories?: EventLineCategory[] | null
}

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
 * Convert EventLine to EventLineRequest
 */
const convertLineToRequest = (line: EventLine, bookId: number): EventLineRequest => {
  return {
    id: line.id || null,
    bookId,
    lineCategoryId: line.lineCategoryId || null,
    lineCategoryCountId: line.lineCategoryCountId || null,
    lineCategorySlug: line.lineCategorySlug || null,
    time: line.time || undefined,
    duration: line.duration || undefined,
    name: line.nameEn || line.nameAr || null,
    desctiption: line.descriptionEn || line.descriptionAr || null,
    highlighted: Boolean(line.highlighted),
    isDone: Boolean(line.isDone),
    isFavorite: Boolean(line.isFavorite),
    isDeleted: Boolean(line.isDeleted),
    isModelLine: Boolean(line.isModelLine),
    brideId: line.brideId || null,
    groomId: line.groomId || null,
    creationDate: line.creationDate || null,
    lastModifiedDate: line.lastModifiedDate || null,
  }
}

/**
 * Convert EventLineCategory to EventLineCategoryRequest
 */
const convertCategoryToRequest = (category: EventLineCategory): EventLineCategoryRequest => {
  return {
    id: category.id || null,
    name: category.nameEn || category.nameAr || category.name || null,
    description: category.descriptionEn || category.descriptionAr || null,
    slug: category.slug || null,
    count_id: category.count_id || null,
    isDeleted: Boolean(category.isDeleted),
    isModelLine: Boolean(category.isModelLine),
    date: category.date || undefined,
    creationDate: category.creationDate || null,
    lastModifiedDate: category.lastModifiedDate || null,
  }
}

/**
 * Build EventBookRequest from local EventBook state
 */
const buildEventBookRequestFromLocal = (localEventBook: EventBookWithCategories): EventBookRequest => {
  const allLines = (localEventBook.lines || []).map(line =>
    convertLineToRequest(line, localEventBook.id)
  )
  const allCategories = (localEventBook.lineCategories || []).map(category =>
    convertCategoryToRequest(category)
  )

  return {
    id: localEventBook.id,
    groomId: localEventBook.groomId || null,
    brideId: localEventBook.brideId || null,
    weddingPlannerId: localEventBook.weddingPlannerId || null,
    bookType: localEventBook.bookType,
    bookClass: localEventBook.bookClass,
    title: localEventBook.title || null,
    clientName: localEventBook.clientName || null,
    weddingDate: localEventBook.weddingDate || null,
    eventLocation: localEventBook.eventLocation || null,
    lines: allLines,
    lineCategories: allCategories.length > 0 ? allCategories : null,
    lastModifiedDate: new Date().toISOString(),
  }
}

/**
 * Check if there are actual changes between current state and last synced state
 */
const hasActualChanges = (
  localEventBook: EventBookWithCategories | null,
  lastSyncedRef: EventBookWithCategories | null
): boolean => {
  if (!localEventBook) {
    return false
  }

  if (!lastSyncedRef) {
    return true
  }

  const current = localEventBook
  const lastSynced = lastSyncedRef

  // Compare basic book properties
  if (
    current.id !== lastSynced.id ||
    current.groomId !== lastSynced.groomId ||
    current.brideId !== lastSynced.brideId ||
    current.title !== lastSynced.title ||
    current.clientName !== lastSynced.clientName ||
    current.weddingDate !== lastSynced.weddingDate ||
    current.eventLocation !== lastSynced.eventLocation
  ) {
    return true
  }

  // Compare categories
  const currentCategories = current.lineCategories || []
  const lastSyncedCategories = lastSynced.lineCategories || []

  if (currentCategories.length !== lastSyncedCategories.length) {
    return true
  }

  for (let i = 0; i < currentCategories.length; i++) {
    const currentCategory = currentCategories[i]
    const lastSyncedCategory = lastSyncedCategories.find(c => c.id === currentCategory.id)

    if (!lastSyncedCategory) {
      return true
    }

    if (
      currentCategory.date !== lastSyncedCategory.date ||
      currentCategory.name !== lastSyncedCategory.name ||
      currentCategory.nameEn !== lastSyncedCategory.nameEn ||
      currentCategory.nameAr !== lastSyncedCategory.nameAr ||
      currentCategory.slug !== lastSyncedCategory.slug ||
      currentCategory.isDeleted !== lastSyncedCategory.isDeleted
    ) {
      return true
    }
  }

  // Compare lines
  const currentLines = current.lines || []
  const lastSyncedLines = lastSynced.lines || []

  if (currentLines.length !== lastSyncedLines.length) {
    return true
  }

  for (let i = 0; i < currentLines.length; i++) {
    const currentLine = currentLines[i]
    const lastSyncedLine = lastSyncedLines.find(l => l.id === currentLine.id)

    if (!lastSyncedLine) {
      return true
    }

    if (
      currentLine.time !== lastSyncedLine.time ||
      currentLine.duration !== lastSyncedLine.duration ||
      currentLine.nameEn !== lastSyncedLine.nameEn ||
      currentLine.nameAr !== lastSyncedLine.nameAr ||
      currentLine.descriptionEn !== lastSyncedLine.descriptionEn ||
      currentLine.descriptionAr !== lastSyncedLine.descriptionAr ||
      currentLine.lineCategoryId !== lastSyncedLine.lineCategoryId ||
      currentLine.isDeleted !== lastSyncedLine.isDeleted ||
      currentLine.isDone !== lastSyncedLine.isDone ||
      currentLine.isFavorite !== lastSyncedLine.isFavorite ||
      Boolean(currentLine.highlighted) !== Boolean(lastSyncedLine.highlighted)
    ) {
      return true
    }
  }

  return false
}

/**
 * Events Page Content
 * Displays the planning calendar with day details rendered in-place
 */
function EventsPageContent() {
  const { addToast } = useToast()
  const eventId = useEventId()
  const today = getToday()
  const [selectedDayId, setSelectedDayId] = useState(formatDateSafe(today))

  // Local state to keep the book in memory
  const [localEventBook, setLocalEventBook] = useState<EventBookWithCategories | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const lastSyncedRef = useRef<EventBookWithCategories | null>(null)
  const isInitialLoadRef = useRef(true)
  const hasInitAttemptedRef = useRef(false)

  // Fetch event book (includes lines) - GET endpoint only
  const { data: eventBook, isLoading, refetch } = useEventBooks({
    eventId: eventId || undefined,
    userType: null as unknown as UserType | undefined,
    clientId: null as unknown as string | undefined,
    enabled: typeof window !== 'undefined',
  })

  const syncMutation = useSyncEventBooks()
  const initMutation = useInitEventBooks()

  // Fetch categories from server (mandatory - do NOT derive from lines)
  const { data: categoriesData, refetch: refetchCategories } = useGetEventBooksCategories({
    clientId: null as unknown as string | undefined,
    enabled: typeof window !== 'undefined' && Boolean(eventId),
  })

  // Determine if book is initialized (same pattern as Occasions: check if book?.id exists)
  const isBookInit = Boolean(eventBook?.id)

  // On first load, use the book from GET endpoint immediately
  // Categories source of truth: categories from GET /categories endpoint (do NOT derive from lines)
  useEffect(() => {
    if (isInitialLoadRef.current && eventBook && !localEventBook) {
      // Use categories from GET /categories endpoint, not from eventBook
      const initialBook: EventBookWithCategories = {
        ...eventBook,
        lineCategories: categoriesData ?? [],
      }
      setLocalEventBook(initialBook)
      lastSyncedRef.current = initialBook
      isInitialLoadRef.current = false
    }
  }, [eventBook, localEventBook, categoriesData])

  // Initialize book if missing (same pattern as Occasions would use)
  useEffect(() => {
    // If eventId is missing → do nothing
    if (!eventId) {
      return
    }

    // If the book is already initialized (book?.id exists) → do nothing
    if (isBookInit) {
      return
    }

    // If already attempted init (hasInitAttemptedRef.current === true) → do nothing
    if (hasInitAttemptedRef.current) {
      return
    }

    // Skip if still loading
    if (isLoading) {
      return
    }

    // Skip if mutation is already in progress
    if (initMutation.isPending) {
      return
    }

    // Set the ref guard to true
    hasInitAttemptedRef.current = true

    // Call init mutation
    const initializeBook = async () => {
      try {
        await initMutation.mutateAsync({
          eventId,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        })
        // On success: trigger refetch (same timing and style as Occasions)
        refetch()
        // Also refetch categories after init
        refetchCategories()
      } catch (error) {
        // On failure: follow the same error handling as Occasions
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize event book'
        addToast(errorMessage, 'error')
        // Allow retry by resetting the ref (same behavior as Occasions would allow)
        hasInitAttemptedRef.current = false
      }
    }

    initializeBook()
  }, [eventId, isBookInit, isLoading, initMutation, refetch, refetchCategories, addToast])

  // Sync fetched data to local state when it changes (only if no unsaved changes)
  // Categories source of truth: categories from GET /categories endpoint (do NOT derive from lines)
  // CRITICAL: Do NOT extract categories from lines - Event Day categories exist independently
  useEffect(() => {
    if (eventBook && !hasUnsavedChanges && !isInitialLoadRef.current) {
      // Use categories from GET /categories endpoint, preserve local if categories not loaded yet
      const updatedBook: EventBookWithCategories = {
        ...eventBook,
        lineCategories: categoriesData ?? localEventBook?.lineCategories ?? [],
      }
      setLocalEventBook(updatedBook)
      lastSyncedRef.current = updatedBook
    } else if (eventBook === null && !isLoading && !hasUnsavedChanges) {
      setLocalEventBook(null)
    }
  }, [eventBook, hasUnsavedChanges, isLoading, categoriesData, localEventBook?.lineCategories])

  // After sync, update local state from refetched data
  // Use categories from GET /categories endpoint, do NOT rebuild from lines
  // CRITICAL: Do NOT extract categories from lines - Event Day categories exist independently
  useEffect(() => {
    if (eventBook && !hasUnsavedChanges && syncMutation.isSuccess) {
      // Refetch categories after sync to get latest from server
      refetchCategories()
      // Use categories from GET /categories endpoint
      const updatedBook: EventBookWithCategories = {
        ...eventBook,
        lineCategories: categoriesData ?? localEventBook?.lineCategories ?? [],
      }
      setLocalEventBook(updatedBook)
      lastSyncedRef.current = updatedBook
      isInitialLoadRef.current = false
    }
  }, [eventBook, hasUnsavedChanges, syncMutation.isSuccess, categoriesData, localEventBook?.lineCategories, refetchCategories])

  // Auto-sync every 2 minutes (only if there are actual changes)
  useEffect(() => {
    if (!eventId || !localEventBook || hasUnsavedChanges) return

    const interval = setInterval(async () => {
      try {
        if (!hasActualChanges(localEventBook, lastSyncedRef.current)) {
          return
        }

        const bookRequest = buildEventBookRequestFromLocal(localEventBook)
        await syncMutation.mutateAsync({
          eventBook: bookRequest,
          params: {
            eventId: eventId || undefined,
            userType: null as unknown as UserType | undefined,
            clientId: null as unknown as string | undefined,
          },
        })
        lastSyncedRef.current = localEventBook
        refetch()
      } catch {
        // Auto-sync failed silently
      }
    }, 2 * 60 * 1000) // 2 minutes

    return () => clearInterval(interval)
  }, [eventId, localEventBook, hasUnsavedChanges, syncMutation, refetch])

  // Get active categories (not deleted, slug === "event-day" or "big day" for backward compatibility)
  const activeCategories = useMemo(() => {
    if (!localEventBook?.lineCategories) return []
    return localEventBook.lineCategories.filter(
      cat => !cat.isDeleted && (cat.slug === 'event-day' || cat.slug === 'big day')
    )
  }, [localEventBook])

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
    if (!localEventBook) {
      if (isLoading) {
        addToast('Please wait while the event book is loading...', 'info')
        return
      }
      addToast('Event book not found. Please refresh the page.', 'error')
      return
    }

    if (!hasActualChanges(localEventBook, lastSyncedRef.current)) {
      addToast('No changes to save', 'info')
      setHasUnsavedChanges(false)
      return
    }

    try {
      const bookRequest = buildEventBookRequestFromLocal(localEventBook)
      await syncMutation.mutateAsync({
        eventBook: bookRequest,
        params: {
          eventId: eventId || undefined,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        },
      })
      // On success: follow Occasions pattern exactly
      setHasUnsavedChanges(false)
      lastSyncedRef.current = localEventBook
      addToast('Changes saved successfully', 'success')
      // Refetch to get latest from server (same as Occasions)
      refetch()
      // Also refetch categories after sync (categories are managed separately)
      refetchCategories()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save changes'
      addToast(errorMessage, 'error')
    }
  }

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Navigation Header */}
      <div className="mb-4">
        <Link
          href="/dashboard/my-events"
          className="flex items-center gap-3 text-gray-900 hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="h-5 w-5" />
          <h1 className="text-24 font-semibold text-gray-900">Event</h1>
        </Link>
      </div>

      {/* Save Row - directly under navigation */}
      {hasUnsavedChanges && (
        <div className="mb-4 flex items-center gap-3">
          <Button
            className="text-white rounded-xl"
            onClick={handleSave}
            variant="brand"
            size="md"
            disabled={syncMutation.isPending}
          >
            <Save className="w-5 h-5 mr-2" />
            Save
          </Button>
          <span className="text-14 text-brand-500">Unsaved changes</span>
        </div>
      )}

      {/* Single Layout with Responsive Order */}
      <div className="flex flex-col lg:grid lg:grid-cols-[70%_30%] gap-2">
        {/* Mini Calendar - Mobile: order-1 (top), Desktop: right sidebar */}
        <div className="order-1 lg:order-2  flex justify-center items-start px-4 pb-3">
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
                setLocalEventBook={setLocalEventBook}
                hasUnsavedChanges={hasUnsavedChanges}
                setHasUnsavedChanges={setHasUnsavedChanges}
                eventId={eventId || undefined}
                onCategoriesRefetch={async () => {
                  const refetchedCategories = await refetchCategories()
                  if (refetchedCategories.data) {
                    setLocalEventBook(prev => {
                      if (!prev) return prev
                      return {
                        ...prev,
                        lineCategories: refetchedCategories.data ?? [],
                      }
                    })
                  }
                }}
                onSync={handleSave}
                syncMutation={syncMutation as UseMutationResult<unknown, Error, unknown, unknown>}
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
