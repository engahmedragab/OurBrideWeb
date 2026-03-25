'use client'

import { useState } from 'react'
import { X, Users, Wand2, Palette, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { GuestLineCategoryResponse } from '@/types/responses'
import { TemplateBrowser } from './TemplateBrowser'

interface CreateFromGuestBookDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { occasionId?: number; invitationModelId?: number; guestLineCategoryIds?: number[] }) => void
  isPending?: boolean
  categories?: GuestLineCategoryResponse[]
}

export function CreateFromGuestBookDialog({
  isOpen,
  onClose,
  onSubmit,
  isPending = false,
  categories = [],
}: CreateFromGuestBookDialogProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set())
  const [selectAll, setSelectAll] = useState(true)
  const [step, setStep] = useState<'guests' | 'template'>('guests')
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null)

  if (!isOpen) return null

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setSelectAll(false)
  }

  const handleSubmit = () => {
    onSubmit({
      invitationModelId: selectedModelId || undefined,
      guestLineCategoryIds: selectAll ? undefined : Array.from(selectedCategories),
    })
  }

  const canProceed = selectAll || selectedCategories.size > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
        step === 'template' ? 'max-w-2xl' : 'max-w-md'
      }`}>
        {/* Header */}
        <div className="relative bg-gradient-to-br from-brand-500 to-pink-400 px-6 pt-6 pb-8 text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/20 mb-3">
            {step === 'guests' ? <Wand2 className="h-7 w-7 text-white" /> : <Palette className="h-7 w-7 text-white" />}
          </div>
          <h3 className="text-18 font-bold text-white">
            {step === 'guests' ? 'Create from Guest Book' : 'Choose a Template'}
          </h3>
          <p className="text-12 text-white/70 mt-1">
            {step === 'guests'
              ? 'Select which guests to generate invitations for'
              : 'Pick a template with wedding details for all invitations'}
          </p>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className={`h-1.5 rounded-full transition-all ${step === 'guests' ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
            <div className={`h-1.5 rounded-full transition-all ${step === 'template' ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
          </div>
        </div>

        {step === 'guests' ? (
          <>
            <div className="px-6 py-5 space-y-4">
              {/* Select All */}
              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-brand-200 bg-brand-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => {
                    setSelectAll(e.target.checked)
                    if (e.target.checked) setSelectedCategories(new Set())
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-500" />
                  <span className="text-14 font-semibold text-brand-700">All Guests</span>
                </div>
              </label>

              {/* Category selection */}
              {!selectAll && categories.length > 0 && (
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  <p className="text-12 font-medium text-gray-500">Or select specific tables/groups:</p>
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-brand-200 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                      />
                      <span className="text-13 text-gray-700">{cat.name || cat.nameEn || cat.nameAr}</span>
                    </label>
                  ))}
                </div>
              )}

              {!selectAll && categories.length === 0 && (
                <p className="text-13 text-gray-400 text-center py-4">
                  No guest categories found. All guests will be included.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3">
              <Button
                variant="brand"
                className="flex-1 text-white"
                onClick={() => setStep('template')}
                disabled={!canProceed}
                type="button"
              >
                Choose Template
                <ChevronRight className="h-4 w-4 ml-1.5" />
              </Button>
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
              <p className="text-12 text-gray-500 mb-3">
                Select a template design for the invitations:
              </p>
              <TemplateBrowser
                selectedId={selectedModelId}
                onSelect={(id) => setSelectedModelId(selectedModelId === id ? null : id)}
                compact
              />
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3 border-t border-gray-100 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep('guests')}
                type="button"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button
                variant="brand"
                className="flex-1 text-white"
                onClick={handleSubmit}
                disabled={isPending}
                type="button"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isPending ? 'Creating...' : `Generate Invitations${selectedModelId ? '' : ' (No Template)'}`}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
