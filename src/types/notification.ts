export type NotificationType =
  | 'order'
  | 'message'
  | 'community'
  | 'product'
  | 'gift'
  | 'event'
  | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  isRead: boolean
  actionUrl?: string
  imageUrl?: string
  metadata?: {
    orderId?: string
    userId?: string
    productId?: string
    eventId?: string
  }
}

