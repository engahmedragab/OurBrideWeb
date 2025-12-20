'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface ArticleCardProps {
  id: string
  title: string
  description: string
  image: string
  author: {
    name: string
    avatar: string
  }
  date: string
  className?: string
}

export const ArticleCard = ({
  id,
  title,
  description,
  image,
  author,
  date,
  className,
}: ArticleCardProps) => {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/community/articles/${id}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <h3 className="text-20 font-normal text-gray-900 mb-3">{title}</h3>
      <p className="text-14 text-gray-700 mb-4 line-clamp-3">{description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-14 font-normal text-gray-900">{author.name}</p>
            <p className="text-12 text-gray-500">{date}</p>
          </div>
        </div>
        <span
          onClick={e => {
            e.stopPropagation()
            router.push(`/community/articles/${id}`)
          }}
          className="text-14 font-normal text-brand-500 hover:text-brand-600 transition-colors"
        >
          Read More
        </span>
      </div>
    </div>
  )
}
