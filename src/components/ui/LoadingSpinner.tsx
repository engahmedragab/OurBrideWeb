'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18nTranslations } from '@/i18n/hooks'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
  fullScreen?: boolean
  open?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

/**
 * LoadingSpinner - Reusable loading spinner component
 * Can be used inline or as a full-screen loader
 */
export const LoadingSpinner = ({
  size = 'md',
  className,
  text,
  fullScreen = false,
  open,
}: LoadingSpinnerProps) => {
  const t = useI18nTranslations('common')
  
  // If open prop is provided and false, don't render
  if (open !== undefined && !open) {
    return null
  }

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-brand-500', sizeClasses[size])} />
      {text && (
        <p className="text-14 sm:text-16 text-gray-600 font-medium">{text || t('loading')}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="w-full min-h-[70vh] sm:min-h-[90vh] flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}

