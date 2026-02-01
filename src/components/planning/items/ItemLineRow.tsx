'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { UiItem } from '@/utils/planning/mappers/itemsMappers'
import { CheckCircle2, Circle, Trash2 } from 'lucide-react'
import { useI18nTranslations, useIsRTL } from '@/i18n/hooks'

export function ItemLineRow({
  item,
  onToggleDone,
  onDelete,
  onEdit,
}: {
  item: UiItem
  onToggleDone: () => void
  onDelete: () => void
  onEdit: () => void
}) {
  const t = useI18nTranslations('items')
  const isRtl =  useIsRTL()
 console.log({item})
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onEdit()
      }}
      className={cn('flex items-start gap-3 rounded-xl border bg-white p-4 transition hover:bg-gray-50')}
    >
      {/* Toggle Done */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onToggleDone()
        }}
        className="mt-1 rounded-full p-1 hover:bg-gray-100"
        aria-label="Toggle done"
      >
        {item.isDone ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className={cn('text-sm font-medium text-gray-900', item.isDone && 'line-through text-gray-400')}>
          {isRtl ? item.nameAr : item.nameEn}
        </div>

        {(item.descriptionAr || item.descriptionEn) ? (
          <div className="mt-1 line-clamp-2 text-xs text-gray-500">{isRtl ? item.descriptionAr : item.descriptionEn}</div>
        ) : null}

        {/* Meta: label dark, value gray */}
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          {item.quantity !== undefined ? (
            <span className="inline-flex items-center gap-1">
              <span className=" text-gray-900">{t('itemForm.fields.quantity')} :</span>
              <span className="text-gray-500">{item.quantity}</span>
            </span>
          ) : null}

          {item.totalPrice !== undefined ? (
            <span className="inline-flex items-center gap-1">
              <span className=" text-gray-900">{t('itemForm.fields.totalPrice')} :</span>
              <span className="text-gray-500">{item.totalPrice}</span>
            </span>
          ) : null}

          {item.providerName ? (
            <span className="inline-flex items-center gap-1">
              <span className=" text-gray-900">{t('itemForm.fields.providerName')} :</span>
              <span className="text-gray-500">{item.providerName}</span>
            </span>
          ) : null}

          {item.buyDate ? (
            <span className="inline-flex items-center gap-1">
              <span className=" text-gray-900">{t('itemForm.fields.buyDate')} :</span>
              <span className="text-gray-500">{item.buyDate}</span>
            </span>
          ) : null}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            item.isDone ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700',
          )}
        >
          {item.isDone ? t('itemForm.checkbox.completed') : t('itemForm.checkbox.stillOnTheWay')}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
          className="rounded-lg p-2 hover:bg-gray-100"
          aria-label="Delete item"
        >
          <Trash2 className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  )
}
