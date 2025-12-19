'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Share2,
  Send,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CommentCard } from './CommentCard'
import { useToast } from '@/components/ui/Toaster'

export interface ReelPlayerProps {
  id: string
  videoUrl?: string
  className?: string
}

const mockReels = [
  {
    id: '1',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    author: {
      name: 'Aya Mohamed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    content:
      'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque.',
    timestamp: '18 Aug 2025 12:45 PM',
    likes: 20,
    comments: 20,
    shares: 215,
  },
  {
    id: '2',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    author: {
      name: 'Aya Mohamed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    content:
      'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque.',
    timestamp: '18 Aug 2025 12:45 PM',
    likes: 20,
    comments: 20,
    shares: 215,
  },
  {
    id: '3',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    author: {
      name: 'Aya Mohamed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    content:
      'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque.',
    timestamp: '18 Aug 2025 12:45 PM',
    likes: 20,
    comments: 20,
    shares: 215,
  },
]

const mockComments = [
  {
    id: '1',
    author: {
      name: 'Aya Mohamed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    content:
      'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque.',
    timestamp: '18 Aug 2025 12:45 PM',
  },
  {
    id: '2',
    author: {
      name: 'Aya Mohamed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    content:
      'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque.',
    timestamp: '18 Aug 2025 12:45 PM',
  },
  {
    id: '3',
    author: {
      name: 'Aya Mohamed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    content:
      'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque.',
    timestamp: '18 Aug 2025 12:45 PM',
  },
]

export const ReelPlayer = ({
  id: _id,
  videoUrl: _videoUrl,
  className,
}: ReelPlayerProps) => {
  const { addToast } = useToast()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(mockReels[0].likes)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(mockComments)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentReel = mockReels[currentIndex]

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      if (isPlaying) {
        video.play().catch(() => {
          // Handle autoplay restrictions
          setIsPlaying(false)
        })
      } else {
        video.pause()
      }
    }
  }, [isPlaying, currentIndex])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = isMuted
    }
  }, [isMuted, currentIndex])

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? mockReels.length - 1 : prev - 1))
    setIsPlaying(true)
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev === mockReels.length - 1 ? 0 : prev + 1))
    setIsPlaying(true)
  }

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev)
  }

  const handleMuteToggle = () => {
    setIsMuted(prev => !prev)
  }

  const handleLikeClick = () => {
    setIsLiked(!isLiked)
    setLikes(prev => (isLiked ? prev - 1 : prev + 1))
  }

  const handleCommentClick = () => {
    setIsCommentsOpen(true)
  }

  const handleShareClick = async () => {
    const url = `${window.location.origin}/community?tab=reels`
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

  const handleAddComment = () => {
    if (!commentText.trim()) return

    const newComment = {
      id: Date.now().toString(),
      author: {
        name: 'Aya Mohamed',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      content: commentText,
      timestamp: new Date().toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setComments([...comments, newComment])
    setCommentText('')
  }

  useEffect(() => {
    setLikes(currentReel.likes)
    setIsLiked(false)
  }, [currentIndex, currentReel.likes])

  return (
    <>
    <div className={cn('relative flex justify-center w-full', className)}>
      <div className="relative w-full max-w-md aspect-[9/16] min-h-0 max-h-[90vh]">
        {/* Reel Video */}
        <div className="absolute inset-0 rounded-xl overflow-hidden bg-gray-900 group">
          <video
            ref={videoRef}
            src={currentReel.videoUrl}
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
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={currentReel.author.avatar}
                    alt={currentReel.author.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-white">
                  <h4 className="text-14 font-normal mb-1">
                    {currentReel.author.name}
                  </h4>
                  <p className="text-12 text-white/80 mb-2">
                    {currentReel.timestamp}
                  </p>
                  <p className="text-14 text-white/90 line-clamp-2">
                    {currentReel.content}
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
                  {currentReel.comments}
                </span>
              </button>

              <button
                onClick={handleShareClick}
                className="flex flex-col items-center gap-1 text-white"
              >
                <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm">
                  <Share2 className="h-6 w-6" />
                </div>
                <span className="text-12 font-normal">{currentReel.shares}</span>
              </button>
        </div>

            {/* Navigation Arrows - Desktop Only */}
            <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-2 z-10 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="h-10 w-10 rounded-full bg-white/80 hover:bg-white border border-gray-200 flex items-center justify-center"
            aria-label="Previous reel"
          >
            <ChevronUp className="h-5 w-5 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="h-10 w-10 rounded-full bg-brand-500 hover:bg-brand-600 border border-brand-500 flex items-center justify-center"
            aria-label="Next reel"
          >
            <ChevronDown className="h-5 w-5 text-white" />
          </Button>
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
                {comments.map(comment => (
                  <CommentCard key={comment.id} {...comment} />
                ))}
              </div>
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                    alt="Your avatar"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
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
        </div>
      )}
    </>
  )
}
