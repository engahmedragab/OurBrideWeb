'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { EventCard, AddEventModal } from '@/components/events'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

/**
 * Mock data for events
 */
const mockMyEvents = [
  {
    id: '1',
    eventName: 'Aya Wedding',
    date: '00/00/0000',
    time: '00:00 am',
    creatorName: 'Aya Mohamed',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    attendeeCount: 8,
    attendeeAvatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    ],
  },
  {
    id: '2',
    eventName: 'Aya Wedding',
    date: '00/00/0000',
    time: '00:00 am',
    creatorName: 'Aya Mohamed',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    attendeeCount: 8,
    attendeeAvatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    ],
  },
  {
    id: '3',
    eventName: 'Aya Wedding',
    date: '00/00/0000',
    time: '00:00 am',
    creatorName: 'Aya Mohamed',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    attendeeCount: 8,
    attendeeAvatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    ],
  },
  {
    id: '4',
    eventName: 'Aya Wedding',
    date: '00/00/0000',
    time: '00:00 am',
    creatorName: 'Aya Mohamed',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    attendeeCount: 8,
    attendeeAvatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    ],
  },
]

const mockSharedEvents = [
  {
    id: '5',
    eventName: 'Sarah\'s Wedding',
    date: '15/12/2024',
    time: '06:00 pm',
    creatorName: 'Sarah Ahmed',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    attendeeCount: 12,
    attendeeAvatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    ],
  },
  {
    id: '6',
    eventName: 'Mona\'s Engagement',
    date: '20/12/2024',
    time: '08:00 pm',
    creatorName: 'Mona Ali',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    attendeeCount: 5,
    attendeeAvatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    ],
  },
]

/**
 * My Events Page Component
 * Displays user's events and shared events with tabs
 */
export default function MyEventsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'my-events' | 'shared-events'>('my-events')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tabs = [
    { value: 'my-events', label: 'My Events' },
    { value: 'shared-events', label: 'Shared Events' },
  ]

  const currentEvents = activeTab === 'my-events' ? mockMyEvents : mockSharedEvents

  const handleAddEvent = (eventName: string, eventCode?: string) => {
    // TODO: Implement API call to create event or join with code
    console.log('Creating event:', { eventName, eventCode })
  }

  const handleEventClick = (eventId: string) => {
    router.push('/dashboard/calendar')
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

      {/* Events Grid */}
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

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEvent}
      />
    </div>
  )
}
