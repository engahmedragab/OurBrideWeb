import { useState, useMemo } from 'react'
import type { Notification } from '@/types/notification'

// Mock notifications data - in production, this would come from an API
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order #12345 has been confirmed and is being prepared.',
    timestamp: '2 minutes ago',
    isRead: false,
    actionUrl: '/orders',
    metadata: { orderId: '12345' },
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    message: 'Ahmed Ramadan sent you a new message',
    timestamp: '15 minutes ago',
    isRead: false,
    actionUrl: '/messages',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    id: '3',
    type: 'community',
    title: 'New Follower',
    message: 'Sarah Ahmed started following you',
    timestamp: '1 hour ago',
    isRead: true,
    actionUrl: '/community/profile',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: '4',
    type: 'product',
    title: 'Price Drop Alert',
    message: 'The wedding dress you saved is now 20% off!',
    timestamp: '2 hours ago',
    isRead: false,
    actionUrl: '/products/123',
    imageUrl: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200',
    metadata: { productId: '123' },
  },
  {
    id: '5',
    type: 'gift',
    title: 'Gift Received',
    message: 'You received a gift from Mariam Ali',
    timestamp: '3 hours ago',
    isRead: true,
    actionUrl: '/dashboard/gift-center',
  },
  {
    id: '6',
    type: 'event',
    title: 'Event Reminder',
    message: 'Your wedding planning session is scheduled for tomorrow at 2:00 PM',
    timestamp: '5 hours ago',
    isRead: false,
    actionUrl: '/events',
    metadata: { eventId: '456' },
  },
  {
    id: '7',
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order #12340 is on the way! Track your delivery.',
    timestamp: '1 day ago',
    isRead: true,
    actionUrl: '/orders',
    metadata: { orderId: '12340' },
  },
  {
    id: '8',
    type: 'system',
    title: 'Account Verification',
    message: 'Your account has been successfully verified',
    timestamp: '2 days ago',
    isRead: true,
  },
]

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.isRead).length,
    [notifications]
  )

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
}

