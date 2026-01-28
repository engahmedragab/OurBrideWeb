'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useI18nTranslations } from '@/i18n/hooks'
import { useIsRTL } from '@/i18n/hooks'
import { cn } from '@/lib'

interface GuestsHeaderProps {
  onRefresh: () => void
}

export const GuestsHeader = ({ onRefresh }: GuestsHeaderProps) => {
  const t = useI18nTranslations('eventsPlanning.guestList.common')
  const isRTL = useIsRTL()
  const router = useRouter()

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Go back"
          type="button"
        >
          <ArrowLeft className={cn("h-5 w-5 text-gray-700", isRTL ? "rotate-180" : "rotate-0")} />
        </button>
        <h1 className="text-24 font-semibold text-gray-900">{t('pageTitle')}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          className="text-gray-600 hover:text-gray-900"
          aria-label="Refresh"
          type="button"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
