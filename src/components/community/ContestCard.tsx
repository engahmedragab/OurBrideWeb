'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Trophy, Calendar, Users, Heart, MessageCircle, Share2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EngagementButton } from './EngagementButton'
import type { LeaderboardContestResponse } from '@/types/responses/community'
import { toggleLike as toggleContestLike, toggleFavorite as toggleContestFavorite, shareContest } from '@/services/api/contestsApi'
import { useToast } from '@/components/ui/Toaster'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { COMMUNITY_IMAGES } from '@/constants/community-images'

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

// Helper function to get user display name
const getUserDisplayName = (user: LeaderboardContestResponse['user']): string => {
  if (!user) return 'OurBride'
  const firstName = (user.firstName && user.firstName !== 'null') ? user.firstName : ''
  const lastName = (user.lastName && user.lastName !== 'null') ? user.lastName : ''
  const fullName = `${firstName} ${lastName}`.trim()
  return fullName || user.userName || 'OurBride'
}

// Helper function to get contest status
const getContestStatus = (contest: LeaderboardContestResponse): 'active' | 'ended' | 'upcoming' => {
  if (!contest.isActive) return 'ended'
  const now = new Date()
  const endDate = contest.endDate ? new Date(contest.endDate) : null
  const startDate = contest.startDate ? new Date(contest.startDate) : null

  if (endDate && now > endDate) return 'ended'
  if (startDate && now < startDate) return 'upcoming'
  return 'active'
}

export const ContestCard = ({ contest, className, onClick }: ContestCardProps) => {
  const router = useRouter()
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [likes, setLikes] = useState(contest.likeCount || 0)
  const [shares, setShares] = useState(contest.shareCount || 0)
  const [favorites, setFavorites] = useState(contest.favoriteCount || 0)

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      return await toggleContestLike(contest.id)
    },
    onSuccess: () => {
      setIsLiked(!isLiked)
      setLikes(prev => (isLiked ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['contest', contest.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to toggle like', 'error')
    },
  })

  const shareMutation = useMutation({
    mutationFn: async (shareSource?: string) => {
      return await shareContest(contest.id, shareSource)
    },
    onSuccess: (data) => {
      if (data) {
        setShares(data.shareCount)
        const urlToShare = data.shortUrl || data.fullUrl || `${window.location.origin}/community/contests/${contest.id}`
        navigator.clipboard.writeText(urlToShare).catch(() => { })
        addToast('Shared successfully! Link copied to clipboard.', 'success')
      }
      queryClient.invalidateQueries({ queryKey: ['contest', contest.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to share contest', 'error')
    },
  })

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      return await toggleContestFavorite(contest.id)
    },
    onSuccess: () => {
      setIsFavorited(!isFavorited)
      setFavorites(prev => (isFavorited ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['contest', contest.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to toggle favorite', 'error')
    },
  })

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/community/contests/${contest.id}`)
    }
  }

  const handleLikeClick = () => {
    toggleLikeMutation.mutate()
  }

  const handleCommentClick = () => {
    router.push(`/community/contests/${contest.id}`)
  }

  const handleShareClick = () => {
    shareMutation.mutate('ShareButtonClick')
  }

  const handleFavoriteClick = () => {
    toggleFavoriteMutation.mutate()
  }

  const status = getContestStatus(contest)
  const endDate = formatDate(contest.endDate)
  
  const imageUrl = COMMUNITY_IMAGES.DEFAULT_CONTEST_IMAGE

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      {/* Contest Image */}
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={contest.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {status === 'active' && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-12 font-semibold">
            Active
          </div>
        )}
        {status === 'ended' && (
          <div className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-12 font-semibold">
            Ended
          </div>
        )}
        {status === 'upcoming' && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-12 font-semibold">
            Upcoming
          </div>
        )}
      </div>

      {/* Contest Info */}
      <div className="p-6">
        <h3 className="text-20 font-semibold text-gray-900 mb-2">{contest.title}</h3>
        <p className="text-14 text-gray-700 mb-4 line-clamp-2">{contest.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-brand-500" />
            <span className="text-14 font-semibold text-gray-900">Prize:</span>
            <span className="text-14 text-brand-500 font-semibold">
              {contest.prizes || 'TBA'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-14 font-semibold text-gray-900">Participants:</span>
            <span className="text-14 text-gray-700">
              {contest.currentParticipants} / {contest.maxParticipants > 0 ? contest.maxParticipants : '∞'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-14 font-semibold text-gray-900">Ends:</span>
            <span className="text-14 text-gray-700">{endDate || 'TBA'}</span>
          </div>
        </div>

        <button className="w-full bg-brand-500 text-white py-2 rounded-lg text-14 font-semibold hover:bg-brand-600 transition-colors">
          {status === 'active' ? 'Join Contest' : status === 'ended' ? 'View Results' : 'Coming Soon'}
        </button>

        {/* Engagement Metrics */}
        <div className="flex items-center justify-center gap-3 pt-4 mt-4 border-t border-gray-100">
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
              count={contest.reviewCount || contest.commentCount || 0}
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
    </div>
  )
}





