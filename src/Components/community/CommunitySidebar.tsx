'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SearchInput } from '@/components/ui/SearchInput'
import { Button } from '@/components/ui/Button'
import { Globe, FileText, Monitor } from 'lucide-react'
import { ArticlePreview } from './ArticlePreview'
import { CommunityPostsList } from './CommunityPostsList'

export interface CommunitySidebarProps {
  className?: string
  activeTab?: 'posts' | 'articles' | 'reels'
  onTabChange?: (tab: 'posts' | 'articles' | 'reels') => void
}

const mockArticles = [
  {
    id: '1',
    title: '5 Makeup Hacks Every Bride Needs Today',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    thumbnail:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200',
  },
  {
    id: '2',
    title: '5 Makeup Hacks Every Bride Needs Today',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    thumbnail:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200',
  },
  {
    id: '3',
    title: '5 Makeup Hacks Every Bride Needs Today',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    thumbnail:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200',
  },
  {
    id: '4',
    title: '5 Makeup Hacks Every Bride Needs Today',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    thumbnail:
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200',
  },
]

export const CommunitySidebar = ({
  className,
  activeTab: externalActiveTab,
  onTabChange,
}: CommunitySidebarProps) => {
  const router = useRouter()
  const [internalActiveTab, setInternalActiveTab] = useState<
    'posts' | 'articles' | 'reels'
  >('posts')
  const activeTab = externalActiveTab ?? internalActiveTab

  const handleTabChange = (tab: 'posts' | 'articles' | 'reels') => {
    if (onTabChange) {
      onTabChange(tab)
      router.push(`/community?tab=${tab}`)
    } else {
      setInternalActiveTab(tab)
      router.push(`/community?tab=${tab}`)
    }
  }

  const handleSeeAllArticles = () => {
    if (onTabChange) {
      onTabChange('articles')
    } else {
      setInternalActiveTab('articles')
    }
    router.push('/community?tab=articles')
  }

  return (
    <aside
      className={cn('w-80 flex-shrink-0 space-y-4 overflow-y-auto', className)}
    >
      {/* Community Title */}
      <h2 className="text-20 font-semibold text-gray-900">Community</h2>

      {/* Search Bar */}
      <div>
        <SearchInput
          placeholder="Search Community"
          variant="default"
          size="md"
          className="w-full rounded-lg"
        />
      </div>

      {/* Navigation Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="space-y-2">
          <Button
            variant={activeTab === 'posts' ? 'brand' : 'ghost'}
            size="default"
            className={cn(
              'w-full justify-start gap-2 font-normal rounded-lg',
              activeTab === 'posts'
                ? 'bg-brand-500 text-white hover:bg-brand-600'
                : 'text-gray-700 hover:bg-gray-50'
            )}
            onClick={() => handleTabChange('posts')}
          >
            <Globe className="h-5 w-5" />
            Community Posts
          </Button>

          <Button
            variant={activeTab === 'articles' ? 'brand' : 'ghost'}
            size="default"
            className={cn(
              'w-full justify-start gap-2 font-normal rounded-lg',
              activeTab === 'articles'
                ? 'bg-brand-500 text-white hover:bg-brand-600'
                : 'text-gray-700 hover:bg-gray-50'
            )}
            onClick={() => handleTabChange('articles')}
          >
            <FileText className="h-5 w-5" />
            Articles
          </Button>

          <Button
            variant={activeTab === 'reels' ? 'brand' : 'ghost'}
            size="default"
            className={cn(
              'w-full justify-start gap-2 font-normal rounded-lg',
              activeTab === 'reels'
                ? 'bg-brand-500 text-white hover:bg-brand-600'
                : 'text-gray-700 hover:bg-gray-50'
            )}
            onClick={() => handleTabChange('reels')}
          >
            <Monitor className="h-5 w-5" />
            Reels
          </Button>
        </div>
      </div>

      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'articles' ? (
        <CommunityPostsList />
      ) : (
        <>
          {/* Articles Title */}
          <div className="flex items-center justify-between">
            <h3 className="text-16 font-normal text-gray-900">Articles</h3>
            <button
              onClick={handleSeeAllArticles}
              className="text-14 font-normal text-brand-500 hover:text-brand-600 transition-colors"
            >
              See All
            </button>
          </div>

          {/* Articles Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="space-y-2">
              {mockArticles.map(article => (
                <ArticlePreview key={article.id} {...article} />
              ))}
            </div>
          </div>
        </>
      )}
    </aside>
  )
}
