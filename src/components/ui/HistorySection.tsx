'use client'

import { ReactNode } from 'react'
import { useI18nTranslations, useIsRTL } from '@/i18n'

export interface HistorySectionProps {
  title: string
  itemCount: number
  suffix?: string
  onClearHistory?: () => void
  children: ReactNode
  className?: string
}

export const HistorySection = ({
  title, 
  itemCount,
  suffix,
  onClearHistory,
  children,
  className,
}: HistorySectionProps) => {
  const t = useI18nTranslations('historySection')
  const isRTL = useIsRTL()
  return (
    <section dir={isRTL ? 'rtl' : 'ltr'} className={`mt-12 ${className || ''}`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-32 font-semibold text-gray-900">{title}</h2>
          {suffix && (
            <p className="text-16 text-gray-600 mt-2">
              {itemCount} {suffix}
            </p>
          )}
        </div>
        {onClearHistory && (
          <button
            onClick={onClearHistory}
            className="text-16 font-medium text-brand-500 hover:text-brand-600 transition-colors"
          >
            {t('clear')}
          </button>
        )}
      </div>

      <div className="space-y-6">{children}</div>
    </section>
  )
}
