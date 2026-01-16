'use client'

import { RowActionsMenu } from './RowActionsMenu'
import { cn } from '@/lib/utils'
import { getServiceIcon, getServiceIconByClass } from '@/utils/serviceIconMapper'

export interface ServiceCellProps {
  serviceKey: string // iconName or "class:X" format from the line
  title: string
  onView?: () => void
  onEdit: () => void
  onDelete: () => void
  className?: string
}

export const ServiceCell = ({
  serviceKey, // This can be iconName or "class:X" format
  title,
  onView,
  onEdit,
  onDelete,
  className,
}: ServiceCellProps) => {
  // Check if serviceKey is in "class:X" format (from serviceClass)
  let IconComponent
  if (serviceKey.startsWith('class:')) {
    const serviceClass = parseInt(serviceKey.replace('class:', ''), 10)
    IconComponent = getServiceIconByClass(serviceClass)
  } else {
    // Use getServiceIcon to convert iconName to icon component
    // If serviceKey is empty, use title to determine icon
    const iconName = serviceKey || title
    IconComponent = getServiceIcon(iconName)
  }

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
        <RowActionsMenu onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  )
}

