'use client'

import { cn } from '@/lib/utils'
import { ArticleCard } from './ArticleCard'
import { CommunityEmptyState } from './CommunityEmptyState'
import type { ArticleResponse } from '@/types/responses/community'

export interface ArticlesFeedProps {
  className?: string
  articles?: ArticleResponse[]
}

export const ArticlesFeed = ({
  className,
  articles = [],
}: ArticlesFeedProps) => {
  return (
    <div className={cn('flex-1 space-y-6', className)}>
      {articles.length > 0 ? (
        articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))
      ) : (
        <CommunityEmptyState
          title="No Articles Available"
          message="There are no articles to display at the moment."
          compact
        />
      )}
    </div>
  )
}
