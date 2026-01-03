/**
 * Purchase API Response Types
 * 
 * This module exports all TypeScript type definitions for IPurchaseService responses.
 */

import { ApiResult } from './api-result'
import { BudgetBookResponse } from './budget-book-response'
import { BudgetLineCategoryResponse } from './budget-line-category-response'
import { BudgetLineResponse } from './budget-line-response'
import { EventBookResponse } from './event-book-response'
import { EventLineCategoryResponse } from './event-line-category-response'
import { EventLineResponse } from './event-line-response'
import { GuestBookResponse } from './guest-book-response'
import { GuestLineCategoryResponse } from './guest-line-category-response'
import { GuestLineResponse } from './guest-line-response'
import { ItemBookResponse } from './item-book-response'
import { ItemLineCategoryResponse } from './item-line-category-response'
import { ItemLineResponse } from './item-line-response'
import { NoteBookResponse } from './note-book-response'
import { NoteLineCategoryResponse } from './note-line-category-response'
import { NoteLineResponse } from './note-line-response'
import { OccasionBookResponse } from './occasion-book-response'
import { OccasionLineCategoryResponse } from './occasion-line-category-response'
import { OccasionLineResponse } from './occasion-line-response'
import { ServiceBookResponse } from './service-book-response'
import { ServiceLineCategoryResponse } from './service-line-category-response'
import { ServiceLineResponse } from './service-line-response'
import { TodoBookResponse } from './todo-book-response'
import { TodoLineCategoryResponse } from './todo-line-category-response'
import { TodoLineResponse } from './todo-line-response'

// Purchase-specific enums
export {
  CartStatus,
  PurchaseType,
  PurchaseStatus,
  OrderStatus,
  PaymentStatus,
  PaymentType,
  PaymentFrequency,
  PaymentPlanItemStatus,
  DeliveryStatus,
} from '@/../client/common/api/gen/ourbride-api'

// Response types - all in the same folder
export type { OwnerResponse } from './owner-response'
export type { ProviderInfoResponse } from './provider-info-response'
export type { ProviderResponse } from './provider-response'
export type { FeaturedProviderResponse } from './featured-provider-response'
export type { ProductHeaderResponse } from './product-header-response'
export type { ProviderProductAttributeResponse } from './provider-product-attribute-response'
export type { ProviderProductTagResponse } from './provider-product-tag-response'
export type { ProviderCategoryResponse } from './provider-category-response'
export type { ProviderSubCategoryResponse } from './provider-sub-category-response'
export type { SkuConflictInfo } from './sku-conflict-info'
export type { ProviderConflictInfo } from './provider-conflict-info'
export type { ServiceHeaderResponse } from './service-header-response'
export type { ServiceResponse } from './service-response'
export type { ServiceSummary } from './service-summary'
export type { FeatureServiceResponse } from './feature-service-response'
export type { ReservationResponse } from './reservation-response'
export type { PaymentResponse } from './payment-response'
export type { PaymentPlanResponse } from './payment-plan-response'
export type { PaymentPlanItemResponse } from './payment-plan-item-response'
export type { PaymentPlanItemSummaryResponse } from './payment-plan-item-summary-response'
export type { PaymentSummaryResponse } from './payment-summary-response'
export type { PaymentGatewayResponse } from './payment-gateway-response'
export type { PaymentGatewaySettingResponse } from './payment-gateway-setting-response'
export type { ShippingMethodResponse } from './shipping-method-response'
export type { PriceCalculationResponse } from './price-calculation-response'
export type { PurchaseResponse } from './purchase-response'
export type { CartResponse } from './cart-response'
export type { UserCartWithProviderResponse } from './user-cart-with-provider-response'
export type { CartProviderResponse, CartPurchaseInfo } from './cart-provider-response'
export type { CartProduct } from './cart-product'
export type { CartReservation } from './cart-reservation'
export type { CartMembership } from './cart-membership'
export type { CartGiftCard } from './cart-gift-card'
export type { OrderResponse } from './order-response'
export type { ServiceOrderResponse } from './service-order-response'
export type { DeliveryResponse } from './delivery-response'
export type { CheckoutOrderResponse } from './checkout-order-response'
export type { OrderSummaryResponse } from './order-summary-response'
export type { CartSummaryResponse } from './cart-summary-response'
export type { CheckoutResponse } from './checkout-response'

// Additional response types
export type { AddressResponse } from './address-response'
export type { DeliveryAddressResponse } from './delivery-address-response'
export type { FollowResponse } from './follow-response'
export type { FavoriteResponse } from './favorite-response'
export type { ReviewResponse } from './review-response'
export type { LinkResponse } from './link-response'
export type { ProviderLinkeeResponse } from './provider-linkee-response'
export type { WishlistResponse } from './wishlist-response'
export type { ViewResponse } from './view-response'
export type { MediaResponse } from './media-response'
export type { WorkingTimeResponse } from './working-time-response'
export type { BlockedWorkingTimeResponse } from './blocked-working-time-response'
export type { PlaceResponse } from './place-response'
export type { BranchPortfolioResponse } from './branch-portfolio-response'
export type { ResourceResponse } from './resource-response'
export type { UserResponse } from './user-response'
export type { WeddingPlannerResponse } from './wedding-planner-response'
export type { WeddingEventResponse } from './wedding-event-response'
export type { TimeSlotResponse } from './time-slot-response'
export type { ServicePaymentMethodResponse } from './service-payment-method-response'
export type { ProviderUserAssignmentResponse } from './provider-user-assignment-response'
export type { ServicePackageResponse } from './service-package-response'
export type { ReservationInfoResponse } from './reservation-info-response'
export type { PaymentMethodResponse } from './payment-method-response'
export type { ProviderPaymentMethodResponse } from './provider-payment-method-response'
export type { RoleResponse } from './role-response'
export type { ProviderUserResponse } from './provider-user-response'

// Order service response types
export type { ServiceOrderDetailsResponse } from './service-order-details-response'
export type { ServiceOrderSummaryResponse } from './service-order-summary-response'
export type { ServiceOrderStatisticsResponse } from './service-order-statistics-response'
export type { DailyOrderStatistics } from './daily-order-statistics'
export type { MonthlyOrderStatistics } from './monthly-order-statistics'
export type { ServiceTypeStatistics } from './service-type-statistics'
export type { ProviderStatistics } from './provider-statistics'
export type { OrderPaymentStatistics } from './order-payment-statistics'
export type { OrderStatisticsResponse } from './order-statistics-response'
export type { ServiceInvoiceResponse } from './service-invoice-response'
export type { ServiceInvoiceItemResponse } from './service-invoice-item-response'
export type { ServiceReceiptResponse } from './service-receipt-response'

// Statistics and queue types
export type { QueueStatusResponse } from './queue-status-response'
export type { PaymentStatisticsResponse } from './payment-statistics-response'
export type { PaymentMethodStatistics } from './payment-method-statistics'
export type { MonthlyPaymentStatistics } from './monthly-payment-statistics'
export type { ProviderPaymentStatistics } from './provider-payment-statistics'
export type { HomeStatisticsResponse } from './home-statistics-response'
export type {
  HomeResponse,
  WalletAccountResponse,
  BannerResponse,
  TestimonialResponse,
  HomeCenterUpdateResponse,
} from './home-response'

// Service types
export type { PaginatedList } from './service-types'

// Product response types
export type { ProductResponse } from './product-response'
export type { ProductInformationResponse } from './product-information-response'
export type { ProductTagResponse } from './product-tag-response'
export type { ProductAttributeResponse } from './product-attribute-response'
export type { ProductAttributeTermResponse } from './product-attribute-term-response'
export type { ProductAttributeLineResponse } from './product-attribute-line-response'
export type { ProductAttributeMappingResponse } from './product-attribute-mapping-response'
export type { ProductAttributeValueResponse } from './product-attribute-value-response'
export type { ProductBrandResponse } from './product-brand-response'
export type { ProviderProductBrandResponse } from './provider-product-brand-response'
export type { ProductsHomeResponse } from './products-home-response'
export type { ProductCategoryLineResponse } from './product-category-line-response'
export type { ProductDefaultAttributeResponse } from './product-default-attribute-response'
export type { ProductDimensionResponse } from './product-dimension-response'
export type { ProductDownloadLineResponse } from './product-download-line-response'
export type { ProductImageResponse } from './product-image-response'
export type { ProductReviewResponse } from './product-review-response'
export type { ProductSalesReportResponse, TopProduct, CategorySales, DailySales } from './product-sales-report-response'
export type { ProductSupplierResponse } from './product-supplier-response'
export type { ProductTagLineResponse } from './product-tag-line-response'
export type { ProductVariationResponse } from './product-variation-response'
export type { InventoryResponse, StockMovementResponse, ReorderAlertResponse } from './inventory-response'
export type { ProductAnalyticsResponse, DailyAnalytics } from './product-analytics-response'
export type { ProductErrorResponse } from './product-error-response'
export type { ProductErrorDataResponse } from './product-error-data-response'
export type { AdditionalDataResponse } from './additional-data-response'
export type { CategoryResponse } from './category-response'
export type { SubCategoryResponse } from './sub-category-response'
export type { ItemResponse } from './item-response'

// Preparation service response types
export type { PreparationResponse } from './preparation-response'
export type { FeaturePreparationResponse } from './feature-preparation-response'
export type { ServiceInfoResponse } from './service-info-response'
export type { ServicePlaceAssignmentResponse } from './service-place-assignment-response'
export type { ServiceStaffAssignmentResponse } from './service-staff-assignment-response'

// Book response enums
export {
  UserType,
  BookClass,
  GuestStatus,
  GuestRelevant,
  GuestTitle,
  ReminderType,
  ProvidingType,
  ServiceType,
  ServiceClass,
  ServiceStatus,
  PriceType,
  DiscountType,
  ProviderStatus,
  ProviderRate,
  ReservationStatus,
  OccasionType,
  Gender,
  SocialStatus,
  PersonalType,
} from './book-enums'

// Book response base types
export type { GroomResponse } from './groom-response'
export type { BrideResponse } from './bride-response'
export type { GuestResponse } from './guest-response'
export type { LineCategoryResponse } from './line-category-response'
export type { LineResponse } from './line-response'
export type { BookResponse } from './book-response'
export type { ItemDetailResponse } from './item-detail-response'
export type { ApiResult } from './api-result'

// Event book response types
export type { EventLineCategoryResponse } from './event-line-category-response'
export type { EventLineResponse } from './event-line-response'
export type { EventBookResponse } from './event-book-response'

// Budget book response types
export type { BudgetLineCategoryResponse } from './budget-line-category-response'
export type { BudgetLineResponse } from './budget-line-response'
export type { BudgetBookResponse } from './budget-book-response'

// Guest book response types
export type { GuestLineCategoryResponse } from './guest-line-category-response'
export type { GuestLineResponse } from './guest-line-response'
export type { GuestBookResponse } from './guest-book-response'

// Item book response types
export type { ItemLineCategoryResponse } from './item-line-category-response'
export type { ItemLineResponse } from './item-line-response'
export type { ItemBookResponse } from './item-book-response'

// Note book response types
export type { NoteLineCategoryResponse } from './note-line-category-response'
export type { NoteLineResponse } from './note-line-response'
export type { NoteBookResponse } from './note-book-response'

// Occasion book response types
export type { OccasionLineCategoryResponse } from './occasion-line-category-response'
export type { OccasionLineResponse } from './occasion-line-response'
export type { OccasionBookResponse } from './occasion-book-response'

// Service book response types
export type { ServiceLineCategoryResponse } from './service-line-category-response'
export type { ServiceLineResponse } from './service-line-response'
export type { ServiceBookResponse } from './service-book-response'

// Todo book response types
export type { TodoLineCategoryResponse } from './todo-line-category-response'
export type { TodoSubLineResponse } from './todo-sub-line-response'
export type { TodoLineResponse } from './todo-line-response'
export type { TodoBookResponse } from './todo-book-response'

// API result types
export type EventBookListResponse = ApiResult<EventBookResponse>
export type BudgetBookListResponse = ApiResult<BudgetBookResponse>
export type GuestBookListResponse = ApiResult<GuestBookResponse>
export type ItemBookListResponse = ApiResult<ItemBookResponse>
export type NoteBookListResponse = ApiResult<NoteBookResponse>
export type OccasionBookListResponse = ApiResult<OccasionBookResponse>

// Main Book Response Types
export * from './main'

// Event Info Response
export * from './event-info-response'
export type ServiceBookListResponse = ApiResult<ServiceBookResponse>
export type TodoBookListResponse = ApiResult<TodoBookResponse>

// Community Response Types
export * from './community'

// Provider Public Profile Response Types
// Provider Public Profile Response types (split into separate files to avoid duplication)
export type { ProviderPublicProfileResponse } from './provider-public-profile-response'
export type { ProviderPublicStoreResponse } from './provider-public-store-response'
export type { ProviderPublicProfileSettingsResponse } from './provider-public-profile-settings-response'
export type { ServicePublicResponse } from './service-public-response'
export type { MembershipPlanResponse } from './membership-plan-response'
export type { GiftCardTemplateResponse } from './gift-card-template-response'
export type { ProviderSubscriptionResponse } from './provider-subscription-response'
export type { ProviderShippingZoneResponse } from './provider-shipping-zone-response'
export type { ProviderShippingMethodResponse } from './provider-shipping-method-response'

// Provider Home Response Types
// Provider Home Response types (split into separate files to avoid duplication)
export type { ProviderHomeResponse } from './provider-home-response'
export type { ProviderHomeUserResponse } from './provider-home-user-response'
export type { ProviderHomeOwnerResponse } from './provider-home-owner-response'
export type { ProviderHomeProviderInfoResponse } from './provider-home-provider-info-response'
export type { ProviderHomeServiceSummary } from './provider-home-service-summary'
export type { ProviderHomeFeaturedProviderResponse } from './provider-home-featured-provider-response'
export type { ProviderHomeStatisticsResponse } from './provider-home-statistics-response'
export type { ProviderHomeTestimonialResponse } from './provider-home-testimonial-response'

export type EventLineListResponse = ApiResult<EventLineResponse[]>
export type BudgetLineListResponse = ApiResult<BudgetLineResponse[]>
export type GuestLineListResponse = ApiResult<GuestLineResponse[]>
export type ItemLineListResponse = ApiResult<ItemLineResponse[]>
export type NoteLineListResponse = ApiResult<NoteLineResponse[]>
export type OccasionLineListResponse = ApiResult<OccasionLineResponse[]>
export type ServiceLineListResponse = ApiResult<ServiceLineResponse[]>
export type TodoLineListResponse = ApiResult<TodoLineResponse[]>

export type EventLineCategoryListResponse = ApiResult<EventLineCategoryResponse[]>
export type BudgetLineCategoryListResponse = ApiResult<BudgetLineCategoryResponse[]>
export type GuestLineCategoryListResponse = ApiResult<GuestLineCategoryResponse[]>
export type ItemLineCategoryListResponse = ApiResult<ItemLineCategoryResponse[]>
export type NoteLineCategoryListResponse = ApiResult<NoteLineCategoryResponse[]>
export type OccasionLineCategoryListResponse = ApiResult<OccasionLineCategoryResponse[]>
export type ServiceLineCategoryListResponse = ApiResult<ServiceLineCategoryResponse[]>
export type TodoLineCategoryListResponse = ApiResult<TodoLineCategoryResponse[]>