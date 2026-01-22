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
  CheckCircle2,
  Star,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import { CommentCard } from './CommentCard'
import { EngagementButton } from './EngagementButton'
import type { DecisionGroupResponse } from '@/types/responses/community'
import type { ReviewResponse } from '@/types/responses/review-response'
import type { AddReviewRequest } from '@/../client/common/api/gen/ourbride-api'
import { formatDate, getUserDisplayName, getUserAvatar, getProfileUrl } from './utils'
import Link from 'next/link'
import {
  addReview as addDecisionGroupReview,
  toggleLike as toggleDecisionGroupLike,
  toggleFavorite as toggleDecisionGroupFavorite,
  shareDecisionGroup,
} from '@/services/api/decisionGroupsApi'
import { toggleFollow } from '@/services/api/communityProfilesApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { COMMUNITY_IMAGES } from '@/constants/community-images'
import { useI18nTranslations } from '@/i18n/hooks'

export interface DecisionGroupDetailsProps {
  decisionGroup: DecisionGroupResponse
  className?: string
}

export const DecisionGroupDetails = ({
  decisionGroup,
  className,
}: DecisionGroupDetailsProps) => {
  const t = useI18nTranslations("community")
  const tC = useI18nTranslations("common")
  const router = useRouter()
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const [commentText, setCommentText] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [likes, setLikes] = useState(decisionGroup.likeCount || 0)
  const [shares, setShares] = useState(decisionGroup.shareCount || 0)
  const [favorites, setFavorites] = useState(decisionGroup.favoriteCount || 0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  // Map reviews to comments format
  const comments = (decisionGroup.reviews || []).map((review: ReviewResponse) => ({
    id: String(review.id),
    author: {
      name: review.isAnonymous ? t("blogDetails.anonymous") : t("blogDetails.user"), // TODO: Get actual user name from review.userId
      avatar: 'https://via.placeholder.com/100',
    },
    content: review.comment || review.summary || '',
    timestamp: formatDate(review.creationDate),
  }))

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const reviewData: AddReviewRequest = { comment: content }
      await addDecisionGroupReview(decisionGroup.id, reviewData)
    },
    onSuccess: () => {
      setCommentText('')
      addToast(t("articleDetails.commentAdded"), 'success')
      // Invalidate queries to refresh comments/reviews
      queryClient.invalidateQueries({ queryKey: ['decision-group', decisionGroup.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : t("articleDetails.failedToAddComment"), 'error')
    },
  })

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
      addToast(error instanceof Error ? error.message : t("articleDetails.failedToToggleLike"), 'error')
    },
  })

  const handleAddComment = () => {
    if (!commentText.trim()) return
    addCommentMutation.mutate(commentText)
  }

  const handleLikeClick = () => {
    toggleLikeMutation.mutate()
  }

  const shareMutation = useMutation({
    mutationFn: async (shareSource?: string) => {
      return await shareDecisionGroup(decisionGroup.id, shareSource)
    },
    onSuccess: (data) => {
      if (data) {
        setShares(data.shareCount)
        // Copy share URL to clipboard
        const urlToShare = data.shortUrl || data.fullUrl || `${window.location.origin}/community/decision-groups/${decisionGroup.id}`
        navigator.clipboard.writeText(urlToShare).catch(() => { })
        addToast(t("articleDetails.sharedSuccessfully"), 'success')
      }
      queryClient.invalidateQueries({ queryKey: ['decision-group', decisionGroup.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : t("articleDetails.failedToShareDecisionGroup"), 'error')
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
      addToast(error instanceof Error ? error.message : t("articleDetails.failedToToggleFavorite"), 'error')
    },
  })

  const toggleFollowMutation = useMutation({
    mutationFn: async () => {
      if (!decisionGroup.userId) throw new Error(t("articleDetails.userIDNotAvailable"))
      await toggleFollow({
        profileType: 'User',
        profileUserId: decisionGroup.userId,
      })
    },
    onSuccess: () => {
      setIsFollowing(!isFollowing)
      addToast(isFollowing ? t("articleDetails.unfollowedSuccessfully") : t("articleDetails.followedSuccessfully"), 'success')
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : t("articleDetails.failedToToggleFollow"), 'error')
    },
  })

  const handleShareClick = () => {
    shareMutation.mutate('ShareButtonClick')
  }

  const handleFavoriteClick = () => {
    toggleFavoriteMutation.mutate()
  }

  const handleFollowClick = () => {
    toggleFollowMutation.mutate()
  }

  const handleVote = (optionId: number) => {
    if (hasVoted) {
      addToast(t("decisionGroupDetails.haveAlreadyVoted"), 'info')
      return
    }
    setSelectedOption(optionId)
    setHasVoted(true)
    addToast(t("decisionGroupDetails.voteCastSuccessfully"), 'success')
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Back Button and Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/community?tab=decision-groups')}
          className="h-10 w-10"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <div className="flex items-center gap-2 text-14 text-gray-600">
          <button
            onClick={() => router.push('/community?tab=decision-groups')}
            className="hover:text-brand-500 transition-colors"
          >
            {t("tabs.community")}
          </button>
          <span>/</span>
          <span>{t("tabs.decisionGroups")}</span>
          <span>/</span>
          <span className="text-gray-900">{decisionGroup.title}</span>
        </div>
      </div>

      {/* Decision Group Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
              {(() => {
                const avatar = getUserAvatar(decisionGroup.user)
                const displayName = getUserDisplayName(decisionGroup.user)
                return avatar && avatar !== 'https://via.placeholder.com/100' ? (
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
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-100">
                    <span className="text-14 font-semibold text-brand-600">
                      {displayName.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )
              })()}
            </div>
            <div className="min-w-0">
              {decisionGroup.userId && getProfileUrl(decisionGroup.userId, decisionGroup.user?.type) ? (
                <Link
                  href={getProfileUrl(decisionGroup.userId, decisionGroup.user?.type)!}
                  className="hover:text-brand-500 transition-colors"
                >
                  <h4 className="text-16 font-normal text-gray-900 truncate">
                    {getUserDisplayName(decisionGroup.user)}
                  </h4>
                </Link>
              ) : (
                <h4 className="text-16 font-normal text-gray-900 truncate">
                  {getUserDisplayName(decisionGroup.user)}
                </h4>
              )}
              <p className="text-12 text-gray-500">{formatDate(decisionGroup.publishedAt || decisionGroup.creationDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Follow Button */}
            {decisionGroup.userId && (
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
                  ? tC("loading")
                  : isFollowing
                    ? t("articleDetails.following")
                    : t("articleDetails.follow")}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-24 font-normal text-gray-900 mb-2">{decisionGroup.title}</h1>

        {/* Question */}
        <p className="text-18 font-semibold text-gray-900 mb-2">{decisionGroup.question}</p>

        {/* Description */}
        <p className="text-14 text-gray-700 mb-6">{decisionGroup.description}</p>

        {/* Voting Options */}
        <div className="space-y-3 mb-6">
          {decisionGroup.options.map(option => (
            <div key={option.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleVote(option.id)}
                  disabled={hasVoted}
                  className={cn(
                    'flex-1 text-left px-4 py-3 rounded-lg border-2 transition-colors',
                    selectedOption === option.id
                      ? 'border-brand-500 bg-brand-50'
                      : hasVoted
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-300 hover:border-brand-500 hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-14 font-medium text-gray-900">
                      {option.optionText}
                    </span>
                    {selectedOption === option.id && (
                      <CheckCircle2 className="h-5 w-5 text-brand-500" />
                    )}
                  </div>
                </button>
                {hasVoted && (
                  <div className="ml-4 text-right min-w-[100px]">
                    <div className="text-14 font-semibold text-gray-900">
                      {option.voteCount} {t("decisionGroupDetails.votes")}
                    </div>
                    <div className="text-12 text-gray-600">
                      {option.percentage}%
                    </div>
                  </div>
                )}
              </div>
              {hasVoted && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all"
                    style={{ width: `${option.percentage}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-4">
          <div className="flex items-center gap-4 text-14 text-gray-600">
            <span>{decisionGroup.totalVotes} {t("decisionGroupDetails.totalVotes")}</span>
            <span>{decisionGroup.totalParticipants} {t("decisionGroupDetails.participants")}</span>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-3">
            <EngagementButton
              icon={<Heart className={cn('h-5 w-5', isLiked && 'fill-brand-500')} />}
              count={likes}
              label={t("postCard.likes")}
              onClick={toggleLikeMutation.isPending ? undefined : handleLikeClick}
              isActive={isLiked}
            />
            <EngagementButton
              icon={<MessageCircle className="h-5 w-5" />}
              count={decisionGroup.reviewCount || decisionGroup.commentCount || 0}
              label={t("postCard.comments")}
            />
            <EngagementButton
              icon={<Share2 className="h-5 w-5" />}
              count={shares}
              label={t("postCard.shares")}
              onClick={shareMutation.isPending ? undefined : handleShareClick}
            />
            <EngagementButton
              icon={<Star className={cn('h-5 w-5', isFavorited && 'fill-brand-500')} />}
              count={favorites}
              label={t("postCard.favorites")}
              onClick={toggleFavoriteMutation.isPending ? undefined : handleFavoriteClick}
              isActive={isFavorited}
            />
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <h3 className="text-16 font-normal text-gray-900">{t("postCard.comments")}</h3>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {/* Comments List */}
        <div className="space-y-6 mb-6">
          {comments.length > 0 ? (
            comments.map(comment => (
              <CommentCard key={comment.id} {...comment} />
            ))
          ) : (
            <p className="text-14 text-gray-500 text-center py-4">
              {t("articleDetails.noCommentsYet")}
            </p>
          )}
        </div>

        {/* Add Comment Form */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
              <div className="w-full h-full flex items-center justify-center bg-brand-100">
                <span className="text-14 font-semibold text-brand-600">
                  {getUserDisplayName(decisionGroup.user).charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder={t("articleDetails.writeComment")}
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
                  {addCommentMutation.isPending ? t("articleDetails.posting") : t("articleDetails.postComment")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




