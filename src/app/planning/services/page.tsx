'use client'

import { SectionHeader } from '@/components/ui'

export default function ServicesPage() {
  return (
    <div className="w-full">
      <SectionHeader
        topText="Planning"
        highlightText="Services"
        alignment="center"
      />
      <div className="mt-8 text-center text-gray-500">
        <p className="text-16">Your planning services will appear here</p>
      </div>
    </div>
  )
}
