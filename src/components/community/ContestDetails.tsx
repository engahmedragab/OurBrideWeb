'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  ArrowLeft,
  Trophy,
  Calendar,
  Users,
  Star,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import { CommentCard } from './CommentCard'
import { EngagementButton } from './EngagementButton'
import type { LeaderboardContestResponse } from '@/types/responses/community'
import type { ReviewResponse } from '@/types/responses/review-response'
import { formatDateShort, getUserDisplayName, getUserAvatar, getProfileUrl } from './utils'
import Link from 'next/link'
import {
  addReview as addContestReview,
  toggleLike as toggleContestLike,
  toggleFavorite as toggleContestFavorite,
  shareContest,
} from '@/services/api/contestsApi'
import { toggleFollow } from '@/services/api/communityProfilesApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { COMMUNITY_IMAGES } from '@/constants/community-images'

export interface ContestDetailsProps {
  contest: LeaderboardContestResponse
  className?: string
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

export const ContestDetails = ({
  contest,
  className,
}: ContestDetailsProps) => {
  const router = useRouter()
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const [commentText, setCommentText] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [likes, setLikes] = useState(contest.likeCount || 0)
  const [shares, setShares] = useState(contest.shareCount || 0)
  const [favorites, setFavorites] = useState(contest.favoriteCount || 0)
  const [hasJoined, setHasJoined] = useState(false)

  const status = getContestStatus(contest)

  // Extract images from medias array, fallback to default
  const medias = (contest as any).medias || []
  const imageUrl = medias.find((media: any) => media?.url)?.url || COMMUNITY_IMAGES.DEFAULT_CONTEST_IMAGE

  // Map reviews to comments format
  const comments = (contest.reviews || []).map((review: ReviewResponse) => ({
    id: String(review.id),
    author: {
      name: review.isAnonymous ? 'Anonymous' : 'User', // TODO: Get actual user name from review.userId
      avatar: 'https://via.placeholder.com/100',
    },
    content: review.comment || review.summary || '',
    timestamp: formatDateShort(review.creationDate),
  }))

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      await addContestReview(contest.id, { comment: content } as any)
    },
    onSuccess: () => {
      setCommentText('')
      addToast('Comment added successfully!', 'success')
      // Invalidate queries to refresh comments/reviews
      queryClient.invalidateQueries({ queryKey: ['contest', contest.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to add comment', 'error')
    },
  })

  const handleAddComment = () => {
    if (!commentText.trim()) return
    addCommentMutation.mutate(commentText)
  }

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
        // Copy share URL to clipboard
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

  const toggleFollowMutation = useMutation({
    mutationFn: async () => {
      if (!contest.userId) throw new Error('User ID not available')
      await toggleFollow({
        profileType: 'User',
        profileUserId: contest.userId,
      })
    },
    onSuccess: () => {
      setIsFollowing(!isFollowing)
      addToast(isFollowing ? 'Unfollowed successfully' : 'Followed successfully', 'success')
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to toggle follow', 'error')
    },
  })

  const handleLikeClick = () => {
    toggleLikeMutation.mutate()
  }

  const handleShareClick = () => {
    shareMutation.mutate('ShareButtonClick')
  }

  const handleFavoriteClick = () => {
    toggleFavoriteMutation.mutate()
  }

  const handleFollowClick = () => {
    toggleFollowMutation.mutate()
  }

  const handleJoinContest = () => {
    if (hasJoined) {
      addToast('You have already joined this contest!', 'info')
      return
    }
    setHasJoined(true)
    addToast('Successfully joined the contest!', 'success')
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Back Button and Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/community?tab=contests')}
          className="h-10 w-10"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <div className="flex items-center gap-2 text-14 text-gray-600">
          <button
            onClick={() => router.push('/community?tab=contests')}
            className="hover:text-brand-500 transition-colors"
          >
            Community
          </button>
          <span>/</span>
          <span>Contests</span>
          <span>/</span>
          <span className="text-gray-900">{contest.title}</span>
        </div>
      </div>

      {/* Contest Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Contest Image */}
        <div className="relative w-full h-96">
          <Image
            src={imageUrl}
            alt={contest.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          {status === 'active' && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-14 font-semibold">
              Active
            </div>
          )}
          {status === 'ended' && (
            <div className="absolute top-4 right-4 bg-gray-500 text-white px-4 py-2 rounded-full text-14 font-semibold">
              Ended
            </div>
          )}
          {status === 'upcoming' && (
            <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full text-14 font-semibold">
              Upcoming
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Contest Title */}
          <h1 className="text-24 font-normal text-gray-900 mb-4">{contest.title}</h1>

          {/* Contest Description */}
          <p className="text-14 text-gray-700 mb-4">{contest.description}</p>

          {/* Full Description */}
          {contest.rules && (
            <div className="text-14 text-gray-700 mb-6 whitespace-pre-wrap">
              {contest.rules}
            </div>
          )}

          {/* Contest Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-brand-500" />
              <div>
                <span className="text-14 font-semibold text-gray-900">Prize:</span>
                <span className="text-14 text-brand-500 font-semibold ml-2">
                  {contest.prizes || 'TBA'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <span className="text-14 font-semibold text-gray-900">
                  Participants:
                </span>
                <span className="text-14 text-gray-700 ml-2">
                  {contest.currentParticipants} / {contest.maxParticipants > 0 ? contest.maxParticipants : '∞'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <span className="text-14 font-semibold text-gray-900">Ends:</span>
                <span className="text-14 text-gray-700 ml-2">{contest.endDate ? formatDateShort(contest.endDate) : 'TBA'}</span>
              </div>
            </div>
          </div>

          {/* Join Contest Button */}
          <Button
            variant="brand"
            size="lg"
            onClick={handleJoinContest}
            disabled={hasJoined || status !== 'active'}
            className="w-full mb-4"
          >
            {hasJoined ? 'Joined' : status === 'active' ? 'Join Contest' : 'Contest Ended'}
          </Button>

          {/* Engagement Metrics */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-3">
              <EngagementButton
                icon={<Heart className={cn('h-5 w-5', isLiked && 'fill-brand-500')} />}
                count={likes}
                label="Likes"
                onClick={toggleLikeMutation.isPending ? undefined : handleLikeClick}
                isActive={isLiked}
              />
              <EngagementButton
                icon={<MessageCircle className="h-5 w-5" />}
                count={contest.reviewCount || contest.commentCount || 0}
                label="Comments"
              />
              <EngagementButton
                icon={<Share2 className="h-5 w-5" />}
                count={shares}
                label="Shares"
                onClick={shareMutation.isPending ? undefined : handleShareClick}
              />
              <EngagementButton
                icon={<Star className={cn('h-5 w-5', isFavorited && 'fill-brand-500')} />}
                count={favorites}
                label="Favorites"
                onClick={toggleFavoriteMutation.isPending ? undefined : handleFavoriteClick}
                isActive={isFavorited}
              />
            </div>
          </div>

          {/* Follow Button */}
          {contest.userId && (
            <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
              <Button
                variant={isFollowing ? 'outline' : 'brand'}
                size="sm"
                onClick={handleFollowClick}
                disabled={toggleFollowMutation.isPending}
                className={cn(
                  'text-12 flex-shrink-0',
                  !isFollowing && 'text-white'
                )}
              >
                <UserPlus className={cn('h-4 w-4 mr-2', isFollowing && 'hidden')} />
                {toggleFollowMutation.isPending
                  ? 'Loading...'
                  : isFollowing
                    ? 'Following'
                    : 'Follow'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <h3 className="text-16 font-normal text-gray-900">Comments</h3>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {/* Comments List */}
        <div className="space-y-6 mb-6">
          {comments.length > 0 ? (
            comments.map(comment => (
              <CommentCard key={comment.id} {...comment} />
            ))
          ) : (
            <p className="text-14 text-gray-500 text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>

        {/* Add Comment Form */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
              <div className="w-full h-full flex items-center justify-center bg-brand-100">
                <span className="text-14 font-semibold text-brand-600">
                  {getUserDisplayName(contest.user).charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-14 resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <Button
                  variant="brand"
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || addCommentMutation.isPending}
                  className="text-10 text-white font-normal"
                >
                  {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




