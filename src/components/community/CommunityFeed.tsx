'use client'

import { useState } from 'react'
import NextImage from 'next/image'
import { cn } from '@/lib/utils'
import { Image, Video, List } from 'lucide-react'
import { PostCard } from './PostCard'
import { CreatePostModal } from './CreatePostModal'

export interface CommunityFeedProps {
  className?: string
  currentUser?: {
    name: string
    avatar: string
  }
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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    timestamp: '18 Aug 2025 12:45 PM',
    likes: 20,
    comments: 20,
    shares: 215,
  },
  {
    id: '2',
    author: {
      name: 'Aya Mohamed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
    ],
    timestamp: '18 Aug 2025 12:45 PM',
    likes: 26,
    comments: 26,
    shares: 215,
  },
]

export const CommunityFeed = ({
  className,
  currentUser = {
    name: 'Aya',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
}: CommunityFeedProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className={cn('flex-1 space-y-6', className)}>
      {/* Post Creation */}
      <div
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm cursor-pointer hover:border-gray-300 transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-start gap-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <NextImage
              src={currentUser.avatar}
              alt={currentUser.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder={`Share What's in your mind ,${currentUser.name} ....`}
              readOnly
              className="w-full px-4 py-3 border-0 bg-transparent focus:outline-none text-14 text-gray-900 placeholder:text-gray-400 cursor-pointer"
            />
            <div className="border-t border-gray-200 my-3"></div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                aria-label="Upload image"
                onClick={e => e.stopPropagation()}
              >
                <Image className="h-5 w-5 text-gray-500" />
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                aria-label="Add reels"
                onClick={e => e.stopPropagation()}
              >
                <Video className="h-5 w-5 text-gray-500" />
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                aria-label="Text format"
                onClick={e => e.stopPropagation()}
              >
                <List className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Feed Posts */}
      <div className="space-y-6">
        {mockPosts.map(post => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  )
}
