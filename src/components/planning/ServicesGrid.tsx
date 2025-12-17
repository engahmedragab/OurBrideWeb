'use client'

import type { PreparationService } from '@/types/planning'
import { ServiceCategoryTile } from './ServiceCategoryTile'

export interface ServicesGridProps {
  services: PreparationService[]
  onEdit: (service: PreparationService) => void
  onDelete: (service: PreparationService) => void
}

export const ServicesGrid = ({
  services,
  onEdit,
  onDelete,
}: ServicesGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {services.map(service => (
        <ServiceCategoryTile
          key={service.id}
          service={service}
          onEdit={() => onEdit(service)}
          onDelete={() => onDelete(service)}
        />
      ))}
    </div>
  )
}
