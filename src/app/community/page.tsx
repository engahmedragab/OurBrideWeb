'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
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

function CommunityContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get('tab')
  const validTabs: CommunityTab[] = ['community', 'posts', 'blogs', 'articles', 'reels', 'decision-groups', 'contests']
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
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)

  // Search hooks - only enabled when there's a search query
  const { data: searchPostsData, isLoading: isLoadingPostsSearch } = usePostsSearch({
    searchTerm: searchQuery,
    enabled: activeTab === 'posts' && !!searchQuery,
  })

  const { data: searchArticlesData, isLoading: isLoadingArticlesSearch } = useArticlesSearch({
    searchTerm: searchQuery,
    enabled: activeTab === 'articles' && !!searchQuery,
  })

  const { data: searchBlogsData, isLoading: isLoadingBlogsSearch } = useBlogsSearch({
    searchTerm: searchQuery,
    enabled: activeTab === 'blogs' && !!searchQuery,
  })

  const { data: searchReelsData, isLoading: isLoadingReelsSearch } = useReelsSearch({
    searchTerm: searchQuery,
    enabled: activeTab === 'reels' && !!searchQuery,
  })

  const { data: searchDecisionGroupsData, isLoading: isLoadingDecisionGroupsSearch } = useDecisionGroupsSearch({
    searchTerm: searchQuery,
    enabled: activeTab === 'decision-groups' && !!searchQuery,
  })

  const { data: searchContestsData, isLoading: isLoadingContestsSearch } = useContestsSearch({
    searchTerm: searchQuery,
    enabled: activeTab === 'contests' && !!searchQuery,
  })

  // Determine which data to show (search results or regular feed)
  const displayPosts = searchQuery ? searchPostsData : posts
  const displayArticles = searchQuery ? searchArticlesData : articles
  const displayBlogs = searchQuery ? searchBlogsData : blogs
  const displayReels = searchQuery ? searchReelsData : reels
  const displayDecisionGroups = searchQuery ? searchDecisionGroupsData : decisionGroups
  const displayContests = searchQuery ? searchContestsData : contests

  // Determine loading state including search
  const isLoadingSearch = (activeTab === 'posts' && isLoadingPostsSearch) ||
    (activeTab === 'articles' && isLoadingArticlesSearch) ||
    (activeTab === 'blogs' && isLoadingBlogsSearch) ||
    (activeTab === 'reels' && isLoadingReelsSearch) ||
    (activeTab === 'decision-groups' && isLoadingDecisionGroupsSearch) ||
    (activeTab === 'contests' && isLoadingContestsSearch)

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam as CommunityTab)) {
      setActiveTab(tabParam as CommunityTab)
      // Clear search when switching tabs
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }, [tabParam])

  // Determine loading state
  const isLoading = (activeTab === 'community' && isLoadingHome) ||
    (activeTab === 'posts' && (isLoadingPosts || isLoadingSearch)) ||
    (activeTab === 'articles' && (isLoadingArticles || isLoadingSearch)) ||
    (activeTab === 'blogs' && (isLoadingBlogs || isLoadingSearch)) ||
    (activeTab === 'reels' && (isLoadingReels || isLoadingSearch)) ||
    (activeTab === 'decision-groups' && (isLoadingDecisionGroups || isLoadingSearch)) ||
    (activeTab === 'contests' && (isLoadingContests || isLoadingSearch))

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setIsSearchOpen(false)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setIsSearchOpen(false)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[400px]">
          <LoadingOverlay open={true} title="Loading..." />
        </main>
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
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load community data</p>
            <p className="text-gray-600 text-sm">{homeError instanceof Error ? homeError.message : 'Unknown error'}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Mobile Tab Navigation */}
          <div className="lg:hidden mb-6">
            <div className="flex gap-2 p-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
              <button
                onClick={() => setActiveTab('community')}
                className={cn(
                  'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'community'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                Community
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={cn(
                  'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'posts'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={cn(
                  'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'blogs'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                Blogs
              </button>
              <button
                onClick={() => setActiveTab('articles')}
                className={cn(
                  'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'articles'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                Articles
              </button>
              <button
                onClick={() => setActiveTab('reels')}
                className={cn(
                  'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'reels'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                Reels
              </button>
              <button
                onClick={() => setActiveTab('decision-groups')}
                className={cn(
                  'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'decision-groups'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                Decisions
              </button>
              <button
                onClick={() => setActiveTab('contests')}
                className={cn(
                  'flex-shrink-0 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'contests'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                Contests
              </button>
            </div>
          </div>

          <div
            className={cn(
              'flex flex-col gap-6',
              activeTab === 'reels'
                ? 'lg:grid lg:grid-cols-[320px_1fr_450px]'
                : 'lg:flex-row'
            )}
          >
            {/* Left Sidebar */}
            <div className="hidden lg:block">
              <CommunitySidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Search Bar - Only show for content tabs (not community tab) */}
              {activeTab !== 'community' && (
                <div className="mb-6">
                  {!isSearchOpen ? (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Search"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSearch(searchQuery)
                              }
                            }}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            autoFocus
                          />
                          <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <button
                          onClick={() => handleSearch(searchQuery)}
                          className="flex items-center justify-center w-8 h-8 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                          title="Search"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </button>
                        {searchQuery && (
                          <button
                            onClick={handleClearSearch}
                            className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Clear search"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setIsSearchOpen(false)
                            if (!searchQuery) {
                              handleClearSearch()
                            }
                          }}
                          className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Close"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  {searchQuery && (
                    <div className="mt-2 text-sm text-gray-600">
                      Showing results for: <span className="font-semibold">"{searchQuery}"</span>
                    </div>
                  )}
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
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">Loading community data...</p>
                  </div>
                )
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
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">No content available</p>
                  </div>
                )
              )}
            </div>

            {/* Right Sidebar */}
            <div className="hidden xl:block">
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
            <LoadingOverlay
              open={true}
              title="Loading..."
              subtitle="Please wait a moment"
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
