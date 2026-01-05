'use client'

import { cn } from '@/lib/utils'
import { BlogCard } from './BlogCard'
import { CommunityEmptyState } from './CommunityEmptyState'
import type { BlogResponse } from '@/types/responses/community'

export interface BlogsFeedProps {
  className?: string
  blogs?: BlogResponse[]
}

export const BlogsFeed = ({ className, blogs = [] }: BlogsFeedProps) => {
  return (
    <div className={cn('flex-1 space-y-6', className)}>
      {blogs.length > 0 ? (
        blogs.map(blog => <BlogCard key={blog.id} blog={blog} />)
      ) : (
        <CommunityEmptyState
          title="No Blogs Available"
          message="There are no blogs to display at the moment."
          compact
        />
      )}
    </div>
  )
}
