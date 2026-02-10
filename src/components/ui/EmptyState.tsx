'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './Button'

export interface EmptyStateProps {
  illustration?: string | { src: string } | ReactNode
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
  const getIllustrationSrc = () => {
    if (!illustration) return null
    if (typeof illustration === 'string') return illustration
    if (typeof illustration === 'object' && illustration !== null && 'src' in illustration) {
      return (illustration as { src: string }).src
    }
    return null
  }

  const illustrationSrc = getIllustrationSrc()
  const isReactNode = illustration && typeof illustration !== 'string' && (typeof illustration !== 'object' || illustration === null || !('src' in illustration))

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
    <div
      className={`flex flex-col items-center justify-center min-h-[60vh] py-12 ${className || ''}`}
    >
      {/* Illustration */}
      {illustrationSrc && (
        <div className="mb-8 flex items-center justify-center relative w-64 h-64">
          <Image
            src={illustrationSrc}
            alt={title}
            fill
            sizes="256px"
            className="object-contain"
          />
        </div>
      )}
      {isReactNode && (
        <div className="mb-8 flex items-center justify-center">
          {illustration}
        </div>
      )}

      {/* Primary Message */}
      <h2 className="text-24 font-semibold text-gray-900 mb-3 text-center">{title}</h2>

      {/* Secondary Message */}
      <p className="text-16 text-gray-600 mb-8 text-center max-w-md">
        {description}
      </p>

      {/* Action Button */}
      {actionButton}
    </div>
  )
}
