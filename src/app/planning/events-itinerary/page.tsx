'use client'

import { SectionHeader } from '@/components/ui'

export default function EventsPage() {
  return (
    <div className="w-full">
      <SectionHeader
        topText="Events"
        highlightText="Itinerary"
        alignment="center"
      />
      <div className="mt-8 text-center text-gray-500">
        <p className="text-16">Your events itinerary will appear here</p>
      </div>
    </div>
  )
}
