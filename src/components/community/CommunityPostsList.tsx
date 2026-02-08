'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { usePosts } from '@/hooks/community/useCommunityContent'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { formatDateShort, getUserDisplayName, getUserAvatar } from './utils'
import { COMMUNITY_IMAGES } from '@/constants/community-images'
import { CommunityEmptyState } from './CommunityEmptyState'
import { useI18nTranslations } from '@/i18n/hooks'
import { LoadingSpinner } from '../ui'

export interface CommunityPostsListProps {
  className?: string
}

export const CommunityPostsList = ({ className }: CommunityPostsListProps) => {
  const t = useI18nTranslations("community")
  const router = useRouter()

  // Fetch posts for sidebar preview (limited to 3-4 posts)
  const { data: posts, isLoading } = usePosts({
    page: 1,
    pageSize: 4, // Show 4 posts in sidebar
    enabled: true,
  })

  const handleSeeAllPosts = () => {
    router.push('/community?tab=posts')
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-16 font-normal text-gray-900">{t("communityRightSidebar.communityPosts")}</h3>
        <button
          onClick={handleSeeAllPosts}
          className="text-14 font-normal text-brand-500 hover:text-brand-600 transition-colors"
        >
          {t("actions.seeAll")}
        </button>
      </div>

      {/* Posts Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex justify-center items-center py-8 min-h-[200px]">
            <LoadingSpinner open={true}  />
          </div>
        ) : posts && posts.length > 0 ? (
          <div 
            className="space-y-4 max-h-[600px] overflow-y-auto pr-2 -mr-2 scrollbar-custom"
          >
            {posts.map(post => (
              <div
                key={post.id}
                className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors -m-2"
                onClick={() => router.push(`/community/posts/${post.id}`)}
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                  {(() => {
                    const avatar = getUserAvatar(post.user)
                    const displayName = getUserDisplayName(post.user)
                    return avatar && avatar !== 'https://via.placeholder.com/100' ? (
                      <Image
                        src={avatar}
                        alt={displayName}
                        fill
                        sizes="40px"
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-100">
                        <span className="text-14 font-semibold text-brand-600">
                          {displayName.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-14 font-normal text-gray-900 mb-1">
                    {getUserDisplayName(post.user)}
                  </h4>
                  <p className="text-14 text-gray-700 mb-2 line-clamp-2">
                    {post.content || post.summary || post.title || ''}
                  </p>
                  <p className="text-12 text-gray-500">
                    {formatDateShort(post.publishedAt || post.creationDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4">
            <CommunityEmptyState
              title={t("states.noPostsTitle")}
              message={t("states.noPostsMessage")}
              compact
            />
          </div>
        )}
      </div>
    </div>
  )
}
