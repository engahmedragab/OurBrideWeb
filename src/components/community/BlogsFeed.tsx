'use client'

import { cn } from '@/lib/utils'
import { BlogCard } from './BlogCard'
import { CommunityEmptyState } from './CommunityEmptyState'
import type { BlogResponse } from '@/types/responses/community'
import { useI18nTranslations } from '@/i18n'

export interface BlogsFeedProps {
  className?: string
  blogs?: BlogResponse[]
}

export const BlogsFeed = ({ className, blogs = [] }: BlogsFeedProps) => {
  const t = useI18nTranslations("community")
  return (
    <div className={cn('flex-1 space-y-6', className)}>
      {blogs.length > 0 ? (
        blogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))
      ) : (
        <CommunityEmptyState
          title={t("states.noBlogsTitle")}
          message={t("states.noBlogsMessage")}
          compact
        />
      )}
    </div>
  )
}













