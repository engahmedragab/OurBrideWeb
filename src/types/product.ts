export interface Product {
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
  inStock: boolean
  stockQuantity?: number
  sku?: string
  specifications?: ProductSpecification[]
  reviews?: ProductReview[]
  isWishlisted?: boolean
  showTopOfferBadge?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ProductSpecification {
  label: string
  value: string
}

export interface ProductReview {
  id: string
  userId: string
  userName: string
  userImage: string
  rating: number
  comment: string
  images?: string[]
  date: string
  verified: boolean
  helpful: number
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  productCount?: number
}

export interface ProductFilter {
  category?: string[]
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  inStock?: boolean
  tags?: string[]
}

export interface ProductSortOption {
  value: string
  label: string
}

export type ProductViewMode = 'grid' | 'list'








