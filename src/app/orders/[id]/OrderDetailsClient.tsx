'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, ExternalLink, FileText, Download, Star, MessageSquare } from 'lucide-react'
import { UserPageLayout } from '@/components/layout'
import {
    PageHeader,
    ErrorDisplay,
    LoadingOverlay,
    StatusBadge,
    OrderProgressIndicator,
    Button,
    RatingInput,
    RatingDisplay,
    Input,
} from '@/components/ui'
import { useToast } from '@/components/ui/Toaster'
import { getOrderById } from '@/services/api/orderApi'
import { useDownloadOrderInvoice, useOrderReviews, useSubmitOrderReview } from '@/hooks/orders'
import { useSubmitProductReview } from '@/hooks/products/useProductReviews'
import { useSubmitServiceReview } from '@/hooks/services/useServiceReviews'
import type { OrderResponse, PurchaseResponse, ReviewResponse } from '@/types/responses'
import { OrderStatus, PurchaseType } from '@/../client/common/api/gen/ourbride-api'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

interface OrderDetailsClientProps {
    orderId: string
}

const mapOrderStatusToBadgeType = (
    status: OrderStatus | string
): 'completed' | 'cancelled' | 'inProgress' => {
    const statusStr = String(status).toLowerCase()
    if (statusStr === 'completed' || statusStr === 'delivered') return 'completed'
    if (statusStr === 'cancelled' || statusStr === 'canceled') return 'cancelled'
    return 'inProgress'
}

const mapApiOrderStatusToComponentStatus = (
    status: OrderStatus | string
): 'preparing' | 'onTheWay' | 'received' | 'delivered' | 'cancelled' => {
    const statusStr = String(status).toLowerCase()
    if (statusStr === 'preparing') return 'preparing'
    if (statusStr === 'ontheway' || statusStr === 'on the way' || statusStr === 'shipped') return 'onTheWay'
    if (statusStr === 'received') return 'received'
    if (statusStr === 'delivered' || statusStr === 'completed') return 'delivered'
    if (statusStr === 'cancelled' || statusStr === 'canceled') return 'cancelled'
    return 'preparing'
}

const getStatusLineColor = (status: OrderStatus | string) => {
    const statusStr = String(status).toLowerCase()
    if (statusStr === 'completed' || statusStr === 'delivered') return 'border-l-4 border-green-500'
    if (statusStr === 'cancelled' || statusStr === 'canceled') return 'border-l-4 border-red-500'
    return 'border-l-4 border-yellow-500'
}

export function OrderDetailsClient({ orderId }: OrderDetailsClientProps) {
    const router = useRouter()
    const { addToast } = useToast()
    const [isMounted, setIsMounted] = useState(false)
    const [isSummaryOpen, setIsSummaryOpen] = useState(true)

    // Review states for order
    const [orderReviewRating, setOrderReviewRating] = useState(0)
    const [orderReviewComment, setOrderReviewComment] = useState('')
    const [orderReviewTitle, setOrderReviewTitle] = useState('')
    const [showOrderReviewForm, setShowOrderReviewForm] = useState(false)

    // Review states for items (purchases)
    const [itemReviews, setItemReviews] = useState<Record<number, {
        rating: number
        comment: string
        title: string
        showForm: boolean
    }>>({})

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const orderIdNum = parseInt(orderId, 10)
    const downloadInvoiceMutation = useDownloadOrderInvoice()

    // Fetch order reviews
    const { data: orderReviews = [], isLoading: isLoadingReviews } = useOrderReviews(
        isNaN(orderIdNum) ? null : orderIdNum,
        isMounted && !isNaN(orderIdNum)
    )

    // Submit order review mutation
    const submitOrderReviewMutation = useSubmitOrderReview()

    // Submit product review mutation
    const submitProductReviewMutation = useSubmitProductReview()

    // Submit service review mutation
    const submitServiceReviewMutation = useSubmitServiceReview()

    const handleDownloadInvoice = () => {
        if (!isNaN(orderIdNum)) {
            downloadInvoiceMutation.mutate(
                { orderId: orderIdNum },
                {
                    onSuccess: () => {
                        addToast('Invoice downloaded successfully', 'success')
                    },
                    onError: (error: Error) => {
                        addToast(error.message || 'Failed to download invoice', 'error')
                    },
                }
            )
        }
    }

    // Fetch order details
    const { data: order, isLoading, error } = useQuery<OrderResponse | null>({
        queryKey: ['order', orderId],
        queryFn: async () => {
            const id = parseInt(orderId, 10)
            if (isNaN(id)) {
                throw new Error('Invalid order ID')
            }
            const data = await getOrderById(id)
            return data
        },
        enabled: isMounted && !!orderId,
        staleTime: 1 * 60 * 1000, // 1 minute
    })

    // Show loading state
    if (!isMounted || isLoading) {
        return (
            <UserPageLayout>
                <PageHeader title="Order Details" />
                <LoadingOverlay
                    open={true}
                    title="Loading order..."
                    subtitle="Please wait a moment"
                />
            </UserPageLayout>
        )
    }

    // Show error state
    if (error || !order) {
        return (
            <UserPageLayout>
                <PageHeader title="Order Details" />
                <ErrorDisplay
                    title="Order not found"
                    message="The order you're looking for doesn't exist or has been removed"
                    actionLabel="Back to Orders"
                    actionHref="/orders"
                />
            </UserPageLayout>
        )
    }

    const status = order.status
    const isCompleted = order.isCompleted || order.isCancelled

    // ============================================
    // DATE FORMATTING
    // ============================================
    // Format order date - when the order was placed
    const orderDate = order.orderDate
        ? new Date(order.orderDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : null

    // Format delivery date - expected delivery date
    const deliveryDate = order.deliveryDate
        ? new Date(order.deliveryDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : null

    // Format delivery time - expected delivery time
    const deliveryTime = order.deliveryDate
        ? new Date(order.deliveryDate).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })
        : null

    // Format preferred delivery date - customer's preferred delivery date
    const preferredDeliveryDate = order.preferredDeliveryDate
        ? new Date(order.preferredDeliveryDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : null

    // Format creation date - when the order was created in the system
    const creationDate = order.creationDate
        ? new Date(order.creationDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : null

    // Format last modified date - when the order was last updated
    const lastModifiedDate = order.lastModifiedDate
        ? new Date(order.lastModifiedDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : null

    // Format delivery start date - when delivery process starts
    const startDeliveryDate = order.delivery?.startDeliveryDate
        ? new Date(order.delivery.startDeliveryDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : null

    // Format delivery date from delivery object - actual delivery date
    const deliveryDeliveryDate = order.delivery?.deliveryDate
        ? new Date(order.delivery.deliveryDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : null

    // ============================================
    // PURCHASES DATA
    // ============================================
    // Get all purchases - include all purchases, not just those with product/service objects
    const purchases = order.purchases || []
    // Filter product purchases - items that are products
    const productPurchases = purchases.filter((p: PurchaseResponse) => p.type === PurchaseType.Product)
    // Filter service purchases - items that are services
    const servicePurchases = purchases.filter((p: PurchaseResponse) => p.type === PurchaseType.Service)
    // Total item count - count of all items in the order
    const totalItemCount = purchases.reduce((sum, p) => sum + (p.quantity || 0), 0)

    // ============================================
    // PROVIDER INFORMATION
    // ============================================
    // Provider name - name of the provider/vendor
    const providerName = order.providerName || null
    // Provider logo - logo image URL of the provider
    const providerLogo = order.providerLogo || null
    // Provider ID - unique identifier for the provider
    const providerId = order.providerId || null

    // ============================================
    // CLIENT INFORMATION
    // ============================================
    // Client name - name of the customer who placed the order
    const clientName = order.clientName || null
    // Client email - email address of the customer
    const clientEmail = order.clientEmail || null
    // Client phone - phone number of the customer
    const clientPhone = order.clientPhone || null
    // Client ID - unique identifier for the client
    const clientId = order.clientId || null

    // ============================================
    // CREATED BY INFORMATION
    // ============================================
    // Created by user name - name of the user who created the order
    const createdByUserName = order.createdByUserName || null
    // Created by user email - email of the user who created the order
    const createdByUserEmail = order.createdByUserEmail || null
    // Created by user phone - phone of the user who created the order
    const createdByUserPhone = order.createdByUserPhone || null
    // Created by user ID - unique identifier for the user who created the order
    const createdBy = order.createdBy || null

    // ============================================
    // PRICE BREAKDOWN
    // ============================================
    // Subtotal - total price before taxes, shipping, and discounts
    const subtotal = order.orderSummary?.subtotal || order.totalAmount || 0
    // Tax amount - taxes and fees applied to the order
    const taxAmount = order.taxAmount || order.orderSummary?.tax || 0
    // Shipping amount - delivery/shipping fees
    const shippingAmount = order.shippingAmount || order.orderSummary?.shipping || 0
    // Discount amount - total discount applied to the order
    const discountAmount = order.discountAmount || order.orderSummary?.discount || 0
    // Deposit amount - initial deposit paid for the order
    const depositAmount = order.depositAmount || 0
    // Final amount - total amount to be paid (after all calculations)
    const finalAmount = order.finalAmount || order.orderSummary?.total || 0
    // Price - base price of the order
    const price = order.price || 0
    // Count - number of items in the order
    const count = order.count || 0

    // ============================================
    // PAYMENT INFORMATION
    // ============================================
    // Payment method - how the customer is paying (CASH, CARD, etc.)
    const paymentMethod = order.paymentMethod || null
    // Payment status - current status of the payment
    const paymentStatus = order.paymentStatus || null
    // Payment status text - human-readable payment status
    const paymentStatusText = order.paymentStatusText || null
    // Coupon code - discount coupon code used (if any)
    const couponCode = order.couponCode || null
    // Total paid amount - amount already paid by the customer
    const totalPaidAmount = order.totalPaidAmount || 0
    // Total remaining amount - amount still owed by the customer
    const totalRemainingAmount = order.totalRemainingAmount || 0
    // Payment progress percentage - percentage of payment completed
    const paymentProgressPercentage = order.paymentProgressPercentage || 0
    // Paid amount - amount paid (alternative field)
    const paidAmount = order.paidAmount || null

    // ============================================
    // PAYMENT PLAN INFORMATION
    // ============================================
    // Has payment plan - whether the order has a payment plan
    const hasPaymentPlan = order.hasPaymentPlan || false
    // Payment plan name - name of the payment plan (if applicable)
    const paymentPlanName = order.paymentPlanName || null
    // Number of payments - total number of payments in the plan
    const numberOfPayments = order.numberOfPayments || null
    // Payment plan status - current status of the payment plan
    const paymentPlanStatus = order.paymentPlanStatus || null
    // First payment date - date of the first payment
    const firstPaymentDate = order.firstPaymentDate
        ? new Date(order.firstPaymentDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : null
    // Last payment date - date of the last payment
    const lastPaymentDate = order.lastPaymentDate
        ? new Date(order.lastPaymentDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : null

    // ============================================
    // DELIVERY INFORMATION
    // ============================================
    // Delivery status - current status of the delivery
    const deliveryStatus = order.deliveryStatus || null
    // Delivery ID - unique identifier for the delivery
    const deliveryId = order.deliveryId || null
    // Delivery object - full delivery information
    const delivery = order.delivery || null
    // Delivery object status - status from the delivery object
    const deliveryObjectStatus = delivery?.status || null

    // ============================================
    // ORDER FLAGS AND STATUS
    // ============================================
    // Is urgent - whether this is an urgent order
    const isUrgent = order.isUrgent || false
    // Requires client confirmation - whether client needs to confirm the order
    const requireClientConfirmation = order.requireClientConfirmation || false
    // Client confirmed - whether the client has confirmed the order
    const clientConfirmed = order.clientConfirmed || false
    // Is active - whether the order is currently active
    const isActive = order.isActive || false
    // Is overdue - whether the order is overdue
    const isOverdue = order.isOverdue || false
    // Days overdue - number of days the order is overdue
    const daysOverdue = order.daysOverdue || 0

    // ============================================
    // NOTES AND COMMENTS
    // ============================================
    // Order comment - general comment about the order
    const orderComment = order.comment || null
    // Order notes - notes added to the order
    const orderNotes = order.orderNotes || null
    // Provider notes - notes from the provider about the order
    const providerNotes = order.providerNotes || null

    // ============================================
    // ADDITIONAL ORDER INFORMATION
    // ============================================
    // Order ID string - string identifier for the order (e.g., "ORD-20251229-401-59826a53")
    const orderIdString = order.orderId || null
    // Order number - human-readable order number
    const orderNumber = order.orderNumber || null
    // Cart ID - ID of the cart this order was created from
    const cartId = order.cartId || null
    // Checkout order ID - ID of the checkout order
    const checkoutOrderId = order.checkoutOrderId || null
    // Payment plan ID - ID of the payment plan (if applicable)
    const paymentPlanId = order.paymentPlanId || null
    // Slug - URL-friendly identifier for the order
    const slug = order.slug || null

    // Map order status to component status
    const componentStatus = mapApiOrderStatusToComponentStatus(status)

    return (
        <UserPageLayout>
            <PageHeader title="Order Details" />

            {/* Main Order Card - Similar to RequestCard */}
            <div
                className={cn(
                    'bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative',
                    getStatusLineColor(status)
                )}
            >
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Section - Order Info and Progress */}
                    <div className="flex-1">
                        {/* Status Badge - Top Right */}
                        <div className="absolute top-6 right-6 flex items-center gap-2">
                            <StatusBadge status={mapOrderStatusToBadgeType(status)} />
                            <button
                                onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label={
                                    isSummaryOpen
                                        ? 'Collapse order summary'
                                        : 'Expand order summary'
                                }
                            >
                                {isSummaryOpen ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronUp className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {/* ============================================
                            ORDER BASIC INFORMATION
                            ============================================ */}
                        <div className="mb-6 pr-32">
                            {/* Order Number/ID */}
                            <h3 className="text-18 font-semibold text-gray-900 mb-1">
                                Order #{orderNumber || orderIdString || order.id}
                            </h3>

                            {/* Order Date - When the order was placed */}
                            <p className="text-14 text-gray-600 mb-2">
                                Placed: {orderDate || 'N/A'}
                            </p>

                            {/* Order ID String - System order identifier */}
                            {orderIdString && (
                                <p className="text-12 text-gray-500 mb-2">
                                    Order ID: {orderIdString}
                                </p>
                            )}

                            {/* Item Count - Total number of items */}
                            <p className="text-12 text-gray-500 mb-2">
                                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} • Count: {count}
                            </p>

                            {/* Provider Link - Link to provider page */}
                            {providerId && (
                                <div className="flex items-center gap-2 mb-2">
                                    {providerLogo && (
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                            <Image
                                                src={providerLogo}
                                                alt={providerName || 'Provider'}
                                                fill
                                                sizes="32px"
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <Link
                                        href={`/provider/${providerId}`}
                                        className="text-14 text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-1"
                                    >
                                        {providerName || 'Provider'}
                                        <ExternalLink className="h-3 w-3" />
                                    </Link>
                                </div>
                            )}

                            {/* Urgent Order Badge */}
                            {isUrgent && (
                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-12 font-medium mb-2">
                                    ⚠️ Urgent Order
                                </div>
                            )}

                            {/* Client Confirmation Status */}
                            {requireClientConfirmation && (
                                <div className="text-12 text-gray-600 mb-2">
                                    Client Confirmation: {clientConfirmed ? (
                                        <span className="text-green-600 font-medium">Confirmed</span>
                                    ) : (
                                        <span className="text-yellow-600 font-medium">Pending</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Progress Indicator */}
                        <div className="mb-6">
                            <OrderProgressIndicator status={componentStatus} />
                        </div>
                    </div>

                    {/* Right Section - Order Summary */}
                    <div className="flex-1 lg:max-w-md">
                        {/* ============================================
                            DELIVERY INFORMATION
                            ============================================ */}
                        {/* Expected Delivery Date/Time */}
                        {deliveryDate && (
                            <div className="text-14 text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-900 mb-1">Expected Delivery:</p>
                                <p>
                                    {deliveryDate}
                                    {deliveryTime && ` ${deliveryTime}`}
                                </p>
                            </div>
                        )}

                        {/* Preferred Delivery Date - Customer's preferred date */}
                        {preferredDeliveryDate && (
                            <div className="text-14 text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg">
                                <p className="font-medium text-gray-900 mb-1">Preferred Delivery:</p>
                                <p>{preferredDeliveryDate}</p>
                            </div>
                        )}

                        {/* Delivery Status - Current delivery status */}
                        {deliveryStatus && (
                            <div className="text-14 text-gray-600 mb-4">
                                <p>
                                    <span className="font-medium">Delivery Status:</span> {deliveryStatus}
                                </p>
                            </div>
                        )}

                        {/* Delivery Object Information */}
                        {delivery && (
                            <div className="text-14 text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-900 mb-2">Delivery Details:</p>
                                {startDeliveryDate && (
                                    <p className="text-12 mb-1">Start: {startDeliveryDate}</p>
                                )}
                                {deliveryDeliveryDate && (
                                    <p className="text-12 mb-1">Delivery: {deliveryDeliveryDate}</p>
                                )}
                                {deliveryObjectStatus && (
                                    <p className="text-12">Status: {deliveryObjectStatus}</p>
                                )}
                            </div>
                        )}

                        {/* Collapsible Order Summary */}
                        {isSummaryOpen && (
                            <>
                                <h4 className="text-16 font-semibold text-gray-900 mb-4">
                                    Order Summary
                                </h4>

                                {/* Products/Services List */}
                                <div className="space-y-3 mb-4">
                                    {productPurchases.map((purchase: PurchaseResponse) => {
                                        const product = purchase.product
                                        const displayName = product?.nameEn || product?.nameAr || purchase.nameEn || purchase.nameAr || purchase.name || 'Product'
                                        const displayImage = product?.image || purchase.imageUrl || ''

                                        return (
                                            <div
                                                key={purchase.id}
                                                className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200"
                                            >
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                                    {displayImage && displayImage.trim() !== '' ? (
                                                        <Image
                                                            src={displayImage}
                                                            alt={displayName}
                                                            fill
                                                            sizes="64px"
                                                            className="object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-10">
                                                            No img
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-14 font-medium text-gray-900 truncate">
                                                        {displayName}
                                                    </p>
                                                    <p className="text-14 text-gray-600">
                                                        {purchase.totalPrice?.toLocaleString() || purchase.price?.toLocaleString() || '0'} EGP × {purchase.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {servicePurchases.map((purchase: PurchaseResponse) => {
                                        const service = purchase.service
                                        const displayName = service?.nameEn || service?.nameAr || purchase.nameEn || purchase.nameAr || purchase.name || 'Service'
                                        const displayImage = service?.imageUrl || purchase.imageUrl || ''

                                        return (
                                            <div
                                                key={purchase.id}
                                                className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200"
                                            >
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                                    {displayImage && displayImage.trim() !== '' ? (
                                                        <Image
                                                            src={displayImage}
                                                            alt={displayName}
                                                            fill
                                                            sizes="64px"
                                                            className="object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-10">
                                                            No img
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-14 font-medium text-gray-900 truncate">
                                                        {displayName}
                                                    </p>
                                                    <p className="text-14 text-gray-600">
                                                        {purchase.totalPrice?.toLocaleString() || purchase.price?.toLocaleString() || '0'} EGP
                                                        {purchase.quantity > 1 && ` × ${purchase.quantity}`}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-2 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-14 text-gray-700">
                                        <span>Subtotal:</span>
                                        <span className="font-semibold text-gray-900">
                                            {subtotal.toLocaleString()} EGP
                                        </span>
                                    </div>
                                    {taxAmount > 0 && (
                                        <div className="flex justify-between text-14 text-gray-700">
                                            <span>Taxes & Fees:</span>
                                            <span className="font-semibold text-gray-900">
                                                {taxAmount.toLocaleString()} EGP
                                            </span>
                                        </div>
                                    )}
                                    {shippingAmount > 0 && (
                                        <div className="flex justify-between text-14 text-gray-700">
                                            <span>Shipping:</span>
                                            <span className="font-semibold text-gray-900">
                                                {shippingAmount.toLocaleString()} EGP
                                            </span>
                                        </div>
                                    )}
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-14 text-green-600">
                                            <span>Discount:</span>
                                            <span className="font-semibold">
                                                -{discountAmount.toLocaleString()} EGP
                                            </span>
                                        </div>
                                    )}
                                    {depositAmount > 0 && (
                                        <div className="flex justify-between text-14 text-gray-700">
                                            <span>Deposit:</span>
                                            <span className="font-semibold text-gray-900">
                                                {depositAmount.toLocaleString()} EGP
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-16 font-semibold text-gray-900 pt-2 border-t border-gray-200">
                                        <span>Total:</span>
                                        <span>{finalAmount.toLocaleString()} EGP</span>
                                    </div>
                                </div>

                                {/* ============================================
                                    PAYMENT INFORMATION
                                    ============================================ */}
                                {/* Payment Method and Status */}
                                {(paymentMethod || paymentStatus || paymentStatusText) && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h5 className="text-14 font-semibold text-gray-900 mb-2">Payment Information</h5>
                                        {paymentMethod && (
                                            <div className="flex justify-between text-14 text-gray-700 mb-1">
                                                <span>Payment Method:</span>
                                                <span className="font-medium">{paymentMethod}</span>
                                            </div>
                                        )}
                                        {paymentStatusText && (
                                            <div className="flex justify-between text-14 text-gray-700 mb-1">
                                                <span>Payment Status:</span>
                                                <span className="font-medium">{paymentStatusText}</span>
                                            </div>
                                        )}
                                        {paymentStatus && !paymentStatusText && (
                                            <div className="flex justify-between text-14 text-gray-700 mb-1">
                                                <span>Payment Status:</span>
                                                <span className="font-medium">{paymentStatus}</span>
                                            </div>
                                        )}
                                        {couponCode && (
                                            <div className="flex justify-between text-14 text-gray-700 mb-1">
                                                <span>Coupon Code:</span>
                                                <span className="font-medium text-green-600">{couponCode}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Payment Amounts */}
                                {totalPaidAmount > 0 || totalRemainingAmount > 0 || paidAmount ? (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h5 className="text-14 font-semibold text-gray-900 mb-2">Payment Summary</h5>
                                        {totalPaidAmount > 0 && (
                                            <div className="flex justify-between text-14 text-gray-700 mb-2">
                                                <span>Paid Amount:</span>
                                                <span className="font-semibold text-gray-900">
                                                    {totalPaidAmount.toLocaleString()} EGP
                                                </span>
                                            </div>
                                        )}
                                        {paidAmount && paidAmount !== totalPaidAmount && (
                                            <div className="flex justify-between text-14 text-gray-700 mb-2">
                                                <span>Paid (Alt):</span>
                                                <span className="font-semibold text-gray-900">
                                                    {paidAmount.toLocaleString()} EGP
                                                </span>
                                            </div>
                                        )}
                                        {totalRemainingAmount > 0 && (
                                            <div className="flex justify-between text-14 text-gray-700 mb-2">
                                                <span>Remaining Amount:</span>
                                                <span className="font-semibold text-gray-900">
                                                    {totalRemainingAmount.toLocaleString()} EGP
                                                </span>
                                            </div>
                                        )}
                                        {paymentProgressPercentage > 0 && (
                                            <div className="mt-3">
                                                <div className="flex justify-between text-12 text-gray-600 mb-1">
                                                    <span>Payment Progress</span>
                                                    <span>{paymentProgressPercentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-brand-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${paymentProgressPercentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : null}

                                {/* ============================================
                                    PAYMENT PLAN INFORMATION
                                    ============================================ */}
                                {hasPaymentPlan && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h5 className="text-14 font-semibold text-gray-900 mb-2">Payment Plan</h5>
                                        {paymentPlanName && (
                                            <div className="flex justify-between text-14 text-gray-700 mb-1">
                                                <span>Plan Name:</span>
                                                <span className="font-medium">{paymentPlanName}</span>
                                            </div>
                                        )}
                                        {numberOfPayments && (
                                            <div className="flex justify-between text-14 text-gray-700 mb-1">
                                                <span>Number of Payments:</span>
                                                <span className="font-medium">{numberOfPayments}</span>
                                            </div>
                                        )}
                                        {firstPaymentDate && (
                                            <div className="flex justify-between text-14 text-gray-700 mb-1">
                                                <span>First Payment:</span>
                                                <span className="font-medium">{firstPaymentDate}</span>
                                            </div>
                                        )}
                                        {lastPaymentDate && (
                                            <div className="flex justify-between text-14 text-gray-700 mb-1">
                                                <span>Last Payment:</span>
                                                <span className="font-medium">{lastPaymentDate}</span>
                                            </div>
                                        )}
                                        {paymentPlanStatus && (
                                            <div className="flex justify-between text-14 text-gray-700 mb-1">
                                                <span>Plan Status:</span>
                                                <span className="font-medium">{paymentPlanStatus}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ============================================
                                    CLIENT INFORMATION
                                    ============================================ */}
                                {(clientName || clientEmail || clientPhone) && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h5 className="text-14 font-semibold text-gray-900 mb-2">Client Information</h5>
                                        {clientName && (
                                            <p className="text-14 text-gray-700 mb-1">Name: {clientName}</p>
                                        )}
                                        {clientEmail && (
                                            <p className="text-14 text-gray-700 mb-1">Email: {clientEmail}</p>
                                        )}
                                        {clientPhone && (
                                            <p className="text-14 text-gray-700 mb-1">Phone: {clientPhone}</p>
                                        )}
                                    </div>
                                )}

                                {/* ============================================
                                    CREATED BY INFORMATION
                                    ============================================ */}
                                {(createdByUserName || createdByUserEmail || createdByUserPhone) && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h5 className="text-14 font-semibold text-gray-900 mb-2">Created By</h5>
                                        {createdByUserName && (
                                            <p className="text-14 text-gray-700 mb-1">Name: {createdByUserName}</p>
                                        )}
                                        {createdByUserEmail && (
                                            <p className="text-14 text-gray-700 mb-1">Email: {createdByUserEmail}</p>
                                        )}
                                        {createdByUserPhone && (
                                            <p className="text-14 text-gray-700 mb-1">Phone: {createdByUserPhone}</p>
                                        )}
                                    </div>
                                )}

                                {/* ============================================
                                    NOTES AND COMMENTS
                                    ============================================ */}
                                {(orderComment || orderNotes || providerNotes) && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h5 className="text-14 font-semibold text-gray-900 mb-2">Notes & Comments</h5>
                                        {orderComment && (
                                            <div className="mb-2">
                                                <p className="text-12 text-gray-600 mb-1">Order Comment:</p>
                                                <p className="text-14 text-gray-700">{orderComment}</p>
                                            </div>
                                        )}
                                        {orderNotes && (
                                            <div className="mb-2">
                                                <p className="text-12 text-gray-600 mb-1">Order Notes:</p>
                                                <p className="text-14 text-gray-700">{orderNotes}</p>
                                            </div>
                                        )}
                                        {providerNotes && (
                                            <div>
                                                <p className="text-12 text-gray-600 mb-1">Provider Notes:</p>
                                                <p className="text-14 text-gray-700">{providerNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ============================================
                                    ADDITIONAL INFORMATION
                                    ============================================ */}
                                {(cartId || checkoutOrderId || paymentPlanId || creationDate || lastModifiedDate || isOverdue) && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h5 className="text-14 font-semibold text-gray-900 mb-2">Additional Information</h5>
                                        {cartId && (
                                            <p className="text-12 text-gray-600 mb-1">Cart ID: {cartId}</p>
                                        )}
                                        {checkoutOrderId && (
                                            <p className="text-12 text-gray-600 mb-1">Checkout Order ID: {checkoutOrderId}</p>
                                        )}
                                        {paymentPlanId && (
                                            <p className="text-12 text-gray-600 mb-1">Payment Plan ID: {paymentPlanId}</p>
                                        )}
                                        {creationDate && (
                                            <p className="text-12 text-gray-600 mb-1">Created: {creationDate}</p>
                                        )}
                                        {lastModifiedDate && (
                                            <p className="text-12 text-gray-600 mb-1">Last Modified: {lastModifiedDate}</p>
                                        )}
                                        {isOverdue && (
                                            <p className="text-12 text-orange-600 font-medium mb-1">
                                                ⚠️ Overdue: {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'}
                                            </p>
                                        )}
                                        {!isActive && (
                                            <p className="text-12 text-gray-500 mb-1">Status: Inactive</p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ============================================
                ORDER ACTIONS - INVOICE BUTTONS (LARGER SIZE)
                ============================================ */}
            <div className="mt-6 flex flex-wrap gap-3">
                {/* View Invoice Button - Navigate to invoice page */}
                <Button
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2 px-6 py-3 text-16 font-semibold"
                    onClick={() => router.push(`/orders/${orderId}/invoice`)}
                >
                    <FileText className="h-5 w-5" />
                    View Invoice
                </Button>

                {/* Download Invoice Button - Download invoice as PDF */}
                <Button
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2 px-6 py-3 text-16 font-semibold"
                    onClick={handleDownloadInvoice}
                    disabled={downloadInvoiceMutation.isPending || isNaN(orderIdNum)}
                >
                    <Download className="h-5 w-5" />
                    {downloadInvoiceMutation.isPending ? 'Downloading...' : 'Download Invoice'}
                </Button>

                {/* Back to Orders Button - Return to orders list */}
                <Button
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2 px-6 py-3 text-16 font-semibold"
                    onClick={() => router.push('/orders')}
                >
                    Back to Orders
                </Button>
            </div>

            {/* ============================================
                ORDER REVIEWS SECTION
                ============================================ */}
            <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-20 font-semibold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Order Reviews & Comments
                        {orderReviews.length > 0 && (
                            <span className="text-14 font-normal text-gray-500">
                                ({orderReviews.length})
                            </span>
                        )}
                    </h3>
                    {!showOrderReviewForm && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowOrderReviewForm(true)}
                        >
                            Add Review
                        </Button>
                    )}
                </div>

                {/* ============================================
                    SUBMIT ORDER REVIEW FORM
                    ============================================ */}
                {showOrderReviewForm && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="text-16 font-semibold text-gray-900 mb-4">Write Your Review</h4>

                        {/* Rating Input */}
                        <div className="mb-4">
                            <label className="text-14 font-medium text-gray-700 mb-2 block">
                                Rating *
                            </label>
                            <div className="flex justify-center">
                                <RatingInput
                                    rating={orderReviewRating}
                                    onRatingChange={setOrderReviewRating}
                                    size="lg"
                                    color="brand"
                                />
                            </div>
                        </div>

                        {/* Review Title */}
                        <div className="mb-4">
                            <label className="text-14 font-medium text-gray-700 mb-2 block">
                                Review Title
                            </label>
                            <Input
                                value={orderReviewTitle}
                                onChange={(e) => setOrderReviewTitle(e.target.value)}
                                placeholder="Enter a title for your review (optional)"
                                className="w-full"
                            />
                        </div>

                        {/* Review Comment */}
                        <div className="mb-4">
                            <label className="text-14 font-medium text-gray-700 mb-2 block">
                                Your Review *
                            </label>
                            <textarea
                                value={orderReviewComment}
                                onChange={(e) => setOrderReviewComment(e.target.value)}
                                placeholder="Share your experience with this order..."
                                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                                rows={4}
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setShowOrderReviewForm(false)
                                    setOrderReviewRating(0)
                                    setOrderReviewComment('')
                                    setOrderReviewTitle('')
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="brand"
                                size="sm"
                                onClick={async () => {
                                    if (orderReviewRating > 0 && orderReviewComment.trim() && !isNaN(orderIdNum)) {
                                        try {
                                            await submitOrderReviewMutation.mutateAsync({
                                                orderId: orderIdNum,
                                                data: {
                                                    orderId: orderIdNum,
                                                    rating: orderReviewRating,
                                                    review: orderReviewComment.trim(),
                                                    title: orderReviewTitle.trim() || null,
                                                },
                                            })
                                            addToast('Review submitted successfully!', 'success')
                                            setShowOrderReviewForm(false)
                                            setOrderReviewRating(0)
                                            setOrderReviewComment('')
                                            setOrderReviewTitle('')
                                        } catch (error) {
                                            addToast(
                                                error instanceof Error ? error.message : 'Failed to submit review',
                                                'error'
                                            )
                                        }
                                    }
                                }}
                                disabled={
                                    orderReviewRating === 0 ||
                                    !orderReviewComment.trim() ||
                                    submitOrderReviewMutation.isPending ||
                                    isNaN(orderIdNum)
                                }
                            >
                                {submitOrderReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* ============================================
                    DISPLAY EXISTING ORDER REVIEWS
                    ============================================ */}
                {isLoadingReviews ? (
                    <div className="text-center py-8 text-gray-500">Loading reviews...</div>
                ) : orderReviews.length > 0 ? (
                    <div className="space-y-4">
                        {orderReviews.map((review: ReviewResponse) => (
                            <div
                                key={review.id}
                                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        {review.rate && (
                                            <RatingDisplay
                                                rating={review.rate}
                                                size="sm"
                                            />
                                        )}
                                        {review.title && (
                                            <h5 className="text-16 font-semibold text-gray-900">
                                                {review.title}
                                            </h5>
                                        )}
                                    </div>
                                    {review.creationDate && (
                                        <span className="text-12 text-gray-500">
                                            {new Date(review.creationDate).toLocaleDateString('en-GB')}
                                        </span>
                                    )}
                                </div>
                                {review.comment && (
                                    <p className="text-14 text-gray-700 mt-2">{review.comment}</p>
                                )}
                                {review.isVerified && (
                                    <span className="inline-flex items-center gap-1 mt-2 text-12 text-green-600">
                                        ✓ Verified Purchase
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No reviews yet. Be the first to review this order!
                    </div>
                )}
            </div>

            {/* ============================================
                ITEM REVIEWS SECTION - Review each product/service
                ============================================ */}
            {(productPurchases.length > 0 || servicePurchases.length > 0) && (
                <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-20 font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Review Items in This Order
                    </h3>

                    <div className="space-y-6">
                        {/* Product Reviews */}
                        {productPurchases.map((purchase: PurchaseResponse) => {
                            const product = purchase.product
                            const displayName = product?.nameEn || product?.nameAr || purchase.nameEn || purchase.nameAr || purchase.name || 'Product'
                            const displayImage = product?.image || purchase.imageUrl || ''
                            const productId = purchase.productId
                            const itemReview = itemReviews[purchase.id] || {
                                rating: 0,
                                comment: '',
                                title: '',
                                showForm: false,
                            }

                            return (
                                <div
                                    key={purchase.id}
                                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                            {displayImage && displayImage.trim() !== '' ? (
                                                <Image
                                                    src={displayImage}
                                                    alt={displayName}
                                                    fill
                                                    sizes="64px"
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none'
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-10">
                                                    No img
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-16 font-semibold text-gray-900">{displayName}</h4>
                                            <p className="text-14 text-gray-600">
                                                Quantity: {purchase.quantity} × {purchase.totalPrice?.toLocaleString() || purchase.price?.toLocaleString() || '0'} EGP
                                            </p>
                                        </div>
                                        {!itemReview.showForm && productId && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setItemReviews((prev) => ({
                                                        ...prev,
                                                        [purchase.id]: {
                                                            rating: 0,
                                                            comment: '',
                                                            title: '',
                                                            showForm: true,
                                                        },
                                                    }))
                                                }}
                                            >
                                                Add Review
                                            </Button>
                                        )}
                                    </div>

                                    {/* Product Review Form */}
                                    {itemReview.showForm && productId && (
                                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-300">
                                            <h5 className="text-14 font-semibold text-gray-900 mb-4">Review This Product</h5>

                                            {/* Rating */}
                                            <div className="mb-4">
                                                <label className="text-14 font-medium text-gray-700 mb-2 block">
                                                    Rating *
                                                </label>
                                                <div className="flex justify-center">
                                                    <RatingInput
                                                        rating={itemReview.rating}
                                                        onRatingChange={(rating) => {
                                                            setItemReviews((prev) => ({
                                                                ...prev,
                                                                [purchase.id]: { ...prev[purchase.id], rating },
                                                            }))
                                                        }}
                                                        size="md"
                                                        color="brand"
                                                    />
                                                </div>
                                            </div>

                                            {/* Review Title */}
                                            <div className="mb-4">
                                                <label className="text-14 font-medium text-gray-700 mb-2 block">
                                                    Review Title
                                                </label>
                                                <Input
                                                    value={itemReview.title}
                                                    onChange={(e) => {
                                                        setItemReviews((prev) => ({
                                                            ...prev,
                                                            [purchase.id]: { ...prev[purchase.id], title: e.target.value },
                                                        }))
                                                    }}
                                                    placeholder="Enter a title (optional)"
                                                    className="w-full"
                                                />
                                            </div>

                                            {/* Review Comment */}
                                            <div className="mb-4">
                                                <label className="text-14 font-medium text-gray-700 mb-2 block">
                                                    Your Review *
                                                </label>
                                                <textarea
                                                    value={itemReview.comment}
                                                    onChange={(e) => {
                                                        setItemReviews((prev) => ({
                                                            ...prev,
                                                            [purchase.id]: { ...prev[purchase.id], comment: e.target.value },
                                                        }))
                                                    }}
                                                    placeholder="Share your experience with this product..."
                                                    className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                                                    rows={3}
                                                />
                                            </div>

                                            {/* Form Actions */}
                                            <div className="flex gap-3 justify-end">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setItemReviews((prev) => {
                                                            const newState = { ...prev }
                                                            delete newState[purchase.id]
                                                            return newState
                                                        })
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="brand"
                                                    size="sm"
                                                    onClick={async () => {
                                                        if (itemReview.rating > 0 && itemReview.comment.trim()) {
                                                            try {
                                                                await submitProductReviewMutation.mutateAsync({
                                                                    productId: productId,
                                                                    rating: itemReview.rating,
                                                                    review: itemReview.comment.trim(),
                                                                    title: itemReview.title.trim() || undefined,
                                                                })
                                                                addToast('Product review submitted successfully!', 'success')
                                                                setItemReviews((prev) => {
                                                                    const newState = { ...prev }
                                                                    delete newState[purchase.id]
                                                                    return newState
                                                                })
                                                            } catch (error) {
                                                                addToast(
                                                                    error instanceof Error ? error.message : 'Failed to submit review',
                                                                    'error'
                                                                )
                                                            }
                                                        }
                                                    }}
                                                    disabled={
                                                        itemReview.rating === 0 ||
                                                        !itemReview.comment.trim() ||
                                                        submitProductReviewMutation.isPending
                                                    }
                                                >
                                                    {submitProductReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {/* Service Reviews */}
                        {servicePurchases.map((purchase: PurchaseResponse) => {
                            const service = purchase.service
                            const displayName = service?.nameEn || service?.nameAr || purchase.nameEn || purchase.nameAr || purchase.name || 'Service'
                            const displayImage = service?.imageUrl || purchase.imageUrl || ''
                            const serviceId = purchase.serviceId
                            const itemReview = itemReviews[purchase.id] || {
                                rating: 0,
                                comment: '',
                                title: '',
                                showForm: false,
                            }

                            return (
                                <div
                                    key={purchase.id}
                                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                            {displayImage && displayImage.trim() !== '' ? (
                                                <Image
                                                    src={displayImage}
                                                    alt={displayName}
                                                    fill
                                                    sizes="64px"
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none'
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-10">
                                                    No img
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-16 font-semibold text-gray-900">{displayName}</h4>
                                            <p className="text-14 text-gray-600">
                                                {purchase.totalPrice?.toLocaleString() || purchase.price?.toLocaleString() || '0'} EGP
                                                {purchase.quantity > 1 && ` × ${purchase.quantity}`}
                                            </p>
                                        </div>
                                        {!itemReview.showForm && serviceId && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setItemReviews((prev) => ({
                                                        ...prev,
                                                        [purchase.id]: {
                                                            rating: 0,
                                                            comment: '',
                                                            title: '',
                                                            showForm: true,
                                                        },
                                                    }))
                                                }}
                                            >
                                                Add Review
                                            </Button>
                                        )}
                                    </div>

                                    {/* Service Review Form */}
                                    {itemReview.showForm && serviceId && (
                                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-300">
                                            <h5 className="text-14 font-semibold text-gray-900 mb-4">Review This Service</h5>

                                            {/* Rating */}
                                            <div className="mb-4">
                                                <label className="text-14 font-medium text-gray-700 mb-2 block">
                                                    Rating *
                                                </label>
                                                <div className="flex justify-center">
                                                    <RatingInput
                                                        rating={itemReview.rating}
                                                        onRatingChange={(rating) => {
                                                            setItemReviews((prev) => ({
                                                                ...prev,
                                                                [purchase.id]: { ...prev[purchase.id], rating },
                                                            }))
                                                        }}
                                                        size="md"
                                                        color="brand"
                                                    />
                                                </div>
                                            </div>

                                            {/* Review Title */}
                                            <div className="mb-4">
                                                <label className="text-14 font-medium text-gray-700 mb-2 block">
                                                    Review Title
                                                </label>
                                                <Input
                                                    value={itemReview.title}
                                                    onChange={(e) => {
                                                        setItemReviews((prev) => ({
                                                            ...prev,
                                                            [purchase.id]: { ...prev[purchase.id], title: e.target.value },
                                                        }))
                                                    }}
                                                    placeholder="Enter a title (optional)"
                                                    className="w-full"
                                                />
                                            </div>

                                            {/* Review Comment */}
                                            <div className="mb-4">
                                                <label className="text-14 font-medium text-gray-700 mb-2 block">
                                                    Your Review *
                                                </label>
                                                <textarea
                                                    value={itemReview.comment}
                                                    onChange={(e) => {
                                                        setItemReviews((prev) => ({
                                                            ...prev,
                                                            [purchase.id]: { ...prev[purchase.id], comment: e.target.value },
                                                        }))
                                                    }}
                                                    placeholder="Share your experience with this service..."
                                                    className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                                                    rows={3}
                                                />
                                            </div>

                                            {/* Form Actions */}
                                            <div className="flex gap-3 justify-end">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setItemReviews((prev) => {
                                                            const newState = { ...prev }
                                                            delete newState[purchase.id]
                                                            return newState
                                                        })
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="brand"
                                                    size="sm"
                                                    onClick={async () => {
                                                        if (itemReview.rating > 0 && itemReview.comment.trim()) {
                                                            try {
                                                                await submitServiceReviewMutation.mutateAsync({
                                                                    serviceId: serviceId,
                                                                    rating: itemReview.rating,
                                                                    review: itemReview.comment.trim(),
                                                                    title: itemReview.title.trim() || undefined,
                                                                    providerId: order.providerId || null,
                                                                })
                                                                addToast('Service review submitted successfully!', 'success')
                                                                setItemReviews((prev) => {
                                                                    const newState = { ...prev }
                                                                    delete newState[purchase.id]
                                                                    return newState
                                                                })
                                                            } catch (error) {
                                                                addToast(
                                                                    error instanceof Error ? error.message : 'Failed to submit review',
                                                                    'error'
                                                                )
                                                            }
                                                        }
                                                    }}
                                                    disabled={
                                                        itemReview.rating === 0 ||
                                                        !itemReview.comment.trim() ||
                                                        submitServiceReviewMutation.isPending
                                                    }
                                                >
                                                    {submitServiceReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </UserPageLayout>
    )
}
