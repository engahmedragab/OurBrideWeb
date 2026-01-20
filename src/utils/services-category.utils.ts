/**
 * Utilities for mapping services category API responses
 */

import type { Service } from '@/types/service'
import type { ProductCategory } from '@/types/product'
import type { ServiceResponse } from '@/types/responses/service-response'
import type { PreparationResponse } from '@/types/responses/preparation-response'
import { pickLocalizedText } from './translation/i18nText'

/**
 * Type guard to check if value is an object
 */
const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Map API service response to Service type
 */
export const mapServiceResponseToService = (
  service: ServiceResponse | Record<string, unknown>,
  locale: string,
  preparationId?: number,
  preparationName?: string,
  preparationSlug?: string
): Service => {
  const serviceObj = service as ServiceResponse & Record<string, unknown>

  // ✅ Get service name (localized)
  const name = pickLocalizedText(locale, {
    en: (serviceObj.nameEn as string) ?? '',
    ar: (serviceObj.nameAr as string) ?? '',
    fallback: (serviceObj.name as string) ?? '',
  })

  // ✅ Get description (localized)
  const description = pickLocalizedText(locale, {
    en: (serviceObj.descriptionEn as string) ?? '',
    ar: (serviceObj.descriptionAr as string) ?? '',
    fallback: (serviceObj.description as string) ?? '',
  })

  // Get images
  const images: string[] = []
  if (serviceObj.imageUrl) {
    images.push(serviceObj.imageUrl as string)
  }
  if (Array.isArray(serviceObj.medias)) {
    const mediaUrls = serviceObj.medias
      .filter(isObject)
      .map((m) => {
        const media = m as unknown as Record<string, unknown>
        return (media.url || media.thumbnailUrl || media.previewUrl || '') as string
      })
      .filter(Boolean)
    images.push(...mediaUrls)
  }

  // Get provider
  const provider = serviceObj.provider as
    | {
        id?: number
        name?: string
        nameEn?: string
        nameAr?: string
        providerStatus?: string
        isVerified?: boolean
        profileURL?: string
        serviceClasses?: string
        rate?: number
      }
    | null

  // ✅ Provider name (localized)
  const providerName = pickLocalizedText(locale, {
    en: (provider?.nameEn as string) ?? '',
    ar: (provider?.nameAr as string) ?? '',
    fallback: (provider?.name as string) ?? '',
  })

  const verified =
    provider?.isVerified === true || provider?.providerStatus === 'Active' || false

  // Get provider image
  const providerImage = provider?.profileURL || undefined

  // Get provider profession from serviceClasses
  const profession = provider?.serviceClasses
    ? provider.serviceClasses.split(',').slice(0, 2).join(', ')
    : undefined

  // Get provider rating
  const providerRating = typeof provider?.rate === 'number' ? provider.rate : undefined

  // Get rating
  const ratingValue =
    typeof serviceObj.rating === 'number'
      ? serviceObj.rating
      : typeof serviceObj.rate === 'number'
        ? serviceObj.rate
        : 0

  const ratingCount =
    typeof serviceObj.reviews === 'number'
      ? serviceObj.reviews
      : Array.isArray(serviceObj.reviews)
        ? serviceObj.reviews.length
        : 0

  // Get prices
  const priceType = (serviceObj.priceType as string) || 'Fixed'
  const directPrice = typeof serviceObj.price === 'number' ? serviceObj.price : null
  const rentPrice = typeof serviceObj.rentPrice === 'number' ? serviceObj.rentPrice : null
  const buyPrice = typeof serviceObj.buyPrice === 'number' ? serviceObj.buyPrice : null
  const saleRentPrice =
    typeof serviceObj.saleRentPrice === 'number' ? serviceObj.saleRentPrice : null
  const saleBuyPrice =
    typeof serviceObj.saleBuyPrice === 'number' ? serviceObj.saleBuyPrice : null

  let originalPrice = 0
  let discountedPrice = 0

  if (priceType === 'Rent') {
    originalPrice = rentPrice || directPrice || 0
    discountedPrice = saleRentPrice || originalPrice
  } else {
    originalPrice = buyPrice || directPrice || 0
    discountedPrice = saleBuyPrice || originalPrice
  }

  // Get tags
  const tags: string[] = []
  if (serviceObj.class) tags.push(String(serviceObj.class))
  if (serviceObj.type) tags.push(String(serviceObj.type))

  // Get availability (1 = Active)
  const available =
    (typeof serviceObj.serviceStatus === 'number' && serviceObj.serviceStatus === 1) ||
    serviceObj.isAvailable === true ||
    false

  // Get availability days
  const availableDaysOfWeek = serviceObj.availableDaysOfWeek as number | null
  const availabilityDays = {
    monday: availableDaysOfWeek ? (availableDaysOfWeek & 1) !== 0 : true,
    tuesday: availableDaysOfWeek ? (availableDaysOfWeek & 2) !== 0 : true,
    wednesday: availableDaysOfWeek ? (availableDaysOfWeek & 4) !== 0 : true,
    thursday: availableDaysOfWeek ? (availableDaysOfWeek & 8) !== 0 : true,
    friday: availableDaysOfWeek ? (availableDaysOfWeek & 16) !== 0 : true,
    saturday: availableDaysOfWeek ? (availableDaysOfWeek & 32) !== 0 : true,
    sunday: availableDaysOfWeek ? (availableDaysOfWeek & 64) !== 0 : true,
  }

  // Get category info
  const categoryId = preparationId ? String(preparationId) : String(serviceObj.preparationId || '')
  const categoryName = preparationName || ''
  const categorySlug = preparationSlug || String(serviceObj.preparationId || '')

  return {
    id: String(serviceObj.id || ''),
    title: name.trim(),
    description: description.trim(),
    images: images.length > 0 ? images : [''],
    provider: {
      id: String(provider?.id || ''),
      name: providerName.trim(),
      verified,
      image: providerImage,
      profession,
      rating: providerRating,
    },
    price: {
      original: originalPrice,
      discounted: discountedPrice,
      currency: 'egp',
    },
    rating: {
      value: ratingValue,
      count: ratingCount,
    },
    category: {
      id: categoryId,
      name: categoryName,
      slug: categorySlug,
    },
    tags,
    available,
    availabilityDays,
    isWishlisted: serviceObj.isWishlist === true,
    isFavorite: serviceObj.isFavorite === true,
    showTopOfferBadge: serviceObj.isFeatured === true,
    createdAt: serviceObj.creationDate as string | undefined,
    updatedAt: serviceObj.lastModifiedDate as string | undefined,
  }
}

/**
 * Map API preparation response to ProductCategory type
 */
export const mapPreparationToCategory = (
  preparation: PreparationResponse | Record<string, unknown>,
  locale: string
): ProductCategory => {
  const prep = preparation as PreparationResponse & Record<string, unknown>

  const name = pickLocalizedText(locale, {
    en: (prep.nameEn as string) ?? '',
    ar: (prep.nameAr as string) ?? '',
    fallback: (prep.name as string) ?? '',
  })

  const slug = String(prep.slug ?? prep.id ?? '')

  const description = pickLocalizedText(locale, {
    en: (prep.bioEn as string) ?? (prep.descriptionEn as string) ?? '',
    ar: (prep.bioAr as string) ?? (prep.descriptionAr as string) ?? '',
    fallback: (prep.bio as string) ?? (prep.description as string) ?? '',
  })

  const serviceCount = Array.isArray(prep.services) ? prep.services.length : 0

  return {
    id: String(prep.id ?? ''),
    name: name.trim(),
    slug,
    description: description.trim(),
    image: prep.imageUrl as string | undefined,
    productCount: serviceCount,
  }
}

/**
 * Extract services and categories from preparations API response
 */
export const extractServicesCategoryData = (apiResponse: unknown, locale: string) => {
  const result: { services?: Service[]; categories?: ProductCategory[] } = {}

  const responseObj = isObject(apiResponse) ? apiResponse : {}
  const data = (isObject(responseObj.data) ? responseObj.data : responseObj) as Record<
    string,
    unknown
  >

  // Extract preparations array
  let preparations: Array<Record<string, unknown>> = []

  if (Array.isArray(data)) {
    preparations = data.filter((p): p is Record<string, unknown> => isObject(p))
  } else if (Array.isArray(data.preparations)) {
    preparations = data.preparations.filter((p): p is Record<string, unknown> => isObject(p))
  } else if (Array.isArray(data.data)) {
    preparations = data.data.filter((p): p is Record<string, unknown> => isObject(p))
  }

  const categories: ProductCategory[] = []
  const allServices: Service[] = []

  preparations.forEach((preparation) => {
    if (preparation.isActive !== false) {
      const category = mapPreparationToCategory(preparation, locale)
      categories.push(category)

      if (Array.isArray(preparation.services)) {
        const services = preparation.services
          .filter((s): s is Record<string, unknown> => isObject(s))
          .map((s) =>
            mapServiceResponseToService(
              s,
              locale,
              typeof preparation.id === 'number' ? preparation.id : undefined,
              category.name, // ✅ localized category name
              category.slug
            )
          )
        allServices.push(...services)
      }
    }
  })

  result.categories = categories
  result.services = allServices
  return result
}
