'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, Share2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EngagementButton } from './EngagementButton'
import { getProfileUrl } from './utils'
import type { ArticleResponse } from '@/types/responses/community'
import {
  toggleLike as toggleArticleLike,
  toggleFavorite as toggleArticleFavorite,
  shareArticle,
} from '@/services/api/articlesApi'
import { useToast } from '@/components/ui/Toaster'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { COMMUNITY_IMAGES } from '@/constants/community-images'
import { useI18nTranslations } from '@/i18n/hooks'

export interface ArticleCardProps {
  article: ArticleResponse
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
const getUserDisplayName = (user: ArticleResponse['user']): string => {
  if (!user) return 'OurBride'
  const firstName = user.firstName && user.firstName !== 'null' ? user.firstName : ''
  const lastName = user.lastName && user.lastName !== 'null' ? user.lastName : ''
  const fullName = `${firstName} ${lastName}`.trim()
  if (fullName) return fullName
  // If userName is admin@our-bride.com, display as OurBride
  if (user.userName && user.userName.toLowerCase() === 'admin@our-bride.com') {
    return 'OurBride'
  }
  return user.userName || 'OurBride'
}

// Helper function to get user avatar
const getUserAvatar = (user: ArticleResponse['user']): string | null => {
  if (!user || !user.profileUrl) return null
  return user.profileUrl
}

export const ArticleCard = ({ article, className }: ArticleCardProps) => {
  const t = useI18nTranslations('community')
  const tC = useI18nTranslations('common')

  const router = useRouter()
  const { addToast } = useToast()
  const queryClient = useQueryClient()

  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [likes, setLikes] = useState(article.likeCount || 0)
  const [shares, setShares] = useState(article.shareCount || 0)
  const [favorites, setFavorites] = useState(article.favoriteCount || 0)
  const [imageError, setImageError] = useState(false)
  const [avatarError, setAvatarError] = useState(false)

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
      addToast(
        error instanceof Error ? error.message : t('articleDetails.failedToToggleLike'),
        'error'
      )
    },
  })

  const shareMutation = useMutation({
    mutationFn: async (shareSource?: string) => {
      return await shareArticle(article.id, shareSource)
    },
    onSuccess: (data) => {
      if (data) {
        setShares(data.shareCount)
        const urlToShare =
          data.shortUrl ||
          data.fullUrl ||
          `${window.location.origin}/community/articles/${article.id}`
        navigator.clipboard.writeText(urlToShare).catch(() => {})
        addToast(t('articleDetails.sharedSuccessfully'), 'success')
      }
      queryClient.invalidateQueries({ queryKey: ['article', article.id] })
    },
    onError: (error) => {
      addToast(
        error instanceof Error ? error.message : t('articleDetails.failedToShareArticle'),
        'error'
      )
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
      addToast(
        error instanceof Error ? error.message : t('articleDetails.failedToToggleFavorite'),
        'error'
      )
    },
  })

  const handleCardClick = () => {
    router.push(`/community/articles/${article.id}`)
  }

  const handleLikeClick = () => {
    toggleLikeMutation.mutate()
  }

  const handleCommentClick = () => {
    router.push(`/community/articles/${article.id}`)
  }

  const handleShareClick = () => {
    shareMutation.mutate('ShareButtonClick')
  }

  const handleFavoriteClick = () => {
    toggleFavoriteMutation.mutate()
  }

  const displayName = getUserDisplayName(article.user)
  const avatar = getUserAvatar(article.user)
  const date = formatDate(article.publishedAt || article.creationDate)

  // Extract images from medias array
  const medias = (article as any).medias || []
  const imageUrl = medias.find((media: any) => media?.url)?.url

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      {imageUrl ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4 bg-gray-100">
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
                {tC('noImageAvailable')}
              </span>
            </div>
          )}
        </div>
      ) : null}

      <h3 className="text-20 font-normal text-gray-900 mb-3">{article.title}</h3>

      <p className="text-14 text-gray-700 mb-4 line-clamp-3">
        {article.summary || article.excerpt || article.content.substring(0, 150)}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {avatar && avatar !== 'https://via.placeholder.com/100' && !avatarError ? (
              <Image
                src={avatar}
                alt={displayName}
                fill
                sizes="32px"
                className="object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand-100">
                <span className="text-12 font-semibold text-brand-600">
                  {displayName.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>

          <div>
            {article.userId && getProfileUrl(article.userId, article.user?.type) ? (
              <Link
                href={getProfileUrl(article.userId, article.user?.type)!}
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
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/community/articles/${article.id}`)
          }}
          className="text-14 font-normal text-brand-500 hover:text-brand-600 transition-colors"
        >
          {t('articleDetails.articleCard.readMore')}
        </span>
      </div>

      {article.readingTime > 0 && (
        <div className="mt-2 text-12 text-gray-500">
          {article.readingTime} {t('articleDetails.articleCard.minRead')}
        </div>
      )}

      {/* Engagement Metrics */}
      <div className="flex items-center justify-center gap-3 pt-4 mt-4 border-t border-gray-100">
        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<Heart className={cn('h-5 w-5', isLiked && 'fill-brand-500')} />}
            count={likes}
            label={t('postCard.likes')}
            onClick={handleLikeClick}
            isActive={isLiked}
            disabled={toggleLikeMutation.isPending}
          />
        </div>

        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<MessageCircle className="h-5 w-5" />}
            count={article.reviewCount || article.commentCount || 0}
            label={t('postCard.comments')}
            onClick={handleCommentClick}
          />
        </div>

        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<Share2 className="h-5 w-5" />}
            count={shares}
            label={t('postCard.shares')}
            onClick={handleShareClick}
            disabled={shareMutation.isPending}
          />
        </div>

        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<Star className={cn('h-5 w-5', isFavorited && 'fill-brand-500')} />}
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
