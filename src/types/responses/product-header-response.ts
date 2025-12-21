/**
 * Product Header Response
 */

import type { ProviderInfoResponse } from './provider-info-response'
import type { Visibility } from '@/types/responses/common'
import type { ProviderProductAttributeResponse } from './provider-product-attribute-response'
import type { ProviderProductTagResponse } from './provider-product-tag-response'
import type { ProviderCategoryResponse } from './provider-category-response'
import type { ProviderSubCategoryResponse } from './provider-sub-category-response'
import type { SkuConflictInfo } from './sku-conflict-info'

export interface ProductHeaderResponse {
  id: number
  nameAr: string
  nameEn: string
  name: string
  bioAr: string
  bioEn: string
  bio: string
  slug: string
  isActive: boolean
  rate: string
  ratingCount: number | null
  likes: number | null
  url: string
  price: number | null
  amount: number | null
  stockQuantity: number | null
  productId: number
  sku: string
  shortDescriptionAr: string
  shortDescriptionEn: string
  shortDescription: string
  isFeatured: boolean
  published: boolean
  visibility: Visibility
  buttonText: string
  youtubeUrl: string
  image: string
  hasDiscount: boolean
  discountDateStart: string | null // ISO DateTime string
  discountDateEnd: string | null // ISO DateTime string
  isTaagerProduct: boolean | null
  inStock: boolean
  tags: string
  attributes: string
  categories: string
  categoryId: number
  subCategoryId: number
  providerId: number | null
  provider: ProviderInfoResponse | null
  providerProductAttributes: ProviderProductAttributeResponse[]
  providerProductTags: ProviderProductTagResponse[]
  providerCategories: ProviderCategoryResponse[]
  providerSubCategories: ProviderSubCategoryResponse[]
  regularPrice: number | null
  salePrice: number | null
  dateOnSaleFrom: string | null // ISO DateTime string
  dateOnSaleFromGmt: string | null // ISO DateTime string
  dateOnSaleTo: string | null // ISO DateTime string
  dateOnSaleToGmt: string | null // ISO DateTime string
  priceHtml: string
  onSale: boolean | null
  purchasable: boolean | null
  totalSales: number | null
  conflictInfo: SkuConflictInfo | null
}
