'use client'

import { useState, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useI18nTranslations, useIsRTL } from '@/i18n'
import { useI18nLocale } from '@/i18n/hooks'
import { pickLocalizedText } from '@/utils/translation/i18nText'
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
  OrderListItem,
  RequestCard,
  ErrorDisplay, 
  LoadingOverlay,
  LoadingSpinner,
} from '@/components/ui'
import { Grid3x3, List } from 'lucide-react'
import { Button } from '@/components/ui'
import orderEmptySvg from '@/assets/svg/order-empty.svg'
import type { OrderStatus } from '@/components/ui/OrderProgressIndicator'
import type { RequestStatus } from '@/components/ui/RequestProgressIndicator'
import {
  useClientOrders,
  useCancelOrder,
  useCartsWithProviders,
} from '@/hooks'
import type { OrderResponse, PurchaseResponse, UserCartWithProviderResponse } from '@/types/responses'
import {
  OrderStatus as ApiOrderStatus,
  PurchaseType,
  PurchaseStatus,
} from '@/../client/common/api/gen/ourbride-api'

type TranslateFn = (key: string, values?: Record<string, string | number | Date>) => string

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
const mapOrderToOrderCard = (order: OrderResponse, t: TranslateFn, locale: string) => {

  // Format order date - use a static fallback to avoid hydration mismatch
  const orderDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    : 'N/A'

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
  // Include both products (with productId) and services (with serviceId) that have name/image data
  const purchases = order.purchases || []

  const products = purchases
    .filter((p: PurchaseResponse) => {
      // Include purchases that have a product, OR have name/image data (for display purposes)
      const hasProduct = !!p.product
      const hasName = !!(p.name || p.nameEn || p.nameAr)
      const hasId = !!(p.productId || p.serviceId)
      return hasProduct || hasName || hasId
    })
    .map((purchase: PurchaseResponse) => {
      // Use product data if available, otherwise use purchase name/image
      const productName = pickLocalizedText(locale, {
        en: purchase.product?.nameEn ?? purchase.nameEn,
        ar: purchase.product?.nameAr ?? purchase.nameAr,
        fallback: purchase.name ?? t('card.itemFallback'),
      })
      const productImage = purchase.product?.image ?? purchase.imageUrl ?? '/images/placeholder-product.png'

      return {
        purchaseId: purchase.id.toString(),
        productId: purchase.productId?.toString(),
        serviceId: purchase.serviceId?.toString(),
        title: productName,
        image: productImage,
        price: purchase.totalPrice ?? purchase.price ?? 0,
        quantity: purchase.quantity,
      }
    })

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
    providerName: order.providerName || undefined,
    providerLogo: order.providerLogo || undefined,
    providerId: order.providerId || undefined,
    paymentStatus: order.paymentStatusText || order.paymentStatus || undefined,
    paymentMethod: order.paymentMethod || undefined,
    totalPaidAmount: order.totalPaidAmount || 0,
    totalRemainingAmount: order.totalRemainingAmount || 0,
    paymentProgressPercentage: order.paymentProgressPercentage || 0,
    discountAmount: order.orderSummary?.discount ?? order.discountAmount ?? 0,
    depositAmount: order.depositAmount ?? 0,
    itemCount: products.length,
    deliveryStatus: order.deliveryStatus ?? null,
    orderResponse: order, // Store original OrderResponse for API calls
  }
}

/**
 * Map PurchaseResponse (service) to RequestCard format
 */
const mapServicePurchaseToRequestCard = (purchase: PurchaseResponse, t: TranslateFn, locale: string) => {
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
    : 'N/A'

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
      title: pickLocalizedText(locale, {
        en: service.nameEn,
        ar: service.nameAr,
        fallback: t('card.serviceFallback'),
      }),
      image: service.imageUrl ?? '/placeholder-service.png',
      rating: {
        value: service.rate ?? 0,
        count: 0,
      },
      provider: {
        id: purchase.providerId?.toString() ?? service.providerId?.toString() ?? service.provider?.id?.toString(),
        name: pickLocalizedText(locale, {
          en: service.provider?.nameEn,
          ar: service.provider?.nameAr,
          fallback: purchase.providerName ?? t('card.providerFallback'),
        }),
      },
    },
    assignedTo: purchase.providerName,
    dueDate,
    dueTime,
    packages: [
      {
        title: t('card.servicePackage'),
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
  const t = useI18nTranslations('orders')
  const isRTL = useIsRTL()
  const locale = useI18nLocale()
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'services' | 'products'>(
    'products'
  )
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Fetch orders data - use single endpoint for all orders
  const {
    data: clientOrdersData,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useClientOrders({
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
    const allOrders: OrderResponse[] = clientOrdersData?.items ?? []

    // Filter for orders that are not completed and not cancelled
    // Don't require isActive to be true, as some orders may have isActive: false but are still in progress
    const inProgress = allOrders.filter(
      (order: OrderResponse) => !order.isCompleted && !order.isCancelled
    )

    return inProgress.map((order) => mapOrderToOrderCard(order, t, locale))
  }, [clientOrdersData, t, locale])

  const ordersHistory = useMemo(() => {
    const allOrders: OrderResponse[] = clientOrdersData?.items ?? []

    // Filter for completed or cancelled orders
    const history = allOrders.filter(
      (order: OrderResponse) => order.isCompleted || order.isCancelled
    )

    return history.map((order) => mapOrderToOrderCard(order, t, locale))
  }, [clientOrdersData, t, locale])

  // Map service orders to request cards
  const requestsInProgress = useMemo(() => {
    if (!cartsWithProviders) return []

    // Ensure cartsWithProviders is an array
    const cartsArray: UserCartWithProviderResponse[] = Array.isArray(cartsWithProviders) ? cartsWithProviders : []
    const allPurchases: PurchaseResponse[] = []
    cartsArray.forEach((cart) => {
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
      .map((purchase) => mapServicePurchaseToRequestCard(purchase, t, locale))
      .filter((request): request is NonNullable<typeof request> => request !== null)
  }, [cartsWithProviders, t, locale])

  const requestsHistory = useMemo(() => {
    if (!cartsWithProviders) return []

    // Ensure cartsWithProviders is an array
    const cartsArray: UserCartWithProviderResponse[] = Array.isArray(cartsWithProviders) ? cartsWithProviders : []
    const allPurchases: PurchaseResponse[] = []
    cartsArray.forEach((cart) => {
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
      .map((purchase) => mapServicePurchaseToRequestCard(purchase, t, locale))
      .filter((request): request is NonNullable<typeof request> => request !== null)
  }, [cartsWithProviders, t, locale])

  const isLoading = filterType === 'products'
    ? isLoadingOrders
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
      // Error handling
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

  const handleViewDetails = (orderId: string) => {
    // Navigate to order details page
    router.push(`/orders/${orderId}`)
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
          title={t('page.title')}
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
        <LoadingSpinner
          fullScreen={true}
          size='xl'
          open={true}
          text={t('loading.title')}
        />
      </UserPageLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <UserPageLayout>
        <PageHeader
          title={t('page.title')}
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
          title={t('error.title')}
          message={t('error.message')}
          actionLabel={t('error.actionLabel')}
          actionHref="/"
        />
      </UserPageLayout>
    )
  }

  return (
    <>
      <UserPageLayout>
        <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
          {!hasAnyContent ? (
            <EmptyState
              illustration={orderEmptySvg}
              title={t('empty.title')}
              description={t('empty.description')}
              actionLabel={t('empty.actionLabel')}
              actionHref="/"
            />
          ) : (
            <>
            {/* Page Header */}
            <PageHeader
              title={t('page.title')}
              rightContent={
                <div className="flex items-center gap-3">
                  {hasRequests && (
                    <ServicesProductsFilter
                      value={filterType}
                      onChange={setFilterType}
                      variant="outline"
                    />
                  )}
                  {ordersInProgress.length > 0 && (
                    <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewMode('grid')}
                        aria-label={t('aria.gridView')}
                      >
                        <Grid3x3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewMode('list')}
                        aria-label={t('aria.listView')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              }
            />

            {/* Service Requests Section */}
            {hasRequests && (
              <>
                <SectionHeader
                  title={t('sections.requestsInProgressTitle')}
                  count={requestsInProgress.length}
                  suffix={t('sections.requestsInProgressSuffix')}
                />
                <div className="space-y-6 mb-12">
                  {requestsInProgress.map(request => (
                    <RequestCard
                      key={`request-in-progress-${request.requestId}`}
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
                  title={t('sections.ordersInProgressTitle')}
                  count={ordersInProgress.length}
                  suffix={t('sections.ordersInProgressSuffix')}
                />

                {/* Order Cards or List */}
                {viewMode === 'grid' ? (
                  <div className="space-y-6">
                    {ordersInProgress.map(order => (
                      <OrderCard
                        key={`order-grid-in-progress-${
                          order.orderResponse?.id.toString() || order.orderId
                        }`}
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
                        providerName={order.providerName}
                        providerLogo={order.providerLogo}
                        providerId={order.providerId}
                        paymentStatus={order.paymentStatus}
                        paymentMethod={order.paymentMethod}
                        totalPaidAmount={order.totalPaidAmount}
                        totalRemainingAmount={order.totalRemainingAmount}
                        paymentProgressPercentage={order.paymentProgressPercentage}
                        discountAmount={order.discountAmount}
                        depositAmount={order.depositAmount}
                        itemCount={order.itemCount}
                        deliveryStatus={order.deliveryStatus}
                        onCancelOrder={() => handleCancelOrder(order.orderId)}
                        onViewDetails={() => {
                          const orderResponse = order.orderResponse
                          const actualOrderId = orderResponse?.id || order.orderId
                          handleViewDetails(actualOrderId.toString())
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="border border-gray-100 rounded-[24px] overflow-hidden">
                    {/* Table Header */}
                    <div className="flex items-center bg-white border-b border-gray-100">
                      <div className="flex flex-[1_0_0] h-[91px] items-center justify-center px-5 py-0">
                        <span className="text-16 font-normal text-gray-500 whitespace-nowrap">
                          {t('table.orderNumber')}
                        </span>
                      </div>
                      <div className={`flex flex-[1_0_0] h-[91px] items-center justify-center px-2.5 py-2.5 ${isRTL ? 'border-r' : 'border-l'} border-gray-100`}>
                        <span className="text-16 font-normal text-gray-500 whitespace-nowrap">
                          {t('table.arriveIn')}
                        </span>
                      </div>
                      <div className={`flex flex-[1_0_0] h-[91px] items-center justify-center px-2.5 py-2.5 ${isRTL ? 'border-r' : 'border-l'} border-gray-100`}>
                        <span className="text-16 font-normal text-gray-500 whitespace-nowrap">
                          {t('table.paid')}
                        </span>
                      </div>
                      <div className={`flex flex-[1_0_0] h-[91px] items-center justify-center px-2.5 py-2.5 ${isRTL ? 'border-r' : 'border-l'} border-gray-100`}>
                        <span className="text-16 font-normal text-gray-500 whitespace-nowrap">
                          {t('table.status')}
                        </span>
                      </div>
                    </div>

                    {/* Table Rows */}
                    {ordersInProgress.map((order, index) => (
                      <OrderListItem
                        key={order.orderId}
                        orderId={order.orderId}
                        orderDate={order.orderDate}
                        status={order.status}
                        arrivalDate={order.arrivalDate}
                        total={order.total}
                        isEven={index % 2 === 1}
                        onCancelOrder={() => handleCancelOrder(order.orderId)}
                        onViewDetails={() => {
                          const orderResponse = order.orderResponse
                          const actualOrderId = orderResponse?.id || order.orderId
                          handleViewDetails(actualOrderId.toString())
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Requests History Section */}
            {hasRequestsHistory && (
              <HistorySection
                title={t('sections.requestsHistoryTitle')}
                itemCount={requestsHistory.length}
                suffix={t('sections.requestsHistorySuffix')}
                onClearHistory={handleClearHistory}
              >
                {requestsHistory.map(request => (
                  <RequestCard
                    key={`request-history-${request.requestId}`}
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
                title={t('sections.ordersHistoryTitle')}
                itemCount={ordersHistory.length}
                suffix={t('sections.ordersHistorySuffix')}
                onClearHistory={handleClearHistory}
              >
                {viewMode === 'grid' ? (
                  ordersHistory.map(order => (
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
                      providerName={order.providerName}
                      providerLogo={order.providerLogo}
                      providerId={order.providerId}
                      paymentStatus={order.paymentStatus}
                      paymentMethod={order.paymentMethod}
                      totalPaidAmount={order.totalPaidAmount}
                      totalRemainingAmount={order.totalRemainingAmount}
                      paymentProgressPercentage={order.paymentProgressPercentage}
                      discountAmount={order.discountAmount}
                      depositAmount={order.depositAmount}
                      itemCount={order.itemCount}
                      deliveryStatus={order.deliveryStatus}
                      onReorder={() => handleReorder(order.orderId)}
                      onViewDetails={() => {
                        const orderResponse = order.orderResponse
                        const actualOrderId = orderResponse?.id || order.orderId
                        handleViewDetails(actualOrderId.toString())
                      }}
                    />
                  ))
                ) : (
                  <div className="border border-gray-100 rounded-[24px] overflow-hidden">
                    {/* Table Header */}
                    <div className="flex items-center bg-white border-b border-gray-100">
                      <div className="flex flex-[1_0_0] h-[91px] items-center justify-center px-5 py-0">
                        <span className="text-16 font-normal text-gray-500 whitespace-nowrap">
                          {t('table.orderNumber')}
                        </span>
                      </div>
                      <div className={`flex flex-[1_0_0] h-[91px] items-center justify-center px-2.5 py-2.5 ${isRTL ? 'border-r' : 'border-l'} border-gray-100`}>
                        <span className="text-16 font-normal text-gray-500 whitespace-nowrap">
                          {t('table.arriveIn')}
                        </span>
                      </div>
                      <div className={`flex flex-[1_0_0] h-[91px] items-center justify-center px-2.5 py-2.5 ${isRTL ? 'border-r' : 'border-l'} border-gray-100`}>
                        <span className="text-16 font-normal text-gray-500 whitespace-nowrap">
                          {t('table.paid')}
                        </span>
                      </div>
                      <div className={`flex flex-[1_0_0] h-[91px] items-center justify-center px-2.5 py-2.5 ${isRTL ? 'border-r' : 'border-l'} border-gray-100`}>
                        <span className="text-16 font-normal text-gray-500 whitespace-nowrap">
                          {t('table.status')}
                        </span>
                      </div>
                    </div>

                    {/* Table Rows */}
                    {ordersHistory.map((order, index) => (
                      <OrderListItem
                        key={order.orderId}
                        orderId={order.orderId}
                        orderDate={order.orderDate}
                        status={order.status}
                        arrivalDate={order.arrivalDate}
                        total={order.total}
                        isEven={index % 2 === 1}
                        onViewDetails={() => {
                          const orderResponse = order.orderResponse
                          const actualOrderId = orderResponse?.id || order.orderId
                          handleViewDetails(actualOrderId.toString())
                        }}
                      />
                    ))}
                  </div>
                )}
              </HistorySection>
            )}
            </>
          )}
        </div>
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
      <LoadingSpinner
       
        open={cancelOrderMutation.isPending}
        text={`${t('actions.cancelLoadingTitle')} ${t('actions.cancelLoadingSubtitle')}`}
        
      />
    </>
  )
}
