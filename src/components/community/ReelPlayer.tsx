'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Share2,
  Send,
  X,
  Star,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CommentCard } from './CommentCard'
import { useToast } from '@/components/ui/Toaster'
import {
  getReelById,
  addReview as addReelReview,
  toggleLike as toggleReelLike,
  toggleFavorite as toggleReelFavorite,
  shareReel,
} from '@/services/api/reelsApi'
import { toggleFollow } from '@/services/api/communityProfilesApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { formatDate, getUserDisplayName, getUserAvatar, getProfileUrl } from './utils'
import Link from 'next/link'
import type { ReviewResponse } from '@/types/responses/review-response'
import { COMMUNITY_IMAGES } from '@/constants/community-images'

export interface ReelPlayerProps {
  id: string
  videoUrl?: string
  className?: string
}

export const ReelPlayer = ({
  id,
  videoUrl: _videoUrl,
  className,
}: ReelPlayerProps) => {
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [shares, setShares] = useState(0)
  const [favorites, setFavorites] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Fetch reel data
  const reelId = parseInt(id, 10)
  const { data: reel, isLoading, error } = useQuery({
    queryKey: ['reel', id],
    queryFn: async () => {
      if (isNaN(reelId)) throw new Error('Invalid reel ID')
      return await getReelById(reelId)
    },
    enabled: !!id && !isNaN(reelId),
  })

  const likes = reel?.likeCount || 0

  // Map reviews to comments format
  const comments = (reel?.reviews || []).map((review: ReviewResponse) => ({
    id: String(review.id),
    author: {
      name: review.isAnonymous ? 'Anonymous' : 'User', // TODO: Get actual user name from review.userId
      avatar: 'https://via.placeholder.com/100',
    },
    content: review.comment || review.summary || '',
    timestamp: formatDate(review.creationDate),
  }))

  // Update state when reel data changes
  useEffect(() => {
    if (reel) {
      setIsLiked(false) // Reset like state when reel changes
      setIsFavorited(false) // Reset favorite state when reel changes
      setIsFollowing(false) // Reset follow state when reel changes
      setCommentText('') // Reset comment text when reel changes
      setShares(reel.shareCount || 0)
      setFavorites(reel.favoriteCount || 0)
    }
  }, [reel])

  useEffect(() => {
    const video = videoRef.current
    if (video && reel) {
      if (isPlaying) {
        video.play().catch(() => {
          setIsPlaying(false)
        })
      } else {
        video.pause()
      }
    }
  }, [isPlaying, reel])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = isMuted
    }
  }, [isMuted, reel])

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev)
  }

  const handleMuteToggle = () => {
    setIsMuted(prev => !prev)
  }

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      if (!reel) throw new Error('Reel not loaded')
      return await toggleReelLike(reel.id)
    },
    onSuccess: () => {
      setIsLiked(!isLiked)
      queryClient.invalidateQueries({ queryKey: ['reel', id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to toggle like', 'error')
    },
  })

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!reel) throw new Error('Reel not loaded')
      await addReelReview(reel.id, { comment: content } as any)
    },
    onSuccess: () => {
      setCommentText('')
      addToast('Comment added successfully!', 'success')
      // Invalidate queries to refresh comments/reviews
      queryClient.invalidateQueries({ queryKey: ['reel', id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to add comment', 'error')
    },
  })

  const handleLikeClick = () => {
    if (!reel) return
    toggleLikeMutation.mutate()
  }

  const handleCommentClick = () => {
    setIsCommentsOpen(true)
  }

  const shareMutation = useMutation({
    mutationFn: async (shareSource?: string) => {
      if (!reel) throw new Error('Reel not loaded')
      return await shareReel(reel.id, shareSource)
    },
    onSuccess: (data) => {
      if (data) {
        setShares(data.shareCount)
        // Copy share URL to clipboard
        const urlToShare = data.shortUrl || data.fullUrl || `${window.location.origin}/community/reels/${reel?.id}`
        navigator.clipboard.writeText(urlToShare).catch(() => { })
        addToast('Shared successfully! Link copied to clipboard.', 'success')
      }
      queryClient.invalidateQueries({ queryKey: ['reel', id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to share reel', 'error')
    },
  })

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!reel) throw new Error('Reel not loaded')
      return await toggleReelFavorite(reel.id)
    },
    onSuccess: () => {
      setIsFavorited(!isFavorited)
      setFavorites(prev => (isFavorited ? prev - 1 : prev + 1))
      queryClient.invalidateQueries({ queryKey: ['reel', id] })
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to toggle favorite', 'error')
    },
  })

  const toggleFollowMutation = useMutation({
    mutationFn: async () => {
      if (!reel || !reel.userId) throw new Error('User ID not available')
      await toggleFollow({
        profileType: 'User',
        profileUserId: reel.userId,
      })
    },
    onSuccess: () => {
      setIsFollowing(!isFollowing)
      addToast(isFollowing ? 'Unfollowed successfully' : 'Followed successfully', 'success')
    },
    onError: (error) => {
      addToast(error instanceof Error ? error.message : 'Failed to toggle follow', 'error')
    },
  })

  const handleShareClick = () => {
    if (!reel) return
    shareMutation.mutate('ShareButtonClick')
  }

  const handleFavoriteClick = () => {
    if (!reel) return
    toggleFavoriteMutation.mutate()
  }

  const handleFollowClick = () => {
    if (!reel) return
    toggleFollowMutation.mutate()
  }

  const handleAddComment = () => {
    if (!commentText.trim() || !reel) return
    addCommentMutation.mutate(commentText)
  }

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center w-full min-h-[400px]', className)}>
        <LoadingOverlay open={true} title="Loading reel..." />
      </div>
    )
  }

  if (error || !reel) {
    return (
      <div className={cn('flex items-center justify-center w-full min-h-[400px]', className)}>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Reel not found</p>
        </div>
      </div>
    )
  }

  const videoUrl = reel.videoUrl || ''

  return (
    <>
      <div className={cn('relative flex justify-center w-full', className)}>
        <div className="relative w-full max-w-md aspect-[9/16] min-h-0 max-h-[90vh]">
          {/* Reel Video */}
          <div className="absolute inset-0 rounded-xl overflow-hidden bg-gray-900 group">
            <video
              ref={videoRef}
              src={videoUrl}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              loop
              playsInline
              onClick={handlePlayPause}
            />

            {/* Video Controls Overlay - Desktop Only */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="flex items-center gap-4 pointer-events-auto">
                {/* Play/Pause Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayPause}
                  className="h-12 w-12 rounded-full bg-transparent hover:bg-transparent border-0 flex items-center justify-center"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-white" />
                  ) : (
                    <Play className="h-6 w-6 text-white" />
                  )}
                </Button>

                {/* Mute/Unmute Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMuteToggle}
                  className="h-12 w-12 rounded-full bg-transparent hover:bg-transparent border-0 flex items-center justify-center"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="h-6 w-6 text-white" />
                  ) : (
                    <Volume2 className="h-6 w-6 text-white" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Controls - Top Right */}
            <div className="md:hidden absolute top-4 right-4 flex gap-2 z-20 pointer-events-auto">
              <button
                onClick={e => {
                  e.stopPropagation()
                  handlePlayPause()
                }}
                className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={e => {
                  e.stopPropagation()
                  handleMuteToggle()
                }}
                className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Mobile User Info - Bottom Left */}
            <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
              <div className="flex items-start gap-3 pointer-events-auto">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                  {(() => {
                    const avatar = getUserAvatar(reel.user)
                    const displayName = getUserDisplayName(reel.user)
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
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    {reel.userId && getProfileUrl(reel.userId, reel.user?.type) ? (
                      <Link
                        href={getProfileUrl(reel.userId, reel.user?.type)!}
                        className="hover:text-brand-300 transition-colors"
                      >
                        <h4 className="text-14 font-normal">
                          {getUserDisplayName(reel.user)}
                        </h4>
                      </Link>
                    ) : (
                      <h4 className="text-14 font-normal">
                        {getUserDisplayName(reel.user)}
                      </h4>
                    )}
                    {reel.userId && (
                      <Button
                        variant={isFollowing ? 'outline' : 'brand'}
                        size="sm"
                        onClick={handleFollowClick}
                        disabled={toggleFollowMutation.isPending}
                        className="text-10 h-6 px-2"
                      >
                        <UserPlus className={cn('h-3 w-3 mr-1', isFollowing && 'hidden')} />
                        {toggleFollowMutation.isPending
                          ? '...'
                          : isFollowing
                            ? 'Following'
                            : 'Follow'}
                      </Button>
                    )}
                  </div>
                  <p className="text-12 text-white/80 mb-2">
                    {formatDate(reel.publishedAt || reel.creationDate)}
                  </p>
                  <p className="text-14 text-white/90 line-clamp-2">
                    {reel.description || reel.caption || reel.title || ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Engagement Buttons - Right Side */}
            <div className="md:hidden absolute right-4 bottom-20 flex flex-col gap-4 z-10 pointer-events-auto">
              <button
                onClick={handleLikeClick}
                className="flex flex-col items-center gap-1 text-white"
              >
                <div
                  className={cn(
                    'p-2 rounded-full bg-black/30 backdrop-blur-sm',
                    isLiked && 'bg-brand-500/80'
                  )}
                >
                  <Heart
                    className={cn(
                      'h-6 w-6',
                      isLiked && 'fill-brand-500 text-brand-500'
                    )}
                  />
                </div>
                <span className="text-12 font-normal">{likes}</span>
              </button>

              <button
                onClick={handleCommentClick}
                className="flex flex-col items-center gap-1 text-white"
              >
                <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <span className="text-12 font-normal">
                  {reel.reviewCount || reel.commentCount || 0}
                </span>
              </button>

              <button
                onClick={handleShareClick}
                disabled={shareMutation.isPending}
                className="flex flex-col items-center gap-1 text-white disabled:opacity-50"
              >
                <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm">
                  <Share2 className="h-6 w-6" />
                </div>
                <span className="text-12 font-normal">{shares}</span>
              </button>

              <button
                onClick={handleFavoriteClick}
                disabled={toggleFavoriteMutation.isPending}
                className="flex flex-col items-center gap-1 text-white disabled:opacity-50"
              >
                <div
                  className={cn(
                    'p-2 rounded-full bg-black/30 backdrop-blur-sm',
                    isFavorited && 'bg-brand-500/80'
                  )}
                >
                  <Star
                    className={cn(
                      'h-6 w-6',
                      isFavorited && 'fill-brand-500 text-brand-500'
                    )}
                  />
                </div>
                <span className="text-12 font-normal">{favorites}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Comments Modal - Bottom Sheet */}
      {isCommentsOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsCommentsOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col animate-[slideUp_0.3s_ease-out]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <h2 className="text-16 font-normal text-gray-900">Comments</h2>
              <button
                onClick={() => setIsCommentsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close comments"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <CommentCard key={comment.id} {...comment} />
                  ))
                ) : (
                  <p className="text-14 text-gray-500 text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                  {(() => {
                    const avatar = reel ? getUserAvatar(reel.user) : null
                    const displayName = reel ? getUserDisplayName(reel.user) : 'U'
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
                  disabled={!commentText.trim() || addCommentMutation.isPending}
                  className="h-10 w-10 flex-shrink-0"
                  aria-label="Send comment"
                >
                  <Send className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
