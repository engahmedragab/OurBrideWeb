'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export interface CommunityRightSidebarProps {
  className?: string
  currentUser?: {
    name: string
    email: string
    avatar: string
  }
  activeTab?: 'posts' | 'articles' | 'reels'
}

const mockSuggestions = [
  {
    id: '1',
    name: 'Aya Mohamed',
    email: 'example@example.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: '2',
    name: 'Aya Mohamed',
    email: 'example@example.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: '3',
    name: 'Aya Mohamed',
    email: 'example@example.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
]

const mockProviders = [
  {
    id: '1',
    name: 'Aya Mohamed',
    email: 'example@example.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: '2',
    name: 'Aya Mohamed',
    email: 'example@example.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: '3',
    name: 'Aya Mohamed',
    email: 'example@example.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
]

const mockSuggestedTopics = [
  'Makeup',
  'Fashion',
  'Fashion',
  'Fashion',
  'Fashion',
  'Makeup',
]

const mockTopArticles = [
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
  {
    id: '5',
    title: '5 Makeup Hacks Every Bride Needs Today',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    thumbnail:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200',
  },
]

export const CommunityRightSidebar = ({
  className,
  currentUser = {
    name: 'Aya Mohamed',
    email: 'example@example.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  activeTab = 'posts',
}: CommunityRightSidebarProps) => {
  const router = useRouter()

  return (
    <aside
      className={cn('w-80 flex-shrink-0 space-y-6 overflow-y-auto', className)}
    >
      {/* User Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={currentUser.avatar}
              alt={currentUser.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-16 font-normal text-gray-900 truncate">
              {currentUser.name}
            </h4>
            <p className="text-12 text-gray-500 truncate">
              {currentUser.email}
            </p>
          </div>
        </div>
      </div>

      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'articles' ? (
        <>
          {/* Suggested Topics Title */}
          <h3 className="text-16 font-normal text-gray-900">
            Suggested Topics
          </h3>

          {/* Suggested Topics Buttons */}
          <div className="flex flex-wrap gap-2">
            {mockSuggestedTopics.map((topic, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-gray-100 text-14 font-normal text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Top 5 Articles */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-16 font-normal text-gray-900 mb-4">
              Top 5 Articles
            </h3>
            <div className="space-y-4">
              {mockTopArticles.map(article => (
                <div
                  key={article.id}
                  className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors -m-2"
                  onClick={() =>
                    router.push(`/community/articles/${article.id}`)
                  }
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={article.thumbnail}
                      alt={article.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-14 font-normal text-gray-900 line-clamp-2 mb-1">
                      {article.title}
                    </h4>
                    <p className="text-12 text-gray-600 line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Suggests To Follow */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-16 font-normal text-gray-900 mb-4">
              Suggests To Follow
            </h3>
            <div className="space-y-4">
              {mockSuggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  className="flex items-center gap-3 justify-between"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={suggestion.avatar}
                        alt={suggestion.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-14 font-normal text-gray-900 truncate">
                        {suggestion.name}
                      </h4>
                      <p className="text-12 text-gray-500 truncate">
                        {suggestion.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="brand"
                    size="sm"
                    className="flex-shrink-0 text-10 text-white font-normal"
                  >
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Top Providers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-16 font-normal text-gray-900 mb-4">
              Top Providers
            </h3>
            <div className="space-y-4">
              {mockProviders.map(provider => (
                <div
                  key={provider.id}
                  className="flex items-center gap-3 justify-between"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={provider.avatar}
                        alt={provider.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-14 font-normal text-gray-900 truncate">
                        {provider.name}
                      </h4>
                      <p className="text-12 text-gray-500 truncate">
                        {provider.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="brand"
                    size="sm"
                    className="flex-shrink-0 text-10 text-white font-normal"
                  >
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </aside>
  )
}
