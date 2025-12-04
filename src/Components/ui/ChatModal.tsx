'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MessageBubble } from './MessageBubble'
import { QuickReplySuggestions } from './QuickReplySuggestions'
import { ChatInputArea, type QuickReplyChip } from './ChatInputArea'
import { SeenIndicator } from './SeenIndicator'
import { Button } from './Button'
import chatAvatarImage from '@/assets/images/ourBride_chat_avatar.png'

export interface ChatMessage {
  id: string
  message: string
  sender: 'user' | 'support'
  timestamp: string
  seen?: boolean
  quickReplies?: string[]
  audioBlob?: Blob
  audioDuration?: number
}

export interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  messageHistory: ChatMessage[]
  onSend: (message: string, audioBlob?: Blob) => void
  onSelectQuickReply?: (reply: string) => void
  supportName?: string
  supportAvatar?: string
  supportSubtitle?: string
  quickReplyChips?: QuickReplyChip[]
  className?: string
}

/**
 * ChatModal - Main chat modal component
 */
export const ChatModal = ({
  isOpen,
  onClose,
  messageHistory,
  onSend,
  onSelectQuickReply,
  supportName = 'Our Bride Help Center',
  supportAvatar,
  supportSubtitle = 'We usually respond within a few minutes.',
  quickReplyChips = [],
  className,
}: ChatModalProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState('')

  // Use default avatar if not provided
  const defaultAvatar =
    typeof chatAvatarImage === 'object' && 'src' in chatAvatarImage
      ? chatAvatarImage.src
      : String(chatAvatarImage)
  const avatarSrc = supportAvatar || defaultAvatar

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isOpen, messageHistory])

  const handleSend = (message?: string, audioBlob?: Blob) => {
    const messageToSend = message || inputValue.trim()
    if (messageToSend.length > 0 || audioBlob) {
      // Send message and audio blob to parent component
      // Parent component will handle sending to backend
      onSend(messageToSend || (audioBlob ? '[Voice Message]' : ''), audioBlob)
      setInputValue('')
    }
  }

  const handleRecord = () => {
    // Recording is handled by ChatInputArea component
  }

  const handleQuickReplySelect = (reply: string) => {
    if (onSelectQuickReply) {
      onSelectQuickReply(reply)
    } else {
      onSend(reply)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 p-2 sm:p-3 bg-black/60 backdrop-blur-[5px]',
        className
      )}
      onClick={onClose}
    >
      {/* Header - Separate Container */}
      <div
        className="bg-white rounded-xl sm:rounded-2xl shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] w-[90%] lg:w-[70%] flex items-center justify-between p-3 sm:p-4 md:p-6 flex-shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <img
            src={avatarSrc}
            alt={supportName}
            className="h-8 w-8 sm:h-10 sm:w-10 md:h-[60px] md:w-[60px] rounded-full object-cover flex-shrink-0"
          />
          <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
            <h3 className="text-14 sm:text-16 md:text-20 font-medium leading-5 sm:leading-6 text-gray-900 truncate">
              {supportName}
            </h3>
            <p className="text-12 sm:text-13 md:text-14 font-normal leading-4 text-gray-500 truncate">
              {supportSubtitle}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 sm:h-7 sm:w-7 rounded-full flex-shrink-0"
        >
          <X className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      {/* Messages Container - Separate with Scroll */}
      <div
        className="bg-white rounded-xl sm:rounded-2xl shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] w-[90%] lg:w-[70%] flex flex-col h-[80vh] lg:h-[70vh] max-h-[500px] sm:max-h-[500px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 space-y-3 sm:space-y-4 md:space-y-6 min-h-0">
          {messageHistory.map(msg => (
            <div key={msg.id}>
              {msg.sender === 'support' && (
                <div className="flex gap-1.5 items-end mb-1">
                  <img
                    src={avatarSrc}
                    alt="Support"
                    className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 max-w-[80%] sm:max-w-[350px] md:max-w-[400px]">
                    <MessageBubble
                      message={msg.message}
                      timestamp={msg.timestamp}
                      seen={msg.seen}
                      sender={msg.sender}
                      audioBlob={msg.audioBlob}
                      audioDuration={msg.audioDuration}
                    />
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="mt-2">
                        <QuickReplySuggestions
                          suggestions={msg.quickReplies}
                          onSelect={handleQuickReplySelect}
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {msg.timestamp && (
                        <span className="text-12 font-normal leading-4 text-gray-500">
                          {msg.timestamp}
                        </span>
                      )}
                      {msg.seen !== undefined && (
                        <SeenIndicator seen={msg.seen} />
                      )}
                    </div>
                  </div>
                </div>
              )}
              {msg.sender === 'user' && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] sm:max-w-[350px] md:max-w-[400px]">
                    <MessageBubble
                      message={msg.message}
                      timestamp={msg.timestamp}
                      seen={msg.seen}
                      sender={msg.sender}
                      audioBlob={msg.audioBlob}
                      audioDuration={msg.audioDuration}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed */}
        <div className="p-2 sm:p-3 md:p-4 lg:p-6 border-t border-gray-100 flex-shrink-0">
          <ChatInputArea
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            onRecord={handleRecord}
            quickReplies={quickReplyChips}
            placeholder="Enter Your Message.."
          />
        </div>
      </div>
    </div>
  )
}
