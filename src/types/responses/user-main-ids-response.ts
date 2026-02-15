import type { Source } from './common'

export interface UserMainIdsResponse {
  userId?: string
  providerId?: number
  branchId?: number
  staffId?: string
  lang?: string
  page: number
  pageSize: number
  follows: FollowIdItem[]
  wishlists: WishlistIdItem[]
  /** List of all cart items (one per purchase). Empty array when no items. */
  cart?: CartIdInfo[]
  cartsWithProviders: CartProviderIdInfo[]
  warnings: string[]
}

export interface FollowIdItem {
  id: number
  sourceId: number
  source: Source
  nameAr?: string
  nameEn?: string
  descriptionAr?: string
  descriptionEn?: string
  name?: string
  title?: string
  description?: string
}

export interface WishlistIdItem {
  id: number
  sourceId: number
  source: Source
  nameAr?: string
  nameEn?: string
  descriptionAr?: string
  descriptionEn?: string
  name?: string
  title?: string
  description?: string
}

export interface CartIdInfo {
  id?: number
  providerId?: number
  nameAr?: string
  nameEn?: string
  name?: string
  url?: string
  link?: string
  productId?: number
  serviceId?: number
}

export interface CartProviderIdInfo {
  id: number
  providerId?: number
}
