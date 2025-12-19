import { ServiceCard } from './ServiceCard'
import type { Service } from '@/types/service'

export interface ServiceGridProps {
  services: Service[]
  onWishlistToggle?: (serviceId: string) => void
  onBookNow?: (serviceId: string) => void
  columns?: 2 | 3 | 4
  className?: string
}

export const ServiceGrid = ({
  services,
  onWishlistToggle,
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
      {services.map(service => (
        <ServiceCard
          key={service.id}
          service={service}
          onWishlistToggle={onWishlistToggle}
          onBookNow={onBookNow}
        />
      ))}
    </div>
  )
}
