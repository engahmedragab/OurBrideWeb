export interface Service {
  id: string
  title: string
  description: string
  longDescription?: string
  images: string[]
  provider: {
    id: string
    name: string
    verified: boolean
    image?: string
  }
  price: {
    original: number
    discounted: number
    currency: string
  }
  rating: {
    value: number
    count: number
  }
  category: {
    id: string
    name: string
    slug: string
  }
  tags: string[]
  available: boolean
  availabilityDays: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  isWishlisted?: boolean
  isFavorite?: boolean
  showTopOfferBadge?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ServiceCategory {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  serviceCount?: number
}

export interface ServiceFilter {
  category?: string[]
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  available?: boolean
  tags?: string[]
  availabilityDays?: string[]
}

export interface ServiceSortOption {
  value: string
  label: string
}

export type ServiceViewMode = 'grid' | 'list'
