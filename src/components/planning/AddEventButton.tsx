'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface AddEventButtonProps {
  onClick: () => void
  className?: string
}

export const AddEventButton = ({ onClick, className }: AddEventButtonProps) => {
  return (
    <div className={cn('fixed bottom-6 left-0 right-0 px-4 sm:px-6', className)}>
      <div className="max-w-5xl mx-auto">
        <Button
          onClick={onClick}
          variant="brand"
          size="lg"
          className="w-full rounded-lg"
        >
          <Plus className="h-5 w-5" />
          Add new Event
        </Button>
      </div>
    </div>
  )
}

