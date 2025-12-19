'use client'

import { useParams } from 'next/navigation'
import { DayDetailsView } from '@/components/planning/DayDetailsView'

/**
 * Calendar Day Page
 * Thin wrapper that renders DayDetailsView for a specific day
 */
export default function CalenderDayPage() {
  const params = useParams()
  const dayId = params?.dayId as string

  if (!dayId) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <p className="text-16 text-gray-500">Invalid day ID</p>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-white pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DayDetailsView dayId={dayId} showBackButton={true} />
      </div>
    </div>
  )
}
