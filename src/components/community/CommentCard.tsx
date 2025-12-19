'use client'

import { cn } from '@/lib/utils'

export interface CommentCardProps {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
  className?: string
}

export const CommentCard = ({
  id: _id,
  author,
  content,
  timestamp,
  className,
}: CommentCardProps) => {
  return (
    <div className={cn('flex gap-3', className)}>
      <img
        src={author.avatar}
        alt={author.name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1">
        <h4 className="text-14 font-normal text-gray-900 mb-1">
          {author.name}
        </h4>
        <p className="text-14 text-gray-700 mb-2 whitespace-pre-wrap">
          {content}
        </p>
        <p className="text-12 text-gray-500">{timestamp}</p>
      </div>
    </div>
  )
}
