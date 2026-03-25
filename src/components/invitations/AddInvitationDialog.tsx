'use client'

import { useState } from 'react'
import { X, Plus, User, Phone, MapPin, Calendar, Crown, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TemplateBrowser } from './TemplateBrowser'
import { templateRegistry } from './templates'

export interface AddInvitationFormData {
  guestName: string
  guestPhone: string
  guestEmail: string
  numberOfGuests: number
  brideName: string
  groomName: string
  weddingDate: string
  engagementDate: string
  hennaDate: string
  crownDate: string
  weddinghole: string
  weddingAddress: string
  area: string
  mapsLink: string
  invitationModelId: number | null
}

interface AddInvitationDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AddInvitationFormData) => void
  isPending?: boolean
  defaults?: Partial<AddInvitationFormData>
}

export function AddInvitationDialog({
  isOpen,
  onClose,
  onSubmit,
  isPending = false,
  defaults,
}: AddInvitationDialogProps) {
  const [showExtraDates, setShowExtraDates] = useState(false)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)

  const [form, setForm] = useState<AddInvitationFormData>({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    numberOfGuests: 1,
    brideName: defaults?.brideName || '',
    groomName: defaults?.groomName || '',
    weddingDate: defaults?.weddingDate || '',
    engagementDate: defaults?.engagementDate || '',
    hennaDate: defaults?.hennaDate || '',
    crownDate: defaults?.crownDate || '',
    weddinghole: defaults?.weddinghole || '',
    weddingAddress: defaults?.weddingAddress || '',
    area: defaults?.area || '',
    mapsLink: defaults?.mapsLink || '',
    invitationModelId: defaults?.invitationModelId || null,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof AddInvitationFormData, string>>>({})

  if (!isOpen) return null

  const validate = (): boolean => {
    const errs: typeof errors = {}
    if (!form.guestName.trim()) errs.guestName = 'Guest name is required'
    if (form.numberOfGuests < 1 || form.numberOfGuests > 20) errs.numberOfGuests = 'Must be 1-20'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit(form)
    setForm({
      ...form,
      guestName: '',
      guestPhone: '',
      guestEmail: '',
      numberOfGuests: 1,
    })
    onClose()
  }

  const updateField = (field: keyof AddInvitationFormData, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleTemplateSelect = (templateId: number) => {
    updateField('invitationModelId', templateId)
    setShowTemplatePicker(false)
  }

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-14 focus:border-brand-300 focus:ring-1 focus:ring-brand-200 outline-none transition-colors'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="text-16 font-bold text-gray-900">Add Invitation</h3>
            <p className="text-12 text-gray-400">Create a manual invitation for a guest</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {/* Template Selection */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowTemplatePicker(!showTemplatePicker)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                form.invitationModelId
                  ? 'border-brand-300 bg-brand-50/50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-13 font-medium text-gray-700">
                {form.invitationModelId
                  ? `${templateRegistry.find((t) => t.id === form.invitationModelId)?.name || 'Template'} selected`
                  : 'Choose a template design'}
              </span>
              {showTemplatePicker ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {showTemplatePicker && (
              <div className="border border-gray-200 rounded-xl p-4 max-h-[40vh] overflow-y-auto">
                <TemplateBrowser
                  selectedId={form.invitationModelId}
                  onSelect={handleTemplateSelect}
                  compact
                />
              </div>
            )}
          </div>

          {/* Guest Info Section */}
          <div className="space-y-3">
            <h4 className="text-12 font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <User className="h-3.5 w-3.5" />
              Guest Information
            </h4>
            <div>
              <label className="text-12 font-medium text-gray-600 mb-1 block">Guest Name *</label>
              <input
                type="text"
                value={form.guestName}
                onChange={(e) => updateField('guestName', e.target.value)}
                placeholder="Mohamed Ali"
                className={inputClass}
              />
              {errors.guestName && <p className="text-11 text-red-500 mt-1">{errors.guestName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-12 font-medium text-gray-600 mb-1 block">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.guestPhone}
                    onChange={(e) => updateField('guestPhone', e.target.value)}
                    placeholder="+20..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-14 focus:border-brand-300 focus:ring-1 focus:ring-brand-200 outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-12 font-medium text-gray-600 mb-1 block">Guests Count</label>
                <input
                  type="number"
                  value={form.numberOfGuests}
                  onChange={(e) => updateField('numberOfGuests', Number(e.target.value))}
                  min={1}
                  max={20}
                  className={inputClass}
                />
                {errors.numberOfGuests && <p className="text-11 text-red-500 mt-1">{errors.numberOfGuests}</p>}
              </div>
            </div>
            <div>
              <label className="text-12 font-medium text-gray-600 mb-1 block">Email</label>
              <input
                type="email"
                value={form.guestEmail}
                onChange={(e) => updateField('guestEmail', e.target.value)}
                placeholder="guest@email.com"
                className={inputClass}
              />
            </div>
          </div>

          {/* Wedding Info Section */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <h4 className="text-12 font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              Wedding Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-12 font-medium text-gray-600 mb-1 block">Bride Name</label>
                <input
                  type="text"
                  value={form.brideName}
                  onChange={(e) => updateField('brideName', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-12 font-medium text-gray-600 mb-1 block">Groom Name</label>
                <input
                  type="text"
                  value={form.groomName}
                  onChange={(e) => updateField('groomName', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="text-12 font-medium text-gray-600 mb-1 block">Wedding Date</label>
              <input
                type="datetime-local"
                value={form.weddingDate}
                onChange={(e) => updateField('weddingDate', e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Expandable extra dates */}
            <button
              type="button"
              onClick={() => setShowExtraDates(!showExtraDates)}
              className="flex items-center gap-1.5 text-12 text-brand-500 hover:text-brand-600 font-medium transition-colors"
            >
              {showExtraDates ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {showExtraDates ? 'Hide extra dates' : 'Engagement, Henna & Crown dates'}
            </button>

            {showExtraDates && (
              <div className="space-y-3 pl-2 border-l-2 border-brand-100">
                <div>
                  <label className="text-12 font-medium text-gray-600 mb-1 block">Engagement Date</label>
                  <input
                    type="datetime-local"
                    value={form.engagementDate}
                    onChange={(e) => updateField('engagementDate', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-12 font-medium text-gray-600 mb-1 block">Henna Date</label>
                  <input
                    type="datetime-local"
                    value={form.hennaDate}
                    onChange={(e) => updateField('hennaDate', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-12 font-medium text-gray-600 mb-1 flex items-center gap-1">
                    <Crown className="h-3 w-3 text-yellow-500" />
                    Crown Date
                  </label>
                  <input
                    type="datetime-local"
                    value={form.crownDate}
                    onChange={(e) => updateField('crownDate', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Venue Section */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <h4 className="text-12 font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              Venue
            </h4>
            <div>
              <label className="text-12 font-medium text-gray-600 mb-1 block">Hall / Venue Name</label>
              <input
                type="text"
                value={form.weddinghole}
                onChange={(e) => updateField('weddinghole', e.target.value)}
                placeholder="Grand Hall"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-12 font-medium text-gray-600 mb-1 block">Address</label>
              <input
                type="text"
                value={form.weddingAddress}
                onChange={(e) => updateField('weddingAddress', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-12 font-medium text-gray-600 mb-1 block">Area</label>
                <input
                  type="text"
                  value={form.area}
                  onChange={(e) => updateField('area', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-12 font-medium text-gray-600 mb-1 block">Maps Link</label>
                <input
                  type="url"
                  value={form.mapsLink}
                  onChange={(e) => updateField('mapsLink', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <Button
            variant="brand"
            className="flex-1 text-white"
            onClick={handleSubmit}
            disabled={isPending}
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isPending ? 'Creating...' : 'Create Invitation'}
          </Button>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
