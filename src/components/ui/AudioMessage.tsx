import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

export interface AudioMessageProps {
  audioBlob: Blob
  duration?: number
  sender: 'user' | 'support'
  className?: string
}

/**
 * AudioMessage - Component for displaying and playing audio messages in chat
 */
export const AudioMessage = ({
  audioBlob,
  duration,
  sender,
  className,
}: AudioMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)

  // Create audio URL from blob and set up audio element
  useEffect(() => {
    if (!audioBlob) return

    const audioUrl = URL.createObjectURL(audioBlob)
    audioUrlRef.current = audioUrl

    const audio = new Audio(audioUrl)
    audioRef.current = audio

    const handleLoadedMetadata = () => {
      setAudioDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      URL.revokeObjectURL(audioUrl)
    }
  }, [audioBlob])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleDownload = () => {
    if (audioUrlRef.current) {
      const link = document.createElement('a')
      link.href = audioUrlRef.current
      link.download = `voice-message-${Date.now()}.webm`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0
  const displayDuration = duration || Math.floor(audioDuration)

  const isUser = sender === 'user'

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl p-3 max-w-[300px]',
        isUser
          ? 'bg-brand-500 text-white'
          : 'bg-gray-50 border border-gray-100 text-gray-900',
        className
      )}
    >
      {/* Play/Pause Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        className={cn(
          'h-10 w-10 rounded-full flex-shrink-0',
          isUser
            ? 'text-white hover:bg-white/20'
            : 'text-brand-500 hover:bg-brand-50'
        )}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>

      {/* Progress Bar and Duration */}
      <div className="flex-1 flex flex-col gap-1">
        {/* Progress Bar */}
        <div
          className={cn(
            'h-1 rounded-full overflow-hidden',
            isUser ? 'bg-white/30' : 'bg-gray-200'
          )}
        >
          <div
            className={cn(
              'h-full transition-all duration-100',
              isUser ? 'bg-white' : 'bg-brand-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Duration */}
        <div className="flex items-center justify-between">
          <span className="text-12 font-normal">
            {formatTime(currentTime)} / {formatTime(displayDuration)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className={cn(
              'h-6 w-6 p-0',
              isUser
                ? 'text-white hover:bg-white/20'
                : 'text-gray-500 hover:bg-gray-100'
            )}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
