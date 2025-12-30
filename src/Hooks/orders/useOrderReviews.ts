import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOrderReviews,
  getOrderReviewById,
  submitOrderReview,
  updateOrderReview,
  deleteOrderReview,
} from '@/services/api/orderApi'
import type { ReviewResponse } from '@/types/responses'
import type { CreateOrderReviewRequest } from '@/../client/common/api/gen/ourbride-api'

/**
 * Hook to fetch order reviews
 */
export const useOrderReviews = (orderId: number | null, enabled: boolean = true) => {
  return useQuery<ReviewResponse[]>({
    queryKey: ['order', orderId, 'reviews'],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required')
      return await getOrderReviews(orderId)
    },
    enabled: enabled && !!orderId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to fetch a single order review by ID
 */
export const useOrderReview = (reviewId: number | null, enabled: boolean = true) => {
  return useQuery<ReviewResponse>({
    queryKey: ['order-review', reviewId],
    queryFn: async () => {
      if (!reviewId) throw new Error('Review ID is required')
      return await getOrderReviewById(reviewId)
    },
    enabled: enabled && !!reviewId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to submit a new order review
 */
export const useSubmitOrderReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      data,
    }: {
      orderId: number
      data: CreateOrderReviewRequest
    }) => {
      return await submitOrderReview(orderId, data)
    },
    onSuccess: (_, variables) => {
      // Invalidate order reviews list
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId, 'reviews'] })
      // Invalidate order details to refresh review count
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
    },
  })
}

/**
 * Hook to update an existing order review
 */
export const useUpdateOrderReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      reviewId,
      data,
    }: {
      reviewId: number
      data: CreateOrderReviewRequest
    }) => {
      return await updateOrderReview(reviewId, data)
    },
    onSuccess: (review) => {
      // Invalidate review queries
      queryClient.invalidateQueries({ queryKey: ['order-review', review.id] })
      // Invalidate order reviews list (we need orderId from review, but it's not in ReviewResponse)
      // So we'll invalidate all order reviews
      queryClient.invalidateQueries({ queryKey: ['order', 'reviews'] })
    },
  })
}

/**
 * Hook to delete an order review
 */
export const useDeleteOrderReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (reviewId: number) => {
      await deleteOrderReview(reviewId)
    },
    onSuccess: () => {
      // Invalidate all order reviews
      queryClient.invalidateQueries({ queryKey: ['order', 'reviews'] })
      queryClient.invalidateQueries({ queryKey: ['order-review'] })
    },
  })
}


