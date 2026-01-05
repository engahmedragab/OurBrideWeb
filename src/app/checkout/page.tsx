'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Phone,
  MapPin,
  Building2,
  FileText,
  CreditCard,
  Wallet,
  DollarSign,
  AlertCircle,
  Percent,
  CheckCircle2,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PaymentConfirmationModal } from '@/components/ui/PaymentConfirmationModal'
import { OrderConfirmationModal } from '@/components/ui/OrderConfirmationModal'
import { ErrorDisplay } from '@/components/ui/ErrorDisplay'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { CheckoutCartItem, Checkbox, AddressModal } from '@/components/ui'
import { useToast } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import {
  useCart,
  useUpdatePurchase,
  useRemovePurchase,
  useCheckout,
  useValidateCoupon,
  usePaymentMethods,
  useAddresses,
} from '@/hooks'
import { getUser } from '@/auth/utils/token'
import { getProductById } from '@/services/api/products.api'
import { useQueries } from '@tanstack/react-query'
import type {
  PurchaseResponse,
  ProductResponse,
  ReservationResponse,
  DeliveryAddressResponse,
} from '@/types/responses'
import type {
  CartProduct,
  CartReservation,
  CartMembership,
  CartGiftCard,
} from '@/types/responses'
import { PurchaseType } from '@/../client/common/api/gen/ourbride-api'
import type { PurchaseStatus } from '@/../client/common/api/gen/ourbride-api'
import type {
  CheckoutRequest,
  CustomerRequest,
} from '@/../client/common/api/gen/ourbride-api'
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
    originalPrice =
      productHeader.regularPrice ?? productHeader.price ?? pricePerUnit
    discountedPrice =
      productHeader.salePrice ?? productHeader.price ?? originalPrice
    const hasDiscount =
      productHeader.hasDiscount &&
      productHeader.salePrice &&
      productHeader.regularPrice
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
      originalPrice =
        fetchedProduct.regularPrice ?? fetchedProduct.price ?? pricePerUnit
      discountedPrice =
        fetchedProduct.salePrice ?? fetchedProduct.price ?? originalPrice
      const hasDiscount =
        fetchedProduct.hasDiscount &&
        fetchedProduct.salePrice &&
        fetchedProduct.regularPrice
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
  const title =
    purchase.name ?? purchase.nameEn ?? purchase.nameAr ?? 'Membership'
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
  const title =
    purchase.name ?? purchase.nameEn ?? purchase.nameAr ?? 'Gift Card'
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

export interface OrderFormData {
  fullName: string
  mobileNumber: string
  location: string
  street: string
  notes: string
  paymentMethod: 'debit-credit' | 'mobile-wallet' | 'cash-on-delivery'
  walletMobileNumber?: string
  cardNumber?: string
  cardExpiry?: string
  cardCVV?: string
  cardholderName?: string
  selectedItems: string[]
  promoCode?: string
  useDiamonds?: boolean
  useGiftsCash?: boolean
  acceptTerms: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { addToast } = useToast()

  // Fetch cart data
  const {
    data: cartData,
    isLoading: isLoadingCart,
    error: cartError,
  } = useCart()

  // Fetch active payment methods
  const { data: paymentMethods = [], isLoading: isLoadingPaymentMethods } =
    usePaymentMethods()

  // Fetch user addresses
  const { data: addresses = [], isLoading: isLoadingAddresses } = useAddresses()

  // Helper function to map payment method code to form value
  const getPaymentMethodValue = (
    code: string
  ): 'debit-credit' | 'mobile-wallet' | 'cash-on-delivery' => {
    const codeLower = code.toLowerCase()
    if (codeLower.includes('wallet') || codeLower.includes('mobile')) {
      return 'mobile-wallet'
    }
    if (codeLower.includes('cash') || codeLower.includes('delivery')) {
      return 'cash-on-delivery'
    }
    return 'debit-credit' // Default to card
  }

  // Mutations
  const updatePurchaseMutation = useUpdatePurchase()
  const removePurchaseMutation = useRemovePurchase()
  const checkoutMutation = useCheckout()
  const validateCouponMutation = useValidateCoupon()

  // Get all purchases from cart
  const allPurchases = useMemo(() => {
    return cartData?.purchases || []
  }, [cartData])

  // Get product IDs that need to be fetched (where product is null but productId exists)
  const productIdsToFetch = useMemo(() => {
    if (!allPurchases.length) return []
    return allPurchases
      .filter(p => p.type === PurchaseType.Product && p.productId && !p.product)
      .map(p => p.productId!)
  }, [allPurchases])

  // Fetch product details for purchases that have productId but product is null
  const productQueries = useQueries({
    queries: productIdsToFetch.map(productId => ({
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
  const productMap = useMemo(() => {
    const map = new Map<number, ProductResponse>()
    productQueries.forEach(query => {
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
      .map(purchase => {
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

  // Filter reservation purchases using ReservationResponse
  const reservationPurchases = useMemo(() => {
    if (!allPurchases.length) return []
    return allPurchases
      .map(purchase => mapPurchaseToCartReservation(purchase))
      .filter(
        (reservation): reservation is CartReservation => reservation !== null
      )
  }, [allPurchases])

  // Filter membership purchases
  const membershipPurchases = useMemo(() => {
    if (!allPurchases.length) return []
    return allPurchases
      .map(purchase => mapPurchaseToCartMembership(purchase))
      .filter((membership): membership is CartMembership => membership !== null)
  }, [allPurchases])

  // Filter gift card purchases
  const giftCardPurchases = useMemo(() => {
    if (!allPurchases.length) return []
    return allPurchases
      .map(purchase => mapPurchaseToCartGiftCard(purchase))
      .filter((giftCard): giftCard is CartGiftCard => giftCard !== null)
  }, [allPurchases])

  // Local state for selected purchases (can be modified by user)
  const [localItems, setLocalItems] = useState<CartProduct[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())

  // Track the last cart product IDs to avoid unnecessary updates
  const lastCartProductIdsRef = useRef<string>('')

  // Initialize local items when cart data loads
  useEffect(() => {
    // Create a stable ID string from cart products
    const currentIds = cartProducts
      .map(p => p.id)
      .sort()
      .join(',')

    // Only update if the IDs have actually changed
    if (currentIds !== lastCartProductIdsRef.current) {
      lastCartProductIdsRef.current = currentIds

      if (cartProducts.length > 0) {
        setLocalItems(cartProducts)
        setSelectedItems(new Set(cartProducts.map(p => parseInt(p.id, 10))))
      } else if (cartData?.purchases && cartData.purchases.length > 0) {
        // If we have purchases but they're not products
      } else {
        // Cart is empty
        setLocalItems([])
        setSelectedItems(new Set())
      }
    }
  }, [cartProducts, cartData])

  // Initialize form data with user data from token
  const initializeFormData = (): OrderFormData => {
    const user = getUser()
    // Type guard to check if user is UserResponse
    const isUserResponse = (
      u: typeof user
    ): u is import('@/types/responses').UserResponse => {
      return u !== null && 'firstName' in u && 'lastName' in u
    }
    // Type guard to check if user is AuthUser
    const isAuthUser = (
      u: typeof user
    ): u is import('@/auth/types').AuthUser => {
      return u !== null && 'fullName' in u && !('firstName' in u)
    }

    let fullName = ''
    if (user) {
      if (isUserResponse(user)) {
        fullName =
          (user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`.trim()
            : '') ||
          user.userName ||
          ''
      } else if (isAuthUser(user)) {
        fullName = user.fullName || ''
      } else if ('userName' in user) {
        fullName = (user as { userName?: string }).userName || ''
      }
    }

    const phoneNumber = user && 'phoneNumber' in user ? user.phoneNumber : ''

    return {
      fullName,
      mobileNumber: phoneNumber || '',
      location: '', // Location will be filled from address selection or form input
      street: '', // Street will be filled from address selection or form input
      notes: '',
      paymentMethod: 'debit-credit',
      walletMobileNumber: '',
      cardNumber: '',
      cardExpiry: '',
      cardCVV: '',
      cardholderName: '',
      selectedItems: [],
      acceptTerms: false,
    }
  }

  const [formData, setFormData] = useState<OrderFormData>(initializeFormData())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false)
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  )
  const [showAddressModal, setShowAddressModal] = useState(false)

  const currency = 'EGP'

  const updateFormData = (
    field: keyof OrderFormData,
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateField = (
    field: keyof OrderFormData,
    value: string | boolean | undefined
  ): string => {
    switch (field) {
      case 'fullName':
        if (!value || (typeof value === 'string' && value.trim().length < 2)) {
          return 'Full name must be at least 2 characters'
        }
        break
      case 'mobileNumber': {
        if (!value) {
          return 'Mobile number is required'
        }
        const phoneRegex = /^[0-9]{10,11}$/
        if (
          typeof value === 'string' &&
          !phoneRegex.test(value.replace(/\s/g, ''))
        ) {
          return 'Please enter a valid mobile number (10-11 digits)'
        }
        break
      }
      case 'location':
        if (!value || (typeof value === 'string' && value.trim().length < 3)) {
          return 'Location must be at least 3 characters'
        }
        break
      case 'street':
        if (!value || (typeof value === 'string' && value.trim().length < 3)) {
          return 'Street/Apartment must be at least 3 characters'
        }
        break
      case 'walletMobileNumber': {
        if (formData.paymentMethod === 'mobile-wallet') {
          if (!value) {
            return 'Wallet mobile number is required'
          }
          const phoneRegex = /^[0-9]{10,11}$/
          if (
            typeof value === 'string' &&
            !phoneRegex.test(value.replace(/\s/g, ''))
          ) {
            return "Wallet isn't valid, please enter valid number"
          }
        }
        break
      }
      case 'cardNumber': {
        if (formData.paymentMethod === 'debit-credit') {
          if (!value) {
            return 'Card number is required'
          }
          const cardRegex = /^[0-9]{13,19}$/
          if (
            typeof value === 'string' &&
            !cardRegex.test(value.replace(/\s/g, ''))
          ) {
            return 'Please enter a valid card number'
          }
        }
        break
      }
      case 'cardExpiry': {
        if (formData.paymentMethod === 'debit-credit') {
          if (!value) {
            return 'Expiry date is required'
          }
          const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
          if (typeof value === 'string' && !expiryRegex.test(value)) {
            return 'Please enter a valid expiry date (MM/YY)'
          }
        }
        break
      }
      case 'cardCVV': {
        if (formData.paymentMethod === 'debit-credit') {
          if (!value) {
            return 'CVV is required'
          }
          const cvvRegex = /^[0-9]{3,4}$/
          if (typeof value === 'string' && !cvvRegex.test(value)) {
            return 'Please enter a valid CVV'
          }
        }
        break
      }
      case 'cardholderName': {
        if (formData.paymentMethod === 'debit-credit') {
          if (
            !value ||
            (typeof value === 'string' && value.trim().length < 2)
          ) {
            return 'Cardholder name is required'
          }
        }
        break
      }
      case 'acceptTerms':
        if (!value) {
          return 'You must accept the terms and conditions'
        }
        break
    }
    return ''
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const stringFields: (keyof OrderFormData)[] = [
      'fullName',
      'mobileNumber',
      'location',
      'street',
    ]

    stringFields.forEach(field => {
      const value = formData[field]
      if (typeof value === 'string') {
        const error = validateField(field, value)
        if (error) {
          newErrors[field] = error
        }
      }
    })

    const acceptTermsError = validateField('acceptTerms', formData.acceptTerms)
    if (acceptTermsError) {
      newErrors.acceptTerms = acceptTermsError
    }

    if (formData.paymentMethod === 'mobile-wallet') {
      const walletError = validateField(
        'walletMobileNumber',
        formData.walletMobileNumber
      )
      if (walletError) {
        newErrors.walletMobileNumber = walletError
      }
    }

    // Validate card fields only if the selected payment method requires card info
    const selectedPaymentMethod = paymentMethods.find(pm => {
      const methodValue = getPaymentMethodValue(pm.code)
      return methodValue === formData.paymentMethod
    })

    if (
      selectedPaymentMethod?.requiresCardInfo ||
      formData.paymentMethod === 'debit-credit'
    ) {
      const cardFields: (keyof OrderFormData)[] = [
        'cardNumber',
        'cardExpiry',
        'cardCVV',
        'cardholderName',
      ]
      cardFields.forEach(field => {
        const value = formData[field]
        if (typeof value === 'string') {
          const error = validateField(field, value)
          if (error) {
            newErrors[field] = error
          }
        }
      })
    }

    if (
      localItems.length === 0 &&
      reservationPurchases.length === 0 &&
      membershipPurchases.length === 0 &&
      giftCardPurchases.length === 0
    ) {
      newErrors.items = 'Please select at least one item'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        const errorElement =
          document.querySelector(`[name="${firstErrorField}"]`) ||
          document.querySelector(`[aria-invalid="true"]`)
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setShowPaymentConfirmation(true)
  }

  const handleConfirmPayment = async () => {
    setIsSubmitting(true)
    try {
      if (!cartData) {
        throw new Error('Cart data not available')
      }

      // Get the selected payment method from the fetched payment methods
      const selectedPaymentMethod = paymentMethods.find(pm => {
        const methodValue = getPaymentMethodValue(pm.code)
        return methodValue === formData.paymentMethod
      })

      // Use the payment method code from API response, or fallback to mapped value
      let paymentMethodCode: string
      if (selectedPaymentMethod?.code) {
        paymentMethodCode = selectedPaymentMethod.code
      } else {
        // Fallback mapping for backward compatibility
        const paymentMethodMap: Record<string, string> = {
          'debit-credit': 'Card',
          'mobile-wallet': 'MobileWallet',
          'cash-on-delivery': 'CashOnDelivery',
        }
        paymentMethodCode = paymentMethodMap[formData.paymentMethod] || 'Card'
      }

      // Get user data for email if available
      const user = getUser()
      const userEmail = user?.email || ''

      // Ensure we have a valid email (required by CustomerRequest)
      // Use user's email if available, otherwise create a temporary email from phone number
      const customerEmail =
        userEmail && userEmail.includes('@')
          ? userEmail
          : `${formData.mobileNumber.replace(/\s/g, '')}@temp.ourbride.com`

      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(/\s+/)
      const firstName = nameParts[0] || formData.fullName || ''
      const lastName = nameParts.slice(1).join(' ') || firstName

      // Get selected address data if an address was selected
      const selectedAddress = selectedAddressId
        ? addresses.find(addr => addr.id === selectedAddressId)
        : null

      // Prepare customer request with all required fields
      const customer: CustomerRequest = {
        email: customerEmail,
        firstName: firstName,
        lastName: lastName,
        address: selectedAddress
          ? selectedAddress.address1 ||
            formData.street ||
            formData.location ||
            ''
          : formData.street || formData.location || '',
        address2: selectedAddress?.address2 || null,
        region: selectedAddress?.state || null,
        city: selectedAddress?.city || formData.location || '',
        country: selectedAddress?.country || 'Egypt',
        phone: formData.mobileNumber,
        postCode: selectedAddress?.postcode || null,
        deliveryAddressId: selectedAddressId || null, // Include DeliveryAddressId if address is selected
      }

      // Get preferred delivery date from first purchase with delivery date, if any
      // Check purchases directly as they have the ISO date format
      const firstPurchaseWithDeliveryDate = allPurchases.find(
        p => p.preferredDeliveryDate
      )
      const preferredDeliveryDate =
        firstPurchaseWithDeliveryDate?.preferredDeliveryDate || null

      // Prepare checkout request with all required and optional fields
      const checkoutRequest: CheckoutRequest = {
        cartId: cartData.id,
        customer: customer,
        paymentMethod: paymentMethodCode,
        orderNotes: formData.notes || null,
        couponCode: formData.promoCode || null,
        preferredDeliveryDate: preferredDeliveryDate,
      }

      // Validate cart is active before proceeding
      if (!cartData.active) {
        throw new Error(
          'Cart is not active. Please refresh your cart and try again.'
        )
      }

      // Step 1: Call checkout API first
      const checkoutResponse =
        await checkoutMutation.mutateAsync(checkoutRequest)

      setShowPaymentConfirmation(false)

      // If there's a redirect URL, navigate to it
      if (checkoutResponse.redirectUrl) {
        window.location.href = checkoutResponse.redirectUrl
        return
      }

      // Store checkout data in sessionStorage for create-order page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'checkoutRequest',
          JSON.stringify(checkoutRequest)
        )
        sessionStorage.setItem(
          'checkoutResponse',
          JSON.stringify(checkoutResponse)
        )
        sessionStorage.setItem('cartData', JSON.stringify(cartData))
      }

      // Step 2: Navigate to create-order page to complete the order creation
      // The create-order page will handle polling (if needed) and call create order API
      const params = new URLSearchParams({
        checkoutOrderNumber: checkoutResponse.checkoutOrderNumber || '',
        orderId: checkoutResponse.orderId?.toString() || '',
        cartId: checkoutResponse.cartId?.toString() || '',
        status: checkoutResponse.status || '',
      })
      router.push(`/create-order?${params.toString()}`)
    } catch (error) {
      addToast(
        error instanceof Error
          ? error.message
          : 'An error occurred during checkout. Please try again.',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuantityChange = async (id: string, delta: number) => {
    const product = localItems.find(p => p.id === id)
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
      // Update local state optimistically
      setLocalItems(prev =>
        prev.map(p => (p.id === id ? { ...p, quantity: newQuantity } : p))
      )
    } catch (error) {
      addToast('Failed to update quantity. Please try again.', 'error')
    }
  }

  const handleRemoveItemClick = (id: string) => {
    const product = localItems.find(p => p.id === id)
    if (!product) return

    try {
      removePurchaseMutation.mutateAsync({
        id: product.purchaseId.toString(),
        data: {},
      })
      // Update local state
      setLocalItems(prev => prev.filter(p => p.id !== id))
      setSelectedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(parseInt(id, 10))
        return newSet
      })
    } catch (error) {
      addToast('Failed to remove item. Please try again.', 'error')
    }
  }

  // Calculate totals from priceCalculation (most accurate), then cartSummary, otherwise calculate from all items
  const {
    subtotal,
    taxesAndFees,
    deliveryFee,
    total,
    couponDiscount,
    appliedCouponCode,
  } = useMemo(() => {
    // Priority 1: Use priceCalculation if available (most detailed and accurate)
    if (cartData?.priceCalculation) {
      const calc = cartData.priceCalculation
      return {
        subtotal: calc.subtotal,
        taxesAndFees: calc.tax,
        deliveryFee: calc.shippingCost,
        total: calc.total,
        couponDiscount: calc.couponDiscount ?? 0,
        appliedCouponCode: calc.couponCode ?? '',
      }
    }

    // Priority 2: Use cartSummary if available
    if (cartData?.cartSummary) {
      const summary = cartData.cartSummary
      return {
        subtotal: summary.subtotal,
        taxesAndFees: summary.tax,
        deliveryFee: summary.shipping,
        total: summary.total,
        couponDiscount: summary.couponDiscount ?? 0,
        appliedCouponCode: summary.couponCode ?? '',
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
    const sub =
      productsTotal + reservationsTotal + membershipsTotal + giftCardsTotal
    const taxes = 0 // Will be calculated by API
    const delivery = 0 // Will be calculated by API
    const tot = sub + taxes + delivery

    // Get coupon code from cart data
    const couponCode =
      cartData?.couponCode ?? cartData?.cartSummary?.couponCode ?? ''

    return {
      subtotal: sub,
      taxesAndFees: taxes,
      deliveryFee: delivery,
      total: tot,
      couponDiscount: 0,
      appliedCouponCode: couponCode,
    }
  }, [
    cartData,
    cartProducts,
    reservationPurchases,
    membershipPurchases,
    giftCardPurchases,
  ])

  const hasRelevantErrors =
    Object.keys(errors).length > 0 &&
    Object.values(errors).some(error => error !== '')

  const isCheckoutDisabled =
    (localItems.length === 0 &&
      reservationPurchases.length === 0 &&
      membershipPurchases.length === 0 &&
      giftCardPurchases.length === 0) ||
    hasRelevantErrors ||
    isSubmitting

  // Show loading state
  if (isLoadingCart) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <div className="container-custom py-6 md:py-8">
            <LoadingOverlay
              open={true}
              title="Loading checkout..."
              subtitle="Please wait a moment"
            />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Show error state
  if (cartError) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <div className="container-custom py-6 md:py-8">
            <ErrorDisplay
              title="Error loading cart"
              message="Please try again later"
              actionLabel="Back to Home"
              actionHref="/"
            />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Show empty cart state
  const hasItems =
    localItems.length > 0 ||
    reservationPurchases.length > 0 ||
    membershipPurchases.length > 0 ||
    giftCardPurchases.length > 0

  if (!hasItems) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <div className="container-custom py-6 md:py-8">
            <h1 className="text-18 md:text-24 font-normal text-gray-900 mb-6 md:mb-8">
              Order Checkout
            </h1>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-16 text-gray-600 mb-4">Your cart is empty</p>
                <Button variant="brand" onClick={() => router.push('/cart')}>
                  Go to Cart
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="container-custom py-6 md:py-8">
          <h1 className="text-18 md:text-24 font-normal text-gray-900 mb-6 md:mb-8">
            Order Checkout
          </h1>

          <form
            onSubmit={e => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* LEFT COLUMN - Form Section */}
              <div className="w-full lg:w-[40%] lg:flex-shrink-0 space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Full Name"
                    prefixIcon={User}
                    value={formData.fullName}
                    onChange={e => updateFormData('fullName', e.target.value)}
                    onBlur={() => {
                      const error = validateField('fullName', formData.fullName)
                      if (error)
                        setErrors(prev => ({ ...prev, fullName: error }))
                    }}
                    variant={errors.fullName ? 'error' : 'default'}
                    errorMessage={errors.fullName}
                    className="w-full"
                  />

                  <Input
                    type="tel"
                    placeholder="Mobile Number"
                    prefixIcon={Phone}
                    value={formData.mobileNumber}
                    onChange={e =>
                      updateFormData('mobileNumber', e.target.value)
                    }
                    onBlur={() => {
                      const error = validateField(
                        'mobileNumber',
                        formData.mobileNumber
                      )
                      if (error)
                        setErrors(prev => ({ ...prev, mobileNumber: error }))
                    }}
                    variant={errors.mobileNumber ? 'error' : 'default'}
                    errorMessage={errors.mobileNumber}
                    className="w-full"
                  />
                </div>

                {/* Delivery Details Section */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-18 font-normal text-gray-900">
                    Delivery Details
                  </h3>

                  {/* Address Selector */}
                  {isLoadingAddresses ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-14 text-gray-500">
                        Loading addresses...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Horizontal Address Selector */}
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {addresses.map(address => (
                          <button
                            key={address.id}
                            type="button"
                            onClick={() => {
                              setSelectedAddressId(address.id)
                              // Update form data with selected address
                              updateFormData(
                                'location',
                                address.city || address.address1 || ''
                              )
                              updateFormData(
                                'street',
                                address.address1 || address.address2 || ''
                              )
                            }}
                            className={cn(
                              'flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all text-left min-w-[200px]',
                              'hover:bg-gray-50',
                              selectedAddressId === address.id
                                ? 'border-brand-400 bg-white'
                                : 'border-gray-300 bg-white'
                            )}
                          >
                            <div className="flex items-start gap-2">
                              <MapPin
                                className={cn(
                                  'h-5 w-5 flex-shrink-0 mt-0.5',
                                  selectedAddressId === address.id
                                    ? 'text-brand-400'
                                    : 'text-gray-400'
                                )}
                              />
                              <div className="flex-1 min-w-0">
                                <p
                                  className={cn(
                                    'text-14 font-medium truncate',
                                    selectedAddressId === address.id
                                      ? 'text-brand-400'
                                      : 'text-gray-900'
                                  )}
                                >
                                  {address.contactName || 'Address'}
                                </p>
                                <p className="text-12 text-gray-600 line-clamp-2 mt-1">
                                  {address.address1 || ''}{' '}
                                  {address.address2 || ''}
                                  {address.city && `, ${address.city}`}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}

                        {/* Add Address Button */}
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(true)}
                          className={cn(
                            'flex-shrink-0 px-4 py-3 rounded-lg border-2 border-dashed transition-all',
                            'border-gray-300 bg-white hover:bg-gray-50 hover:border-brand-400',
                            'flex items-center justify-center gap-2 min-w-[200px]'
                          )}
                        >
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <span className="text-14 font-medium text-gray-600">
                            Add Address
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Notes */}
                  <div className="relative">
                    <textarea
                      placeholder="Notes to the delivery person..."
                      value={formData.notes}
                      onChange={e => updateFormData('notes', e.target.value)}
                      rows={3}
                      className={cn(
                        'w-full px-4 py-3 pl-12 rounded-md border bg-background text-16',
                        'ring-offset-background transition-colors',
                        'placeholder:text-gray-400 focus-visible:outline-none',
                        'focus-visible:ring-2 focus-visible:ring-offset-2',
                        'border-gray-300 focus-visible:border-brand-500 focus-visible:ring-brand-500',
                        'resize-none'
                      )}
                    />
                    <FileText className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-18 font-normal text-gray-900">
                    Payment Method
                  </h3>
                  {isLoadingPaymentMethods ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-14 text-gray-500">
                        Loading payment methods...
                      </p>
                    </div>
                  ) : paymentMethods.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-14 text-gray-500">
                        No payment methods available
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {paymentMethods.map(method => {
                        // Map payment method code to icon
                        const getPaymentMethodIcon = (code: string) => {
                          const codeLower = code.toLowerCase()
                          if (
                            codeLower.includes('card') ||
                            codeLower.includes('credit') ||
                            codeLower.includes('debit')
                          ) {
                            return CreditCard
                          }
                          if (
                            codeLower.includes('wallet') ||
                            codeLower.includes('mobile')
                          ) {
                            return Wallet
                          }
                          if (
                            codeLower.includes('cash') ||
                            codeLower.includes('delivery')
                          ) {
                            return DollarSign
                          }
                          return CreditCard // Default icon
                        }

                        const Icon = getPaymentMethodIcon(method.code)
                        const methodValue = getPaymentMethodValue(method.code)
                        const isSelected =
                          formData.paymentMethod === methodValue
                        const displayName =
                          method.nameEn || method.nameAr || method.code

                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => {
                              updateFormData('paymentMethod', methodValue)
                              if (methodValue !== 'mobile-wallet') {
                                updateFormData('walletMobileNumber', '')
                                setErrors(prev => {
                                  const newErrors = { ...prev }
                                  delete newErrors.walletMobileNumber
                                  return newErrors
                                })
                              }
                              // Clear card info if payment method doesn't require it
                              if (!method.requiresCardInfo) {
                                updateFormData('cardNumber', '')
                                updateFormData('cardExpiry', '')
                                updateFormData('cardCVV', '')
                                updateFormData('cardholderName', '')
                                setErrors(prev => {
                                  const newErrors = { ...prev }
                                  delete newErrors.cardNumber
                                  delete newErrors.cardExpiry
                                  delete newErrors.cardCVV
                                  delete newErrors.cardholderName
                                  return newErrors
                                })
                              }
                            }}
                            className={cn(
                              'flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all',
                              'hover:bg-gray-50',
                              isSelected
                                ? 'border-brand-400 bg-white'
                                : 'border-gray-300 bg-white'
                            )}
                          >
                            {method.logoUrl ? (
                              <img
                                src={method.logoUrl}
                                alt={displayName}
                                className="h-8 w-auto object-contain max-w-[60px]"
                              />
                            ) : method.iconUrl ? (
                              <img
                                src={method.iconUrl}
                                alt={displayName}
                                className="h-5 w-5 object-contain"
                              />
                            ) : (
                              <Icon
                                className={cn(
                                  'h-5 w-5',
                                  isSelected
                                    ? 'text-brand-400'
                                    : 'text-gray-400'
                                )}
                              />
                            )}
                            <span
                              className={cn(
                                'text-12 font-medium text-center',
                                isSelected
                                  ? 'text-brand-400 font-normal'
                                  : 'text-gray-600'
                              )}
                            >
                              {displayName}
                            </span>
                            {method.supportsInstallments &&
                              method.maxInstallments && (
                                <span className="text-10 text-gray-500">
                                  Up to {method.maxInstallments} installments
                                </span>
                              )}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Wallet Details Section (Conditional) */}
                  {formData.paymentMethod === 'mobile-wallet' && (
                    <div className="space-y-4 pt-4 pb-6">
                      <h3 className="text-18 font-normal text-gray-900">
                        Wallet Details
                      </h3>
                      <Input
                        type="tel"
                        placeholder="Mobile Number"
                        value={formData.walletMobileNumber}
                        onChange={e =>
                          updateFormData('walletMobileNumber', e.target.value)
                        }
                        onBlur={() => {
                          const error = validateField(
                            'walletMobileNumber',
                            formData.walletMobileNumber
                          )
                          if (error)
                            setErrors(prev => ({
                              ...prev,
                              walletMobileNumber: error,
                            }))
                        }}
                        variant={
                          errors.walletMobileNumber ? 'error' : 'default'
                        }
                        errorMessage={errors.walletMobileNumber}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Card Details Section (Conditional) */}
                  {/* COMMENTED OUT - Card Details Section
                  {formData.paymentMethod === 'debit-credit' && (
                    <div className="space-y-4 pt-4 pb-6">
                      <h3 className="text-18 font-normal text-gray-900">
                        Card Details
                      </h3>
                      <Input
                        type="text"
                        placeholder="Name On Card"
                        value={formData.cardholderName}
                        onChange={e =>
                          updateFormData('cardholderName', e.target.value)
                        }
                        onBlur={() => {
                          const error = validateField(
                            'cardholderName',
                            formData.cardholderName
                          )
                          if (error)
                            setErrors(prev => ({
                              ...prev,
                              cardholderName: error,
                            }))
                        }}
                        variant={errors.cardholderName ? 'error' : 'default'}
                        errorMessage={errors.cardholderName}
                        className="w-full"
                      />
                      <Input
                        type="text"
                        placeholder="Card Number"
                        prefixIcon={CreditCard}
                        value={formData.cardNumber}
                        onChange={e => {
                          let value = e.target.value
                            .replace(/\s/g, '')
                            .replace(/\D/g, '')
                          value = value.slice(0, 16)
                          value = value.replace(/(.{4})/g, '$1 ').trim()
                          updateFormData('cardNumber', value)
                        }}
                        onBlur={() => {
                          const error = validateField(
                            'cardNumber',
                            formData.cardNumber
                          )
                          if (error)
                            setErrors(prev => ({ ...prev, cardNumber: error }))
                        }}
                        variant={errors.cardNumber ? 'error' : 'default'}
                        errorMessage={errors.cardNumber}
                        className="w-full"
                        maxLength={19}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="text"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={e => {
                            let value = e.target.value.replace(/\D/g, '')
                            if (value.length >= 2) {
                              value =
                                value.slice(0, 2) + '/' + value.slice(2, 4)
                            }
                            updateFormData('cardExpiry', value)
                          }}
                          onBlur={() => {
                            const error = validateField(
                              'cardExpiry',
                              formData.cardExpiry
                            )
                            if (error)
                              setErrors(prev => ({
                                ...prev,
                                cardExpiry: error,
                              }))
                          }}
                          variant={errors.cardExpiry ? 'error' : 'default'}
                          errorMessage={errors.cardExpiry}
                          className="w-full"
                          maxLength={5}
                        />
                        <Input
                          type="text"
                          placeholder="CVV"
                          value={formData.cardCVV}
                          onChange={e => {
                            const value = e.target.value
                              .replace(/\D/g, '')
                              .slice(0, 4)
                            updateFormData('cardCVV', value)
                          }}
                          onBlur={() => {
                            const error = validateField(
                              'cardCVV',
                              formData.cardCVV
                            )
                            if (error)
                              setErrors(prev => ({ ...prev, cardCVV: error }))
                          }}
                          variant={errors.cardCVV ? 'error' : 'default'}
                          errorMessage={errors.cardCVV}
                          className="w-full"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  )}
                  */}
                </div>
              </div>

              {/* RIGHT COLUMN - Order Summary */}
              <div className="w-full lg:w-[60%] lg:flex-shrink-0 space-y-6">
                {/* Order Summary Header */}
                <h3 className="text-24 font-normal text-gray-900">
                  Order Summary
                </h3>

                {/* Cart Items List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {/* Products Section */}
                  {cartProducts.length > 0 && (
                    <div className="space-y-3">
                      {cartProducts.map(product => (
                        <CheckoutCartItem
                          key={`product-${product.purchaseId ?? product.id}`}
                          id={product.id}
                          title={product.title}
                          image={product.image}
                          originalPrice={product.originalPrice}
                          discountedPrice={product.discountedPrice}
                          quantity={product.quantity}
                          deliveryDate={product.deliveryDate}
                          discountPercentage={product.discountPercentage}
                          purchasePrice={product.purchasePrice ?? undefined}
                          purchaseDate={product.purchaseDate}
                          type={product.type}
                        />
                      ))}
                    </div>
                  )}

                  {/* Reservations Section */}
                  {reservationPurchases.length > 0 && (
                    <div className="space-y-3">
                      {reservationPurchases.map(reservation => (
                        <CheckoutCartItem
                          key={`reservation-${reservation.purchaseId ?? reservation.id}`}
                          id={reservation.id}
                          title={reservation.title}
                          image={reservation.image}
                          originalPrice={reservation.price}
                          discountedPrice={reservation.price}
                          quantity={reservation.quantity}
                          deliveryDate={reservation.reservationDate}
                          purchasePrice={reservation.purchasePrice ?? undefined}
                          purchaseDate={reservation.purchaseDate}
                          type={reservation.type}
                        />
                      ))}
                    </div>
                  )}

                  {/* Memberships Section */}
                  {membershipPurchases.length > 0 && (
                    <div className="space-y-3">
                      {membershipPurchases.map(membership => (
                        <CheckoutCartItem
                          key={`membership-${membership.purchaseId ?? membership.id}`}
                          id={membership.id}
                          title={membership.title}
                          image={membership.image}
                          originalPrice={membership.price}
                          discountedPrice={membership.price}
                          quantity={membership.quantity}
                          purchasePrice={membership.purchasePrice ?? undefined}
                          purchaseDate={membership.purchaseDate}
                          type={membership.type}
                        />
                      ))}
                    </div>
                  )}

                  {/* Gift Cards Section */}
                  {giftCardPurchases.length > 0 && (
                    <div className="space-y-3">
                      {giftCardPurchases.map(giftCard => (
                        <CheckoutCartItem
                          key={`giftcard-${giftCard.purchaseId ?? giftCard.id}`}
                          id={giftCard.id}
                          title={giftCard.title}
                          image={giftCard.image}
                          originalPrice={giftCard.price}
                          discountedPrice={giftCard.price}
                          quantity={giftCard.quantity}
                          purchasePrice={giftCard.purchasePrice ?? undefined}
                          purchaseDate={giftCard.purchaseDate}
                          type={giftCard.type}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {errors.items && (
                  <div className="flex items-center gap-2 text-12 text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.items}</span>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-14 text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      {subtotal.toLocaleString()} {currency}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-14 text-green-600">
                      <span>Coupon Discount</span>
                      <span className="font-semibold">
                        -{couponDiscount.toLocaleString()} {currency}
                      </span>
                    </div>
                  )}

                  {taxesAndFees > 0 && (
                    <div className="flex justify-between text-14 text-gray-700">
                      <span>Taxes & Fees</span>
                      <span className="font-semibold text-gray-900">
                        {taxesAndFees.toLocaleString()} {currency}
                      </span>
                    </div>
                  )}

                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-14 text-gray-700">
                      <span>Delivery Fee</span>
                      <span className="font-semibold text-gray-900">
                        {deliveryFee.toLocaleString()} {currency}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-18 font-semibold text-gray-900">
                      Total
                    </span>
                    <div className="text-right">
                      <div className="text-18 font-semibold text-gray-900">
                        {total.toLocaleString()} {currency}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applied Coupon Code - Display under summary section */}
                {appliedCouponCode && (
                  <div className="pt-4 pb-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 px-2 py-2 bg-green-50 border border-green-200 rounded-lg">
                      <Percent className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-14 font-medium text-green-800">
                        #{appliedCouponCode}
                      </span>
                      <div className="flex items-center gap-1 ml-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-14 font-medium text-green-600">
                          Redeemed
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="space-y-2 pt-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={formData.acceptTerms}
                      onChange={(checked: boolean) =>
                        updateFormData('acceptTerms', checked)
                      }
                      variant="brand"
                      size="md"
                    />
                    <label className="text-14 text-gray-700 cursor-pointer flex-1">
                      I Accept{' '}
                      <button
                        type="button"
                        className="text-brand-400 hover:text-brand-500 hover:underline transition-colors"
                        onClick={e => {
                          e.preventDefault()
                        }}
                      >
                        Terms & Conditions
                      </button>
                    </label>
                  </div>
                  <p className="text-12 text-gray-500 pl-8">
                    If you are not around when the delivery person comes, then
                    will leave your order at the door. By placing your order,
                    you agree to take full responsibility for it once it&apos;s
                    delivered.
                  </p>
                  {errors.acceptTerms && (
                    <p className="text-12 text-red-500 pl-8">
                      {errors.acceptTerms}
                    </p>
                  )}
                </div>

                {/* Checkout Button */}
                <div className="pt-4 pb-6">
                  <Button
                    type="submit"
                    variant="default"
                    size="xl"
                    disabled={
                      isCheckoutDisabled ||
                      checkoutMutation.isPending ||
                      isSubmitting ||
                      !formData.acceptTerms
                    }
                    className="w-full rounded-lg text-white"
                  >
                    {isSubmitting || checkoutMutation.isPending
                      ? 'Processing...'
                      : 'Create Order'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />

      {/* Payment Confirmation Modal */}
      <PaymentConfirmationModal
        isOpen={showPaymentConfirmation}
        onClose={() => setShowPaymentConfirmation(false)}
        onConfirm={handleConfirmPayment}
        amount={total}
        currency={currency}
        isLoading={isSubmitting}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={showOrderConfirmation}
        onClose={() => setShowOrderConfirmation(false)}
        onTrackOrder={() => {
          router.push('/orders')
        }}
      />

      {/* Loading Overlay for Mutations */}
      <LoadingOverlay
        open={
          updatePurchaseMutation.isPending ||
          removePurchaseMutation.isPending ||
          checkoutMutation.isPending ||
          isSubmitting ||
          validateCouponMutation.isPending
        }
        title={
          checkoutMutation.isPending || isSubmitting
            ? 'Processing checkout...'
            : updatePurchaseMutation.isPending ||
                removePurchaseMutation.isPending
              ? 'Updating cart...'
              : 'Validating...'
        }
        subtitle="Please wait a moment"
      />

      {/* Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSuccess={() => {
          setShowAddressModal(false)
        }}
      />
    </div>
  )
}
