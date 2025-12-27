'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Users, CheckCircle2, Heart, MessageCircle, Share2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EngagementButton } from './EngagementButton'
import { getProfileUrl } from './utils'
import type { DecisionGroupResponse } from '@/types/responses/community'
import { toggleLike as toggleDecisionGroupLike, toggleFavorite as toggleDecisionGroupFavorite, shareDecisionGroup } from '@/services/api/decisionGroupsApi'
import { useToast } from '@/components/ui/Toaster'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface DecisionGroupCardProps {
  decisionGroup: DecisionGroupResponse
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
const getUserDisplayName = (user: DecisionGroupResponse['user']): string => {
  if (!user) return 'Anonymous'
  return `${user.firstName} ${user.lastName}`.trim() || user.userName || 'Unknown'
}

// Helper function to get user avatar
const getUserAvatar = (user: DecisionGroupResponse['user']): string => {
  if (!user) return 'https://via.placeholder.com/100'
  return user.profileUrl || 'https://via.placeholder.com/100'
}

export const DecisionGroupCard = ({
  decisionGroup,
  className,
  onClick,
}: DecisionGroupCardProps) => {
  const router = useRouter()
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [likes, setLikes] = useState(decisionGroup.likeCount || 0)
  const [shares, setShares] = useState(decisionGroup.shareCount || 0)
  const [favorites, setFavorites] = useState(decisionGroup.favoriteCount || 0)

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      return await toggleDecisionGroupLike(decisionGroup.id)
    },
    onSuccess: () => {
      setIsLiked(!isLiked)
      setLikes(prev => (isLiked ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['decision-group', decisionGroup.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to toggle like', 'error')
    },
  })

  const shareMutation = useMutation({
    mutationFn: async (shareSource?: string) => {
      return await shareDecisionGroup(decisionGroup.id, shareSource)
    },
    onSuccess: (data) => {
      if (data) {
        setShares(data.shareCount)
        const urlToShare = data.shortUrl || data.fullUrl || `${window.location.origin}/community/decision-groups/${decisionGroup.id}`
        navigator.clipboard.writeText(urlToShare).catch(() => { })
        addToast('Shared successfully! Link copied to clipboard.', 'success')
      }
      queryClient.invalidateQueries({ queryKey: ['decision-group', decisionGroup.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to share decision group', 'error')
    },
  })

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      return await toggleDecisionGroupFavorite(decisionGroup.id)
    },
    onSuccess: () => {
      setIsFavorited(!isFavorited)
      setFavorites(prev => (isFavorited ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['decision-group', decisionGroup.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to toggle favorite', 'error')
    },
  })

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/community/decision-groups/${decisionGroup.id}`)
    }
  }

  const handleLikeClick = () => {
    toggleLikeMutation.mutate()
  }

  const handleCommentClick = () => {
    router.push(`/community/decision-groups/${decisionGroup.id}`)
  }

  const handleShareClick = () => {
    shareMutation.mutate('ShareButtonClick')
  }

  const handleFavoriteClick = () => {
    toggleFavoriteMutation.mutate()
  }

  const displayName = getUserDisplayName(decisionGroup.user)
  const avatar = getUserAvatar(decisionGroup.user)
  const timestamp = formatDate(decisionGroup.publishedAt || decisionGroup.creationDate)

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
          {avatar && avatar !== 'https://via.placeholder.com/100' ? (
            <Image
              src={avatar}
              alt={displayName}
              fill
              sizes="40px"
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : null}
          {(!avatar || avatar === 'https://via.placeholder.com/100') && (
            <div className="w-full h-full flex items-center justify-center bg-brand-100">
              <span className="text-14 font-semibold text-brand-600">
                {displayName.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {decisionGroup.userId && getProfileUrl(decisionGroup.userId, decisionGroup.user?.type) ? (
              <Link
                href={getProfileUrl(decisionGroup.userId, decisionGroup.user?.type)!}
                onClick={(e) => e.stopPropagation()}
                className="hover:text-brand-500 transition-colors"
              >
                <span className="text-14 font-semibold text-gray-900">
                  {displayName}
                </span>
              </Link>
            ) : (
              <span className="text-14 font-semibold text-gray-900">
                {displayName}
              </span>
            )}
            <span className="text-12 text-gray-500">{timestamp}</span>
          </div>
          <h3 className="text-18 font-semibold text-gray-900 mb-2">
            {decisionGroup.title}
          </h3>
          <p className="text-14 text-gray-700 mb-1">{decisionGroup.question}</p>
          <p className="text-14 text-gray-600 line-clamp-2">
            {decisionGroup.description}
          </p>
        </div>
      </div>

      {/* Voting Options Preview */}
      {decisionGroup.options && decisionGroup.options.length > 0 && (
        <div className="space-y-2 mb-4">
          {decisionGroup.options.slice(0, 3).map(option => (
            <div key={option.id} className="space-y-1">
              <div className="flex items-center justify-between text-14">
                <span className="text-gray-900">{option.optionText}</span>
                {decisionGroup.showResultsBeforeEnd && (
                  <span className="text-gray-600">
                    {option.voteCount} votes ({option.percentage}%)
                  </span>
                )}
              </div>
              {decisionGroup.showResultsBeforeEnd && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all"
                    style={{ width: `${option.percentage}%` }}
                  />
                </div>
              )}
            </div>
          ))}
          {decisionGroup.options.length > 3 && (
            <p className="text-12 text-gray-500">
              +{decisionGroup.options.length - 3} more options
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-4">
        <div className="flex items-center gap-4 text-14 text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{decisionGroup.totalVotes} votes</span>
          </div>
          <span>{decisionGroup.totalParticipants} participants</span>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<Heart className={cn('h-4 w-4', isLiked && 'fill-brand-500')} />}
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
            count={decisionGroup.reviewCount || decisionGroup.commentCount || 0}
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
            icon={<Star className={cn('h-4 w-4', isFavorited && 'fill-brand-500')} />}
            count={favorites}
            label="Favorites"
            onClick={handleFavoriteClick}
            isActive={isFavorited}
            disabled={toggleFavoriteMutation.isPending}
          />
        </div>
      </div>
    </div>
  )
}





