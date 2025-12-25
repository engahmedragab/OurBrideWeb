// Order API service functions

import { apiClient } from '@/services/api/apiClient'
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
  providerId?: number
}): Promise<PaginatedList<OrderResponse>> => {
  try {
    const response = await apiClient.api.getOrderGetClientOrders(query)
    return (response?.data ?? response) as unknown as PaginatedList<OrderResponse>
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
    return (response?.data ?? response) as unknown as OrderResponse
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
    return response?.data ?? response
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
    return response?.data ?? response
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
    return response?.data ?? response
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
    return response?.data ?? response
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
    return response?.data ?? response
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
    return response?.data ?? response
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
export const searchOrders = async (
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
    return response?.data ?? response
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
    return (response?.data ?? response) as unknown as ServiceInvoiceResponse
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
 * Download order invoice
 */
export const downloadOrderInvoice = async (
  id: number,
  query?: {
    providerId?: number
  }
): Promise<ServiceOrderResponse> => {
  try {
    const response = await apiClient.api.getOrderDownloadOrderInvoice(id, query)
    return response?.data ?? response
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to download order invoice')
  }
}

/**
 * Download payment receipt
 */
export const downloadPaymentReceipt = async (
  id: number,
  paymentId: number,
  query?: {
    providerId?: number
  }
): Promise<Blob> => {
  try {
    const response = await apiClient.api.getOrderDownloadPaymentReceipt(id, paymentId, query)
    return (response?.data ?? response) as unknown as Blob
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
    return response?.data ?? response
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
    return (response?.data ?? response) as unknown as ReviewResponse[]
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
