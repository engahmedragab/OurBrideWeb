/**
 * Provider Sub Category Response
 */

export interface ProviderSubCategoryResponse {
  id: number
  providerId: number
  subCategoryId: number
  providerCategoryId: number
  customName: string
  customDescription: string
  customImageUrl: string
  isActive: boolean
  displayOrder: number
  status: number // ProviderSubCategoryStatus enum
}
