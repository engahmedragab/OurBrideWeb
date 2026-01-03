import { useQuery } from '@tanstack/react-query'
import { getServicesHome } from '@/services/api/home.api'
import { extractServicesHomeData } from '@/utils/home-data.utils'
import type { ServiceCardData } from '@/components/ui/Card'
import type { ProviderCardData } from '@/components/ui/Card'
import type { HeroSlide } from '@/components/ui/HeroCarousel'
import type { OfferItem } from '@/components/ui/OfferBanner'

export interface ServicesHomeData {
  services: ServiceCardData[]
  offers: ServiceCardData[]
  categories: Array<{ id: number; name: string; slug?: string; description?: string }>
  banners?: OfferItem[]
  providers?: ProviderCardData[]
  heroSlides?: HeroSlide[]
  trustFeatures?: Array<{ title: string; description: string }>
}

/**
 * Hook to fetch services home data
 */
export const useServicesHome = (enabled = true) => {
  return useQuery({
    queryKey: ['services-home'],
    queryFn: async (): Promise<ServicesHomeData> => {
      try {
        const result = await getServicesHome()
        const extractedData = extractServicesHomeData(result)

        return {
          services: extractedData.services || [],
          offers: extractedData.offers || [],
          categories: extractedData.categories || [],
          banners: extractedData.banners,
          providers: extractedData.providers,
          heroSlides: extractedData.heroSlides,
          trustFeatures: extractedData.trustFeatures,
        }
      } catch (error) {
        throw error
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

