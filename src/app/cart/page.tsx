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
  DeleteCartItemModal,
  CancelRequestModal,
  PageHeader,
  ErrorDisplay,
  LoadingOverlay,
  ServicesProductsFilter,
  Button,
} from '@/components/ui'
import orderEmptySvg from '@/assets/svg/order-empty.svg'
import { useCart, useCartProviders, useUpdatePurchase, useRemovePurchase, useClearCart, useCheckout } from '@/hooks'
import { getCartByProvider } from '@/services/api/purchaseApi'
import { getProductById } from '@/services/api/products.api'
import { getUser } from '@/auth/utils/token'
import type { CheckoutRequest, CustomerRequest } from '@/../client/common/api/gen/ourbride-api'
import type { PurchaseResponse } from '@/types/responses'
import type { ProductResponse } from '@/types/responses'
import type { ReservationResponse } from '@/types/responses'
import type { PurchaseStatus } from '@/../client/common/api/gen/ourbride-api'
import type {
  CartProduct,
  CartReservation,
  CartMembership,
  CartGiftCard,
} from '@/types/responses'
import { PurchaseType } from '@/../client/common/api/gen/ourbride-api'
import type { CartItemType } from '@/components/ui/CartItem'

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
    status: purchase.status as PurchaseStatus,
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

  // Filter by services/products
  const [itemTypeFilter, setItemTypeFilter] = useState<'services' | 'products'>('products')

  // Fetch cart providers (includes cartId for each provider/general cart)
  const { data: cartProviders = [], refetch: refetchProviders, isLoading: isLoadingProviders } = useCartProviders()

  // Get provider carts (excluding general cart)
  const providerCarts = useMemo(() => {
    return cartProviders.filter(cp => cp.providerId !== null && cp.providerId !== undefined)
  }, [cartProviders])

  // Always fetch general cart data
  const { data: cartData, isLoading: isLoadingGeneralCart, error, refetch: refetchCart } = useCart(true)

  // Fetch all provider carts by providerId
  const cartQueries = useQueries({
    queries: providerCarts.map((provider) => {
      const cartId = provider.cartId
      const providerId = provider.providerId!
      return {
        queryKey: ['cart', 'provider', providerId, cartId],
        queryFn: async () => {
          const cart = await getCartByProvider(providerId)
          return { cartId, providerId, cart }
        },
        enabled: !!(cartId !== null && cartId !== undefined && providerId !== null && providerId !== undefined && !isLoadingProviders),
        staleTime: 1 * 60 * 1000, // 1 minute
      }
    }),
  })


  // Mutations
  const updatePurchaseMutation = useUpdatePurchase()
  const removePurchaseMutation = useRemovePurchase()
  const clearCartMutation = useClearCart()
  const checkoutMutation = useCheckout()

  // Get product IDs that need to be fetched (where product is null but productId exists)
  // Check all carts (general + provider carts)
  const productIdsToFetch = useMemo(() => {
    const productIds = new Set<number>()

    // Check general cart
    if (cartData?.purchases) {
      cartData.purchases
        .filter(
          (p) =>
            p.type === PurchaseType.Product &&
            p.productId &&
            !p.product
        )
        .forEach((p) => productIds.add(p.productId!))
    }

    // Check provider carts (fetched by providerId)
    cartQueries.forEach((query) => {
      if (query.data?.cart?.purchases) {
        query.data.cart.purchases
          .filter(
            (p) =>
              p.type === PurchaseType.Product &&
              p.productId &&
              !p.product
          )
          .forEach((p) => productIds.add(p.productId!))
      }
    })

    return Array.from(productIds)
  }, [cartData, cartQueries])

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

  // Combine all purchases from all carts (general + provider carts)
  // Remove duplicates based on purchase.id
  const allPurchases = useMemo(() => {
    const purchaseMap = new Map<number, PurchaseResponse>()
    const seenCartIds = new Set<number>()

    // Add general cart purchases
    if (cartData?.purchases && cartData.id) {
      seenCartIds.add(cartData.id)
      cartData.purchases.forEach((purchase) => {
        purchaseMap.set(purchase.id, purchase)
      })
    }

    // Add all provider carts (fetched by providerId)
    cartQueries.forEach((query) => {
      if (query.data?.cart) {
        const cart = query.data.cart
        const cartId = cart.id

        // Skip if this cart was already processed
        if (seenCartIds.has(cartId)) {
          return
        }

        seenCartIds.add(cartId)
        if (cart.purchases) {
          cart.purchases.forEach((purchase) => {
            purchaseMap.set(purchase.id, purchase)
          })
        }
      }
    })

    const purchases = Array.from(purchaseMap.values())
    return purchases
  }, [cartQueries, cartData])

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
  // Include purchases that have serviceId even if service object is not populated
  const servicePurchases = useMemo(() => {
    if (!allPurchases.length) return []
    return allPurchases.filter(
      (p) => p.type === PurchaseType.Service && (p.serviceId !== null && p.serviceId !== undefined)
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

  // Calculate total number of items in cart
  const totalItems = useMemo(() => {
    return (
      cartProducts.reduce((sum, product) => sum + product.quantity, 0) +
      servicePurchases.reduce((sum, service) => sum + (service.quantity || 1), 0) +
      reservationPurchases.reduce((sum, reservation) => sum + reservation.quantity, 0) +
      membershipPurchases.reduce((sum, membership) => sum + membership.quantity, 0) +
      giftCardPurchases.reduce((sum, giftCard) => sum + giftCard.quantity, 0)
    )
  }, [cartProducts, servicePurchases, reservationPurchases, membershipPurchases, giftCardPurchases])


  // Get the active cart data (use general cart data)
  const activeCartData = useMemo(() => {
    return cartData
  }, [cartData])


  // Calculate filtered items based on current filter
  const hasFilteredItems = useMemo(() => {
    if (itemTypeFilter === 'products') {
      return hasProducts || hasMemberships || hasGiftCards
    } else {
      return hasServices || hasReservations
    }
  }, [itemTypeFilter, hasProducts, hasServices, hasReservations, hasMemberships, hasGiftCards])

  // Calculate filtered totals based on current filter
  const filteredTotals = useMemo(() => {
    if (itemTypeFilter === 'products') {
      const productsTotal = cartProducts.reduce(
        (sum, product) => sum + product.discountedPrice * product.quantity,
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
      const sub = productsTotal + membershipsTotal + giftCardsTotal
      return {
        subtotal: sub,
        taxesAndFees: activeCartData?.priceCalculation?.tax ?? activeCartData?.cartSummary?.tax ?? 0,
        deliveryFee: activeCartData?.priceCalculation?.shippingCost ?? activeCartData?.cartSummary?.shipping ?? 0,
        total: sub + (activeCartData?.priceCalculation?.tax ?? activeCartData?.cartSummary?.tax ?? 0) + (activeCartData?.priceCalculation?.shippingCost ?? activeCartData?.cartSummary?.shipping ?? 0),
      }
    } else {
      const servicesTotal = servicePurchases.reduce(
        (sum, service) => sum + (service.totalPrice ?? service.price ?? 0) * (service.quantity || 1),
        0
      )
      const reservationsTotal = reservationPurchases.reduce(
        (sum, reservation) => sum + reservation.price * reservation.quantity,
        0
      )
      const sub = servicesTotal + reservationsTotal
      return {
        subtotal: sub,
        taxesAndFees: activeCartData?.priceCalculation?.tax ?? activeCartData?.cartSummary?.tax ?? 0,
        deliveryFee: activeCartData?.priceCalculation?.shippingCost ?? activeCartData?.cartSummary?.shipping ?? 0,
        total: sub + (activeCartData?.priceCalculation?.tax ?? activeCartData?.cartSummary?.tax ?? 0) + (activeCartData?.priceCalculation?.shippingCost ?? activeCartData?.cartSummary?.shipping ?? 0),
      }
    }
  }, [itemTypeFilter, cartProducts, servicePurchases, reservationPurchases, membershipPurchases, giftCardPurchases, activeCartData])

  const handleQuantityChange = async (id: string, delta: number) => {
    // Find the item in any of the cart item types
    let purchaseId: number | null = null
    let currentQuantity = 1
    let purchaseType: PurchaseType | null = null

    // Check products
    const product = cartProducts.find(p => p.id === id)
    if (product) {
      purchaseId = product.purchaseId
      currentQuantity = product.quantity
      purchaseType = PurchaseType.Product
    }

    // Check services
    if (!purchaseId) {
      const servicePurchase = servicePurchases.find(s => s.id.toString() === id)
      if (servicePurchase) {
        purchaseId = servicePurchase.id
        currentQuantity = servicePurchase.quantity || 1
        purchaseType = PurchaseType.Service
      }
    }

    // Check reservations
    if (!purchaseId) {
      const reservation = reservationPurchases.find(r => r.id === id)
      if (reservation) {
        purchaseId = reservation.purchaseId
        currentQuantity = reservation.quantity
        purchaseType = PurchaseType.Reservation
      }
    }

    // Check memberships
    if (!purchaseId) {
      const membership = membershipPurchases.find(m => m.id === id)
      if (membership) {
        purchaseId = membership.purchaseId
        currentQuantity = membership.quantity
        purchaseType = PurchaseType.Membership
      }
    }

    // Check gift cards
    if (!purchaseId) {
      const giftCard = giftCardPurchases.find(g => g.id === id)
      if (giftCard) {
        purchaseId = giftCard.purchaseId
        currentQuantity = giftCard.quantity
        purchaseType = PurchaseType.GiftCard
      }
    }

    if (!purchaseId) return

    // Find the purchase object to get providerId
    const purchase = allPurchases.find(p => p.id === purchaseId)
    const providerId = purchase?.providerId ?? null

    const newQuantity = Math.max(1, currentQuantity + delta)
    if (newQuantity === currentQuantity) return

    try {
      // Build update data - only include fields to update, not the id
      const updateData: {
        quantity: number
        providerId?: number
      } = {
        quantity: newQuantity,
      }

      // Add providerId for products and services
      if ((purchaseType === PurchaseType.Product || purchaseType === PurchaseType.Service) && providerId !== null) {
        updateData.providerId = providerId
      }

      await updatePurchaseMutation.mutateAsync({
        id: purchaseId.toString(),
        data: updateData,
      })

      // Invalidate all cart-related queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['carts-with-providers'] })
      queryClient.invalidateQueries({ queryKey: ['cart', 'provider'] })
      queryClient.invalidateQueries({ queryKey: ['cart', 'cartId'] })
    } catch {
      // Error handling - silently fail
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
    } catch {
      // Error handling - silently fail
    }
  }

  const handleBuyNow = (id: string) => {
    if (cartProducts.find(p => p.id === id)) {
      router.push('/checkout')
    }
  }

  const handleCheckout = async () => {
    try {
      // Use general cart for checkout
      const cartIdToCheckout: number | null = cartData?.id ?? null

      if (!cartIdToCheckout) {
        return
      }

      // Get user info from token to populate customer data
      const user = getUser()

      // Prepare customer data from user token or use defaults
      // Note: Some fields like address and city will be updated on the checkout page
      const customer: CustomerRequest = {
        email: (user?.email as string) || 'user@temp.ourbride.com',
        firstName: (user?.firstName as string) || 'User',
        lastName: (user?.lastName as string) || 'Name',
        address: 'Temporary Address', // Will be updated on checkout page
        address2: null,
        region: null,
        city: 'Cairo', // Will be updated on checkout page
        country: 'Egypt',
        phone: (user?.phoneNumber as string) || '0000000000',
        postCode: null,
      }

      // Call checkout API before navigating
      // Note: This is a preparation call - the checkout page will handle full checkout with complete customer and payment details
      const checkoutRequest: CheckoutRequest = {
        cartId: cartIdToCheckout,
        customer: customer,
        paymentMethod: null, // Will be set on checkout page
        orderNotes: null,
        couponCode: null,
        preferredDeliveryDate: null,
      }

      await checkoutMutation.mutateAsync(checkoutRequest)

      // Navigate to checkout page after successful API call
      router.push('/checkout')
    } catch {
      // Show error but still navigate to checkout page
      // The checkout page can handle the error or retry
      router.push('/checkout')
    }
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
    } catch {
      // Error handling - silently fail
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Refetch cart data
      await refetchCart()

      // Refetch providers
      await refetchProviders()
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
    } catch {
      // Error handling - silently fail
    }
  }

  // Check if any cart queries are loading
  const isLoadingCarts = cartQueries.some((query) => query.isLoading)

  const isLoadingData = isLoadingGeneralCart || isLoadingCarts

  // Header right content with filters
  const headerRightContent = (
    <div className="flex items-center gap-2">
      {hasItems && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleClearAllClick}
          disabled={clearCartMutation.isPending}
          className="hover:bg-red-50 hover:border-red-400"
          aria-label="Clear all items"
        >
          <Trash2 className="h-4 w-4 text-gray-600" />
        </Button>
      )}
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="hover:border-brand-400"
        aria-label="Refresh cart"
      >
        <RefreshCw
          className={cn(
            'h-4 w-4 text-gray-600',
            isRefreshing && 'animate-spin'
          )}
        />
      </Button>
      <ServicesProductsFilter value={itemTypeFilter} onChange={setItemTypeFilter} />
    </div>
  )

  // Show loading state
  if (isLoadingData) {
    return (
      <UserPageLayout>
        <PageHeader
          title="My Cart"
          subtitle={hasItems ? `${totalItems} ${totalItems === 1 ? 'Item' : 'Items'}` : undefined}
          rightContent={headerRightContent}
        />
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
        <PageHeader
          title="My Cart"
          subtitle={hasItems ? `${totalItems} ${totalItems === 1 ? 'Item' : 'Items'}` : undefined}
          rightContent={headerRightContent}
        />
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
      <PageHeader
        title="My Cart"
        subtitle={hasItems ? `${totalItems} ${totalItems === 1 ? 'Item' : 'Items'}` : undefined}
        rightContent={headerRightContent}
      />

      {/* Content Area */}
      {hasItems ? (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 pb-24 md:pb-0">
          {/* Cart Items */}
          <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
            {/* Products Section */}
            {hasProducts && cartProducts.length > 0 && itemTypeFilter === 'products' && (
              <div className="space-y-3 sm:space-y-4">
                {cartProducts.map(product => (
                  <CartItem
                    key={product.purchaseId ?? `product-${product.id}`}
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

            {/* Services Section - using CartItem for compact display */}
            {hasServices && itemTypeFilter === 'services' && (
              <div className="space-y-3 sm:space-y-4">
                {servicePurchases.map((purchase) => {
                  // Priority: Use display properties from PurchaseResponse, then ServiceHeaderResponse
                  const displayName = purchase.name ?? purchase.nameEn ?? purchase.nameAr
                  const displayImage = purchase.imageUrl

                  // Use ServiceHeaderResponse from purchase.service if available
                  const service = purchase.service
                  const price = purchase.totalPrice ?? purchase.price ?? 0

                  // Use service name/image - prefer purchase display properties, then service object, then fallback
                  // If all are empty, use a default name based on serviceId
                  const serviceName = displayName || service?.nameEn || service?.nameAr || `Service #${purchase.serviceId || purchase.id}`
                  const serviceImage = displayImage || service?.imageUrl || '/placeholder-service.png'

                  // Format delivery date from endDate
                  const deliveryDate = purchase.endDate
                    ? new Date(purchase.endDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                    : undefined

                  return (
                    <CartItem
                      key={purchase.id}
                      id={purchase.id.toString()}
                      title={serviceName}
                      image={serviceImage}
                      originalPrice={price}
                      discountedPrice={price}
                      quantity={purchase.quantity || 1}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItemClick}
                      deliveryDate={deliveryDate}
                      purchasePrice={purchase.totalPrice ?? purchase.price ?? undefined}
                      purchaseDate={purchase.creationDate || purchase.buyDate || undefined}
                      type="Service"
                    />
                  )
                })}
              </div>
            )}

            {/* Reservations Section - using ReservationResponse */}
            {hasReservations && itemTypeFilter === 'services' && (
              <div className="space-y-3 sm:space-y-4">
                {reservationPurchases.map((reservation) => (
                  <CartItem
                    key={reservation.purchaseId ?? `reservation-${reservation.id}`}
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
            {hasMemberships && itemTypeFilter === 'products' && (
              <div className="space-y-3 sm:space-y-4">
                {membershipPurchases.map((membership) => (
                  <CartItem
                    key={membership.purchaseId ?? `membership-${membership.id}`}
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
            {hasGiftCards && itemTypeFilter === 'products' && (
              <div className="space-y-3 sm:space-y-4">
                {giftCardPurchases.map((giftCard) => (
                  <CartItem
                    key={giftCard.purchaseId ?? `giftcard-${giftCard.id}`}
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

          {/* Order Summary Sidebar - Desktop only - Shows filtered totals */}
          {hasFilteredItems && (
            <div className="w-full lg:w-80 lg:flex-shrink-0">
              <div className="lg:sticky lg:top-6">
                <CartOrderSummary
                  subtotal={filteredTotals.subtotal}
                  taxesAndFees={filteredTotals.taxesAndFees}
                  deliveryFee={filteredTotals.deliveryFee}
                  total={filteredTotals.total}
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
          title="You don't have any items in your cart"
          description={`Start exploring ${itemTypeFilter === 'products' ? 'products' : 'services'} to begin your journey`}
          actionLabel={itemTypeFilter === 'products' ? 'View Products' : 'View Services'}
          actionHref={itemTypeFilter === 'products' ? '/products' : '/services'}
        />
      )}

      {/* Mobile Fixed Bottom Bar */}
      {/* {hasFilteredItems && (
        <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-6 z-50 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-16 font-semibold text-gray-900">Total Price</span>
            <span className="text-16 font-semibold text-gray-900">
              {filteredTotals.total.toLocaleString()} EGP
            </span>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={checkoutMutation.isPending}
            className="w-full px-4 py-3 text-16 font-semibold text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Checkout All
          </button>
        </div>
      )}  */}

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
        open={updatePurchaseMutation.isPending || removePurchaseMutation.isPending || clearCartMutation.isPending || checkoutMutation.isPending}
        title={
          clearCartMutation.isPending
            ? "Clearing cart..."
            : checkoutMutation.isPending
              ? "Processing checkout..."
              : "Updating cart..."
        }
        subtitle="Please wait a moment"
      />
    </UserPageLayout>
  )
}

