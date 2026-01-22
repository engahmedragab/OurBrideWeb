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
import type { BlogResponse } from '@/types/responses/community'
import type { ReviewResponse } from '@/types/responses/review-response'
import type { AddReviewRequest } from '@/../client/common/api/gen/ourbride-api'
import { formatDate, getUserDisplayName, getUserAvatar, getProfileUrl } from './utils'
import Link from 'next/link'
import {
  addReview as addBlogReview,
  toggleLike as toggleBlogLike,
  toggleFavorite as toggleBlogFavorite,
  shareBlog,
} from '@/services/api/blogsApi'
import { toggleFollow } from '@/services/api/communityProfilesApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { COMMUNITY_IMAGES } from '@/constants/community-images'
import { useI18nTranslations } from '@/i18n/hooks'

export interface BlogDetailsProps {
  blog: BlogResponse
  className?: string
}

export const BlogDetails = ({ blog, className }: BlogDetailsProps) => {
  const t = useI18nTranslations("community")
  const tC = useI18nTranslations("common")
  const router = useRouter()
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const [commentText, setCommentText] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [likes, setLikes] = useState(blog.likeCount || 0)
  const [shares, setShares] = useState(blog.shareCount || 0)
  const [favorites, setFavorites] = useState(blog.favoriteCount || 0)
  const [imageError, setImageError] = useState(false)
  const [avatarError, setAvatarError] = useState(false)

  const displayName = getUserDisplayName(blog.user, blog.authorName)
  const avatar = getUserAvatar(blog.user)
  const date = formatDate(blog.publishedAt || blog.creationDate)

  // Extract images from medias array
  type BlogWithMedias = BlogResponse & { medias?: Array<{ url?: string }> }
  const blogWithMedias = blog as BlogWithMedias
  const medias = blogWithMedias.medias || []
  const imageUrl = medias.find((media: { url?: string }) => media?.url)?.url

  // Map reviews to comments format
  const comments = (blog.reviews || []).map((review: ReviewResponse) => ({
    id: String(review.id),
    author: {
      name: review.isAnonymous ? t("blogDetails.Anonymous") : t("blogDetails.user"), // TODO: Get actual user name from review.userId
      avatar: 'https://via.placeholder.com/100',
    },
    content: review.comment || review.summary || '',
    timestamp: formatDate(review.creationDate),
  }))

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const reviewData: AddReviewRequest = { comment: content }
      await addBlogReview(blog.id, reviewData)
    },
    onSuccess: () => {
      setCommentText('')
      addToast(t("articleDetails.commentAdded"), 'success')
      // Invalidate queries to refresh comments/reviews
      queryClient.invalidateQueries({ queryKey: ['blog', blog.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : t("articleDetails.failedToAddComment"), 'error')
    },
  })

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      return await toggleBlogLike(blog.id)
    },
    onSuccess: () => {
      setIsLiked(!isLiked)
      setLikes(prev => (isLiked ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['blog', blog.id] })
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
      return await shareBlog(blog.id, shareSource)
    },
    onSuccess: (data) => {
      if (data) {
        setShares(data.shareCount)
        // Copy share URL to clipboard
        const urlToShare = data.shortUrl || data.fullUrl || `${window.location.origin}/community/blogs/${blog.id}`
        navigator.clipboard.writeText(urlToShare).catch(() => { })
        addToast(t("postCard.sharedSuccessfully"), 'success')
      }
      queryClient.invalidateQueries({ queryKey: ['blog', blog.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : t("blogDetails.failedToShareBlog"), 'error')
    },
  })

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      return await toggleBlogFavorite(blog.id)
    },
    onSuccess: () => {
      setIsFavorited(!isFavorited)
      setFavorites(prev => (isFavorited ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['blog', blog.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : t("articleDetails.failedToToggleFavorite"), 'error')
    },
  })

  const toggleFollowMutation = useMutation({
    mutationFn: async () => {
      if (!blog.userId) throw new Error(t("articleDetails.userIDNotAvailable"))
      await toggleFollow({
        profileType: 'User',
        profileUserId: blog.userId,
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

  return (
    <div className={cn('space-y-6', className)}>
      {/* Back Button and Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/community?tab=blogs')}
          className="h-10 w-10"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <div className="flex items-center gap-2 text-14 text-gray-600">
          <button
            onClick={() => router.push('/community?tab=blogs')}
            className="hover:text-brand-500 transition-colors"
          >
            {t("tabs.community")}
          </button>
          <span>/</span>
          <span>{t("tabs.blogs")}</span>
          <span>/</span>
          <span className="text-gray-900">{blog.title}</span>
        </div>
      </div>

      {/* Blog Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {/* Blog Header */}
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
              {blog.userId && getProfileUrl(blog.userId, blog.user?.type) ? (
                <Link
                  href={getProfileUrl(blog.userId, blog.user?.type)!}
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
            {blog.userId && (
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
                  ? t("states.loading")
                  : isFollowing
                    ? t("actions.following")
                    : t("actions.follow")}
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

        {/* Blog Image */}
        {imageUrl ? (
          <div className="relative w-full h-96 rounded-lg overflow-hidden mb-4 bg-gray-100">
            {!imageError ? (
              <Image
                src={imageUrl}
                alt={blog.title}
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

        {/* Blog Title */}
        <h1 className="text-24 font-normal text-gray-900 mb-4">{blog.title}</h1>

        {/* Blog Description */}
        <p className="text-14 text-gray-700 mb-4">{blog.summary || blog.excerpt}</p>

        {/* Full Blog Content */}
        <div
          className="text-14 text-gray-700 mb-4 [&_h1]:text-24 [&_h1]:font-semibold [&_h1]:text-gray-900 [&_h1]:mb-4 [&_h1]:mt-6 [&_h2]:text-20 [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mb-3 [&_h2]:mt-5 [&_h3]:text-18 [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_a]:text-brand-500 [&_a]:hover:text-brand-600 [&_a]:underline [&_ul]:rtl:pr-6 [&_ul]:rtl:pl-0 [&_ol]:rtl:pr-6 [&_ol]:rtl:pl-0"
          dir="auto"
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
          dangerouslySetInnerHTML={{ __html: blog.content || '' }}
        />

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
              count={blog.reviewCount || blog.commentCount || 0}
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
              {t("communityRightSidebar.noComments")}
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




