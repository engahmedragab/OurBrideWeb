'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import {
  ShoppingBag,
  MessageSquare,
  Users,
  Package,
  Gift,
  Calendar,
  CheckCircle2,
  Bell,
  X,
  ExternalLink,
} from 'lucide-react'
import type { Notification, NotificationType } from '@/types/notification'
import { useI18nTranslations } from '@/i18n/hooks'

export interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: () => void
  onDelete: () => void
  compact?: boolean
  showActions?: boolean
}

const getNotificationIcon = (type: NotificationType) => {
  const iconClass = 'h-5 w-5'
  switch (type) {
    case 'order':
      return <ShoppingBag className={iconClass} />
    case 'message':
      return <MessageSquare className={iconClass} />
    case 'community':
      return <Users className={iconClass} />
    case 'product':
      return <Package className={iconClass} />
    case 'gift':
      return <Gift className={iconClass} />
    case 'event':
      return <Calendar className={iconClass} />
    case 'system':
      return <CheckCircle2 className={iconClass} />
    default:
      return <Bell className={iconClass} />
  }
}

const getNotificationIconColor = (type: NotificationType) => {
  switch (type) {
    case 'order':
      return 'bg-blue-100 text-blue-600'
    case 'message':
      return 'bg-purple-100 text-purple-600'
    case 'community':
      return 'bg-green-100 text-green-600'
    case 'product':
      return 'bg-orange-100 text-orange-600'
    case 'gift':
      return 'bg-pink-100 text-pink-600'
    case 'event':
      return 'bg-indigo-100 text-indigo-600'
    case 'system':
      return 'bg-gray-100 text-gray-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
  compact = false,
  showActions = true,
}: NotificationCardProps) => {
  const t = useI18nTranslations('notifications')
  const [isHovered, setIsHovered] = useState(false)

  const handleCardClick = () => {
    if (!notification.isRead) {
      onMarkAsRead()
    }
  }

  const cardContent = (
    <div
      className={cn(
        'bg-white transition-all cursor-pointer',
        compact ? 'p-3' : 'rounded-xl border p-4 sm:p-5',
        !compact && 'hover:shadow-md hover:border-gray-300',
        !notification.isRead && !compact && 'border-brand-200 bg-brand-50/30',
        !notification.isRead && compact && 'bg-brand-50/30',
        notification.isRead && !compact && 'border-gray-200'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="flex gap-4">
        {/* Icon/Image */}
        <div className="flex-shrink-0">
          {notification.imageUrl ? (
            <div className={cn('relative rounded-full overflow-hidden bg-gray-100', compact ? 'w-10 h-10' : 'w-12 h-12')}>
              <Image
                src={notification.imageUrl}
                alt={notification.title}
                fill
                sizes={compact ? "40px" : "48px"}
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className={cn(
                'rounded-full flex items-center justify-center',
                compact ? 'w-10 h-10' : 'w-12 h-12',
                getNotificationIconColor(notification.type)
              )}
            >
              {getNotificationIcon(notification.type)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className={cn(
                    'text-16 font-normal text-gray-900',
                    !notification.isRead && 'font-normal'
                  )}
                >
                  {notification.title}
                </h3>
                {!notification.isRead && (
                  <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                )}
              </div>
              <p className={cn('text-gray-600 mb-2', compact ? 'text-13 line-clamp-1' : 'text-14 line-clamp-2')}>
                {notification.message}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-16 font-normal text-gray-500">{notification.timestamp}</span>
                {notification.actionUrl && !compact && (
                  <span className="text-12 text-brand-500 font-medium flex items-center gap-1">
                    {t('card.view')}
                    <ExternalLink className="h-3 w-3" />
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div
                className={cn(
                  'flex items-center gap-1 transition-opacity',
                  isHovered ? 'opacity-100' : 'opacity-0'
                )}
                onClick={e => e.stopPropagation()}
              >
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onMarkAsRead}
                    title={t('card.markAsRead')}
                  >
                    <CheckCircle2 className="h-4 w-4 text-gray-600" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onDelete}
                  title={t('card.delete')}
                >
                  <X className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // If there's an action URL and not compact, wrap in Link, otherwise return as is
  if (notification.actionUrl && !compact) {
    return (
      <Link href={notification.actionUrl} className="block">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}

