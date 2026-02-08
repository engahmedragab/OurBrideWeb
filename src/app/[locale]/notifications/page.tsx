'use client'

import { useState, useMemo, useEffect } from 'react'
import { UserPageLayout } from '@/components/layout'
import { EmptyState, Button, Badge } from '@/components/ui'
import { NotificationCard } from '@/components/notifications/NotificationCard'
import { useNotifications } from '@/hooks/notifications/useNotifications'
import { cn } from '@/lib/utils'
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
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import messagesEmptySvg from '@/assets/svg/messages-empty.svg'
import type { Notification } from '@/types/notification'
import { useI18nTranslations } from '@/i18n/hooks'

const PAGE_SIZE = 10

export default function NotificationsPage() {
  const t = useI18nTranslations('notifications')
  const tCommon = useI18nTranslations('common')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch by only rendering content after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Notification tabs with translations
  // Always use translations - they should be available on both server and client
  const notificationTabs = useMemo(() => [
    { id: 'all', label: t('tabs.all'), icon: Bell },
    { id: 'order', label: t('tabs.order'), icon: ShoppingBag },
    { id: 'message', label: t('tabs.message'), icon: MessageSquare },
    { id: 'community', label: t('tabs.community'), icon: Users },
    { id: 'product', label: t('tabs.product'), icon: Package },
    { id: 'gift', label: t('tabs.gift'), icon: Gift },
    { id: 'event', label: t('tabs.event'), icon: Calendar },
    { id: 'system', label: t('tabs.system'), icon: CheckCircle2 },
  ] as const, [t])

  // Fetch notifications from API
  const {
    notifications,
    unreadCount,
    isLoading,
    isError,
    error,
    totalCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications({
    page: currentPage,
    pageSize: PAGE_SIZE,
    enabled: true,
  })

  // Filter notifications based on active tab
  const filteredNotifications = useMemo(
    () =>
    activeTab === 'all'
      ? notifications
        : notifications.filter((n: Notification) => n.type === activeTab),
    [notifications, activeTab]
  )

  // Count unread notifications for filtered view
  const filteredUnreadCount = useMemo(
    () => filteredNotifications.filter((n: Notification) => !n.isRead).length,
    [filteredNotifications]
  )

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Handle tab change - reset to page 1
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setCurrentPage(1)
  }

  // Handle mark all as read for filtered notifications
  const handleMarkAllAsRead = () => {
    if (activeTab === 'all') {
      markAllAsRead()
    } else {
      // Mark all unread notifications in the filtered list as read
      filteredNotifications
        .filter((n: Notification) => !n.isRead)
        .forEach((n: Notification) => markAsRead(n.id))
    }
  }

  // Don't render content until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <UserPageLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading..." fullScreen={true} />
        </div>
      </UserPageLayout>
    )
  }

  // Loading state
  if (isLoading && currentPage === 1) {
    return (
      <UserPageLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text={t('loading.title')} fullScreen={true} />
        </div>
      </UserPageLayout>
    )
  }

  // Error state - errors are shown in toasts, but we can show a retry option
  if (isError && notifications.length === 0) {
    return (
      <UserPageLayout>
        <div className="text-center py-12">
          <p className="text-16 text-gray-600 mb-4">
            {t('error.title')} {t('error.message')}
          </p>
          <Button onClick={() => window.location.reload()}>{t('error.retry')}</Button>
        </div>
      </UserPageLayout>
    )
  }

  return (
    <UserPageLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-24 sm:text-32 font-normal text-gray-900">{t('title')}</h1>
          {unreadCount > 0 && (
            <p className="text-14 text-gray-600 mt-1">
              {unreadCount === 1 
                ? t('header.unread', { count: unreadCount })
                : t('header.unreadPlural', { count: unreadCount })}
            </p>
          )}
        </div>
        {filteredUnreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-14"
          >
            {t('header.markAllAsRead')}
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
                : notifications.filter((n: Notification) => n.type === tab.id && !n.isRead).length

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-14 font-normal transition-colors whitespace-nowrap',
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
      {isLoading && currentPage > 1 ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="md" text={t('loading.more')} fullScreen={true} />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          illustration={messagesEmptySvg}
          title={t('empty.title')}
          actionLabel={tCommon('startShopping')}
          description={
            activeTab === 'all'
              ? t('empty.description.all')
              : t('empty.description.other', { type: notificationTabs.find(tab => tab.id === activeTab)?.label.toLowerCase() || '' })
          }
        />
      ) : (
        <>
        <div className="space-y-3">
          {filteredNotifications.map((notification: Notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => markAsRead(notification.id)}
              onDelete={() => deleteNotification(notification.id)}
            />
          ))}
        </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isLoading}
                className="text-14"
              >
                {t('pagination.previous')}
              </Button>
              <span className="text-14 text-gray-600">
                {t('pagination.page', { current: currentPage, total: totalPages })}
                {isLoading && <span className="ml-2 text-gray-400">{t('pagination.loading')}</span>}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || isLoading}
                className="text-14"
              >
                {t('pagination.next')}
              </Button>
            </div>
          )}
        </>
      )}
    </UserPageLayout>
  )
}
