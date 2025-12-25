'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { UserPageLayout } from '@/components/layout'
import {
  CancelOrderModal,
  CancelOrderSuccessModal,
  EmptyState,
  HistorySection,
  SectionHeader,
  ServicesProductsFilter,
  PageHeader,
  OrderCard,
  RequestCard,
  ErrorDisplay,
  LoadingOverlay,
} from '@/components/ui'
import orderEmptySvg from '@/assets/svg/order-empty.svg'
import type { OrderStatus } from '@/components/ui/OrderProgressIndicator'
import type { RequestStatus } from '@/components/ui/RequestProgressIndicator'
import {
  useClientOrders,
  useOrdersByStatus,
  useCancelOrder,
  useCartsWithProviders,
} from '@/hooks'
import type { OrderResponse, PurchaseResponse } from '@/types/responses'
import {
  OrderStatus as ApiOrderStatus,
  PurchaseType,
  PurchaseStatus,
} from '@/../client/common/api/gen/ourbride-api'

/**
 * Map API OrderStatus to component OrderStatus
 */
const mapOrderStatus = (status: ApiOrderStatus | string): OrderStatus => {
  const statusMap: Record<string, OrderStatus> = {
    Preparing: 'preparing',
    OnTheWay: 'onTheWay',
    Shipped: 'onTheWay',
    Received: 'received',
    Delivered: 'delivered',
    Completed: 'delivered',
    Cancelled: 'cancelled',
    Canceled: 'cancelled',
  }
  return statusMap[status] || 'preparing'
}

/**
 * Map OrderResponse to OrderCard format
 */
const mapOrderToOrderCard = (order: OrderResponse) => {
  // Format order date
  const orderDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    : new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

  // Format delivery date
  const arrivalDate = order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    : undefined

  const arrivalTime = order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    : undefined

  // Map purchases from OrderResponse to products
  // OrderResponse.purchases contains PurchaseResponse[] with product information
  const products = (order.purchases || [])
    .filter((p: PurchaseResponse) => p.product)
    .map((purchase: PurchaseResponse) => ({
      id: purchase.productId?.toString() ?? purchase.id.toString(),
      title: purchase.product?.nameEn ?? purchase.product?.nameAr ?? 'Product',
      image: purchase.product?.image ?? '/placeholder-product.png',
      price: purchase.totalPrice ?? purchase.price ?? 0,
      quantity: purchase.quantity,
    }))

  // Use OrderResponse fields: prefer orderSummary if available, otherwise use direct fields
  // OrderResponse.orderSummary contains OrderSummaryResponse with calculated totals
  const subtotal =
    order.orderSummary?.subtotal ??
    order.totalAmount - (order.taxAmount ?? 0) - (order.shippingAmount ?? 0) - (order.discountAmount ?? 0)

  return {
    orderId: order.orderNumber || order.id.toString(),
    orderDate,
    status: mapOrderStatus(order.status),
    products,
    subtotal,
    taxesAndFees: order.orderSummary?.tax ?? order.taxAmount ?? 0,
    deliveryFee: order.orderSummary?.shipping ?? order.shippingAmount ?? 0,
    total: order.orderSummary?.total ?? order.finalAmount ?? order.totalAmount,
    arrivalDate,
    arrivalTime,
    orderResponse: order, // Store original OrderResponse for API calls
  }
}

/**
 * Map PurchaseResponse (service) to RequestCard format
 */
const mapServicePurchaseToRequestCard = (purchase: PurchaseResponse) => {
  if (!purchase.service) return null

  const service = purchase.service
  const price = purchase.totalPrice ?? purchase.price ?? 0

  // Map PurchaseStatus to RequestStatus
  const statusMap: Record<string, RequestStatus> = {
    RequestReceived: 'requestReceived',
    UnderReview: 'underReview',
    Confirmed: 'confirmed',
    Completed: 'completed',
    Cancelled: 'cancelled',
  }
  const status = statusMap[purchase.status] ?? 'requestReceived'

  // Format dates
  const requestDate = purchase.creationDate
    ? new Date(purchase.creationDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    : new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

  const dueDate = purchase.endDate
    ? new Date(purchase.endDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    : undefined

  const dueTime = purchase.endDate
    ? new Date(purchase.endDate).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    : undefined

  return {
    requestId: purchase.id.toString(),
    requestDate,
    status,
    service: {
      id: purchase.serviceId?.toString() ?? purchase.id.toString(),
      title: service.nameEn ?? service.nameAr ?? 'Service',
      image: service.imageUrl ?? '/placeholder-service.png',
      rating: {
        value: service.rate ?? 0,
        count: 0,
      },
      provider: {
        name: purchase.providerName ?? service.provider?.nameEn ?? service.provider?.nameAr ?? 'Provider',
      },
    },
    assignedTo: purchase.providerName,
    dueDate,
    dueTime,
    packages: [
      {
        title: 'Service Package',
        price: price,
      },
    ],
    subtotal: price,
    taxesAndFees: 0,
    total: price,
    purchaseResponse: purchase, // Store original for API calls
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'services' | 'products'>(
    'products'
  )

  // Fetch orders data
  const {
    data: clientOrdersData,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useClientOrders({
    enabled: filterType === 'products',
  })

  // Fetch in-progress orders (not delivered, not cancelled)
  const {
    data: inProgressOrders,
    isLoading: isLoadingInProgress,
  } = useOrdersByStatus('Preparing', {
    enabled: filterType === 'products',
  })

  const {
    data: onTheWayOrders,
  } = useOrdersByStatus('OnTheWay', {
    enabled: filterType === 'products',
  })

  // Fetch service orders from carts with providers
  const {
    data: cartsWithProviders,
    isLoading: isLoadingServiceOrders,
    error: serviceOrdersError,
  } = useCartsWithProviders(filterType === 'services')

  // Cancel order mutation
  const cancelOrderMutation = useCancelOrder()

  // Map orders to component format
  const ordersInProgress = useMemo(() => {
    if (!clientOrdersData?.items) return []

    // Combine all orders and filter for in-progress
    const allOrders = clientOrdersData.items
    const inProgress = allOrders.filter(
      (order: OrderResponse) =>
        !order.isCompleted && !order.isCancelled && order.isActive
    )

    return inProgress.map(mapOrderToOrderCard)
  }, [clientOrdersData])

  const ordersHistory = useMemo(() => {
    if (!clientOrdersData?.items) return []

    // Filter for completed or cancelled orders
    const allOrders = clientOrdersData.items
    const history = allOrders.filter(
      (order: OrderResponse) => order.isCompleted || order.isCancelled
    )

    return history.map(mapOrderToOrderCard)
  }, [clientOrdersData])

  // Map service orders to request cards
  const requestsInProgress = useMemo(() => {
    if (!cartsWithProviders) return []

    // Ensure cartsWithProviders is an array
    const cartsArray = Array.isArray(cartsWithProviders) ? cartsWithProviders : []
    const allPurchases: PurchaseResponse[] = []
    cartsArray.forEach((cart: { purchases?: PurchaseResponse[] }) => {
      if (cart && cart.purchases && Array.isArray(cart.purchases)) {
        allPurchases.push(...cart.purchases)
      }
    })

    // Filter for service purchases that are in progress
    // Using string comparison since PurchaseStatus enum values may vary
    const inProgress = allPurchases.filter(
      (purchase: PurchaseResponse) => {
        const statusStr = String(purchase.status)
        return (
          purchase.type === PurchaseType.Service &&
          statusStr !== 'Completed' &&
          statusStr !== 'Cancelled' &&
          statusStr !== 'Canceled' &&
          !purchase.isDeleted
        )
      }
    )

    return inProgress
      .map(mapServicePurchaseToRequestCard)
      .filter((request): request is NonNullable<typeof request> => request !== null)
  }, [cartsWithProviders])

  const requestsHistory = useMemo(() => {
    if (!cartsWithProviders) return []

    // Ensure cartsWithProviders is an array
    const cartsArray = Array.isArray(cartsWithProviders) ? cartsWithProviders : []
    const allPurchases: PurchaseResponse[] = []
    cartsArray.forEach((cart: { purchases?: PurchaseResponse[] }) => {
      if (cart && cart.purchases && Array.isArray(cart.purchases)) {
        allPurchases.push(...cart.purchases)
      }
    })

    // Filter for service purchases that are completed or cancelled
    // Using string comparison since PurchaseStatus enum values may vary
    const history = allPurchases.filter(
      (purchase: PurchaseResponse) => {
        const statusStr = String(purchase.status)
        return (
          purchase.type === PurchaseType.Service &&
          (statusStr === 'Completed' ||
            statusStr === 'Cancelled' ||
            statusStr === 'Canceled')
        )
      }
    )

    return history
      .map(mapServicePurchaseToRequestCard)
      .filter((request): request is NonNullable<typeof request> => request !== null)
  }, [cartsWithProviders])

  const isLoading = filterType === 'products'
    ? isLoadingOrders || isLoadingInProgress
    : isLoadingServiceOrders
  const error = filterType === 'products' ? ordersError : serviceOrdersError

  const handleCancelOrder = (orderId: string) => {
    setSelectedOrderId(orderId)
    setCancelModalOpen(true)
  }

  const handleConfirmCancel = async (_reason?: string) => {
    if (!selectedOrderId) return

    try {
      // Find the order to get its ID
      const order = ordersInProgress.find(o => o.orderId === selectedOrderId) ||
        ordersHistory.find(o => o.orderId === selectedOrderId)

      if (order && order.orderResponse) {
        await cancelOrderMutation.mutateAsync(order.orderResponse.id)
        setCancelModalOpen(false)
        setSuccessModalOpen(true)
      }
    } catch (error) {
      console.error('Failed to cancel order:', error)
      // You might want to show a toast notification here
    }
  }

  const handleCloseCancelModal = () => {
    setCancelModalOpen(false)
    setSelectedOrderId(null)
  }

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false)
    setSelectedOrderId(null)
  }

  const handleBrowseMore = () => {
    setSuccessModalOpen(false)
    setSelectedOrderId(null)
    // Navigate to home or products page
    window.location.href = '/'
  }

  const handleReorder = (_orderId: string) => {
    // TODO: Add items to cart and navigate to checkout
  }

  const handleClearHistory = () => {
    // TODO: Clear orders history
  }

  const handleCancelRequest = (_requestId: string) => {
    // TODO: Handle cancel request - could reuse cancel modal or create separate one
  }

  const handleCheckout = (_requestId: string) => {
    // Navigate to checkout page
    // TODO: Pass service request data via query params or state management
    router.push('/checkout')
  }

  const hasOrders = ordersInProgress.length > 0 || ordersHistory.length > 0
  const hasRequests = requestsInProgress.length > 0
  const hasRequestsHistory = requestsHistory.length > 0
  const hasAnyContent = hasOrders || hasRequests || hasRequestsHistory

  // Show loading state
  if (isLoading) {
    return (
      <UserPageLayout>
        <PageHeader
          title="Order List"
          rightContent={
            hasRequests ? (
              <ServicesProductsFilter
                value={filterType}
                onChange={setFilterType}
                variant="outline"
              />
            ) : undefined
          }
        />
        <LoadingOverlay
          open={true}
          title="Loading orders..."
          subtitle="Please wait a moment"
        />
      </UserPageLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <UserPageLayout>
        <PageHeader
          title="Order List"
          rightContent={
            hasRequests ? (
              <ServicesProductsFilter
                value={filterType}
                onChange={setFilterType}
                variant="outline"
              />
            ) : undefined
          }
        />
        <ErrorDisplay
          title="Error loading orders"
          message="Please try again later"
          actionLabel="Back to Home"
          actionHref="/"
        />
      </UserPageLayout>
    )
  }

  return (
    <>
      <UserPageLayout>
        {!hasAnyContent ? (
          <EmptyState
            illustration={orderEmptySvg}
            title="You don't have any orders"
            description="Start exploring services and products to begin your journey"
            actionLabel="Start Shopping"
            actionHref="/"
          />
        ) : (
          <>
            {/* Page Header */}
            <PageHeader
              title="Order List"
              rightContent={
                hasRequests ? (
                  <ServicesProductsFilter
                    value={filterType}
                    onChange={setFilterType}
                    variant="outline"
                  />
                ) : undefined
              }
            />

            {/* Service Requests Section */}
            {hasRequests && (
              <>
                <SectionHeader
                  title="Request in Progress"
                  count={requestsInProgress.length}
                  suffix="Requests in Progress"
                />
                <div className="space-y-6 mb-12">
                  {requestsInProgress.map(request => (
                    <RequestCard
                      key={request.requestId}
                      requestId={request.requestId}
                      requestDate={request.requestDate}
                      status={request.status}
                      service={request.service}
                      assignedTo={request.assignedTo || undefined}
                      dueDate={request.dueDate}
                      dueTime={request.dueTime}
                      packages={request.packages}
                      subtotal={request.subtotal}
                      taxesAndFees={request.taxesAndFees}
                      total={request.total}
                      onCancelRequest={() =>
                        handleCancelRequest(request.requestId)
                      }
                      onCheckout={
                        request.status === 'confirmed'
                          ? () => handleCheckout(request.requestId)
                          : undefined
                      }
                    />
                  ))}
                </div>
              </>
            )}

            {/* Product Orders Section */}
            {ordersInProgress.length > 0 && (
              <>
                <SectionHeader
                  title="Order In Progress"
                  count={ordersInProgress.length}
                  suffix="Orders In Progress"
                />

                {/* Order Cards */}
                <div className="space-y-6">
                  {ordersInProgress.map(order => (
                    <OrderCard
                      key={order.orderId}
                      orderId={order.orderId}
                      orderDate={order.orderDate}
                      status={order.status}
                      products={order.products}
                      subtotal={order.subtotal}
                      taxesAndFees={order.taxesAndFees}
                      deliveryFee={order.deliveryFee}
                      total={order.total}
                      arrivalDate={order.arrivalDate}
                      arrivalTime={order.arrivalTime}
                      onCancelOrder={() => handleCancelOrder(order.orderId)}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Requests History Section */}
            {hasRequestsHistory && (
              <HistorySection
                title="Requests History"
                itemCount={requestsHistory.length}
                suffix="Requests"
                onClearHistory={handleClearHistory}
              >
                {requestsHistory.map(request => (
                  <RequestCard
                    key={request.requestId}
                    requestId={request.requestId}
                    requestDate={request.requestDate}
                    status={request.status}
                    service={request.service}
                    assignedTo={request.assignedTo || undefined}
                    dueDate={request.dueDate}
                    dueTime={request.dueTime}
                    packages={request.packages}
                    subtotal={request.subtotal}
                    taxesAndFees={request.taxesAndFees}
                    total={request.total}
                    onReRequest={() => {
                      // TODO: Handle re-request logic
                    }}
                  />
                ))}
              </HistorySection>
            )}

            {/* Orders History Section */}
            {ordersHistory.length > 0 && (
              <HistorySection
                title="Orders History"
                itemCount={ordersHistory.length}
                suffix="Orders"
                onClearHistory={handleClearHistory}
              >
                {ordersHistory.map(order => (
                  <OrderCard
                    key={order.orderId}
                    orderId={order.orderId}
                    orderDate={order.orderDate}
                    status={order.status}
                    products={order.products}
                    subtotal={order.subtotal}
                    taxesAndFees={order.taxesAndFees}
                    deliveryFee={order.deliveryFee}
                    total={order.total}
                    arrivalDate={order.arrivalDate}
                    arrivalTime={order.arrivalTime}
                    onReorder={() => handleReorder(order.orderId)}
                  />
                ))}
              </HistorySection>
            )}
          </>
        )}
      </UserPageLayout>

      {/* Cancel Order Modals */}
      <CancelOrderModal
        isOpen={cancelModalOpen}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
        orderId={selectedOrderId || undefined}
      />
      <CancelOrderSuccessModal
        isOpen={successModalOpen}
        onClose={handleCloseSuccessModal}
        onBrowseMore={handleBrowseMore}
      />

      {/* Loading Overlay for Mutations */}
      <LoadingOverlay
        open={cancelOrderMutation.isPending}
        title="Cancelling order..."
        subtitle="Please wait a moment"
      />
    </>
  )
}
