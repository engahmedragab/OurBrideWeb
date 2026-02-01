import type { ProductResponse, ProviderInfoResponse } from '@/types/responses'
import type { ProductCategoryLineResponse } from '@/types/responses/product-category-line-response'
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
      // MediaResponse has 'url' property, not 'src'
      const imageUrl = img.url || img.originalUrl || img.thumbnailUrl || img.previewUrl
      if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '' && !images.includes(imageUrl)) {
        images.push(imageUrl)
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
  // Access providerProductTags using type assertion since it may exist in runtime but not in the generated type
  const productWithProviderTags = apiProduct as typeof apiProduct & {
    providerProductTags?: Array<{ name?: string | null }> | null
  }
  if (productWithProviderTags.providerProductTags && productWithProviderTags.providerProductTags.length > 0) {
    productWithProviderTags.providerProductTags.forEach(tag => {
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

  // Check for categories field (string) from backend
  const productWithCategories = apiProduct as typeof apiProduct & {
    categories?: string | null
  }
  
  // Use category object if available
  if (apiProduct.category) {
    category.id = String(apiProduct.category.id || category.id)
    const categoryWithName = apiProduct.category as typeof apiProduct.category & { nameEn?: string; nameAr?: string; name?: string }
    category.name = categoryWithName.nameEn || categoryWithName.nameAr || categoryWithName.name || ''
    category.slug = apiProduct.category.slug || ''
  }
  // Use categories string field if available (from backend)
  else if (productWithCategories.categories && typeof productWithCategories.categories === 'string') {
    category.name = productWithCategories.categories
    category.slug = productWithCategories.categories.toLowerCase().replace(/\s+/g, '-')
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
    ? (typeof apiProduct.rate === 'string' ? parseFloat(apiProduct.rate) : apiProduct.rate)
    : apiProduct.averageRating
    ? parseFloat(apiProduct.averageRating)
    : 0
  const ratingCount = apiProduct.ratingCount || apiProduct.likes || 0

  // Map reviews if available
  const reviews = apiProduct.reviews?.map(review => ({
    id: String(review.id || ''),
    userId: review.userId || '',
    userName: review.title || 'Anonymous',
    userImage: '',
    rating: review.rate || 0,
    comment: review.comment || '',
    images: [],
    date: review.creationDate || '',
    verified: review.isVerified || false,
    helpful: review.likes || 0,
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
    inStock: apiProduct.stockQuantity !== null && apiProduct.stockQuantity !== undefined 
      ? apiProduct.stockQuantity > 0 
      : (apiProduct.inStock ?? false),
    stockQuantity: apiProduct.stockQuantity ?? undefined,
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

