'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { PostCard } from './PostCard'
import { ArticleCard } from './ArticleCard'
import type { CommunityHomeResponse } from '@/types/responses/community/community-home-response'

export interface CommunityHomeFeedProps {
  className?: string
  data: CommunityHomeResponse
  currentUser?: {
    name: string
    avatar: string
  }
}

export const CommunityHomeFeed = ({ className, data, currentUser }: CommunityHomeFeedProps) => {
  const router = useRouter()

  return (
    <div className={cn('flex-1 space-y-8', className)}>
      {/* Recent Posts Section */}
      {data.recentPosts && data.recentPosts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-20 font-semibold text-gray-900">Recent Posts</h2>
            <button
              onClick={() => router.push('/community?tab=posts')}
              className="text-14 font-normal text-brand-500 hover:text-brand-600 transition-colors"
            >
              See All
            </button>
          </div>
          <div className="space-y-6">
            {data.recentPosts.slice(0, 5).map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Articles Section */}
      {data.recentArticles && data.recentArticles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-20 font-semibold text-gray-900">Recent Articles</h2>
            <button
              onClick={() => router.push('/community?tab=articles')}
              className="text-14 font-normal text-brand-500 hover:text-brand-600 transition-colors"
            >
              See All
            </button>
          </div>
          <div className="space-y-6">
            {data.recentArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!data.recentPosts || data.recentPosts.length === 0) &&
        (!data.recentArticles || data.recentArticles.length === 0) && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No content available yet</p>
          </div>
        )}
    </div>
  )
}




