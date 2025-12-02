'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface ReelPlayerProps {
  id: string
  videoUrl?: string
  className?: string
}

const mockReels = [
  {
    id: '1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: '2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: '3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
]

export const ReelPlayer = ({
  id: _id,
  videoUrl: _videoUrl,
  className,
}: ReelPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
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

  return (
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

          {/* Video Controls Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
        </div>

        {/* Navigation Arrows */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10 pointer-events-auto">
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
  )
}

