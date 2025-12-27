'use client'

import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { ReelPlayer, CommunitySidebar, CommunityRightSidebar, type CommunityTab } from '@/components/community'
import { useCommunityHome } from '@/hooks/home/useHome'
import { getReelById } from '@/services/api/reelsApi'
import { useQuery } from '@tanstack/react-query'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { cn } from '@/lib/utils'

export function ReelDetailsClient({ id }: { id: string }) {
  const activeTab: CommunityTab = 'reels'

  // Fetch community home data for sidebars
  const { data: communityData } = useCommunityHome({
    postsCount: undefined,
    articlesCount: 3,
    suggestedUsersCount: 3,
    topProvidersCount: 3,
    tagsCount: 10,
  }, true)

  // Fetch reel data
  const { data: reel, isLoading, error } = useQuery({
    queryKey: ['reel', id],
    queryFn: async () => {
      const reelId = parseInt(id, 10)
      if (isNaN(reelId)) throw new Error('Invalid reel ID')
      return await getReelById(reelId)
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[400px]">
          <LoadingOverlay open={true} title="Loading reel..." />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !reel) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Reel not found</p>
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
        <div className="container-custom py-6 md:py-8">
          <div className={cn('flex flex-col gap-6 lg:grid lg:grid-cols-[320px_1fr_450px]')}>
            {/* Left Sidebar */}
            <div className="hidden lg:block">
              <CommunitySidebar
                activeTab={activeTab}
                onTabChange={() => { }}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="max-w-md mx-auto">
                <ReelPlayer id={id} />
              </div>
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
                selectedReel={reel}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}




