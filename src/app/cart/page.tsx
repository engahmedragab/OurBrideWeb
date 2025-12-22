'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQueries } from '@tanstack/react-query'
import { UserPageLayout } from '@/components/layout'
import {
  EmptyState,
  CartItem,
  CartOrderSummary,
  RequestCard,
  DeleteCartItemModal,
  CancelRequestModal,
  PageHeader,
  ErrorDisplay,
  LoadingOverlay,
  type OrderItem,
} from '@/components/ui'
import type { RequestStatus } from '@/components/ui/RequestProgressIndicator'
import orderEmptySvg from '@/assets/svg/order-empty.svg'
import { useCart, useUpdatePurchase, useRemovePurchase } from '@/Hooks'
import { getProductById } from '@/services/api/products.api'
import type { PurchaseResponse } from '@/types/responses'
import type { ProductHeaderResponse, ProductResponse } from '@/types/responses'
import { PurchaseType } from '@/../client/common/api/gen/ourbride-api'

interface CartProduct {
  id: string
  title: string
  image: string
  originalPrice: number
  discountedPrice: number
  quantity: number
  deliveryDate?: string
  discountPercentage?: number
  purchaseId: number // Store purchase ID for API calls
}


/**
 * Map PurchaseResponse to CartProduct
 * Handles cases where product data might be null but productId exists
 */
const mapPurchaseToCartProduct = (
  purchase: PurchaseResponse,
  fetchedProduct?: {
    nameEn: string | null
    nameAr: string | null
    image: string | null
    regularPrice: number | null
    price: number | null
    salePrice: number | null
    hasDiscount: boolean
  }
): CartProduct | null => {
  if (purchase.type !== PurchaseType.Product || !purchase.productId) {
    return null
  }

  // Use product data if available (from purchase or fetched)
  const product = purchase.product ?? fetchedProduct
  const purchasePrice = purchase.totalPrice ?? purchase.price ?? 0
  const pricePerUnit = purchasePrice / (purchase.quantity || 1)

  // If product data exists, use it
  if (product) {
    const originalPrice = product.regularPrice ?? product.price ?? pricePerUnit
    const discountedPrice = product.salePrice ?? product.price ?? originalPrice
    const hasDiscount = product.hasDiscount && product.salePrice && product.regularPrice
    const discountPercentage = hasDiscount
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : undefined

    // Format delivery date if available
    const deliveryDate = purchase.preferredDeliveryDate
      ? new Date(purchase.preferredDeliveryDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      : undefined

    // Handle both image and imageUrl fields
    const productImage =
      product.image ?? (product as any).imageUrl ?? '/placeholder-product.png'

    return {
      id: purchase.productId.toString(),
      title: product.nameEn ?? product.nameAr ?? 'Product',
      image: productImage,
      originalPrice,
      discountedPrice,
      quantity: purchase.quantity,
      deliveryDate,
      discountPercentage,
      purchaseId: purchase.id,
    }
  }

  // Fallback: Use purchase data when product is null and couldn't be fetched
  // Format delivery date if available
  const deliveryDate = purchase.preferredDeliveryDate
    ? new Date(purchase.preferredDeliveryDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    : undefined

  return {
    id: purchase.productId.toString(),
    title: `Product #${purchase.productId}`, // Show product ID as fallback
    image: '/placeholder-product.png',
    originalPrice: pricePerUnit,
    discountedPrice: pricePerUnit,
    quantity: purchase.quantity,
    deliveryDate,
    discountPercentage: undefined,
    purchaseId: purchase.id,
  }
}

/**
 * Map PurchaseStatus to RequestStatus
 */
const mapPurchaseStatusToRequestStatus = (status: string): RequestStatus => {
  const statusMap: Record<string, RequestStatus> = {
    RequestReceived: 'requestReceived',
    UnderReview: 'underReview',
    Confirmed: 'confirmed',
    Completed: 'completed',
    Cancelled: 'cancelled',
  }
  return statusMap[status] ?? 'requestReceived'
}

export default function CartPage() {
  const router = useRouter()

  // Modal states
  const [deleteItemModalOpen, setDeleteItemModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [cancelRequestModalOpen, setCancelRequestModalOpen] = useState(false)
  const [requestToCancel, setRequestToCancel] = useState<string | null>(null)

  // Fetch cart data - only use getCart endpoint
  const { data: cartData, isLoading, error } = useCart()

  // Mutations
  const updatePurchaseMutation = useUpdatePurchase()
  const removePurchaseMutation = useRemovePurchase()

  // Get product IDs that need to be fetched (where product is null but productId exists)
  const productIdsToFetch = useMemo(() => {
    console.log('Cart Data:', cartData)
    if (!cartData?.purchases) return []
    return cartData.purchases
      .filter(
        (p) =>
          p.type === PurchaseType.Product &&
          p.productId &&
          !p.product
      )
      .map((p) => p.productId!)
  }, [cartData])

  // Fetch product details for purchases that have productId but product is null
  const productQueries = useQueries({
    queries: productIdsToFetch.map((productId) => ({
      queryKey: ['product', productId],
      queryFn: async () => {
        const product = await getProductById(productId)
        return { productId, product }
      },
      enabled: productId > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  })

  // Create a map of productId -> Product data for quick lookup
  // Store minimal product info needed for cart display
  const productMap = useMemo(() => {
    const map = new Map<
      number,
      {
        nameEn: string | null
        nameAr: string | null
        image: string | null
        regularPrice: number | null
        price: number | null
        salePrice: number | null
        hasDiscount: boolean
      }
    >()
    productQueries.forEach((query) => {
      if (query.data?.product) {
        const product = query.data.product as ProductResponse
        map.set(query.data.productId, {
          nameEn: product.nameEn,
          nameAr: product.nameAr,
          image: product.image,
          regularPrice: product.regularPrice,
          price: product.price,
          salePrice: product.salePrice,
          hasDiscount: product.hasDiscount,
        })
      }
    })
    return map
  }, [productQueries])

  // Map API data to component formats - extract both products and services from cart
  const cartProducts = useMemo(() => {
    if (!cartData?.purchases) return []
    return cartData.purchases
      .map((purchase) => {
        // If product is null but productId exists, try to get it from the fetched products
        if (
          purchase.type === PurchaseType.Product &&
          purchase.productId &&
          !purchase.product
        ) {
          const fetchedProduct = productMap.get(purchase.productId)
          if (fetchedProduct) {
            return mapPurchaseToCartProduct(purchase, fetchedProduct)
          }
        }
        return mapPurchaseToCartProduct(purchase)
      })
      .filter((product): product is CartProduct => product !== null)
  }, [cartData, productMap])

  // Filter service purchases
  const servicePurchases = useMemo(() => {
    if (!cartData?.purchases) return []
    return cartData.purchases.filter(
      (p) => p.type === PurchaseType.Service && p.service
    )
  }, [cartData])

  const hasServices = servicePurchases.length > 0
  const hasProducts = cartProducts.length > 0
  const hasItems = hasProducts || hasServices

  // Calculate totals from cart summary if available, otherwise calculate from products
  const { subtotal, taxesAndFees, deliveryFee, total } = useMemo(() => {
    if (cartData?.cartSummary) {
      const summary = cartData.cartSummary
      return {
        subtotal: summary.subtotal,
        taxesAndFees: summary.tax,
        deliveryFee: summary.shipping,
        total: summary.total,
      }
    }

    // Fallback: calculate from products
    const sub = cartProducts.reduce(
      (sum, product) => sum + product.discountedPrice * product.quantity,
      0
    )
    const taxes = 0 // Will be calculated by API
    const delivery = 0 // Will be calculated by API
    const tot = sub + taxes + delivery

    return {
      subtotal: sub,
      taxesAndFees: taxes,
      deliveryFee: delivery,
      total: tot,
    }
  }, [cartProducts, cartData])

  const handleQuantityChange = async (id: string, delta: number) => {
    const product = cartProducts.find(p => p.id === id)
    if (!product) return

    const newQuantity = Math.max(1, product.quantity + delta)
    if (newQuantity === product.quantity) return

    try {
      await updatePurchaseMutation.mutateAsync({
        id: product.purchaseId.toString(),
        data: {
          quantity: newQuantity,
        },
      })
    } catch (error) {
      console.error('Failed to update quantity:', error)
      // You might want to show a toast notification here
    }
  }

  const handleRemoveItemClick = (id: string) => {
    setItemToDelete(id)
    setDeleteItemModalOpen(true)
  }

  const handleConfirmDeleteItem = async () => {
    if (!itemToDelete) return

    const product = cartProducts.find(p => p.id === itemToDelete)
    if (!product) return

    try {
      await removePurchaseMutation.mutateAsync({
        id: product.purchaseId.toString(),
        data: {
          // PurchaseRemoveRequest might need additional fields
          // Check the API definition for required fields
        },
      })
      setItemToDelete(null)
      setDeleteItemModalOpen(false)
    } catch (error) {
      console.error('Failed to remove item:', error)
      // You might want to show a toast notification here
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

  const handleServiceCheckout = (_purchaseId: number) => {
    router.push('/booking')
  }

  const handleCancelRequestClick = (purchaseId: number) => {
    setRequestToCancel(purchaseId.toString())
    setCancelRequestModalOpen(true)
  }

  const handleConfirmCancelRequest = async (_reason?: string) => {
    if (!requestToCancel) return

    try {
      await removePurchaseMutation.mutateAsync({
        id: requestToCancel,
        data: {
          // PurchaseRemoveRequest might need additional fields
          // Check the API definition for required fields
        },
      })
      setRequestToCancel(null)
      setCancelRequestModalOpen(false)
    } catch (error) {
      console.error('Failed to cancel request:', error)
      // You might want to show a toast notification here
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <UserPageLayout>
        <PageHeader title="My Cart" />
        <LoadingOverlay
          open={true}
          title="Loading cart..."
          subtitle="Please wait a moment"
        />
      </UserPageLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <UserPageLayout>
        <PageHeader title="My Cart" />
        <ErrorDisplay
          title="Error loading cart"
          message="Please try again later"
          actionLabel="Back to Home"
          actionHref="/"
        />
      </UserPageLayout>
    )
  }

  return (
    <UserPageLayout>
      {/* Page Header */}
      <PageHeader title="My Cart" />

      {/* Content Area */}
      {hasItems ? (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Cart Items */}
          <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
            {/* Products Section */}
            {hasProducts && (
              <>
                {cartProducts.length > 0 && (
                  <div className="space-y-3 sm:space-y-4">
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
                )}
              </>
            )}

            {/* Services Section */}
            {hasServices && (
              <div className="space-y-4 sm:space-y-6">
                {servicePurchases.map((purchase) => {
                  if (!purchase.service) return null

                  const service = purchase.service
                  const price = purchase.totalPrice ?? purchase.price ?? 0
                  const status = mapPurchaseStatusToRequestStatus(purchase.status)

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

                  return (
                    <RequestCard
                      key={purchase.id}
                      requestId={purchase.id.toString()}
                      requestDate={requestDate}
                      status={status}
                      service={{
                        id: (purchase.serviceId ?? purchase.id).toString(),
                        title: service.nameEn ?? service.nameAr ?? 'Service',
                        image: service.imageUrl ?? '/placeholder-service.png',
                        rating: {
                          value: service.rate ?? 0,
                          count: 0, // ServiceHeaderResponse doesn't have rating count
                        },
                        provider: {
                          name:
                            purchase.providerName ??
                            service.provider?.nameEn ??
                            service.provider?.nameAr ??
                            'Provider',
                        },
                      }}
                      assignedTo={purchase.providerName}
                      dueDate={dueDate}
                      dueTime={dueTime}
                      packages={[
                        {
                          title: 'Service Package',
                          price: price,
                        },
                      ]}
                      subtotal={price}
                      taxesAndFees={0}
                      total={price}
                      onCancelRequest={() => handleCancelRequestClick(purchase.id)}
                      onCheckout={
                        status === 'confirmed'
                          ? () => handleServiceCheckout(purchase.id)
                          : undefined
                      }
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar - Only show for products */}
          {hasProducts && (
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
          )}
        </div>
      ) : (
        <EmptyState
          illustration={orderEmptySvg}
          title="Your cart is empty"
          description="Start exploring services and products to begin your journey"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      )}

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

      {/* Loading Overlay for Mutations */}
      <LoadingOverlay
        open={updatePurchaseMutation.isPending || removePurchaseMutation.isPending}
        title="Updating cart..."
        subtitle="Please wait a moment"
      />
    </UserPageLayout>
  )
}

