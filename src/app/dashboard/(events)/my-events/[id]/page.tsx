'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

/**
 * EventDetailsPage
 * Redirects to the events/planning overview page with the event ID
 * This integrates the event details page with the events/planning structure
 * The planning pages will use the eventId from query params to load event-specific data
 */
export default function EventDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params?.id as string

  useEffect(() => {
    if (eventId) {
      // Redirect to my-events with the event ID selected
      router.replace(`/dashboard/my-events?eventId=${eventId}`)
    } else {
      // If no event ID, redirect to my-events list
      router.replace('/dashboard/my-events')
    }
  }, [eventId, router])

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-16 text-gray-600">Loading event planning...</p>
      </div>
    </div>
  )
}
