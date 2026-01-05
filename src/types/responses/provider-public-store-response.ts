/**
 * Provider Public Store Response
 */

import type { AddressResponse } from './address-response'
import type { LinkResponse } from './link-response'
import type { MediaResponse } from './media-response'
import type { ProductResponse } from './product-response'
import type { ProviderCategoryResponse } from './provider-category-response'
import type { ProviderProductAttributeResponse } from './provider-product-attribute-response'
import type { ProviderProductTagResponse } from './provider-product-tag-response'
import type { ProviderProductBrandResponse } from './provider-product-brand-response'
import type { ProviderShippingMethodResponse } from './provider-shipping-method-response'
import type { MembershipPlanResponse } from './membership-plan-response'
import type { GiftCardTemplateResponse } from './gift-card-template-response'

export interface ProviderPublicStoreResponse {
  providerId: number
  providerNameAr: string | null
  providerNameEn: string | null
  providerDescriptionAr: string | null
  providerDescriptionEn: string | null
  providerPhoneNumber: string | null
  providerShortAddress: string | null
  providerProfileURL: string | null
  providerPublicProfileSlug: string | null
  providerUniqueCode: string | null
  providerQRCodeData: string | null
  providerIsVerified: boolean
  providerRate: number | null
  providerPublicBannerImageUrl: string | null
  providerPublicLogoImageUrl: string | null
  providerAddress: AddressResponse | null
  providerLinks: LinkResponse[]
  providerMedia: MediaResponse[]
  products: ProductResponse[]
  totalProducts: number
  totalProductsInStock: number
  totalProductsOnSale: number
  productsByCategory: { [key: string]: number }
  providerCategories: ProviderCategoryResponse[]
  providerProductAttributes: ProviderProductAttributeResponse[]
  providerProductTags: ProviderProductTagResponse[]
  providerProductBrands: ProviderProductBrandResponse[]
  providerShippingMethods: ProviderShippingMethodResponse[]
  memberships: MembershipPlanResponse[]
  giftCards: GiftCardTemplateResponse[]
  totalViews: number
  totalFollowers: number
}
