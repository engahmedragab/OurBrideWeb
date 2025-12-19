import Link from 'next/link'
import { MessageCircle, CheckCircle2, Star } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

export interface ProviderCardProps {
  provider: {
    id: string
    name: string
    image?: string
    verified?: boolean
    rating?: number
    profession?: string
  }
  onMessageClick?: () => void
  onViewProfile?: () => void
  className?: string
}

/**
 * ProviderCard component displaying provider information with profile picture,
 * name, profession, rating, and action buttons
 */
export const ProviderCard = ({
  provider,
  onMessageClick,
  onViewProfile,
  className,
}: ProviderCardProps) => {
  const rating = provider.rating || 0
  const roundedRating = Math.round(rating)

  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center space-y-4',
        className
      )}
    >
      {/* Profile Picture */}
      {provider.image && (
        <div className="relative w-28 h-28">
          {/* Image with inner border */}
          <div className="relative w-full h-full rounded-full border-2 border-pink-200 overflow-hidden shadow-[0_0_0_4px_rgba(251,207,232,0.4),0_0_0_6px_rgba(251,207,232,0.2)]">
            <img
              src={provider.image}
              alt={provider.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Name with Verification */}
      <div className="flex items-center gap-2">
        <h3 className="text-20 font-normal text-gray-900">{provider.name}</h3>
        {provider.verified && (
          <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
        )}
      </div>

      {/* Profession */}
      {provider.profession && (
        <p className="text-14 text-gray-900">{provider.profession}</p>
      )}

      {/* Rating Stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={cn(
              'h-4 w-4',
              star <= roundedRating
                ? 'fill-brand-500 text-brand-500'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full pt-2">
        {/* Message Button */}
        <Button
          variant="outlineBrand"
          size="icon"
          className="h-11 w-11 rounded-full"
          onClick={onMessageClick}
          aria-label="Message provider"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>

        {/* View Profile Button */}
        <Button
          variant="outlineBrand"
          size="lg"
          className="flex-1 rounded-full font-normal text-brand-500"
          asChild
        >
          <Link href={`/providers/${provider.id}`} onClick={onViewProfile}>
            View Profile
          </Link>
        </Button>
      </div>
    </div>
  )
}
