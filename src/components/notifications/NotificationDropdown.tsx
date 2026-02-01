'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/Popover'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { NotificationCard } from './NotificationCard'
import { cn } from '@/lib/utils'
import { Bell, Loader2 } from 'lucide-react'
import type { Notification } from '@/types/notification'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useI18nTranslations, useIsRTL } from '@/i18n/hooks'

export interface NotificationDropdownProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  onMarkAllAsRead?: () => void
  isLoading?: boolean
}

export const NotificationDropdown = ({
  notifications,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
  isLoading = false,
}: NotificationDropdownProps) => {
  const t = useI18nTranslations('notifications.dropdown')
  const isRTL = useIsRTL()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Get recent notifications (last 5)
  const recentNotifications = notifications.slice(0, 5)
  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id)
    }
    if (notification.actionUrl) {
      setIsOpen(false)
      router.push(notification.actionUrl)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'relative rounded-full border-0 bg-transparent',
            'transition-colors duration-150',
            'hover:bg-brand-50/50',
            'focus:outline-none'
          )}
          aria-label={t('ariaLabel')}
        >
          <Bell className="h-5 w-5 text-brand-500" />
          {unreadCount > 0 && (
            <span className={cn(
              "absolute flex min-w-[16px] h-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-semibold text-white shadow-sm px-1",
              isRTL ? "-left-1" : "-right-1",
              "-top-1"
            )}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={isRTL ? 'start' : 'end'}
        sideOffset={8}
        className={cn(
          "w-96 sm:w-[26rem] p-0 max-h-[37.5rem] flex flex-col",
          isRTL && "text-right"
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b border-gray-200",
          isRTL && "flex-row-reverse"
        )}>
          {isRTL && unreadCount > 0 && onMarkAllAsRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-12 text-brand-500 hover:text-brand-600"
            >
              {t('markAllRead')}
            </Button>
          )}
          <div className="flex items-center gap-2">
            <h3 className="text-18 font-normal text-gray-900">{t('title')}</h3>
            {unreadCount > 0 && (
              <Badge variant="default" className="bg-brand-500 text-white border-0">
                {unreadCount} {t('new')}
              </Badge>
            )}
          </div>
          {!isRTL && unreadCount > 0 && onMarkAllAsRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-12 text-brand-500 hover:text-brand-600"
            >
              {t('markAllRead')}
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <LoadingSpinner size="md" text={t('loading')} fullScreen={true}/>
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-14 text-gray-600 text-center">
                {t('noNotificationsYet')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentNotifications.map(notification => (
                <div
                  key={notification.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <NotificationCard
                    notification={notification}
                    onMarkAsRead={() => onMarkAsRead(notification.id)}
                    onDelete={() => onDelete(notification.id)}
                    compact={true}
                    showActions={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 5 && (
          <div className="p-3 border-t border-gray-200">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
            >
              {t('viewAll')}
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

