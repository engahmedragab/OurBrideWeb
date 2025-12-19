import { useState, useEffect, useRef } from 'react'
import { Trash2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

export interface VoiceRecorderInputProps {
  audioBlob?: Blob
  duration: number
  onDelete: () => void
  onSend: () => void
  isRecording?: boolean
  className?: string
}

/**
 * VoiceRecorderInput - Component for displaying recorded voice message with waveform
 */
export const VoiceRecorderInput = ({
  audioBlob,
  duration,
  onDelete,
  onSend,
  isRecording = false,
  className,
}: VoiceRecorderInputProps) => {
  const [waveformData, setWaveformData] = useState<number[]>([])
  const [displayDuration, setDisplayDuration] = useState(0)
  const animationRef = useRef<number | null>(null)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Update display duration from prop or increment during recording
  useEffect(() => {
    if (isRecording) {
      // Start incrementing duration every second from the current duration prop
      setDisplayDuration(duration)
      // Clear any existing interval first
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
      durationIntervalRef.current = setInterval(() => {
        setDisplayDuration(prev => prev + 1)
      }, 1000)
      return () => {
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current)
          durationIntervalRef.current = null
        }
      }
    } else {
      // Use the prop duration when not recording
      setDisplayDuration(duration)
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]) // Only depend on isRecording to avoid restarting interval on every duration change

  // Sync displayDuration with duration prop when not recording
  useEffect(() => {
    if (!isRecording) {
      setDisplayDuration(duration)
    }
  }, [duration, isRecording])

  // Generate waveform data (simulated for now, can be replaced with actual audio analysis)
  useEffect(() => {
    if (isRecording) {
      // Animated waveform during recording
      const generateWaveform = () => {
        const bars = Array.from({ length: 50 }, () =>
          Math.random() * 60 + 20
        )
        setWaveformData(bars)
        animationRef.current = requestAnimationFrame(generateWaveform)
      }
      generateWaveform()
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    } else if (audioBlob) {
      // Static waveform after recording
      const bars = Array.from({ length: 50 }, () => Math.random() * 60 + 20)
      setWaveformData(bars)
    } else {
      setWaveformData([])
    }
  }, [isRecording, audioBlob])

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn('flex items-center gap-1.5 sm:gap-2', className)}>
      {/* Voice Message Container */}
      <div className="flex-1 bg-gray-50 rounded-3xl px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 flex items-center gap-2 sm:gap-3">
        {/* Delete Button */}
        <button
          type="button"
          onClick={onDelete}
          className="flex-shrink-0 p-0.5 sm:p-1 text-brand-500 hover:text-brand-600 transition-colors"
          aria-label="Delete recording"
        >
          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Waveform Visualization */}
        <div className="flex-1 flex items-center justify-center gap-0.5 h-8 sm:h-10 md:h-12 px-1.5 sm:px-2">
          {waveformData.length > 0 ? (
            waveformData.map((height, index) => (
              <div
                key={index}
                className={cn(
                  'w-[1px] md:w-0.5 bg-gray-400 rounded-full transition-all duration-100',
                  isRecording && 'bg-brand-500'
                )}
                style={{
                  height: `${height}%`,
                  minHeight: '3px',
                  animation: isRecording
                    ? `waveform-pulse ${0.5 + (index % 10) * 0.1}s ease-in-out infinite`
                    : 'none',
                }}
              />
            ))
          ) : (
            <div className="text-12 sm:text-13 md:text-14 text-gray-400">Recording...</div>
          )}
        </div>

        {/* Duration - Always visible */}
        <span 
          className={cn(
            "flex-shrink-0 text-12 sm:text-13 md:text-14 min-w-[45px] sm:min-w-[50px] text-right font-medium",
            isRecording ? "text-brand-500" : "text-gray-600"
          )}
        >
          {formatDuration(displayDuration)}
        </span>
      </div>

      {/* Send Button */}
      <Button
        variant="brand"
        size="icon"
        onClick={onSend}
        className="h-[45px] w-[45px] sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px] rounded-full flex-shrink-0"
        disabled={!audioBlob && !isRecording}
      >
        <Send className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
      </Button>
    </div>
  )
}

