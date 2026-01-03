'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, Share2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EngagementButton } from './EngagementButton'
import { getProfileUrl } from './utils'
import type { BlogResponse } from '@/types/responses/community'
import { toggleLike as toggleBlogLike, toggleFavorite as toggleBlogFavorite, shareBlog } from '@/services/api/blogsApi'
import { useToast } from '@/components/ui/Toaster'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { COMMUNITY_IMAGES } from '@/constants/community-images'

export interface BlogCardProps {
  blog: BlogResponse
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
  })
}

// Helper function to get user display name
const getUserDisplayName = (user: BlogResponse['user'], authorName?: string): string => {
  if (!user) return authorName || 'OurBride'
  const firstName = (user.firstName && user.firstName !== 'null') ? user.firstName : ''
  const lastName = (user.lastName && user.lastName !== 'null') ? user.lastName : ''
  const fullName = `${firstName} ${lastName}`.trim()
  return fullName || user.userName || authorName || 'OurBride'
}

// Helper function to get user avatar
const getUserAvatar = (user: BlogResponse['user']): string | null => {
  if (!user || !user.profileUrl) return null
  return user.profileUrl
}

export const BlogCard = ({ blog, className }: BlogCardProps) => {
  const router = useRouter()
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [likes, setLikes] = useState(blog.likeCount || 0)
  const [shares, setShares] = useState(blog.shareCount || 0)
  const [favorites, setFavorites] = useState(blog.favoriteCount || 0)

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
      addToast(error instanceof Error ? error.message : 'Failed to toggle like', 'error')
    },
  })

  const shareMutation = useMutation({
    mutationFn: async (shareSource?: string) => {
      return await shareBlog(blog.id, shareSource)
    },
    onSuccess: (data) => {
      if (data) {
        setShares(data.shareCount)
        const urlToShare = data.shortUrl || data.fullUrl || `${window.location.origin}/community/blogs/${blog.id}`
        navigator.clipboard.writeText(urlToShare).catch(() => { })
        addToast('Shared successfully! Link copied to clipboard.', 'success')
      }
      queryClient.invalidateQueries({ queryKey: ['blog', blog.id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to share blog', 'error')
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
      addToast(error instanceof Error ? error.message : 'Failed to toggle favorite', 'error')
    },
  })

  const handleCardClick = () => {
    router.push(`/community/blogs/${blog.id}`)
  }

  const handleLikeClick = () => {
    toggleLikeMutation.mutate()
  }

  const handleCommentClick = () => {
    router.push(`/community/blogs/${blog.id}`)
  }

  const handleShareClick = () => {
    shareMutation.mutate('ShareButtonClick')
  }

  const handleFavoriteClick = () => {
    toggleFavoriteMutation.mutate()
  }

  const displayName = getUserDisplayName(blog.user, blog.authorName)
  const avatar = getUserAvatar(blog.user)
  const date = formatDate(blog.publishedAt || blog.creationDate)
  
  const imageUrl = COMMUNITY_IMAGES.DEFAULT_BLOG_IMAGE

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
        <Image
          src={imageUrl}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <h3 className="text-20 font-normal text-gray-900 mb-3">{blog.title}</h3>
      <p className="text-14 text-gray-700 mb-4 line-clamp-3">
        {blog.summary || blog.excerpt || blog.content.substring(0, 150)}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {avatar ? (
              <Image
                src={avatar}
                alt={displayName}
                fill
                sizes="32px"
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : null}
            {!avatar && (
              <div className="w-full h-full flex items-center justify-center bg-white">
                <Image
                  src={COMMUNITY_IMAGES.DEFAULT_AVATAR_IMAGE}
                  alt="OurBride"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
            )}
          </div>
          <div>
            {blog.userId && getProfileUrl(blog.userId, blog.user?.type) ? (
              <Link
                href={getProfileUrl(blog.userId, blog.user?.type)!}
                onClick={(e) => e.stopPropagation()}
                className="hover:text-brand-500 transition-colors"
              >
                <p className="text-14 font-normal text-gray-900">{displayName}</p>
              </Link>
            ) : (
              <p className="text-14 font-normal text-gray-900">{displayName}</p>
            )}
            <p className="text-12 text-gray-500">{date}</p>
          </div>
        </div>
        <span
          onClick={e => {
            e.stopPropagation()
            router.push(`/community/blogs/${blog.id}`)
          }}
          className="text-14 font-normal text-brand-500 hover:text-brand-600 transition-colors"
        >
          Read More
        </span>
      </div>
      {blog.readingTime > 0 && (
        <div className="mt-2 text-12 text-gray-500">
          {blog.readingTime} min read
        </div>
      )}

      {/* Engagement Metrics */}
      <div className="flex items-center justify-center gap-3 pt-4 mt-4 border-t border-gray-100">
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
            count={blog.reviewCount || blog.commentCount || 0}
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





