'use client'

import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ServiceLineCategoryResponse } from '@/types/responses'

export interface CategoryCardProps {
  category: ServiceLineCategoryResponse & {
    lineCount?: number
    completedCount?: number
  }
  onClick: () => void
  variant?: 'default' | 'pinned'
  className?: string
}

/**
 * Get category icon based on category name or iconName
 */
const getCategoryIcon = (category: ServiceLineCategoryResponse) => {
  // If category has iconName, we could map it, but for now use default
  return Package
}

export const CategoryCard = ({
  category,
  onClick,
  variant = 'default',
  className,
}: CategoryCardProps) => {
  const Icon = getCategoryIcon(category)
  const categoryName =
    category.name || category.nameEn || category.nameAr || 'Unnamed Category'

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white border rounded-2xl p-6 space-y-3 cursor-pointer hover:shadow-md transition-shadow',
        variant === 'pinned' && 'sticky top-0 z-10',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Icon className="w-5 h-5 text-brand-500" />
            <h3 className="text-18 font-semibold text-gray-900">
              {categoryName}
            </h3>
          </div>

          {category.description && (
            <p className="text-14 text-gray-600 mb-2">{category.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-14 text-gray-600">
            {category.lineCount !== undefined && (
              <div>
                <span className="font-medium">Total:</span>{' '}
                <span>
                  {category.lineCount}{' '}
                  {category.lineCount === 1 ? 'preparation' : 'preparations'}
                </span>
              </div>
            )}
            {category.completedCount !== undefined &&
              category.completedCount > 0 && (
                <div>
                  <span className="font-medium">Completed:</span>{' '}
                  <span className="text-green-600">
                    {category.completedCount}
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
