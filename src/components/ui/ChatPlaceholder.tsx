'use client'

import { cn } from '@/lib/utils'

export interface ChatPlaceholderProps {
  message?: string
  className?: string
}

/**
 * ChatPlaceholder component
 * Displays a placeholder message when no conversation is selected
 */
export const ChatPlaceholder = ({
  message = 'Select a conversation to start',
  className,
}: ChatPlaceholderProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center h-full bg-white rounded-2xl border border-gray-200',
        className
      )}
    >
      <p className="text-14 sm:text-16 text-gray-500 px-4 text-center">
        {message}
      </p>
    </div>
  )
}
