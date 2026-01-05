'use client'

import { useState } from 'react'
import NextImage from 'next/image'
import { cn } from '@/lib/utils'
import { Image, Video, List } from 'lucide-react'
import { PostCard } from './PostCard'
import { CreatePostModal } from './CreatePostModal'
import { CommunityEmptyState } from './CommunityEmptyState'
import type { PostResponse } from '@/types/responses/community'

export interface CommunityFeedProps {
  className?: string
  posts?: PostResponse[]
  currentUser?: {
    name: string
    avatar: string
  }
}

export const CommunityFeed = ({
  className,
  posts = [],
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
      {currentUser && (
        <>
          <div
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm cursor-pointer hover:border-gray-300 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex items-start gap-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                {currentUser.avatar &&
                currentUser.avatar !== 'https://via.placeholder.com/100' ? (
                  <NextImage
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                    onError={e => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : null}
                {(!currentUser.avatar ||
                  currentUser.avatar === 'https://via.placeholder.com/100') && (
                  <div className="w-full h-full flex items-center justify-center bg-brand-100">
                    <span className="text-14 font-semibold text-brand-600">
                      {currentUser.name.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
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
        </>
      )}

      {/* Feed Posts */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <CommunityEmptyState
            title="No Posts Available"
            message="There are no posts to display at the moment. Be the first to share something!"
            compact
          />
        )}
      </div>
    </div>
  )
}
