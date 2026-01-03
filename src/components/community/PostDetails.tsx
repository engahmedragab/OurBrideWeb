'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  ArrowLeft,
  Star,
  Bookmark,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import { CommentCard } from './CommentCard'
import { EngagementButton } from './EngagementButton'
import type { PostResponse } from '@/types/responses/community'
import type { ReviewResponse } from '@/types/responses/review-response'
import { formatDate, getUserDisplayName, getUserAvatar, getProfileUrl } from './utils'
import Link from 'next/link'
import {
  addReview as addPostReview,
  toggleLike as togglePostLike,
  toggleFavorite as togglePostFavorite,
  sharePost,
} from '@/services/api/postsApi'
import { toggleFollow } from '@/services/api/communityProfilesApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { COMMUNITY_IMAGES } from '@/constants/community-images'

export interface PostDetailsProps {
  post: PostResponse
  className?: string
}

export const PostDetails = ({ post, className }: PostDetailsProps) => {
  const router = useRouter()
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const [commentText, setCommentText] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [likes, setLikes] = useState(post.likeCount || 0)
  const [shares, setShares] = useState(post.shareCount || 0)
  const [favorites, setFavorites] = useState(post.favoriteCount || 0)

  const displayName = getUserDisplayName(post.user)
  const avatar = getUserAvatar(post.user)
  const timestamp = formatDate(post.publishedAt || post.creationDate)
  const images: string[] = [] // TODO: Extract from post.media relations

  // Map reviews to comments format
  const comments = (post.reviews || []).map((review: ReviewResponse) => ({
    id: String(review.id),
    author: {
      name: review.isAnonymous ? 'Anonymous' : 'User', // TODO: Get actual user name from review.userId
      avatar: 'https://via.placeholder.com/100',
    },
    content: review.comment || review.summary || '',
    timestamp: formatDate(review.creationDate),
  }))

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      await addPostReview(post.id, { comment: content } as any)
    },
    onSuccess: () => {
      setCommentText('')
      addToast('Comment added successfully!', 'success')
      // Invalidate queries to refresh comments/reviews
      queryClient.invalidateQueries({ queryKey: ['post', post.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to add comment', 'error')
    },
  })

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      return await togglePostLike(post.id)
    },
    onSuccess: () => {
      setIsLiked(!isLiked)
      setLikes(prev => (isLiked ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['post', post.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to toggle like', 'error')
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
      return await sharePost(post.id, shareSource)
    },
    onSuccess: (data) => {
      if (data) {
        setShares(data.shareCount)
        // Copy share URL to clipboard
        const urlToShare = data.shortUrl || data.fullUrl || `${window.location.origin}/community/posts/${post.id}`
        navigator.clipboard.writeText(urlToShare).catch(() => { })
        addToast('Shared successfully! Link copied to clipboard.', 'success')
      }
      queryClient.invalidateQueries({ queryKey: ['post', post.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to share post', 'error')
    },
  })

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      return await togglePostFavorite(post.id)
    },
    onSuccess: () => {
      setIsFavorited(!isFavorited)
      setFavorites(prev => (isFavorited ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['post', post.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to toggle favorite', 'error')
    },
  })

  const toggleFollowMutation = useMutation({
    mutationFn: async () => {
      if (!post.userId) throw new Error('User ID not available')
      await toggleFollow({
        profileType: 'User',
        profileUserId: post.userId,
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
          onClick={() => router.push('/community?tab=posts')}
          className="h-10 w-10"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <div className="flex items-center gap-2 text-14 text-gray-600">
          <button
            onClick={() => router.push('/community?tab=posts')}
            className="hover:text-brand-500 transition-colors"
          >
            Community
          </button>
          <span>/</span>
          <span>Posts</span>
          <span>/</span>
          <span className="text-gray-900">{post.title || displayName + "'s Post"}</span>
        </div>
      </div>

      {/* Post Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={displayName}
                  fill
                  sizes="40px"
                  className="object-cover"
                  onError={(e) => {
                    // Hide image on error, show fallback
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : null}
              {!avatar && (
                <div className="w-full h-full flex items-center justify-center bg-white">
                  <Image
                    src={COMMUNITY_IMAGES.DEFAULT_AVATAR_IMAGE}
                    alt="OurBride"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            <div className="min-w-0">
              {post.userId && getProfileUrl(post.userId, post.user?.type) ? (
                <Link
                  href={getProfileUrl(post.userId, post.user?.type)!}
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
              <p className="text-12 text-gray-500">{timestamp}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Follow Button */}
            {post.userId && (
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

        {/* Post Content */}
        <p className="text-14 text-gray-700 mb-4 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Post Images */}
        <div className="mb-4">
          {images && images.length > 0 ? (
            images.length === 1 ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={images[0]}
                  alt="Post image"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ) : images.length === 2 ? (
              <div className="grid grid-cols-2 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`Post image ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 row-span-2 relative w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src={images[0]}
                    alt="Post image 1"
                    fill
                    sizes="(max-width: 768px) 33vw, 16vw"
                    className="object-cover"
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-2">
                  {images.slice(1, 3).map((img, idx) => (
                    <div key={idx} className="relative w-full h-32 rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`Post image ${idx + 2}`}
                        fill
                        sizes="(max-width: 768px) 66vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src={COMMUNITY_IMAGES.DEFAULT_POST_IMAGE}
                alt="OurBride"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
        </div>

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
              count={post.reviewCount || post.commentCount || 0}
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
      </div>

      {/* Comments Title */}
      <h3 className="text-16 font-normal text-gray-900">Comments</h3>

      {/* Comments Section */}
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
                  {displayName.charAt(0).toUpperCase() || 'U'}
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
