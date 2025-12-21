/**
 * Product Review Response
 */

export interface ProductReviewResponse {
  id: number | null
  dateCreated: string | null // ISO DateTime string
  dateCreatedGmt: string | null // ISO DateTime string
  productId: number | null
  status: string | null
  reviewer: string | null
  reviewerEmail: string | null
  review: string | null
  rating: number | null
  verified: boolean | null
}
