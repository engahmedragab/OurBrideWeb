/**
 * Branch Portfolio Response
 */
import type { AddressResponse } from './address-response'
import type { MediaResponse } from './media-response'

export interface BranchPortfolioService {
  id: number
  name: string
  description: string
  imageUrl: string
  price: number
  buyPrice: number
  rentPrice: number
  priceType: string
  duration: string
  durationMinutes: number
}

export interface BranchPortfolioReview {
  id?: number
  userName?: string
  date?: string
  rating: number
  text?: string
  title?: string
  likes?: number
  isVerified?: boolean
  isFeatured?: boolean
}

export interface BranchPortfolioReviews {
  averageRating: number | null
  totalReviews: number
  items: BranchPortfolioReview[]
}

export interface BranchPortfolioStatistics {
  appointmentsCompleted: number
  clientsServed: number
}

export interface BranchPortfolioAbout {
  id: number
  name: string
  description: string
  phoneNumber: string
  phoneNumber2: string
  imageUrl: string
  address: AddressResponse
  isMain: boolean
  isActive: boolean
}

export interface BranchPortfolioResponse {
  about: BranchPortfolioAbout
  services: BranchPortfolioService[]
  portfolio: MediaResponse[]
  reviews: BranchPortfolioReviews
  statistics: BranchPortfolioStatistics
}


