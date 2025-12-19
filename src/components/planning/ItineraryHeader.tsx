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
    
      </div>

      <div className="mb-4 flex flex-col items-center justify-center ">
        <p className="text-14 text-gray-500 mb-1">
          Event Date : {formattedDate}
        </p>
        {eventTitle && (
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-24 text-gray-400 font-medium">{eventTitle}</h2>
            <div className="h-0.5 w-12 bg-brand-500" />
           
          </div>
        )}
      </div>
    </div>
  )
}

