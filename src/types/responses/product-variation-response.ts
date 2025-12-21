/**
 * Product Variation Response
 */

export interface ProductVariationResponse {
  id: number
  productId: number
  productName: string | null
  sku: string | null
  name: string | null
  description: string | null
  price: number | null // decimal?
  regularPrice: number | null // decimal?
  salePrice: number | null // decimal?
  isActive: boolean
  inStock: boolean
  stockQuantity: number | null
  stockStatus: string | null
  manageStock: boolean
  attributes: string | null
  wooCommerceId: number | null
  needsSync: boolean
  creationDate: string // ISO DateTime string
  lastModifiedDate: string | null // ISO DateTime string
  createdBy: string | null // Guid?
  updatedBy: string | null // Guid?
}
