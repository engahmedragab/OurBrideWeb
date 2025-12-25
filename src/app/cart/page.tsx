'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import { RefreshCw, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { useCart, useCartProviders, useUpdatePurchase, useRemovePurchase, useClearCart } from '@/hooks'
import { getCartByProvider } from '@/services/api/purchaseApi'
import { getProductById } from '@/services/api/products.api'
import type { PurchaseResponse } from '@/types/responses'
import type { ProductHeaderResponse, ProductResponse } from '@/types/responses'
import type { ReservationResponse } from '@/types/responses'
import type {
  CartProduct,
  CartReservation,
  CartMembership,
  CartGiftCard,
} from '@/types/responses'
import { PurchaseType } from '@/../client/common/api/gen/ourbride-api'
import type { CartItemType } from '@/components/ui/CartItem'
import { ProviderMultiSelect } from '@/components/ui'

/**
 * Map PurchaseResponse to CartProduct using display properties from PurchaseResponse
 * Priority: purchase.name > purchase.product > fetchedProduct > fallback
 */
const mapPurchaseToCartProduct = (
  purchase: PurchaseResponse,
  fetchedProduct?: ProductResponse
): CartProduct | null => {
  if (purchase.type !== PurchaseType.Product) {
    return null
  }

  const purchasePrice = purchase.totalPrice ?? purchase.price ?? 0
  const pricePerUnit = purchasePrice / (purchase.quantity || 1)
  const productId = purchase.productId ?? purchase.id

  // Priority 1: Use display properties from PurchaseResponse (stored directly for performance)
  const displayName = purchase.name ?? purchase.nameEn ?? purchase.nameAr
  const displayImage = purchase.imageUrl

  // Priority 2: Use ProductHeaderResponse from purchase.product if available
  const productHeader = purchase.product

  // Priority 3: Use fetched ProductResponse if available
  // Priority 4: Fallback to type name

  let title = displayName
  let image = displayImage ?? '/placeholder-product.png'
  let originalPrice = pricePerUnit
  let discountedPrice = pricePerUnit
  let discountPercentage: number | undefined = undefined

  // If ProductHeaderResponse exists, use it for pricing
  if (productHeader) {
    originalPrice = productHeader.regularPrice ?? productHeader.price ?? pricePerUnit
    discountedPrice = productHeader.salePrice ?? productHeader.price ?? originalPrice
    const hasDiscount = productHeader.hasDiscount && productHeader.salePrice && productHeader.regularPrice
    discountPercentage = hasDiscount
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : undefined

    // Use product header name/image if purchase display properties are not available
    if (!title) {
      title = productHeader.nameEn ?? productHeader.nameAr ?? null
    }
    if (!displayImage) {
      image = productHeader.image ?? '/placeholder-product.png'
    }
  }

  // Fallback: Use fetched ProductResponse if available
  if (!title && fetchedProduct) {
    title = fetchedProduct.nameEn ?? fetchedProduct.nameAr ?? null
    if (!displayImage) {
      image = fetchedProduct.image ?? '/placeholder-product.png'
    }
    if (!productHeader) {
      originalPrice = fetchedProduct.regularPrice ?? fetchedProduct.price ?? pricePerUnit
      discountedPrice = fetchedProduct.salePrice ?? fetchedProduct.price ?? originalPrice
      const hasDiscount = fetchedProduct.hasDiscount && fetchedProduct.salePrice && fetchedProduct.regularPrice
      discountPercentage = hasDiscount
        ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
        : undefined
    }
  }

  // Final fallback: Use type name if name is still null
  if (!title) {
    title = 'Product'
  }

  // Format delivery date if available
  const deliveryDate = purchase.preferredDeliveryDate
    ? new Date(purchase.preferredDeliveryDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    : undefined

  return {
    id: productId.toString(),
    title,
    image,
    originalPrice,
    discountedPrice,
    quantity: purchase.quantity,
    deliveryDate,
    discountPercentage,
    purchaseId: purchase.id,
    type: 'Product' as CartItemType,
    purchasePrice: purchase.totalPrice ?? purchase.price ?? null,
    purchaseDate: purchase.creationDate ?? purchase.buyDate ?? undefined,
  }
}

/**
 * Map PurchaseResponse to CartReservation using display properties from PurchaseResponse
 * Priority: purchase.name > reservation.service > fallback to type name
 */
const mapPurchaseToCartReservation = (
  purchase: PurchaseResponse
): CartReservation | null => {
  if (purchase.type !== PurchaseType.Reservation) {
    return null
  }

  const price = purchase.totalPrice ?? purchase.price ?? 0

  // Priority 1: Use display properties from PurchaseResponse
  let title = purchase.name ?? purchase.nameEn ?? purchase.nameAr
  let image = purchase.imageUrl ?? '/placeholder-service.png'

  // Priority 2: Use ReservationResponse if available
  if (purchase.reservation) {
    const reservation: ReservationResponse = purchase.reservation
    const service = reservation.service

    // Use service name/image if purchase display properties are not available
    if (!title) {
      title = service?.nameEn ?? service?.nameAr ?? null
    }
    if (!purchase.imageUrl) {
      image = service?.imageUrl ?? '/placeholder-service.png'
    }

    const reservationDate = reservation.reservationDate
      ? new Date(reservation.reservationDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      : undefined

    // Final fallback: Use type name if name is still null
    if (!title) {
      title = 'Reservation'
    }

    return {
      id: purchase.id.toString(),
      title,
      image,
      price,
      quantity: purchase.quantity,
      purchaseId: purchase.id,
      reservationId: reservation.reservationId,
      reservationDate,
      status: reservation.status,
      purchasePrice: purchase.totalPrice ?? purchase.price ?? null,
      purchaseDate: purchase.creationDate ?? purchase.buyDate ?? undefined,
      type: 'Reservation' as CartItemType,
    }
  }

  // Fallback: Use type name if reservation is null
  if (!title) {
    title = 'Reservation'
  }

  return {
    id: purchase.id.toString(),
    title,
    image,
    price,
    quantity: purchase.quantity,
    purchaseId: purchase.id,
    reservationId: purchase.reservationId ?? '',
    reservationDate: undefined,
    status: purchase.status as any,
    purchasePrice: purchase.totalPrice ?? purchase.price ?? null,
    purchaseDate: purchase.creationDate ?? purchase.buyDate ?? undefined,
    type: 'Reservation' as CartItemType,
  }
}

/**
 * Map PurchaseResponse to CartMembership using display properties from PurchaseResponse
 * Priority: purchase.name > fallback to type name
 */
const mapPurchaseToCartMembership = (
  purchase: PurchaseResponse
): CartMembership | null => {
  if (purchase.type !== PurchaseType.Membership) {
    return null
  }

  const price = purchase.totalPrice ?? purchase.price ?? 0

  // Priority: Use display properties from PurchaseResponse, fallback to type name
  const title = purchase.name ?? purchase.nameEn ?? purchase.nameAr ?? 'Membership'
  const image = purchase.imageUrl ?? '/placeholder-membership.png'

  return {
    id: purchase.id.toString(),
    title,
    image,
    price,
    quantity: purchase.quantity,
    purchaseId: purchase.id,
    membershipId: purchase.membershipId,
    purchasePrice: purchase.totalPrice ?? purchase.price ?? null,
    purchaseDate: purchase.creationDate ?? purchase.buyDate ?? undefined,
    type: 'Membership' as CartItemType,
  }
}

/**
 * Map PurchaseResponse to CartGiftCard using display properties from PurchaseResponse
 * Priority: purchase.name > fallback to type name
 */
const mapPurchaseToCartGiftCard = (
  purchase: PurchaseResponse
): CartGiftCard | null => {
  if (purchase.type !== PurchaseType.GiftCard) {
    return null
  }

  const price = purchase.totalPrice ?? purchase.price ?? 0

  // Priority: Use display properties from PurchaseResponse, fallback to type name
  const title = purchase.name ?? purchase.nameEn ?? purchase.nameAr ?? 'Gift Card'
  const image = purchase.imageUrl ?? '/placeholder-giftcard.png'

  return {
    id: purchase.id.toString(),
    title,
    image,
    price,
    quantity: purchase.quantity,
    purchaseId: purchase.id,
    giftCardId: purchase.giftCardId,
    purchasePrice: purchase.totalPrice ?? purchase.price ?? null,
    purchaseDate: purchase.creationDate ?? purchase.buyDate ?? undefined,
    type: 'GiftCard' as CartItemType,
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
  const queryClient = useQueryClient()

  // Modal states
  const [deleteItemModalOpen, setDeleteItemModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [cancelRequestModalOpen, setCancelRequestModalOpen] = useState(false)
  const [requestToCancel, setRequestToCancel] = useState<string | null>(null)
  const [clearAllModalOpen, setClearAllModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Provider filter state
  const [selectedProviderIds, setSelectedProviderIds] = useState<number[]>([])

  // Fetch cart providers
  const { data: cartProviders = [], refetch: refetchProviders } = useCartProviders()

  // Fetch cart data - use getCart endpoint or getCartByProvider if filtering
  const { data: cartData, isLoading, error, refetch: refetchCart } = useCart()

  // Fetch carts by selected providers
  const providerCartQueries = useQueries({
    queries: selectedProviderIds.map((providerId) => ({
      queryKey: ['cart', 'provider', providerId],
      queryFn: async () => {
        const cart = await getCartByProvider(providerId)
        return { providerId, cart }
      },
      enabled: selectedProviderIds.length > 0 && providerId > 0,
      staleTime: 1 * 60 * 1000, // 1 minute
    })),
  })

  // Mutations
  const updatePurchaseMutation = useUpdatePurchase()
  const removePurchaseMutation = useRemovePurchase()
  const clearCartMutation = useClearCart()

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

  // Combine purchases from all selected provider carts or use main cart
  const allPurchases = useMemo(() => {
    // If filtering by providers, combine purchases from selected provider carts
    if (selectedProviderIds.length > 0) {
      const purchases: PurchaseResponse[] = []
      providerCartQueries.forEach((query) => {
        if (query.data?.cart?.purchases) {
          purchases.push(...query.data.cart.purchases)
        }
      })
      return purchases
    }
    // Otherwise use main cart
    return cartData?.purchases ?? []
  }, [selectedProviderIds, providerCartQueries, cartData])

  // Create a map of productId -> ProductResponse for quick lookup
  // Used when ProductHeaderResponse is not available in purchase
  const productMap = useMemo(() => {
    const map = new Map<number, ProductResponse>()
    productQueries.forEach((query) => {
      if (query.data?.product) {
        const product = query.data.product as ProductResponse
        map.set(query.data.productId, product)
      }
    })
    return map
  }, [productQueries])

  // Map API data to component formats - extract products using ProductHeaderResponse
  const cartProducts = useMemo(() => {
    if (!allPurchases.length) return []
    return allPurchases
      .map((purchase) => {
        // Only process Product type purchases
        if (purchase.type !== PurchaseType.Product) {
          return null
        }

        // If ProductHeaderResponse is null but productId exists, try to get ProductResponse from fetched products
        if (purchase.productId && !purchase.product) {
          const fetchedProduct = productMap.get(purchase.productId)
          if (fetchedProduct) {
            return mapPurchaseToCartProduct(purchase, fetchedProduct)
          }
        }
        // Use ProductHeaderResponse from purchase.product, or fallback to purchase data
        return mapPurchaseToCartProduct(purchase)
      })
      .filter((product): product is CartProduct => product !== null)
  }, [allPurchases, productMap])

  // Filter service purchases using ServiceHeaderResponse
  const servicePurchases = useMemo(() => {
    if (!allPurchases.length) return []
    return allPurchases.filter(
      (p) => p.type === PurchaseType.Service && p.service
    )
  }, [allPurchases])

  // Filter reservation purchases using ReservationResponse
  const reservationPurchases = useMemo(() => {
    if (!allPurchases.length) return []
    return allPurchases
      .map((purchase) => mapPurchaseToCartReservation(purchase))
      .filter((reservation): reservation is CartReservation => reservation !== null)
  }, [allPurchases])

  // Filter membership purchases
  const membershipPurchases = useMemo(() => {
    if (!allPurchases.length) return []
    return allPurchases
      .map((purchase) => mapPurchaseToCartMembership(purchase))
      .filter((membership): membership is CartMembership => membership !== null)
  }, [allPurchases])

  // Filter gift card purchases
  const giftCardPurchases = useMemo(() => {
    if (!allPurchases.length) return []
    return allPurchases
      .map((purchase) => mapPurchaseToCartGiftCard(purchase))
      .filter((giftCard): giftCard is CartGiftCard => giftCard !== null)
  }, [allPurchases])

  const hasServices = servicePurchases.length > 0
  const hasProducts = cartProducts.length > 0
  const hasReservations = reservationPurchases.length > 0
  const hasMemberships = membershipPurchases.length > 0
  const hasGiftCards = giftCardPurchases.length > 0
  const hasItems = hasProducts || hasServices || hasReservations || hasMemberships || hasGiftCards

  // Get the active cart data (from main cart or combined provider carts)
  const activeCartData = useMemo(() => {
    if (selectedProviderIds.length > 0) {
      // When filtering by providers, we need to combine price calculations
      // For now, calculate from items
      return null
    }
    return cartData
  }, [selectedProviderIds, cartData])

  // Calculate totals from priceCalculation (most accurate), then cartSummary, otherwise calculate from all items
  const { subtotal, taxesAndFees, deliveryFee, total } = useMemo(() => {
    // Priority 1: Use priceCalculation if available (most detailed and accurate)
    if (activeCartData?.priceCalculation) {
      const calc = activeCartData.priceCalculation
      return {
        subtotal: calc.subtotal,
        taxesAndFees: calc.tax,
        deliveryFee: calc.shippingCost,
        total: calc.total,
      }
    }

    // Priority 2: Use cartSummary if available
    if (activeCartData?.cartSummary) {
      const summary = activeCartData.cartSummary
      return {
        subtotal: summary.subtotal,
        taxesAndFees: summary.tax,
        deliveryFee: summary.shipping,
        total: summary.total,
      }
    }

    // Fallback: calculate from all purchase types
    const productsTotal = cartProducts.reduce(
      (sum, product) => sum + product.discountedPrice * product.quantity,
      0
    )
    const reservationsTotal = reservationPurchases.reduce(
      (sum, reservation) => sum + reservation.price * reservation.quantity,
      0
    )
    const membershipsTotal = membershipPurchases.reduce(
      (sum, membership) => sum + membership.price * membership.quantity,
      0
    )
    const giftCardsTotal = giftCardPurchases.reduce(
      (sum, giftCard) => sum + giftCard.price * giftCard.quantity,
      0
    )
    const sub = productsTotal + reservationsTotal + membershipsTotal + giftCardsTotal
    const taxes = 0 // Will be calculated by API
    const delivery = 0 // Will be calculated by API
    const tot = sub + taxes + delivery

    return {
      subtotal: sub,
      taxesAndFees: taxes,
      deliveryFee: delivery,
      total: tot,
    }
  }, [cartProducts, reservationPurchases, membershipPurchases, giftCardPurchases, activeCartData])

  const handleQuantityChange = async (id: string, delta: number) => {
    // Find the item in any of the cart item types
    let purchaseId: number | null = null
    let currentQuantity = 1

    // Check products
    const product = cartProducts.find(p => p.id === id)
    if (product) {
      purchaseId = product.purchaseId
      currentQuantity = product.quantity
    }

    // Check reservations
    if (!purchaseId) {
      const reservation = reservationPurchases.find(r => r.id === id)
      if (reservation) {
        purchaseId = reservation.purchaseId
        currentQuantity = reservation.quantity
      }
    }

    // Check memberships
    if (!purchaseId) {
      const membership = membershipPurchases.find(m => m.id === id)
      if (membership) {
        purchaseId = membership.purchaseId
        currentQuantity = membership.quantity
      }
    }

    // Check gift cards
    if (!purchaseId) {
      const giftCard = giftCardPurchases.find(g => g.id === id)
      if (giftCard) {
        purchaseId = giftCard.purchaseId
        currentQuantity = giftCard.quantity
      }
    }

    if (!purchaseId) return

    const newQuantity = Math.max(1, currentQuantity + delta)
    if (newQuantity === currentQuantity) return

    try {
      await updatePurchaseMutation.mutateAsync({
        id: purchaseId.toString(),
        data: {
          id: purchaseId,
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

    // Find the purchase ID from any of the cart item types
    let purchaseId: number | null = null

    // Check products
    const product = cartProducts.find(p => p.id === itemToDelete)
    if (product) {
      purchaseId = product.purchaseId
    }

    // Check reservations
    if (!purchaseId) {
      const reservation = reservationPurchases.find(r => r.id === itemToDelete)
      if (reservation) {
        purchaseId = reservation.purchaseId
      }
    }

    // Check memberships
    if (!purchaseId) {
      const membership = membershipPurchases.find(m => m.id === itemToDelete)
      if (membership) {
        purchaseId = membership.purchaseId
      }
    }

    // Check gift cards
    if (!purchaseId) {
      const giftCard = giftCardPurchases.find(g => g.id === itemToDelete)
      if (giftCard) {
        purchaseId = giftCard.purchaseId
      }
    }

    if (!purchaseId) return

    try {
      await removePurchaseMutation.mutateAsync({
        id: purchaseId.toString(),
        data: {
          id: purchaseId,
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
      const purchaseId = parseInt(requestToCancel, 10)
      if (isNaN(purchaseId)) return

      await removePurchaseMutation.mutateAsync({
        id: requestToCancel,
        data: {
          id: purchaseId,
        },
      })
      setRequestToCancel(null)
      setCancelRequestModalOpen(false)
    } catch (error) {
      console.error('Failed to cancel request:', error)
      // You might want to show a toast notification here
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Refetch cart data
      await refetchCart()

      // Refetch providers
      await refetchProviders()

      // If filtering by providers, refetch provider carts
      if (selectedProviderIds.length > 0) {
        await Promise.all(
          selectedProviderIds.map((providerId) =>
            queryClient.invalidateQueries({ queryKey: ['cart', 'provider', providerId] })
          )
        )
      }
    } catch (error) {
      console.error('Failed to refresh cart:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleClearAllClick = () => {
    setClearAllModalOpen(true)
  }

  const handleConfirmClearAll = async () => {
    try {
      // Use the direct clearCart API endpoint
      await clearCartMutation.mutateAsync()
      setClearAllModalOpen(false)
    } catch (error) {
      console.error('Failed to clear all items:', error)
      // You might want to show a toast notification here
    }
  }

  // Check if any provider cart queries are loading
  const isLoadingProviderCarts = providerCartQueries.some((query) => query.isLoading)
  const isLoadingData = isLoading || isLoadingProviderCarts

  // Show loading state
  if (isLoadingData) {
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
      {/* Page Header with Filter */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <PageHeader title="My Cart" />
        <div className="flex items-center gap-2 flex-shrink-0">
          {cartProviders.length > 0 && (
            <ProviderMultiSelect
              providers={cartProviders}
              selectedProviderIds={selectedProviderIds}
              onChange={setSelectedProviderIds}
              placeholder="Filter providers"
              className="w-40"
            />
          )}
          {hasItems && (
            <button
              type="button"
              onClick={handleClearAllClick}
              disabled={clearCartMutation.isPending}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Clear all items"
            >
              <Trash2 className="h-4 w-4 text-gray-600" />
            </button>
          )}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh cart"
          >
            <RefreshCw
              className={cn(
                'h-4 w-4 text-gray-600',
                isRefreshing && 'animate-spin'
              )}
            />
          </button>
        </div>
      </div>

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
                        purchasePrice={product.purchasePrice ?? undefined}
                        purchaseDate={product.purchaseDate}
                        type={product.type}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Services Section - using ServiceHeaderResponse */}
            {hasServices && (
              <div className="space-y-4 sm:space-y-6">
                {servicePurchases.map((purchase) => {
                  if (!purchase.service) return null

                  // Priority: Use display properties from PurchaseResponse, then ServiceHeaderResponse
                  const displayName = purchase.name ?? purchase.nameEn ?? purchase.nameAr
                  const displayImage = purchase.imageUrl

                  // Use ServiceHeaderResponse from purchase.service
                  const service = purchase.service
                  const price = purchase.totalPrice ?? purchase.price ?? 0
                  const status = mapPurchaseStatusToRequestStatus(purchase.status)

                  // Use service name/image if purchase display properties are not available
                  const serviceName = displayName ?? service.nameEn ?? service.nameAr ?? 'Service'
                  const serviceImage = displayImage ?? service.imageUrl ?? '/placeholder-service.png'

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
                        title: serviceName,
                        image: serviceImage,
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
                      assignedTo={purchase.providerName || undefined}
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

            {/* Reservations Section - using ReservationResponse */}
            {hasReservations && (
              <div className="space-y-3 sm:space-y-4">
                {reservationPurchases.map((reservation) => (
                  <CartItem
                    key={reservation.id}
                    id={reservation.id}
                    title={reservation.title}
                    image={reservation.image}
                    originalPrice={reservation.price}
                    discountedPrice={reservation.price}
                    quantity={reservation.quantity}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItemClick}
                    deliveryDate={reservation.reservationDate}
                    purchasePrice={reservation.purchasePrice ?? undefined}
                    purchaseDate={reservation.purchaseDate}
                    type={reservation.type}
                  />
                ))}
              </div>
            )}

            {/* Memberships Section */}
            {hasMemberships && (
              <div className="space-y-3 sm:space-y-4">
                {membershipPurchases.map((membership) => (
                  <CartItem
                    key={membership.id}
                    id={membership.id}
                    title={membership.title}
                    image={membership.image}
                    originalPrice={membership.price}
                    discountedPrice={membership.price}
                    quantity={membership.quantity}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItemClick}
                    purchasePrice={membership.purchasePrice ?? undefined}
                    purchaseDate={membership.purchaseDate}
                    type={membership.type}
                  />
                ))}
              </div>
            )}

            {/* Gift Cards Section */}
            {hasGiftCards && (
              <div className="space-y-3 sm:space-y-4">
                {giftCardPurchases.map((giftCard) => (
                  <CartItem
                    key={giftCard.id}
                    id={giftCard.id}
                    title={giftCard.title}
                    image={giftCard.image}
                    originalPrice={giftCard.price}
                    discountedPrice={giftCard.price}
                    quantity={giftCard.quantity}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItemClick}
                    purchasePrice={giftCard.purchasePrice ?? undefined}
                    purchaseDate={giftCard.purchaseDate}
                    type={giftCard.type}
                  />
                ))}
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
                  priceCalculation={activeCartData?.priceCalculation ?? null}
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
            ? cartProducts.find(p => p.id === itemToDelete)?.title ??
            reservationPurchases.find(r => r.id === itemToDelete)?.title ??
            membershipPurchases.find(m => m.id === itemToDelete)?.title ??
            giftCardPurchases.find(g => g.id === itemToDelete)?.title
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

      {/* Clear All Modal */}
      <DeleteCartItemModal
        isOpen={clearAllModalOpen}
        onClose={() => {
          setClearAllModalOpen(false)
        }}
        onConfirm={handleConfirmClearAll}
        productTitle="all items from your cart"
      />

      {/* Loading Overlay for Mutations */}
      <LoadingOverlay
        open={updatePurchaseMutation.isPending || removePurchaseMutation.isPending || clearCartMutation.isPending}
        title={clearCartMutation.isPending ? "Clearing cart..." : "Updating cart..."}
        subtitle="Please wait a moment"
      />
    </UserPageLayout>
  )
}

