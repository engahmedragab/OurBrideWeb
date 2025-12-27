'use client'

import { useState } from 'react'
import NextImage from 'next/image'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Image, Video, List, ChevronDown, X } from 'lucide-react'

export interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser?: {
    name: string
    avatar: string
  }
}

export const CreatePostModal = ({
  isOpen,
  onClose,
  currentUser = {
    name: 'Aya Mohamed',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
}: CreatePostModalProps) => {
  const [postContent, setPostContent] = useState('')

  const handlePost = () => {
    // TODO: Handle post creation logic here
    setPostContent('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      containerClassName="!p-0"
      headerClassName="!p-0 !border-0"
      contentClassName="!p-0"
      showCloseButton={false}
    >
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <h2 className="text-20 font-normal text-gray-900">Create Post</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 pb-4">
        {/* User Info Section */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
            {currentUser.avatar && currentUser.avatar !== 'https://via.placeholder.com/100' ? (
              <NextImage
                src={currentUser.avatar}
                alt={currentUser.name}
                fill
                sizes="40px"
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : null}
            {(!currentUser.avatar || currentUser.avatar === 'https://via.placeholder.com/100') && (
              <div className="w-full h-full flex items-center justify-center bg-brand-100">
                <span className="text-14 font-semibold text-brand-600">
                  {currentUser.name.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-14 font-normal text-gray-900">
              {currentUser.name}
            </p>
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1 text-14 text-red-500 hover:text-red-600 transition-colors"
              >
                <span>Public</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-4"></div>

        {/* Post Content Input */}
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
          placeholder={`Share What's in your mind ,${currentUser.name} ....`}
          className="w-full min-h-[200px] px-0 py-2 border-0 bg-transparent focus:outline-none text-14 text-gray-900 placeholder:text-gray-400 resize-none"
        />

        {/* Divider */}
        <div className="border-t border-gray-200 mt-4 mb-4"></div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          {/* Left Side - Icons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors bg-white"
              aria-label="Upload image"
            >
              <Image className="h-5 w-5 text-gray-500" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors bg-white"
              aria-label="Add reels"
            >
              <Video className="h-5 w-5 text-gray-500" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors bg-white"
              aria-label="Text format"
            >
              <List className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Right Side - Post Button */}
          <Button
            onClick={handlePost}
            variant="brand"
            className="px-6 py-2 rounded-lg text-white font-normal"
            disabled={!postContent.trim()}
          >
            Post
          </Button>
        </div>
      </div>
    </Modal>
  )
}
