import { DayDetailsView } from '@/components/planning/DayDetailsView'
import { formatDateSafe } from '@/lib/date-utils'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of day IDs to pre-generate at build time
  // Generate the next 30 days from today
  const today = new Date()
  const days: { dayId: string }[] = []

  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push({ dayId: formatDateSafe(date) })
  }

  return days
}

/**
 * Calendar Day Page
 * Thin wrapper that renders DayDetailsView for a specific day
 */
export default async function CalenderDayPage({
  params,
}: {
  params: Promise<{ dayId: string }>
}) {
  const { dayId } = await params

  if (!dayId) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-16 text-gray-500">Invalid day ID</p>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DayDetailsView dayId={dayId} showBackButton={true} />
      </div>
    </div>
  )
}
