/**
 * Provider Product Tag Response
 */

export interface ProviderProductTagResponse {
  id: number
  providerId: number
  productTagId: number
  customName: string
  customDescription: string
  customColor: string
  customIcon: string
  isActive: boolean
  displayOrder: number
  status: number // ProviderProductTagStatus enum
}
