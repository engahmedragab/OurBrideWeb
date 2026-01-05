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
        const resultAny = result as any

        // Extract packages from response
        let packages: ServicePackage[] = []

        if (Array.isArray(resultAny)) {
          packages = resultAny.map((pkg: any) => ({
            id: String(pkg.id || ''),
            name: pkg.name || pkg.nameEn || pkg.nameAr || '',
            description:
              pkg.description || pkg.descriptionEn || pkg.descriptionAr,
            price: pkg.price || pkg.salePrice || 0,
            originalPrice: pkg.originalPrice || pkg.buyPrice || pkg.rentPrice,
            currency: pkg.currency || 'egp',
            features: pkg.features || pkg.includedServices || [],
            duration: pkg.duration || pkg.validityPeriod,
            images: pkg.images || (pkg.imageUrl ? [pkg.imageUrl] : []),
          }))
        } else if (resultAny?.data && Array.isArray(resultAny.data)) {
          packages = resultAny.data.map((pkg: any) => ({
            id: String(pkg.id || ''),
            name: pkg.name || pkg.nameEn || pkg.nameAr || '',
            description:
              pkg.description || pkg.descriptionEn || pkg.descriptionAr,
            price: pkg.price || pkg.salePrice || 0,
            originalPrice: pkg.originalPrice || pkg.buyPrice || pkg.rentPrice,
            currency: pkg.currency || 'egp',
            features: pkg.features || pkg.includedServices || [],
            duration: pkg.duration || pkg.validityPeriod,
            images: pkg.images || (pkg.imageUrl ? [pkg.imageUrl] : []),
          }))
        } else if (resultAny?.packages && Array.isArray(resultAny.packages)) {
          packages = resultAny.packages.map((pkg: any) => ({
            id: String(pkg.id || ''),
            name: pkg.name || pkg.nameEn || pkg.nameAr || '',
            description:
              pkg.description || pkg.descriptionEn || pkg.descriptionAr,
            price: pkg.price || pkg.salePrice || 0,
            originalPrice: pkg.originalPrice || pkg.buyPrice || pkg.rentPrice,
            currency: pkg.currency || 'egp',
            features: pkg.features || pkg.includedServices || [],
            duration: pkg.duration || pkg.validityPeriod,
            images: pkg.images || (pkg.imageUrl ? [pkg.imageUrl] : []),
          }))
        }

        return { packages }
      } catch (error) {
        return { packages: [] }
      }
    },
    enabled: enabled && !isNaN(parsedServiceId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
