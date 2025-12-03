import { MessageCircle, CheckCircle2 } from 'lucide-react'
import { RatingDisplay } from './RatingDisplay'
import { cn } from '@/lib/utils'

export interface ProviderCardProps {
  provider: {
    id: string
    name: string
    image?: string
    verified?: boolean
    rating?: number
  }
  showMessageButton?: boolean
  onMessageClick?: () => void
  className?: string
}

export const ProviderCard = ({
  provider,
  showMessageButton = true,
  onMessageClick,
  className,
}: ProviderCardProps) => {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-3">
        {provider.image && (
          <img
            src={provider.image}
            alt={provider.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="text-16 font-semibold text-gray-900">
              {provider.name}
            </div>
            {provider.verified && (
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
            )}
          </div>
          {provider.rating !== undefined && (
            <div className="mt-1">
              <RatingDisplay
                rating={provider.rating}
                size="sm"
                showCount={false}
              />
            </div>
          )}
        </div>
      </div>
      {showMessageButton && (
        <button
          onClick={onMessageClick}
          className="text-14 text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1"
        >
          <MessageCircle className="h-4 w-4" />
          Message The Provider
        </button>
      )}
    </div>
  )
}
