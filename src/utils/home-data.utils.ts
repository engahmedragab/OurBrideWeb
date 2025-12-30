/**
 * Utility functions for home page data transformation
 */

import type { ProductResponse } from '@/types/responses'
import { mapProductResponseToProduct } from '@/types/api/product.api.types'
import type { Product } from '@/types/product'
import type { ServiceResponse } from '@/types/responses/service-response'
import type {
  ProductCardData,
  ServiceCardData,
  TestimonialCardData,
  ProviderCardData,
  MemberTestimonialCardData,
} from '@/components/ui/Card'
import type { OfferItem } from '@/components/ui/OfferBanner'

/**
 * Type guard to check if value is an object
 */
export const isObject = (
  value: unknown
): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Helper function to map API product response to ProductCardData
 */
export const mapProductToCardData = (
  product: ProductResponse
): ProductCardData => {
  const mappedProduct = mapProductResponseToProduct(product)
  return {
    id: mappedProduct.id,
    image: mappedProduct.images?.[0] || '',
    title: mappedProduct.title,
    providerName: mappedProduct.provider?.name || '',
    verified: mappedProduct.provider?.verified || false,
    rating: mappedProduct.rating?.value || 0,
    originalPrice: mappedProduct.price?.original || 0,
    discountedPrice:
      mappedProduct.price?.discounted || mappedProduct.price?.original || 0,
    tags: mappedProduct.tags || [],
    showTopOfferBadge: mappedProduct.showTopOfferBadge || false,
  }
}

/**
 * Helper function to map API service response to ServiceCardData
 */
export const mapServiceToCardData = (
  service: ServiceResponse | Record<string, unknown>
): ServiceCardData => {
  const serviceObj = service as ServiceResponse & Record<string, unknown>

  // Get service name (prefer nameEn, fallback to nameAr, then name)
  const name = (serviceObj.nameEn ||
    serviceObj.nameAr ||
    serviceObj.name ||
    '') as string

  // Get image
  const image = (serviceObj.imageUrl ||
    (Array.isArray(serviceObj.medias) && serviceObj.medias.length > 0
      ? (serviceObj.medias[0] as { src?: string })?.src
      : null) ||
    '') as string

  // Get provider name
  const provider = serviceObj.provider as
    | {
        name?: string
        nameEn?: string
        nameAr?: string
        providerStatus?: string
        isVerified?: boolean
      }
    | null
  const providerName =
    provider?.nameEn || provider?.nameAr || provider?.name || ''

  // Determine if provider is verified
  const verified =
    provider?.isVerified === true ||
    provider?.providerStatus === 'Active' ||
    false

  // Get rating - check both rating and rate fields
  const rating =
    typeof serviceObj.rating === 'number'
      ? serviceObj.rating
      : typeof serviceObj.rate === 'number'
        ? serviceObj.rate
        : 0

  // Get prices - check multiple fields: price, saleBuyPrice, saleRentPrice, rentPrice, buyPrice
  const priceType = (serviceObj.priceType as string) || 'Fixed'
  const directPrice =
    typeof serviceObj.price === 'number' ? serviceObj.price : null
  const rentPrice =
    typeof serviceObj.rentPrice === 'number' ? serviceObj.rentPrice : null
  const buyPrice =
    typeof serviceObj.buyPrice === 'number' ? serviceObj.buyPrice : null
  const saleRentPrice =
    typeof serviceObj.saleRentPrice === 'number' ? serviceObj.saleRentPrice : null
  const saleBuyPrice =
    typeof serviceObj.saleBuyPrice === 'number' ? serviceObj.saleBuyPrice : null
  
  // Determine original and discounted prices
  let originalPrice = 0
  let discountedPrice = 0
  
  if (priceType === 'Rent') {
    originalPrice = rentPrice || directPrice || 0
    discountedPrice = saleRentPrice || originalPrice
  } else {
    originalPrice = buyPrice || directPrice || 0
    discountedPrice = saleBuyPrice || originalPrice
  }

  // Get tags (if available)
  const tags: string[] = []

  return {
    id: String(serviceObj.id || ''),
    image,
    title: name,
    providerName,
    verified,
    rating,
    originalPrice,
    discountedPrice,
    tags,
    showTopOfferBadge: false, // Adjust based on your business logic
  }
}

/**
 * Extract products from API response
 */
const extractProducts = (
  data: Record<string, unknown>
): ProductCardData[] | undefined => {
  // Prioritize topRelatedProducts for "Products Suggested for You"
  if (Array.isArray(data.topRelatedProducts)) {
    return data.topRelatedProducts
      .filter((p): p is ProductResponse => isObject(p))
      .map((p) => mapProductToCardData(p as ProductResponse))
  }
  if (Array.isArray(data.products)) {
    return data.products
      .filter((p): p is ProductResponse => isObject(p))
      .map((p) => mapProductToCardData(p as ProductResponse))
  }
  if (Array.isArray(data.suggestedProducts)) {
    return data.suggestedProducts
      .filter((p): p is ProductResponse => isObject(p))
      .map((p) => mapProductToCardData(p as ProductResponse))
  }
  return undefined
}

/**
 * Extract services from API response
 */
const extractServices = (
  data: Record<string, unknown>
): ServiceCardData[] | undefined => {
  // Check for topRatedServices first (actual API field for services)
  if (Array.isArray(data.topRatedServices)) {
    return data.topRatedServices
      .filter((s): s is Record<string, unknown> => isObject(s))
      .map((s) => mapServiceToCardData(s))
  }
  
  // Extract services from preparations array for "Services Suggested for You"
  // Services are nested inside preparations[].services[]
  if (Array.isArray(data.preparations)) {
    const allServices: ServiceCardData[] = []

    data.preparations.forEach((preparation: unknown) => {
      if (isObject(preparation)) {
        const prep = preparation as Record<string, unknown>
        if (Array.isArray(prep.services)) {
          const services = prep.services
            .filter((s): s is Record<string, unknown> => isObject(s))
            .map((s) => mapServiceToCardData(s))
          allServices.push(...services)
        }
      }
    })

    if (allServices.length > 0) {
      return allServices
    }
  }

  // Fallback to other service fields if preparations is not available
  if (Array.isArray(data.topRelatedServices)) {
    return data.topRelatedServices
      .filter((s): s is Record<string, unknown> => isObject(s))
      .map((s) => mapServiceToCardData(s))
  }
  if (Array.isArray(data.services)) {
    return data.services
      .filter((s): s is Record<string, unknown> => isObject(s))
      .map((s) => mapServiceToCardData(s))
  }
  if (Array.isArray(data.suggestedServices)) {
    return data.suggestedServices
      .filter((s): s is Record<string, unknown> => isObject(s))
      .map((s) => mapServiceToCardData(s))
  }
  return undefined
}

/**
 * Extract testimonials from API response
 */
const extractTestimonials = (
  data: Record<string, unknown>
): TestimonialCardData[] | undefined => {
  if (Array.isArray(data.testimonials)) {
    return data.testimonials.filter((t): t is Record<string, unknown> =>
      isObject(t)
    ).map((t) => ({
      quote: (t.commentEn ||
        t.comment ||
        t.quote ||
        t.review ||
        '') as string,
      rating: (typeof t.rating === 'number' ? t.rating : 5) as number,
      authorName: (t.customerNameEn ||
        t.customerName ||
        t.authorName ||
        t.userName ||
        t.name ||
        'Anonymous') as string,
      authorImage: (t.imageUrl ||
        t.authorImage ||
        t.userImage ||
        t.image ||
        '') as string,
      timeAgo: (t.timeAgo || t.date || '') as string,
    }))
  }
  return undefined
}

/**
 * Extract providers from API response
 */
const extractProviders = (
  data: Record<string, unknown>
): ProviderCardData[] | undefined => {
  if (Array.isArray(data.providers)) {
    return data.providers
      .filter((p): p is Record<string, unknown> => isObject(p))
      .map((p) => {
        // Try multiple image properties, including publicLogoImageUrl from FeaturedProviderResponse
        const image = (p.publicLogoImageUrl || 
          p.image || 
          p.profileURL || 
          p.imageUrl || 
          '') as string
        
        return {
          id: String(p.id || ''),
          name: (p.name || p.nameEn || p.nameAr || '') as string,
          image: image,
          profession: (p.profession || p.serviceClass || '') as string,
          rating: (typeof p.rating === 'number'
            ? p.rating
            : typeof p.rate === 'number'
              ? p.rate
              : 0) as number,
          verified:
            (p.verified === true || p.isVerified === true || p.providerStatus === 'Active') as boolean,
        }
      })
  }
  return undefined
}

/**
 * Extract banners from API response
 */
const extractBanners = (data: Record<string, unknown>): OfferItem[] => {
  if (Array.isArray(data.banners)) {
    return data.banners
      .filter((b): b is Record<string, unknown> => isObject(b))
      .filter((b) => b.isActive === true)
      .map((b) => {
        // Get media URL if available
        const media = b.media as
          | { url?: string; thumbnailUrl?: string; originalUrl?: string }
          | null
        const imageUrl =
          media?.url || media?.thumbnailUrl || media?.originalUrl || ''
        // Only set productImage if we have a valid non-empty URL
        const productImage =
          imageUrl && imageUrl.trim() !== '' ? imageUrl : undefined

        return {
          heading: (b.title || b.nameEn || b.nameAr || '') as string,
          description: (b.description ||
            b.subtitle ||
            b.descriptionEn ||
            b.descriptionAr ||
            '') as string,
          ctaText: (b.buttonText || 'Start Shopping') as string,
          ctaLink: (b.buttonLink || b.linkUrl || '/products') as string,
          productImage,
        } as OfferItem
      })
      .filter((banner) => banner.heading) // Only include banners with a heading
      .sort(
        (a, b) =>
          ((data.banners as Record<string, unknown>[]).find(
            (banner) => banner.title === a.heading
          )?.order as number) -
          ((data.banners as Record<string, unknown>[]).find(
            (banner) => banner.title === b.heading
          )?.order as number)
      )
  }
  return []
}

/**
 * Extract member testimonials from API response
 */
const extractMemberTestimonials = (
  data: Record<string, unknown>
): MemberTestimonialCardData[] | undefined => {
  if (Array.isArray(data.testimonials)) {
    // Use testimonials for member testimonials section
    return data.testimonials
      .filter((mt): mt is Record<string, unknown> => isObject(mt))
      .map((mt) => ({
        authorName: (mt.customerNameEn ||
          mt.customerName ||
          mt.authorName ||
          mt.userName ||
          mt.name ||
          'Anonymous') as string,
        authorImage: (mt.imageUrl ||
          mt.authorImage ||
          mt.userImage ||
          mt.image ||
          '') as string,
        reviewText: (mt.commentEn ||
          mt.comment ||
          mt.reviewText ||
          mt.review ||
          mt.quote ||
          '') as string,
        productImages: (Array.isArray(mt.productImages)
          ? mt.productImages
          : Array.isArray(mt.images)
            ? mt.images
            : mt.imageUrl
              ? [mt.imageUrl]
              : []) as string[],
        date: (mt.date || mt.timeAgo || '') as string,
        likes: (typeof mt.likes === 'number' ? mt.likes : 0) as number,
        comments: (typeof mt.comments === 'number' ? mt.comments : 0) as number,
      }))
  }
  if (Array.isArray(data.memberTestimonials)) {
    // Fallback to memberTestimonials if testimonials is not available
    return data.memberTestimonials
      .filter((mt): mt is Record<string, unknown> => isObject(mt))
      .map((mt) => ({
        authorName: (mt.customerNameEn ||
          mt.customerName ||
          mt.authorName ||
          mt.userName ||
          mt.name ||
          'Anonymous') as string,
        authorImage: (mt.imageUrl ||
          mt.authorImage ||
          mt.userImage ||
          mt.image ||
          '') as string,
        reviewText: (mt.commentEn ||
          mt.comment ||
          mt.reviewText ||
          mt.review ||
          '') as string,
        productImages: (Array.isArray(mt.productImages)
          ? mt.productImages
          : Array.isArray(mt.images)
            ? mt.images
            : []) as string[],
        date: (mt.date || mt.timeAgo || '') as string,
        likes: (typeof mt.likes === 'number' ? mt.likes : 0) as number,
        comments: (typeof mt.comments === 'number' ? mt.comments : 0) as number,
      }))
  }
  return undefined
}

/**
 * Extract product categories from API response
 */
const extractCategories = (
  data: Record<string, unknown>
): Array<{ id: number; name: string; slug?: string }> | undefined => {
  if (Array.isArray(data.categories)) {
    return data.categories
      .filter((c): c is Record<string, unknown> => isObject(c))
      .map((c) => ({
        id: (typeof c.id === 'number' ? c.id : 0) as number,
        name: (c.name || c.nameEn || c.nameAr || '') as string,
        slug: (c.slug || '') as string,
      }))
  }
  return undefined
}

/**
 * Extract top bar texts from API response
 */
const extractTopBarTexts = (
  data: Record<string, unknown>
): Array<{
  id: number
  text: string
  textEn?: string
  textAr?: string
  backgroundColor?: string
  textColor?: string
  isActive: boolean
  order: number
}> | undefined => {
  if (Array.isArray(data.topBarTexts)) {
    return data.topBarTexts
      .filter((t): t is Record<string, unknown> => isObject(t))
      .filter((t) => t.isActive === true)
      .map((t) => ({
        id: (typeof t.id === 'number' ? t.id : 0) as number,
        text: (t.text || t.textEn || t.textAr || '') as string,
        textEn: (t.textEn || '') as string,
        textAr: (t.textAr || '') as string,
        backgroundColor: (t.backgroundColor || '#FF6B9D') as string,
        textColor: (t.textColor || '#FFFFFF') as string,
        isActive: (t.isActive || false) as boolean,
        order: (typeof t.order === 'number' ? t.order : 0) as number,
      }))
      .sort((a, b) => a.order - b.order)
  }
  return undefined
}

/**
 * Extract testimonials from store home response
 */
const extractStoreTestimonials = (
  data: Record<string, unknown>
): TestimonialCardData[] | undefined => {
  if (Array.isArray(data.testimonials)) {
    return data.testimonials
      .filter((t): t is Record<string, unknown> => isObject(t))
      .filter((t) => t.isActive === true)
      .map((t) => ({
        quote: (t.comment || t.commentEn || t.commentAr || '') as string,
        rating: (typeof t.rating === 'number' ? t.rating : 5) as number,
        authorName: (t.customerName ||
          t.customerNameEn ||
          t.customerNameAr ||
          'Anonymous') as string,
        authorImage: (t.imageUrl || '') as string,
        timeAgo: '', // Not provided in this API
      }))
  }
  return undefined
}

/**
 * Extract FAQs from API response
 */
const extractFAQs = (
  data: Record<string, unknown>
): Array<{
  id: number
  question: string
  questionEn?: string
  questionAr?: string
  answer: string
  answerEn?: string
  answerAr?: string
  order: number
}> | undefined => {
  if (Array.isArray(data.faQs)) {
    return data.faQs
      .filter((f): f is Record<string, unknown> => isObject(f))
      .filter((f) => f.isActive === true)
      .map((f) => ({
        id: (typeof f.id === 'number' ? f.id : 0) as number,
        question: (f.question || f.questionEn || f.questionAr || '') as string,
        questionEn: (f.questionEn || '') as string,
        questionAr: (f.questionAr || '') as string,
        answer: (f.answer || f.answerEn || f.answerAr || '') as string,
        answerEn: (f.answerEn || '') as string,
        answerAr: (f.answerAr || '') as string,
        order: (typeof f.order === 'number' ? f.order : 0) as number,
      }))
      .sort((a, b) => a.order - b.order)
  }
  return undefined
}

/**
 * Extract product offers from API response
 */
const extractOffers = (
  data: Record<string, unknown>
): ProductCardData[] | undefined => {
  if (Array.isArray(data.offers)) {
    return data.offers
      .filter((p): p is ProductResponse => isObject(p))
      .map((p) => mapProductToCardData(p as ProductResponse))
  }
  if (Array.isArray(data.topOffers)) {
    return data.topOffers
      .filter((p): p is ProductResponse => isObject(p))
      .map((p) => mapProductToCardData(p as ProductResponse))
  }
  return undefined
}

/**
 * Helper function to extract data from home API response
 */
export const extractHomeData = (apiResponse: unknown) => {
  const result: {
    products?: ProductCardData[]
    services?: ServiceCardData[]
    testimonials?: TestimonialCardData[]
    providers?: ProviderCardData[]
    memberTestimonials?: MemberTestimonialCardData[]
    banners?: OfferItem[]
    statistics?: {
      clients: string
      serviceProviders: string
      availableServices: string
      products: string
      activeUsers: string
      reservations: string
    }
  } = {}

  // Handle different response structures
  const responseObj = isObject(apiResponse) ? apiResponse : {}
  const data = (isObject(responseObj.data)
    ? responseObj.data
    : responseObj) as Record<string, unknown>

  // Extract all data types
  result.products = extractProducts(data)
  result.services = extractServices(data)
  result.testimonials = extractTestimonials(data)
  result.providers = extractProviders(data)
  result.memberTestimonials = extractMemberTestimonials(data)
  result.banners = extractBanners(data)

  // Extract statistics
  if (isObject(data.statistics)) {
    const stats = data.statistics as Record<string, unknown>
    result.statistics = {
      clients: String(stats.clients || '+0'),
      serviceProviders: String(stats.serviceProviders || '+0'),
      availableServices: String(stats.availableServices || '+0'),
      products: String(stats.products || '+0'),
      activeUsers: String(stats.activeUsers || '+0'),
      reservations: String(stats.reservations || '+0'),
    }
  }

  return result
}

/**
 * Helper function to extract data from products home API response
 */
export const extractProductsHomeData = (apiResponse: unknown) => {
  const result: {
    products?: Product[]
    categories?: Array<{ id: number; name: string; slug?: string; description?: string }>
  } = {}

  // Handle different response structures
  const responseObj = isObject(apiResponse) ? apiResponse : {}
  const data = (isObject(responseObj.data)
    ? responseObj.data
    : responseObj) as Record<string, unknown>

  // Extract products - check multiple possible locations
  // Priority: tags > attributes > headers > flashSaleGrouped
  let productsArray: ProductResponse[] = []
  
  if (Array.isArray(data.tags)) {
    productsArray = data.tags.filter((p): p is ProductResponse => isObject(p)) as ProductResponse[]
  } else if (Array.isArray(data.attributes)) {
    productsArray = data.attributes.filter((p): p is ProductResponse => isObject(p)) as ProductResponse[]
  } else if (Array.isArray(data.headers)) {
    productsArray = data.headers.filter((p): p is ProductResponse => isObject(p)) as ProductResponse[]
  } else if (isObject(data.flashSaleGrouped)) {
    // Extract from flashSaleGrouped - get first date's products
    const flashSale = data.flashSaleGrouped as Record<string, unknown>
    const firstDateKey = Object.keys(flashSale)[0]
    if (firstDateKey && Array.isArray(flashSale[firstDateKey])) {
      productsArray = (flashSale[firstDateKey] as unknown[]).filter((p): p is ProductResponse => isObject(p)) as ProductResponse[]
    }
  } else if (Array.isArray(data.products)) {
    productsArray = data.products.filter((p): p is ProductResponse => isObject(p)) as ProductResponse[]
  }

  // Map products to Product type
  if (productsArray.length > 0) {
    result.products = productsArray.map((p) => mapProductResponseToProduct(p))
  }

  // Extract categories - handle the actual structure from API
  if (Array.isArray(data.categories)) {
    result.categories = data.categories
      .filter((c): c is Record<string, unknown> => isObject(c))
      .map((c) => ({
        id: (typeof c.id === 'number' ? c.id : 0) as number,
        name: (c.name || c.nameEn || c.nameAr || '') as string,
        slug: (c.slug || '') as string,
      }))
  }

  return result
}

/**
 * Helper function to extract data from store home API response
 */
export const extractStoreHomeData = (apiResponse: unknown) => {
  const result: {
    products?: ProductCardData[]
    categories?: Array<{ id: number; name: string; slug?: string; description?: string }>
    offers?: ProductCardData[]
    providers?: ProviderCardData[]
    banners?: OfferItem[]
    topBarTexts?: Array<{
      id: number
      text: string
      textEn?: string
      textAr?: string
      backgroundColor?: string
      textColor?: string
      isActive: boolean
      order: number
    }>
    testimonials?: TestimonialCardData[]
    faqs?: Array<{
      id: number
      question: string
      questionEn?: string
      questionAr?: string
      answer: string
      answerEn?: string
      answerAr?: string
      order: number
    }>
  } = {}

  // Handle different response structures
  const responseObj = isObject(apiResponse) ? apiResponse : {}
  const data = (isObject(responseObj.data)
    ? responseObj.data
    : responseObj) as Record<string, unknown>

  // Extract store-specific data
  result.products = extractProducts(data)
  result.categories = extractCategories(data)
  result.offers = extractOffers(data)
  result.providers = extractProviders(data)
  result.banners = extractBanners(data)
  result.topBarTexts = extractTopBarTexts(data)
  result.testimonials = extractStoreTestimonials(data)
  result.faqs = extractFAQs(data)

  return result
}

/**
 * Extract service offers from API response
 */
const extractServiceOffers = (
  data: Record<string, unknown>
): ServiceCardData[] | undefined => {
  // Check for topRatedServices (actual API field)
  if (Array.isArray(data.topRatedServices)) {
    return data.topRatedServices
      .filter((s): s is Record<string, unknown> => isObject(s))
      .map((s) => mapServiceToCardData(s))
  }
  // Check multiple possible locations for service offers
  if (Array.isArray(data.topOffers)) {
    return data.topOffers
      .filter((s): s is Record<string, unknown> => isObject(s))
      .map((s) => mapServiceToCardData(s))
  }
  if (Array.isArray(data.offers)) {
    return data.offers
      .filter((s): s is Record<string, unknown> => isObject(s))
      .map((s) => mapServiceToCardData(s))
  }
  // If no offers array, try to get first few services
  const allServices = extractServices(data)
  if (allServices && allServices.length > 0) {
    return allServices.slice(0, 4) // Return first 4 as offers
  }
  return undefined
}

/**
 * Extract hero slides from API response
 */
const extractHeroSlides = (
  data: Record<string, unknown>
): Array<{
  id: string
  label: string
  title: string
  description: string
  ctaText: string
  ctaLink: string
  productImage: string
  discountText?: string
}> | undefined => {
  if (Array.isArray(data.banners)) {
    return data.banners
      .filter((b): b is Record<string, unknown> => isObject(b))
      .filter((b) => b.isActive === true || b.isActive === undefined)
      .sort((a, b) => {
        // Sort by order if available
        const orderA = typeof a.order === 'number' ? a.order : 0
        const orderB = typeof b.order === 'number' ? b.order : 0
        return orderA - orderB
      })
      .slice(0, 5) // Limit to 5 slides
      .map((b, index) => {
        const media = b.media as
          | { url?: string; thumbnailUrl?: string; originalUrl?: string }
          | null
        const imageUrl =
          media?.url || media?.thumbnailUrl || media?.originalUrl || ''
        return {
          id: String(b.id || index + 1),
          label: (b.title || b.badge || '') as string,
          title: (b.nameEn || b.nameAr || b.title || '') as string,
          description:
            (b.descriptionEn ||
              b.descriptionAr ||
              b.description ||
              b.subtitle ||
              '') as string,
          ctaText: (b.buttonText || 'Book Now') as string,
          ctaLink: (b.buttonLink || b.linkUrl || '/services') as string,
          productImage: imageUrl,
          discountText: (b.badge || '') as string,
        }
      })
  }
  return undefined
}

/**
 * Extract trust features from API response
 */
const extractTrustFeatures = (
  data: Record<string, unknown>
): Array<{ title: string; description: string }> | undefined => {
  if (Array.isArray(data.usps)) {
    return data.usps
      .filter((u): u is Record<string, unknown> => isObject(u))
      .filter((u) => u.isActive === true || u.isActive === undefined)
      .map((u) => ({
        title: (u.title || u.nameEn || u.nameAr || '') as string,
        description:
          (u.description ||
            u.descriptionEn ||
            u.descriptionAr ||
            '') as string,
      }))
      .slice(0, 4) // Limit to 4 features
  }
  return undefined
}

/**
 * Helper function to extract data from services home API response
 */
export const extractServicesHomeData = (apiResponse: unknown) => {
  const result: {
    services?: ServiceCardData[]
    offers?: ServiceCardData[]
    categories?: Array<{ id: number; name: string; slug?: string; description?: string }>
    banners?: OfferItem[]
    providers?: ProviderCardData[]
    heroSlides?: Array<{
      id: string
      label: string
      title: string
      description: string
      ctaText: string
      ctaLink: string
      productImage: string
      discountText?: string
    }>
    trustFeatures?: Array<{ title: string; description: string }>
  } = {}

  // Handle different response structures
  const responseObj = isObject(apiResponse) ? apiResponse : {}
  const data = (isObject(responseObj.data)
    ? responseObj.data
    : responseObj) as Record<string, unknown>

  // Extract services
  result.services = extractServices(data)

  // Extract offers (top offers or first few services)
  result.offers = extractServiceOffers(data)

  // Extract categories (featuredPreparations) - handle the actual structure from API
  if (Array.isArray(data.featuredPreparations)) {
    result.categories = data.featuredPreparations
      .filter((p): p is Record<string, unknown> => isObject(p))
      .filter((p) => p.isActive === true || p.isActive === undefined)
      .map((p) => ({
        id: (typeof p.id === 'number' ? p.id : 0) as number,
        name: (p.nameEn || p.nameAr || p.name || '') as string,
        slug: (p.slug || String(p.id || '')) as string,
        description: (p.bioEn || p.bioAr || p.description || '') as string,
      }))
  } else if (Array.isArray(data.preparations)) {
    result.categories = data.preparations
      .filter((p): p is Record<string, unknown> => isObject(p))
      .map((p) => ({
        id: (typeof p.id === 'number' ? p.id : 0) as number,
        name: (p.name || p.nameEn || p.nameAr || '') as string,
        slug: (p.slug || String(p.id || '')) as string,
      }))
  } else if (Array.isArray(data.categories)) {
    result.categories = data.categories
      .filter((c): c is Record<string, unknown> => isObject(c))
      .map((c) => ({
        id: (typeof c.id === 'number' ? c.id : 0) as number,
        name: (c.name || c.nameEn || c.nameAr || '') as string,
        slug: (c.slug || '') as string,
      }))
  }

  // Extract banners
  result.banners = extractBanners(data)

  // Extract providers - check for featureProviders (actual API field)
  if (Array.isArray(data.featureProviders)) {
    result.providers = data.featureProviders
      .filter((p): p is Record<string, unknown> => isObject(p))
      .map((p) => {
        // Try multiple image properties, including publicLogoImageUrl from FeaturedProviderResponse
        const image = (p.publicLogoImageUrl || 
          p.profileURL || 
          p.image || 
          '') as string
        
        return {
          id: String(p.id || ''),
          name: (p.nameEn || p.nameAr || p.name || '') as string,
          image: image,
          profession: (p.serviceClasses || '') as string,
          rating: (typeof p.rate === 'number' ? p.rate : 0) as number,
          verified:
            (p.isVerified === true || p.providerStatus === 'Active') as boolean,
        }
      })
  } else {
    result.providers = extractProviders(data)
  }

  // Extract hero slides (from banners)
  result.heroSlides = extractHeroSlides(data)

  // Extract trust features (USPs)
  result.trustFeatures = extractTrustFeatures(data)

  return result
}

