'use client'

import { useState, useMemo, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LoadingOverlay } from '@/components/ui'
import { useToast } from '@/components/ui/Toaster'
import { useEventId } from '@/hooks/planning'
import { useNoteBook, useNoteSyncMutation, useInitNoteBooks } from '@/hooks/notes/noteBooks.hooks'

import { NoteCategoriesSidebar } from '@/components/notesBook/NoteCategoriesSidebar'
import NoteMainPanel from '@/components/notesBook/NoteMainPanel'
import { AddEditNoteModal } from '@/components/notesBook/AddEditNoteModal'

import { generateTempId } from '@/utils/noteAdapters'
import type { NoteBookDraft } from '@/utils/noteAdapters'

import type { NoteBookRequest } from '@/../client/common/api/gen/ourbride-api'
import type { NoteLineResponse } from '@/types/responses'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'

function NotesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToast } = useToast()
  const eventId = useEventId()

  // ✅ query params (never null)
  const userType = useMemo(() => {
    const v = searchParams?.get('userType')
    if (v && ['Bride', 'Groom', 'WeddingPlanner'].includes(v)) return v as UserType
    return undefined
  }, [searchParams])

  const clientId = useMemo(() => {
    const v = searchParams?.get('clientId')
    return v && v.trim() ? v.trim() : undefined
  }, [searchParams])

  const normalizedQuery = useMemo(() => {
    const q: any = {}
    if (eventId) q.eventId = eventId
    if (userType) q.userType = userType
    if (clientId) q.clientId = clientId
    return Object.keys(q).length ? q : undefined
  }, [eventId, userType, clientId])

  // Local draft state
  const [localDraft, setLocalDraft] = useState<NoteBookDraft | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const isInitialLoadRef = useRef(true)

  // ✅ يمنع double save من المودال (سبب التكرار غالبًا)
  const modalSaveLock = useRef(false)

  // ✅ Selected NOTE (list) state
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<NoteLineResponse | null>(null)

  const { data: noteBook, isLoading, refetch } = useNoteBook(normalizedQuery, {
    enabled: typeof window !== 'undefined' && !!eventId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const syncMutation = useNoteSyncMutation()
  const initMutation = useInitNoteBooks()

  // Initial load from API
  useEffect(() => {
    if (isInitialLoadRef.current && noteBook && !localDraft) {
      const draft = noteBook as any as NoteBookDraft
      setLocalDraft(draft)
      isInitialLoadRef.current = false

      const firstActive = (draft.lines || []).find((l: any) => !l.isDeleted)
      setSelectedNoteId(firstActive?.id ?? null)
    }
  }, [noteBook, localDraft])

  // Keep local state in sync if no unsaved changes
  useEffect(() => {
    if (!noteBook) return
    if (hasUnsavedChanges) return
    if (isInitialLoadRef.current) return

    const draft = noteBook as any as NoteBookDraft
    setLocalDraft(draft)

    const active = (draft.lines || []).filter((l: any) => !l.isDeleted)
    if (!active.length) {
      setSelectedNoteId(null)
      return
    }

    const stillExists = active.some((l: any) => l.id === selectedNoteId)
    if (!stillExists) setSelectedNoteId(active[0].id ?? null)
  }, [noteBook, hasUnsavedChanges, selectedNoteId])

  /**
   * Ensure book is initialized before sync
   */
  const ensureBookInitialized = useCallback(async (): Promise<number> => {
    if (!eventId) throw new Error('Event ID is required')

    const currentId = localDraft?.id
    if (typeof currentId === 'number' && currentId > 0) return currentId

    await initMutation.mutateAsync({
      eventId,
      userType,
      clientId,
    })

    const fresh = await refetch()
    const freshId = (fresh.data as any)?.id

    if (typeof freshId === 'number' && freshId > 0) {
      const draft = fresh.data as any as NoteBookDraft
      setLocalDraft(draft)
      return freshId
    }

    throw new Error('Failed to initialize note book: no ID returned')
  }, [eventId, localDraft?.id, initMutation, userType, clientId, refetch])

  /**
   * ✅ Build payload minimal
   */
  const buildSyncPayload = useCallback((draft: NoteBookDraft): NoteBookRequest => {
    const now = new Date().toISOString()
    const d: any = draft as any

    if (!d.id || d.id <= 0) {
      throw new Error('Invalid note book id. Make sure the book is initialized and fetched first.')
    }

    const bookId = d.id as number

    const lines = (d.lines || []).map((l: any) => {
      const isTemp = typeof l.id === 'number' && l.id <= 0

      return {
        id: isTemp ? 0 : (l.id ?? 0),
        isDone: l.isDone ?? false,
        isFavorite: l.isFavorite ?? false,
        isDeleted: l.isDeleted ?? false,
        isModelLine: l.isModelLine ?? false,

        brideId: l.brideId ?? d.brideId ?? null,
        groomId: l.groomId ?? d.groomId ?? null,

        bookId,
        creationDate: l.creationDate ?? now,
        lastModifiedDate: l.lastModifiedDate ?? now,

        title: l.title ?? '',
        note: l.note ?? '',
      }
    })

    return {
      id: bookId,
      groomId: d.groomId ?? null,
      brideId: d.brideId ?? null,
      weddingPlannerId: d.weddingPlannerId ?? null,

      bookType: d.bookType,
      bookClass: d.bookClass,

      title: d.title ?? null,
      description: d.description ?? null,

      createdBy: d.createdBy ?? d.brideId ?? null,
      lastModifiedBy: d.lastModifiedBy ?? d.brideId ?? null,

      isModelsAdd: d.isModelsAdd ?? false,
      isBookInit: d.isBookInit ?? true,
      isDeleted: d.isDeleted ?? false,
      count: d.count ?? 0,

      creationDate: d.creationDate ?? now,
      lastModifiedDate: now,

      lines,
      slug: d.slug ?? '',
    } as any as NoteBookRequest
  }, [])

  const syncDraft = useCallback(async (draft: NoteBookDraft) => {
    if (!draft) return

    const bookId = await ensureBookInitialized()

    const draftWithId: NoteBookDraft = { ...draft, id: bookId }
    const payload = buildSyncPayload(draftWithId)

    if (!payload.id || payload.id <= 0) throw new Error('Payload book id is invalid')
    for (const line of payload.lines || []) {
      if (line.bookId !== payload.id) throw new Error(`Line "${line.title || 'untitled'}" has wrong bookId`)
    }

    await syncMutation.mutateAsync({
      ...payload,
      query: normalizedQuery,
    })

    const fresh = await refetch()
    if (fresh.data) {
      const updated = fresh.data as any as NoteBookDraft
      setLocalDraft(updated)

      // حاول تحافظ على الاختيار لو لسه موجود
      const active = (updated.lines || []).filter((l: any) => !l.isDeleted)
      if (!active.length) {
        setSelectedNoteId(null)
      } else {
        const still = active.some((l: any) => l.id === selectedNoteId)
        setSelectedNoteId(still ? selectedNoteId : (active[0]?.id ?? null))
      }
    }

    addToast('Notes saved successfully', 'success')
    setHasUnsavedChanges(false)
  }, [ensureBookInitialized, buildSyncPayload, syncMutation, normalizedQuery, refetch, addToast, selectedNoteId])

  const updateDraft = useCallback((updater: (d: NoteBookDraft) => NoteBookDraft) => {
    setLocalDraft(prev => {
      if (!prev) return prev
      const next = updater(prev)
      setHasUnsavedChanges(true)
      return next
    })
  }, [])

  const activeNotes = useMemo(() => {
    return (localDraft?.lines || []).filter((l: any) => !l.isDeleted)
  }, [localDraft])

  const selectedNote = useMemo(() => {
    if (!selectedNoteId) return null
    return (localDraft?.lines || []).find((l: any) => l.id === selectedNoteId && !l.isDeleted) ?? null
  }, [localDraft, selectedNoteId])

  const handleAddNew = useCallback(() => {
    setEditingNote(null)
    setIsModalOpen(true)
  }, [])

  const handleEdit = useCallback(() => {
    if (!selectedNote) return
    setEditingNote(selectedNote)
    setIsModalOpen(true)
  }, [selectedNote])

  const handleDelete = useCallback((note: NoteLineResponse) => {
    const now = new Date().toISOString()

    updateDraft(draft => {
      const next: any = { ...draft }
      next.lines = (next.lines || []).map((l: any) => {
        if (l.id === note.id) return { ...l, isDeleted: true, lastModifiedDate: now }
        return l
      })
      next.lastModifiedDate = now
      return next
    })

    const remaining = activeNotes.filter(n => n.id !== note.id)
    setSelectedNoteId(remaining[0]?.id ?? null)
  }, [updateDraft, activeNotes])

  // ✅ Modal save (FIX: lock + prevent double add)
  const handleSaveFromModal = useCallback((data: { title: string; note: string }) => {
    if (modalSaveLock.current) return
    modalSaveLock.current = true

    try {
      const now = new Date().toISOString()
      const title = data.title.trim()
      const note = data.note.trim()

      updateDraft(draft => {
        const next: any = { ...draft }
        next.lines = next.lines ?? []

        if (editingNote) {
          next.lines = next.lines.map((l: any) =>
            l.id === editingNote.id
              ? { ...l, title, note, lastModifiedDate: now }
              : l
          )
        } else {
          // ✅ يمنع تكرار نفس الإدخال لو اتنفذ مرتين بالغلط
          const alreadyExists = next.lines.some((l: any) =>
            !l.isDeleted &&
            (l.title ?? '').trim() === title &&
            (l.note ?? '').trim() === note
          )

          if (!alreadyExists) {
            const tempId = generateTempId()
            next.lines.push({
              id: tempId,
              bookId: next.id ?? 0,
              title,
              note,

              isDone: false,
              isFavorite: false,
              isDeleted: false,
              isModelLine: false,

              brideId: next.brideId ?? null,
              groomId: next.groomId ?? null,

              creationDate: now,
              lastModifiedDate: now,
            })
            setSelectedNoteId(tempId)
          }
        }

        next.lastModifiedDate = now
        return next
      })

      setIsModalOpen(false)
      setEditingNote(null)
    } finally {
      // unlock next tick
      setTimeout(() => {
        modalSaveLock.current = false
      }, 0)
    }
  }, [updateDraft, editingNote])

  const handleSaveToServer = useCallback(async () => {
    if (!localDraft) return
    try {
      await syncDraft(localDraft)
    } catch {
      // toast already handled upstream if needed
    }
  }, [localDraft, syncDraft])

  if (isLoading && !localDraft) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingOverlay open={true} title="Loading notes..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 sm:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              
            </Button>
            <h1 className="text-24 font-semibold text-gray-900">Notes</h1>
          </div>

          <Button
            variant="brand"
            onClick={handleSaveToServer}
            disabled={!hasUnsavedChanges || syncMutation.isPending}
            className="flex items-center gap-2 text-white"
          >
            <Save className="h-4 w-4" />
            {syncMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[300px_1fr] gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="order-1 sm:order-1 sm:sticky sm:top-6 sm:h-[calc(100vh-8rem)]">
            <NoteCategoriesSidebar
              notes={activeNotes}
              selectedNoteId={selectedNoteId}
              onSelectNote={setSelectedNoteId}
              onAddNew={handleAddNew}
              onEditNote={(n) => {
                setEditingNote(n)
                setIsModalOpen(true)
              }}
              onDeleteNote={handleDelete}
            />
          </div>

          {/* Main panel */}
          <div className="order-2 sm:order-2 sm:h-[calc(100vh-8rem)] min-h-[400px]">
            <NoteMainPanel
              note={selectedNote}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
            />
          </div>
        </div>

        <AddEditNoteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingNote(null)
          }}
          editingNote={editingNote}
          onSave={handleSaveFromModal}
        />
      </div>
    </div>
  )
}

export default function NotesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingOverlay open={true} title="Loading notes..." />
        </div>
      }
    >
      <NotesPageContent />
    </Suspense>
  )
}
