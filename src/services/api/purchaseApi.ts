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
  BulkPurchaseRequest,
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
  CartProviderResponse,
} from '@/types/responses'

/**
 * Helper function to extract error details from API errors
 */
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error && typeof error === 'object') {
    // Check if it's an Axios error with response
    const axiosError = error as {
      response?: { status?: number; data?: unknown }
      message?: string
    }
    if (axiosError.response) {
      const status = axiosError.response.status
      const responseData = axiosError.response.data

      // Try to extract error message from response data
      let errorMessage = defaultMessage
      if (responseData && typeof responseData === 'object') {
        const data = responseData as {
          message?: string
          error?: string
          errors?: unknown
        }
        if (data.message) {
          errorMessage = data.message
        } else if (data.error) {
          errorMessage =
            typeof data.error === 'string' ? data.error : defaultMessage
        } else if (data.errors) {
          // Handle validation errors
          errorMessage = 'Validation error'
        }
      }

      return `Request failed with status code ${status}: ${errorMessage}`
    }

    // Fallback to error message if available
    if (axiosError.message) {
      return axiosError.message
    }
  }

  // Final fallback
  if (error instanceof Error) {
    return error.message
  }

  return defaultMessage
}

/**
 * Add a purchase (supports all purchase types: Product, Service, Reservation, Membership, GiftCard)
 */
export const addPurchase = async (
  data: PurchaseRequest
): Promise<CartResponse> => {
  try {
    const response = await apiClient.api.postPurchasePurchase(data)
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as CartResponse
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Failed to add purchase')
    const enhancedError = new Error(errorMessage)
    // Preserve original error for debugging
    if (error && typeof error === 'object') {
      ;(enhancedError as { originalError?: unknown }).originalError = error
    }
    throw enhancedError
  }
}

/**
 * Bulk purchase response interface
 */
export interface BulkPurchaseResponse {
  totalItems: number
  successCount: number
  failureCount: number
  successfulItems: Record<number, PurchaseResponse>
  failedItems: Record<number, string>
  cart: CartResponse
}

/**
 * Add multiple purchases in bulk (supports all purchase types)
 */
export const addBulkPurchases = async (
  data: BulkPurchaseRequest
): Promise<BulkPurchaseResponse> => {
  try {
    const response = await apiClient.api.postPurchasePurchaseBulk(data)
    const responseAny: any = response

    // Extract response data - handle different response structures
    const responseData =
      responseAny?.data?.data ?? responseAny?.data ?? responseAny

    // Handle both camelCase and PascalCase property names
    return {
      totalItems: responseData?.totalItems ?? responseData?.TotalItems ?? 0,
      successCount:
        responseData?.successCount ?? responseData?.SuccessCount ?? 0,
      failureCount:
        responseData?.failureCount ?? responseData?.FailureCount ?? 0,
      successfulItems:
        responseData?.successfulItems ?? responseData?.SuccessfulItems ?? {},
      failedItems: responseData?.failedItems ?? responseData?.FailedItems ?? {},
      cart: responseData?.cart ?? responseData?.Cart ?? responseData,
    } as BulkPurchaseResponse
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Failed to add bulk purchases')
    const enhancedError = new Error(errorMessage)
    // Preserve original error for debugging
    if (error && typeof error === 'object') {
      ;(enhancedError as { originalError?: unknown }).originalError = error
    }
    throw enhancedError
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
    // Ensure the purchase ID is included in the request body
    const requestData: PurchaseUpdateRequest = {
      ...data,
      id: data.id ?? parseInt(id, 10),
    }
    const response = await apiClient.api.putPurchaseUpdatePurchase(
      id,
      requestData
    )
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as CartResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update purchase'
    )
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
    throw new Error(
      error instanceof Error ? error.message : 'Failed to remove purchase'
    )
  }
}

/**
 * Get all purchases (supports all purchase types)
 */
export const getAllPurchases = async (): Promise<PurchaseResponse[]> => {
  try {
    const response = await apiClient.api.getPurchaseGetAll()
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as PurchaseResponse[]
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch purchases'
    )
  }
}

/**
 * Get purchase by ID
 */
export const getPurchaseById = async (
  id: number
): Promise<PurchaseResponse> => {
  try {
    const response = await apiClient.api.getPurchaseGetById(id)
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as PurchaseResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch purchase'
    )
  }
}

/**
 * Get purchases by reservation ID
 */
export const getPurchasesByReservationId = async (
  reservationId: string
): Promise<PurchaseResponse[]> => {
  try {
    const response =
      await apiClient.api.getPurchaseGetPurchasesByReservationId(reservationId)
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as PurchaseResponse[]
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch purchases by reservation'
    )
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
    const responseAny: any = response

    // Handle different response structures
    // Structure 1: { data: { id: ..., purchases: ... }, success: true }
    // Structure 2: { data: { data: { id: ... } } }
    // Structure 3: Direct cart object
    let cartData = responseAny

    if (responseAny?.data) {
      // Check if data.data exists (nested structure)
      if (
        responseAny.data.data &&
        typeof responseAny.data.data === 'object' &&
        'id' in responseAny.data.data
      ) {
        cartData = responseAny.data.data
      } else if (
        typeof responseAny.data === 'object' &&
        'id' in responseAny.data
      ) {
        // Direct cart in data property
        cartData = responseAny.data
      }
    }

    return cartData as CartResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch cart'
    )
  }
}

/**
 * Clear cart
 */
export const clearCart = async (): Promise<void> => {
  try {
    await apiClient.api.deletePurchaseClearCart()
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to clear cart'
    )
  }
}

/**
 * Get purchases by cart
 */
export const getPurchasesByCart = async (): Promise<PurchaseResponse[]> => {
  try {
    const response = await apiClient.api.getPurchaseGetPurchasesByCart()
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as PurchaseResponse[]
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch purchases by cart'
    )
  }
}

/**
 * Get all carts with providers
 */
export const getAllCartsWithProviders = async (): Promise<
  UserCartWithProviderResponse[]
> => {
  try {
    const response = await apiClient.api.getPurchaseGetAllCartsWithProviders()
    const responseAny: any = response
    const data = (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as unknown

    // Ensure we return an array
    if (Array.isArray(data)) {
      return data as UserCartWithProviderResponse[]
    }

    // If data is not an array, return empty array or wrap it
    if (data && typeof data === 'object') {
      // Check if it's a single object that should be wrapped
      return [data] as UserCartWithProviderResponse[]
    }

    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch carts with providers'
    )
  }
}

/**
 * Get cart by provider (supports all purchase types)
 */
export const getCartByProvider = async (
  providerId: number
): Promise<CartResponse> => {
  try {
    const response =
      await apiClient.api.getPurchaseGetCartByProvider(providerId)
    const responseAny: any = response

    // Handle different response structures
    let cartData = responseAny

    if (responseAny?.data) {
      // Check if data.data exists (nested structure)
      if (
        responseAny.data.data &&
        typeof responseAny.data.data === 'object' &&
        'id' in responseAny.data.data
      ) {
        cartData = responseAny.data.data
      } else if (
        typeof responseAny.data === 'object' &&
        'id' in responseAny.data
      ) {
        // Direct cart in data property
        cartData = responseAny.data
      }
    }

    return cartData as CartResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch cart by provider'
    )
  }
}

/**
 * Get cart by cart ID
 * For general cart (providerId is null), use getCart() instead
 * For provider-specific carts, use getCartByProvider(providerId)
 */
export const getCartByCartId = async (
  cartId: number
): Promise<CartResponse> => {
  try {
    // Since there's no direct getCartById API, we'll use getCart() for general cart
    // and getCartByProvider for provider carts based on the cartId
    // This is a workaround - ideally the API should have getCartById
    const response = await apiClient.api.getPurchaseGetCart()
    const responseAny: any = response
    const allCarts = (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as CartResponse | CartResponse[]

    // If it's an array, find the cart with matching ID
    if (Array.isArray(allCarts)) {
      const cart = allCarts.find(c => c.id === cartId)
      if (cart) return cart
    } else if (allCarts && typeof allCarts === 'object' && 'id' in allCarts) {
      // If it's a single cart object, check if ID matches
      if (allCarts.id === cartId) {
        return allCarts as CartResponse
      }
    }

    throw new Error(`Cart with ID ${cartId} not found`)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch cart by cart ID'
    )
  }
}

/**
 * Clear cart by provider
 */
export const clearCartByProvider = async (
  providerId: number
): Promise<void> => {
  try {
    await apiClient.api.deletePurchaseClearCartByProvider(providerId)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to clear cart by provider'
    )
  }
}

/**
 * Get purchases by provider cart
 */
export const getPurchasesByProviderCart = async (
  providerId: number
): Promise<PurchaseResponse[]> => {
  try {
    const response =
      await apiClient.api.getPurchaseGetPurchasesByProviderCart(providerId)
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as PurchaseResponse[]
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch purchases by provider cart'
    )
  }
}

/**
 * Create order (supports all purchase types)
 */
export const createOrder = async (
  data: CheckoutRequest
): Promise<CheckoutResponse> => {
  try {
    const response = await apiClient.api.postPurchaseCreateOrder(data)
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as CheckoutResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create order'
    )
  }
}

/**
 * Checkout (supports all purchase types)
 */
export const checkout = async (
  data: CheckoutRequest
): Promise<CheckoutResponse> => {
  try {
    const response = await apiClient.api.postPurchaseCheckout(data)
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as CheckoutResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to checkout'
    )
  }
}

/**
 * Validate coupon
 */
export const validateCoupon = async (couponCode: string): Promise<unknown> => {
  try {
    const response = await apiClient.api.postPurchaseValidateCoupon(couponCode)
    const responseAny: any = response
    return responseAny?.data?.data ?? responseAny?.data ?? responseAny
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to validate coupon'
    )
  }
}

/**
 * Search orders
 */
export const searchOrders = async (
  data: ServiceOrderSearchRequest
): Promise<PaginatedList<ServiceOrderResponse>> => {
  try {
    const response = await apiClient.api.postPurchaseGetOrdersPaginated(data)
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as PaginatedList<ServiceOrderResponse>
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to search orders'
    )
  }
}

/**
 * Get payments paginated
 */
export const getPaymentsPaginated = async (
  data: PaymentSearchRequest
): Promise<PaginatedList<PaymentResponse>> => {
  try {
    const response = await apiClient.api.postPurchaseGetPaymentsPaginated(data)
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as PaginatedList<PaymentResponse>
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch payments'
    )
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
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as CheckoutResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to create order for guest'
    )
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
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as CheckoutResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to checkout for guest'
    )
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
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as CartResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to purchase for guest'
    )
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
    const response = await apiClient.api.postPurchaseCalculatePricesForGuest(
      data,
      {
        deviceId,
      }
    )
    const responseAny: any = response
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as PriceCalculationResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to calculate prices for guest'
    )
  }
}

/**
 * Get cart providers (providers that have items in the user's cart)
 */
export const getCartProviders = async (): Promise<CartProviderResponse[]> => {
  try {
    const response = await apiClient.api.getPurchaseGetCartProviders()
    const responseAny: any = response

    // Handle different response structures
    let data = responseAny

    if (responseAny?.data) {
      // Check if data.data exists (nested structure)
      if (Array.isArray(responseAny.data.data)) {
        data = responseAny.data.data
      } else if (Array.isArray(responseAny.data)) {
        data = responseAny.data
      } else if (
        responseAny.data.data &&
        typeof responseAny.data.data === 'object'
      ) {
        data = [responseAny.data.data]
      } else if (
        typeof responseAny.data === 'object' &&
        'providerId' in responseAny.data
      ) {
        data = [responseAny.data]
      }
    }

    // Ensure we return an array
    if (Array.isArray(data)) {
      return data as CartProviderResponse[]
    }

    // If data is not an array, return empty array or wrap it
    if (data && typeof data === 'object') {
      return [data] as CartProviderResponse[]
    }

    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch cart providers'
    )
  }
}
