import { useQuery } from '@tanstack/react-query'
import { getServicesHome } from '@/services/api/home.api'
import { extractServicesHomeData } from '@/utils/home-data.utils'
import type { ServiceCardData, ProviderCardData } from '@/components/ui/Card'
import type { HeroSlide } from '@/components/ui/HeroCarousel'
import type { OfferItem } from '@/components/ui/OfferBanner'
import { useIsRTL } from '@/i18n'

export interface ServicesHomeData {
  services: ServiceCardData[]
  offers: ServiceCardData[]
  categories: Array<{
    id: number
    name: string
    slug?: string
    description?: string
    nameEn?: string
    nameAr?: string
  }>
  banners?: OfferItem[]
  providers?: ProviderCardData[]
  heroSlides?: HeroSlide[]
  trustFeatures?: Array<{ title: string; description: string }>
}


export const useServicesHome = (enabled = true) => {
  const isRTL = useIsRTL()
  const lang = isRTL ? 'ar' : 'en'

  return useQuery({
    queryKey: ['services-home', lang],

    queryFn: async (): Promise<ServicesHomeData> => {
      const result = await getServicesHome()
      const extractedData = extractServicesHomeData(result, lang)

      return {
        services: extractedData.services || [],
        offers: extractedData.offers || [],
        categories: extractedData.categories || [],
        banners: extractedData.banners,
        providers: extractedData.providers,
        heroSlides: extractedData.heroSlides,
        trustFeatures: extractedData.trustFeatures,
      }
    },

    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
