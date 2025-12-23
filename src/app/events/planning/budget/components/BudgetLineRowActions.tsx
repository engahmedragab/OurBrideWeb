'use client'

import { CheckCircle2, Heart, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
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
  onToggleDone,
  onToggleFavorite,
  onEdit,
  onDelete,
}: BudgetLineRowActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      {onToggleDone && (
        <button
          onClick={onToggleDone}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            isDone
              ? 'text-green-500 hover:bg-green-50'
              : 'text-gray-400 hover:bg-gray-100'
          )}
          aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
        >
          <CheckCircle2 className="h-4 w-4" />
        </button>
      )}
      {onToggleFavorite && (
        <button
          onClick={onToggleFavorite}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            isFavorite
              ? 'text-brand-500 hover:bg-brand-50'
              : 'text-gray-400 hover:bg-gray-100'
          )}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={cn('h-4 w-4', isFavorite && 'fill-current')}
          />
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          aria-label="Edit"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

