import { useState, KeyboardEvent, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Input } from './Input'
import { Plus, Mic, Send, MapPin, Image as ImageIcon, Paperclip } from 'lucide-react'
import { Button } from './Button'
import { VoiceRecorderInput } from './VoiceRecorderInput'
import { Popover, PopoverTrigger, PopoverContent } from './Popover'
import { ImagePreviewList } from './ImagePreview'

export interface QuickReplyChip {
  text: string
  onClick: () => void
}

export interface ChatInputAreaProps {
  value: string
  onChange: (value: string) => void
  onSend: (message?: string, audioBlob?: Blob, images?: File[]) => void
  onRecord?: () => void
  onAttachImage?: (file: File) => void
  onAttachDocument?: (file: File) => void
  onAttachLocation?: () => void
  onImagesChange?: (hasImages: boolean) => void
  placeholder?: string
  quickReplies?: QuickReplyChip[]
  disabled?: boolean
  className?: string
}

/**
 * ChatInputArea - Component for chat input with dynamic Send/Record button
 */
export const ChatInputArea = ({
  value,
  onChange,
  onSend,
  onRecord,
  onAttachImage,
  onAttachDocument,
  onAttachLocation,
  onImagesChange,
  placeholder = 'Enter Your Message..',
  quickReplies = [],
  disabled = false,
  className,
}: ChatInputAreaProps) => {
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false)
  const [pendingImages, setPendingImages] = useState<Array<{ file: File; preview: string }>>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const sendOnStopRef = useRef<boolean>(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
    }
  }, [isRecording])

  // Notify parent when images change
  useEffect(() => {
    onImagesChange?.(pendingImages.length > 0)
  }, [pendingImages.length, onImagesChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setIsTyping(newValue.length > 0 || pendingImages.length > 0)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (value.trim().length > 0 || pendingImages.length > 0)) {
      handleSend(value.trim())
    }
  }

  const handleSend = (message?: string, audioBlob?: Blob) => {
    const messageToSend = message !== undefined ? message : value.trim()
    if (messageToSend.length > 0 || audioBlob || pendingImages.length > 0) {
      const finalMessage = messageToSend || (audioBlob ? '[Voice Message]' : '')
      const imagesToSend = pendingImages.map(img => img.file)
      onSend(finalMessage, audioBlob, imagesToSend)
      setIsTyping(false)
      onChange('')
      // Reset recording state
      setRecordedAudio(null)
      setRecordingDuration(0)
      audioChunksRef.current = []
      // Clear pending images
      setPendingImages([])
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      streamRef.current = stream
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        // Only process if not deleted (sendOnStopRef would be false if deleted)
        if (sendOnStopRef.current && audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: 'audio/webm',
          })
          setRecordedAudio(audioBlob)

          // If send was requested, send immediately after blob is ready
          sendOnStopRef.current = false
          // Use setTimeout to ensure state is updated
          setTimeout(() => {
            handleSend('', audioBlob)
            setRecordedAudio(null)
            setRecordingDuration(0)
            audioChunksRef.current = []
          }, 50)
        }
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      
      // Start duration timer - update every second
      setRecordingDuration(0) // Reset to 0 first
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)

      if (onRecord) {
        onRecord()
      }
    } catch (error) {
      console.error('Error starting recording:', error)
      alert(
        'Microphone access denied. Please allow microphone access to record voice messages.'
      )
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = null
      }
    } else {
      // Ensure state is cleared even if mediaRecorder is null
      setIsRecording(false)
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = null
      }
    }
  }

  const handleRecord = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handleDeleteRecording = () => {
    // Stop all media tracks immediately without waiting for onstop callback
    if (streamRef.current) {
      // Stop media tracks first
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    // Stop recorder (but we won't wait for onstop)
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop()
        }
      } catch {
        // Ignore errors if already stopped
      }
      mediaRecorderRef.current = null
    }

    // Clear interval immediately
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }

    // Clear all recording state immediately - React will batch these updates
    setIsRecording(false)
    setRecordedAudio(null)
    setRecordingDuration(0)
    audioChunksRef.current = []
    sendOnStopRef.current = false
  }

  const handleSendVoiceMessage = () => {
    if (isRecording) {
      // If still recording, mark to send when recording stops
      sendOnStopRef.current = true
      stopRecording()
    } else if (recordedAudio) {
      // If already recorded, send immediately
      handleSend('', recordedAudio)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newImages: Array<{ file: File; preview: string }> = []
      
      Array.from(files).forEach(file => {
        const preview = URL.createObjectURL(file)
        newImages.push({ file, preview })
      })
      
      setPendingImages(prev => [...prev, ...newImages])
      setIsAttachMenuOpen(false)
      // Update typing state to show send icon
      setIsTyping(true)
      
      // Call the onAttachImage callback if provided
      if (onAttachImage && files[0]) {
        onAttachImage(files[0])
      }
    }
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }

  const handleRemoveImage = (index: number) => {
    setPendingImages(prev => {
      const newImages = [...prev]
      // Revoke the object URL to free memory
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      // Update typing state based on remaining images and text
      if (newImages.length === 0 && value.trim().length === 0) {
        setIsTyping(false)
      }
      return newImages
    })
  }

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onAttachDocument) {
      onAttachDocument(file)
      setIsAttachMenuOpen(false)
      // Update typing state to show send icon
      setIsTyping(true)
    }
  }

  const handleLocationClick = () => {
    if (onAttachLocation) {
      onAttachLocation()
      setIsAttachMenuOpen(false)
    }
  }

  // Show voice recorder input if recording or has recorded audio
  if (isRecording || recordedAudio) {
    return (
      <div className={cn('flex flex-col gap-2 sm:gap-3 md:gap-4', className)}>
        <VoiceRecorderInput
          audioBlob={recordedAudio || undefined}
          duration={recordingDuration}
          onDelete={handleDeleteRecording}
          onSend={handleSendVoiceMessage}
          isRecording={isRecording}
        />
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-2 sm:gap-3 md:gap-4', className)}>
      {/* Image Previews */}
      {pendingImages.length > 0 && (
        <ImagePreviewList
          images={pendingImages}
          onRemove={handleRemoveImage}
        />
      )}

      {/* Input Area */}
      <div className="flex gap-1.5 sm:gap-2 items-center">
        {/* Hidden file inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageSelect}
        />
        <input
          ref={documentInputRef}
          type="file"
          className="hidden"
          onChange={handleDocumentSelect}
        />

        <div className="flex-1 relative">
          <div className="relative">
            <Input
              type="text"
              value={value}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              variant="fill"
              size="lg"
              disabled={disabled}
              className="rounded-3xl px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 pl-11 sm:pl-12 md:pl-14 text-12 sm:text-14 md:text-16"
            />

            {/* Plus Icon with Popover */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Popover open={isAttachMenuOpen} onOpenChange={setIsAttachMenuOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center justify-center hover:bg-gray-100 rounded-full p-1 transition-colors"
                    disabled={disabled}
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-brand-500" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="start"
                  className="w-56 p-3 bg-white shadow-lg"
                >
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleLocationClick}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200 text-14 font-medium text-brand-500 hover:bg-gray-50 transition-colors text-left shadow-sm"
                    >
                      <MapPin className="h-5 w-5 text-brand-500" />
                      <span>Location</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200 text-14 font-medium text-brand-500 hover:bg-gray-50 transition-colors text-left shadow-sm"
                    >
                      <ImageIcon className="h-5 w-5 text-brand-500" />
                      <span>Upload Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => documentInputRef.current?.click()}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200 text-14 font-medium text-brand-500 hover:bg-gray-50 transition-colors text-left shadow-sm"
                    >
                      <Paperclip className="h-5 w-5 text-brand-500" />
                      <span>Upload Document</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <Button
          variant="brand"
          size="icon"
          onClick={isTyping ? () => handleSend(value.trim()) : handleRecord}
          disabled={disabled}
          className={cn(
            'p-2 lg:p-0 h-[45px] w-[45px] sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px] rounded-full flex-shrink-0',
            isRecording && 'animate-pulse'
          )}
        >
          {isTyping ? (
            <Send className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
          ) : (
            <Mic className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
          )}
        </Button>
      </div>
    </div>
  )
}
