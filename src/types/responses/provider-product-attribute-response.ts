/**
 * Provider Product Attribute Response
 */

export interface ProviderProductAttributeResponse {
  id: number
  providerId: number
  productAttributeId: number
  customName: string
  customDescription: string
  isActive: boolean
  isRequired: boolean
  displayOrder: number
  status: number // ProviderProductAttributeStatus enum
}
