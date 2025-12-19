'use client'

import React, { useState, useEffect, ChangeEvent } from 'react'
import { Save, Tag, Bell } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from './Input'
import { Toggle } from './Switch'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Checkbox } from './Checkbox'
import { cn } from '@/lib'

// Generic modal to support any item shape
interface EditModalProps<T> {
  isOpen: boolean
  onClose: () => void
  itemData: T
  onSave: (updatedData: T) => void
}

export default function EditItemModal<T extends Record<string, any>>({
  isOpen,
  onClose,
  itemData,
  onSave,
}: EditModalProps<T>) {
  const [formData, setFormData] = useState<T>(itemData)

  useEffect(() => {
    if (isOpen) setFormData(itemData)
  }, [isOpen, itemData])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleToggle = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSaveInternal = () => {
    onSave(formData)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Item" 
      maxWidth="2xl"
      contentClassName="p-0 max-h-[90vh] overflow-y-auto"
      headerClassName="px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3"
      containerClassName="max-h-[100vh] overflow-hidden max-w-[95%] sm:max-w-[90%] md:max-w-[700px] lg:max-w-[1000px] w-full"

    >
      <div className="bg-gray-50">
        {/* Content */}
        <div className="p-4 md:p-6 space-y-8">
          {/* Basic Fields */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-5">
            <h3 className="text-12 uppercase tracking-wider text-gray-400">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(formData).map((key) => {
                const value = formData[key]
                const lower = key.toLowerCase()

                const isProvider = lower.startsWith('provider')
                const isReminder = lower.startsWith('reminder')
                const isToggle = typeof value === 'boolean'
                const isInternal = [
                  'id',
                  'totalcost',
                  'remaining',
                  'iscompleted',
                ].includes(lower)

                // Render only primary editable fields
                if (isProvider || isReminder || isToggle || isInternal)
                  return null

                const isWide =
                  lower.includes('note') || lower.includes('description')

                return (
                  <div
                    key={key}
                    className={cn(isWide && 'sm:col-span-2')}
                  >
                    <label className="text-10 font-bold uppercase text-gray-400 mb-1 block">
                      {key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())
                        .trim()}
                    </label>

                    <Input
                      name={key}
                      type={
                        typeof value === 'number'
                          ? 'number'
                          : lower.includes('date')
                          ? 'date'
                          : 'text'
                      }
                      value={formData[key] || ''}
                      onChange={handleChange}
                      className="h-9 text-13"
                    />
                  </div>
                )
              })}
            </div>

            {/* Completion Status */}
            <div className="flex items-center gap-3 pt-2">
              <Checkbox
                checked={formData.iscompleted}
                onChange={(val) =>
                  setFormData({ ...formData, iscompleted: val })
                }
                variant={formData.iscompleted ? 'successFilled' : 'gray'}
                size="sm"
              />
              <span
                className={cn(
                  'text-11 font-bold uppercase tracking-wide',
                  formData.iscompleted
                    ? 'text-green-700'
                    : 'text-gray-500'
                )}
              >
                {formData.iscompleted ? 'Completed' : 'Pending Action'}
              </span>
            </div>
          </div>

          {/* Provider Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-12 uppercase tracking-wider text-gray-400">
                <Tag className="w-4 h-4 text-brand-500" />
                Provider Information
              </h3>
              <Toggle
                checked={formData.hasProvider}
                onChange={(v) => handleToggle('hasProvider', v)}
                className="scale-90"
              />
            </div>

            {formData.hasProvider && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                {Object.keys(formData)
                  .filter(
                    (k) =>
                      k.toLowerCase().startsWith('provider') &&
                      k !== 'hasProvider'
                  )
                  .map((key) => (
                    <div key={key}>
                      <Label className="text-10 font-bold uppercase text-gray-400 mb-1 block">
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())
                          .trim()}
                      </Label>
                      <Input
                        name={key}
                        value={formData[key] || ''}
                        onChange={handleChange}
                        className="h-9 text-13"
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Reminder Section */}
          <div className="bg-orange-50/40 rounded-2xl border border-orange-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-12 uppercase tracking-wider text-orange-700">
                <Bell className="w-4 h-4" />
                Reminder
              </h3>
              <Toggle
                variant="brand"
                checked={formData.hasReminder}
                onChange={(v) => handleToggle('hasReminder', v)}
                className="scale-90"
              />
            </div>

            {formData.hasReminder && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-orange-200">
                {Object.keys(formData)
                  .filter((k) => k.toLowerCase().startsWith('reminder'))
                  .map((key) => (
                    <div key={key}>
                      <Label className="text-10 font-bold uppercase text-gray-400 mb-1 block">
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())
                          .trim()}
                      </Label>
                      <Input
                        name={key}
                        value={formData[key] || ''}
                        onChange={handleChange}
                        className="h-9 text-13"
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 md:px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="px-6">
            Discard
          </Button>
          <Button
            variant="brand"
            onClick={handleSaveInternal}
            className="px-8 text-white shadow-md shadow-brand-100"
          >
            <Save className="w-4 h-4 me-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  )
}
