'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import {
  CommunitySidebar,
  CommunityFeed,
  CommunityRightSidebar,
  ArticlesFeed,
  ReelsFeed,
  ReelsSidebar,
} from '@/components/community'

export default function CommunityPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
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
        <div className="container-custom py-6 md:py-8">
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

