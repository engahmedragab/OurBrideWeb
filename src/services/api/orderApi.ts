// Order API service functions

import { apiClient } from '@/services/api/apiClient'
import { getToken } from '@/auth/utils/token'
import { getApiLanguage } from '@/utils/language'
import axios from 'axios'
import type {
  ServiceOrderUpdateRequest,
  ServiceOrderSearchRequest,
  PaymentRequest,
  RefundRequest,
  PaymentPlanRequest,
  PaymentPlanUpdateRequest,
  PriceCalculationRequest,
  CreateOrderReviewRequest,
} from '@/../client/common/api/gen/ourbride-api'
import type {
  PaginatedList,
  OrderResponse,
  ServiceOrderDetailsResponse,
  PaymentResponse,
  PaymentPlanItemResponse,
  PaymentPlanResponse,
  PriceCalculationResponse,
  ServiceOrderSummaryResponse,
  ServiceOrderStatisticsResponse,
  ServiceOrderResponse,
  OrderStatisticsResponse,
  ServiceInvoiceResponse,
  ServiceReceiptResponse,
  OrderStatus,
  ProviderPaymentMethodResponse,
  ReviewResponse,
} from '@/types/responses'

/**
 * Get orders
 */
export const getOrders = async (query?: {
  page?: number
  pageSize?: number
  providerId?: number
}): Promise<PaginatedList<OrderResponse>> => {
  try {
    const response = await apiClient.api.getOrderGetOrders(query)
    return (response?.data ?? response) as unknown as PaginatedList<OrderResponse>
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch orders')
  }
}

/**
 * Get client orders (paginated)
 */
export const getClientOrders = async (query?: {
  page?: number
  pageSize?: number
  clientId?: string
}): Promise<PaginatedList<OrderResponse>> => {
  try {
    const response = await apiClient.api.getOrderGetClientOrders(query)
    const responseAny: any = response
    
    // Handle different response structures - check for nested data.data first
    if (responseAny?.data?.data && typeof responseAny.data.data === 'object' && 'items' in responseAny.data.data) {
      return responseAny.data.data as PaginatedList<OrderResponse>
    }
    // Check for data property with items
    if (responseAny?.data && typeof responseAny.data === 'object' && 'items' in responseAny.data) {
      return responseAny.data as PaginatedList<OrderResponse>
    }
    // Check if response itself is the paginated list
    if (responseAny && typeof responseAny === 'object' && 'items' in responseAny) {
      return responseAny as PaginatedList<OrderResponse>
    }
    
    throw new Error('Failed to extract orders data from API response.')
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch client orders')
  }
}

/**
 * Get order by ID
 */
export const getOrderById = async (
  id: number,
  query?: {
    providerId?: number
  }
): Promise<OrderResponse> => {
  try {
    const response = await apiClient.api.getOrderGetOrderById(id, query)
    const responseAny: any = response
    
    // Handle different response structures - check for nested data.data first
    if (responseAny?.data?.data && typeof responseAny.data.data === 'object' && 'id' in responseAny.data.data) {
      return responseAny.data.data as OrderResponse
    }
    // Check for data property
    if (responseAny?.data && typeof responseAny.data === 'object' && 'id' in responseAny.data) {
      return responseAny.data as OrderResponse
    }
    // Check if response itself is the order
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as OrderResponse
    }
    
    throw new Error('Failed to extract order data from API response.')
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch order')
  }
}

/**
 * Update order
 */
export const updateOrder = async (
  id: number,
  data: ServiceOrderUpdateRequest
): Promise<ServiceOrderResponse> => {
  try {
    const response = await apiClient.api.putOrderUpdateOrder(id, data)
    const responseAny: any = response
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as ServiceOrderResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update order')
  }
}

/**
 * Get order details
 */
export const getOrderDetails = async (
  id: number,
  query?: {
    providerId?: number
  }
): Promise<ServiceOrderDetailsResponse> => {
  try {
    const response = await apiClient.api.getOrderGetOrderDetails(id, query)
    return (response?.data ?? response) as unknown as ServiceOrderDetailsResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch order details')
  }
}

/**
 * Confirm order
 */
export const confirmOrder = async (id: number): Promise<ServiceOrderResponse> => {
  try {
    const response = await apiClient.api.putOrderConfirmOrder(id)
    const responseAny: any = response
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as ServiceOrderResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to confirm order')
  }
}

/**
 * Reject order
 */
export const rejectOrder = async (
  id: number,
  query?: {
    reason?: string
  }
): Promise<ServiceOrderResponse> => {
  try {
    const response = await apiClient.api.putOrderRejectOrder(id, query)
    const responseAny: any = response
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as ServiceOrderResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to reject order')
  }
}

/**
 * Cancel order
 */
export const cancelOrder = async (id: number): Promise<ServiceOrderResponse> => {
  try {
    const response = await apiClient.api.putOrderCancelOrder(id)
    const responseAny: any = response
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as ServiceOrderResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to cancel order')
  }
}

/**
 * Process payment for order
 */
export const processPayment = async (
  id: number,
  data: PaymentRequest,
  query?: {
    providerId?: number
  }
): Promise<PaymentResponse> => {
  try {
    const response = await apiClient.api.postOrderProcessPayment(id, data, query)
    return (response?.data ?? response) as unknown as PaymentResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to process payment')
  }
}

/**
 * Refund payment
 */
export const refundPayment = async (
  id: number,
  paymentId: number,
  data: RefundRequest,
  query?: {
    providerId?: number
  }
): Promise<PaymentResponse> => {
  try {
    const response = await apiClient.api.postOrderRefundPayment(id, paymentId, data, query)
    return (response?.data ?? response) as unknown as PaymentResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to refund payment')
  }
}

/**
 * Get order payments
 */
export const getOrderPayments = async (
  id: number,
  query?: {
    providerId?: number
  }
): Promise<PaymentResponse[]> => {
  try {
    const response = await apiClient.api.getOrderGetOrderPayments(id, query)
    return (response?.data ?? response) as unknown as PaymentResponse[]
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch order payments')
  }
}

/**
 * Create payment plan for order
 */
export const createPaymentPlanForOrder = async (
  id: number,
  data: PaymentPlanRequest,
  query?: {
    providerId?: number
  }
): Promise<ServiceOrderResponse> => {
  try {
    const response = await apiClient.api.postOrderCreatePaymentPlanForOrder(id, data, query)
    const responseAny: any = response
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as ServiceOrderResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create payment plan')
  }
}

/**
 * Update payment plan
 */
export const updatePaymentPlan = async (
  id: number,
  data: PaymentPlanUpdateRequest,
  query?: {
    providerId?: number
  }
): Promise<PaymentPlanResponse> => {
  try {
    const response = await apiClient.api.putOrderUpdatePaymentPlan(id, data, query)
    return (response?.data ?? response) as unknown as PaymentPlanResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update payment plan')
  }
}

/**
 * Cancel payment plan
 */
export const cancelPaymentPlan = async (
  id: number,
  query?: {
    providerId?: number
  }
): Promise<ServiceOrderResponse> => {
  try {
    const response = await apiClient.api.deleteOrderCancelPaymentPlan(id, query)
    const responseAny: any = response
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as ServiceOrderResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to cancel payment plan')
  }
}

/**
 * Get order payment plan items
 */
export const getOrderPaymentPlanItems = async (
  id: number,
  query?: {
    providerId?: number
  }
): Promise<PaymentPlanItemResponse[]> => {
  try {
    const response = await apiClient.api.getOrderGetOrderPaymentPlanItems(id, query)
    return (response?.data ?? response) as unknown as PaymentPlanItemResponse[]
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch payment plan items')
  }
}

/**
 * Mark deposit as paid
 */
export const markDepositAsPaid = async (
  paymentPlanItemId: number,
  query?: {
    providerId?: number
  }
): Promise<PaymentPlanItemResponse> => {
  try {
    const response = await apiClient.api.putOrderMarkDepositAsPaid(paymentPlanItemId, query)
    return (response?.data ?? response) as unknown as PaymentPlanItemResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to mark deposit as paid')
  }
}

/**
 * Mark deposit as returned
 */
export const markDepositAsReturned = async (
  paymentPlanItemId: number,
  query?: {
    providerId?: number
  }
): Promise<PaymentPlanItemResponse> => {
  try {
    const response = await apiClient.api.putOrderMarkDepositAsReturned(paymentPlanItemId, query)
    return (response?.data ?? response) as unknown as PaymentPlanItemResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to mark deposit as returned')
  }
}

/**
 * Calculate prices
 */
export const calculatePrices = async (
  data: PriceCalculationRequest,
  query?: {
    providerId?: number
  }
): Promise<PriceCalculationResponse> => {
  try {
    const response = await apiClient.api.postOrderCalculatePrices(data, query)
    return (response?.data ?? response) as unknown as PriceCalculationResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to calculate prices')
  }
}

/**
 * Validate coupon
 */
export const validateCoupon = async (query?: {
  couponCode?: string
  providerId?: number
}): Promise<boolean> => {
  try {
    const response = await apiClient.api.getOrderValidateCoupon(query)
    return (response?.data ?? response) as unknown as boolean
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to validate coupon')
  }
}

/**
 * Search orders
 */
export const searchOrderList = async (
  data: ServiceOrderSearchRequest,
  query?: {
    providerId?: number
  }
): Promise<OrderResponse[]> => {
  try {
    const response = await apiClient.api.postOrderSearchOrders(data, query)
    return (response?.data ?? response) as unknown as OrderResponse[]
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to search orders')
  }
}

/**
 * Get orders by status
 */
export const getOrdersByStatus = async (
  status: string,
  query?: {
    providerId?: number
  }
): Promise<OrderResponse[]> => {
  try {
    const response = await apiClient.api.getOrderGetOrdersByStatus(status, query)
    return (response?.data ?? response) as unknown as OrderResponse[]
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch orders by status')
  }
}

/**
 * Get orders by date range
 */
export const getOrdersByDateRange = async (query?: {
  startDate?: string
  endDate?: string
  providerId?: number
}): Promise<OrderResponse[]> => {
  try {
    const response = await apiClient.api.getOrderGetOrdersByDateRange(query)
    return (response?.data ?? response) as unknown as OrderResponse[]
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch orders by date range')
  }
}

/**
 * Get order summary
 */
export const getOrderSummary = async (query?: {
  providerId?: number
}): Promise<ServiceOrderSummaryResponse> => {
  try {
    const response = await apiClient.api.getOrderGetOrderSummary(query)
    return (response?.data ?? response) as unknown as ServiceOrderSummaryResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch order summary')
  }
}

/**
 * Get order statistics
 */
export const getOrderStatistics = async (query?: {
  startDate?: string
  endDate?: string
  providerId?: number
}): Promise<ServiceOrderStatisticsResponse> => {
  try {
    const response = await apiClient.api.getOrderGetOrderStatistics(query)
    return (response?.data ?? response) as unknown as ServiceOrderStatisticsResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch order statistics')
  }
}

/**
 * Get recent orders
 */
export const getRecentOrders = async (
  count: number,
  query?: {
    providerId?: number
  }
): Promise<ServiceOrderResponse[]> => {
  try {
    const response = await apiClient.api.getOrderGetRecentOrders(count, query)
    return (response?.data ?? response) as unknown as ServiceOrderResponse[]
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch recent orders')
  }
}


/**
 * Send order confirmation notification
 */
export const sendOrderConfirmation = async (
  id: number,
  query?: {
    providerId?: number
  }
): Promise<ServiceOrderResponse> => {
  try {
    const response = await apiClient.api.postOrderSendOrderConfirmation(id, query)
    const responseAny: any = response
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as ServiceOrderResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to send order confirmation')
  }
}

/**
 * Send payment reminder notification
 */
export const sendPaymentReminder = async (
  id: number,
  query?: {
    providerId?: number
  }
): Promise<void> => {
  try {
    await apiClient.api.postOrderSendPaymentReminder(id, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to send payment reminder')
  }
}

/**
 * Send order status update notification
 */
export const sendOrderStatusUpdate = async (
  id: number,
  query?: {
    status?: string
    providerId?: number
  }
): Promise<void> => {
  try {
    await apiClient.api.postOrderSendOrderStatusUpdate(id, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to send order status update')
  }
}

/**
 * Generate order invoice
 */
export const generateOrderInvoice = async (
  id: number,
  query?: {
    providerId?: number
  }
): Promise<ServiceInvoiceResponse> => {
  try {
    const response = await apiClient.api.getOrderGenerateOrderInvoice(id, query)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data && typeof responseAny.data.data === 'object' && 'orderId' in responseAny.data.data) {
      return responseAny.data.data as ServiceInvoiceResponse
    }
    if (responseAny?.data && typeof responseAny.data === 'object' && 'orderId' in responseAny.data) {
      return responseAny.data as ServiceInvoiceResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'orderId' in responseAny) {
      return responseAny as ServiceInvoiceResponse
    }
    
    throw new Error('Failed to extract invoice data from API response.')
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to generate order invoice')
  }
}

/**
 * Generate payment receipt
 */
export const generatePaymentReceipt = async (
  id: number,
  paymentId: number,
  query?: {
    providerId?: number
  }
): Promise<ServiceReceiptResponse> => {
  try {
    const response = await apiClient.api.getOrderGeneratePaymentReceipt(id, paymentId, query)
    return (response?.data ?? response) as unknown as ServiceReceiptResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to generate payment receipt')
  }
}

/**
 * Download order invoice as PDF blob
 * Uses the download endpoint: /api/v1/orders/{id}/documents/invoice/download
 * This endpoint returns a PDF document blob for download
 */
export const downloadOrderInvoice = async (
  id: number,
  query?: {
    providerId?: number
  }
): Promise<Blob> => {
  try {
    // Get base URL
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || 'http://localhost:5001'
    const baseUrl = baseURL.replace(/\/$/, '').replace(/\/api\/v1$/, '')
    
    // Build query string
    const queryParams = new URLSearchParams()
    if (query?.providerId) {
      queryParams.append('providerId', query.providerId.toString())
    }
    const language = getApiLanguage()
    queryParams.append('lang', language)
    const queryString = queryParams.toString()
    
    // Build full URL
    const url = `${baseUrl}/api/v1/orders/${id}/documents/invoice/download${queryString ? `?${queryString}` : ''}`
    
    // Get token for authorization
    const token = getToken()
    
    // Make request with blob response type using axios directly
    const response = await axios.get(url, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf',
        ...(token && { Authorization: `Bearer ${token}` }),
        'Accept-Language': language,
      },
    })
    
    // Extract blob from response
    if (response.data instanceof Blob) {
      return response.data
    }
    
    // If response.data is an ArrayBuffer, convert to Blob
    if (response.data instanceof ArrayBuffer) {
      return new Blob([response.data], { type: 'application/pdf' })
    }
    
    // Fallback: try to create blob from response data
    return new Blob([response.data], { type: 'application/pdf' })
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to download order invoice')
  }
}

/**
 * Download payment receipt as PDF blob
 */
export const downloadPaymentReceipt = async (
  id: number,
  paymentId: number,
  query?: {
    providerId?: number
  }
): Promise<Blob> => {
  try {
    // Get base URL
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || 'http://localhost:5001'
    const baseUrl = baseURL.replace(/\/$/, '').replace(/\/api\/v1$/, '')
    
    // Build query string
    const queryParams = new URLSearchParams()
    if (query?.providerId) {
      queryParams.append('providerId', query.providerId.toString())
    }
    const language = getApiLanguage()
    queryParams.append('lang', language)
    const queryString = queryParams.toString()
    
    // Build full URL
    const url = `${baseUrl}/api/v1/orders/${id}/payments/${paymentId}/documents/receipt/download${queryString ? `?${queryString}` : ''}`
    
    // Get token for authorization
    const token = getToken()
    
    // Make request with blob response type using axios directly
    const response = await axios.get(url, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf',
        ...(token && { Authorization: `Bearer ${token}` }),
        'Accept-Language': language,
      },
    })
    
    // Extract blob from response
    if (response.data instanceof Blob) {
      return response.data
    }
    
    // If response.data is an ArrayBuffer, convert to Blob
    if (response.data instanceof ArrayBuffer) {
      return new Blob([response.data], { type: 'application/pdf' })
    }
    
    // Fallback: try to create blob from response data
    return new Blob([response.data], { type: 'application/pdf' })
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to download payment receipt')
  }
}

/**
 * Generate order report
 */
export const generateOrderReport = async (
  id: number,
  query?: {
    providerId?: number
  }
): Promise<ServiceOrderResponse> => {
  try {
    const response = await apiClient.api.getOrderGenerateOrderReport(id, query)
    const responseAny: any = response
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as ServiceOrderResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to generate order report')
  }
}

// ============================================================================
// Order Review API functions
// ============================================================================

/**
 * Submit order review
 */
export const submitOrderReview = async (
  orderId: number,
  data: CreateOrderReviewRequest
): Promise<ReviewResponse> => {
  try {
    const response = await apiClient.api.postOrderReviewSubmitOrderReview(orderId, data)
    return (response?.data ?? response) as unknown as ReviewResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to submit order review')
  }
}

/**
 * Get order reviews
 */
export const getOrderReviews = async (orderId: number): Promise<ReviewResponse[]> => {
  try {
    const response = await apiClient.api.getOrderReviewGetOrderReviews(orderId)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data?.data)) {
      return responseAny.data.data as ReviewResponse[]
    }
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as ReviewResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ReviewResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as ReviewResponse[]
    }
    
    // Return empty array if no reviews found
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch order reviews')
  }
}

/**
 * Get order review by ID
 */
export const getOrderReviewById = async (reviewId: number): Promise<ReviewResponse> => {
  try {
    const response = await apiClient.api.getOrderReviewGetOrderReviewById(reviewId)
    return (response?.data ?? response) as unknown as ReviewResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch order review')
  }
}

/**
 * Update order review
 */
export const updateOrderReview = async (
  reviewId: number,
  data: CreateOrderReviewRequest
): Promise<ReviewResponse> => {
  try {
    const response = await apiClient.api.putOrderReviewUpdateOrderReview(reviewId, data)
    return (response?.data ?? response) as unknown as ReviewResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update order review')
  }
}

/**
 * Delete order review
 */
export const deleteOrderReview = async (reviewId: number): Promise<void> => {
  try {
    await apiClient.api.deleteOrderReviewDeleteOrderReview(reviewId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete order review')
  }
}
