// Purchase API service functions

import { apiClient } from '@/services/api/apiClient'
import type {
  PurchaseRequest,
  PurchaseUpdateRequest,
  PurchaseRemoveRequest,
  CheckoutRequest,
  ServiceOrderSearchRequest,
  PaymentSearchRequest,
  PriceCalculationRequest,
} from '@/../client/common/api/gen/ourbride-api'
import type {
  CartResponse,
  PurchaseResponse,
  UserCartWithProviderResponse,
  ServiceOrderResponse,
  PaymentResponse,
  PriceCalculationResponse,
  CheckoutResponse,
  PaginatedList,
} from '@/types/responses'

/**
 * Add a purchase (supports all purchase types: Product, Service, Reservation, Membership, GiftCard)
 */
export const addPurchase = async (data: PurchaseRequest): Promise<CartResponse> => {
  try {
    const response = await apiClient.api.postPurchasePurchase(data)
    return (response?.data ?? response) as unknown as CartResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add purchase')
  }
}

/**
 * Update a purchase
 */
export const updatePurchase = async (
  id: string,
  data: PurchaseUpdateRequest
): Promise<CartResponse> => {
  try {
    const response = await apiClient.api.putPurchaseUpdatePurchase(id, data)
    return (response?.data ?? response) as unknown as CartResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update purchase')
  }
}

/**
 * Remove a purchase
 */
export const removePurchase = async (
  id: string,
  data: PurchaseRemoveRequest
): Promise<void> => {
  try {
    await apiClient.api.deletePurchaseRemovePurchase(id, data)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to remove purchase')
  }
}

/**
 * Get all purchases (supports all purchase types)
 */
export const getAllPurchases = async (): Promise<PurchaseResponse[]> => {
  try {
    const response = await apiClient.api.getPurchaseGetAll()
    return (response?.data ?? response) as unknown as PurchaseResponse[]
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch purchases')
  }
}

/**
 * Get purchase by ID
 */
export const getPurchaseById = async (id: number): Promise<PurchaseResponse> => {
  try {
    const response = await apiClient.api.getPurchaseGetById(id)
    return (response?.data ?? response) as unknown as PurchaseResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch purchase')
  }
}

/**
 * Get purchases by reservation ID
 */
export const getPurchasesByReservationId = async (reservationId: string): Promise<PurchaseResponse[]> => {
  try {
    const response = await apiClient.api.getPurchaseGetPurchasesByReservationId(reservationId)
    return (response?.data ?? response) as unknown as PurchaseResponse[]
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch purchases by reservation')
  }
}

/**
 * Get quick purchase list
 * Note: This endpoint may need to be added if it exists in the API
 */
// export const getQuickPurchaseList = async (): Promise<any> => {
//   try {
//     const response = await apiClient.api.getPurchaseGetQuickPurchaseList()
//     return (response?.data ?? response) as unknown as CartResponse
//   } catch (error: unknown) {
//     throw new Error(error instanceof Error ? error.message : 'Failed to fetch quick purchase list')
//   }
// }

/**
 * Get cart (supports all purchase types)
 */
export const getCart = async (): Promise<CartResponse> => {
  try {
    const response = await apiClient.api.getPurchaseGetCart()
    return (response?.data ?? response) as unknown as CartResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch cart')
  }
}

/**
 * Clear cart
 */
export const clearCart = async (): Promise<void> => {
  try {
    await apiClient.api.deletePurchaseClearCart()
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to clear cart')
  }
}

/**
 * Get purchases by cart
 */
export const getPurchasesByCart = async (): Promise<PurchaseResponse[]> => {
  try {
    const response = await apiClient.api.getPurchaseGetPurchasesByCart()
    return (response?.data ?? response) as unknown as PurchaseResponse[]
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch purchases by cart')
  }
}

/**
 * Get all carts with providers
 */
export const getAllCartsWithProviders = async (): Promise<UserCartWithProviderResponse[]> => {
  try {
    const response = await apiClient.api.getPurchaseGetAllCartsWithProviders()
    return (response?.data ?? response) as unknown as UserCartWithProviderResponse[]
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch carts with providers')
  }
}

/**
 * Get cart by provider (supports all purchase types)
 */
export const getCartByProvider = async (providerId: number): Promise<CartResponse> => {
  try {
    const response = await apiClient.api.getPurchaseGetCartByProvider(providerId)
    return (response?.data ?? response) as unknown as CartResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch cart by provider')
  }
}

/**
 * Clear cart by provider
 */
export const clearCartByProvider = async (providerId: number): Promise<void> => {
  try {
    await apiClient.api.deletePurchaseClearCartByProvider(providerId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to clear cart by provider')
  }
}

/**
 * Get purchases by provider cart
 */
export const getPurchasesByProviderCart = async (providerId: number): Promise<PurchaseResponse[]> => {
  try {
    const response = await apiClient.api.getPurchaseGetPurchasesByProviderCart(providerId)
    return (response?.data ?? response) as unknown as PurchaseResponse[]
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch purchases by provider cart')
  }
}

/**
 * Create order (supports all purchase types)
 */
export const createOrder = async (data: CheckoutRequest): Promise<CheckoutResponse> => {
  try {
    const response = await apiClient.api.postPurchaseCreateOrder(data)
    return (response?.data ?? response) as unknown as CheckoutResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create order')
  }
}

/**
 * Checkout (supports all purchase types)
 */
export const checkout = async (data: CheckoutRequest): Promise<CheckoutResponse> => {
  try {
    const response = await apiClient.api.postPurchaseCheckout(data)
    return (response?.data ?? response) as unknown as CheckoutResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to checkout')
  }
}

/**
 * Validate coupon
 */
export const validateCoupon = async (couponCode: string): Promise<unknown> => {
  try {
    const response = await apiClient.api.postPurchaseValidateCoupon(couponCode)
    return response?.data ?? response
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to validate coupon')
  }
}

/**
 * Search orders
 */
export const searchOrders = async (data: ServiceOrderSearchRequest): Promise<PaginatedList<ServiceOrderResponse>> => {
  try {
    const response = await apiClient.api.postPurchaseGetOrdersPaginated(data)
    return (response?.data ?? response) as unknown as PaginatedList<ServiceOrderResponse>
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to search orders')
  }
}

/**
 * Get payments paginated
 */
export const getPaymentsPaginated = async (data: PaymentSearchRequest): Promise<PaginatedList<PaymentResponse>> => {
  try {
    const response = await apiClient.api.postPurchaseGetPaymentsPaginated(data)
    return (response?.data ?? response) as unknown as PaginatedList<PaymentResponse>
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch payments')
  }
}

/**
 * Create order for guest
 */
export const createOrderForGuest = async (
  data: CheckoutRequest,
  deviceId?: string
): Promise<CheckoutResponse> => {
  try {
    const response = await apiClient.api.postPurchaseCreateOrderForGuest(data, {
      deviceId,
    })
    return (response?.data ?? response) as unknown as CheckoutResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create order for guest')
  }
}

/**
 * Checkout for guest
 */
export const checkoutForGuest = async (
  data: CheckoutRequest,
  deviceId?: string
): Promise<CheckoutResponse> => {
  try {
    const response = await apiClient.api.postPurchaseCheckoutForGuest(data, {
      deviceId,
    })
    return (response?.data ?? response) as unknown as CheckoutResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to checkout for guest')
  }
}

/**
 * Purchase for guest
 */
export const purchaseForGuest = async (
  data: PurchaseRequest,
  deviceId?: string
): Promise<CartResponse> => {
  try {
    const response = await apiClient.api.postPurchasePurchaseForGuest(data, {
      deviceId,
    })
    return (response?.data ?? response) as unknown as CartResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to purchase for guest')
  }
}

/**
 * Calculate prices for guest
 */
export const calculatePricesForGuest = async (
  data: PriceCalculationRequest,
  deviceId?: string
): Promise<PriceCalculationResponse> => {
  try {
    const response = await apiClient.api.postPurchaseCalculatePricesForGuest(data, {
      deviceId,
    })
    return (response?.data ?? response) as unknown as PriceCalculationResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to calculate prices for guest')
  }
}
