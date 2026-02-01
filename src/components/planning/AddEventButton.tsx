'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useI18nTranslations } from '@/i18n/hooks'

export interface AddEventButtonProps {
  onClick: () => void
  className?: string
}

export const AddEventButton = ({ onClick, className }: AddEventButtonProps) => {
 
  const t = useI18nTranslations('eventsPlanning.addEvent')
  return (
    <div className={cn(' px-4 sm:px-6', className)}>
      <div className="max-w-5xl mx-auto">
        <Button
          onClick={onClick}
          variant="brand"
          size="lg"
          className="w-full rounded-lg text-white"
        >
          <Plus className="h-5 w-5" />
          {t('modal.actions.addNewEvent')}
        </Button>
      </div>
    </div>
  )
}
 
