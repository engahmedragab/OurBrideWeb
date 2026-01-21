'use client'

import { LoadingSpinner } from './LoadingSpinner'

export interface GlobalLoaderProps {
  isLoading: boolean
  text?: string
}

/**
 * GlobalLoader - System-wide loading component
 * Uses the same LoadingSpinner as products pages
 */
export function GlobalLoader({ isLoading, text = 'Loading...' }: GlobalLoaderProps) {
  if (!isLoading) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] min-h-screen bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} fullScreen={true} />
    </div>
  )
}
