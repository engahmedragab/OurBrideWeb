'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, Share2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toaster'
import { EngagementButton } from './EngagementButton'
import { CommentCard } from './CommentCard'
import type { CommunityTab } from './CommunitySidebar'
import type { SuggestedUserResponse } from '@/types/responses/community/suggested-user-response'
import type { SuggestedProviderResponse } from '@/types/responses/community/suggested-provider-response'
import type { ArticleResponse } from '@/types/responses/community'
import { COMMUNITY_IMAGES } from '@/constants/community-images'
import type { TagResponse } from '@/types/responses/community'
import type { ReelResponse } from '@/types/responses/community'
import { formatDate, getUserDisplayName, getUserAvatar } from './utils'

export interface CommunityRightSidebarProps {
  className?: string
  currentUser?: {
    name: string
    email: string
    avatar: string
  }
  activeTab?: CommunityTab
  suggestedUsers?: SuggestedUserResponse[]
  topProviders?: SuggestedProviderResponse[]
  recentArticles?: ArticleResponse[]
  tags?: TagResponse[]
  selectedReel?: ReelResponse | null
}

export const CommunityRightSidebar = ({
  className,
  currentUser = {
    name: 'Aya Mohamed',
    email: 'example@example.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  activeTab = 'posts',
  suggestedUsers = [],
  topProviders = [],
  recentArticles = [],
  tags = [],
  selectedReel = null,
}: CommunityRightSidebarProps) => {
  const router = useRouter()
  const { addToast } = useToast()
  const [commentText, setCommentText] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(selectedReel?.likeCount || 0)

  // Update likes when selectedReel changes
  useEffect(() => {
    if (selectedReel) {
      setLikes(selectedReel.likeCount || 0)
      setIsLiked(false) // Reset like state when reel changes
      setCommentText('') // Reset comment text when reel changes
    }
  }, [selectedReel])

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedReel) return
    // TODO: Call API to add comment/review
    // For now, just clear the input
    setCommentText('')
    addToast('Comment added!', 'success')
  }

  const handleLikeClick = async () => {
    if (!selectedReel) return
    // TODO: Call API to toggle like
    setIsLiked(!isLiked)
    setLikes(prev => (isLiked ? prev - 1 : prev + 1))
  }

  const handleShareClick = async () => {
    const url = `${window.location.origin}/community/reels/${selectedReel?.id}`
    try {
      await navigator.clipboard.writeText(url)
      addToast('Link copied to clipboard!', 'success')
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      addToast('Link copied to clipboard!', 'success')
    }
  }

  return (
    <aside className={cn('w-full space-y-6', className)}>
      {/* User Profile Card - Always visible in all tabs */}
      {currentUser && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
              {currentUser.avatar &&
              currentUser.avatar !== 'https://via.placeholder.com/100' ? (
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                  onError={e => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : null}
              {(!currentUser.avatar ||
                currentUser.avatar === 'https://via.placeholder.com/100') && (
                <div className="w-full h-full flex items-center justify-center bg-brand-100">
                  <span className="text-16 font-semibold text-brand-600">
                    {currentUser.name.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-16 font-normal text-gray-900 truncate">
                {currentUser.name}
              </h4>
              <p className="text-12 text-gray-500 truncate">OurBride</p>
            </div>
          </div>
        </div>
      )}

      {/* Conditional: Show Reel Details when reels tab is active and reel is selected */}
      {activeTab === 'reels' && selectedReel ? (
        <>
          {/* Reel Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                {getUserAvatar(selectedReel.user) ? (
                  <Image
                    src={getUserAvatar(selectedReel.user)!}
                    alt={getUserDisplayName(selectedReel.user)}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white">
                    <Image
                      src={COMMUNITY_IMAGES.DEFAULT_AVATAR_IMAGE}
                      alt="OurBride"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-16 font-normal text-gray-900">
                  {getUserDisplayName(selectedReel.user)}
                </h4>
                <p className="text-12 text-gray-500">
                  {formatDate(
                    selectedReel.publishedAt || selectedReel.creationDate
                  )}
                </p>
              </div>
            </div>

            <p className="text-14 text-gray-700 mb-4 whitespace-pre-wrap">
              {selectedReel.description ||
                selectedReel.caption ||
                selectedReel.title ||
                ''}
            </p>

            <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
              <EngagementButton
                icon={
                  <Heart
                    className={cn('h-4 w-4', isLiked && 'fill-brand-500')}
                  />
                }
                count={likes}
                label="Likes"
                onClick={handleLikeClick}
                isActive={isLiked}
                size="sm"
              />
              <EngagementButton
                icon={<MessageCircle className="h-4 w-4" />}
                count={selectedReel.commentCount || 0}
                label="Comments"
                size="sm"
              />
              <EngagementButton
                icon={<Share2 className="h-4 w-4" />}
                count={selectedReel.shareCount || 0}
                label="Shares"
                onClick={handleShareClick}
                size="sm"
              />
            </div>
          </div>

          {/* Comments Section */}
          <h3 className="text-16 font-normal text-gray-900">Comments</h3>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            {/* Comments List - TODO: Fetch from API */}
            <div className="space-y-6 mb-6">
              {/* Placeholder for comments - will be replaced with API data */}
              <p className="text-14 text-gray-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            </div>

            {/* Add Comment Form */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                  {currentUser.avatar &&
                  currentUser.avatar !== 'https://via.placeholder.com/100' ? (
                    <Image
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                      onError={e => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : null}
                  {(!currentUser.avatar ||
                    currentUser.avatar ===
                      'https://via.placeholder.com/100') && (
                    <div className="w-full h-full flex items-center justify-center bg-brand-100">
                      <span className="text-14 font-semibold text-brand-600">
                        {currentUser.name.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Share your Comments"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-14"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleAddComment()
                      }
                    }}
                  />
                </div>
                <Button
                  variant="brand"
                  size="icon"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="h-10 w-10 flex-shrink-0"
                  aria-label="Send comment"
                >
                  <Send className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Suggested Users */}
          {suggestedUsers.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-16 font-normal text-gray-900 mb-4">
                Suggests To Follow
              </h3>
              <div className="space-y-4">
                {suggestedUsers.map(suggestion => (
                  <div
                    key={suggestion.userId}
                    className="flex items-center gap-3 justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                        {(() => {
                          const avatar =
                            suggestion.profileImageUrl ||
                            'https://via.placeholder.com/100'
                          const displayName =
                            suggestion.displayName ||
                            suggestion.userName ||
                            'User'
                          return avatar &&
                            avatar !== 'https://via.placeholder.com/100' ? (
                            <Image
                              src={avatar}
                              alt={displayName}
                              fill
                              sizes="40px"
                              className="object-cover"
                              onError={e => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : null
                        })()}
                        {(() => {
                          const avatar =
                            suggestion.profileImageUrl ||
                            'https://via.placeholder.com/100'
                          const displayName =
                            suggestion.displayName ||
                            suggestion.userName ||
                            'User'
                          return (
                            (!avatar ||
                              avatar === 'https://via.placeholder.com/100') && (
                              <div className="w-full h-full flex items-center justify-center bg-brand-100">
                                <span className="text-14 font-semibold text-brand-600">
                                  {displayName.charAt(0).toUpperCase() || 'U'}
                                </span>
                              </div>
                            )
                          )
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-14 font-normal text-gray-900 truncate">
                          {suggestion.displayName ||
                            suggestion.userName ||
                            'User'}
                        </h4>
                        <p className="text-12 text-gray-500 truncate">
                          OurBride
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="brand"
                      size="sm"
                      className="flex-shrink-0 text-10 text-white font-normal"
                      disabled={suggestion.isFollowing}
                    >
                      {suggestion.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Providers */}
          {topProviders.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-16 font-normal text-gray-900 mb-4">
                Top Providers
              </h3>
              <div className="space-y-4">
                {topProviders.map(provider => (
                  <div
                    key={provider.providerId}
                    className="flex items-center gap-3 justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            provider.profileImageUrl ||
                            'https://via.placeholder.com/100'
                          }
                          alt={provider.providerName || 'Provider'}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-14 font-normal text-gray-900 truncate">
                          {provider.providerName || 'Provider'}
                        </h4>
                        <p className="text-12 text-gray-500 truncate">
                          {provider.category || provider.email || ''}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="brand"
                      size="sm"
                      className="flex-shrink-0 text-10 text-white font-normal"
                      disabled={provider.isFollowing}
                    >
                      {provider.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Tags */}
          {tags.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-16 font-normal text-gray-900 mb-4">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    className="px-4 py-2 bg-gray-100 text-14 font-normal text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {tag.name || tag.slug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conditional Content Based on Active Tab */}
          {activeTab === 'articles' && recentArticles.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-16 font-normal text-gray-900 mb-4">
                Top Articles
              </h3>
              <div className="space-y-4">
                {recentArticles.slice(0, 5).map(article => (
                  <div
                    key={article.id}
                    className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors -m-2"
                    onClick={() =>
                      router.push(`/community/articles/${article.id}`)
                    }
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-12 font-semibold">
                        {article.title?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-14 font-normal text-gray-900 line-clamp-2 mb-1">
                        {article.title}
                      </h4>
                      <p className="text-12 text-gray-600 line-clamp-2">
                        {article.summary || article.excerpt || ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  )
}
