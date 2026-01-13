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
        {author.avatar && author.avatar !== 'https://via.placeholder.com/100' && !imageError ? (
          <Image
            src={author.avatar}
            alt={author.name || 'OurBride'}
            fill
            sizes="40px"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-100">
            <span className="text-14 font-semibold text-brand-600">
              {(author.name || 'U').charAt(0).toUpperCase()}
            </span>
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
