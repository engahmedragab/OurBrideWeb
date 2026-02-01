'use client'

import { useState } from 'react'
import { UserPageLayout } from '@/components/layout'
import {
  EmptyState,
  MessagesCenterLayout,
  ConversationListItem,
  ChatView,
  ChatPlaceholder,
} from '@/components/ui'
import messagesEmptySvg from '@/assets/svg/messages-empty.svg'
import type { Conversation, Message } from '@/types/message'
import { useI18nTranslations } from '@/i18n/hooks'

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: 'user1',
    participantName: 'Ahmed Ramadan',
    participantAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    lastMessage: 'Hello, I need some help regarding my order...',
    lastMessageTime: 'Today at 5:52 PM',
    unreadCount: 0,
    lastSeen: 'Last Seen : Today at 5:52 PM',
    isOnline: true,
  },
  {
    id: '2',
    participantId: 'user2',
    participantName: 'Ahmed Ramadan',
    participantAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    lastMessage: 'Thank you for your help! I really appreciate it.',
    lastMessageTime: '2:30 PM',
    unreadCount: 2,
    lastSeen: 'Last Seen : Today at 2:30 PM',
    isOnline: false,
  },
  {
    id: '3',
    participantId: 'user3',
    participantName: 'Ahmed Ramadan',
    participantAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    lastMessage: 'Can we discuss the delivery date?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    lastSeen: 'Last Seen : Yesterday at 3:15 PM',
    isOnline: false,
  },
]

// Mock data for messages
const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: 'user1',
      senderName: 'Ahmed Ramadan',
      senderAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      content: 'Hello!',
      timestamp: '5:42 PM',
      seen: true,
      type: 'text',
    },
    {
      id: 'm2',
      conversationId: '1',
      senderId: 'current-user',
      senderName: 'You',
      content: 'Hello',
      timestamp: '5:42 PM',
      seen: true,
      type: 'text',
    },
    {
      id: 'm3',
      conversationId: '1',
      senderId: 'user1',
      senderName: 'Ahmed Ramadan',
      senderAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      content: 'I want to talk about the service',
      timestamp: '5:42 PM',
      seen: true,
      type: 'text',
    },
    {
      id: 'm4',
      conversationId: '1',
      senderId: 'current-user',
      senderName: 'You',
      content: '',
      timestamp: '5:42 PM',
      seen: true,
      type: 'product',
      productData: {
        id: 'p1',
        title: 'Product title',
        image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200',
        price: 4500,
        currency: 'egp',
      },
    },
    {
      id: 'm5',
      conversationId: '1',
      senderId: 'current-user',
      senderName: 'You',
      content: 'I Want to talk about the service',
      timestamp: '5:42 PM',
      seen: true,
      type: 'text',
    },
    {
      id: 'm6',
      conversationId: '1',
      senderId: 'user1',
      senderName: 'Ahmed Ramadan',
      senderAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      content: 'How can I help you today ?',
      timestamp: '5:42 PM',
      seen: false,
      type: 'text',
    },
  ],
  '2': [
    {
      id: 'm7',
      conversationId: '2',
      senderId: 'user2',
      senderName: 'Ahmed Ramadan',
      senderAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      content: 'Hi! I have a question about my order',
      timestamp: '2:20 PM',
      seen: true,
      type: 'text',
    },
    {
      id: 'm8',
      conversationId: '2',
      senderId: 'current-user',
      senderName: 'You',
      content: 'Sure, how can I help?',
      timestamp: '2:22 PM',
      seen: true,
      type: 'text',
    },
  ],
  '3': [
    {
      id: 'm9',
      conversationId: '3',
      senderId: 'user3',
      senderName: 'Ahmed Ramadan',
      senderAvatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      content: 'Can we discuss the delivery date?',
      timestamp: 'Yesterday 3:15 PM',
      seen: true,
      type: 'text',
    },
  ],
}

/**
 * MessagesPage component
 * Displays the messages center with conversations list and chat view
 */
export default function MessagesPage() {
  const t = useI18nTranslations('messages')
  const [conversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(conversations.length > 0 ? conversations[0].id : null)
  const [searchValue, setSearchValue] = useState('')
  const [messages, setMessages] = useState<Record<string, Message[]>>(
    mockMessages
  )

  const selectedConversation = conversations.find(
    c => c.id === selectedConversationId
  )
  const currentMessages = selectedConversationId
    ? messages[selectedConversationId] || []
    : []

  const handleSendMessage = (message: string, audioBlob?: Blob, images?: File[]) => {
    if (!selectedConversationId) return

    // Handle images if provided
    if (images && images.length > 0) {
      images.forEach((imageFile) => {
        // TODO: In production, upload image to server first:
        // const imageUrl = await uploadImage(imageFile)
        // For demo purposes, we use createObjectURL for immediate preview
        const imageUrl = URL.createObjectURL(imageFile)
        
        const imageMessage: Message = {
          id: `m${Date.now()}-${Math.random()}`,
          conversationId: selectedConversationId,
          senderId: 'current-user',
          senderName: t('chat.you'),
          content: imageUrl, // In production: use the server-returned URL
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }),
          seen: false,
          type: 'image',
        }

        setMessages(prev => ({
          ...prev,
          [selectedConversationId]: [
            ...(prev[selectedConversationId] || []),
            imageMessage,
          ],
        }))
      })
    }

    // Handle text message
    if (message.trim()) {
      const newMessage: Message = {
        id: `m${Date.now()}`,
        conversationId: selectedConversationId,
        senderId: 'current-user',
        senderName: t('chat.you'),
        content: message,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
        seen: false,
        type: audioBlob ? 'audio' : 'text',
      }

      setMessages(prev => ({
        ...prev,
        [selectedConversationId]: [
          ...(prev[selectedConversationId] || []),
          newMessage,
        ],
      }))
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchValue.toLowerCase())
  )

  // Show empty state if no conversations
  if (conversations.length === 0) {
    return (
      <UserPageLayout>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-32 font-semibold text-gray-900">{t('title')}</h1>
          </div>
        </div>

        {/* Empty State */}
        <EmptyState
          illustration={messagesEmptySvg}
          title={t('empty.title')}
          description={t('empty.description')}
          actionLabel={t('empty.actionLabel')}
          actionHref="/products"
        />
      </UserPageLayout>
    )
  }

  return (
    <UserPageLayout>
      <div className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]">
        <MessagesCenterLayout
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          selectedConversationId={selectedConversationId}
          conversationsList={
            <div className="py-2">
              {filteredConversations.map(conversation => (
                <ConversationListItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={selectedConversationId === conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                />
              ))}
            </div>
          }
          chatView={
            selectedConversation ? (
              <ChatView
                conversation={selectedConversation}
                messages={currentMessages}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <ChatPlaceholder />
            )
          }
        />
      </div>
    </UserPageLayout>
  )
}
