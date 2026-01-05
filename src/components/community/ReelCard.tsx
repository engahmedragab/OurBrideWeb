'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Play, Heart, MessageCircle, Share2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EngagementButton } from './EngagementButton'
import { getProfileUrl } from './utils'
import type { ReelResponse } from '@/types/responses/community'
import {
  toggleLike as toggleReelLike,
  toggleFavorite as toggleReelFavorite,
  shareReel,
} from '@/services/api/reelsApi'
import { useToast } from '@/components/ui/Toaster'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { COMMUNITY_IMAGES } from '@/constants/community-images'

export interface ReelCardProps {
  reel: ReelResponse
  className?: string
  onClick?: () => void
}

// Helper function to format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Helper function to get user display name
const getUserDisplayName = (user: ReelResponse['user']): string => {
  if (!user) return 'OurBride'
  const firstName =
    user.firstName && user.firstName !== 'null' ? user.firstName : ''
  const lastName =
    user.lastName && user.lastName !== 'null' ? user.lastName : ''
  const fullName = `${firstName} ${lastName}`.trim()
  return fullName || user.userName || 'OurBride'
}

// Helper function to get user avatar
const getUserAvatar = (user: ReelResponse['user']): string | null => {
  if (!user || !user.profileUrl) return null
  return user.profileUrl
}

// Helper function to format duration
const formatDuration = (seconds: number | null): string => {
  if (!seconds) return ''
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const ReelCard = ({ reel, className, onClick }: ReelCardProps) => {
  const router = useRouter()
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [likes, setLikes] = useState(reel.likeCount || 0)
  const [shares, setShares] = useState(reel.shareCount || 0)
  const [favorites, setFavorites] = useState(reel.favoriteCount || 0)

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      return await toggleReelLike(reel.id)
    },
    onSuccess: () => {
      setIsLiked(!isLiked)
      setLikes(prev => (isLiked ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['reel', reel.id] })
    },
    onError: error => {
      addToast(
        error instanceof Error ? error.message : 'Failed to toggle like',
        'error'
      )
    },
  })

  const shareMutation = useMutation({
    mutationFn: async (shareSource?: string) => {
      return await shareReel(reel.id, shareSource)
    },
    onSuccess: data => {
      if (data) {
        setShares(data.shareCount)
        const urlToShare =
          data.shortUrl ||
          data.fullUrl ||
          `${window.location.origin}/community/reels/${reel.id}`
        navigator.clipboard.writeText(urlToShare).catch(() => {})
        addToast('Shared successfully! Link copied to clipboard.', 'success')
      }
      queryClient.invalidateQueries({ queryKey: ['reel', reel.id] })
    },
    onError: error => {
      addToast(
        error instanceof Error ? error.message : 'Failed to share reel',
        'error'
      )
    },
  })

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      return await toggleReelFavorite(reel.id)
    },
    onSuccess: () => {
      setIsFavorited(!isFavorited)
      setFavorites(prev => (isFavorited ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['reel', reel.id] })
    },
    onError: error => {
      addToast(
        error instanceof Error ? error.message : 'Failed to toggle favorite',
        'error'
      )
    },
  })

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/community/reels/${reel.id}`)
    }
  }

  const handleLikeClick = () => {
    toggleLikeMutation.mutate()
  }

  const handleCommentClick = () => {
    router.push(`/community/reels/${reel.id}`)
  }

  const handleShareClick = () => {
    shareMutation.mutate('ShareButtonClick')
  }

  const handleFavoriteClick = () => {
    toggleFavoriteMutation.mutate()
  }

  const displayName = getUserDisplayName(reel.user)
  const avatar = getUserAvatar(reel.user)
  const date = formatDate(reel.publishedAt || reel.creationDate)

  const thumbnail = reel.thumbnailUrl || COMMUNITY_IMAGES.DEFAULT_REEL_IMAGE

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      {/* Thumbnail with Play Overlay */}
      <div className="relative w-full aspect-[9/16] bg-gray-900">
        <Image
          src={thumbnail}
          alt={reel.title || reel.description}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="h-8 w-8 text-gray-900 ml-1" fill="currentColor" />
          </div>
        </div>
        {reel.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-12 font-semibold">
            {formatDuration(reel.duration)}
          </div>
        )}
      </div>

      {/* Reel Info */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
            {avatar ? (
              <Image
                src={avatar}
                alt={displayName}
                fill
                sizes="32px"
                className="object-cover"
                onError={e => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : null}
            {!avatar && (
              <div className="w-full h-full flex items-center justify-center bg-white">
                <Image
                  src={COMMUNITY_IMAGES.DEFAULT_AVATAR_IMAGE}
                  alt="OurBride"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {reel.userId && getProfileUrl(reel.userId, reel.user?.type) ? (
              <Link
                href={getProfileUrl(reel.userId, reel.user?.type)!}
                onClick={e => e.stopPropagation()}
                className="hover:text-brand-500 transition-colors"
              >
                <h4 className="text-14 font-semibold text-gray-900 truncate">
                  {displayName}
                </h4>
              </Link>
            ) : (
              <h4 className="text-14 font-semibold text-gray-900 truncate">
                {displayName}
              </h4>
            )}
            {reel.title && (
              <p className="text-14 text-gray-700 line-clamp-2 mt-1">
                {reel.title}
              </p>
            )}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="flex items-center justify-center gap-3 pt-3 mt-3 border-t border-gray-100">
          <div onClick={e => e.stopPropagation()}>
            <EngagementButton
              icon={
                <Heart className={cn('h-4 w-4', isLiked && 'fill-brand-500')} />
              }
              count={likes}
              label="Likes"
              onClick={handleLikeClick}
              isActive={isLiked}
              disabled={toggleLikeMutation.isPending}
            />
          </div>
          <div onClick={e => e.stopPropagation()}>
            <EngagementButton
              icon={<MessageCircle className="h-4 w-4" />}
              count={reel.reviewCount || reel.commentCount || 0}
              label="Comments"
              onClick={handleCommentClick}
            />
          </div>
          <div onClick={e => e.stopPropagation()}>
            <EngagementButton
              icon={<Share2 className="h-4 w-4" />}
              count={shares}
              label="Shares"
              onClick={handleShareClick}
              disabled={shareMutation.isPending}
            />
          </div>
          <div onClick={e => e.stopPropagation()}>
            <EngagementButton
              icon={
                <Star
                  className={cn('h-4 w-4', isFavorited && 'fill-brand-500')}
                />
              }
              count={favorites}
              label="Favorites"
              onClick={handleFavoriteClick}
              isActive={isFavorited}
              disabled={toggleFavoriteMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
