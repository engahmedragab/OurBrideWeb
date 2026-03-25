'use client'

import { useMemo, useState, useEffect, Suspense, useCallback } from 'react'
import {
  Plus,
  Send,
  ScanLine,
  RefreshCw,
  Wand2,
  Search,
  Palette,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui'
import { useToast } from '@/components/ui/Toaster'
import { useEventId } from '@/hooks/planning'
import { useGuestBook } from '@/hooks/guestBooks'
import {
  useInvitationBook,
  useInvitationStats,
  useInvitations,
  useInitInvitationBook,
  useCreateInvitationsFromGuestBook,
  useCreateInvitation,
  useDeleteInvitation,
  useSendInvitation,
  useSendAllInvitations,
  useResendInvitation,
  useCheckInGuest,
} from '@/hooks/invitationBooks'
import {
  InvitationStatsCards,
  InvitationSideTabs,
  InvitationStatusFilter,
  InvitationListItem,
  InvitationDetailModal,
  SendInvitationDialog,
  AddInvitationDialog,
  CreateFromGuestBookDialog,
  QrCheckInScanner,
  TemplateManagement,
  type InvitationSideFilter,
  type StatusFilter,
  type AddInvitationFormData,
} from '@/components/invitations'
import { InvitationStatus } from '@/types/responses/invitation-book-response'
import type { InvitationResponse } from '@/types/responses/invitation-book-response'
import { GuestRelevant } from '@/types/responses/book-enums'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'

export default function InvitationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner text="Loading invitations..." />
        </div>
      }
    >
      <InvitationsPageContent />
    </Suspense>
  )
}

function InvitationsPageContent() {
  const { addToast } = useToast()
  const eventId = useEventId()
  const [isMounted, setIsMounted] = useState(false)

  // Filters
  const [activeSide, setActiveSide] = useState<InvitationSideFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Dialogs
  const [showCreateFromGuestBook, setShowCreateFromGuestBook] = useState(false)
  const [showAddInvitation, setShowAddInvitation] = useState(false)
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [showSendBulk, setShowSendBulk] = useState(false)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [selectedInvitation, setSelectedInvitation] = useState<InvitationResponse | null>(null)
  const [sendTargetId, setSendTargetId] = useState<number | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)

  useEffect(() => { setIsMounted(true) }, [])

  const queryParams = {
    eventId: eventId || undefined,
    userType: undefined as unknown as UserType | undefined,
    clientId: undefined as unknown as string | undefined,
  }

  // Data
  const { data: invitationBook, isLoading: bookLoading, refetch: refetchBook } = useInvitationBook({
    ...queryParams,
    enabled: isMounted && !!eventId,
  })

  const { data: stats, refetch: refetchStats } = useInvitationStats({
    ...queryParams,
    enabled: isMounted && !!eventId && !!invitationBook,
  })

  const { data: invitations = [], isLoading: listLoading, refetch: refetchList } = useInvitations({
    ...queryParams,
    enabled: isMounted && !!eventId && !!invitationBook,
  })

  const { data: guestBook } = useGuestBook({
    eventId: eventId || undefined,
    enabled: isMounted && !!eventId,
  })

  // Mutations
  const initMutation = useInitInvitationBook()
  const createFromGuestBookMutation = useCreateInvitationsFromGuestBook()
  const createMutation = useCreateInvitation()
  const deleteMutation = useDeleteInvitation()
  const sendMutation = useSendInvitation()
  const sendAllMutation = useSendAllInvitations()
  const resendMutation = useResendInvitation()
  const checkInMutation = useCheckInGuest()

  // Auto-init if no book
  useEffect(() => {
    if (isMounted && eventId && !bookLoading && !invitationBook && !initMutation.isPending) {
      initMutation.mutate(queryParams, {
        onSuccess: () => {
          refetchBook()
          addToast('Invitation book initialized', 'success')
        },
        onError: (err) => {
          addToast(err.message || 'Failed to initialize', 'error')
        },
      })
    }
  }, [isMounted, eventId, bookLoading, invitationBook])

  // ─── Filtered invitations ────────────────────────────────────────────────────

  const filteredInvitations = useMemo(() => {
    let result = invitations

    // Side filter
    if (activeSide === 'bride') {
      result = result.filter((inv) => inv.guestRelevant === GuestRelevant.Bride)
    } else if (activeSide === 'groom') {
      result = result.filter((inv) => inv.guestRelevant === GuestRelevant.Groom)
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((inv) => inv.status === statusFilter)
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (inv) =>
          inv.guestName.toLowerCase().includes(q) ||
          inv.guestPhone?.toLowerCase().includes(q)
      )
    }

    return result
  }, [invitations, activeSide, statusFilter, searchQuery])

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleRefresh = useCallback(() => {
    refetchBook()
    refetchStats()
    refetchList()
    addToast('Refreshed', 'success')
  }, [refetchBook, refetchStats, refetchList, addToast])

  const handleCreateFromGuestBook = (data: { occasionId?: number; invitationModelId?: number; guestLineCategoryIds?: number[] }) => {
    createFromGuestBookMutation.mutate(
      { data, query: queryParams },
      {
        onSuccess: () => {
          setShowCreateFromGuestBook(false)
          handleRefresh()
          addToast('Invitations created from guest book!', 'success')
        },
        onError: (err) => addToast(err.message, 'error'),
      }
    )
  }

  const handleAddInvitation = (formData: AddInvitationFormData) => {
    if (!invitationBook) return
    createMutation.mutate(
      {
        data: {
          bookId: invitationBook.id,
          guestName: formData.guestName,
          guestPhone: formData.guestPhone || undefined,
          numberOfGuests: formData.numberOfGuests,
          brideName: formData.brideName || undefined,
          groomName: formData.groomName || undefined,
          weddingDate: formData.weddingDate ? new Date(formData.weddingDate).toISOString() : undefined,
          engagementDate: formData.engagementDate ? new Date(formData.engagementDate).toISOString() : undefined,
          hennaDate: formData.hennaDate ? new Date(formData.hennaDate).toISOString() : undefined,
          crownDate: formData.crownDate ? new Date(formData.crownDate).toISOString() : undefined,
          weddinghole: formData.weddinghole || undefined,
          weddingAddress: formData.weddingAddress || undefined,
          area: formData.area || undefined,
          mapsLink: formData.mapsLink || undefined,
          invitationModelId: formData.invitationModelId || undefined,
        },
        query: queryParams,
      },
      {
        onSuccess: () => {
          setShowAddInvitation(false)
          handleRefresh()
          addToast('Invitation created', 'success')
        },
        onError: (err) => addToast(err.message, 'error'),
      }
    )
  }

  const handleSend = (id: number) => {
    setSendTargetId(id)
    setShowSendDialog(true)
  }

  const handleSendConfirm = (channel: string, customMessage?: string) => {
    if (sendTargetId) {
      sendMutation.mutate(
        { id: sendTargetId, data: { channel, customMessage } },
        {
          onSuccess: () => {
            setShowSendDialog(false)
            setSendTargetId(null)
            handleRefresh()
            addToast('Invitation sent!', 'success')
          },
          onError: (err) => addToast(err.message, 'error'),
        }
      )
    }
  }

  const handleSendAll = (channel: string) => {
    sendAllMutation.mutate(queryParams, {
      onSuccess: () => {
        setShowSendBulk(false)
        handleRefresh()
        addToast('All invitations sent!', 'success')
      },
      onError: (err) => addToast(err.message, 'error'),
    })
  }

  const handleResend = (id: number) => {
    resendMutation.mutate(
      { id, data: { channel: 'whatsapp' } },
      {
        onSuccess: () => {
          handleRefresh()
          addToast('Invitation resent', 'success')
        },
        onError: (err) => addToast(err.message, 'error'),
      }
    )
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      { id, query: queryParams },
      {
        onSuccess: () => {
          handleRefresh()
          addToast('Invitation deleted', 'info')
        },
        onError: (err) => addToast(err.message, 'error'),
      }
    )
  }

  const handleCheckIn = async (qrPayload: string) => {
    return await checkInMutation.mutateAsync({ qrPayload })
  }

  // ─── Loading States ──────────────────────────────────────────────────────────

  if (!isMounted || bookLoading || initMutation.isPending) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner
          size="lg"
          text={initMutation.isPending ? 'Setting up your invitation book...' : 'Loading invitations...'}
          fullScreen
        />
      </div>
    )
  }

  if (!invitationBook) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-16 text-gray-500 mb-4">Could not load invitation book.</p>
        <Button variant="brand" onClick={() => refetchBook()} className="text-white" type="button">
          Retry
        </Button>
      </div>
    )
  }

  // ─── Get default wedding details from invitation models or first invitation ─

  const firstInv = invitations[0]
  const defaults: Partial<AddInvitationFormData> = firstInv
    ? {
        brideName: firstInv.brideName,
        groomName: firstInv.groomName,
        weddingDate: firstInv.weddingDate?.slice(0, 16),
        weddinghole: firstInv.weddinghole || '',
        weddingAddress: firstInv.weddingAddress || '',
        area: firstInv.area || '',
        mapsLink: firstInv.mapsLink || '',
      }
    : {}

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* ──── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-24 font-bold text-gray-900">Wedding Invitations</h1>
          <p className="text-13 text-gray-500 mt-0.5">
            Manage, send, and track your wedding invitations
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* ──── Stats ───────────────────────────────────────────────────────────── */}
      {stats && <InvitationStatsCards stats={stats} activeSide={activeSide} />}

      {/* ──── Action Buttons ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Button
          variant="brand"
          size="md"
          onClick={() => setShowCreateFromGuestBook(true)}
          className="text-white"
          type="button"
        >
          <Wand2 className="h-4 w-4 mr-1.5" />
          Create from Guest Book
        </Button>
        <Button
          variant="outlineBrand"
          size="md"
          onClick={() => setShowAddInvitation(true)}
          type="button"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Manual
        </Button>
        {invitations.length > 0 && (
          <Button
            variant="outlineBrand"
            size="md"
            onClick={() => setShowSendBulk(true)}
            type="button"
          >
            <Send className="h-4 w-4 mr-1.5" />
            Send All
          </Button>
        )}
        <Button
          variant="outline"
          size="md"
          onClick={() => setShowCheckIn(true)}
          type="button"
        >
          <ScanLine className="h-4 w-4 mr-1.5" />
          Check-In
        </Button>
        <Button
          variant={showTemplates ? 'brand' : 'outline'}
          size="md"
          onClick={() => setShowTemplates((v) => !v)}
          className={showTemplates ? 'text-white' : ''}
          type="button"
        >
          <Palette className="h-4 w-4 mr-1.5" />
          Browse Templates
        </Button>
      </div>

      {/* ──── Template Management ──────────────────────────────────────────── */}
      {showTemplates && (
        <div className="mb-6 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <TemplateManagement />
        </div>
      )}

      {/* ──── Filters ─────────────────────────────────────────────────────────── */}
      <InvitationSideTabs active={activeSide} onChange={setActiveSide} />
      <InvitationStatusFilter active={statusFilter} onChange={setStatusFilter} />

      {/* ──── Search ──────────────────────────────────────────────────────────── */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by guest name or phone..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-14 text-gray-700 placeholder:text-gray-400 focus:border-brand-300 focus:ring-1 focus:ring-brand-200 outline-none transition-colors"
        />
      </div>

      {/* ──── Invitation List ─────────────────────────────────────────────────── */}
      {listLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner text="Loading invitations..." />
        </div>
      ) : filteredInvitations.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-50 mb-4">
            <Send className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-16 font-semibold text-gray-700 mb-1">
            {invitations.length === 0 ? 'No invitations yet' : 'No matching invitations'}
          </h3>
          <p className="text-13 text-gray-400 mb-5 max-w-sm mx-auto">
            {invitations.length === 0
              ? 'Create invitations from your guest book or add them manually.'
              : 'Try adjusting your filters or search query.'}
          </p>
          {invitations.length === 0 && (
            <Button
              variant="brand"
              onClick={() => setShowCreateFromGuestBook(true)}
              className="text-white"
              type="button"
            >
              <Wand2 className="h-4 w-4 mr-1.5" />
              Create from Guest Book
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-12 text-gray-400 mb-2">
            {filteredInvitations.length} invitation{filteredInvitations.length !== 1 ? 's' : ''}
          </p>
          {filteredInvitations.map((inv) => (
            <InvitationListItem
              key={inv.id}
              invitation={inv}
              onSend={handleSend}
              onResend={handleResend}
              onDelete={handleDelete}
              onView={setSelectedInvitation}
            />
          ))}
        </div>
      )}

      {/* ──── Dialogs ─────────────────────────────────────────────────────────── */}
      <CreateFromGuestBookDialog
        isOpen={showCreateFromGuestBook}
        onClose={() => setShowCreateFromGuestBook(false)}
        onSubmit={handleCreateFromGuestBook}
        isPending={createFromGuestBookMutation.isPending}
        categories={(guestBook as any)?.lineCategories?.filter((c: any) => !c.isDeleted) || []}
      />

      <AddInvitationDialog
        isOpen={showAddInvitation}
        onClose={() => setShowAddInvitation(false)}
        onSubmit={handleAddInvitation}
        isPending={createMutation.isPending}
        defaults={defaults}
      />

      <SendInvitationDialog
        isOpen={showSendDialog}
        onClose={() => { setShowSendDialog(false); setSendTargetId(null) }}
        onSend={handleSendConfirm}
        guestName={sendTargetId ? invitations.find((i) => i.id === sendTargetId)?.guestName : undefined}
        isPending={sendMutation.isPending}
      />

      <SendInvitationDialog
        isOpen={showSendBulk}
        onClose={() => setShowSendBulk(false)}
        onSend={handleSendAll}
        isBulk
        isPending={sendAllMutation.isPending}
      />

      <InvitationDetailModal
        invitation={selectedInvitation}
        isOpen={!!selectedInvitation}
        onClose={() => setSelectedInvitation(null)}
        onSend={handleSend}
        onResend={handleResend}
      />

      <QrCheckInScanner
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        onCheckIn={handleCheckIn}
      />
    </div>
  )
}
