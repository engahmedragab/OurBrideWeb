'use client'

import { SectionHeader } from '@/components/ui'

export default function calenderPage() {
  return (
    <div className="w-full">
      <SectionHeader
        topText="Calender"
        highlightText="Itinerary"
        alignment="center"
      />
      <div className="mt-8 text-center text-gray-500">
        <p className="text-16">Your calender itinerary will appear here</p>
      </div>
    </div>
  )
}
