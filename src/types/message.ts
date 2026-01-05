/**
 * Message types for the messaging system
 */

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  seen: boolean
  type: 'text' | 'image' | 'audio' | 'product'
  productData?: {
    id: string
    title: string
    image: string
    price: number
    currency: string
  }
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  lastSeen?: string
  isOnline?: boolean
}

export interface MessageGroup {
  senderId: string
  senderName: string
  senderAvatar?: string
  messages: Message[]
}
