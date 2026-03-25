'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  MapPin,
  Calendar,
  Users,
  Heart,
  CheckCircle2,
  XCircle,
  QrCode,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui'
import { useViewInvitation, useSubmitRsvp } from '@/hooks/invitationBooks'
import { InvitationStatus } from '@/types/responses/invitation-book-response'
import { getTemplateComponent } from '@/components/invitations/templates'

export default function WeddingInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50">
          <LoadingSpinner text="Loading your invitation..." />
        </div>
      }
    >
      <WeddingInvitationContent />
    </Suspense>
  )
}

function WeddingInvitationContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const { data: invitation, isLoading, error } = useViewInvitation(token)
  const rsvpMutation = useSubmitRsvp()

  const [rsvpNote, setRsvpNote] = useState('')
  const [rsvpGuests, setRsvpGuests] = useState<number | undefined>(undefined)
  const [showRsvpForm, setShowRsvpForm] = useState(false)
  const [showQr, setShowQr] = useState(false)

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <div className="text-center">
          <Heart className="h-12 w-12 text-brand-300 mx-auto mb-4" />
          <h1 className="text-20 font-bold text-gray-700">Invalid Invitation Link</h1>
          <p className="text-14 text-gray-400 mt-2">Please check the link you received.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <LoadingSpinner text="Loading your invitation..." />
      </div>
    )
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <div className="text-center px-6">
          <Heart className="h-12 w-12 text-brand-300 mx-auto mb-4" />
          <h1 className="text-20 font-bold text-gray-700">Invitation Not Found</h1>
          <p className="text-14 text-gray-400 mt-2">
            {error instanceof Error ? error.message : 'This invitation may have expired or been removed.'}
          </p>
        </div>
      </div>
    )
  }

  const handleRsvp = (status: 'Confirmed' | 'Declined') => {
    rsvpMutation.mutate(
      {
        token,
        data: {
          status: status as any,
          note: rsvpNote || undefined,
          numberOfGuests: rsvpGuests,
        },
      },
      {
        onSuccess: () => {
          setShowRsvpForm(false)
        },
      }
    )
  }

  const formatDate = (date?: string | null) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (date?: string | null) => {
    if (!date) return null
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isResponded = invitation.status === InvitationStatus.Confirmed || invitation.status === InvitationStatus.Declined

  // Resolve template component if the invitation has a model/template ID
  const TemplateComponent = invitation.invitationModelId
    ? getTemplateComponent(invitation.invitationModelId)
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      {/* ──── Template Card (if a template was selected) ──────────────────────── */}
      {TemplateComponent ? (
        <div className="max-w-lg mx-auto px-6 pt-8 pb-4">
          <div className="rounded-3xl overflow-hidden shadow-xl shadow-brand-100/30 border border-brand-100/50">
            <TemplateComponent
              brideName={invitation.brideName || ''}
              groomName={invitation.groomName || ''}
              guestName={invitation.guestName}
              weddingDate={invitation.weddingDate}
              engagementDate={invitation.engagementDate}
              hennaDate={invitation.hennaDate}
              weddinghole={invitation.weddinghole}
              weddingAddress={invitation.weddingAddress}
              area={invitation.area}
              mapsLink={invitation.mapsLink}
              numberOfGuests={invitation.numberOfGuests}
            />
          </div>
        </div>
      ) : (
        /* ──── Default Decorative Top ──────────────────────────────────────────── */
        <div className="relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-brand-100/30 blur-3xl" />
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-pink-100/40 blur-2xl" />
          <div className="absolute top-20 right-20 h-20 w-20 rounded-full bg-amber-100/40 blur-xl" />

          <div className="relative max-w-lg mx-auto px-6 pt-12 pb-8 text-center">
            {/* Ornamental line */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-brand-300" />
              <Heart className="h-5 w-5 text-brand-400" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-brand-300" />
            </div>

            <p className="text-13 font-medium text-brand-500 uppercase tracking-[0.25em] mb-3">
              You are cordially invited to
            </p>
            <p className="text-13 text-gray-400 mb-2">the wedding celebration of</p>

            {/* Couple Names */}
            <div className="mb-4">
              <h1 className="text-32 font-bold text-gray-900 leading-tight">
                {invitation.brideName}
              </h1>
              <div className="flex items-center justify-center gap-3 my-2">
                <div className="h-px w-8 bg-brand-300" />
                <span className="text-16 text-brand-400 font-medium">&</span>
                <div className="h-px w-8 bg-brand-300" />
              </div>
              <h1 className="text-32 font-bold text-gray-900 leading-tight">
                {invitation.groomName}
              </h1>
            </div>

            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-brand-200" />
              <div className="h-1.5 w-1.5 rounded-full bg-brand-300" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-brand-200" />
            </div>
          </div>
        </div>
      )}

      {/* ──── Guest Welcome Card ──────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto px-6 mb-6">
        <div className="bg-white rounded-3xl shadow-lg shadow-brand-100/30 border border-brand-100/50 p-6 text-center">
          <p className="text-13 text-gray-400 mb-1">Dear</p>
          <h2 className="text-20 font-bold text-gray-900 mb-2">{invitation.guestName}</h2>
          <div className="inline-flex items-center gap-1.5 text-13 text-gray-500 bg-gray-50 px-4 py-1.5 rounded-full">
            <Users className="h-3.5 w-3.5 text-gray-400" />
            Party of {invitation.numberOfGuests}
          </div>
        </div>
      </div>

      {/* ──── Event Details Cards ─────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto px-6 space-y-4 mb-6">
        {/* Wedding Date */}
        {invitation.weddingDate && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-brand-100 to-pink-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-brand-500" />
              </div>
              <div>
                <p className="text-11 font-medium text-brand-500 uppercase tracking-wider mb-0.5">Wedding Day</p>
                <p className="text-16 font-bold text-gray-900">{formatDate(invitation.weddingDate)}</p>
                <p className="text-14 text-gray-500">{formatTime(invitation.weddingDate)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Engagement */}
        {invitation.engagementDate && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                <Heart className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <p className="text-11 font-medium text-pink-500 uppercase tracking-wider mb-0.5">Engagement</p>
                <p className="text-16 font-bold text-gray-900">{formatDate(invitation.engagementDate)}</p>
                <p className="text-14 text-gray-500">{formatTime(invitation.engagementDate)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Henna */}
        {invitation.hennaDate && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <Heart className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-11 font-medium text-amber-500 uppercase tracking-wider mb-0.5">Henna Night</p>
                <p className="text-16 font-bold text-gray-900">{formatDate(invitation.hennaDate)}</p>
                <p className="text-14 text-gray-500">{formatTime(invitation.hennaDate)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Crown */}
        {invitation.crownDate && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center">
                <Heart className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-11 font-medium text-yellow-600 uppercase tracking-wider mb-0.5">Crown Ceremony</p>
                <p className="text-16 font-bold text-gray-900">{formatDate(invitation.crownDate)}</p>
                <p className="text-14 text-gray-500">{formatTime(invitation.crownDate)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Venue */}
        {(invitation.weddinghole || invitation.weddingAddress) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-brand-500" />
              </div>
              <div className="flex-1">
                <p className="text-11 font-medium text-brand-500 uppercase tracking-wider mb-0.5">Venue</p>
                {invitation.weddinghole && (
                  <p className="text-16 font-bold text-gray-900">{invitation.weddinghole}</p>
                )}
                {invitation.weddingAddress && (
                  <p className="text-14 text-gray-500">{invitation.weddingAddress}</p>
                )}
                {invitation.area && (
                  <p className="text-13 text-gray-400">{invitation.area}</p>
                )}
                {invitation.mapsLink && (
                  <a
                    href={invitation.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-13 font-medium text-brand-500 hover:text-brand-600 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View on Maps
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ──── RSVP Section ────────────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto px-6 mb-6">
        <div className="bg-white rounded-3xl shadow-lg shadow-brand-100/30 border border-brand-100/50 p-6">
          {isResponded && !rsvpMutation.isSuccess ? (
            <div className="text-center py-4">
              <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full mb-3 ${
                invitation.status === InvitationStatus.Confirmed ? 'bg-green-50' : 'bg-red-50'
              }`}>
                {invitation.status === InvitationStatus.Confirmed ? (
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500" />
                )}
              </div>
              <p className={`text-16 font-bold ${
                invitation.status === InvitationStatus.Confirmed ? 'text-green-600' : 'text-red-600'
              }`}>
                {invitation.status === InvitationStatus.Confirmed ? 'You have confirmed!' : 'You have declined'}
              </p>
              {invitation.rsvpNote && (
                <p className="text-13 text-gray-500 mt-2 italic">"{invitation.rsvpNote}"</p>
              )}
              <button
                type="button"
                onClick={() => setShowRsvpForm(true)}
                className="text-13 text-brand-500 hover:text-brand-600 mt-3 underline"
              >
                Change response
              </button>
            </div>
          ) : rsvpMutation.isSuccess ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-3">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-16 font-bold text-green-600">Response submitted!</p>
              <p className="text-13 text-gray-400 mt-1">Thank you for responding.</p>
            </div>
          ) : (
            <>
              <h3 className="text-16 font-bold text-gray-900 text-center mb-1">RSVP</h3>
              <p className="text-13 text-gray-400 text-center mb-5">Will you be joining us?</p>

              {showRsvpForm ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-12 font-medium text-gray-600 mb-1.5 block">Number of guests</label>
                    <input
                      type="number"
                      value={rsvpGuests ?? invitation.numberOfGuests}
                      onChange={(e) => setRsvpGuests(Number(e.target.value))}
                      min={1}
                      max={20}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-14 focus:border-brand-300 focus:ring-1 focus:ring-brand-200 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-12 font-medium text-gray-600 mb-1.5 block">Note (optional)</label>
                    <textarea
                      value={rsvpNote}
                      onChange={(e) => setRsvpNote(e.target.value)}
                      placeholder="Looking forward to it!"
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-14 focus:border-brand-300 focus:ring-1 focus:ring-brand-200 outline-none transition-colors resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="success"
                      className="flex-1 text-white"
                      onClick={() => handleRsvp('Confirmed')}
                      disabled={rsvpMutation.isPending}
                      type="button"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      {rsvpMutation.isPending ? 'Sending...' : 'Accept'}
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 text-white"
                      onClick={() => handleRsvp('Declined')}
                      disabled={rsvpMutation.isPending}
                      type="button"
                    >
                      <XCircle className="h-4 w-4 mr-1.5" />
                      Decline
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="success"
                    className="flex-1 text-white"
                    onClick={() => setShowRsvpForm(true)}
                    type="button"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 text-white"
                    onClick={() => handleRsvp('Declined')}
                    disabled={rsvpMutation.isPending}
                    type="button"
                  >
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Decline
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ──── QR Code Section ─────────────────────────────────────────────────── */}
      {invitation.qrPayload && (
        <div className="max-w-lg mx-auto px-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="inline-flex items-center gap-2 text-13 font-medium text-brand-500 hover:text-brand-600 transition-colors"
            >
              <QrCode className="h-4 w-4" />
              {showQr ? 'Hide QR Code' : 'Show QR Code for Check-In'}
            </button>
            {showQr && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <div className="h-48 w-48 mx-auto bg-white rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-2" />
                    <p className="text-10 text-gray-400">QR Code</p>
                    <p className="text-8 text-gray-300 font-mono mt-1 break-all px-2">
                      {invitation.uniqueToken?.slice(0, 20)}...
                    </p>
                  </div>
                </div>
                <p className="text-11 text-gray-400 mt-3">
                  Show this QR code at the entrance for check-in
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──── Footer ──────────────────────────────────────────────────────────── */}
      <div className="text-center pb-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-gray-200" />
          <Heart className="h-4 w-4 text-brand-300" />
          <div className="h-px w-8 bg-gray-200" />
        </div>
        <p className="text-12 text-gray-300">With love and joy</p>
      </div>
    </div>
  )
}
