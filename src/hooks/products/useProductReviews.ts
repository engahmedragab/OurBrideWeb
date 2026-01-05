import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProductReviews,
  submitProductReview,
} from '@/services/api/products.api'
import type { ProductReview } from '@/types/product'
import type { ReviewResponse } from '@/types/responses/review-response'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

/**
 * Map API review response to ProductReview type
 */
const mapReviewResponseToProductReview = (
  review: ReviewResponse
): ProductReview => ({
  id: String(review.id || ''),
  userId: review.userId || '',
  userName: review.title || 'Anonymous',
  userImage: '',
  rating: review.rate || 0,
  comment: review.comment || '',
  images: [],
  date: review.creationDate || '',
  verified: review.isVerified || false,
  helpful: review.likes || 0,
})

/**
 * Hook to fetch product reviews
 */
export const useProductReviews = (
  productId: number | null,
  params?: {
    page?: number
    pageSize?: number
  },
  enabled = true
) => {
  return useQuery({
    queryKey: ['product-reviews', productId, params],
    queryFn: async (): Promise<ProductReview[]> => {
      if (!productId) return []

      const response = await getProductReviews(productId, params)

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
        }
      }

      return reviews.map(mapReviewResponseToProductReview)
    },
    enabled: enabled && !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to submit product review
 */
export const useSubmitProductReview = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async ({
      productId,
      rating,
      review,
      title,
      reviewer,
      reviewerEmail,
      isAnonymous,
    }: {
      productId: number
      rating: number
      review: string
      title?: string
      reviewer?: string
      reviewerEmail?: string
      isAnonymous?: boolean
    }) => {
      return await submitProductReview(productId, {
        productId,
        rating,
        review,
        title,
        reviewer,
        reviewerEmail,
        isAnonymous,
      })
    },
    onSuccess: (response, variables) => {
      // Invalidate and refetch product reviews
      queryClient.invalidateQueries({
        queryKey: ['product-reviews', variables.productId],
      })
      // Also invalidate product details to update rating
      queryClient.invalidateQueries({
        queryKey: ['product', variables.productId],
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
