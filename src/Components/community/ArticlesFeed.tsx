'use client'

import { cn } from '@/lib/utils'
import { ArticleCard } from './ArticleCard'

export interface ArticlesFeedProps {
  className?: string
}

const mockArticles = [
  {
    id: '1',
    title: '5 Makeup Hacks Every Bride Needs Today',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    author: {
      name: 'Aya Mohamed',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    date: '12 Sep, 2025',
  },
  {
    id: '2',
    title: '5 Makeup Hacks Every Bride Needs Today',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
    author: {
      name: 'Aya Mohamed',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    date: '12 Sep, 2025',
  },
]

export const ArticlesFeed = ({ className }: ArticlesFeedProps) => {
  return (
    <div className={cn('flex-1 space-y-6', className)}>
      {mockArticles.map(article => (
        <ArticleCard key={article.id} {...article} />
      ))}
    </div>
  )
}

