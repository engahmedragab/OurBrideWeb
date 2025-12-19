'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { UserPageLayout } from '@/components/layout'
import {
  EmptyState,
  CartItem,
  CartOrderSummary,
  RequestCard,
  DeleteCartItemModal,
  CancelRequestModal,
  ServicesProductsFilter,
  PageHeader,
  type OrderItem,
} from '@/components/ui'
import type { RequestStatus } from '@/components/ui/RequestProgressIndicator'
import orderEmptySvg from '@/assets/svg/order-empty.svg'

interface CartProduct {
  id: string
  title: string
  image: string
  originalPrice: number
  discountedPrice: number
  quantity: number
  deliveryDate?: string
  discountPercentage?: number
}

// Mock cart products data
const mockCartProducts: CartProduct[] = [
  {
    id: '1',
    title: 'Product Title',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200',
    originalPrice: 350,
    discountedPrice: 350,
    quantity: 2,
    deliveryDate: '29/8/2025',
    discountPercentage: 20,
  },
  {
    id: '2',
    title: 'Product Title',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200',
    originalPrice: 350,
    discountedPrice: 350,
    quantity: 2,
    deliveryDate: '29/8/2025',
    discountPercentage: 20,
  },
  {
    id: '3',
    title: 'Product Title',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200',
    originalPrice: 350,
    discountedPrice: 350,
    quantity: 2,
    deliveryDate: '29/8/2025',
    discountPercentage: 20,
  },
]

// Mock service requests data
const mockServiceRequests = [
  {
    requestId: '2215689',
    requestDate: '1/8/2025',
    status: 'requestReceived' as RequestStatus,
    service: {
      id: '1',
      title: 'Service Title',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200',
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
      image: 'https://images.unsplash.com/photo-1560066984-10d1eeb6b2a5?w=200',
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
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200',
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

export default function CartPage() {
  const router = useRouter()
  const [cartType, setCartType] = useState<'services' | 'products'>('products')
  const [cartProducts, setCartProducts] = useState<CartProduct[]>(mockCartProducts)
  const [serviceRequests, setServiceRequests] = useState(mockServiceRequests)

  // Modal states
  const [deleteItemModalOpen, setDeleteItemModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [cancelRequestModalOpen, setCancelRequestModalOpen] = useState(false)
  const [requestToCancel, setRequestToCancel] = useState<string | null>(null)

  // Mock: In real app, check if cart has items
  const hasServices = serviceRequests.length > 0
  const hasProducts = cartProducts.length > 0

  // Calculate totals
  const { subtotal, taxesAndFees, deliveryFee, total } = useMemo(() => {
    const sub = cartProducts.reduce(
      (sum, product) => sum + product.discountedPrice * product.quantity,
      0
    )
    const taxes = 120
    const delivery = 90
    const tot = sub + taxes + delivery

    return {
      subtotal: sub,
      taxesAndFees: taxes,
      deliveryFee: delivery,
      total: tot,
    }
  }, [cartProducts])

  const handleQuantityChange = (id: string, delta: number) => {
    setCartProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, quantity: Math.max(1, product.quantity + delta) }
          : product
      )
    )
  }

  const handleRemoveItemClick = (id: string) => {
    setItemToDelete(id)
    setDeleteItemModalOpen(true)
  }

  const handleConfirmDeleteItem = () => {
    if (itemToDelete) {
      setCartProducts(prev => prev.filter(product => product.id !== itemToDelete))
      setItemToDelete(null)
    }
  }

  const handleBuyNow = (id: string) => {
    if (cartProducts.find(p => p.id === id)) {
      router.push('/checkout')
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  const handleServiceCheckout = (requestId: string) => {
    const request = serviceRequests.find(r => r.requestId === requestId)
    if (request) {
      router.push('/booking')
    }
  }

  const handleCancelRequestClick = (requestId: string) => {
    setRequestToCancel(requestId)
    setCancelRequestModalOpen(true)
  }

  const handleConfirmCancelRequest = (_reason?: string) => {
    if (requestToCancel) {
      setServiceRequests(prev => prev.filter(req => req.requestId !== requestToCancel))
      setRequestToCancel(null)
    }
  }

  return (
    <UserPageLayout>
      {/* Page Header */}
      <PageHeader
        title="My Cart"
        rightContent={
          <ServicesProductsFilter value={cartType} onChange={setCartType} />
        }
      />

      {/* Content Area */}
      {cartType === 'products' && hasProducts ? (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Cart Items */}
          <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
            {cartProducts.map(product => (
              <CartItem
                key={product.id}
                id={product.id}
                title={product.title}
                image={product.image}
                originalPrice={product.originalPrice}
                discountedPrice={product.discountedPrice}
                quantity={product.quantity}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItemClick}
                onBuyNow={handleBuyNow}
                deliveryDate={product.deliveryDate}
                discountPercentage={product.discountPercentage}
              />
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-96 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-6">
              <CartOrderSummary
                subtotal={subtotal}
                taxesAndFees={taxesAndFees}
                deliveryFee={deliveryFee}
                total={total}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      ) : cartType === 'products' && !hasProducts ? (
        <EmptyState
          illustration={orderEmptySvg}
          title="You don't have any Products Here"
          description="Start exploring services and products to begin your journey"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      ) : cartType === 'services' && hasServices ? (
        <div className="space-y-4 sm:space-y-6">
          {serviceRequests.map(request => (
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
              onCancelRequest={() => handleCancelRequestClick(request.requestId)}
              onCheckout={
                request.status === 'confirmed'
                  ? () => handleServiceCheckout(request.requestId)
                  : undefined
              }
            />
          ))}
        </div>
      ) : cartType === 'services' && !hasServices ? (
        <EmptyState
          illustration={orderEmptySvg}
          title="You don't have any Requests Ready To Checkout"
          description="Start exploring services to begin your journey"
          actionLabel="View Services"
          actionHref="/services"
        />
      ) : null}

      {/* Delete Cart Item Modal */}
      <DeleteCartItemModal
        isOpen={deleteItemModalOpen}
        onClose={() => {
          setDeleteItemModalOpen(false)
          setItemToDelete(null)
        }}
        onConfirm={handleConfirmDeleteItem}
        productTitle={
          itemToDelete
            ? cartProducts.find(p => p.id === itemToDelete)?.title
            : undefined
        }
      />

      {/* Cancel Request Modal */}
      <CancelRequestModal
        isOpen={cancelRequestModalOpen}
        onClose={() => {
          setCancelRequestModalOpen(false)
          setRequestToCancel(null)
        }}
        onConfirm={handleConfirmCancelRequest}
        requestId={requestToCancel || undefined}
      />

    </UserPageLayout>
  )
}

