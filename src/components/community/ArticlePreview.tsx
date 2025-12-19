'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface ArticlePreviewProps {
  id: string
  title: string
  description: string
  thumbnail: string
  className?: string
}

export const ArticlePreview = ({
  id,
  title,
  description,
  thumbnail,
  className,
}: ArticlePreviewProps) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/community/articles/${id}`)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer',
        className
      )}
    >
      <img
        src={thumbnail}
        alt={title}
        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-14 font-normal text-gray-900 line-clamp-2 mb-1">
          {title}
        </h4>
        <p className="text-12 text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  )
}
