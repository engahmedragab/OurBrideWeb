'use client'

import { cn } from '@/lib/utils'
import { useI18nTranslations } from '@/i18n/hooks'

export interface ChatPlaceholderProps {
  message?: string
  className?: string
}

/**
 * ChatPlaceholder component
 * Displays a placeholder message when no conversation is selected
 */
export const ChatPlaceholder = ({
  message,
  className,
}: ChatPlaceholderProps) => {
  const t = useI18nTranslations('messages')
  const displayMessage = message || t('chat.placeholder')
  
  return (
    <div
      className={cn(
        'flex items-center justify-center h-full bg-white rounded-2xl border border-gray-200',
        className
      )}
    >
      <p className="text-14 sm:text-16 text-gray-500 px-4 text-center">
        {displayMessage}
      </p>
    </div>
  )
}

