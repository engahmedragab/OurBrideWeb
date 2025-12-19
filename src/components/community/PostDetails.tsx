'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import { CommentCard } from './CommentCard'
import { EngagementButton } from './EngagementButton'

export interface PostDetailsProps {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  images?: string[]
  timestamp: string
  likes: number
  comments: number
  shares: number
  className?: string
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
      'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
      'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    timestamp: '18 Aug 2025 12:45 PM',
  },
]

export const PostDetails = ({
  id: _id,
  author,
  content,
  images,
  timestamp,
  likes: initialLikes,
  comments: _comments,
  shares,
  className,
}: PostDetailsProps) => {
  const router = useRouter()
  const { addToast } = useToast()
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(mockComments)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(initialLikes)

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
    const url = `${window.location.origin}/community/posts/${_id}`
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
    <div className={cn('space-y-6', className)}>
      {/* Back Button and Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/community?tab=posts')}
          className="h-10 w-10"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <div className="flex items-center gap-2 text-14 text-gray-600">
          <button
            onClick={() => router.push('/community?tab=posts')}
            className="hover:text-brand-500 transition-colors"
          >
            Community
          </button>
          <span>/</span>
          <span>Posts</span>
          <span>/</span>
          <span className="text-gray-900">{author.name}&apos;s Post</span>
        </div>
      </div>

      {/* Post Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-16 font-normal text-gray-900">
                {author.name}
              </h4>
              <p className="text-12 text-gray-500">{timestamp}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        {/* Post Content */}
        <p className="text-14 text-gray-700 mb-4 whitespace-pre-wrap">
          {content}
        </p>

        {/* Post Images */}
        {images && images.length > 0 && (
          <div className="mb-4">
            {images.length === 1 ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={images[0]}
                  alt="Post image"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ) : images.length === 2 ? (
              <div className="grid grid-cols-2 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`Post image ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 row-span-2 relative w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src={images[0]}
                    alt="Post image 1"
                    fill
                    sizes="(max-width: 768px) 33vw, 16vw"
                    className="object-cover"
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-2">
                  {images.slice(1, 3).map((img, idx) => (
                    <div key={idx} className="relative w-full h-32 rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`Post image ${idx + 2}`}
                        fill
                        sizes="(max-width: 768px) 66vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Engagement Metrics */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
          <EngagementButton
            icon={<Heart className={cn('h-5 w-5', isLiked && 'fill-brand-500')} />}
            count={likes}
            label="Likes"
              onClick={handleLikeClick}
            isActive={isLiked}
          />
          <EngagementButton
            icon={<MessageCircle className="h-5 w-5" />}
            count={comments.length}
            label="Comments"
          />
          <EngagementButton
            icon={<Share2 className="h-5 w-5" />}
            count={shares}
            label="Shares"
            onClick={handleShareClick}
          />
        </div>
      </div>

      {/* Comments Title */}
      <h3 className="text-16 font-normal text-gray-900">Comments</h3>

      {/* Comments Section */}
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
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                alt="Your avatar"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-14 resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <Button
                  variant="brand"
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="text-10 text-white font-normal "
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
