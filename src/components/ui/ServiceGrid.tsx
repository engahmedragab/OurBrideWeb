import { Card, type ServiceCardData } from './Card'
import { useServiceCardHandlers } from '@/hooks/services'
import type { Service } from '@/types/service'
import { LoadingSpinner } from './LoadingSpinner'
import { useI18nTranslations } from '@/i18n/hooks'

export interface ServiceGridProps {
  services: Service[]
  onWishlistToggle?: (serviceId: string) => void
  onFavoriteToggle?: (serviceId: string) => void
  onBookNow?: (serviceId: string) => void
  columns?: 2 | 3 | 4
  className?: string
  isLoading?: boolean
}

export const ServiceGrid = ({
  services,
  onWishlistToggle,
  onFavoriteToggle,
  onBookNow,
  columns = 3,
  className,
  isLoading = false,
}: ServiceGridProps) => {
  const tS = useI18nTranslations('services.serviceCategories')
  const tC = useI18nTranslations('common')
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">

        <LoadingSpinner size="lg" text={tS('loading')} />

      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-16 text-gray-500">{tC('noDataAvailable')}</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className || ''}`}>
      {services.map(service => {
        // Inline component to use hooks properly
        const ServiceCardItem = () => {
          const handlers = useServiceCardHandlers(parseInt(service.id, 10))
          const cardData: ServiceCardData = {
            id: service.id,
            image: service.images?.[0]?.trim() || '',
            title: service.title,
            providerName: service.provider.name,
            verified: service.provider.verified,
            rating: service.rating.value,
            originalPrice: service.price.original,
            discountedPrice: service.price.discounted,
            tags: service.tags,
            showTopOfferBadge: service.showTopOfferBadge,
            isWishlisted: service.isWishlisted,
            isFavorite: service.isFavorite,
            onWishlistToggle: handlers.handleWishlistToggle,
            onFavoriteToggle: handlers.handleFavoriteToggle,
            isLoadingWishlist: handlers.isLoadingWishlist,
            isLoadingFavorite: handlers.isLoadingFavorite,
          }
          return <Card cardData={{ type: 'service', ...cardData }} />
        }
        return <ServiceCardItem key={service.id} />
      })}
    </div>
  )
}
