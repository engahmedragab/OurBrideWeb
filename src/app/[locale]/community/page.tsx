'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { ErrorModal } from '@/components/ui/ErrorModal'
import { useCommunityHome } from '@/hooks/home/useHome'
import {
  usePosts,
  useArticles,
  useBlogs,
  useReels,
  useDecisionGroups,
  useContests,
  usePostsSearch,
  useArticlesSearch,
  useBlogsSearch,
  useReelsSearch,
  useDecisionGroupsSearch,
  useContestsSearch,
} from '@/hooks/community'
import {
  CommunitySidebar,
  CommunityFeed,
  CommunityRightSidebar,
  ArticlesFeed,
  ReelsFeed,
  BlogsFeed,
  DecisionGroupsFeed,
  ContestsFeed,
  type CommunityTab,
} from '@/components/community'
import { CommunityHomeFeed } from '@/components/community/CommunityHomeFeed'
import { useI18nTranslations } from '@/i18n'
import { LoadingSpinner } from '@/components/ui'

const validTabs: CommunityTab[] = ['community', 'posts', 'blogs', 'articles', 'reels', 'decision-groups', 'contests', 'profile']

function CommunityContent() {
  const t = useI18nTranslations('community')
  const tCommon = useI18nTranslations('common')
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get('tab')
  const [activeTab, setActiveTab] = useState<CommunityTab>(
    (tabParam && validTabs.includes(tabParam as CommunityTab))
      ? (tabParam as CommunityTab)
      : 'community'
  )

  // Fetch community home data once (for sidebar user data and community tab)
  // This is always enabled to ensure user data is available for all tabs
  const { data: communityData, isLoading: isLoadingHome, error: homeError } = useCommunityHome({
    postsCount: activeTab === 'community' ? 20 : activeTab === 'posts' ? 20 : undefined,
    articlesCount: activeTab === 'community' ? 20 : activeTab === 'articles' ? 20 : 3,
    suggestedUsersCount: 3,
    topProvidersCount: 3,
    tagsCount: 10,
  }, true) // Always enabled to fetch user data for all tabs

  // Fetch content based on active tab
  const { data: posts, isLoading: isLoadingPosts } = usePosts({
    page: 1,
    pageSize: 20,
    enabled: activeTab === 'posts',
  })

  const { data: articles, isLoading: isLoadingArticles } = useArticles({
    page: 1,
    pageSize: 20,
    enabled: activeTab === 'articles',
  })

  const { data: blogs, isLoading: isLoadingBlogs } = useBlogs({
    page: 1,
    pageSize: 20,
    enabled: activeTab === 'blogs',
  })

  const { data: reels, isLoading: isLoadingReels } = useReels({
    page: 1,
    pageSize: 20,
    enabled: activeTab === 'reels',
  })

  const { data: decisionGroups, isLoading: isLoadingDecisionGroups } = useDecisionGroups({
    page: 1,
    pageSize: 20,
    enabled: activeTab === 'decision-groups',
  })

  const { data: contests, isLoading: isLoadingContests } = useContests({
    page: 1,
    pageSize: 20,
    enabled: activeTab === 'contests',
  })

  // Manage selected reel for reels tab
  const [selectedReelId, setSelectedReelId] = useState<number | null>(null)
  const selectedReel = reels?.find(r => r.id === selectedReelId) || null

  // Search state for each tab
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('')

  // Debounce search query to prevent loader on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Search hooks - only enabled when there's a debounced search query
  const { data: searchPostsData } = usePostsSearch({
    searchTerm: debouncedSearchQuery,
    enabled: activeTab === 'posts' && !!debouncedSearchQuery && debouncedSearchQuery.trim().length > 0,
  })

  const { data: searchArticlesData } = useArticlesSearch({
    searchTerm: debouncedSearchQuery,
    enabled: activeTab === 'articles' && !!debouncedSearchQuery && debouncedSearchQuery.trim().length > 0,
  })

  const { data: searchBlogsData } = useBlogsSearch({
    searchTerm: debouncedSearchQuery,
    enabled: activeTab === 'blogs' && !!debouncedSearchQuery && debouncedSearchQuery.trim().length > 0,
  })

  const { data: searchReelsData } = useReelsSearch({
    searchTerm: debouncedSearchQuery,
    enabled: activeTab === 'reels' && !!debouncedSearchQuery && debouncedSearchQuery.trim().length > 0,
  })

  const { data: searchDecisionGroupsData } = useDecisionGroupsSearch({
    searchTerm: debouncedSearchQuery,
    enabled: activeTab === 'decision-groups' && !!debouncedSearchQuery && debouncedSearchQuery.trim().length > 0,
  })

  const { data: searchContestsData } = useContestsSearch({
    searchTerm: debouncedSearchQuery,
    enabled: activeTab === 'contests' && !!debouncedSearchQuery && debouncedSearchQuery.trim().length > 0,
  })

  // Determine which data to show (search results or regular feed)
  const displayPosts = debouncedSearchQuery ? searchPostsData : posts
  const displayArticles = debouncedSearchQuery ? searchArticlesData : articles
  const displayBlogs = debouncedSearchQuery ? searchBlogsData : blogs
  const displayReels = debouncedSearchQuery ? searchReelsData : reels
  const displayDecisionGroups = debouncedSearchQuery ? searchDecisionGroupsData : decisionGroups
  const displayContests = debouncedSearchQuery ? searchContestsData : contests

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam as CommunityTab)) {
      setActiveTab(tabParam as CommunityTab)
      // Clear search when switching tabs
      setSearchQuery('')
      setDebouncedSearchQuery('')
    }
  }, [tabParam])

  // Handle tab change - redirect profile tab to edit page
  const handleTabChange = (tab: CommunityTab) => {
    if (tab === 'profile') {
      router.push('/profile/edit')
      return
    }
    setActiveTab(tab)
    router.push(`/community?tab=${tab}`)
  }

  // Determine loading state
  const isLoading = (activeTab === 'community' && isLoadingHome) ||
    (activeTab === 'posts' && isLoadingPosts) ||
    (activeTab === 'articles' && isLoadingArticles) ||
    (activeTab === 'blogs' && isLoadingBlogs) ||
    (activeTab === 'reels' && isLoadingReels) ||
    (activeTab === 'decision-groups' && isLoadingDecisionGroups) ||
    (activeTab === 'contests' && isLoadingContests) ||
    (activeTab === 'profile' && false) // Profile tab redirects, so no loading needed

  // Handle search from sidebar
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setDebouncedSearchQuery('')
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1">
              <LoadingSpinner size='xl' fullScreen={true} text={`${tCommon('loading')} ${t(`tabs.${activeTab}`)}`} open={true} />
            </div>
        <Footer />
      </div>
    )
  }

  // Show error state
  if (homeError) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <ErrorModal
            open={true}
            title={t("errors.failedToLoadCommunityData")}
            message={homeError instanceof Error ? homeError.message : t("errors.unknownError")}
            onRetry={() => window.location.reload()}
            onClose={() => {}}
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 md:py-10 lg:py-12">
          {/* Mobile Tab Navigation */}
          <div className="lg:hidden mb-6">
            <div className="flex gap-2 p-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
              <button
                onClick={() => handleTabChange('community')}
                className={cn(
                  'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'community'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {t("tabs.community")}
              </button>
              <button
                onClick={() => handleTabChange('posts')}
                className={cn(
                  'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'posts'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {t("tabs.posts")}
              </button>
              <button
                onClick={() => handleTabChange('blogs')}
                className={cn(
                  'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'blogs'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {t("tabs.blogs")}
              </button>
              <button
                onClick={() => handleTabChange('articles')}
                className={cn(
                  'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'articles'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {t("tabs.articles")}
              </button>
              <button
                onClick={() => handleTabChange('reels')}
                className={cn(
                  'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'reels'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {t("tabs.reels")}
              </button>
              <button
                onClick={() => handleTabChange('decision-groups')}
                className={cn(
                  'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'decision-groups'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {t("tabs.decision-groups")}
              </button>
              <button
                onClick={() => handleTabChange('contests')}
                className={cn(
                  'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'contests'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {t("tabs.contests")}
              </button>
              {communityData?.currentUser?.id && (
                <button
                  onClick={() => handleTabChange('profile')}
                  className={cn(
                    'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                    activeTab === 'profile'
                      ? 'bg-brand-500 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {t("tabs.profile")}
                </button>
              )}
            </div>
          </div>

          <div
            className={cn(
              'flex flex-col gap-6 sm:gap-8 lg:gap-10 xl:gap-12 lg:flex-row lg:items-start',
              activeTab === 'reels' && 'lg:grid lg:grid-cols-[320px_1fr_450px]'
            )}
          >
            {/* Left Sidebar */}
            <aside className={cn(
              'hidden lg:block lg:w-64 xl:w-72 lg:flex-shrink-0',
              activeTab === 'reels' && 'lg:w-auto'
            )}>
              <div className="sticky top-6">
                <CommunitySidebar
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  searchQuery={searchQuery}
                  onSearchChange={handleSearch}
                  onClearSearch={handleClearSearch}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className={cn(
              'flex-1 min-w-0',
              activeTab !== 'reels' && 'w-full lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto lg:mx-0'
            )}>
              {/* Search Results Label - Only show for content tabs (not community tab) */}
              {activeTab !== 'community' && debouncedSearchQuery && (
                <div className="mb-6">
                  <div className="text-sm text-gray-600">
                    {t("labels.showingResultsFor", { query: debouncedSearchQuery })} <span className="font-semibold">&quot;{debouncedSearchQuery}&quot;</span>
                  </div>
                </div>
              )}
              {activeTab === 'community' ? (
                communityData ? (
                  <CommunityHomeFeed
                    data={communityData}
                    currentUser={communityData.currentUser ? {
                      name: `${communityData.currentUser.firstName || ''} ${communityData.currentUser.lastName || ''}`.trim() || communityData.currentUser.userName || 'User',
                      avatar: communityData.currentUser.profileUrl || 'https://via.placeholder.com/100'
                    } : undefined}
                  />
                ) : null
              ) : activeTab === 'posts' ? (
                <CommunityFeed
                  posts={displayPosts || []}
                  currentUser={communityData?.currentUser ? {
                    name: `${communityData.currentUser.firstName || ''} ${communityData.currentUser.lastName || ''}`.trim() || communityData.currentUser.userName || 'User',
                    avatar: communityData.currentUser.profileUrl || 'https://via.placeholder.com/100'
                  } : undefined}
                />
              ) : activeTab === 'blogs' ? (
                <BlogsFeed blogs={displayBlogs || []} />
              ) : activeTab === 'articles' ? (
                <ArticlesFeed articles={displayArticles || []} />
              ) : activeTab === 'reels' ? (
                <ReelsFeed
                  reels={displayReels || []}
                  selectedReelId={selectedReelId}
                  onReelSelect={setSelectedReelId}
                />
              ) : activeTab === 'decision-groups' ? (
                <DecisionGroupsFeed decisionGroups={displayDecisionGroups || []} />
              ) : activeTab === 'contests' ? (
                <ContestsFeed contests={displayContests || []} />
              ) : (
                communityData ? (
                  <CommunityHomeFeed
                    data={communityData}
                    currentUser={communityData.currentUser ? {
                      name: `${communityData.currentUser.firstName || ''} ${communityData.currentUser.lastName || ''}`.trim() || communityData.currentUser.userName || 'User',
                      avatar: communityData.currentUser.profileUrl || 'https://via.placeholder.com/100'
                    } : undefined}
                  />
                ) : null
              )}
            </div>

            {/* Right Sidebar */}
            <aside className={cn(
              'hidden xl:block xl:w-80 2xl:w-96 xl:flex-shrink-0',
              activeTab === 'reels' && 'xl:w-auto'
            )}>
              <div className="sticky top-6">
                <CommunityRightSidebar
                  activeTab={activeTab}
                  currentUser={communityData?.currentUser ? {
                    name: `${communityData.currentUser.firstName || ''} ${communityData.currentUser.lastName || ''}`.trim() || communityData.currentUser.userName || 'User',
                    email: communityData.currentUser.email || '',
                    avatar: communityData.currentUser.profileUrl || 'https://via.placeholder.com/100'
                  } : undefined}
                  suggestedUsers={communityData?.suggestedUsers || []}
                  topProviders={communityData?.topProviders || []}
                  recentArticles={communityData?.recentArticles || []}
                  tags={communityData?.tags || []}
                  selectedReel={selectedReel}
                />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function CommunityPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <LoadingSpinner
              
              open={true}
              
            />
          </main>
          <Footer />
        </div>
      }
    >
      <CommunityContent />
    </Suspense>
  )
}

