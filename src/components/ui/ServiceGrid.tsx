import { Card, type ServiceCardData } from './Card'
import { useServiceCardHandlers } from '@/hooks/services'
import type { Service } from '@/types/service'

export interface ServiceGridProps {
  services: Service[]
  onWishlistToggle?: (serviceId: string) => void
  onFavoriteToggle?: (serviceId: string) => void
  onBookNow?: (serviceId: string) => void
  columns?: 2 | 3 | 4
  className?: string
}

export const ServiceGrid = ({
  services,
  onWishlistToggle,
  onFavoriteToggle,
  onBookNow,
  columns = 3,
  className,
}: ServiceGridProps) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-16 text-gray-500">No services found</p>
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
