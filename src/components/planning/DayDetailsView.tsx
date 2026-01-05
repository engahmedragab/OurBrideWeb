'use client'

import { useState, useMemo } from 'react'
import {
  ItineraryHeader,
  AddEventModal,
  EditEventModal,
  ConfirmDialog,
  type ItineraryEvent,
} from '@/components/planning'
import { Button } from '@/components/ui/Button'
import { Clock, Trash2 } from 'lucide-react'
import { parseDateSafe, formatDateSafe } from '@/lib/date-utils'
import { format } from 'date-fns'
import {
  useCreateEventBookCategory,
  useDeleteEventBookCategory,
} from '@/hooks/eventBooks'
import { useToast } from '@/components/ui/Toaster'
import type {
  EventBook,
  EventLine,
  EventLineCategory,
} from '@/../client/common/api/gen/ourbride-api'
import type { UseMutationResult } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

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
 * Make category date from day key (midnight for that day)
 */
const makeCategoryDateFromDayKey = (dayKey: string): string => {
  try {
    const [year, month, day] = dayKey.split('-').map(Number)
    const date = new Date(year, month - 1, day, 0, 0, 0, 0)
    return date.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

/**
 * Calculate minutes between two date-time strings
 */
const minutesBetween = (
  start: string | null | undefined,
  end: string | null | undefined
): number => {
  if (!start || !end) return 0
  try {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffMs = endDate.getTime() - startDate.getTime()
    return Math.round(diffMs / (1000 * 60))
  } catch {
    return 0
  }
}

/**
 * Hourly Timeline View Component
 * Displays hourly slots from 7 AM to 12 AM (midnight)
 */
interface HourlyTimelineViewProps {
  events: ItineraryEvent[]
  onEmptySlotClick: (hour: number) => void
  onEventClick: (event: ItineraryEvent) => void
  onDelete: (event: ItineraryEvent) => void
}

const HourlyTimelineView = ({
  events,
  onEmptySlotClick,
  onEventClick,
  onDelete,
}: HourlyTimelineViewProps) => {
  // Generate hours from 7 AM (7) to 12 AM (midnight, which is 0)
  // Hours: 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0
  const hours = [...Array.from({ length: 17 }, (_, i) => i + 7), 0] // 7-23, then 0

  // Map events to hour slots
  const getEventForHour = (hour: number): ItineraryEvent | null => {
    return (
      events.find(event => {
        const eventHour = event.startTime.getHours()
        return eventHour === hour
      }) || null
    )
  }

  const formatHourLabel = (hour: number): string => {
    const nextHour = hour === 23 ? 0 : hour + 1
    const period1 = hour >= 12 ? 'PM' : 'AM'
    const period2 = nextHour >= 12 ? 'PM' : 'AM'
    const displayHour1 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    const displayHour2 =
      nextHour > 12 ? nextHour - 12 : nextHour === 0 ? 12 : nextHour
    return `${displayHour1} ${period1} - ${displayHour2} ${period2}`
  }

  const formatTimeRange = (startTime: Date, duration: number): string => {
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000)
    return `${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`
  }

  return (
    <div className="w-full space-y-3">
      {hours.map(hour => {
        const event = getEventForHour(hour)
        const isEmpty = !event

        return (
          <div key={hour} className="flex gap-4 items-center">
            {/* Left column: Hour label */}
            <div className="w-32 flex-shrink-0">
              <p className="text-12 text-gray-500">{formatHourLabel(hour)}</p>
            </div>

            {/* Right column: Event card slot */}
            <div
              className={cn(
                'flex-1 rounded-lg border transition-colors cursor-pointer',
                isEmpty
                  ? 'bg-white border-gray-200 hover:border-gray-300'
                  : 'bg-brand-50 border-brand-200 border-l-4 border-primary'
              )}
              onClick={() => {
                if (isEmpty) {
                  onEmptySlotClick(hour)
                } else {
                  onEventClick(event)
                }
              }}
            >
              {isEmpty ? (
                <div className="p-4 min-h-[60px] flex items-center">
                  <p className="text-14 text-gray-400">Click to add event</p>
                </div>
              ) : (
                <div className="p-4 relative">
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      onDelete(event)
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-600"
                    aria-label="Delete event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <h3 className="text-16 font-semibold text-gray-900 mb-2 pr-8">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-14 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatTimeRange(event.startTime, event.duration)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export interface DayDetailsViewProps {
  dayId: string
  showBackButton?: boolean
  className?: string
  localEventBook: EventBookWithCategories | null
  setLocalEventBook: (
    book:
      | EventBookWithCategories
      | null
      | ((
          prev: EventBookWithCategories | null
        ) => EventBookWithCategories | null)
  ) => void
  hasUnsavedChanges: boolean
  setHasUnsavedChanges: (value: boolean) => void
  onSync: () => Promise<void>
  syncMutation: UseMutationResult<unknown, Error, unknown, unknown>
  eventId?: number
  onCategoriesRefetch?: () => void
}

/**
 * DayDetailsView Component
 * Reusable component for displaying day details with itinerary management
 */
export const DayDetailsView = ({
  dayId,
  className,
  localEventBook,
  setLocalEventBook,
  setHasUnsavedChanges,
  onCategoriesRefetch,
}: DayDetailsViewProps) => {
  const { addToast } = useToast()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ItineraryEvent | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [prefilledTime, setPrefilledTime] = useState<string>('')
  const [prefilledDuration, setPrefilledDuration] = useState<string>('')

  const createCategoryMutation = useCreateEventBookCategory()
  const deleteCategoryMutation = useDeleteEventBookCategory()

  // Get active categories (not deleted, slug === "event-day" or "big day" for backward compatibility)
  const activeCategories = useMemo(() => {
    if (!localEventBook?.lineCategories) return []
    return localEventBook.lineCategories.filter(
      cat =>
        !cat.isDeleted && (cat.slug === 'event-day' || cat.slug === 'big day')
    )
  }, [localEventBook])

  // Get selected category for selected day
  const selectedCategory = useMemo(() => {
    return activeCategories.find(cat => toDayKey(cat.date) === dayId)
  }, [activeCategories, dayId])

  const isEventDay = Boolean(selectedCategory)
  const customTitle =
    selectedCategory?.nameEn ||
    selectedCategory?.nameAr ||
    selectedCategory?.name ||
    ''

  // Get visible lines for selected category (sorted by time, exclude deleted)
  const visibleLines = useMemo(() => {
    if (!selectedCategory || !localEventBook?.lines) return []
    const lines = localEventBook.lines.filter(
      line => line.lineCategoryId === selectedCategory.id && !line.isDeleted
    )
    return lines.sort((a, b) => {
      const timeA = a.time ? new Date(a.time).getTime() : 0
      const timeB = b.time ? new Date(b.time).getTime() : 0
      return timeA - timeB
    })
  }, [selectedCategory, localEventBook])

  // Convert EventLine to ItineraryEvent
  const events: ItineraryEvent[] = useMemo(() => {
    return visibleLines.map(line => {
      const startTime = line.time ? new Date(line.time) : new Date()
      const duration = minutesBetween(line.time, line.duration)
      return {
        id: String(line.id),
        startTime,
        title: line.nameEn || line.nameAr || '',
        duration,
      }
    })
  }, [visibleLines])

  const eventDate = dayId ? parseDateSafe(dayId) : new Date()
  const eventTitle = isEventDay ? customTitle || 'Event Day' : undefined

  const handleTitleEdit = (newTitle: string) => {
    if (!localEventBook || !selectedCategory) return

    setLocalEventBook(prev => {
      if (!prev) return prev
      return {
        ...prev,
        lineCategories:
          prev.lineCategories?.map(cat =>
            cat.id === selectedCategory.id
              ? { ...cat, name: newTitle.trim(), nameEn: newTitle.trim() }
              : cat
          ) || [],
      }
    })
    setHasUnsavedChanges(true)
  }

  const handleDeleteEventDay = () => {
    if (!selectedCategory) return
    // Open confirmation dialog
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    setIsDeleteConfirmOpen(false)
    handleToggleEventDay()
  }

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false)
  }

  const handleToggleEventDay = async () => {
    if (!localEventBook) return

    if (isEventDay && selectedCategory) {
      // Unmark: delete category via DELETE endpoint
      if (!selectedCategory.id || selectedCategory.id <= 0) {
        // If category has no real ID, just remove from local state
        setLocalEventBook(prev => {
          if (!prev) return prev
          return {
            ...prev,
            lineCategories: (prev.lineCategories || []).filter(
              cat => cat.id !== selectedCategory.id
            ),
          }
        })
        setHasUnsavedChanges(false)
        return
      }

      try {
        await deleteCategoryMutation.mutateAsync({
          lineCategoryId: selectedCategory.id,
          params: {
            clientId: null as unknown as string | undefined,
          },
        })
        // On success: refetch categories and update local state
        if (onCategoriesRefetch) {
          onCategoriesRefetch()
        }
        setHasUnsavedChanges(false)
        addToast('Event Day deleted successfully', 'success')
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to delete Event Day'
        addToast(errorMessage, 'error')
      }
    } else {
      // Mark: check if category already exists for this day (prevent duplicates)
      const existingCategory = (localEventBook.lineCategories || []).find(
        cat => {
          const catDayKey = toDayKey(cat.date)
          return (
            (cat.slug === 'event-day' || cat.slug === 'big day') &&
            catDayKey === dayId &&
            cat.isDeleted !== true
          )
        }
      )

      if (existingCategory && existingCategory.id && existingCategory.id > 0) {
        // Category already exists with real ID, just reactivate if needed
        setLocalEventBook(prev => {
          if (!prev) return prev
          return {
            ...prev,
            lineCategories: (prev.lineCategories || []).map(cat =>
              cat.id === existingCategory.id
                ? {
                    ...cat,
                    isDeleted: false,
                    name: 'Event Day',
                    nameEn: 'Event Day',
                    slug: 'event-day',
                  }
                : cat
            ),
          }
        })
        setHasUnsavedChanges(true)
      } else {
        // Mark: create new category via POST endpoint
        const categoryDate = makeCategoryDateFromDayKey(dayId)
        const categoryRequest = {
          name: 'Event Day',
          slug: 'event-day',
          date: categoryDate,
          isDeleted: false,
        }

        try {
          await createCategoryMutation.mutateAsync({
            category: categoryRequest,
            params: {
              clientId: null as unknown as string | undefined,
            },
          })
          // On success: refetch categories to get the created category with real ID
          if (onCategoriesRefetch) {
            onCategoriesRefetch()
          }
          setHasUnsavedChanges(false)
          addToast('Event Day marked successfully', 'success')
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to mark Event Day'
          addToast(errorMessage, 'error')
        }
      }
    }
  }

  const handleEmptySlotClick = (hour: number) => {
    if (!isEventDay) {
      handleToggleEventDay()
      return
    }
    // Pre-fill time and duration for this hour slot
    const timeString = `${hour.toString().padStart(2, '0')}:00`
    setPrefilledTime(timeString)
    setPrefilledDuration('60') // 1 hour = 60 minutes
    setIsAddModalOpen(true)
  }

  const handleCreateEvent = (eventData: {
    startTime: Date
    title: string
    duration: number
  }) => {
    if (!localEventBook || !selectedCategory) return

    const endTime = new Date(
      eventData.startTime.getTime() + eventData.duration * 60 * 1000
    )
    const newLine: EventLine = {
      id: 0, // Temporary ID for new lines
      bookId: localEventBook.id,
      lineCategoryId: selectedCategory.id,
      time: eventData.startTime.toISOString(),
      duration: endTime.toISOString(),
      nameEn: eventData.title,
      descriptionEn: '',
      highlighted: false,
      isDone: false,
      isFavorite: false,
      isDeleted: false,
      isModelLine: false,
      creationDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      createdBy: '',
      lastModifiedBy: '',
    }

    setLocalEventBook(prev => {
      if (!prev) return prev
      return {
        ...prev,
        lines: [...(prev.lines || []), newLine],
      }
    })
    setHasUnsavedChanges(true)
  }

  const handleEditEvent = (event: ItineraryEvent) => {
    setEditingEvent(event)
    setIsEditModalOpen(true)
  }

  const handleUpdateEvent = (
    eventId: string,
    eventData: { startTime: Date; title: string; duration: number }
  ) => {
    if (!localEventBook) return

    const lineId = parseInt(eventId, 10)
    const endTime = new Date(
      eventData.startTime.getTime() + eventData.duration * 60 * 1000
    )

    setLocalEventBook(prev => {
      if (!prev) return prev
      return {
        ...prev,
        lines:
          prev.lines?.map(line => {
            if (line.id === lineId) {
              return {
                ...line,
                time: eventData.startTime.toISOString(),
                duration: endTime.toISOString(),
                nameEn: eventData.title,
                lastModifiedDate: new Date().toISOString(),
              }
            }
            return line
          }) || [],
      }
    })
    setHasUnsavedChanges(true)
  }

  const handleDeleteEvent = (event: ItineraryEvent) => {
    if (!localEventBook) return

    const lineId = parseInt(event.id, 10)
    setLocalEventBook(prev => {
      if (!prev) return prev
      return {
        ...prev,
        lines:
          prev.lines?.map(line =>
            line.id === lineId ? { ...line, isDeleted: true } : line
          ) || [],
      }
    })
    setHasUnsavedChanges(true)
  }

  const handleRefresh = () => {
    // Refresh handled by parent component
  }

  return (
    <div className={className}>
      <ItineraryHeader
        date={eventDate}
        eventTitle={eventTitle}
        onRefresh={handleRefresh}
        onEditTitle={isEventDay ? handleTitleEdit : undefined}
        onDelete={isEventDay ? handleDeleteEventDay : undefined}
      />

      {!isEventDay && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-16 text-gray-700 mb-4">
            This day is not marked as Event Day yet.
          </p>
          <Button
            onClick={handleToggleEventDay}
            variant="brand"
            size="md"
            className="text-white"
            disabled={!localEventBook}
          >
            Mark as Event Day
          </Button>
        </div>
      )}

      {isEventDay && (
        <div className="mt-6">
          <HourlyTimelineView
            events={events}
            onEmptySlotClick={handleEmptySlotClick}
            onEventClick={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        </div>
      )}

      <AddEventModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        baseDate={eventDate}
        onCreate={handleCreateEvent}
        initialTime={prefilledTime}
        initialDuration={prefilledDuration}
      />

      <EditEventModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        baseDate={eventDate}
        event={editingEvent}
        onUpdate={handleUpdateEvent}
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        title="Delete Event Day?"
        description="Are you sure you want to delete this Event Day? This will remove all events scheduled for this day."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}
