'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { UserPageLayout } from '@/components/layout'
import { PageHeader, LoadingOverlay, ErrorDisplay } from '@/components/ui'
import { useToast } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks'
import { createOrder } from '@/services/api/purchaseApi'
import { getOrderById } from '@/services/api/orderApi'
import type { CheckoutRequest } from '@/../client/common/api/gen/ourbride-api'
import type { CheckoutResponse, OrderResponse } from '@/types/responses'

/**
 * Queue status types
 */
type QueueStatus = 'idle' | 'queued' | 'processing' | 'completed' | 'failed'

/**
 * Polling configuration
 */
const POLL_INTERVAL = 1500 // 1.5 seconds
const MAX_POLL_ATTEMPTS = 30 // 45 seconds total (30 * 1.5 seconds)

/**
 * Create Order Content Component
 * This component uses useSearchParams and must be wrapped in Suspense
 */
function CreateOrderContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { addToast } = useToast()
    const { data: cartData } = useCart()

    // Get checkout data from URL params
    const checkoutOrderNumber = searchParams.get('checkoutOrderNumber')
    const orderIdParam = searchParams.get('orderId')
    const cartIdParam = searchParams.get('cartId')
    const statusParam = searchParams.get('status')

    // State
    const [queueStatus, setQueueStatus] = useState<QueueStatus>('idle')
    const [pollAttempt, setPollAttempt] = useState(0)
    const [isCreatingOrder, setIsCreatingOrder] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [checkoutResponse, setCheckoutResponse] = useState<CheckoutResponse | null>(null)
    const [checkoutRequest, setCheckoutRequest] = useState<CheckoutRequest | null>(null)
    const [storedCartData, setStoredCartData] = useState<any>(null)

    // Refs for polling
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const pollAttemptRef = useRef(0)

    // Load stored checkout data from sessionStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedCheckoutRequest = sessionStorage.getItem('checkoutRequest')
            const storedCheckoutResponse = sessionStorage.getItem('checkoutResponse')
            const storedCart = sessionStorage.getItem('cartData')

            if (storedCheckoutRequest) {
                try {
                    setCheckoutRequest(JSON.parse(storedCheckoutRequest))
                } catch (e) {
                    // Failed to parse
                }
            }

            if (storedCheckoutResponse) {
                try {
                    setCheckoutResponse(JSON.parse(storedCheckoutResponse))
                } catch (e) {
                    // Failed to parse
                }
            }

            if (storedCart) {
                try {
                    setStoredCartData(JSON.parse(storedCart))
                } catch (e) {
                    // Failed to parse
                }
            }
        }
    }, [])

    // Initialize - check if we need to poll or create order immediately
    useEffect(() => {
        // Wait for checkout response to be loaded from sessionStorage
        if (!checkoutResponse && !checkoutOrderNumber) {
            // Give it a moment to load from sessionStorage
            const timer = setTimeout(() => {
                if (!checkoutResponse && !checkoutOrderNumber) {
                    setError('Missing checkout information')
                }
            }, 1000)
            return () => clearTimeout(timer)
        }

        // If we have checkout response, use its status
        const initialStatus = (statusParam?.toLowerCase() || checkoutResponse?.status?.toLowerCase() || '') as QueueStatus

        // If checkout status is completed, create order immediately
        if (initialStatus === 'completed') {
            setQueueStatus('completed')
            handleCreateOrder()
        } else if (initialStatus === 'queued' || initialStatus === 'processing') {
            // Start polling for order status
            setQueueStatus(initialStatus as QueueStatus)
            startPolling()
        } else if (initialStatus === 'failed') {
            // Checkout failed
            setQueueStatus('failed')
            setError('Checkout failed. Please try again.')
            addToast('Checkout failed. Please try again.', 'error')
        } else {
            // Default: try to create order immediately (skip polling for unknown/ready statuses)
            setQueueStatus('completed')
            handleCreateOrder()
        }

        // Cleanup on unmount
        return () => {
            stopPolling()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkoutOrderNumber, statusParam, checkoutResponse])

    /**
     * Start polling for order status
     */
    const startPolling = () => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
        }

        pollAttemptRef.current = 0
        setPollAttempt(0)

        // Poll immediately, then every 2 seconds
        poll()
        pollIntervalRef.current = setInterval(poll, POLL_INTERVAL)
    }

    /**
     * Stop polling
     */
    const stopPolling = () => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
        }
    }

    /**
     * Poll for order status
     */
    const poll = async () => {
        // Check max attempts
        if (pollAttemptRef.current >= MAX_POLL_ATTEMPTS) {
            stopPolling()
            setQueueStatus('failed')
            setError('Order processing timeout. Please try again.')
            addToast('Order processing timeout. Please try again.', 'error')
            return
        }

        pollAttemptRef.current++
        setPollAttempt(pollAttemptRef.current)

        try {
            // If we have orderId, use it to get order status
            if (orderIdParam) {
                const orderId = parseInt(orderIdParam, 10)
                if (!isNaN(orderId)) {
                    const order = await getOrderById(orderId)
                    handleOrderStatus(order)
                    return
                }
            }

            // If no orderId yet, check if we can get it from checkout response
            // or try to create order directly if checkout is already completed
            // Note: In a real implementation, you might need an API endpoint
            // to check checkout status by checkoutOrderNumber or cartId
            if (checkoutResponse?.status?.toLowerCase() === 'completed') {
                stopPolling()
                handleCreateOrder()
                return
            }

            // If still queued/processing and no orderId, continue polling
            // The orderId might become available in a future poll
        } catch (error) {
            // Continue polling on error (might be temporary network issue)
            // Only stop if we've exceeded max attempts
            if (pollAttemptRef.current >= MAX_POLL_ATTEMPTS) {
                stopPolling()
                setQueueStatus('failed')
                setError('Failed to check order status. Please try again.')
                addToast('Failed to check order status. Please try again.', 'error')
            }
        }
    }

    /**
     * Handle order status from polling
     */
    const handleOrderStatus = (order: OrderResponse) => {
        const orderStatus = order.status?.toLowerCase() || ''
        // Note: queueStatus might not be in OrderResponse, check status directly
        // If the API returns queueStatus, it would be in a different field
        const queueStatusValue = (order as any).queueStatus?.toLowerCase() || ''

        // Check both status and queueStatus
        const currentStatus = queueStatusValue || orderStatus

        if (currentStatus === 'completed') {
            stopPolling()
            setQueueStatus('completed')
            // Proceed to create order
            handleCreateOrder()
        } else if (currentStatus === 'failed') {
            stopPolling()
            setQueueStatus('failed')
            setError('Order processing failed. Please try again.')
            addToast('Order processing failed. Please try again.', 'error')
        } else if (currentStatus === 'processing') {
            setQueueStatus('processing')
        } else if (currentStatus === 'queued') {
            setQueueStatus('queued')
        }
    }

    /**
     * Create order API call
     */
    const handleCreateOrder = async () => {
        if (isCreatingOrder) return

        setIsCreatingOrder(true)
        setError(null)

        try {
            // Use stored checkout request if available, otherwise use current cart data
            const orderData = checkoutRequest || (cartData ? {
                cartId: cartData.id,
                customer: {
                    email: '',
                    firstName: '',
                    lastName: '',
                    address: '',
                    city: '',
                    country: 'Egypt',
                    phone: '',
                },
                paymentMethod: null,
                orderNotes: null,
                couponCode: null,
                preferredDeliveryDate: null,
            } as CheckoutRequest : null)

            if (!orderData) {
                throw new Error('Order data not available')
            }

            const orderResponse = await createOrder(orderData)

            // Clear stored data
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('checkoutRequest')
                sessionStorage.removeItem('checkoutResponse')
                sessionStorage.removeItem('cartData')
            }

            // Success - navigate to order details immediately
            addToast('Order created successfully!', 'success')

            // Navigate immediately without delay for better UX
            if (orderResponse.orderId) {
                router.push(`/orders/${orderResponse.orderId}`)
            } else if (checkoutResponse?.orderId) {
                router.push(`/orders/${checkoutResponse.orderId}`)
            } else {
                router.push('/orders')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create order'
            setError(errorMessage)
            addToast(errorMessage, 'error')
            setIsCreatingOrder(false)
        }
    }

    // Show error state
    if (error && queueStatus === 'failed') {
        return (
            <UserPageLayout>
                <PageHeader title="Order Processing" />
                <ErrorDisplay
                    title="Order Processing Failed"
                    message={error}
                    actionLabel="Back to Cart"
                    actionHref="/cart"
                />
            </UserPageLayout>
        )
    }

    // Show loading/processing state
    return (
        <UserPageLayout>
            <PageHeader title="Processing Your Order" />

            <div className="container-custom py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        {/* Status Icon */}
                        <div className="flex justify-center mb-6">
                            {queueStatus === 'completed' || isCreatingOrder ? (
                                <CheckCircle2 className="h-16 w-16 text-green-500" />
                            ) : queueStatus === 'failed' ? (
                                <XCircle className="h-16 w-16 text-red-500" />
                            ) : (
                                <Loader2 className="h-16 w-16 text-brand-500 animate-spin" />
                            )}
                        </div>

                        {/* Status Message */}
                        <div className="text-center mb-6">
                            <h2 className="text-24 font-semibold text-gray-900 mb-2">
                                {isCreatingOrder
                                    ? 'Creating Your Order...'
                                    : queueStatus === 'completed'
                                        ? 'Order Processing Complete'
                                        : queueStatus === 'failed'
                                            ? 'Order Processing Failed'
                                            : queueStatus === 'processing'
                                                ? 'Processing Your Order...'
                                                : 'Your Order is in Queue'}
                            </h2>
                            <p className="text-16 text-gray-600">
                                {isCreatingOrder
                                    ? 'Please wait while we finalize your order.'
                                    : queueStatus === 'completed'
                                        ? 'Your order has been processed successfully.'
                                        : queueStatus === 'failed'
                                            ? 'There was an error processing your order.'
                                            : queueStatus === 'processing'
                                                ? 'Your order is being processed. This may take a moment.'
                                                : 'Your order is waiting to be processed. This may take a moment.'}
                            </p>
                        </div>

                        {/* Polling Progress */}
                        {queueStatus !== 'idle' && queueStatus !== 'completed' && !isCreatingOrder && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between text-14 text-gray-600 mb-2">
                                    <span>Checking order status...</span>
                                    <span>Attempt {pollAttempt} of {MAX_POLL_ATTEMPTS}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(pollAttempt / MAX_POLL_ATTEMPTS) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Queue Status Badge */}
                        {queueStatus !== 'idle' && (
                            <div className="mt-6 flex justify-center">
                                <div
                                    className={cn(
                                        'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-14 font-medium',
                                        queueStatus === 'queued' && 'bg-yellow-100 text-yellow-800',
                                        queueStatus === 'processing' && 'bg-blue-100 text-blue-800',
                                        queueStatus === 'completed' && 'bg-green-100 text-green-800',
                                        queueStatus === 'failed' && 'bg-red-100 text-red-800'
                                    )}
                                >
                                    {queueStatus === 'queued' && <Clock className="h-4 w-4" />}
                                    {queueStatus === 'processing' && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {queueStatus === 'completed' && <CheckCircle2 className="h-4 w-4" />}
                                    {queueStatus === 'failed' && <XCircle className="h-4 w-4" />}
                                    <span className="capitalize">{queueStatus}</span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {queueStatus === 'failed' && (
                            <div className="mt-8 flex gap-4 justify-center">
                                <button
                                    onClick={() => router.push('/cart')}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Back to Cart
                                </button>
                                <button
                                    onClick={handleCreateOrder}
                                    className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading Overlay */}
            <LoadingOverlay
                open={isCreatingOrder}
                title="Creating Order..."
                subtitle="Please wait a moment"
            />
        </UserPageLayout>
    )
}

/**
 * Main page component with Suspense boundary
 */
export default function CreateOrderPage() {
    return (
        <Suspense
            fallback={
                <UserPageLayout>
                    <PageHeader title="Processing Your Order" />
                    <div className="container-custom py-8">
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                <div className="flex justify-center mb-6">
                                    <Loader2 className="h-16 w-16 text-brand-500 animate-spin" />
                                </div>
                                <div className="text-center">
                                    <h2 className="text-24 font-semibold text-gray-900 mb-2">
                                        Loading...
                                    </h2>
                                    <p className="text-16 text-gray-600">
                                        Please wait while we load your order information.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </UserPageLayout>
            }
        >
            <CreateOrderContent />
        </Suspense>
    )
}


