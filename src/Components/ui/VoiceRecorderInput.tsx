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
  const [displayDuration, setDisplayDuration] = useState(duration)
  const animationRef = useRef<number>()
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Update display duration when duration prop changes
  useEffect(() => {
    setDisplayDuration(duration)
  }, [duration])
  
  // Start local timer interval when recording
  useEffect(() => {
    if (isRecording) {
      // Reset to current duration prop
      setDisplayDuration(duration)
      
      // Start interval to update every second
      timerIntervalRef.current = setInterval(() => {
        setDisplayDuration((prev) => prev + 1)
      }, 1000)
      
      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current)
          timerIntervalRef.current = null
        }
      }
    } else {
      // Stop interval when not recording
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
      // Update to final duration
      setDisplayDuration(duration)
    }
  }, [isRecording, duration])

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
    <div className={cn('flex items-center gap-2', className)}>
      {/* Voice Message Container */}
      <div className="flex-1 bg-gray-50 rounded-3xl px-4 py-3 flex items-center gap-3">
        {/* Delete Button */}
        <button
          type="button"
          onClick={onDelete}
          className="flex-shrink-0 p-1 text-brand-500 hover:text-brand-600 transition-colors"
          aria-label="Delete recording"
        >
          <Trash2 className="h-5 w-5" />
        </button>

        {/* Waveform Visualization */}
        <div className="flex-1 flex items-center justify-center gap-0.5 h-12 px-2">
          {waveformData.length > 0 ? (
            waveformData.map((height, index) => (
              <div
                key={index}
                className={cn(
                  'w-0.5 bg-gray-400 rounded-full transition-all duration-100',
                  isRecording && 'bg-brand-500'
                )}
                style={{
                  height: `${height}%`,
                  minHeight: '4px',
                  animation: isRecording
                    ? `waveform-pulse ${0.5 + (index % 10) * 0.1}s ease-in-out infinite`
                    : 'none',
                }}
              />
            ))
          ) : (
            <div className="text-14 text-gray-400">Recording...</div>
          )}
        </div>

        {/* Duration - Always visible */}
        <span 
          key={`duration-${displayDuration}`} 
          className={cn(
            "flex-shrink-0 text-14 min-w-[50px] text-right font-medium",
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
        className="h-[60px] w-[60px] rounded-full flex-shrink-0"
        disabled={!audioBlob && !isRecording}
      >
        <Send className="h-6 w-6 text-white" />
      </Button>
    </div>
  )
}

