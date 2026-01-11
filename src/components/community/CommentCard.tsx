'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { User } from 'lucide-react'
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
  const [imageError, setImageError] = useState(false)
  return (
    <div className={cn('flex gap-3', className)}>
      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
        {author.avatar && !imageError ? (
          <Image
            src={author.avatar}
            alt={author.name || 'OurBride'}
            fill
            sizes="40px"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <User className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="text-14 font-normal text-gray-900 mb-1">
          {author.name || 'OurBride'}
        </h4>
        <p className="text-14 text-gray-700 mb-2 whitespace-pre-wrap">
          {content}
        </p>
        <p className="text-12 text-gray-500">{timestamp}</p>
      </div>
    </div>
  )
}
