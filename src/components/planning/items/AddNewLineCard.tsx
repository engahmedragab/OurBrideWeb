'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AddNewLineCard({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-xl border border-dashed bg-white p-4 text-left transition hover:bg-gray-50',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
          <Plus className="h-4 w-4 text-primary" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">Add new item</div>
          <div className="text-xs text-gray-500">
            Create a new line in this list
          </div>
        </div>
      </div>
    </button>
  )
}
