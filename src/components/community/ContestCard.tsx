'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Trophy, Calendar, Users, Heart, MessageCircle, Share2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EngagementButton } from './EngagementButton'
import type { LeaderboardContestResponse } from '@/types/responses/community'
import {
  toggleLike as toggleContestLike,
  toggleFavorite as toggleContestFavorite,
  shareContest,
} from '@/services/api/contestsApi'
import { useToast } from '@/components/ui/Toaster'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useI18nTranslations } from '@/i18n/hooks'

export interface ContestCardProps {
  contest: LeaderboardContestResponse
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

// Helper function to get contest status
const getContestStatus = (
  contest: LeaderboardContestResponse
): 'active' | 'ended' | 'upcoming' => {
  if (!contest.isActive) return 'ended'
  const now = new Date()
  const endDate = contest.endDate ? new Date(contest.endDate) : null
  const startDate = contest.startDate ? new Date(contest.startDate) : null

  if (endDate && now > endDate) return 'ended'
  if (startDate && now < startDate) return 'upcoming'
  return 'active'
}

export const ContestCard = ({ contest, className, onClick }: ContestCardProps) => {
  const t = useI18nTranslations('community')
  const { addToast } = useToast()

  const router = useRouter()
  const queryClient = useQueryClient()

  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [likes, setLikes] = useState(contest.likeCount || 0)
  const [shares, setShares] = useState(contest.shareCount || 0)
  const [favorites, setFavorites] = useState(contest.favoriteCount || 0)
  const [imageError, setImageError] = useState(false)

  const toggleLikeMutation = useMutation({
    mutationFn: async () => await toggleContestLike(contest.id),
    onSuccess: () => {
      setIsLiked(!isLiked)
      setLikes(prev => (isLiked ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['contest', contest.id] })
    },
    onError: (error) => {
      addToast(
        error instanceof Error ? error.message : t('postCard.failedToToggleLike'),
        'error'
      )
    },
  })

  const shareMutation = useMutation({
    mutationFn: async (shareSource?: string) => await shareContest(contest.id, shareSource),
    onSuccess: (data) => {
      if (data) {
        setShares(data.shareCount)
        const urlToShare =
          data.shortUrl ||
          data.fullUrl ||
          `${window.location.origin}/community/contests/${contest.id}`
        navigator.clipboard.writeText(urlToShare).catch(() => {})
        addToast(t('postCard.sharedSuccessfully'), 'success')
      }
      queryClient.invalidateQueries({ queryKey: ['contest', contest.id] })
    },
    onError: (error) => {
      addToast(
        error instanceof Error ? error.message : t('contestDetails.failedToShareContest'),
        'error'
      )
    },
  })

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => await toggleContestFavorite(contest.id),
    onSuccess: () => {
      setIsFavorited(!isFavorited)
      setFavorites(prev => (isFavorited ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['contest', contest.id] })
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
    else router.push(`/community/contests/${contest.id}`)
  }

  const handleLikeClick = () => toggleLikeMutation.mutate()
  const handleCommentClick = () => router.push(`/community/contests/${contest.id}`)
  const handleShareClick = () => shareMutation.mutate('ShareButtonClick')
  const handleFavoriteClick = () => toggleFavoriteMutation.mutate()

  const status = getContestStatus(contest)
  const endDate = formatDate(contest.endDate)

  const medias = (contest as any).medias || []
  const imageUrl = medias.find((media: any) => media?.url)?.url

  const statusLabel =
    status === 'active'
      ? t('contestDetails.active')
      : status === 'ended'
        ? t('contestDetails.ended')
        : t('contestDetails.upcoming')

  const buttonLabel =
    status === 'active'
      ? t('contestDetails.joinContest')
      : status === 'ended'
        ? t('contestDetails.contestEnded')
        : t('contestDetails.upcoming')

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      {/* Contest Image */}
      {imageUrl ? (
        <div className="relative h-48 w-full bg-gray-100">
          {!imageError ? (
            <Image
              src={imageUrl}
              alt={contest.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-12 font-medium">
                {t('states.noContentMessage') /* fallback لطيف بدل "No image..." */}
              </span>
            </div>
          )}

          {!imageError && (
            <div
              className={cn(
                'absolute top-4 right-4 text-white px-3 py-1 rounded-full text-12 font-semibold',
                status === 'active'
                  ? 'bg-green-500'
                  : status === 'ended'
                    ? 'bg-gray-500'
                    : 'bg-blue-500'
              )}
            >
              {statusLabel}
            </div>
          )}
        </div>
      ) : null}

      {/* Contest Info */}
      <div className="p-6">
        <h3 className="text-20 font-semibold text-gray-900 mb-2">{contest.title}</h3>
        <p className="text-14 text-gray-700 mb-4 line-clamp-2">{contest.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-brand-500" />
            <span className="text-14 font-semibold text-gray-900">
              {t('contestDetails.prize')}:
            </span>
            <span className="text-14 text-brand-500 font-semibold">
              {contest.prizes || 'TBA'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-14 font-semibold text-gray-900">
              {t('contestDetails.participants')}:
            </span>
            <span className="text-14 text-gray-700">
              {contest.currentParticipants} / {contest.maxParticipants > 0 ? contest.maxParticipants : '∞'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-14 font-semibold text-gray-900">
              {t('contestDetails.ends')}:
            </span>
            <span className="text-14 text-gray-700">{endDate || 'TBA'}</span>
          </div>
        </div>

        <button className="w-full bg-brand-500 text-white py-2 rounded-lg text-14 font-semibold hover:bg-brand-600 transition-colors">
          {buttonLabel}
        </button>

        {/* Engagement Metrics */}
        <div className="flex items-center justify-center gap-3 pt-4 mt-4 border-t border-gray-100">
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
              count={contest.reviewCount || contest.commentCount || 0}
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
    </div>
  )
}
