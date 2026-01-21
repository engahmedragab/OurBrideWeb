'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Heart,
  UserPlus,
  Star,
  ArrowLeft,
  MoreVertical,
  FileText,
  BookOpen,
  Monitor,
  Users,
  Trophy,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import type { CommunityProfileResponse } from '@/types/responses/community'
import type { UnifiedCommunityContentResponse } from '@/types/responses/community'
import {
  useToggleProfileLike,
  useToggleProfileFollow,
  useToggleProfileFavorite,
} from '@/hooks/community'
import { PostCard } from './PostCard'
import { BlogCard } from './BlogCard'
import { ArticleCard } from './ArticleCard'
import { ReelCard } from './ReelCard'
import { DecisionGroupCard } from './DecisionGroupCard'
import { ContestCard } from './ContestCard'
import { useI18nTranslations } from '@/i18n/hooks'

export interface CommunityProfileProps {
  profile: CommunityProfileResponse
  className?: string
}

type ContentTab =
  | 'all'
  | 'posts'
  | 'blogs'
  | 'articles'
  | 'reels'
  | 'decision-groups'
  | 'contests'

export const CommunityProfile = ({
  profile,
  className,
}: CommunityProfileProps) => {
  const t = useI18nTranslations('community')
  const tC = useI18nTranslations('common')

  const router = useRouter()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState<ContentTab>('all')
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing)
  const [isLiked, setIsLiked] = useState(profile.isLiked)
  const [isFavorited, setIsFavorited] = useState(profile.isFavorited)

  const toggleLikeMutation = useToggleProfileLike()
  const toggleFollowMutation = useToggleProfileFollow()
  const toggleFavoriteMutation = useToggleProfileFavorite()

  // Update local state when profile changes
  useEffect(() => {
    setIsFollowing(profile.isFollowing)
    setIsLiked(profile.isLiked)
    setIsFavorited(profile.isFavorited)
  }, [profile.isFollowing, profile.isLiked, profile.isFavorited])

  const getProfileParams = () => {
    return {
      profileType: profile.profileType,
      profileId: profile.profileType !== 'User' ? profile.profileId : undefined,
      profileUserId:
        profile.profileType === 'User' ? profile.userInfo?.userId : undefined,
    }
  }

  const handleFollow = async () => {
    try {
      await toggleFollowMutation.mutateAsync(getProfileParams())
      setIsFollowing(!isFollowing)
      addToast(
        isFollowing
          ? t('articleDetails.unfollowedSuccessfully')
          : t('articleDetails.followedSuccessfully'),
        'success'
      )
    } catch (error) {
      setIsFollowing(profile.isFollowing)
      addToast(
        error instanceof Error
          ? error.message
          : t('articleDetails.failedToToggleFollow'),
        'error'
      )
    }
  }

  const handleLike = async () => {
    try {
      await toggleLikeMutation.mutateAsync(getProfileParams())
      setIsLiked(!isLiked)
      addToast(
        isLiked ? t('profile.toasts.unliked') : t('profile.toasts.liked'),
        'success'
      )
    } catch (error) {
      setIsLiked(profile.isLiked)
      addToast(
        error instanceof Error ? error.message : t('articleDetails.failedToToggleLike'),
        'error'
      )
    }
  }

  const handleFavorite = async () => {
    try {
      await toggleFavoriteMutation.mutateAsync(getProfileParams())
      setIsFavorited(!isFavorited)
      addToast(
        isFavorited
          ? t('profile.toasts.removedFromFavorites')
          : t('profile.toasts.addedToFavorites'),
        'success'
      )
    } catch (error) {
      setIsFavorited(profile.isFavorited)
      addToast(
        error instanceof Error
          ? error.message
          : t('articleDetails.failedToToggleFavorite'),
        'error'
      )
    }
  }

  const renderContentCard = (content: UnifiedCommunityContentResponse) => {
    const contentType = content.contentType.toLowerCase()

    switch (contentType) {
      case 'post':
        return content.post ? <PostCard key={content.id} post={content.post} /> : null
      case 'blog':
        return content.blog ? <BlogCard key={content.id} blog={content.blog} /> : null
      case 'article':
        return content.article ? (
          <ArticleCard key={content.id} article={content.article} />
        ) : null
      case 'reel':
        return content.reel ? <ReelCard key={content.id} reel={content.reel} /> : null
      case 'decisiongroup':
        return content.decisionGroup ? (
          <DecisionGroupCard
            key={content.id}
            decisionGroup={content.decisionGroup}
          />
        ) : null
      case 'contest':
        return content.contest ? (
          <ContestCard key={content.id} contest={content.contest} />
        ) : null
      default:
        return null
    }
  }

  const filterContent = (content: UnifiedCommunityContentResponse[]) => {
    if (activeTab === 'all') return content
    return content.filter((c) => {
      const type = c.contentType.toLowerCase()
      switch (activeTab) {
        case 'posts':
          return type === 'post'
        case 'blogs':
          return type === 'blog'
        case 'articles':
          return type === 'article'
        case 'reels':
          return type === 'reel'
        case 'decision-groups':
          return type === 'decisiongroup' || type === 'decision group'
        case 'contests':
          return type === 'contest'
        default:
          return true
      }
    })
  }

  const allContent = [
    ...(profile.recentContent || []),
    ...(profile.featuredContent || []),
  ]
  const filteredContent = filterContent(allContent)

  const activeTabLabel =
    activeTab === 'all' ? t('profile.tabs.all') : t(`tabs.${activeTab}`)

  return (
    <div className={cn('space-y-6', className)}>
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/community')}
          className="h-10 w-10"
          aria-label={t('profile.aria.goBack')}
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>

        <div className="flex items-center gap-2 text-14 text-gray-600">
          <button
            onClick={() => router.push('/community')}
            className="hover:text-brand-500 transition-colors"
          >
            {t('tabs.community')}
          </button>
          <span>/</span>
          <span className="text-gray-900">{profile.displayName}</span>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Cover Image */}
        <div className="relative w-full h-64 bg-gradient-to-r from-brand-500 to-brand-600">
          {profile.coverImageUrl ? (
            <Image
              src={profile.coverImageUrl}
              alt={t('profile.aria.coverAlt', { name: profile.displayName })}
              fill
              sizes="100vw"
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : null}
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="relative -mt-16">
                <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-200">
                  {profile.avatarUrl &&
                  profile.avatarUrl !== 'https://via.placeholder.com/128' ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={t('profile.aria.avatarAlt', { name: profile.displayName })}
                      fill
                      sizes="128px"
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-100">
                      <span className="text-32 font-semibold text-brand-600">
                        {profile.displayName.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Bio */}
              <div className="flex-1 pb-4">
                <h1 className="text-28 font-semibold text-gray-900 mb-2">
                  {profile.displayName}
                </h1>

                {profile.bio && <p className="text-14 text-gray-700 mb-2">{profile.bio}</p>}

                {profile.userInfo && (
                  <p className="text-12 text-gray-500">@{profile.userInfo.userName}</p>
                )}

                {profile.providerInfo && (
                  <p className="text-12 text-gray-500">
                    {profile.providerInfo.category} {t('communityRightSidebar.provider')}
                  </p>
                )}

                {profile.bazaarEventInfo && (
                  <p className="text-12 text-gray-500">
                    {profile.bazaarEventInfo.eventName}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant={isFollowing ? 'outline' : 'brand'}
                size="md"
                onClick={handleFollow}
                disabled={toggleFollowMutation.isPending}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {toggleFollowMutation.isPending
                  ? tC('loading')
                  : isFollowing
                    ? t('actions.following')
                    : t('actions.follow')}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                disabled={toggleLikeMutation.isPending}
                className={cn(isLiked && 'text-red-500')}
                aria-label={isLiked ? t('profile.aria.unlike') : t('profile.aria.like')}
              >
                <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavorite}
                disabled={toggleFavoriteMutation.isPending}
                className={cn(isFavorited && 'text-yellow-500')}
                aria-label={
                  isFavorited
                    ? t('profile.aria.removeFromFavorites')
                    : t('profile.aria.addToFavorites')
                }
              >
                <Star className={cn('h-5 w-5', isFavorited && 'fill-current')} />
              </Button>

              <Button variant="ghost" size="icon" aria-label={t('profile.aria.moreOptions')}>
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-20 font-semibold text-gray-900">{profile.totalContent}</div>
              <div className="text-12 text-gray-600">{t('profile.stats.totalContent')}</div>
            </div>

            <div className="text-center">
              <div className="text-20 font-semibold text-gray-900">{profile.totalFollowers}</div>
              <div className="text-12 text-gray-600">{t('profile.stats.followers')}</div>
            </div>

            <div className="text-center">
              <div className="text-20 font-semibold text-gray-900">{profile.totalFollowing}</div>
              <div className="text-12 text-gray-600">{t('profile.stats.following')}</div>
            </div>

            <div className="text-center">
              <div className="text-20 font-semibold text-gray-900">{profile.totalLikes}</div>
              <div className="text-12 text-gray-600">{t('profile.stats.likes')}</div>
            </div>

            <div className="text-center">
              <div className="text-20 font-semibold text-gray-900">{profile.totalViews}</div>
              <div className="text-12 text-gray-600">{t('profile.stats.views')}</div>
            </div>
          </div>

          {/* Content Type Breakdown */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-14 text-gray-700 mb-1">
                <Globe className="h-4 w-4" />
                <span className="font-semibold">{profile.totalPosts}</span>
              </div>
              <div className="text-12 text-gray-600">{t('tabs.posts')}</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-14 text-gray-700 mb-1">
                <BookOpen className="h-4 w-4" />
                <span className="font-semibold">{profile.totalBlogs}</span>
              </div>
              <div className="text-12 text-gray-600">{t('tabs.blogs')}</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-14 text-gray-700 mb-1">
                <FileText className="h-4 w-4" />
                <span className="font-semibold">{profile.totalArticles}</span>
              </div>
              <div className="text-12 text-gray-600">{t('tabs.articles')}</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-14 text-gray-700 mb-1">
                <Monitor className="h-4 w-4" />
                <span className="font-semibold">{profile.totalReels}</span>
              </div>
              <div className="text-12 text-gray-600">{t('tabs.reels')}</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-14 text-gray-700 mb-1">
                <Users className="h-4 w-4" />
                <span className="font-semibold">{profile.totalDecisionGroups}</span>
              </div>
              <div className="text-12 text-gray-600">{t('tabs.decision-groups')}</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-14 text-gray-700 mb-1">
                <Trophy className="h-4 w-4" />
                <span className="font-semibold">{profile.totalContests}</span>
              </div>
              <div className="text-12 text-gray-600">{t('tabs.contests')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-lg text-14 font-semibold transition-colors',
              activeTab === 'all'
                ? 'bg-brand-500 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            {t('profile.tabs.all')}
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-lg text-14 font-semibold transition-colors',
              activeTab === 'posts'
                ? 'bg-brand-500 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            {t('profile.tabs.withCount', { label: t('tabs.posts'), count: profile.totalPosts })}
          </button>

          <button
            onClick={() => setActiveTab('blogs')}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-lg text-14 font-semibold transition-colors',
              activeTab === 'blogs'
                ? 'bg-brand-500 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            {t('profile.tabs.withCount', { label: t('tabs.blogs'), count: profile.totalBlogs })}
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-lg text-14 font-semibold transition-colors',
              activeTab === 'articles'
                ? 'bg-brand-500 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            {t('profile.tabs.withCount', {
              label: t('tabs.articles'),
              count: profile.totalArticles,
            })}
          </button>

          <button
            onClick={() => setActiveTab('reels')}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-lg text-14 font-semibold transition-colors',
              activeTab === 'reels'
                ? 'bg-brand-500 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            {t('profile.tabs.withCount', { label: t('tabs.reels'), count: profile.totalReels })}
          </button>

          <button
            onClick={() => setActiveTab('decision-groups')}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-lg text-14 font-semibold transition-colors',
              activeTab === 'decision-groups'
                ? 'bg-brand-500 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            {t('profile.tabs.withCount', {
              label: t('tabs.decision-groups'),
              count: profile.totalDecisionGroups,
            })}
          </button>

          <button
            onClick={() => setActiveTab('contests')}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-lg text-14 font-semibold transition-colors',
              activeTab === 'contests'
                ? 'bg-brand-500 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            {t('profile.tabs.withCount', {
              label: t('tabs.contests'),
              count: profile.totalContests,
            })}
          </button>
        </div>
      </div>

      {/* Featured Content */}
      {profile.featuredContent && profile.featuredContent.length > 0 && (
        <div>
          <h2 className="text-20 font-semibold text-gray-900 mb-4">
            {t('profile.headings.featuredContent')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.featuredContent.map((content) => renderContentCard(content))}
          </div>
        </div>
      )}

      {/* All Content */}
      <div>
        <h2 className="text-20 font-semibold text-gray-900 mb-4">
          {activeTab === 'all' ? t('profile.headings.allContent') : activeTabLabel}
        </h2>

        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((content) => renderContentCard(content))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-16 text-gray-500">{t('profile.states.noContentFound')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
