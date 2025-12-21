import type {
  ProductResponse,
  ProductImageResponse,
  ProductCategoryLineResponse,
  ProductTagLineResponse,
  ProviderInfoResponse,
  ProductReviewResponse,
} from '@/../client/common/api/gen/ourbride-api'
import type { Product, ProductCategory } from '@/types/product'

/**
 * Map API ProductResponse to UI Product type
 */
export const mapProductResponseToProduct = (
  apiProduct: ProductResponse
): Product => {
  // Extract images - filter out empty strings and null/undefined values
  const images: string[] = []
  if (apiProduct.image && typeof apiProduct.image === 'string' && apiProduct.image.trim() !== '') {
    images.push(apiProduct.image)
  }
  if (apiProduct.images && apiProduct.images.length > 0) {
    apiProduct.images.forEach(img => {
      if (img.src && typeof img.src === 'string' && img.src.trim() !== '' && !images.includes(img.src)) {
        images.push(img.src)
      }
    })
  }
  
  // Filter out any empty strings that might have slipped through
  const validImages = images.filter(img => img && typeof img === 'string' && img.trim() !== '')
  
  // Return valid images (empty array is acceptable - components will handle it)
  // Components should check for empty arrays and display placeholder UI
  const finalImages = validImages

  // Extract tags
  const tags: string[] = []
  if (Array.isArray(apiProduct.tags)) {
    tags.push(...apiProduct.tags.map(tag => (tag && typeof tag === 'object' && 'name' in tag ? tag.name || '' : '')).filter(Boolean))
  }
  if (apiProduct.providerProductTags && apiProduct.providerProductTags.length > 0) {
    apiProduct.providerProductTags.forEach(tag => {
      // Safely access name property, similar to how tags array is handled
      if (tag && typeof tag === 'object' && 'name' in tag && tag.name && !tags.includes(tag.name as string)) {
        tags.push(tag.name as string)
      }
    })
  }

  // Extract category
  const category: Product['category'] = {
    id: String(apiProduct.categoryId || apiProduct.id || ''),
    name: '',
    slug: '',
  }

  if (apiProduct.categories && apiProduct.categories.length > 0) {
    const firstCategory = apiProduct.categories[0]
    category.id = String(firstCategory.id || category.id)
    category.name = firstCategory.name || ''
    category.slug = firstCategory.slug || ''
  }

  // Extract provider
  const provider: Product['provider'] = {
    id: String(apiProduct.providerId || ''),
    name: apiProduct.provider?.nameEn || apiProduct.provider?.nameAr || '',
    verified: false,
    image: apiProduct.provider?.profileURL || undefined,
  }

  // Determine if provider is verified (you may need to adjust this based on your API)
  if (apiProduct.provider?.providerStatus) {
    provider.verified = true // Adjust based on actual status enum
  }

  // Calculate prices
  const originalPrice = apiProduct.regularPrice || apiProduct.price || 0
  const discountedPrice = apiProduct.salePrice || apiProduct.price || originalPrice

  // Extract rating
  const ratingValue = apiProduct.rate
    ? parseFloat(apiProduct.rate)
    : apiProduct.averageRating
    ? parseFloat(apiProduct.averageRating)
    : 0
  const ratingCount = apiProduct.ratingCount || apiProduct.likes || 0

  // Map reviews if available
  const reviews = apiProduct.reviews?.map(review => ({
    id: String(review.id || ''),
    userId: review.reviewerEmail || '',
    userName: review.reviewer || 'Anonymous',
    userImage: '',
    rating: review.rating || 0,
    comment: review.review || '',
    images: [],
    date: review.dateCreated || '',
    verified: false,
    helpful: 0,
  }))

  return {
    id: String(apiProduct.id || apiProduct.productId || ''),
    title: apiProduct.name || apiProduct.nameEn || apiProduct.nameAr || '',
    description: apiProduct.shortDescription || apiProduct.description || '',
    longDescription: apiProduct.description || apiProduct.bio || '',
    images: finalImages,
    provider,
    price: {
      original: originalPrice,
      discounted: discountedPrice,
      currency: 'egp', // Default currency, adjust if API provides it
    },
    rating: {
      value: ratingValue,
      count: ratingCount,
    },
    category,
    tags,
    inStock: apiProduct.inStock ?? (apiProduct.stockQuantity ? apiProduct.stockQuantity > 0 : false),
    stockQuantity: apiProduct.stockQuantity || undefined,
    sku: apiProduct.sku || undefined,
    isWishlisted: false, // This should come from a separate API call
    showTopOfferBadge: apiProduct.onSale || apiProduct.hasDiscount || false,
    createdAt: apiProduct.dateCreated || undefined,
    updatedAt: apiProduct.dateModified || undefined,
    reviews,
  }
}

/**
 * Map API category response to UI ProductCategory type
 */
export const mapCategoryResponseToProductCategory = (
  category: ProductCategoryLineResponse
): ProductCategory => {
  return {
    id: String(category.id || ''),
    name: category.name || '',
    slug: category.slug || '',
  }
}

/**
 * Map multiple API products to UI products
 */
export const mapProductResponsesToProducts = (
  apiProducts: ProductResponse[]
): Product[] => {
  return apiProducts.map(mapProductResponseToProduct)
}

