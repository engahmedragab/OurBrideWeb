'use client'

import { useMemo } from 'react'
import {
  Users,
  Send,
  CheckCircle2,
  XCircle,
  ScanLine,
  FileText,
  AlertTriangle,
  Heart,
} from 'lucide-react'
import type { InvitationStatsResponse } from '@/types/responses/invitation-book-response'

interface StatsCardsProps {
  stats: InvitationStatsResponse
  activeSide: 'all' | 'bride' | 'groom'
}

interface StatItem {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  bgColor: string
}

export function InvitationStatsCards({ stats, activeSide }: StatsCardsProps) {
  const items: StatItem[] = useMemo(() => {
    if (activeSide === 'bride') {
      return [
        { label: 'Total Invitations', value: stats.brideTotalInvitations, icon: <FileText className="h-5 w-5" />, color: 'text-brand-600', bgColor: 'bg-brand-50' },
        { label: 'Sent', value: stats.brideSentCount, icon: <Send className="h-5 w-5" />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { label: 'Confirmed', value: stats.brideConfirmedCount, icon: <CheckCircle2 className="h-5 w-5" />, color: 'text-green-600', bgColor: 'bg-green-50' },
        { label: 'Declined', value: stats.brideDeclinedCount, icon: <XCircle className="h-5 w-5" />, color: 'text-red-600', bgColor: 'bg-red-50' },
        { label: 'Checked In', value: stats.brideCheckedInCount, icon: <ScanLine className="h-5 w-5" />, color: 'text-purple-600', bgColor: 'bg-purple-50' },
        { label: 'Expected Guests', value: stats.brideExpectedGuests, icon: <Users className="h-5 w-5" />, color: 'text-amber-600', bgColor: 'bg-amber-50' },
      ]
    }
    if (activeSide === 'groom') {
      return [
        { label: 'Total Invitations', value: stats.groomTotalInvitations, icon: <FileText className="h-5 w-5" />, color: 'text-brand-600', bgColor: 'bg-brand-50' },
        { label: 'Sent', value: stats.groomSentCount, icon: <Send className="h-5 w-5" />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { label: 'Confirmed', value: stats.groomConfirmedCount, icon: <CheckCircle2 className="h-5 w-5" />, color: 'text-green-600', bgColor: 'bg-green-50' },
        { label: 'Declined', value: stats.groomDeclinedCount, icon: <XCircle className="h-5 w-5" />, color: 'text-red-600', bgColor: 'bg-red-50' },
        { label: 'Checked In', value: stats.groomCheckedInCount, icon: <ScanLine className="h-5 w-5" />, color: 'text-purple-600', bgColor: 'bg-purple-50' },
        { label: 'Expected Guests', value: stats.groomExpectedGuests, icon: <Users className="h-5 w-5" />, color: 'text-amber-600', bgColor: 'bg-amber-50' },
      ]
    }
    return [
      { label: 'Total Invitations', value: stats.totalInvitations, icon: <FileText className="h-5 w-5" />, color: 'text-brand-600', bgColor: 'bg-brand-50' },
      { label: 'Expected Guests', value: stats.totalExpectedGuests, icon: <Users className="h-5 w-5" />, color: 'text-amber-600', bgColor: 'bg-amber-50' },
      { label: 'Sent', value: stats.sentCount, icon: <Send className="h-5 w-5" />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      { label: 'Confirmed', value: stats.confirmedCount, icon: <CheckCircle2 className="h-5 w-5" />, color: 'text-green-600', bgColor: 'bg-green-50' },
      { label: 'Declined', value: stats.declinedCount, icon: <XCircle className="h-5 w-5" />, color: 'text-red-600', bgColor: 'bg-red-50' },
      { label: 'Checked In', value: stats.checkedInCount, icon: <ScanLine className="h-5 w-5" />, color: 'text-purple-600', bgColor: 'bg-purple-50' },
      { label: 'Draft', value: stats.draftCount, icon: <Heart className="h-5 w-5" />, color: 'text-gray-600', bgColor: 'bg-gray-50' },
      { label: 'Failed', value: stats.sendFailedCount, icon: <AlertTriangle className="h-5 w-5" />, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    ]
  }, [stats, activeSide])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-12 font-medium text-gray-500 mb-1">{item.label}</p>
              <p className="text-24 font-bold text-gray-900">{item.value}</p>
            </div>
            <div className={`${bgColor(item)} rounded-xl p-2.5`}>
              <span className={item.color}>{item.icon}</span>
            </div>
          </div>
          {/* Decorative gradient bar */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${gradientColor(item)}`} />
        </div>
      ))}
    </div>
  )
}

function bgColor(item: StatItem) {
  return item.bgColor
}

function gradientColor(item: StatItem) {
  if (item.color.includes('brand')) return 'bg-gradient-to-r from-brand-400 to-brand-600'
  if (item.color.includes('blue')) return 'bg-gradient-to-r from-blue-400 to-blue-600'
  if (item.color.includes('green')) return 'bg-gradient-to-r from-green-400 to-green-600'
  if (item.color.includes('red')) return 'bg-gradient-to-r from-red-400 to-red-600'
  if (item.color.includes('purple')) return 'bg-gradient-to-r from-purple-400 to-purple-600'
  if (item.color.includes('amber')) return 'bg-gradient-to-r from-amber-400 to-amber-600'
  if (item.color.includes('orange')) return 'bg-gradient-to-r from-orange-400 to-orange-600'
  return 'bg-gradient-to-r from-gray-300 to-gray-500'
}
