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
import {
  toggleLike as toggleDecisionGroupLike,
  toggleFavorite as toggleDecisionGroupFavorite,
  shareDecisionGroup,
} from '@/services/api/decisionGroupsApi'
import { useToast } from '@/components/ui/Toaster'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { COMMUNITY_IMAGES } from '@/constants/community-images'
import { useI18nTranslations } from '@/i18n' // ✅

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
  if (!user) return 'OurBride'
  const firstName = (user.firstName && user.firstName !== 'null') ? user.firstName : ''
  const lastName = (user.lastName && user.lastName !== 'null') ? user.lastName : ''
  const fullName = `${firstName} ${lastName}`.trim()
  if (fullName) return fullName
  if (user.userName && user.userName.toLowerCase() === 'admin@our-bride.com') {
    return 'OurBride'
  }
  return user.userName || 'OurBride'
}

// Helper function to get user avatar
const getUserAvatar = (user: DecisionGroupResponse['user']): string | null => {
  if (!user || !user.profileUrl) return null
  return user.profileUrl
}

export const DecisionGroupCard = ({
  decisionGroup,
  className,
  onClick,
}: DecisionGroupCardProps) => {
  const t = useI18nTranslations('community') // ✅

  const router = useRouter()
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [likes, setLikes] = useState(decisionGroup.likeCount || 0)
  const [shares, setShares] = useState(decisionGroup.shareCount || 0)
  const [favorites, setFavorites] = useState(decisionGroup.favoriteCount || 0)
  const [avatarError, setAvatarError] = useState(false)

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
      addToast(
        error instanceof Error ? error.message : t('postCard.failedToToggleLike'),
        'error'
      )
    },
  })

  const shareMutation = useMutation({
    mutationFn: async (shareSource?: string) => {
      return await shareDecisionGroup(decisionGroup.id, shareSource)
    },
    onSuccess: (data) => {
      if (data) {
        setShares(data.shareCount)
        const urlToShare =
          data.shortUrl ||
          data.fullUrl ||
          `${window.location.origin}/community/decision-groups/${decisionGroup.id}`
        navigator.clipboard.writeText(urlToShare).catch(() => { })
        addToast(t('postCard.sharedSuccessfully'), 'success')
      }
      queryClient.invalidateQueries({ queryKey: ['decision-group', decisionGroup.id] })
    },
    onError: (error) => {
      addToast(
        error instanceof Error ? error.message : t('postCard.failedToSharePost'),
        'error'
      )
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
      addToast(
        error instanceof Error ? error.message : t('postCard.failedToToggleFavorite'),
        'error'
      )
    },
  })

  const handleCardClick = () => {
    if (onClick) onClick()
    else router.push(`/community/decision-groups/${decisionGroup.id}`)
  }

  const handleLikeClick = () => toggleLikeMutation.mutate()

  const handleCommentClick = () => {
    router.push(`/community/decision-groups/${decisionGroup.id}`)
  }

  const handleShareClick = () => shareMutation.mutate('ShareButtonClick')

  const handleFavoriteClick = () => toggleFavoriteMutation.mutate()

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
          {avatar && avatar !== 'https://via.placeholder.com/100' && !avatarError ? (
            <Image
              src={avatar}
              alt={displayName}
              fill
              sizes="40px"
              className="object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
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
                <span className="text-14 font-semibold text-gray-900">{displayName}</span>
              </Link>
            ) : (
              <span className="text-14 font-semibold text-gray-900">{displayName}</span>
            )}
            <span className="text-12 text-gray-500">{timestamp}</span>
          </div>

          <h3 className="text-18 font-semibold text-gray-900 mb-2">{decisionGroup.title}</h3>
          <p className="text-14 text-gray-700 mb-1">{decisionGroup.question}</p>
          <p className="text-14 text-gray-600 line-clamp-2">{decisionGroup.description}</p>
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
                    {option.voteCount} {t('decisionGroupDetails.votes')} ({option.percentage}%)
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
              +{decisionGroup.options.length - 3} {t('decisionGroupDetails.moreOptions')}
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-4">
        <div className="flex items-center gap-4 text-14 text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>
              {decisionGroup.totalVotes} {t('decisionGroupDetails.votes')}
            </span>
          </div>
          <span>
            {decisionGroup.totalParticipants} {t('decisionGroupDetails.participants')}
          </span>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<Heart className={cn('h-4 w-4', isLiked && 'fill-brand-500')} />}
            count={likes}
            label={t('postCard.likes')}
            onClick={handleLikeClick}
            isActive={isLiked}
            disabled={toggleLikeMutation.isPending}
          />
        </div>

        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<MessageCircle className="h-4 w-4" />}
            count={decisionGroup.reviewCount || decisionGroup.commentCount || 0}
            label={t('postCard.comments')}
            onClick={handleCommentClick}
          />
        </div>

        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<Share2 className="h-4 w-4" />}
            count={shares}
            label={t('postCard.shares')}
            onClick={handleShareClick}
            disabled={shareMutation.isPending}
          />
        </div>

        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<Star className={cn('h-4 w-4', isFavorited && 'fill-brand-500')} />}
            count={favorites}
            label={t('postCard.favorites')}
            onClick={handleFavoriteClick}
            isActive={isFavorited}
            disabled={toggleFavoriteMutation.isPending}
          />
        </div>
      </div>
    </div>
  )
}
