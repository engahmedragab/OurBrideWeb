'use client'

import type { PreparationService } from '@/types/planning'
import { ServiceCell } from './ServiceCell'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/utils'
import { useI18nTranslations, useIsRTL } from '@/i18n'

export interface PreparationsTableProps {
  services: PreparationService[]
  onView?: (service: PreparationService) => void
  onEdit: (service: PreparationService) => void
  onDelete: (service: PreparationService) => void
  onRowClick?: (service: PreparationService) => void
}

export const PreparationsTable = ({
  services,
  onView,
  onEdit,
  onDelete,
  onRowClick,
}: PreparationsTableProps) => {
  const t = useI18nTranslations('preparations')
  const isRtl = useIsRTL()

  const locale = isRtl ? 'ar-EG' : 'en-US'
  const currency = 'USD'

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
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
      return new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date)
    } catch {
      return '—'
    }
  }

  console.log({ services })
  if (services.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <p className="text-14 text-gray-500">{t('table.noServices')}</p>
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
                {t('table.columns.service')}
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-100 border-r border-gray-100">
                {t('table.columns.status')}
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-100 border-r border-gray-100">
                {t('table.columns.paid')}
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-100">
                {t('table.columns.due')}
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
                  onClick={() => onRowClick?.(service)}
                  className={cn(
                    'hover:bg-gray-50 transition-colors',
                    !isLastRow && 'border-b border-gray-100',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {/* Service Column */}
                  <td className="px-4 py-4 align-middle border-r border-gray-100">
                    <ServiceCell
                      serviceKey={serviceKey}
                      title={isRtl ? service.titleAr : service.titleEn}
                      onView={onView ? () => onView(service) : undefined}
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
