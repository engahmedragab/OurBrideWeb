/**
 * Cart Provider Response
 * ProviderId is null for general cart (cart without provider)
 */

export interface CartPurchaseInfo {
  purchaseId: number
  serviceId?: number | null
  productId?: number | null
}

export interface CartProviderResponse {
  providerId?: number | null // Null for general cart
  providerNameAr?: string
  providerNameEn?: string
  providerImage?: string // ProfileURL
  itemCount: number // Number of items from this provider in cart
  
  // Additional cart information
  cartId?: number | null // Cart ID for this provider/general cart
  totalAmount?: number // Total purchase amount for this cart
  count?: number // Total count of items (quantity sum)
  purchases?: CartPurchaseInfo[] // Purchase IDs with serviceId and productId
}



