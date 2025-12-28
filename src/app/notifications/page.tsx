'use client'

import { useState } from 'react'
import { UserPageLayout } from '@/components/layout'
import { EmptyState, Button, Badge } from '@/components/ui'
import { NotificationCard } from '@/components/notifications/NotificationCard'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types/notification'
import {
  Bell,
  ShoppingBag,
  MessageSquare,
  Users,
  Package,
  Gift,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import messagesEmptySvg from '@/assets/svg/messages-empty.svg'

// Mock notifications data
const mockNotifications: Notification[] = [
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

const notificationTabs = [
  { id: 'all', label: 'All', icon: Bell },
  { id: 'order', label: 'Orders', icon: ShoppingBag },
  { id: 'message', label: 'Messages', icon: MessageSquare },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'product', label: 'Products', icon: Package },
  { id: 'gift', label: 'Gifts', icon: Gift },
  { id: 'event', label: 'Events', icon: Calendar },
  { id: 'system', label: 'System', icon: CheckCircle2 },
] as const

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  // Filter notifications based on active tab
  const filteredNotifications =
    activeTab === 'all'
      ? notifications
      : notifications.filter(n => n.type === activeTab)

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length
  const filteredUnreadCount = filteredNotifications.filter(n => !n.isRead).length

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <UserPageLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-24 sm:text-32 font-normal text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-14 text-gray-600 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {filteredUnreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="text-14"
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 pb-2 min-w-max">
          {notificationTabs.map(tab => {
            const Icon = tab.icon
            const tabUnreadCount =
              tab.id === 'all'
                ? unreadCount
                : notifications.filter(n => n.type === tab.id && !n.isRead).length

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-14 font-noraml transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-brand-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tabUnreadCount > 0 && (
                  <Badge
                    variant="default"
                    className={cn(
                      'ml-1 min-w-[20px] h-5 flex items-center justify-center px-1.5 text-12',
                      activeTab === tab.id
                        ? 'bg-white/20 text-white border-white/30'
                        : 'bg-brand-500 text-white border-0'
                    )}
                  >
                    {tabUnreadCount}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          illustration={messagesEmptySvg}
          title="No notifications"
          description={
            activeTab === 'all'
              ? "You're all caught up! No notifications at the moment."
              : `You don't have any ${notificationTabs.find(t => t.id === activeTab)?.label.toLowerCase()} notifications.`
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(notification => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => markAsRead(notification.id)}
              onDelete={() => deleteNotification(notification.id)}
            />
          ))}
        </div>
      )}
    </UserPageLayout>
  )
}

