'use client'

import { SectionHeader } from '@/components/ui'

export default function BookingsPage() {
  return (
    <div className="w-full">
      <SectionHeader
        topText="Bookings"
        highlightText="Services"
        alignment="center"
      />
      <div className="mt-8 text-center text-gray-500">
        <p className="text-16">Your planning booking will appear here</p>
      </div>
    </div>
  )
}
