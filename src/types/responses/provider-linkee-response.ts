/**
 * Provider Linkee Response
 * Response for provider Linktree-style public page
 * Contains provider info, contacts, images, and links for sharing
 */

import type { MediaResponse } from './media-response'
import type { AddressResponse } from './address-response'
import type { LinkResponse } from './link-response'

export interface ProviderLinkeeResponse {
  // Provider Basic Information
  providerId: number
  nameAr: string | null
  nameEn: string | null
  descriptionAr: string | null
  descriptionEn: string | null
  isVerified: boolean
  rate: number | null
  likes: number | null

  // Provider Images
  logoImageUrl: string | null
  bannerImageUrl: string | null
  galleryImages: MediaResponse[]

  // Contact Information
  phoneNumber: string | null
  email: string | null
  shortAddress: string | null
  address: AddressResponse | null

  // Links/Social Media
  links: LinkResponse[]

  // Sharing Information
  uniqueCode: string | null
  qrCodeData: string | null
  publicProfileSlug: string | null
  shareUrl: string | null

  // Statistics
  totalViews: number
  totalFollowers: number
  totalProducts: number
  totalServices: number
}



