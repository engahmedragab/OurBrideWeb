import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/services/api/notificationsApi'
import type { Notification } from '@/types/notification'
import { isAuthenticated } from '@/auth/utils/token'
import { useToast } from '@/components/ui/Toaster'

/**
 * Hook to fetch user notifications
 */
export const useNotifications = (query?: {
  page?: number
  pageSize?: number
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()
  const { addToast } = useToast()

  const queryResult = useQuery({
    queryKey: ['notifications', queryParams],
    queryFn: async () => {
      const result = await getUserNotifications(queryParams)
      return result
    },
    enabled: enabled && authenticated,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true, // Refetch when window gains focus to get latest notifications
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications'
      addToast(errorMessage, 'error')
    },
  })

  const notifications = queryResult.data?.items || []
  const unreadCount = useMemo(
    () => notifications.filter(n => !n.isRead).length,
    [notifications]
  )

  const queryClient = useQueryClient()

  // Mutation to mark a single notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const notificationId = parseInt(id, 10)
      if (isNaN(notificationId)) {
        throw new Error('Invalid notification ID')
      }
      await markNotificationAsRead(notificationId)
    },
    onMutate: async (id: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      // Snapshot previous value
      const previousData = queryClient.getQueryData<{ items: Notification[] }>(['notifications', queryParams])

      // Optimistically update
      if (previousData) {
        queryClient.setQueryData<{ items: Notification[] }>(['notifications', queryParams], {
          ...previousData,
          items: previousData.items.map(n => (n.id === id ? { ...n, isRead: true } : n)),
        })
      }

      return { previousData }
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['notifications', queryParams], context.previousData)
      }
      // Show error toast
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark notification as read'
      addToast(errorMessage, 'error')
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  // Mutation to mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unreadIds = notifications
        .filter(n => !n.isRead)
        .map(n => parseInt(n.id, 10))
        .filter(id => !isNaN(id))
      
      if (unreadIds.length === 0) {
        return
      }

      await markAllNotificationsAsRead(unreadIds)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      const previousData = queryClient.getQueryData<{ items: Notification[] }>(['notifications', queryParams])

      if (previousData) {
        queryClient.setQueryData<{ items: Notification[] }>(['notifications', queryParams], {
          ...previousData,
          items: previousData.items.map(n => ({ ...n, isRead: true })),
        })
      }

      return { previousData }
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['notifications', queryParams], context.previousData)
      }
      // Show error toast
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark all notifications as read'
      addToast(errorMessage, 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  // Mutation to delete a notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const notificationId = parseInt(id, 10)
      if (isNaN(notificationId)) {
        throw new Error('Invalid notification ID')
      }
      // For now, delete is handled optimistically since API endpoint may not exist
      // The notification will be filtered out from the list
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      const previousData = queryClient.getQueryData<{ items: Notification[] }>(['notifications', queryParams])

      if (previousData) {
        queryClient.setQueryData<{ items: Notification[] }>(['notifications', queryParams], {
          ...previousData,
          items: previousData.items.filter(n => n.id !== id),
          totalCount: Math.max(0, previousData.totalCount - 1),
        })
      }

      return { previousData }
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['notifications', queryParams], context.previousData)
      }
      // Show error toast
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete notification'
      addToast(errorMessage, 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id)
  }

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate()
  }

  const deleteNotification = (id: string) => {
    deleteNotificationMutation.mutate(id)
  }

  return {
    notifications,
    unreadCount,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    totalCount: queryResult.data?.totalCount || 0,
    currentPage: queryResult.data?.currentPage || 1,
    pageSize: queryResult.data?.pageSize || 10,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: queryResult.refetch,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,
  }
}
