'use client'

import { SERVICE_OPTIONS } from './ServiceSelect'
import { RowActionsMenu } from './RowActionsMenu'
import { cn } from '@/lib/utils'

export interface ServiceCellProps {
  serviceKey: string
  title: string
  onEdit: () => void
  onDelete: () => void
  className?: string
}

export const ServiceCell = ({
  serviceKey,
  title,
  onEdit,
  onDelete,
  className,
}: ServiceCellProps) => {
  const service = SERVICE_OPTIONS.find(s => s.serviceKey === serviceKey)
  const IconComponent = service?.Icon

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Icon Container - Soft pink background matching Figma */}
      {IconComponent && (
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
          <IconComponent className="w-5 h-5 text-brand-500" />
        </div>
      )}

      {/* Service Name - Exact typography from Figma */}
      <span className="flex-1 text-14 font-medium text-gray-900 truncate">
        {title}
      </span>

      {/* Actions Menu */}
      <div className="flex-shrink-0">
        <RowActionsMenu onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  )
}

