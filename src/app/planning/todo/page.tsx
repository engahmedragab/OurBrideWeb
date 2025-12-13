'use client'

import { SectionHeader } from '@/components/ui'

export default function TodosPage() {
  return (
    <div className="w-full">
      <SectionHeader
        topText="Wedding"
        highlightText="To Do"
        bottomText="List"
        alignment="center"
      />
      <div className="mt-8 text-center text-gray-500">
        <p className="text-16">Your to-do list will appear here</p>
      </div>
    </div>
  )
}
