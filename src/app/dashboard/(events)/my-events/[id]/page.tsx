'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EventQRCode } from '@/components/events'
import { cn } from '@/lib/utils'

/**
 * Mock event data - Replace with API call
 */
interface EventDetails {
  id: string
  eventName: string
  qrData: string
  date: string
  time: string
  creatorName: string
}

/**
 * Event Details Page Component
 * Displays event details and QR code for sharing
 */
export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [event, setEvent] = useState<EventDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual API call
        // const response = await apiClient.get(`/events/${id}`)
        // setEvent(response.data)

        // Mock data for now
        const mockEvent: EventDetails = {
          id: id || '1',
          eventName: 'Aya Wedding',
          qrData: `https://ourbride.app/events/${id}`,
          date: '00/00/0000',
          time: '00:00 am',
          creatorName: 'Aya Mohamed',
        }
        setEvent(mockEvent)
      } catch (error) {
        console.error('Error fetching event details:', error)
        // TODO: Handle error appropriately
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchEventDetails()
    }
  }, [id])

  const handleEditClick = () => {
    // TODO: Implement edit functionality
    console.log('Edit event:', id)
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-16 text-gray-500">Loading event details...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-16 text-gray-500">Event not found</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Event Details Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-14 text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          ← Back to Events
        </button>
        <h1 className="text-24 font-semibold text-gray-900">{event.eventName}</h1>
        <p className="text-14 text-gray-500 mt-2">
          Created by {event.creatorName}
        </p>
      </div>

      {/* QR Code Component */}
      <div className="w-full max-w-md mx-auto">
        <EventQRCode
          qrData={event.qrData}
          showEditButton={true}
          onEditClick={handleEditClick}
        />
      </div>
    </div>
  )
}
