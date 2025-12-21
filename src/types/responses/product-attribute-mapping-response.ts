/**
 * Product Attribute Mapping Response
 */

export interface ProductAttributeMappingResponse {
  id: number
  productId: number
  productAttributeId: number
  productAttributeValueId: number | null
  nameAr: string | null
  nameEn: string | null
  name: string | null
  customValue: string | null
  numericValue: number | null // decimal?
  dateValue: string | null // ISO DateTime string
  descriptionAr: string | null
  descriptionEn: string | null
  sortOrder: number
  isVisible: boolean
  creationDate: string // ISO DateTime string
  lastModifiedDate: string | null // ISO DateTime string
}
