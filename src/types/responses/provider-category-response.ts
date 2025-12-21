/**
 * Provider Category Response
 */

export interface ProviderCategoryResponse {
  id: number
  providerId: number
  categoryId: number
  customName: string
  customDescription: string
  customImageUrl: string
  isActive: boolean
  displayOrder: number
  status: number // ProviderCategoryStatus enum
}
