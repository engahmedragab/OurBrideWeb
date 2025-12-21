/**
 * Product Brand Response
 */

export interface ProductBrandResponse {
  id: number
  wooCommerceId: number | null
  nameAr: string | null
  nameEn: string | null
  name: string | null // Computed property from nameAr/nameEn
  descriptionAr: string | null
  descriptionEn: string | null
  description: string | null // Computed property from descriptionAr/descriptionEn
  brand: string | null
  slug: string | null
  count: number | null
  isActive: boolean
  creationDate: string | null // ISO DateTime string
  lastModifiedDate: string | null // ISO DateTime string
}
