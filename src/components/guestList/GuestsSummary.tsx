'use client'

import { User } from 'lucide-react'
import type { GuestSide } from './mockGuests'
import { useI18nTranslations } from '@/i18n/hooks'

interface GuestsSummaryProps {
  side: GuestSide
  invitationsCount: number
  peopleTotal: number
} 

export const GuestsSummary = ({ side, invitationsCount, peopleTotal }: GuestsSummaryProps) => {
  const t = useI18nTranslations('eventsPlanning.guestList')
  const personName = side === 'bride' ? t('tabs.bride') : t('tabs.groom')
  const role = side === 'bride' ? 'Bride' : 'Groom'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <h3 className="text-16 font-semibold text-gray-900">{personName}</h3>
            {/* <p className="text-14 text-gray-600">{role}</p> */}
          </div>
        </div>

        <div className="text-right">
          <p className="text-16 font-semibold text-gray-900">{invitationsCount} {t('summary.guestsCount')}</p>
          <p className="text-14 text-gray-600">{peopleTotal} {t('summary.totalPeople')}</p>
        </div>
      </div>
    </div>
  )
}
