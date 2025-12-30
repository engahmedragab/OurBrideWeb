/**
 * Product Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type {
  Visibility,
  DiscountType,
  TaxStatus,
  TaxClass,
  ShippingClass,
  SourceOfTruth,

} from '@/../client/common/api/gen/ourbride-api'
import type {
  ProductAttributeResponse,
  ItemResponse,
  ProductAnalyticsResponse,
  InventoryResponse,
  ProductBrandResponse,
  ProviderProductBrandResponse,
} from '@/types/responses'
import type { ReviewResponse } from './review-response'
import type { MediaResponse } from './media-response'
import type { ProductInformationResponse } from './product-information-response'
import type { ProductTagResponse } from './product-tag-response'

import type { CategoryResponse } from './category-response'
import type { SubCategoryResponse } from './sub-category-response'
import type { ProviderInfoResponse } from './provider-info-response'
import type { ProviderProductAttributeResponse } from './provider-product-attribute-response'
import type { ProviderProductTagResponse } from './provider-product-tag-response'
import type { ProviderCategoryResponse } from './provider-category-response'
import type { ProviderSubCategoryResponse } from './provider-sub-category-response'
import type { ProductErrorResponse } from './product-error-response'

export interface ProductResponse extends BaseLookupResponse {
  // Note: id, isDeleted, creationDate, lastModifiedDate, slug, nameAr, nameEn, descriptionAr, descriptionEn come from BaseLookupResponse

  // Basic Information
  name: string // Computed property from nameAr/nameEn
  bio: string
  shortDescriptionAr: string | null
  shortDescriptionEn: string | null
  isActive: boolean
  isFeatured: boolean
  published: boolean
  visibility: Visibility
  permalink: string | null

  // Product Identification
  productId: number
  sku: string | null
  externalId: string | null
  externalHandle: string | null
  externalApiId: string | null
  parentProductId: number | null
  parentId: number | null // ulong?

  // Pricing
  price: number | null
  amount: number | null
  salePrice: number | null
  regularPrice: number | null
  hasDiscount: boolean
  discountType: DiscountType | null
  discountDateStart: string | null // ISO DateTime string
  discountDateEnd: string | null // ISO DateTime string
  flashSaleStartDate: string | null // ISO DateTime string
  flashSaleEndDate: string | null // ISO DateTime string
  onSale: boolean | null
  purchasable: boolean | null
  priceHtml: string | null
  dateOnSaleFrom: string | null // ISO DateTime string
  dateOnSaleFromGmt: string | null // ISO DateTime string
  dateOnSaleTo: string | null // ISO DateTime string
  dateOnSaleToGmt: string | null // ISO DateTime string

  // Ratings and Reviews
  rate: number | null
  likes: number | null
  allowCustomerReviews: boolean | null
  reviewsAllowed: boolean | null
  averageRating: string | null
  ratingCount: number | null
  reviews: ReviewResponse[] | null

  // Media
  image: string | null
  youtubeUrl: string | null
  images: MediaResponse[] | null
  medias: MediaResponse[] | null

  // Product Information
  specifications: string | null
  buttonText: string | null
  url: string | null
  productInformations: ProductInformationResponse[] | null

  // Stock Management
  inStock: boolean
  stock: number | null
  stockQuantity: number | null
  lowStockAmount: number | null
  backordersAllowed: boolean | null
  soldIndividually: boolean | null
  manageStock: boolean | null
  stockStatus: string | null
  backorders: boolean | null
  backordered: boolean | null

  // Physical Properties
  weight: number | null
  length: number | null
  width: number | null
  height: number | null

  // Tax and Shipping
  taxStatus: TaxStatus
  taxClass: TaxClass
  shippingClass: ShippingClass
  shippingRequired: boolean | null
  shippingTaxable: boolean | null
  shippingClassId: number | null

  // Digital Properties
  virtual: boolean | null
  downloadable: boolean | null
  downloadLimit: number | null
  downloadExpiry: number | null
  externalUrl: string | null

  // WooCommerce Properties
  type: string | null
  status: string | null
  featured: boolean | null
  catalogVisibility: string | null
  description: string | null
  shortDescription: string | null
  enableHtmlDescription: boolean | null
  enableHtmlShortDescription: string | null
  totalSales: number | null // long?
  dateCreated: string | null // ISO DateTime string
  dateCreatedGmt: string | null // ISO DateTime string
  dateModified: string | null // ISO DateTime string
  dateModifiedGmt: string | null // ISO DateTime string

  // Related Products
  relatedIds: number[] | null // ulong[]
  relatedProducts: ProductResponse[] | null
  upsellIds: number[] | null // ulong[]
  upsellProducts: ProductResponse[] | null
  crossSellIds: number[] | null // ulong[]
  crossSellProducts: ProductResponse[] | null
  groupedProducts: number[] | null
  groupedProductsList: ProductResponse[] | null
  variations: number[] | null
  menuOrder: number | null

  // Tags and Attributes
  tagsString: string | null
  tags: ProductTagResponse[] | null
  attributes: ProductAttributeResponse[] | null
  productTags: ProductTagResponse[] | null
  productAttributes: ProductAttributeResponse[] | null
  providerProductTags: ProviderProductTagResponse[] | null

  // Brands
  brands: ProductBrandResponse[] | null
  productBrands: ProductBrandResponse[] | null
  providerProductBrands: ProviderProductBrandResponse[] | null

  // Categories
  categoryId: number
  category: CategoryResponse | null
  subCategoryId: number
  subCategory: SubCategoryResponse | null

  // Provider Information
  providerId: number | null
  provider: ProviderInfoResponse | null

  // Item Information
  itemId: number | null
  item: ItemResponse | null

  // Commerce Hub Properties
  providerData: string | null
  sourceOfTruth: SourceOfTruth
  lastSyncedAt: string | null // ISO DateTime string

  // Product Profit
  productProfit: number | null
  isTaagerProduct: boolean | null

  // Buy and Get
  buysNumber: number | null
  getsNumber: number | null

  // External Platform Integration
  vendor: string | null
  productType: string | null
  templateSuffix: string | null
  onlyDefaultVariant: boolean | null

  // Inventory
  inventories: InventoryResponse[] | null

  // Analytics
  analytics: ProductAnalyticsResponse[] | null

  // Error Handling
  error: ProductErrorResponse | null

  // Purchase Note
  purchaseNote: string | null
}
