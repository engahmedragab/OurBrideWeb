'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Phone, MoreVertical } from 'lucide-react'
import { Button } from './Button'
import { MessageBubble } from './MessageBubble'
import { ChatInputArea } from './ChatInputArea'
import { QuickReplySuggestions } from './QuickReplySuggestions'
import { UserProfileView } from './UserProfileView'
import type { Conversation, Message } from '@/types/message'
import { CallUserModal } from '@/components/ui/CallUserModal'
import { CallRatingModal } from '@/components/ui/CallRatingModal'

export interface ChatViewProps {
  conversation: Conversation
  messages: Message[]
  onSendMessage: (message: string, audioBlob?: Blob, images?: File[]) => void
  className?: string
}

/**
 * ChatView component
 * Displays the chat conversation and input area
 */
export const ChatView = ({
  conversation,
  messages,
  onSendMessage,
  className,
}: ChatViewProps) => {
  const [inputValue, setInputValue] = useState('')
  const [selectedQuickReply, setSelectedQuickReply] = useState<
    string | undefined
  >()
  const [hasAttachments, setHasAttachments] = useState(false)
  const [showProfileView, setShowProfileView] = useState(false)
  // Demo: track call modal state
  const [modalMode, setModalMode] = useState<
    'none' | 'outgoing' | 'incoming' | 'active'
  >('none')
  const [showRatingModal, setShowRatingModal] = useState(false)

  // Demo handlers
  const openOutgoing = () => setModalMode('outgoing')
  const openIncoming = () => setModalMode('incoming')
  const startActive = () => setModalMode('active')
  const handleEnd = () => {
    setModalMode('none')
    // Show rating modal after call ends
    setShowRatingModal(true)
  }

  const handleRatingSubmit = (_rating: number) => {
    // TODO: Send rating to backend
  }

  const quickReplySuggestions = [
    'Good Morning',
    'Can we discuss the price?',
    'Thank you',
    'Looking forward to it',
  ]

  // Get media items from messages (images only)
  const mediaItems = messages
    .filter(msg => msg.type === 'image' && msg.content)
    .map((msg, index) => ({
      id: msg.id || `media-${index}`,
      url: msg.content,
      type: 'image' as const,
    }))

  const handleQuickReplySelect = (suggestion: string) => {
    setSelectedQuickReply(suggestion)
    setInputValue(suggestion)
  }

  const handleSend = (message?: string, audioBlob?: Blob, images?: File[]) => {
    const finalMessage = message || inputValue
    if (finalMessage.trim() || audioBlob || (images && images.length > 0)) {
      onSendMessage(finalMessage, audioBlob, images)
      setInputValue('')
      setSelectedQuickReply(undefined)
    }
  }

  const handleAttachImage = (_file: File) => {
    // TODO: Implement image upload and preview
  }

  const handleAttachDocument = (_file: File) => {
    // TODO: Implement document upload
  }

  const handleAttachLocation = () => {
    // TODO: Implement location picker
  }

  return (
    <>
      {/* Call Rating Modal */}
      <CallRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
      />
      {/* Call Modal DEMO - full testable flow */}
      {modalMode === 'outgoing' && (
        <CallUserModal
          isOpen
          userName={conversation.participantName}
          userAvatar={conversation.participantAvatar}
          onClose={handleEnd}
          // When 'Start Call' is clicked in this modal, CallUserModal handles its own transition.
          // To test full transition: add a control in parent for demo.
        />
      )}
      {modalMode === 'incoming' && (
        <CallUserModal
          isOpen
          userName={conversation.participantName}
          userAvatar={conversation.participantAvatar}
          incoming
          onClose={handleEnd}
          onAnswerCall={startActive}
          onEndCall={handleEnd}
        />
      )}
      {modalMode === 'active' && (
        <CallUserModal
          isOpen
          userName={conversation.participantName}
          userAvatar={conversation.participantAvatar}
          active
          onClose={handleEnd}
          onEndCall={handleEnd}
        />
      )}
      {showProfileView ? (
        <UserProfileView
          user={{
            id: conversation.participantId,
            name: conversation.participantName,
            avatar: conversation.participantAvatar,
            lastSeen: conversation.lastSeen,
            isOnline: conversation.isOnline,
          }}
          mediaItems={mediaItems}
          onBack={() => setShowProfileView(false)}
          onViewProfile={() => {
            /* TODO: Implement view profile */
          }}
          onMute={() => {
            /* TODO: Implement mute */
          }}
          onBlock={() => {
            /* TODO: Implement block */
          }}
          onCall={() => {
            /* TODO: Implement call */
          }}
          className={className}
        />
      ) : (
        <div className={cn('flex flex-col gap-4 h-full', className)}>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowProfileView(true)}
                className="relative hover:opacity-80 transition-opacity cursor-pointer w-12 h-12"
              >
                <Image
                  src={
                    conversation.participantAvatar ||
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
                  }
                  alt={conversation.participantName}
                  fill
                  sizes="48px"
                  className="rounded-full object-cover"
                />
                {conversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10" />
                )}
              </button>
              <div>
                <h2 className="text-16 font-semibold text-gray-900">
                  {conversation.participantName}
                </h2>
                <p className="text-12 font-normal text-gray-500">
                  {conversation.lastSeen || 'Last Seen : Today at 5:52 PM'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Demo Only: Start and Receive Call Test Buttons */}
              <Button
                variant="brand"
                size="sm"
                className="mr-2"
                onClick={openOutgoing}
              >
                Demo Start Call
              </Button>
              <Button
                variant="success"
                size="sm"
                className="mr-2"
                onClick={openIncoming}
              >
                Demo Receive Call
              </Button>
              {/* Normal Call icon button to open outgoing modal for user action (optional) */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-600 hover:text-brand-500"
                onClick={openOutgoing}
                aria-label="Call user"
              >
                <Phone className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-600 hover:text-brand-500"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages Area and Input - Combined Container */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map(message => {
                const isUserMessage = message.senderId === 'current-user'

                return (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      isUserMessage ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {!isUserMessage && (
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                          src={
                            message.senderAvatar ||
                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
                          }
                          alt={message.senderName}
                          fill
                          sizes="40px"
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[70%]',
                        isUserMessage && 'items-end'
                      )}
                    >
                      {message.type === 'product' && message.productData ? (
                        <div
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-2xl border border-gray-200 bg-white mb-2'
                          )}
                        >
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={message.productData.image}
                              alt={message.productData.title}
                              fill
                              sizes="64px"
                              className="rounded-xl object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-14 font-semibold text-gray-900 mb-1">
                              {message.productData.title}
                            </h4>
                            <p className="text-16 font-bold text-gray-900">
                              {message.productData.price}{' '}
                              <span className="text-12 font-normal">
                                {message.productData.currency}
                              </span>
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {message.type === 'image' ? (
                        <div
                          className={cn(
                            'flex flex-col gap-1',
                            isUserMessage ? 'items-end' : 'items-start'
                          )}
                        >
                          <div className="relative rounded-2xl overflow-hidden max-w-full max-h-80 aspect-auto">
                            <Image
                              src={message.content}
                              alt="Shared image"
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover"
                            />
                          </div>
                          <div
                            className={cn(
                              'flex items-center gap-1',
                              isUserMessage ? 'justify-end' : 'justify-start'
                            )}
                          >
                            {message.timestamp && (
                              <span className="text-10 sm:text-11 md:text-12 font-normal leading-3 sm:leading-3.5 md:leading-4 text-gray-500">
                                {message.timestamp}
                              </span>
                            )}
                            {isUserMessage && (
                              <div className="flex items-center">
                                {message.seen ? (
                                  <svg
                                    className="w-4 h-4 text-blue-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                  </svg>
                                ) : (
                                  <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                  </svg>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}
                      {(message.type === 'text' ||
                        message.type === 'product') &&
                        message.content && (
                          <MessageBubble
                            message={message.content}
                            timestamp={message.timestamp}
                            seen={message.seen}
                            sender={isUserMessage ? 'user' : 'support'}
                          />
                        )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="space-y-3">
                {/* Quick Replies - Hidden when attachments are present */}
                {!hasAttachments && (
                  <QuickReplySuggestions
                    suggestions={quickReplySuggestions}
                    selectedSuggestion={selectedQuickReply}
                    onSelect={handleQuickReplySelect}
                  />
                )}

                {/* Chat Input */}
                <ChatInputArea
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSend}
                  onAttachImage={handleAttachImage}
                  onAttachDocument={handleAttachDocument}
                  onAttachLocation={handleAttachLocation}
                  onImagesChange={setHasAttachments}
                  placeholder="Enter Your Message.."
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
