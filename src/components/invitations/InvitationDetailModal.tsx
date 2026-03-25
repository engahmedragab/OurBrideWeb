'use client'

import { X, MapPin, Calendar, Phone, Mail, Users, Send, ScanLine, Clock, CheckCircle2, XCircle, Crown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { InvitationStatus } from '@/types/responses/invitation-book-response'
import type { InvitationResponse } from '@/types/responses/invitation-book-response'
import { getTemplateComponent } from './templates'

interface InvitationDetailModalProps {
  invitation: InvitationResponse | null
  isOpen: boolean
  onClose: () => void
  onSend: (id: number) => void
  onResend: (id: number) => void
}

export function InvitationDetailModal({ invitation, isOpen, onClose, onSend, onResend }: InvitationDetailModalProps) {
  if (!isOpen || !invitation) return null

  const formatDate = (date?: string | null) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (date?: string | null) => {
    if (!date) return '—'
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const statusIcon = {
    [InvitationStatus.Draft]: <Clock className="h-5 w-5 text-gray-500" />,
    [InvitationStatus.Sent]: <Send className="h-5 w-5 text-blue-500" />,
    [InvitationStatus.Confirmed]: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    [InvitationStatus.Declined]: <XCircle className="h-5 w-5 text-red-500" />,
    [InvitationStatus.CheckedIn]: <ScanLine className="h-5 w-5 text-purple-500" />,
  }

  const statusLabel = {
    [InvitationStatus.Draft]: 'Draft',
    [InvitationStatus.Sent]: 'Sent',
    [InvitationStatus.Confirmed]: 'Confirmed',
    [InvitationStatus.Declined]: 'Declined',
    [InvitationStatus.CheckedIn]: 'Checked In',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-brand-500 via-brand-400 to-pink-400 px-6 pt-6 pb-10">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          <div className="text-center text-white">
            <p className="text-12 font-medium opacity-80 mb-1">Wedding Invitation</p>
            <h2 className="text-20 font-bold">{invitation.brideName} & {invitation.groomName}</h2>
          </div>
        </div>

        {/* Guest Card - overlaps header */}
        <div className="relative -mt-6 mx-6 bg-white rounded-2xl border border-gray-100 shadow-md p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center flex-shrink-0">
              <span className="text-16 font-bold text-brand-700">
                {invitation.guestName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-16 font-bold text-gray-900 truncate">{invitation.guestName}</h3>
              <div className="flex items-center gap-2 text-13 text-gray-500">
                {statusIcon[invitation.status]}
                <span>{statusLabel[invitation.status]}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-14 font-semibold text-gray-700">
                <Users className="h-4 w-4 text-gray-400" />
                {invitation.numberOfGuests}
              </div>
              <p className="text-10 text-gray-400">guests</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 pb-6 space-y-3 max-h-[50vh] overflow-y-auto">
          {/* Template Preview */}
          {invitation.invitationModelId && (() => {
            const TemplateComp = getTemplateComponent(invitation.invitationModelId)
            return TemplateComp ? (
              <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <TemplateComp
                  brideName={invitation.brideName || ''}
                  groomName={invitation.groomName || ''}
                  guestName={invitation.guestName}
                  weddingDate={invitation.weddingDate}
                  weddinghole={invitation.weddinghole}
                  weddingAddress={invitation.weddingAddress}
                  preview
                />
              </div>
            ) : null
          })()}

          {/* Contact */}
          {(invitation.guestPhone || invitation.guestEmail) && (
            <div className="space-y-2">
              {invitation.guestPhone && (
                <div className="flex items-center gap-2.5 text-13 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {invitation.guestPhone}
                </div>
              )}
              {invitation.guestEmail && (
                <div className="flex items-center gap-2.5 text-13 text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {invitation.guestEmail}
                </div>
              )}
            </div>
          )}

          {/* Event details */}
          <div className="border-t border-gray-100 pt-3 space-y-2">
            {invitation.weddingDate && (
              <div className="flex items-center gap-2.5 text-13 text-gray-600">
                <Calendar className="h-4 w-4 text-brand-400" />
                <span className="font-medium">Wedding:</span> {formatDate(invitation.weddingDate)}
              </div>
            )}
            {invitation.engagementDate && (
              <div className="flex items-center gap-2.5 text-13 text-gray-600">
                <Calendar className="h-4 w-4 text-pink-400" />
                <span className="font-medium">Engagement:</span> {formatDate(invitation.engagementDate)}
              </div>
            )}
            {invitation.hennaDate && (
              <div className="flex items-center gap-2.5 text-13 text-gray-600">
                <Calendar className="h-4 w-4 text-amber-400" />
                <span className="font-medium">Henna:</span> {formatDate(invitation.hennaDate)}
              </div>
            )}
            {invitation.crownDate && (
              <div className="flex items-center gap-2.5 text-13 text-gray-600">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Crown:</span> {formatDate(invitation.crownDate)}
              </div>
            )}
          </div>

          {/* Location */}
          {(invitation.weddinghole || invitation.weddingAddress) && (
            <div className="border-t border-gray-100 pt-3">
              <div className="flex items-start gap-2.5 text-13 text-gray-600">
                <MapPin className="h-4 w-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <div>
                  {invitation.weddinghole && <p className="font-medium">{invitation.weddinghole}</p>}
                  {invitation.weddingAddress && <p className="text-gray-500">{invitation.weddingAddress}</p>}
                  {invitation.area && <p className="text-gray-400">{invitation.area}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t border-gray-100 pt-3 space-y-1.5 text-12 text-gray-400">
            {invitation.sentAt && <p>Sent: {formatDateTime(invitation.sentAt)}</p>}
            {invitation.rsvpAt && <p>RSVP: {formatDateTime(invitation.rsvpAt)}</p>}
            {invitation.rsvpNote && <p className="text-gray-500 italic">"{invitation.rsvpNote}"</p>}
            {invitation.checkedInAt && <p>Checked in: {formatDateTime(invitation.checkedInAt)}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          {invitation.status === InvitationStatus.Draft && (
            <Button
              variant="brand"
              className="flex-1 text-white"
              onClick={() => { onSend(invitation.id); onClose() }}
              type="button"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          )}
          {(invitation.sendFailed || invitation.status === InvitationStatus.Sent) && (
            <Button
              variant="outlineBrand"
              className="flex-1"
              onClick={() => { onResend(invitation.id); onClose() }}
              type="button"
            >
              Resend
            </Button>
          )}
          <Button variant="outline" onClick={onClose} type="button">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
