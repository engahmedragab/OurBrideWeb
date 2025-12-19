'use client'

import { useRouter } from 'next/navigation'
import { SectionHeader } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Plus, ArrowLeft } from 'lucide-react'
import { planningTypography } from './typography'

export interface PlanningServicesHeaderProps {
  onAdd: () => void
}

export const PlanningServicesHeader = ({
  onAdd,
}: PlanningServicesHeaderProps) => {
  const router = useRouter()

  const handleBack = () => {
    router.push('/events/planning/overview')
  }

  return (
    <div className="flex flex-row items-center justify-between gap-3 mb-8">
      <div className="flex items-center gap-3">
        {/* Back Arrow */}
        <button
          type="button"
          onClick={handleBack}
          className="flex-shrink-0 p-1.5 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
          aria-label="Back to overview"
        >
          <ArrowLeft className="h-5 w-5 text-gray-900" />
        </button>

        {/* Section Header - Aligned with arrow */}
        <SectionHeader
          title="Bookings"
          className="!mb-0 !pb-0 [&>div]:!mb-0 [&>div]:!pb-0 [&>div]:!justify-start [&>div>div]:!mb-0 [&_h2]:!mb-0 [&_h2]:!mt-0 [&_h2]:leading-none"
        />
      </div>
      <Button
        variant="brand"
        size="sm"
        onClick={onAdd}
        className={`px-3 py-3 md:px-6 md:py-5 ${planningTypography.body} rounded-full bg-primary text-white hover:bg-primary/90 flex-shrink-0 !text-12 md:!text-14`}
        aria-label="Add new preparation"
      >
        <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />
        Add new Preparation
      </Button>
    </div>
  )
}
