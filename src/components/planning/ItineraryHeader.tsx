'use client'

import { ArrowLeft, RefreshCw, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export interface ItineraryHeaderProps {
  date: Date
  eventTitle?: string
  onRefresh?: () => void
  onSave?: () => void
  className?: string
}

export const ItineraryHeader = ({
  date,
  eventTitle,
  onRefresh,
  onSave,
  className,
}: ItineraryHeaderProps) => {
  const router = useRouter()

  const formattedDate = format(date, 'EEEE, dd MMM, yyyy')

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-900" />
        </button>
        <h1 className="text-16 font-normal text-gray-900">Events Itinerary</h1>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw className="h-5 w-5 text-brand-500" />
            </button>
          )}
          {onSave && (
            <button
              onClick={onSave}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Save"
            >
              <Save className="h-5 w-5 text-gray-900" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-14 text-gray-500 mb-1">
          Event Date : {formattedDate}
        </p>
        {eventTitle && (
          <div className="flex items-center gap-2">
            <h2 className="text-18 font-normal text-gray-900">{eventTitle}</h2>
            <div className="h-0.5 w-12 bg-brand-500" />
            <button
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="More options"
            >
              <svg
                className="h-5 w-5 text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

