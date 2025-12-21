/**
 * Product Attribute Value Response
 */

export interface ProductAttributeValueResponse {
  id: number
  productAttributeId: number
  nameAr: string | null
  nameEn: string | null
  name: string | null
  value: string | null
  displayValue: string | null
  descriptionAr: string | null
  descriptionEn: string | null
  color: string | null
  imageUrl: string | null
  sortOrder: number
  isActive: boolean
  creationDate: string // ISO DateTime string
  lastModifiedDate: string | null // ISO DateTime string
}
