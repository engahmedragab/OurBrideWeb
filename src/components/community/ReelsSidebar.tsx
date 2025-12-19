'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share2, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import { CommentCard } from './CommentCard'
import { EngagementButton } from './EngagementButton'

export interface ReelsSidebarProps {
  className?: string
}

const mockPost = {
  id: '1',
  author: {
    name: 'Aya Mohamed',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  content:
    'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque.',
  timestamp: '18 Aug 2025 12:45 PM',
  likes: 20,
  comments: 20,
  shares: 215,
}

const mockComments = [
  {
    id: '1',
    author: {
      name: 'Aya Mohamed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    content:
      'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque.',
    timestamp: '18 Aug 2025 12:45 PM',
  },
  {
    id: '2',
    author: {
      name: 'Aya Mohamed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    content:
      'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque.',
    timestamp: '18 Aug 2025 12:45 PM',
  },
  {
    id: '3',
    author: {
      name: 'Aya Mohamed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    content:
      'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque.',
    timestamp: '18 Aug 2025 12:45 PM',
  },
]

export const ReelsSidebar = ({ className }: ReelsSidebarProps) => {
  const { addToast } = useToast()
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(mockComments)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(mockPost.likes)

  const handleAddComment = () => {
    if (!commentText.trim()) return

    const newComment = {
      id: Date.now().toString(),
      author: {
        name: 'Aya Mohamed',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      content: commentText,
      timestamp: new Date().toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setComments([...comments, newComment])
    setCommentText('')
  }

  const handleLikeClick = () => {
    setIsLiked(!isLiked)
    setLikes(prev => (isLiked ? prev - 1 : prev + 1))
  }

  const handleShareClick = async () => {
    const url = `${window.location.origin}/community?tab=reels`
    try {
      await navigator.clipboard.writeText(url)
      addToast('Link copied to clipboard!', 'success')
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      addToast('Link copied to clipboard!', 'success')
    }
  }

  return (
    <aside
      className={cn(
        'w-[450px] flex-shrink-0 space-y-6 overflow-y-auto',
        className
      )}
    >
      {/* Post Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={mockPost.author.avatar}
            alt={mockPost.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="text-16 font-normal text-gray-900">
              {mockPost.author.name}
            </h4>
            <p className="text-12 text-gray-500">{mockPost.timestamp}</p>
          </div>
        </div>

        <p className="text-14 text-gray-700 mb-4 whitespace-pre-wrap">
          {mockPost.content}
        </p>

        <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
          <EngagementButton
            icon={<Heart className={cn('h-4 w-4', isLiked && 'fill-brand-500')} />}
            count={likes}
            label="Likes"
              onClick={handleLikeClick}
            isActive={isLiked}
            size="sm"
          />
          <EngagementButton
            icon={<MessageCircle className="h-4 w-4" />}
            count={mockPost.comments}
            label="Comments"
            size="sm"
          />
          <EngagementButton
            icon={<Share2 className="h-4 w-4" />}
            count={mockPost.shares}
            label="Shares"
            onClick={handleShareClick}
            size="sm"
          />
        </div>
      </div>

      {/* Comments Section */}
      <h3 className="text-16 font-normal text-gray-900">Comments</h3>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {/* Comments List */}
        <div className="space-y-6 mb-6">
          {comments.map(comment => (
            <CommentCard key={comment.id} {...comment} />
          ))}
        </div>

        {/* Add Comment Form */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
              alt="Your avatar"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Share your Comments"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-14"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleAddComment()
                  }
                }}
              />
            </div>
            <Button
              variant="brand"
              size="icon"
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="h-10 w-10 flex-shrink-0"
              aria-label="Send comment"
            >
              <Send className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
