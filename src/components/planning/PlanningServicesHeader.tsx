'use client'

import { SectionHeader } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { planningTypography } from './typography'

export interface PlanningServicesHeaderProps {
  onAdd: () => void
}

export const PlanningServicesHeader = ({
  onAdd,
}: PlanningServicesHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-8">
      <div>
        <SectionHeader
          topText="Planning"
          highlightText="Services"
          alignment="left"
          className={`mb-0 text-2xl md:text-3xl lg:text-4xl pb-3 md:pb-0`}
        />
      </div>
      <Button
        variant="brand"
        size="sm"
        onClick={onAdd}
        className={`px-5 py-5 md:px-6 md:py-5 ${planningTypography.body} rounded-full bg-primary text-white hover:bg-primary/90 flex-shrink-0`}
        aria-label="Add new preparation"
      >
        <Plus className="h-5 w-5 md:h-4 md:w-4 mr-1.5" />
        Add new Preparation
      </Button>
    </div>
  )
}

