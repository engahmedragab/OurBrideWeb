'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import somethingWrongSvg from '@/assets/svg/something-wrong.svg'

export interface ErrorDisplayProps {
  title?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  className?: string
}

export function ErrorDisplay({
  title = 'Oops! Something went wrong',
  message = 'Please try again later',
  actionLabel = 'Back to Home',
  onAction,
  actionHref = '/',
  className = '',
}: ErrorDisplayProps) {
  const router = useRouter()

  const handleAction = () => {
    if (onAction) {
      onAction()
    } else if (actionHref) {
      router.push(actionHref)
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center w-full py-12 ${className}`}
    >
      {/* SVG Illustration */}
      <Image
        src={
          typeof somethingWrongSvg === 'string'
            ? somethingWrongSvg
            : somethingWrongSvg.src
        }
        alt="Something went wrong"
        width={256}
        height={256}
        className="w-64 h-64 object-contain mb-8"
      />
      {/* Header */}
      <h2 className="text-18 md:text-22 font-semibold text-gray-900 mb-1 text-center">
        {title}
      </h2>
      {/* Subtext */}
      <p className="text-14 text-gray-500 mb-6 text-center">{message}</p>
      {/* Button */}
      <button
        className="bg-brand-500 hover:bg-brand-600 text-white rounded-full px-8 py-2 font-semibold text-14 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all"
        onClick={handleAction}
      >
        {actionLabel}
      </button>
    </div>
  )
}
