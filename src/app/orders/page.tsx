'use client'

import { useState } from 'react'
import { OrderCard } from '@/components/ui/OrderCard'
import { RequestCard } from '@/components/ui/RequestCard'
import {
  CancelOrderModal,
  CancelOrderSuccessModal,
  OrderCheckoutModal,
  OrderConfirmationModal,
  EmptyState,
  HistorySection,
  SectionHeader,
  ServicesProductsFilter,
  PageHeader,
} from '@/components/ui'
import { UserPageLayout } from '@/components/layout'
import type { OrderStatus } from '@/components/ui/OrderProgressIndicator'
import type { RequestStatus } from '@/components/ui/RequestProgressIndicator'
import type {
  OrderItem,
  OrderFormData,
} from '@/components/ui/OrderCheckoutModal'
import orderEmptySvg from '@/assets/svg/order-empty.svg'

// Mock data - Replace with actual API data later
const mockOrdersInProgress = [
  {
    orderId: '2215689',
    orderDate: '1/8/2025',
    status: 'preparing' as OrderStatus,
    arrivalDate: '10/8/2025',
    arrivalTime: '5:30 PM',
    products: [
      {
        id: '1',
        title: 'Product Title',
        image:
          'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200',
        price: 350,
        quantity: 1,
      },
      {
        id: '2',
        title: 'Product Title',
        image:
          'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200',
        price: 350,
        quantity: 1,
      },
    ],
    subtotal: 10250,
    taxesAndFees: 120,
    deliveryFee: 90,
    total: 10460,
  },
  {
    orderId: '2215690',
    orderDate: '1/8/2025',
    status: 'onTheWay' as OrderStatus,
    arrivalDate: '10/8/2025',
    arrivalTime: '5:30 PM',
    products: [
      {
        id: '1',
        title: 'Product Title',
        image:
          'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200',
        price: 350,
        quantity: 1,
      },
      {
        id: '2',
        title: 'Product Title',
        image:
          'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200',
        price: 350,
        quantity: 1,
      },
    ],
    subtotal: 10250,
    taxesAndFees: 120,
    deliveryFee: 90,
    total: 10460,
  },
  {
    orderId: '2215691',
    orderDate: '1/8/2025',
    status: 'received' as OrderStatus,
    arrivalDate: '10/8/2025',
    arrivalTime: '5:30 PM',
    products: [
      {
        id: '1',
        title: 'Product Title',
        image:
          'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200',
        price: 350,
        quantity: 1,
      },
      {
        id: '2',
        title: 'Product Title',
        image:
          'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200',
        price: 350,
        quantity: 1,
      },
    ],
    subtotal: 10250,
    taxesAndFees: 120,
    deliveryFee: 90,
    total: 10460,
  },
]

const mockOrdersHistory = [
  {
    orderId: '2215689',
    orderDate: '1/8/2025',
    status: 'delivered' as OrderStatus,
    arrivalDate: '10/8/2025',
    arrivalTime: '5:30 PM',
    products: [
      {
        id: '1',
        title: 'Product Title',
        image:
          'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200',
        price: 350,
        quantity: 1,
      },
      {
        id: '2',
        title: 'Product Title',
        image:
          'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200',
        price: 350,
        quantity: 1,
      },
    ],
    subtotal: 10250,
    taxesAndFees: 120,
    deliveryFee: 90,
    total: 10460,
  },
  {
    orderId: '2215692',
    orderDate: '1/8/2025',
    status: 'cancelled' as OrderStatus,
    arrivalDate: '10/8/2025',
    arrivalTime: '5:30 PM',
    products: [
      {
        id: '1',
        title: 'Product Title',
        image:
          'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200',
        price: 350,
        quantity: 1,
      },
      {
        id: '2',
        title: 'Product Title',
        image:
          'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200',
        price: 350,
        quantity: 1,
      },
    ],
    subtotal: 10250,
    taxesAndFees: 120,
    deliveryFee: 90,
    total: 10460,
  },
]

// Mock service requests data
const mockRequestsInProgress = [
  {
    requestId: '2215689',
    requestDate: '1/8/2025',
    status: 'requestReceived' as RequestStatus,
    service: {
      id: '1',
      title: 'Service Title',
      image:
        'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200',
      rating: {
        value: 4.5,
        count: 24,
      },
      provider: {
        name: 'Ali Mohamed',
      },
    },
    assignedTo: 'Dashboard Name',
    dueDate: '10/8/2025',
    dueTime: '5:30 PM',
    packages: [
      { title: 'Package Detail', price: 10250 },
      { title: 'Package Detail', price: 120 },
      { title: 'Package Detail', price: 120 },
      { title: 'Package Detail', price: 120 },
    ],
    subtotal: 10250,
    taxesAndFees: 120,
    total: 10460,
  },
  {
    requestId: '2215690',
    requestDate: '1/8/2025',
    status: 'underReview' as RequestStatus,
    service: {
      id: '2',
      title: 'Service Title',
      image:
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200',
      rating: {
        value: 4.5,
        count: 24,
      },
      provider: {
        name: 'Ali Mohamed',
      },
    },
    assignedTo: 'Dashboard Name',
    dueDate: '10/8/2025',
    dueTime: '5:30 PM',
    packages: [
      { title: 'Package Detail', price: 10250 },
      { title: 'Package Detail', price: 120 },
      { title: 'Package Detail', price: 120 },
      { title: 'Package Detail', price: 120 },
    ],
    subtotal: 10250,
    taxesAndFees: 120,
    total: 10460,
  },
  {
    requestId: '2215691',
    requestDate: '1/8/2025',
    status: 'confirmed' as RequestStatus,
    service: {
      id: '3',
      title: 'Service Title',
      image:
        'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200',
      rating: {
        value: 4.5,
        count: 24,
      },
      provider: {
        name: 'Ali Mohamed',
      },
    },
    assignedTo: 'Dashboard Name',
    dueDate: '10/8/2025',
    dueTime: '5:30 PM',
    packages: [
      { title: 'Package Detail', price: 10250 },
      { title: 'Package Detail', price: 120 },
      { title: 'Package Detail', price: 120 },
      { title: 'Package Detail', price: 120 },
    ],
    subtotal: 10250,
    taxesAndFees: 120,
    total: 10460,
  },
]

// Mock requests history (completed and cancelled)
const mockRequestsHistory = [
  {
    requestId: '2215692',
    requestDate: '1/8/2025',
    status: 'completed' as RequestStatus,
    service: {
      id: '4',
      title: 'Service Title',
      image:
        'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200',
      rating: {
        value: 4.5,
        count: 24,
      },
      provider: {
        name: 'Ali Mohamed',
      },
    },
    assignedTo: 'Dashboard Name',
    dueDate: '10/8/2025',
    dueTime: '5:30 PM',
    packages: [
      { title: 'Package Detail', price: 10250 },
      { title: 'Package Detail', price: 120 },
      { title: 'Package Detail', price: 120 },
      { title: 'Package Detail', price: 120 },
    ],
    subtotal: 10250,
    taxesAndFees: 120,
    total: 10460,
  },
  {
    requestId: '2215693',
    requestDate: '1/8/2025',
    status: 'cancelled' as RequestStatus,
    service: {
      id: '5',
      title: 'Service Title',
      image:
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200',
      rating: {
        value: 4.5,
        count: 24,
      },
      provider: {
        name: 'Ali Mohamed',
      },
    },
    assignedTo: 'Dashboard Name',
    dueDate: '10/8/2025',
    dueTime: '5:30 PM',
    packages: [
      { title: 'Package Detail', price: 10250 },
      { title: 'Package Detail', price: 120 },
      { title: 'Package Detail', price: 120 },
      { title: 'Package Detail', price: 120 },
    ],
    subtotal: 10250,
    taxesAndFees: 120,
    total: 10460,
  },
]

export default function OrdersPage() {
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false)
  const [orderConfirmationModalOpen, setOrderConfirmationModalOpen] =
    useState(false)
  const [selectedRequestForCheckout, setSelectedRequestForCheckout] = useState<
    (typeof mockRequestsInProgress)[0] | null
  >(null)
  const [filterType, setFilterType] = useState<'services' | 'products'>(
    'services'
  )

  const handleCancelOrder = (orderId: string) => {
    setSelectedOrderId(orderId)
    setCancelModalOpen(true)
  }

  const handleConfirmCancel = (_reason?: string) => {
    // TODO: Implement order cancellation API call
    setCancelModalOpen(false)
    // Here you would make an API call to cancel the order
    // After successful cancellation, show success modal
    setSuccessModalOpen(true)
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

  const handleCheckout = (requestId: string) => {
    const request = mockRequestsInProgress.find(r => r.requestId === requestId)
    if (request) {
      setSelectedRequestForCheckout(request)
      setCheckoutModalOpen(true)
    }
  }

  const convertRequestToOrderItems = (
    request: (typeof mockRequestsInProgress)[0]
  ): OrderItem[] => {
    // Convert service request to order items format for checkout modal
    const items: OrderItem[] = [
      {
        id: request.requestId,
        title: request.service.title,
        image: request.service.image,
        originalPrice: request.subtotal,
        discountedPrice: request.subtotal,
        currency: 'EGP',
        quantity: 1,
      },
      ...request.packages.map((pkg, index) => ({
        id: `${request.requestId}-pkg-${index}`,
        title: pkg.title,
        image: request.service.image,
        originalPrice: pkg.price,
        discountedPrice: pkg.price,
        currency: 'EGP',
        quantity: 1,
      })),
    ]
    return items
  }

  const handleServiceCheckout = async (_orderData: OrderFormData) => {
    // TODO: Implement checkout API call
    // After successful checkout, close checkout modal and show confirmation
    setCheckoutModalOpen(false)
    setOrderConfirmationModalOpen(true)
  }

  const handleCloseCheckoutModal = () => {
    setCheckoutModalOpen(false)
    setSelectedRequestForCheckout(null)
  }

  const handleCloseOrderConfirmation = () => {
    setOrderConfirmationModalOpen(false)
    setSelectedRequestForCheckout(null)
  }

  const hasOrders =
    mockOrdersInProgress.length > 0 || mockOrdersHistory.length > 0
  const hasRequests = mockRequestsInProgress.length > 0
  const hasRequestsHistory = mockRequestsHistory.length > 0
  const hasAnyContent = hasOrders || hasRequests || hasRequestsHistory

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
                  count={mockRequestsInProgress.length}
                  suffix="Requests in Progress"
                />
                <div className="space-y-6 mb-12">
                  {mockRequestsInProgress.map(request => (
                    <RequestCard
                      key={request.requestId}
                      requestId={request.requestId}
                      requestDate={request.requestDate}
                      status={request.status}
                      service={request.service}
                      assignedTo={request.assignedTo}
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
            {mockOrdersInProgress.length > 0 && (
              <>
                <SectionHeader
                  title="Order In Progress"
                  count={mockOrdersInProgress.length}
                  suffix="Orders In Progress"
                />

                {/* Order Cards */}
                <div className="space-y-6">
                  {mockOrdersInProgress.map(order => (
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
                itemCount={mockRequestsHistory.length}
                suffix="Requests"
                onClearHistory={handleClearHistory}
              >
                {mockRequestsHistory.map(request => (
                  <RequestCard
                    key={request.requestId}
                    requestId={request.requestId}
                    requestDate={request.requestDate}
                    status={request.status}
                    service={request.service}
                    assignedTo={request.assignedTo}
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
            {mockOrdersHistory.length > 0 && (
              <HistorySection
                title="Orders History"
                itemCount={mockOrdersHistory.length}
                suffix="Orders"
                onClearHistory={handleClearHistory}
              >
                {mockOrdersHistory.map(order => (
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

      {/* Service Checkout Modal */}
      {selectedRequestForCheckout && (
        <OrderCheckoutModal
          isOpen={checkoutModalOpen}
          onClose={handleCloseCheckoutModal}
          items={convertRequestToOrderItems(selectedRequestForCheckout)}
          onCheckout={handleServiceCheckout}
          onTrackOrder={() => {
            handleCloseCheckoutModal()
            // Stay on orders page
          }}
          currency="EGP"
          taxes={selectedRequestForCheckout.taxesAndFees}
          deliveryFee={0}
        />
      )}

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={orderConfirmationModalOpen}
        onClose={handleCloseOrderConfirmation}
        onTrackOrder={() => {
          handleCloseOrderConfirmation()
          // Stay on orders page - could refresh or navigate
        }}
      />
    </>
  )
}
