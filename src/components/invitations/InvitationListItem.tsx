'use client'

import { cn } from '@/lib/utils'
import {
  Send,
  RotateCcw,
  Trash2,
  Eye,
  MoreHorizontal,
  Users,
  Phone,
  CheckCircle2,
  Clock,
  XCircle,
  ScanLine,
  AlertTriangle,
} from 'lucide-react'
import { InvitationStatus } from '@/types/responses/invitation-book-response'
import type { InvitationResponse } from '@/types/responses/invitation-book-response'
import { templateRegistry } from './templates'
import { useState } from 'react'

interface InvitationListItemProps {
  invitation: InvitationResponse
  onSend: (id: number) => void
  onResend: (id: number) => void
  onDelete: (id: number) => void
  onView: (invitation: InvitationResponse) => void
}

const statusConfig: Record<InvitationStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  [InvitationStatus.Draft]: {
    label: 'Draft',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  [InvitationStatus.Sent]: {
    label: 'Sent',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    icon: <Send className="h-3.5 w-3.5" />,
  },
  [InvitationStatus.Confirmed]: {
    label: 'Confirmed',
    color: 'text-green-600',
    bg: 'bg-green-50',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  [InvitationStatus.Declined]: {
    label: 'Declined',
    color: 'text-red-600',
    bg: 'bg-red-50',
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  [InvitationStatus.CheckedIn]: {
    label: 'Checked In',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    icon: <ScanLine className="h-3.5 w-3.5" />,
  },
}

export function InvitationListItem({ invitation, onSend, onResend, onDelete, onView }: InvitationListItemProps) {
  const [showActions, setShowActions] = useState(false)
  const status = statusConfig[invitation.status] ?? statusConfig[InvitationStatus.Draft]
  const initials = invitation.guestName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="group relative flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:border-brand-200 hover:shadow-sm transition-all">
      {/* Avatar */}
      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
        <span className="text-14 font-bold text-brand-700">{initials}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-14 font-semibold text-gray-900 truncate">{invitation.guestName}</h4>
          {invitation.sendFailed && (
            <span className="inline-flex items-center gap-1 text-10 text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full">
              <AlertTriangle className="h-3 w-3" />
              Failed
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-12 text-gray-500 flex-wrap">
          {invitation.guestPhone && (
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {invitation.guestPhone}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" />
            {invitation.numberOfGuests} {invitation.numberOfGuests === 1 ? 'guest' : 'guests'}
          </span>
          {invitation.invitationModelId && (() => {
            const tmpl = templateRegistry.find((t) => t.id === invitation.invitationModelId)
            return (
              <span className="inline-flex items-center gap-1 text-10 text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                {tmpl ? tmpl.name : `Template #${invitation.invitationModelId}`}
              </span>
            )
          })()}
        </div>
      </div>

      {/* Status badge */}
      <div className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-12 font-medium', status.bg, status.color)}>
        {status.icon}
        {status.label}
      </div>

      {/* Actions */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowActions(!showActions)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </button>

        {showActions && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
            <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                type="button"
                onClick={() => { onView(invitation); setShowActions(false) }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-13 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-4 w-4 text-gray-400" />
                View Details
              </button>
              {invitation.status === InvitationStatus.Draft && (
                <button
                  type="button"
                  onClick={() => { onSend(invitation.id); setShowActions(false) }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-13 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Send Invitation
                </button>
              )}
              {(invitation.sendFailed || invitation.status === InvitationStatus.Sent) && (
                <button
                  type="button"
                  onClick={() => { onResend(invitation.id); setShowActions(false) }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-13 text-amber-600 hover:bg-amber-50 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Resend
                </button>
              )}
              <button
                type="button"
                onClick={() => { onDelete(invitation.id); setShowActions(false) }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-13 text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
