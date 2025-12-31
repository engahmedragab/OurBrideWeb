'use client'

import { cn } from '@/lib/utils'
import { BlogCard } from './BlogCard'
import type { BlogResponse } from '@/types/responses/community'

export interface BlogsFeedProps {
  className?: string
  blogs?: BlogResponse[]
}

export const BlogsFeed = ({ className, blogs = [] }: BlogsFeedProps) => {
  return (
    <div className={cn('flex-1 space-y-6', className)}>
      {blogs.length > 0 ? (
        blogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No blogs available yet</p>
        </div>
      )}
    </div>
  )
}










