'use client'

import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { PostDetails, CommunitySidebar, CommunityRightSidebar, type CommunityTab } from '@/components/community'
import { useCommunityHome } from '@/hooks/home/useHome'
import { getPostById } from '@/services/api/postsApi'
import { useQuery } from '@tanstack/react-query'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { cn } from '@/lib/utils'
import type { PostResponse } from '@/types/responses/community'

export function PostDetailsClient({ id }: { id: string }) {
  const activeTab: CommunityTab = 'posts'

  // Fetch community home data for sidebars
  const { data: communityData } = useCommunityHome({
    postsCount: undefined,
    articlesCount: 3,
    suggestedUsersCount: 3,
    topProvidersCount: 3,
    tagsCount: 10,
  }, true)

  // Fetch post data
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const postId = parseInt(id, 10)
      if (isNaN(postId)) throw new Error('Invalid post ID')
      return await getPostById(postId)
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[60vh] py-12">
          <LoadingOverlay open={true} title="Loading post..." />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[60vh] py-12">
          <div className="w-full max-w-md mx-auto px-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 sm:p-10 text-center">
              <p className="text-gray-600 text-base sm:text-lg font-medium">Post not found</p>
              <p className="text-gray-500 text-sm mt-2">The post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            </div>
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
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 md:py-10 lg:py-12">
          <div className={cn('flex flex-col gap-6 sm:gap-8 lg:gap-10 xl:gap-12 lg:flex-row lg:items-start')}>
            {/* Left Sidebar */}
            <aside className="hidden lg:block lg:w-64 xl:w-72 lg:flex-shrink-0">
              <div className="sticky top-6">
                <CommunitySidebar
                  activeTab={activeTab}
                  onTabChange={() => { }}
                />
              </div>
            </aside>

            {/* Main Content */}
            <article className="flex-1 min-w-0 w-full lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto lg:mx-0">
              <div className="w-full">
                <PostDetails post={post as PostResponse} />
              </div>
            </article>

            {/* Right Sidebar */}
            <aside className="hidden xl:block xl:w-80 2xl:w-96 xl:flex-shrink-0">
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




