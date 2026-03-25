'use client'

import { Mail, Send, Plus, ChevronRight } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/Button'
import { useI18nTranslations } from '@/i18n/hooks'

export interface InvitationsOverviewProps {
  eventId?: number
  guestCount?: number
}

export const InvitationsOverview = ({ eventId, guestCount = 0 }: InvitationsOverviewProps) => {
  const t = useI18nTranslations('eventsPlanning')
  const tCards = useI18nTranslations('eventsPlanning.cards')
  const router = useRouter()

  const handleNavigate = () => {
    if (eventId) {
      router.push(`/events/planning/invitations?eventId=${eventId}`)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header with badge */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50">
            <Mail className="w-4 h-4 text-brand-500" />
          </div>
          <div>
            <h2 className="text-14 font-semibold text-gray-900">
              {tCards('invitations.title') || 'Invitations'}
            </h2>
          </div>
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-12 font-medium text-brand-600">
          <Send className="w-3 h-3" />
          {tCards('invitations.badge') || 'New'}
        </span>
      </div>

      {/* Intro description */}
      <div className="px-4 pb-3">
        <p className="text-13 text-gray-500 leading-relaxed">
          {tCards('invitations.description') || 'Create and send beautiful digital wedding invitations to your guests. Manage RSVPs and track who\'s coming.'}
        </p>
      </div>

      {/* Stats row */}
      {guestCount > 0 && (
        <div className="mx-4 mb-3 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
          <span className="text-12 text-gray-600">
            {tCards('guests.invitedGuests') || 'Invited Guests'}
          </span>
          <span className="text-14 font-semibold text-gray-900">
            {guestCount}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        <Button
          variant="brand"
          size="md"
          onClick={handleNavigate}
          disabled={!eventId}
          className="w-full flex items-center justify-center gap-2 rounded-xl !text-white text-14"
          type="button"
        >
          <Plus className="h-4 w-4" />
          {tCards('invitations.createButton') || 'Create Invitation'}
        </Button>
        <button
          type="button"
          onClick={handleNavigate}
          disabled={!eventId}
          className="w-full flex items-center justify-center gap-1 text-12 font-medium text-brand-500 hover:text-brand-600 transition-colors py-1.5"
        >
          {tCards('invitations.manageButton') || 'Manage Invitations'}
          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
        </button>
      </div>
    </div>
  )
}
