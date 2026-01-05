import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getServiceReviews,
  submitServiceReview,
} from '@/services/api/serviceApi'
import type { ReviewResponse } from '@/types/responses/review-response'
import type { ReviewRequest } from '@/../client/common/api/gen/ourbride-api'
import { Source } from '@/../client/common/api/gen/ourbride-api'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

export interface ServiceReview {
  id: string
  userId: string
  userName: string
  userImage?: string
  rating: number
  comment: string
  date: string
  verified: boolean
  helpful: number
}

/**
 * Map API review response to ServiceReview type
 */
const mapReviewResponseToServiceReview = (
  review: ReviewResponse
): ServiceReview => ({
  id: String(review.id || ''),
  userId: review.userId || '',
  userName: review.title || 'Anonymous',
  userImage:
    ((review as unknown as Record<string, unknown>).userImage as
      | string
      | undefined) || '',
  rating: review.rate || 0,
  comment: review.comment || '',
  date: review.creationDate || '',
  verified: review.isVerified || false,
  helpful: review.likes || 0,
})

/**
 * Hook to fetch service reviews
 */
export const useServiceReviews = (
  serviceId: number | string | null,
  params?: {
    page?: number
    pageSize?: number
    rating?: number
    sortBy?: string
  },
  enabled = true
) => {
  const id = typeof serviceId === 'string' ? parseInt(serviceId, 10) : serviceId

  return useQuery({
    queryKey: ['service-reviews', id, params],
    queryFn: async (): Promise<ServiceReview[]> => {
      if (!id || isNaN(id)) return []

      const response = await getServiceReviews(id, {
        Page: params?.page,
        PageSize: params?.pageSize,
        Rating: params?.rating,
        SortBy: params?.sortBy,
      })

      // Handle different response structures
      const responseData = response as unknown as Record<string, unknown>
      let reviews: ReviewResponse[] = []

      if (Array.isArray(responseData)) {
        reviews = responseData as ReviewResponse[]
      } else if (responseData && typeof responseData === 'object') {
        if ('data' in responseData && Array.isArray(responseData.data)) {
          reviews = responseData.data as ReviewResponse[]
        } else if (
          'reviews' in responseData &&
          Array.isArray(responseData.reviews)
        ) {
          reviews = responseData.reviews as ReviewResponse[]
        } else if (
          'items' in responseData &&
          Array.isArray(responseData.items)
        ) {
          reviews = responseData.items as ReviewResponse[]
        } else if (
          'results' in responseData &&
          Array.isArray(responseData.results)
        ) {
          reviews = responseData.results as ReviewResponse[]
        }
      }

      return reviews.map(mapReviewResponseToServiceReview)
    },
    enabled: enabled && !!id && !isNaN(id),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to submit service review
 * POST /api/v1/services/review/{serviceId}
 */
export const useSubmitServiceReview = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async ({
      serviceId,
      rating,
      review,
      title,
      providerId,
      branchId,
      staffId,
    }: {
      serviceId: number
      rating: number
      review: string
      title?: string
      providerId?: number | null
      branchId?: number | null
      staffId?: string | null
    }) => {
      const reviewRequest: ReviewRequest = {
        sourceId: serviceId,
        source: Source.User, // User is the source for reviews submitted by users
        providerId: providerId || null,
        branchId: branchId || null,
        staffId: staffId || null,
        rating: rating,
        reviewText: review,
        title: title || null,
        isPublic: true, // Make review public by default
        allowComments: true, // Allow comments on review
      }
      return await submitServiceReview(serviceId, reviewRequest)
    },
    onSuccess: (response, variables) => {
      // Invalidate and refetch service reviews
      queryClient.invalidateQueries({
        queryKey: ['service-reviews', variables.serviceId],
      })
      // Also invalidate service details to update rating
      queryClient.invalidateQueries({
        queryKey: ['service-detail', String(variables.serviceId)],
      })

      const { message, type } = handleApiResponseForToast(
        response,
        'Review submitted successfully',
        'Failed to submit review'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to submit review'
      addToast(errorMessage, 'error')
    },
  })
}
