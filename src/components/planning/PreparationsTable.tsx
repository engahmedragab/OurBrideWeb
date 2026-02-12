'use client'

import type { PreparationService } from '@/types/planning'
import { ServiceCell } from './ServiceCell'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/utils'
import { useI18nTranslations, useI18nLocale, useIsRTL } from '@/i18n'

export interface PreparationsTableProps {
  services: PreparationService[]
  onView?: (service: PreparationService) => void
  onEdit: (service: PreparationService) => void
  onDelete: (service: PreparationService) => void
  onRowClick?: (service: PreparationService) => void
}

// Format currency - locale-aware
const formatCurrency = (amount: number, locale: string): string => {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date - locale-aware
const formatDate = (dateString: string | null | undefined, locale: string): string => {
  if (!dateString || dateString === '0001-01-01' || isNaN(Date.parse(dateString))) {
    return '—'
  }
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
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
  onView,
  onEdit,
  onDelete,
  onRowClick,
}: PreparationsTableProps) => {
  const t = useI18nTranslations('eventsPlanning.preparations.table')
  const locale = useI18nLocale()
  const isRTL = useIsRTL()

  if (services.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <p className="text-14 text-gray-500">{t('noServices')}</p>
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
              <th className={cn(
                "px-4 py-3 text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-100",
                isRTL ? "text-right border-l border-gray-100" : "text-left border-r border-gray-100"
              )}>
                {t('service')}
              </th>
              <th className={cn(
                "px-4 py-3 text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-100",
                isRTL ? "text-right border-l border-gray-100" : "text-left border-r border-gray-100"
              )}>
                {t('status')}
              </th>
              <th className={cn(
                "px-4 py-3 text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-100",
                isRTL ? "text-right border-l border-gray-100" : "text-left border-r border-gray-100"
              )}>
                {t('paid')}
              </th>
              <th className={cn(
                "px-4 py-3 text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-100",
                isRTL ? "text-right" : "text-left"
              )}>
                {t('due')}
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
                  <td className={cn(
                    "px-4 py-4 align-middle",
                    isRTL ? "border-l border-gray-100" : "border-r border-gray-100"
                  )}>
                    <ServiceCell
                      serviceKey={serviceKey}
                      title={service.title}
                      onView={onView ? () => onView(service) : undefined}
                      onEdit={() => onEdit(service)}
                      onDelete={() => onDelete(service)}
                    />
                  </td>

                  {/* Status Column */}
                  <td className={cn(
                    "px-4 py-4 align-middle",
                    isRTL ? "border-l border-gray-100" : "border-r border-gray-100"
                  )}>
                    <StatusBadge status={status} />
                  </td>

                  {/* Paid Column - Exact typography from Figma */}
                  <td className={cn(
                    "px-4 py-4 align-middle",
                    isRTL ? "border-l border-gray-100" : "border-r border-gray-100"
                  )}>
                    <span className="text-14 font-medium text-gray-900">
                      {formatCurrency(service.advancePayment, locale)}
                    </span>
                  </td>

                  {/* Due Column - Exact typography from Figma */}
                  <td className="px-4 py-4 align-middle">
                    <span className="text-14 text-gray-600">
                      {formatDate(service.purchaseDate, locale)}
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

