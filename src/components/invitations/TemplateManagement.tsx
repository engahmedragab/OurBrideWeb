'use client'

import { useState, useMemo } from 'react'
import {
  Pencil,
  Trash2,
  Star,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toaster'
import {
  useInvitationModels,
  useCreateInvitationModel,
  useUpdateInvitationModel,
  useDeleteInvitationModel,
} from '@/hooks/invitationBooks'
import { InvitationModelForm } from './InvitationModelForm'
import {
  templateRegistry,
  templateComponents,
  getCategoryLabel,
} from './templates'
import type { TemplateInfo } from './templates'
import type { InvitationModelResponse, InvitationModelRequest } from '@/types/responses/invitation-book-response'

const categories: TemplateInfo['category'][] = ['classic', 'modern', 'floral', 'luxury', 'minimalist', 'cultural', 'playful']

const categoryColors: Record<string, string> = {
  classic: 'bg-amber-50 text-amber-700 border-amber-200',
  modern: 'bg-purple-50 text-purple-700 border-purple-200',
  floral: 'bg-pink-50 text-pink-700 border-pink-200',
  luxury: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  minimalist: 'bg-gray-50 text-gray-700 border-gray-200',
  cultural: 'bg-teal-50 text-teal-700 border-teal-200',
  playful: 'bg-orange-50 text-orange-700 border-orange-200',
}

const previewProps = {
  brideName: 'Sarah',
  groomName: 'Ahmed',
  guestName: 'Guest Name',
  weddingDate: '2026-06-15T18:00:00',
  weddinghole: 'Grand Ballroom',
  weddingAddress: 'Cairo, Egypt',
  preview: true,
}

interface TemplateManagementProps {
  onSelectTemplate?: (templateId: number) => void
  selectedTemplateId?: number | null
  selectable?: boolean
}

export function TemplateManagement({ onSelectTemplate, selectedTemplateId, selectable = false }: TemplateManagementProps) {
  const { addToast } = useToast()
  const { data: models = [], isLoading } = useInvitationModels()
  const createMutation = useCreateInvitationModel()
  const updateMutation = useUpdateInvitationModel()
  const deleteMutation = useDeleteInvitationModel()

  const [activeCategory, setActiveCategory] = useState<TemplateInfo['category'] | 'all'>('all')
  const [editModel, setEditModel] = useState<InvitationModelResponse | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  // Map API models by their sortOrder (which maps to template id)
  const modelsByTemplateId = useMemo(() => {
    const map: Record<number, InvitationModelResponse> = {}
    for (const m of models) {
      if (m.sortOrder && !m.isDeleted) {
        map[m.sortOrder] = m
      }
    }
    return map
  }, [models])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return templateRegistry
    return templateRegistry.filter((t) => t.category === activeCategory)
  }, [activeCategory])

  const handleCreate = (data: InvitationModelRequest) => {
    createMutation.mutate({ data }, {
      onSuccess: () => {
        setShowForm(false)
        addToast('Template created successfully', 'success')
      },
      onError: (err) => addToast(err.message, 'error'),
    })
  }

  const handleUpdate = (data: InvitationModelRequest) => {
    if (!editModel) return
    updateMutation.mutate(
      { id: editModel.id, data },
      {
        onSuccess: () => {
          setEditModel(null)
          addToast('Template updated', 'success')
        },
        onError: (err) => addToast(err.message, 'error'),
      }
    )
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setConfirmDeleteId(null)
        addToast('Template deleted', 'info')
      },
      onError: (err) => addToast(err.message, 'error'),
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-16 font-bold text-gray-800">Invitation Templates</h3>
          <p className="text-12 text-gray-400 mt-0.5">
            {selectable ? 'Choose a design for your invitation' : `Browse ${templateRegistry.length} wedding invitation designs`}
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-full text-12 font-medium border transition-colors ${
            activeCategory === 'all'
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          All ({templateRegistry.length})
        </button>
        {categories.map((cat) => {
          const count = templateRegistry.filter((t) => t.category === cat).length
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-12 font-medium border transition-colors ${
                activeCategory === cat
                  ? categoryColors[cat] || 'bg-gray-100 text-gray-700 border-gray-300'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {getCategoryLabel(cat)} ({count})
            </button>
          )
        })}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-13 text-gray-400">
            <div className="h-4 w-4 border-2 border-gray-300 border-t-brand-500 rounded-full animate-spin" />
            Loading...
          </div>
        </div>
      )}

      {/* Template Grid with live previews */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((template) => {
          const Component = templateComponents[template.id]
          const apiModel = modelsByTemplateId[template.id]
          const isSelected = selectedTemplateId === template.id
          if (!Component) return null

          return (
            <div
              key={template.id}
              className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-brand-500 ring-2 ring-brand-200 shadow-lg shadow-brand-100/40'
                  : 'border-gray-200 hover:border-brand-300 hover:shadow-md'
              }`}
            >
              {/* Clickable preview area */}
              <button
                type="button"
                onClick={() => {
                  if (selectable && onSelectTemplate) {
                    onSelectTemplate(template.id)
                  }
                }}
                className={`w-full text-left ${selectable ? 'cursor-pointer' : 'cursor-default'}`}
                disabled={!selectable}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <Component {...previewProps} />
                </div>
              </button>

              {/* Selection Badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-brand-500 flex items-center justify-center shadow-md z-10">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              )}

              {/* Template Info Footer */}
              <div className="p-3 bg-white border-t border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <div className="min-w-0">
                    <p className="text-12 font-semibold text-gray-800 truncate">{template.name}</p>
                    <p className="text-10 text-gray-400 truncate">{template.nameAr}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-0.5 ml-2">
                    <div className="h-3 w-3 rounded-full" style={{ background: template.colors.primary }} />
                    <div className="h-3 w-3 rounded-full" style={{ background: template.colors.secondary, border: '1px solid #e5e7eb' }} />
                    <div className="h-3 w-3 rounded-full" style={{ background: template.colors.accent }} />
                  </div>
                </div>

                {/* Category badge */}
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-10 font-medium"
                  style={{
                    background: `${template.colors.primary}15`,
                    color: template.colors.primary,
                  }}
                >
                  {getCategoryLabel(template.category)}
                </span>

                {/* API model info (if linked) */}
                {apiModel && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    {apiModel.isDefault && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-10 font-medium mr-1">
                        <Star className="h-2.5 w-2.5" />
                        Default
                      </span>
                    )}
                    {/* Edit/Delete for API-linked models */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setEditModel(apiModel) }}
                        className="flex items-center gap-1 text-10 text-gray-400 hover:text-brand-500 transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(apiModel.id) }}
                        className="flex items-center gap-1 text-10 text-gray-400 hover:text-red-500 transition-colors ml-auto"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-13 text-gray-400">No templates in this category</p>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <InvitationModelForm
        isOpen={showForm || !!editModel}
        onClose={() => {
          setShowForm(false)
          setEditModel(null)
        }}
        onSubmit={editModel ? handleUpdate : handleCreate}
        isPending={createMutation.isPending || updateMutation.isPending}
        model={editModel}
      />

      {/* Delete Confirmation */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDeleteId(null)} />
          <div className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-red-50 mb-3">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-16 font-bold text-gray-800 mb-1">Delete Template?</h3>
            <p className="text-13 text-gray-400 mb-5">
              This action cannot be undone. Existing invitations using this template will not be affected.
            </p>
            <div className="flex gap-3">
              <Button
                variant="destructive"
                className="flex-1 text-white"
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deleteMutation.isPending}
                type="button"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDeleteId(null)} type="button">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
