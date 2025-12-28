import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, CheckCircle2, Star, UserPlus } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'
import { useFavoriteItems, useFollowItems } from '@/hooks'

export interface ProviderCardProps {
  provider: {
    id: string
    name: string
    image?: string
    verified?: boolean
    rating?: number
    profession?: string
    isFollowed?: boolean
    isFavorite?: boolean
  }
  onMessageClick?: () => void
  onViewProfile?: () => void
  onFollowToggle?: (e: React.MouseEvent) => void
  onFavoriteToggle?: (e: React.MouseEvent) => void
  isLoadingFollow?: boolean
  isLoadingFavorite?: boolean
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
  onFollowToggle,
  onFavoriteToggle,
  isLoadingFollow = false,
  isLoadingFavorite = false,
  className,
}: ProviderCardProps) => {
  const { isProviderInFavorite } = useFavoriteItems()
  const { isProviderFollowed } = useFollowItems()
  const providerId = parseInt(provider.id, 10)
  const isInFavorite = isProviderInFavorite(providerId)
  const isFollowed = isProviderFollowed(providerId)
  const rating = provider.rating || 0
  const roundedRating = Math.round(rating)

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isLoadingFollow) return
    onFollowToggle?.(e)
  }

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isLoadingFavorite) return
    onFavoriteToggle?.(e)
  }

  return (
    <div
      className={cn(
        'group relative bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center space-y-4',
        className
      )}
    >
      {/* Action Icons - Floating above the card */}
      {(onFollowToggle || onFavoriteToggle) && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 pointer-events-auto">
          {/* Favorite Icon */}
          {onFavoriteToggle && (
            <button
              type="button"
              onClick={handleFavoriteToggle}
              disabled={isLoadingFavorite}
              className={cn(
                'w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 relative z-30',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                isInFavorite || provider.isFavorite
                  ? 'border-brand-500 bg-brand-500'
                  : 'border-gray-300 bg-white hover:border-brand-500 hover:bg-brand-50'
              )}
              aria-label={
                isInFavorite || provider.isFavorite ? 'Remove from favorites' : 'Add to favorites'
              }
            >
              <Star
                className={cn(
                  'h-4 w-4 transition-colors',
                  isLoadingFavorite && 'animate-pulse',
                  isInFavorite || provider.isFavorite
                    ? 'fill-white text-white'
                    : 'fill-gray-300 text-gray-400'
                )}
              />
            </button>
          )}

          {/* Follow Icon */}
          {onFollowToggle && (
            <button
              type="button"
              onClick={handleFollowToggle}
              disabled={isLoadingFollow}
              className={cn(
                'w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 relative z-30',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                isFollowed || provider.isFollowed
                  ? 'border-brand-500 bg-brand-500'
                  : 'border-gray-300 bg-white hover:border-brand-500 hover:bg-brand-50'
              )}
              aria-label={isFollowed || provider.isFollowed ? 'Unfollow' : 'Follow'}
            >
              <UserPlus
                className={cn(
                  'h-4 w-4 transition-colors',
                  isLoadingFollow && 'animate-pulse',
                  isFollowed || provider.isFollowed
                    ? 'fill-white text-white'
                    : 'fill-gray-300 text-gray-400'
                )}
              />
            </button>
          )}
        </div>
      )}
      {/* Profile Picture */}
      <div className="relative w-28 h-28">
        {/* Image with inner border */}
        <div className="relative w-full h-full rounded-full border-2 border-pink-200 overflow-hidden shadow-[0_0_0_4px_rgba(251,207,232,0.4),0_0_0_6px_rgba(251,207,232,0.2)]">
          {provider.image && provider.image.trim() !== '' ? (
            <Image
              src={provider.image}
              alt={provider.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <span className="text-white text-32 font-semibold">
                {provider.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

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
