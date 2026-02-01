'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight, Trash2 } from 'lucide-react'
import type { UiTodoCategory } from '@/utils/planning/mappers/todoMappers'
import { useI18nTranslations } from '@/i18n'

const STYLE_BY_COLOR: Record<string, { bg: string; border: string }> = {
  gray: { bg: 'bg-gray-50', border: 'border-gray-200' },
  red: { bg: 'bg-red-50', border: 'border-red-200' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200' },
  green: { bg: 'bg-green-50', border: 'border-green-200' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200' },
}

export function TodoListRow({
  category,
  active,
  onClick,
  onDelete,
}: {
  category: UiTodoCategory
  active?: boolean
  onClick?: () => void
  onDelete?: () => void
}) {
  const t = useI18nTranslations('todo')

  const key = category.color ?? 'gray'
  const style = STYLE_BY_COLOR[key] ?? STYLE_BY_COLOR.gray

  const itemLabel =
    category.lineCount === 1 ? t('listRow.item_one') : t('listRow.item_other')

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-lg border px-3 py-3 text-left transition hover:brightness-[0.98]',
        style.bg,
        style.border,
        active ? 'ring-1 ring-gray-900/20' : ''
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-gray-900">{category.name}</div>
          {(category.lineCount !== undefined || category.completedCount !== undefined) && (
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              {category.lineCount !== undefined && (
                <span>
                  {category.lineCount} {itemLabel}
                </span>
              )}
              {category.completedCount !== undefined && category.completedCount > 0 && (
                <span className="text-green-600">
                  {t('listRow.completedCount', { count: category.completedCount })}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {onDelete ? (
            <span
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDelete()
              }}
              className="rounded-md p-2 hover:bg-white/60"
              role="button"
              aria-label={t('listRow.deleteListAria')}
            >
              <Trash2 className="h-4 w-4 text-primary" />
            </span>
          ) : null}

          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </button>
  )
}
