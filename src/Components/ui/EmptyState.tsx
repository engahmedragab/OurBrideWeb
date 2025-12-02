'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from './Button'

export interface EmptyStateProps {
  illustration: string | { src: string }
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

export const EmptyState = ({
  illustration,
  title,
  description,
  actionLabel = 'Start Shopping',
  actionHref = '/',
  onAction,
  className,
}: EmptyStateProps) => {
  const illustrationSrc = typeof illustration === 'string' ? illustration : illustration.src

  const actionButton = actionHref ? (
    <Link href={actionHref}>
      <Button variant="brand" size="lg" className="text-white">
        {actionLabel}
      </Button>
    </Link>
  ) : onAction ? (
    <Button variant="brand" size="lg" className="text-white" onClick={onAction}>
      {actionLabel}
    </Button>
  ) : null

  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] py-12 ${className || ''}`}>
      {/* Illustration */}
      <div className="mb-8 flex items-center justify-center">
        <img
          src={illustrationSrc}
          alt={title}
          className="w-64 h-64 object-contain"
        />
      </div>

      {/* Primary Message */}
      <h2 className="text-24 font-semibold text-gray-900 mb-3">
        {title}
      </h2>

      {/* Secondary Message */}
      <p className="text-16 text-gray-600 mb-8 text-center max-w-md">
        {description}
      </p>

      {/* Action Button */}
      {actionButton}
    </div>
  )
}

