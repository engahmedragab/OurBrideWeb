'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { parseISO } from 'date-fns'
import {
  ItineraryHeader,
  ItineraryList,
  AddEventButton,
  type ItineraryEvent,
} from '@/components/planning'
import { Button } from '@/components/ui/Button'

const BIG_DAY_STORAGE_KEY = 'ourbride_big_days'

const getBigDays = (): string[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(BIG_DAY_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
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
  const baseDate = new Date(parseISO(dayId))
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

export default function CalenderDayPage() {
  const params = useParams()
  const router = useRouter()
  const dayId = params?.dayId as string

  const [isBigDay, setIsBigDay] = useState(false)
  const [events, setEvents] = useState<ItineraryEvent[]>([])

  useEffect(() => {
    if (dayId) {
      const bigDays = getBigDays()
      const dayIsBigDay = bigDays.includes(dayId)
      setIsBigDay(dayIsBigDay)
      
      if (dayIsBigDay) {
        setEvents(createMockEvents(dayId))
      }
    }
  }, [dayId])

  const eventDate = dayId ? parseISO(dayId) : new Date()
  const eventTitle = isBigDay ? 'The Big Day' : undefined

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
      console.log('Add new event')
    }
  }

  const handleEditEvent = (event: ItineraryEvent) => {
    console.log('Edit event:', event)
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
    <div className="w-full min-h-screen bg-white pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/events/planning/calender')}
            className="text-14 text-brand-500 hover:text-brand-600 mb-4"
          >
            ← Back to Calendar
          </button>
        </div>

        <ItineraryHeader
          date={eventDate}
          eventTitle={eventTitle}
          onRefresh={handleRefresh}
          onSave={handleSave}
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
      </div>

      {isBigDay && <AddEventButton onClick={handleAddEvent} />}
    </div>
  )
}
