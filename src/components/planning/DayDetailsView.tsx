'use client'

import { useState, useEffect } from 'react'
import {
  ItineraryHeader,
  ItineraryList,
  AddEventButton,
  AddEventModal,
  EditEventModal,
  type ItineraryEvent,
} from '@/components/planning'
import { Button } from '@/components/ui/Button'
import { parseDateSafe } from '@/lib/date-utils'

const BIG_DAY_STORAGE_KEY = 'ourbride_big_days'
const CUSTOM_TITLES_STORAGE_KEY = 'ourbride_custom_titles'

const getBigDays = (): string[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(BIG_DAY_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

const getCustomTitles = (): Record<string, string> => {
  if (typeof window === 'undefined') return {}
  const stored = localStorage.getItem(CUSTOM_TITLES_STORAGE_KEY)
  return stored ? JSON.parse(stored) : {}
}

const saveCustomTitle = (dayId: string, title: string) => {
  if (typeof window === 'undefined') return
  const titles = getCustomTitles()
  if (title.trim()) {
    titles[dayId] = title.trim()
  } else {
    delete titles[dayId]
  }
  localStorage.setItem(CUSTOM_TITLES_STORAGE_KEY, JSON.stringify(titles))
}

const saveBigDay = (dayId: string, isBigDay: boolean) => {
  if (typeof window === 'undefined') return
  const bigDays = getBigDays()
  if (isBigDay) {
    if (!bigDays.includes(dayId)) {
      localStorage.setItem(BIG_DAY_STORAGE_KEY, JSON.stringify([...bigDays, dayId]))
    }
  } else {
    localStorage.setItem(BIG_DAY_STORAGE_KEY, JSON.stringify(bigDays.filter(d => d !== dayId)))
  }
}

const createMockEvents = (dayId: string): ItineraryEvent[] => {
  const baseDate = parseDateSafe(dayId)
  return [
    {
      id: '1',
      startTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 8, 0, 0),
      title: 'Wake Up, Shower',
      duration: 40,
    },
    {
      id: '2',
      startTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 9, 10, 0),
      title: 'Hair and makeup',
      duration: 120,
    },
    {
      id: '3',
      startTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 11, 10, 0),
      title: 'Everyone gets dressed',
      duration: 30,
    },
    {
      id: '4',
      startTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 11, 40, 0),
      title: 'Lunch or Snack',
      duration: 20,
    },
    {
      id: '5',
      startTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 13, 15, 0),
      title: 'Photographer Arrives',
      duration: 15,
    },
    {
      id: '6',
      startTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 13, 30, 0),
      title: 'Photo Session',
      duration: 60,
    },
  ]
}

export interface DayDetailsViewProps {
  dayId: string
  showBackButton?: boolean
  className?: string
}

/**
 * DayDetailsView Component
 * Reusable component for displaying day details with itinerary management
 */
export const DayDetailsView = ({
  dayId,
  showBackButton = false,
  className,
}: DayDetailsViewProps) => {
  const [isBigDay, setIsBigDay] = useState(false)
  const [customTitle, setCustomTitle] = useState<string>('')
  const [events, setEvents] = useState<ItineraryEvent[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ItineraryEvent | null>(null)

  useEffect(() => {
    if (dayId) {
      const bigDays = getBigDays()
      const dayIsBigDay = bigDays.includes(dayId)
      setIsBigDay(dayIsBigDay)
      
      // Load custom title if exists
      const titles = getCustomTitles()
      setCustomTitle(titles[dayId] || '')
      
      if (dayIsBigDay) {
        setEvents(createMockEvents(dayId))
      }
    }
  }, [dayId])

  const eventDate = dayId ? parseDateSafe(dayId) : new Date()
  // Use custom title if exists, otherwise default to "Big Day" if it's a big day
  const eventTitle = isBigDay ? (customTitle || 'Big Day') : undefined

  const handleTitleEdit = (newTitle: string) => {
    if (isBigDay && dayId) {
      setCustomTitle(newTitle)
      saveCustomTitle(dayId, newTitle)
    }
  }

  const handleToggleBigDay = () => {
    const newIsBigDay = !isBigDay
    setIsBigDay(newIsBigDay)
    saveBigDay(dayId, newIsBigDay)
    
    if (newIsBigDay && dayId) {
      setEvents(createMockEvents(dayId))
    } else {
      setEvents([])
    }
  }

  const handleAddEvent = () => {
    if (!isBigDay) {
      handleToggleBigDay()
    } else {
      setIsAddModalOpen(true)
    }
  }

  const handleCreateEvent = (eventData: { startTime: Date; title: string; duration: number }) => {
    const newEvent: ItineraryEvent = {
      id: Date.now().toString(),
      startTime: eventData.startTime,
      title: eventData.title,
      duration: eventData.duration,
    }
    
    setEvents(prev => {
      const updated = [...prev, newEvent]
      return updated.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    })
  }

  const handleEditEvent = (event: ItineraryEvent) => {
    setEditingEvent(event)
    setIsEditModalOpen(true)
  }

  const handleUpdateEvent = (eventId: string, eventData: { startTime: Date; title: string; duration: number }) => {
    setEvents(prev => {
      const updated = prev.map(e => 
        e.id === eventId 
          ? { ...e, ...eventData }
          : e
      )
      return updated.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    })
  }

  const handleDeleteEvent = (event: ItineraryEvent) => {
    setEvents(prev => prev.filter(e => e.id !== event.id))
  }

  const handleRefresh = () => {
    console.log('Refresh itinerary')
  }

  const handleSave = () => {
    console.log('Save itinerary')
  }

  return (
    <div className={className}>
      <ItineraryHeader
        date={eventDate}
        eventTitle={eventTitle}
        onRefresh={handleRefresh}
        onSave={handleSave}
        showBackButton={showBackButton}
        onEditTitle={isBigDay ? handleTitleEdit : undefined}
      />

      {!isBigDay && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-16 text-gray-700 mb-4">
            This day is not marked as Big Day yet.
          </p>
          <Button
            onClick={handleToggleBigDay}
            variant="brand"
            size="md"
            className='text-white'
          >
            Mark as Big Day
          </Button>
        </div>
      )}

      {isBigDay && (
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-14 text-gray-600">Big Day is active</p>
            <Button
              onClick={handleToggleBigDay}
              variant="outlineBrand"
              size="sm"
            >
              Unmark Big Day
            </Button>
          </div>
          <ItineraryList
            events={events}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        </div>
      )}

      {isBigDay && <AddEventButton onClick={handleAddEvent} className='lg:w-1/2 mx-auto py-4'/>}
      
      <AddEventModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        baseDate={eventDate}
        onCreate={handleCreateEvent}
      />
      
      <EditEventModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        baseDate={eventDate}
        event={editingEvent}
        onUpdate={handleUpdateEvent}
      />
    </div>
  )
}

