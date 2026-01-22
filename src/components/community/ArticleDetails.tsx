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
  Star,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import { CommentCard } from './CommentCard'
import { EngagementButton } from './EngagementButton'
import type { ArticleResponse } from '@/types/responses/community'
import type { ReviewResponse } from '@/types/responses/review-response'
import type { AddReviewRequest } from '@/../client/common/api/gen/ourbride-api'
import { formatDate, getUserDisplayName, getUserAvatar, getProfileUrl } from './utils'
import Link from 'next/link'
import {
  addReview as addArticleReview,
  toggleLike as toggleArticleLike,
  toggleFavorite as toggleArticleFavorite,
  shareArticle,
} from '@/services/api/articlesApi'
import { toggleFollow } from '@/services/api/communityProfilesApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { COMMUNITY_IMAGES } from '@/constants/community-images'
import { useI18nTranslations } from '@/i18n/hooks'



export interface ArticleDetailsProps {
  article: ArticleResponse
  className?: string
}

export const ArticleDetails = ({ article, className }: ArticleDetailsProps) => {
  const tCommunity = useI18nTranslations("community")
  const t = useI18nTranslations("community.articleDetails")
  const tC = useI18nTranslations("common")
  const tCP = useI18nTranslations("community.postCard")
  const router = useRouter()
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const [commentText, setCommentText] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [likes, setLikes] = useState(article.likeCount || 0)
  const [shares, setShares] = useState(article.shareCount || 0)
  const [favorites, setFavorites] = useState(article.favoriteCount || 0)
  const [imageError, setImageError] = useState(false)
  const [avatarError, setAvatarError] = useState(false)

  const displayName = getUserDisplayName(article.user, article.authorName)
  const avatar = getUserAvatar(article.user)
  const date = formatDate(article.publishedAt || article.creationDate)

  // Extract images from medias array
  type ArticleWithMedias = ArticleResponse & { medias?: Array<{ url?: string }> }
  const articleWithMedias = article as ArticleWithMedias
  const medias = articleWithMedias.medias || []
  const imageUrl = medias.find((media: { url?: string }) => media?.url)?.url

  // Map reviews to comments format
  const comments = (article.reviews || []).map((review: ReviewResponse) => ({
    id: String(review.id),
    author: {
      name: review.isAnonymous ? 'Anonymous' : 'User', // TODO: Get actual user name from review.userId
      avatar: 'https://via.placeholder.com/100',
    },
    content: review.comment || review.summary || '',
    timestamp: formatDate(review.creationDate),
  }))

  // Mutation for adding review/comment
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const reviewData: AddReviewRequest = { comment: content }
      await addArticleReview(article.id, reviewData)
    },
    onSuccess: () => {
      setCommentText('')
      addToast(t("commentAdded"), 'success')
      // Invalidate queries to refresh comments/reviews
      queryClient.invalidateQueries({ queryKey: ['article', article.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : t("failedToAddComment"), 'error')
    },
  })

  // Mutation for toggling like
  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      return await toggleArticleLike(article.id)
    },
    onSuccess: () => {
      setIsLiked(!isLiked)
      setLikes(prev => (isLiked ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['article', article.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : t("failedToToggleLike"), 'error')
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
      return await shareArticle(article.id, shareSource)
    },
    onSuccess: (data) => {
      if (data) {
        setShares(data.shareCount)
        // Copy share URL to clipboard
        const urlToShare = data.shortUrl || data.fullUrl || `${window.location.origin}/community/articles/${article.id}`
        navigator.clipboard.writeText(urlToShare).catch(() => { })
        addToast(t("sharedSuccessfully"), 'success')
      }
      queryClient.invalidateQueries({ queryKey: ['article', article.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : t("failedToShareArticle"), 'error')
    },
  })

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      return await toggleArticleFavorite(article.id)
    },
    onSuccess: () => {
      setIsFavorited(!isFavorited)
      setFavorites(prev => (isFavorited ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['article', article.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : t("failedToToggleFavorite"), 'error')
    },
  })

  const toggleFollowMutation = useMutation({
    mutationFn: async () => {
      if (!article.userId) throw new Error(t("userIDNotAvailable"))
      await toggleFollow({
        profileType: 'User',
        profileUserId: article.userId,
      })
    },
    onSuccess: () => {
      setIsFollowing(!isFollowing)
      addToast(isFollowing ? t("unfollowedSuccessfully") : t("followedSuccessfully"), 'success')
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : t("failedToToggleFollow"), 'error')
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

  return (
    <div className={cn('space-y-6', className)}>
      {/* Back Button and Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/community?tab=articles')}
          className="h-10 w-10"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <div className="flex items-center gap-2 text-14 text-gray-600">
          <button
            onClick={() => router.push('/community?tab=articles')}
            className="hover:text-brand-500 transition-colors"
          >
            {tCommunity("tabs.community")}
          </button>
          <span>/</span>
          <span>{tCommunity("tabs.articles")}</span>
          <span>/</span>
          <span className="text-gray-900">{article.title}</span>
        </div>
      </div>

      {/* Article Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {/* Article Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
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
            <div className="min-w-0">
              {article.userId && getProfileUrl(article.userId, article.user?.type) ? (
                <Link
                  href={getProfileUrl(article.userId, article.user?.type)!}
                  className="hover:text-brand-500 transition-colors"
                >
                  <h4 className="text-16 font-normal text-gray-900 truncate">
                    {displayName}
                  </h4>
                </Link>
              ) : (
                <h4 className="text-16 font-normal text-gray-900 truncate">
                  {displayName}
                </h4>
              )}
              <p className="text-12 text-gray-500">{date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Follow Button */}
            {article.userId && (
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
                    ? t("following")
                    : t("follow")}
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

        {/* Article Image */}
        {imageUrl ? (
          <div className="relative w-full h-96 rounded-lg overflow-hidden mb-4 bg-gray-100">
            {!imageError ? (
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-12 font-medium">
                  {tC("noImageAvailable")}
                </span>
              </div>
            )}
          </div>
        ) : null}

        {/* Article Title */}
        <h1 className="text-24 font-normal text-gray-900 mb-4">{article.title}</h1>

        {/* Article Description */}
        <p className="text-14 text-gray-700 mb-4">{article.summary || article.excerpt}</p>

        {/* Full Article Content */}
        <div className="text-14 text-gray-700 mb-4 whitespace-pre-wrap">
          {article.content}
        </div>

        {/* Engagement Metrics */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-3">
            <EngagementButton
              icon={<Heart className={cn('h-5 w-5', isLiked && 'fill-brand-500')} />}
              count={likes}
              label={tCP("likes")}
              onClick={toggleLikeMutation.isPending ? undefined : handleLikeClick}
              isActive={isLiked}
            />
            <EngagementButton
              icon={<MessageCircle className="h-5 w-5" />}
              count={article.reviewCount || article.commentCount || 0}
              label={tCP("comments")}
            />
            <EngagementButton
              icon={<Share2 className="h-5 w-5" />}
              count={shares}
              label={tCP("shares")}
              onClick={shareMutation.isPending ? undefined : handleShareClick}
            />
            <EngagementButton
              icon={<Star className={cn('h-5 w-5', isFavorited && 'fill-brand-500')} />}
              count={favorites}
              label={tCP("favorites")}
              onClick={toggleFavoriteMutation.isPending ? undefined : handleFavoriteClick}
              isActive={isFavorited}
            />
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <h3 className="text-16 font-normal text-gray-900">{tCP("comments")}</h3>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {/* Comments List */}
        <div className="space-y-6 mb-6">
          {comments.length > 0 ? (
            comments.map(comment => (
              <CommentCard key={comment.id} {...comment} />
            ))
          ) : (
            <p className="text-14 text-gray-500 text-center py-4">
              {t("noComments")}
            </p>
          )}
        </div>

        {/* Add Comment Form */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
              <div className="w-full h-full flex items-center justify-center bg-brand-100">
                <span className="text-14 font-semibold text-brand-600">
                  {displayName.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder={t("writeComment")}
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
                  {addCommentMutation.isPending ? t("posting") : t("postComment")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
