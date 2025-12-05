'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface CommunityPostsListProps {
  className?: string
}

const mockPosts = [
  {
    id: '1',
    author: {
      name: 'Aya Mohamed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    content:
      "Hello World, I'm using Ourbride !! It's AwsomeHello World, I'm Using Ourbride !! It's..",
    date: '12 Sep, 2025',
  },
  {
    id: '2',
    author: {
      name: 'Aya Mohamed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    content:
      "Hello World, I'm using Ourbride !! It's AwsomeHello World, I'm Using Ourbride !! It's..",
    date: '12 Sep, 2025',
  },
  {
    id: '3',
    author: {
      name: 'Aya Mohamed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    content:
      "Hello World, I'm using Ourbride !! It's AwsomeHello World, I'm Using Ourbride !! It's..",
    date: '12 Sep, 2025',
  },
]

export const CommunityPostsList = ({ className }: CommunityPostsListProps) => {
  const router = useRouter()

  const handleSeeAllPosts = () => {
    router.push('/community?tab=posts')
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-16 font-normal text-gray-900">Community Posts</h3>
        <button
          onClick={handleSeeAllPosts}
          className="text-14 font-normal text-brand-500 hover:text-brand-600 transition-colors"
        >
          See All
        </button>
      </div>

      {/* Posts Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="space-y-4">
          {mockPosts.map(post => (
            <div
              key={post.id}
              className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors -m-2"
              onClick={() => router.push(`/community/posts/${post.id}`)}
            >
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-14 font-normal text-gray-900 mb-1">
                  {post.author.name}
                </h4>
                <p className="text-14 text-gray-700 mb-2 line-clamp-2">
                  {post.content}
                </p>
                <p className="text-12 text-gray-500">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
