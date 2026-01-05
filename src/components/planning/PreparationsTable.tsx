'use client'

import type { PreparationService } from '@/types/planning'
import { ServiceCell } from './ServiceCell'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/utils'

export interface PreparationsTableProps {
  services: PreparationService[]
  onEdit: (service: PreparationService) => void
  onDelete: (service: PreparationService) => void
}

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
const formatDate = (dateString: string | null | undefined): string => {
  if (
    !dateString ||
    dateString === '0001-01-01' ||
    isNaN(Date.parse(dateString))
  ) {
    return '—'
  }
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  } catch {
    return '—'
  }
}

export const PreparationsTable = ({
  services,
  onEdit,
  onDelete,
}: PreparationsTableProps) => {
  if (services.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <p className="text-14 text-gray-500">No services found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Container with horizontal scroll on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Table Header - Exact styling from Figma */}
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-100 border-r border-gray-100">
                Service
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-100 border-r border-gray-100">
                Status
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-100 border-r border-gray-100">
                Paid
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-100">
                Due
              </th>
            </tr>
          </thead>

          {/* Table Body - Exact row styling from Figma */}
          <tbody className="bg-white">
            {services.map((service, index) => {
              const serviceKey =
                service.icon.kind === 'asset' ? service.icon.value : ''
              const status: 'completed' | 'in-progress' = service.completed
                ? 'completed'
                : 'in-progress'
              const isLastRow = index === services.length - 1

              return (
                <tr
                  key={service.id}
                  className={cn(
                    'hover:bg-gray-50 transition-colors',
                    !isLastRow && 'border-b border-gray-100'
                  )}
                >
                  {/* Service Column */}
                  <td className="px-4 py-4 align-middle border-r border-gray-100">
                    <ServiceCell
                      serviceKey={serviceKey}
                      title={service.title}
                      onEdit={() => onEdit(service)}
                      onDelete={() => onDelete(service)}
                    />
                  </td>

                  {/* Status Column */}
                  <td className="px-4 py-4 align-middle border-r border-gray-100">
                    <StatusBadge status={status} />
                  </td>

                  {/* Paid Column - Exact typography from Figma */}
                  <td className="px-4 py-4 align-middle border-r border-gray-100">
                    <span className="text-14 font-medium text-gray-900">
                      {formatCurrency(service.advancePayment)}
                    </span>
                  </td>

                  {/* Due Column - Exact typography from Figma */}
                  <td className="px-4 py-4 align-middle">
                    <span className="text-14 text-gray-600">
                      {formatDate(service.purchaseDate)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
