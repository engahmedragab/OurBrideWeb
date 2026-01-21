'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, Share2, MoreVertical, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import { EngagementButton } from './EngagementButton'
import { getProfileUrl } from './utils'
import type { PostResponse } from '@/types/responses/community'
import { toggleLike as togglePostLike, toggleFavorite as togglePostFavorite, sharePost } from '@/services/api/postsApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface PostCardProps {
  post: PostResponse
  className?: string
}

// Helper function to format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Helper function to get user display name
const getUserDisplayName = (user: PostResponse['user']): string => {
  if (!user) return 'OurBride'
  const firstName = (user.firstName && user.firstName !== 'null') ? user.firstName : ''
  const lastName = (user.lastName && user.lastName !== 'null') ? user.lastName : ''
  const fullName = `${firstName} ${lastName}`.trim()
  if (fullName) return fullName
  // If userName is admin@our-bride.com, display as OurBride
  if (user.userName && user.userName.toLowerCase() === 'admin@our-bride.com') {
    return 'OurBride'
  }
  return user.userName || 'OurBride'
}

// Helper function to get user avatar
const getUserAvatar = (user: PostResponse['user']): string | null => {
  if (!user || !user.profileUrl) return null
  return user.profileUrl
}

export const PostCard = ({ post, className }: PostCardProps) => {
  const router = useRouter()
  const { addToast } = useToast()
  const queryClient = useQueryClient()

  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [likes, setLikes] = useState(post?.likeCount || 0)
  const [shares, setShares] = useState(post?.shareCount || 0)
  const [favorites, setFavorites] = useState(post?.favoriteCount || 0)
  const [postImageErrors, setPostImageErrors] = useState<Record<number, boolean>>({})
  const [avatarError, setAvatarError] = useState(false)

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

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/community/posts/${post.id}`)
  }

  const handleCardClick = () => {
    router.push(`/community/posts/${post.id}`)
  }

  const handleLikeClick = () => {
    toggleLikeMutation.mutate()
  }

  const handleCommentClick = () => {
    router.push(`/community/posts/${post.id}`)
  }

  const handleShareClick = () => {
    shareMutation.mutate('ShareButtonClick')
  }

  const handleFavoriteClick = () => {
    toggleFavoriteMutation.mutate()
  }

  const displayName = getUserDisplayName(post.user)
  const avatar = getUserAvatar(post.user)
  const timestamp = formatDate(post.publishedAt || post.creationDate)

  // Extract images from content or use media if available
  // For now, we'll use a placeholder - in real app, images would come from media relations
  // Extract images from medias array
  type PostWithMedias = PostResponse & { medias?: Array<{ url?: string }> }
  const postWithMedias = post as PostWithMedias
  const images: string[] = postWithMedias.medias
    ?.filter((media: { url?: string }) => media?.url)
    .map((media: { url?: string }) => media.url)
    .filter((url): url is string => typeof url === 'string') || []

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
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
          <div>
            {post.userId && getProfileUrl(post.userId, post.user?.type) ? (
              <Link
                href={getProfileUrl(post.userId, post.user?.type)!}
                onClick={(e) => e.stopPropagation()}
                className="hover:text-brand-500 transition-colors"
              >
                <h4 className="text-16 font-normal text-gray-900">{displayName}</h4>
              </Link>
            ) : (
              <h4 className="text-16 font-normal text-gray-900">{displayName}</h4>
            )}
            <p className="text-12 text-gray-500">{timestamp}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="More options"
          onClick={handleMoreClick}
        >
          <MoreVertical className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      {/* Post Title */}
      {post.title && (
        <h3 className="text-18 font-semibold text-gray-900 mb-2">{post.title}</h3>
      )}

      {/* Post Content */}
      <p className="text-14 text-gray-700 mb-4 whitespace-pre-wrap line-clamp-4">
        {post.content || post.summary}
      </p>

      {/* Post Images */}
      {images.length > 0 ? (
        <div className="mb-4">
          {images.length === 1 ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
              {!postImageErrors[0] ? (
                <Image
                  src={images[0]}
                  alt="Post image"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  onError={() => setPostImageErrors(prev => ({ ...prev, 0: true }))}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-12 font-medium">
                    No image available
                  </span>
                </div>
              )}
            </div>
          ) : images.length === 2 ? (
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                  {!postImageErrors[idx] ? (
                    <Image
                      src={img}
                      alt={`Post image ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                      onError={() => setPostImageErrors(prev => ({ ...prev, [idx]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400 text-12 font-medium">
                        No image available
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1 row-span-2 relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
                {!postImageErrors[0] ? (
                  <Image
                    src={images[0]}
                    alt="Post image 1"
                    fill
                    sizes="(max-width: 768px) 33vw, 16vw"
                    className="object-cover"
                    onError={() => setPostImageErrors(prev => ({ ...prev, 0: true }))}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-12 font-medium">
                      No image available
                    </span>
                  </div>
                )}
              </div>
              <div className="col-span-2 flex flex-col gap-2">
                {images.slice(1, 3).map((img, idx) => (
                  <div key={idx} className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                    {!postImageErrors[idx + 1] ? (
                      <Image
                        src={img}
                        alt={`Post image ${idx + 2}`}
                        fill
                        sizes="(max-width: 768px) 66vw, 33vw"
                        className="object-cover"
                        onError={() => setPostImageErrors(prev => ({ ...prev, [idx + 1]: true }))}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-12 font-medium">
                          No image available
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 5).map(tag => (
            <span
              key={tag.id}
              className="px-2 py-1 bg-gray-100 text-12 text-gray-700 rounded"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Engagement Metrics */}
      <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<Heart className={cn('h-5 w-5', isLiked && 'fill-brand-500')} />}
            count={likes}
            label="Likes"
            onClick={handleLikeClick}
            isActive={isLiked}
            disabled={toggleLikeMutation.isPending}
          />
        </div>
        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<MessageCircle className="h-5 w-5" />}
            count={post.reviewCount || post.commentCount || 0}
            label="Comments"
            onClick={handleCommentClick}
          />
        </div>
        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<Share2 className="h-5 w-5" />}
            count={shares}
            label="Shares"
            onClick={handleShareClick}
            disabled={shareMutation.isPending}
          />
        </div>
        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<Star className={cn('h-5 w-5', isFavorited && 'fill-brand-500')} />}
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
