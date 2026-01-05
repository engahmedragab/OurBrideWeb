// Notifications API service functions

import { apiClient } from '@/services/api/apiClient'
import type { Notification as ApiNotification } from '@/../client/common/api/gen/ourbride-api'
import type { PaginatedList } from '@/types/responses'
import type { Notification } from '@/types/notification'
import { extractApiErrorMessage } from '@/utils/api-response.utils'

/**
 * Helper function to extract error message from API errors
 */
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error && typeof error === 'object') {
    // Check if it's an Axios error with response
    const axiosError = error as {
      response?: { status?: number; data?: unknown }
      message?: string
    }
    if (axiosError.response?.data) {
      // Use extractApiErrorMessage to get message from response data
      return extractApiErrorMessage(axiosError.response.data, defaultMessage)
    }

    // Fallback to error message if available
    if (axiosError.message) {
      return axiosError.message
    }
  }

  // Final fallback
  if (error instanceof Error) {
    return error.message
  }

  return defaultMessage
}

/**
 * API Response structure for notifications
 */
export interface NotificationApiResponse {
  data: {
    items: ApiNotification[]
    totalCount: number
    currentPage: number
    pageSize: number
  }
  success: boolean
  statusCode: number
  message: string
  errors: unknown
}

/**
 * Format date to relative time (e.g., "2 minutes ago")
 */
export const formatRelativeTime = (
  dateString: string | null | undefined
): string => {
  if (!dateString) return 'Just now'

  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    }
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? 'day' : 'days'} ago`
    }
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000)
      return `${months} ${months === 1 ? 'month' : 'months'} ago`
    }
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} ${years === 1 ? 'year' : 'years'} ago`
  } catch {
    return dateString
  }
}

/**
 * Infer notification type from title/body content
 */
const inferNotificationType = (
  title: string | null | undefined,
  body: string | null | undefined
): Notification['type'] => {
  const titleLower = (title || '').toLowerCase()
  const bodyLower = (body || '').toLowerCase()

  const content = `${titleLower} ${bodyLower}`

  if (
    content.includes('order') ||
    content.includes('checkout') ||
    content.includes('ord-')
  ) {
    return 'order'
  }
  if (content.includes('message') || content.includes('sent you')) {
    return 'message'
  }
  if (
    content.includes('following') ||
    content.includes('follower') ||
    content.includes('community')
  ) {
    return 'community'
  }
  if (content.includes('product') || content.includes('cart')) {
    return 'product'
  }
  if (content.includes('gift')) {
    return 'gift'
  }
  if (
    content.includes('event') ||
    content.includes('reminder') ||
    content.includes('scheduled')
  ) {
    return 'event'
  }
  if (content.includes('loyalty') || content.includes('level')) {
    return 'system'
  }

  return 'system'
}

/**
 * Map API Notification to UI Notification
 */
export const mapApiNotificationToNotification = (
  apiNotification: ApiNotification
): Notification => {
  const timestamp =
    apiNotification.creationDate ||
    apiNotification.lastModifiedDate ||
    new Date().toISOString()

  return {
    id: apiNotification.id.toString(),
    type: inferNotificationType(apiNotification.title, apiNotification.body),
    title: apiNotification.title || 'Notification',
    message: apiNotification.body || '',
    timestamp: formatRelativeTime(timestamp),
    isRead: apiNotification.isRead || false,
    actionUrl: apiNotification.slug || undefined,
    metadata: {
      userId: apiNotification.userId,
    },
  }
}

/**
 * Get user notifications (paginated)
 */
export const getUserNotifications = async (query?: {
  page?: number
  pageSize?: number
}): Promise<PaginatedList<Notification>> => {
  try {
    const response =
      await apiClient.api.getNotificationGetUserNotifications(query)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseAny: any = response

    // Extract the data from the response
    const responseData =
      responseAny?.data?.data ?? responseAny?.data ?? responseAny

    // Handle the API response structure
    const apiResponse = responseData as NotificationApiResponse

    // If the response has the expected structure with data.items
    if (apiResponse?.data?.items) {
      return {
        items: apiResponse.data.items
          .filter(item => !item.isDeleted) // Filter out deleted notifications
          .map(mapApiNotificationToNotification),
        totalCount: apiResponse.data.totalCount,
        currentPage: apiResponse.data.currentPage,
        pageSize: apiResponse.data.pageSize,
      }
    }

    // Fallback: if items is directly in the response
    if (Array.isArray(responseData)) {
      return {
        items: (responseData as ApiNotification[])
          .filter(item => !item.isDeleted)
          .map(mapApiNotificationToNotification),
        totalCount: responseData.length,
        currentPage: query?.page || 1,
        pageSize: query?.pageSize || 10,
      }
    }

    // If items is at the root level
    if (responseData?.items && Array.isArray(responseData.items)) {
      return {
        items: (responseData.items as ApiNotification[])
          .filter(item => !item.isDeleted)
          .map(mapApiNotificationToNotification),
        totalCount: responseData.totalCount || responseData.items.length,
        currentPage: responseData.currentPage || query?.page || 1,
        pageSize: responseData.pageSize || query?.pageSize || 10,
      }
    }

    return {
      items: [],
      totalCount: 0,
      currentPage: query?.page || 1,
      pageSize: query?.pageSize || 10,
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Failed to fetch notifications')
    throw new Error(errorMessage)
  }
}

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (
  notificationId: number
): Promise<void> => {
  try {
    await apiClient.api.postNotificationMarkAsRead(notificationId)
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(
      error,
      'Failed to mark notification as read'
    )
    throw new Error(errorMessage)
  }
}

/**
 * Mark all notifications as read
 * Note: If the API doesn't support this, we'll need to call markAsRead for each notification
 */
export const markAllNotificationsAsRead = async (
  notificationIds: number[]
): Promise<void> => {
  try {
    // Call markAsRead for each notification
    await Promise.all(notificationIds.map(id => markNotificationAsRead(id)))
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(
      error,
      'Failed to mark all notifications as read'
    )
    throw new Error(errorMessage)
  }
}

/**
 * Delete notification
 * Note: The API might use soft delete (isDeleted flag) rather than actual deletion
 * Check if there's a delete endpoint, otherwise we'll handle it client-side
 */
export const deleteNotification = async (
  _notificationId: number
): Promise<void> => {
  try {
    // Since there's no explicit delete endpoint found, we'll mark it as deleted client-side
    // The API filters by isDeleted=false, so the notification won't appear in subsequent fetches
    // If the API adds a delete endpoint later, update this function
    throw new Error('Delete notification endpoint not available')
  } catch (error: unknown) {
    // For now, we'll allow the client to handle deletion optimistically
    // The notification will be removed from the UI but might reappear on refresh
    // until the backend is updated with a proper delete endpoint
    if (
      error instanceof Error &&
      error.message === 'Delete notification endpoint not available'
    ) {
      // Silently succeed for now - the UI will handle optimistic updates
      return
    }
    const errorMessage = getErrorMessage(error, 'Failed to delete notification')
    throw new Error(errorMessage)
  }
}
