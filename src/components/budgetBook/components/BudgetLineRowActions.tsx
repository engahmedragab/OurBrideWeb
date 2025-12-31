'use client'

import { CheckCircle2, Heart, Edit2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BudgetLineRowActionsProps {
  isDone: boolean
  isFavorite: boolean
  onToggleDone?: () => void
  onToggleFavorite?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export const BudgetLineRowActions = ({
  isDone,
  isFavorite,
  onEdit,
  onDelete,
}: BudgetLineRowActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      {/* Done (display only) */}
      <span
        className={cn(
          'p-1.5 rounded-lg',
          isDone ? 'text-green-500' : 'text-gray-400'
        )}
        aria-label="Done"
        title="Done"
      >
        <CheckCircle2 className="h-4 w-4" />
      </span>

      {/* Favorite (display only) */}
      <span
        className={cn(
          'p-1.5 rounded-lg',
          isFavorite ? 'text-brand-500' : 'text-gray-400'
        )}
        aria-label="Favorite"
        title="Favorite"
      >
        <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
      </span>

      {/* Edit */}
      {onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          aria-label="Edit"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      )}

      {/* Delete */}
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
