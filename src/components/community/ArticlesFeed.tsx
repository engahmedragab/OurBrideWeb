'use client'

import { cn } from '@/lib/utils'
import { ArticleCard } from './ArticleCard'
import { CommunityEmptyState } from './CommunityEmptyState'
import type { ArticleResponse } from '@/types/responses/community'
import { useI18nTranslations } from '@/i18n'

export interface ArticlesFeedProps {
  className?: string
  articles?: ArticleResponse[]
}

export const ArticlesFeed = ({ className, articles = [] }: ArticlesFeedProps) => {
  const t = useI18nTranslations("community")
  return (
    <div className={cn('flex-1 space-y-6', className)}>
      {articles.length > 0 ? (
        articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))
      ) : (
        <CommunityEmptyState
          title={t("states.noArticlesTitle")}
          message={t("states.noArticlesMessage")}
          compact
        />
      )}
    </div>
  )
}
