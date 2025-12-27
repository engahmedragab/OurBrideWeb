'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Globe, FileText, Monitor, BookOpen, Users, Trophy } from 'lucide-react'
import { SearchInput } from '@/components/ui/SearchInput'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { ArticlePreview } from './ArticlePreview'
import { CommunityPostsList } from './CommunityPostsList'
import { useArticles } from '@/hooks/community/useCommunityContent'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

export type CommunityTab = 'community' | 'posts' | 'blogs' | 'articles' | 'reels' | 'decision-groups' | 'contests'

export interface CommunitySidebarProps {
  className?: string
  activeTab?: CommunityTab
  onTabChange?: (tab: CommunityTab) => void
}

export const CommunitySidebar = ({
  className,
  activeTab: externalActiveTab,
  onTabChange,
}: CommunitySidebarProps) => {
  const router = useRouter()
  const [internalActiveTab, setInternalActiveTab] = useState<CommunityTab>('posts')
  const [searchQuery, setSearchQuery] = useState('')
  const activeTab = externalActiveTab ?? internalActiveTab

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/community/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e)
    }
  }

  // Fetch articles for sidebar preview (only when not on articles tab)
  const { data: articles, isLoading: isLoadingArticles } = useArticles({
    page: 1,
    pageSize: 4, // Show 4 articles in sidebar
    enabled: activeTab !== 'articles', // Don't fetch when articles tab is active
  })

  const handleTabChange = (tab: CommunityTab) => {
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
      <h2 className="text-20 font-semibold text-gray-900">Community</h2>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit}>
        <SearchInput
          placeholder="Search Community"
          variant="default"
          size="md"
          className="w-full rounded-lg"
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleSearchKeyDown}
        />
      </form>

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
            <span>Community</span>
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
            <span>Posts</span>
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
            <span>Blogs</span>
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
            <span>Articles</span>
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
            <span>Reels</span>
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
            <span>Decision Groups</span>
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
            <span>Contests</span>
            {activeTab === 'contests' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
            )}
          </button>
        </div>
      </div>

      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'articles' ? (
        <CommunityPostsList />
      ) : (
        <>
          {/* Articles Title */}
          <div className="flex items-center justify-between">
            <h3 className="text-16 font-normal text-gray-900">Articles</h3>
            <button
              onClick={handleSeeAllArticles}
              className="text-14 font-normal text-brand-500 hover:text-brand-600 transition-colors"
            >
              See All
            </button>
          </div>

          {/* Articles Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            {isLoadingArticles ? (
              <div className="flex justify-center items-center py-8 min-h-[200px]">
                <LoadingOverlay open={true} title="Loading..." />
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="space-y-2">
                {articles.map(article => (
                  <ArticlePreview
                    key={article.id}
                    id={String(article.id)}
                    title={article.title}
                    description={article.summary || article.excerpt || article.content?.substring(0, 100) || ''}
                    thumbnail={`https://via.placeholder.com/200?text=${encodeURIComponent(article.title?.charAt(0)?.toUpperCase() || 'A')}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-14 text-gray-500">No articles available</p>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  )
}
