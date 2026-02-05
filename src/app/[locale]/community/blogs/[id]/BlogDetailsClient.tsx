'use client'

import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { BlogDetails, CommunitySidebar, CommunityRightSidebar, type CommunityTab } from '@/components/community'
import { useCommunityHome } from '@/hooks/home/useHome'
import { getBlogById, getBlogBySlug } from '@/services/api/blogsApi'
import { useQuery } from '@tanstack/react-query'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { cn } from '@/lib/utils'
import type { BlogResponse } from '@/types/responses/community'
import { useI18nTranslations } from '@/i18n/hooks'
import { LoadingSpinner } from '@/components/ui'

// Helper function to determine if a string is a number
const isNumeric = (str: string): boolean => {
  return /^\d+$/.test(str)
}

export function BlogDetailsClient({ id }: { id: string }) {
  const t = useI18nTranslations("community")
  const activeTab: CommunityTab = 'blogs'

  // Fetch community home data for sidebars
  const { data: communityData } = useCommunityHome({
    postsCount: undefined,
    articlesCount: 3,
    suggestedUsersCount: 3,
    topProvidersCount: 3,
    tagsCount: 10,
  }, true)

  // Fetch blog data - support both ID and slug
  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      if (isNumeric(id)) {
        const blogId = parseInt(id, 10)
        return await getBlogById(blogId)
      } else {
        return await getBlogBySlug(id)
      }
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[60vh] py-12">
          <LoadingSpinner open={true} text={t("blogDetails.loading")} />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[60vh] py-12">
          <div className="w-full max-w-md mx-auto px-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 sm:p-10 text-center">
              <p className="text-gray-600 text-base sm:text-lg font-medium">{t("blogDetails.blogNotFoundTitle")}</p>
              <p className="text-gray-500 text-sm mt-2">{t("blogDetails.blogNotFoundMessage")}</p>
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
                <BlogDetails blog={blog as BlogResponse} />
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

