'use client'

import { SectionHeader } from '@/components/ui'

export default function overviewPage() {
  return (
    <div className="w-full">
      <SectionHeader
        topText="overview"
        highlightText="List"
        alignment="center"
      />
      <div className="mt-8 text-center text-gray-500">
        <p className="text-16">Your overview section will appear here</p>
      </div>
    </div>
  )
}
