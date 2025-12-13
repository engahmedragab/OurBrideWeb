'use client'

import { SectionHeader } from '@/components/ui'

export default function BudgetPage() {
  return (
    <div className="w-full">
      <SectionHeader
        topText="Wedding"
        highlightText="Budget"
        bottomText="Planning"
        alignment="center"
      />
      <div className="mt-8 text-center text-gray-500">
        <p className="text-16">Your budget planning will appear here</p>
      </div>
    </div>
  )
}
