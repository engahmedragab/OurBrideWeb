'use client'

import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { DecisionGroupDetails, CommunitySidebar, CommunityRightSidebar, type CommunityTab } from '@/components/community'
import { useCommunityHome } from '@/hooks/home/useHome'
import { getDecisionGroupById } from '@/services/api/decisionGroupsApi'
import { useQuery } from '@tanstack/react-query'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { cn } from '@/lib/utils'

export function DecisionGroupDetailsClient({ id }: { id: string }) {
  const activeTab: CommunityTab = 'decision-groups'

  // Fetch community home data for sidebars
  const { data: communityData } = useCommunityHome({
    postsCount: undefined,
    articlesCount: 3,
    suggestedUsersCount: 3,
    topProvidersCount: 3,
    tagsCount: 10,
  }, true)

  // Fetch decision group data
  const { data: decisionGroup, isLoading, error } = useQuery({
    queryKey: ['decision-group', id],
    queryFn: async () => {
      const groupId = parseInt(id, 10)
      if (isNaN(groupId)) throw new Error('Invalid decision group ID')
      return await getDecisionGroupById(groupId)
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[400px]">
          <LoadingOverlay open={true} title="Loading decision group..." />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !decisionGroup) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Decision group not found</p>
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
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 md:py-8">
          <div className={cn('flex flex-col gap-6 lg:gap-8 xl:gap-12 2xl:gap-16 lg:flex-row lg:items-start')}>
            {/* Left Sidebar */}
            <div className="hidden lg:block lg:w-64 xl:w-72 lg:flex-shrink-0">
              <CommunitySidebar
                activeTab={activeTab}
                onTabChange={() => { }}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 max-w-none lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto lg:mx-0 lg:px-8 xl:px-12 2xl:px-16">
              <DecisionGroupDetails decisionGroup={decisionGroup as any} />
            </div>

            {/* Right Sidebar */}
            <div className="hidden xl:block xl:w-80 2xl:w-96 xl:flex-shrink-0">
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}




