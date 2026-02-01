'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronLeft } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'
import { useIsRTL } from '@/i18n/hooks'

export interface BackButtonProps {
  href?: string
  onClick?: () => void
  label?: string
  variant?: 'link' | 'button' | 'icon'
  className?: string
}

/**
 * BackButton component
 * Reusable back button with multiple variants
 */
export const BackButton = ({
  href,
  onClick,
  label = 'Back',
  variant = 'link',
  className,
}: BackButtonProps) => {
  const router = useRouter()
  const isRTL = useIsRTL()
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors',
          className
        )}
        aria-label="Go back"
      >
        <ChevronLeft className= {cn("h-6 w-6 text-gray-600", isRTL ? "rotate-180" : "rotate-0")} />
      </button>
    )
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors',
          className
        )}
      >
        <ArrowLeft className={cn("h-5 w-5", isRTL && "scale-x-[-1]")} />
        {label && <span className="text-14 font-medium">{label}</span>}
      </button>
    )
  }

  // Default: link variant
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          'inline-flex items-center gap-2 text-14 text-gray-600 hover:text-gray-900 transition-colors',
          className
        )}
      >
              <ArrowLeft className= {cn("h-5 w-5", isRTL ? "!rotate-180" : "!rotate-0")} />
        {label}
      </Link>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 text-14 text-gray-600 hover:text-gray-900 transition-colors',
        className
      )}
    >
      <ArrowLeft className={cn("h-4 w-4", isRTL && "scale-x-[-1]")} />
      {label}
    </button>
  )
}

