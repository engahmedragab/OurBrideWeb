'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import {
  CommunitySidebar,
  CommunityFeed,
  CommunityRightSidebar,
  ArticlesFeed,
  ReelsFeed,
  ReelsSidebar,
} from '@/components/community'

function CommunityContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get('tab')
  const [activeTab, setActiveTab] = useState<'posts' | 'articles' | 'reels'>(
    (tabParam as 'posts' | 'articles' | 'reels') || 'posts'
  )

  useEffect(() => {
    if (tabParam && ['posts', 'articles', 'reels'].includes(tabParam)) {
      setActiveTab(tabParam as 'posts' | 'articles' | 'reels')
    }
  }, [tabParam])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Mobile Tab Navigation */}
          <div className="lg:hidden mb-6">
            <div className="flex gap-2 p-1 bg-white rounded-xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setActiveTab('posts')}
                className={cn(
                  'flex-1 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'posts'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('articles')}
                className={cn(
                  'flex-1 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
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
                  'flex-1 py-2.5 px-4 rounded-lg text-14 font-semibold transition-colors',
                  activeTab === 'reels'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                Reels
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
              {activeTab === 'articles' ? (
                <ArticlesFeed />
              ) : activeTab === 'reels' ? (
                <ReelsFeed />
              ) : (
                <CommunityFeed />
              )}
            </div>

            {/* Right Sidebar */}
            <div className="hidden xl:block">
              {activeTab === 'reels' ? (
                <ReelsSidebar />
              ) : (
                <CommunityRightSidebar activeTab={activeTab} />
              )}
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
