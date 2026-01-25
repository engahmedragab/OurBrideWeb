'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Globe, FileText, Monitor, BookOpen, Users, Trophy, User, UserCircle } from 'lucide-react'
import { useAuth } from '@/auth/hooks'
import { SearchInput } from '@/components/ui/SearchInput'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { ArticlePreview } from './ArticlePreview'
import { CommunityPostsList } from './CommunityPostsList'
import { CommunityEmptyState } from './CommunityEmptyState'
import { useArticles } from '@/hooks/community/useCommunityContent'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { COMMUNITY_IMAGES } from '@/constants/community-images'
import { useI18nTranslations } from '@/i18n'

export type CommunityTab = 'community' | 'posts' | 'blogs' | 'articles' | 'reels' | 'decision-groups' | 'contests' | 'profile'

export interface CommunitySidebarProps {
  className?: string
  activeTab?: CommunityTab
  onTabChange?: (tab: CommunityTab) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onClearSearch?: () => void
}

export const CommunitySidebar = ({
  className,
  activeTab: externalActiveTab,
  onTabChange,
  searchQuery: externalSearchQuery,
  onSearchChange,
  onClearSearch,
}: CommunitySidebarProps) => {
  const t = useI18nTranslations("community")
  const router = useRouter()
  const { user } = useAuth()
  const [internalActiveTab, setInternalActiveTab] = useState<CommunityTab>('posts')
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const activeTab = externalActiveTab ?? internalActiveTab
  
  // Use external search query if provided, otherwise use internal state
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (onSearchChange) {
      onSearchChange(value)
    } else {
      setInternalSearchQuery(value)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    // If search is controlled by parent, don't redirect
    if (onSearchChange) {
      return
    }
    // Otherwise, redirect to search page (fallback behavior)
    if (searchQuery.trim()) {
      router.push(`/community/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e)
    }
  }
  
  const handleClear = () => {
    if (onClearSearch) {
      onClearSearch()
    } else {
      setInternalSearchQuery('')
    }
  }

  // Fetch articles for sidebar preview (only when not on articles tab)
  const { data: articles, isLoading: isLoadingArticles } = useArticles({
    page: 1,
    pageSize: 4, // Show 4 articles in sidebar
    enabled: activeTab !== 'articles', // Don't fetch when articles tab is active
  })

  const handleTabChange = (tab: CommunityTab) => {
    // If profile tab is selected, redirect to profile edit page
    if (tab === 'profile') {
      router.push('/profile/edit')
      return
    }

    if (onTabChange) {
      onTabChange(tab)
      router.push(`/community?tab=${tab}`)
    } else {
      setInternalActiveTab(tab)
      router.push(`/community?tab=${tab}`)
    }
  }

  const handleSeeAllArticles = () => {
    if (onTabChange) {
      onTabChange('articles')
    } else {
      setInternalActiveTab('articles')
    }
    router.push('/community?tab=articles')
  }

  return (
    <aside
      className={cn('w-80 flex-shrink-0 space-y-4 overflow-y-auto', className)}
    >
      {/* Community Title */}
      <h2 className="text-20 font-semibold text-gray-900">{t("tabs.community")}</h2>

      {/* Search Bar - Only show for content tabs (not community tab) */}
      {activeTab !== 'community' && (
        <form onSubmit={handleSearchSubmit}>
          <SearchInput
            placeholder={t("placeholders.searchInTab", { tab: t(`tabs.${activeTab}`) })}
            variant="default"
            size="md"
            className="w-full rounded-lg"
            value={searchQuery}
            onChange={handleSearch}
            onKeyDown={handleSearchKeyDown}
          />
        </form>
      )}

      {/* Navigation Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="space-y-2">
          <button
            onClick={() => handleTabChange('community')}
            className={cn(
              'w-full flex items-center gap-2 py-2 px-0 text-14 font-normal transition-colors relative',
              activeTab === 'community'
                ? 'text-brand-500'
                : 'text-gray-900 hover:text-gray-700'
            )}
          >
            <Home
              className={cn(
                'h-5 w-5 flex-shrink-0',
                activeTab === 'community' ? 'text-brand-500' : 'text-gray-900'
              )}
            />
            <span>{t("tabs.community")}</span>
            {activeTab === 'community' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
            )}
          </button>

          <button
            onClick={() => handleTabChange('posts')}
            className={cn(
              'w-full flex items-center gap-2 py-2 px-0 text-14 font-normal transition-colors relative',
              activeTab === 'posts'
                ? 'text-brand-500'
                : 'text-gray-900 hover:text-gray-700'
            )}
          >
            <Globe
              className={cn(
                'h-5 w-5 flex-shrink-0',
                activeTab === 'posts' ? 'text-brand-500' : 'text-gray-900'
              )}
            />
            <span>{t("tabs.posts")}</span>
            {activeTab === 'posts' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
            )}
          </button>

          <button
            onClick={() => handleTabChange('blogs')}
            className={cn(
              'w-full flex items-center gap-2 py-2 px-0 text-14 font-normal transition-colors relative',
              activeTab === 'blogs'
                ? 'text-brand-500'
                : 'text-gray-900 hover:text-gray-700'
            )}
          >
            <BookOpen
              className={cn(
                'h-5 w-5 flex-shrink-0',
                activeTab === 'blogs' ? 'text-brand-500' : 'text-gray-900'
              )}
            />
            <span>{t("tabs.blogs")}</span>
            {activeTab === 'blogs' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
            )}
          </button>

          <button
            onClick={() => handleTabChange('articles')}
            className={cn(
              'w-full flex items-center gap-2 py-2 px-0 text-14 font-normal transition-colors relative',
              activeTab === 'articles'
                ? 'text-brand-500'
                : 'text-gray-900 hover:text-gray-700'
            )}
          >
            <FileText
              className={cn(
                'h-5 w-5 flex-shrink-0',
                activeTab === 'articles' ? 'text-brand-500' : 'text-gray-900'
              )}
            />
            <span>{t("tabs.articles")}</span>
            {activeTab === 'articles' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
            )}
          </button>

          <button
            onClick={() => handleTabChange('reels')}
            className={cn(
              'w-full flex items-center gap-2 py-2 px-0 text-14 font-normal transition-colors relative',
              activeTab === 'reels'
                ? 'text-brand-500'
                : 'text-gray-900 hover:text-gray-700'
            )}
          >
            <Monitor
              className={cn(
                'h-5 w-5 flex-shrink-0',
                activeTab === 'reels' ? 'text-brand-500' : 'text-gray-900'
              )}
            />
            <span>{t("tabs.reels")}</span>
            {activeTab === 'reels' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
            )}
          </button>

          <button
            onClick={() => handleTabChange('decision-groups')}
            className={cn(
              'w-full flex items-center gap-2 py-2 px-0 text-14 font-normal transition-colors relative',
              activeTab === 'decision-groups'
                ? 'text-brand-500'
                : 'text-gray-900 hover:text-gray-700'
            )}
          >
            <Users
              className={cn(
                'h-5 w-5 flex-shrink-0',
                activeTab === 'decision-groups' ? 'text-brand-500' : 'text-gray-900'
              )}
            />
            <span>{t("tabs.decision-groups")}</span>
            {activeTab === 'decision-groups' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
            )}
          </button>

          <button
            onClick={() => handleTabChange('contests')}
            className={cn(
              'w-full flex items-center gap-2 py-2 px-0 text-14 font-normal transition-colors relative',
              activeTab === 'contests'
                ? 'text-brand-500'
                : 'text-gray-900 hover:text-gray-700'
            )}
          >
            <Trophy
              className={cn(
                'h-5 w-5 flex-shrink-0',
                activeTab === 'contests' ? 'text-brand-500' : 'text-gray-900'
              )}
            />
            <span>{t("tabs.contests")}</span>
            {activeTab === 'contests' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
            )}
          </button>

          {user?.id && (
            <>
              <button
                onClick={() => handleTabChange('profile')}
                className={cn(
                  'w-full flex items-center gap-2 py-2 px-0 text-14 font-normal transition-colors relative',
                  activeTab === 'profile'
                    ? 'text-brand-500'
                    : 'text-gray-900 hover:text-gray-700'
                )}
              >
                <UserCircle
                  className={cn(
                    'h-5 w-5 flex-shrink-0',
                    activeTab === 'profile' ? 'text-brand-500' : 'text-gray-900'
                  )}
                />
                <span>{t("tabs.profile")}</span>
                {activeTab === 'profile' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
                )}
              </button>
              <button
                onClick={() => router.push(`/community/profile?id=${user.id}&type=User`)}
                className={cn(
                  'w-full flex items-center gap-2 py-2 px-0 text-14 font-normal transition-colors relative mt-2 pt-2 border-t border-gray-200',
                  'text-gray-900 hover:text-gray-700'
                )}
              >
                <User
                  className="h-5 w-5 flex-shrink-0 text-gray-900"
                />
                <span>{t("links.myProfile")}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'articles' ? (
        <CommunityPostsList />
      ) : (
        <>
          {/* Articles Title */}
          <div className="flex items-center justify-between">
            <h3 className="text-16 font-normal text-gray-900">{t("tabs.articles")}</h3>
            <button
              onClick={handleSeeAllArticles}
              className="text-14 font-normal text-brand-500 hover:text-brand-600 transition-colors"
            >
              {t("actions.seeAll")}
            </button>
          </div>

          {/* Articles Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            {isLoadingArticles ? (
              <div className="flex justify-center items-center py-8 min-h-[200px]">
                <LoadingOverlay open={true}  />
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="space-y-2">
                {articles.map(article => (
                  <ArticlePreview
                    key={article.id}
                    id={String(article.id)}
                    title={article.title}
                    description={article.summary || article.excerpt || article.content?.substring(0, 100) || ''}
                    thumbnail={COMMUNITY_IMAGES.DEFAULT_ARTICLE_IMAGE}
                  />
                ))}
              </div>
            ) : (
              <div className="py-4">
                <CommunityEmptyState
                  title={t("states.noArticlesTitle")}
                  message={t("states.noArticlesMessage")}
                  compact
                />
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  )
}
