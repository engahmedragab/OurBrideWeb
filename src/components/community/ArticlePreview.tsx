'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { COMMUNITY_IMAGES } from '@/constants/community-images'

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
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={thumbnail || COMMUNITY_IMAGES.DEFAULT_ARTICLE_IMAGE}
          alt={title}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-14 font-normal text-gray-900 line-clamp-2 mb-1">
          {title}
        </h4>
        <p className="text-12 text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  )
}
