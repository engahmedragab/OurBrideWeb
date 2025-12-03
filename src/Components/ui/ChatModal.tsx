'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MessageBubble } from './MessageBubble'
import { QuickReplySuggestions } from './QuickReplySuggestions'
import { ChatInputArea, type QuickReplyChip } from './ChatInputArea'
import { SeenIndicator } from './SeenIndicator'
import { Button } from './Button'

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
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        className
      )}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[5px]"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-[848px] bg-white rounded-3xl shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {supportAvatar && (
              <img
                src={supportAvatar}
                alt={supportName}
                className="h-[60px] w-[60px] rounded-full object-cover"
              />
            )}
            <div className="flex flex-col gap-1">
              <h3 className="text-20 font-medium leading-6 text-gray-900">
                {supportName}
              </h3>
              <p className="text-14 font-normal leading-4 text-gray-500">
                {supportSubtitle}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-9">
          {messageHistory.map((msg) => (
            <div key={msg.id}>
              {msg.sender === 'support' && (
                <div className="flex gap-2 items-end mb-2">
                  {supportAvatar && (
                    <img
                      src={supportAvatar}
                      alt="Support"
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 max-w-[476px]">
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
                  <div className="max-w-[476px]">
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

        {/* Input Area */}
        <div className="p-6 border-t border-gray-100">
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

