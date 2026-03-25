'use client'

import { useState, useMemo, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LoadingOverlay, LoadingSpinner } from '@/components/ui'
import { useEventId } from '@/hooks/planning'
import { useNoteBook, useNoteSyncMutation, useNoteSyncDeltaMutation } from '@/hooks/notes'
import { useInitNoteBooks, useAddNoteBookModels } from '@/hooks/bookInit'
import { usePlanningBookController } from '@/hooks/planning/usePlanningBookController'

import { NoteCategoriesSidebar } from '@/components/notesBook/NoteCategoriesSidebar'
import NoteMainPanel from '@/components/notesBook/NoteMainPanel'
import  {AddEditNoteModal} from '@/components/notesBook/AddEditNoteModal'

import type { NoteBookDraft } from '@/hooks/planning/bookDrafts'
import { generateTempId } from '@/utils/sync/tempIds'
import { buildNoteBookRequestFromLocal, convertLineToRequest } from '@/utils/planning/mappers/noteMappers'

import type { NoteLineResponse } from '@/types/responses'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'
import type { SyncBookDeltaResponse } from '@/hooks/planning/usePlanningBookController'
import { BookClass, UserType as LocalUserType } from '@/types/responses/book-enums'
import { useI18nTranslations, useIsRTL } from '@/i18n' // ✅ add
import { cn } from '@/lib'

function NotesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = useEventId()
  const isRtl = useIsRTL()

  // ✅ translations
  const t = useI18nTranslations('eventsPlanning.notes')

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
    const q: Record<string, unknown> = {}
    if (eventId) q.eventId = eventId
    if (userType) q.userType = userType
    if (clientId) q.clientId = clientId
    return Object.keys(q).length ? q : undefined
  }, [eventId, userType, clientId])

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

  const initMutation = useInitNoteBooks()
  const addModelsMutation = useAddNoteBookModels()
  const syncMutation = useNoteSyncMutation()
  const syncDeltaMutation = useNoteSyncDeltaMutation()

  const {
    localBook: localDraft,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    save,
    applyLocalUpdate,
    getActiveLines,
    getLineById,
    isInitializing,
    isAddingModels,
  } = usePlanningBookController<NoteBookDraft, NoteLineResponse>({
    book: (noteBook as unknown as NoteBookDraft) ?? null,
    isLoading,
    eventId: eventId ?? undefined,
    requireEventId: true,
    syncFn: async (draft) => {
      const payload = buildNoteBookRequestFromLocal(draft)
      await syncMutation.mutateAsync({
        ...payload,
        query: normalizedQuery,
      })
    },
    syncDeltaFn: async (delta) => {
      const response = await syncDeltaMutation.mutateAsync({
        data: delta as unknown as import('@/types/syncDelta').SyncBookDeltaRequest<
          import('@/../client/common/api/gen/ourbride-api').NoteLineRequest,
          import('@/../client/common/api/gen/ourbride-api').NoteLineCategoryRequest
        >,
        query: normalizedQuery,
      })
      return response as unknown as SyncBookDeltaResponse<NoteBookDraft>
    },
    refetch,
    refetchAfterSave: true,
    getBookId: (book) => ((book as Record<string, unknown>).id as number | undefined) ?? null,
    convertLineToRequest: (line: NoteLineResponse, bookId: number) =>
      convertLineToRequest(line as unknown as Record<string, unknown>, bookId),
    convertCategoryToRequest: undefined, // Notes don't have categories
    shouldInit: (b) => !b?.id,
    initFn: async () => {
      await initMutation.mutateAsync({
        eventId: eventId ?? undefined,
        userType: null as unknown as UserType | undefined,
        clientId: null as unknown as string | undefined,
      })
    },
    shouldAddModels: (b) => ((b as Record<string, unknown>)?.isModelsAdd as boolean | undefined) === false,
    addModelsFn: async () => {
      await addModelsMutation.mutateAsync({
        eventId: eventId ?? undefined,
        userType: null as unknown as UserType | undefined,
        clientId: null as unknown as string | undefined,
      })
    },
    initMutation,
    addModelsMutation,
    onFirstLoad: (_book) => {
      // Will be handled after controller is set up
    },
    onHydrate: (_book) => {
      // Will be handled after controller is set up
    },
    isSameBookBase: (current, last) =>
      current.id === last.id &&
      current.groomId === last.groomId &&
      current.brideId === last.brideId &&
      current.title === last.title,
    getLines: (book) => book.lines || [],
    getCategories: () => [], // Notes don't have categories
    getLineId: (line) => (line as NoteLineResponse).id,
    getCategoryId: () => -1, // Notes don't have categories
    isSameLine: (current, last) => {
      const currentLine = current as NoteLineResponse
      const lastLine = last as NoteLineResponse
      return (
        currentLine.title === lastLine.title &&
        currentLine.note === lastLine.note &&
        (currentLine.isDeleted ?? false) === (lastLine.isDeleted ?? false) &&
        (currentLine.isDone ?? false) === (lastLine.isDone ?? false)
      )
    },
    isLineDeleted: (line) => ((line as NoteLineResponse).isDeleted ?? false),
  })

  // Set initial selected note on first load
  useEffect(() => {
    if (localDraft && getActiveLines && !selectedNoteId) {
      const activeLines = getActiveLines()
      if (activeLines.length > 0) {
        const firstActive = activeLines[0] as NoteLineResponse
        setSelectedNoteId(firstActive?.id ?? null)
      }
    }
  }, [localDraft, getActiveLines, selectedNoteId])

  // Update selected note on hydrate
  useEffect(() => {
    if (localDraft && getActiveLines && selectedNoteId) {
      const activeLines = getActiveLines()
      if (activeLines.length === 0) {
        setSelectedNoteId(null)
      } else {
        const stillExists = activeLines.some((l: NoteLineResponse) => l.id === selectedNoteId)
        if (!stillExists && activeLines.length > 0) {
          const firstActive = activeLines[0] as NoteLineResponse
          setSelectedNoteId(firstActive?.id ?? null)
        }
      }
    }
  }, [localDraft, getActiveLines, selectedNoteId])

  // Get active notes using controller helper
  const activeNotes = useMemo(() => {
    return getActiveLines() as NoteLineResponse[]
  }, [getActiveLines])

  // Get selected note using controller helper
  const selectedNote = useMemo(() => {
    if (!selectedNoteId) return null
    return getLineById(selectedNoteId) as NoteLineResponse | null
  }, [selectedNoteId, getLineById])

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

    const result = applyLocalUpdate((draft) => {
      const next = { ...draft } as NoteBookDraft
      next.lines = (next.lines || []).map((l: NoteLineResponse) => {
        if (l.id === note.id) return { ...l, isDeleted: true, lastModifiedDate: now }
        return l
      })
      next.lastModifiedDate = now
      return next
    })

    if (result.ok && result.book) {
      // Calculate remaining active notes from the updated book
      const updated = result.book as NoteBookDraft
      const remaining = (updated.lines || []).filter(
        (l: NoteLineResponse) => !(l.isDeleted ?? false) && l.id !== note.id
      ) as NoteLineResponse[]
      setSelectedNoteId(remaining[0]?.id ?? null)
    }
  }, [applyLocalUpdate])

  // ✅ Modal save (FIX: lock + prevent double add)
  const handleSaveFromModal = useCallback((data: { title: string; note: string }) => {
    if (modalSaveLock.current) return
    modalSaveLock.current = true

    try {
      const now = new Date().toISOString()
      const title = data.title.trim()
      const note = data.note.trim()

      const result = applyLocalUpdate((draft) => {
        const next: NoteBookDraft = { ...draft }
        // Clone lines to avoid mutating shared references used by lastSyncedRef
        next.lines = [...(next.lines ?? [])]

        if (editingNote) {
          // Update existing note
          next.lines = next.lines.map((l: NoteLineResponse) =>
            l.id === editingNote.id
              ? { ...l, title, note, lastModifiedDate: now }
              : l
          )
        } else {
      
          const alreadyExists = next.lines.some((l: NoteLineResponse) =>
            !(l.isDeleted ?? false) &&
            (l.title ?? '').trim() === title &&
            (l.note ?? '').trim() === note
          )

          if (!alreadyExists) {
            const tempId = generateTempId()
            const newNote: NoteLineResponse = {
              id: tempId,
              bookId: next.id ?? 0,
              title,
              note,
              isDone: false,
              isFavorite: false,
              isDeleted: false,
              isModelLine: false,
              brideId: next.brideId ?? undefined,
              groomId: next.groomId ?? undefined,
              creationDate: now,
              lastModifiedDate: now,
              lineType: (next.bookType as unknown as LocalUserType) ?? LocalUserType.Bride,
              bookClass: (next.bookClass as unknown as BookClass) ?? BookClass.Note,
              createdBy: next.createdBy ?? '',
              lastModifiedBy: next.lastModifiedBy ?? '',
              slug: '',
            }
            next.lines.push(newNote)
            setSelectedNoteId(tempId)
          }
        }

        next.lastModifiedDate = now
        return next
      })

      if (result.ok) {
        setIsModalOpen(false)
        setEditingNote(null)
      }
    } finally {
      // unlock next tick
      setTimeout(() => {
        modalSaveLock.current = false
      }, 0)
    }
  }, [applyLocalUpdate, editingNote])

  const handleSync = useCallback(async () => {
    const result = await save()
    if (!result.ok) {
      if (result.reason === 'loading' || result.reason === 'no-changes') {
        if (result.reason === 'no-changes') setHasUnsavedChanges(false)
        return
      }
      return
    }
  }, [save, setHasUnsavedChanges, hasUnsavedChanges, isLoading, isInitializing, isAddingModels, localDraft])

  if ((isLoading || isInitializing || isAddingModels) && !localDraft) {
    const loadingTitle = isInitializing
      ? t('loading.initializingTitle')
      : isAddingModels
        ? t('loading.addingModelsTitle')
        : t('loading.loadingNotes')

    const loadingSubtitle = isInitializing
      ? t('loading.initializingSubtitle')
      : isAddingModels
        ? t('loading.addingModelsSubtitle')
        : t('loading.loadingSubtitle')

    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner fullScreen={true} size='xl' text={`${loadingTitle} ${loadingSubtitle}`}/>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full lg:max-w-7xl lg:mx-auto px-0 sm:px-2 lg:px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className={cn('h-4 w-4', isRtl ? 'rotate-180' : 'rotate-0')} />
            </Button>

            <h1 className="text-24 font-semibold text-gray-900">{t('page.title')}</h1>
          </div>

          {(hasUnsavedChanges || syncMutation.isPending || syncDeltaMutation.isPending) && (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <Button
                variant="brand"
                size="md"
                onClick={handleSync}
                disabled={!hasUnsavedChanges || syncDeltaMutation.isPending}
                className="flex items-center gap-2 rounded-xl !text-white w-full sm:w-auto"
                type="button"
              >
                <Save className="h-4 w-4" />
                {syncDeltaMutation.isPending ? t('header.saving') : t('header.saveChanges')}
              </Button>

              {hasUnsavedChanges && (
                <span className="text-16 text-brand-500 font-medium">{t('header.unsavedChanges')}</span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[300px_1fr] gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="order-1 sm:order-1 sm:sticky sm:top-6 ">
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
          <div className="order-2 sm:order-2 ">
            <NoteMainPanel note={selectedNote} onAddNew={handleAddNew} onEdit={handleEdit} />
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
  const t = useI18nTranslations('eventsPlanning.notes')

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner  text={t('loading.loadingNotes')} />
        </div>
      }
    >
      <NotesPageContent />
    </Suspense>
  )
}
