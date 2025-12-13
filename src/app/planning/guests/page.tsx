'use client'

import { SectionHeader } from '@/components/ui'

export default function GuestsPage() {
  return (
    <div className="w-full">
      <SectionHeader
        topText="Guest"
        highlightText="List"
        alignment="center"
      />
      <div className="mt-8 text-center text-gray-500">
        <p className="text-16">Your guest list will appear here</p>
      </div>
    </div>
  )
}
