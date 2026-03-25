'use client'

import { useState, useEffect } from 'react'
import {
  X,
  Palette,
  Save,
  Image,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { InvitationModelResponse, InvitationModelRequest } from '@/types/responses/invitation-book-response'

interface InvitationModelFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: InvitationModelRequest) => void
  isPending?: boolean
  /** Pass existing model to edit, or null/undefined for create */
  model?: InvitationModelResponse | null
}

export function InvitationModelForm({
  isOpen,
  onClose,
  onSubmit,
  isPending = false,
  model,
}: InvitationModelFormProps) {
  const isEdit = !!model

  const [form, setForm] = useState<InvitationModelRequest>({
    templateName: '',
    templateNameAr: '',
    previewImageUrl: '',
    templateImageUrl: '',
    templateColor: '#D4AF37',
    templateCategory: '',
    templateCategoryAr: '',
    isDefault: false,
    sortOrder: 0,
  })

  useEffect(() => {
    if (model) {
      setForm({
        templateName: model.templateName || '',
        templateNameAr: model.templateNameAr || '',
        previewImageUrl: model.previewImageUrl || '',
        templateImageUrl: model.templateImageUrl || '',
        templateColor: model.templateColor || '#D4AF37',
        templateCategory: model.templateCategory || '',
        templateCategoryAr: model.templateCategoryAr || '',
        isDefault: model.isDefault || false,
        sortOrder: model.sortOrder || 0,
      })
    }
  }, [model])

  if (!isOpen) return null

  const updateField = <K extends keyof InvitationModelRequest>(key: K, value: InvitationModelRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  const inputClass =
    'w-full px-3 py-2 rounded-xl border border-gray-200 text-14 text-gray-700 placeholder:text-gray-400 focus:border-brand-300 focus:ring-1 focus:ring-brand-200 outline-none transition-colors'
  const labelClass = 'text-12 font-medium text-gray-600 mb-1 block'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-brand-500 to-purple-500 px-6 pt-6 pb-8 text-center flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/20 mb-3">
            <Palette className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-18 font-bold text-white">
            {isEdit ? 'Edit Template' : 'Create Template'}
          </h3>
          <p className="text-12 text-white/70 mt-1">
            {isEdit ? 'Update the invitation template design' : 'Design a new invitation template'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-6">
            {/* ── Template Design Section ──────────────────────────────────── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image className="h-4 w-4 text-purple-500" />
                <h4 className="text-14 font-bold text-gray-800">Template Design</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Template Name (English) *</label>
                  <input
                    type="text"
                    value={form.templateName || ''}
                    onChange={(e) => updateField('templateName', e.target.value)}
                    placeholder="Classic Gold"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Template Name (Arabic)</label>
                  <input
                    type="text"
                    value={form.templateNameAr || ''}
                    onChange={(e) => updateField('templateNameAr', e.target.value)}
                    placeholder="ذهبي كلاسيك"
                    dir="rtl"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={form.templateCategory || ''}
                    onChange={(e) => updateField('templateCategory', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select category</option>
                    <option value="Classic">Classic</option>
                    <option value="Modern">Modern</option>
                    <option value="Floral">Floral</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Playful">Playful</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Category (Arabic)</label>
                  <input
                    type="text"
                    value={form.templateCategoryAr || ''}
                    onChange={(e) => updateField('templateCategoryAr', e.target.value)}
                    placeholder="كلاسيك"
                    dir="rtl"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Template Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.templateColor || '#D4AF37'}
                      onChange={(e) => updateField('templateColor', e.target.value)}
                      className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.templateColor || ''}
                      onChange={(e) => updateField('templateColor', e.target.value)}
                      placeholder="#D4AF37"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder || 0}
                    onChange={(e) => updateField('sortOrder', Number(e.target.value))}
                    min={0}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Preview Image URL</label>
                  <input
                    type="url"
                    value={form.previewImageUrl || ''}
                    onChange={(e) => updateField('previewImageUrl', e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Template Image URL</label>
                  <input
                    type="url"
                    value={form.templateImageUrl || ''}
                    onChange={(e) => updateField('templateImageUrl', e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isDefault || false}
                      onChange={(e) => updateField('isDefault', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="text-13 text-gray-700">Set as default template</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 pt-2 flex gap-3 border-t border-gray-100 flex-shrink-0">
            <Button
              variant="brand"
              className="flex-1 text-white"
              type="submit"
              disabled={isPending || !form.templateName?.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              {isPending ? 'Saving...' : isEdit ? 'Update Template' : 'Create Template'}
            </Button>
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
