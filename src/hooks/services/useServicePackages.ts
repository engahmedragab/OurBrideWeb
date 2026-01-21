import { useQuery } from '@tanstack/react-query'
import { getServicePackages } from '@/services/api/serviceApi'

export interface ServicePackage {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  currency: string
  features?: string[]
  duration?: string
  images?: string[]
}

export interface ServicePackagesData {
  packages: ServicePackage[]
}

export const useServicePackages = (serviceId: string, enabled = true) => {
  const parsedServiceId = parseInt(serviceId, 10)

  return useQuery({
    queryKey: ['service-packages', serviceId],
    queryFn: async (): Promise<ServicePackagesData> => {
      if (isNaN(parsedServiceId)) {
        return { packages: [] }
      }
      try {
        const result = await getServicePackages(parsedServiceId)
        const resultAny = result as unknown as Record<string, unknown> | unknown[]
        
        // Extract packages from response
        let packages: ServicePackage[] = []
        
        type PackageResponse = {
          id?: number | string
          name?: string
          nameEn?: string
          nameAr?: string
          description?: string
          descriptionEn?: string
          descriptionAr?: string
          price?: number
          salePrice?: number
          originalPrice?: number
          buyPrice?: number
          rentPrice?: number
          currency?: string
          features?: string[]
          includedServices?: string[]
          duration?: string | number
          validityPeriod?: string | number
          images?: string[]
          imageUrl?: string
        }
        
        if (Array.isArray(resultAny)) {
          packages = resultAny.map((pkg: unknown) => {
            const pkgTyped = pkg as PackageResponse
            const durationValue = pkgTyped.duration || pkgTyped.validityPeriod
            return {
              id: String(pkgTyped.id || ''),
              name: pkgTyped.name || pkgTyped.nameEn || pkgTyped.nameAr || '',
              description: pkgTyped.description || pkgTyped.descriptionEn || pkgTyped.descriptionAr,
              price: pkgTyped.price || pkgTyped.salePrice || 0,
              originalPrice: pkgTyped.originalPrice || pkgTyped.buyPrice || pkgTyped.rentPrice,
              currency: pkgTyped.currency || 'egp',
              features: pkgTyped.features || pkgTyped.includedServices || [],
              duration: typeof durationValue === 'string' ? durationValue : (typeof durationValue === 'number' ? String(durationValue) : undefined),
              images: pkgTyped.images || (pkgTyped.imageUrl ? [pkgTyped.imageUrl] : []),
            }
          })
        } else if (resultAny && typeof resultAny === 'object' && 'data' in resultAny && Array.isArray(resultAny.data)) {
          packages = (resultAny.data as unknown[]).map((pkg: unknown) => {
            const pkgTyped = pkg as PackageResponse
            const durationValue = pkgTyped.duration || pkgTyped.validityPeriod
            return {
              id: String(pkgTyped.id || ''),
              name: pkgTyped.name || pkgTyped.nameEn || pkgTyped.nameAr || '',
              description: pkgTyped.description || pkgTyped.descriptionEn || pkgTyped.descriptionAr,
              price: pkgTyped.price || pkgTyped.salePrice || 0,
              originalPrice: pkgTyped.originalPrice || pkgTyped.buyPrice || pkgTyped.rentPrice,
              currency: pkgTyped.currency || 'egp',
              features: pkgTyped.features || pkgTyped.includedServices || [],
              duration: typeof durationValue === 'string' ? durationValue : (typeof durationValue === 'number' ? String(durationValue) : undefined),
              images: pkgTyped.images || (pkgTyped.imageUrl ? [pkgTyped.imageUrl] : []),
            }
          })
        } else if (resultAny && typeof resultAny === 'object' && 'packages' in resultAny && Array.isArray(resultAny.packages)) {
          packages = (resultAny.packages as unknown[]).map((pkg: unknown) => {
            const pkgTyped = pkg as PackageResponse
            const durationValue = pkgTyped.duration || pkgTyped.validityPeriod
            return {
              id: String(pkgTyped.id || ''),
              name: pkgTyped.name || pkgTyped.nameEn || pkgTyped.nameAr || '',
              description: pkgTyped.description || pkgTyped.descriptionEn || pkgTyped.descriptionAr,
              price: pkgTyped.price || pkgTyped.salePrice || 0,
              originalPrice: pkgTyped.originalPrice || pkgTyped.buyPrice || pkgTyped.rentPrice,
              currency: pkgTyped.currency || 'egp',
              features: pkgTyped.features || pkgTyped.includedServices || [],
              duration: typeof durationValue === 'string' ? durationValue : (typeof durationValue === 'number' ? String(durationValue) : undefined),
              images: pkgTyped.images || (pkgTyped.imageUrl ? [pkgTyped.imageUrl] : []),
            }
          })
        }
        
        return { packages }
      } catch {
        return { packages: [] }
      }
    },
    enabled: enabled && !isNaN(parsedServiceId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

