'use client'

import { cn } from '@/lib/utils'
import { ArticleCard } from './ArticleCard'
import type { ArticleResponse } from '@/types/responses/community'

export interface ArticlesFeedProps {
  className?: string
  articles?: ArticleResponse[]
}

export const ArticlesFeed = ({ className, articles = [] }: ArticlesFeedProps) => {
  return (
    <div className={cn('flex-1 space-y-6', className)}>
      {articles.length > 0 ? (
        articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No articles available yet</p>
        </div>
      )}
    </div>
  )
}
