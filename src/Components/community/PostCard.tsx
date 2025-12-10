'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, Share2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import { EngagementButton } from './EngagementButton'

export interface PostCardProps {
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

export const PostCard = ({
  id,
  author,
  content,
  images,
  timestamp,
  likes: initialLikes,
  comments,
  shares,
  className,
}: PostCardProps) => {
  const router = useRouter()
  const { addToast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(initialLikes)

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/community/posts/${id}`)
  }

  const handleCardClick = () => {
    router.push(`/community/posts/${id}`)
  }

  const handleLikeClick = () => {
    setIsLiked(!isLiked)
    setLikes(prev => (isLiked ? prev - 1 : prev + 1))
  }

  const handleCommentClick = () => {
    router.push(`/community/posts/${id}`)
  }

  const handleShareClick = async () => {
    const url = `${window.location.origin}/community/posts/${id}`
    try {
      await navigator.clipboard.writeText(url)
      addToast('Link copied to clipboard!', 'success')
    } catch {
      // Fallback for browsers that don't support clipboard API
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
    <div
      onClick={handleCardClick}
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="text-16 font-normal text-gray-900">{author.name}</h4>
            <p className="text-12 text-gray-500">{timestamp}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="More options"
          onClick={handleMoreClick}
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
            <img
              src={images[0]}
              alt="Post image"
              className="w-full rounded-lg object-cover"
            />
          ) : images.length === 2 ? (
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Post image ${idx + 1}`}
                  className="w-full h-48 rounded-lg object-cover"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <img
                src={images[0]}
                alt="Post image 1"
                className="col-span-1 row-span-2 w-full h-full rounded-lg object-cover"
              />
              <div className="col-span-2 flex flex-col gap-2">
                {images.slice(1, 3).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Post image ${idx + 2}`}
                    className="w-full h-32 rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Engagement Metrics */}
      <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<Heart className={cn('h-5 w-5', isLiked && 'fill-brand-500')} />}
            count={likes}
            label="Likes"
            onClick={handleLikeClick}
            isActive={isLiked}
          />
        </div>
        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<MessageCircle className="h-5 w-5" />}
            count={comments}
            label="Comments"
            onClick={handleCommentClick}
          />
        </div>
        <div onClick={e => e.stopPropagation()}>
          <EngagementButton
            icon={<Share2 className="h-5 w-5" />}
            count={shares}
            label="Shares"
            onClick={handleShareClick}
          />
        </div>
      </div>
    </div>
  )
}
