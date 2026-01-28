'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui'
import { Input } from '@/components/ui'
import { Button } from '@/components/ui'
import { Textarea } from '@/components/ui'
import { DatePicker } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { WeddingEventCreateRequest } from '@/../client/common/api/gen/ourbride-api'
import { useI18nTranslations } from '@/i18n/hooks'

export interface AddEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: WeddingEventCreateRequest) => void
}

/**
 * AddEventModal Component
 * Modal for creating a new wedding event
 */
export const AddEventModal = ({
  isOpen,
  onClose,
  onSubmit,
}: AddEventModalProps) => {
  const t = useI18nTranslations('eventsPlanning.addEvent')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [endTime, setEndTime] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  // Combine date and time into ISO string
  const combineDateTime = (date: Date | undefined, time: string): string | null => {
    if (!date) return null
    if (!time) {
      // If no time provided, use start of day
      return date.toISOString()
    }

    const [hours, minutes] = time.split(':').map(Number)
    const combined = new Date(date)
    combined.setHours(hours || 0, minutes || 0, 0, 0)
    return combined.toISOString()
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      return
    }

    const data: WeddingEventCreateRequest = {
      title: title.trim(),
      description: description.trim() || null,
      startDate: combineDateTime(startDate, startTime),
      endDate: combineDateTime(endDate, endTime),
      isDefault: isDefault,
    }

    onSubmit?.(data)
    handleReset()
    onClose()
  }

  const handleReset = () => {
    setTitle('')
    setDescription('')
    setStartDate(undefined)
    setStartTime('')
    setEndDate(undefined)
    setEndTime('')
    setIsDefault(false)
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('modal.title')}
      maxWidth="md"
      containerClassName="p-5"
      headerClassName="px-0 pb-0 flex items-center justify-between gap-2.5"
      contentClassName="px-0 pt-4"
    >
      <div className="flex flex-col gap-4">
        {/* Title Input - Required */}
        <div className="flex flex-col gap-2">
          <label className="text-14 font-normal text-gray-900">
            {t('modal.fields.titleLabel')} <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder={t('modal.placeholders.title')}
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="h-auto px-4 py-3 text-14"
            required
          />
        </div>

        {/* Description Textarea - Optional */}
        <div className="flex flex-col gap-2">
          <label className="text-14 font-normal text-gray-900">
            {t('modal.fields.descriptionLabel')}
          </label>
          <Textarea
            placeholder={t('modal.placeholders.description')}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="min-h-[100px] px-4 py-3 text-14 resize-none"
            rows={4}
          />
        </div>

        {/* Start Date and Time */}
        <div className="flex flex-col gap-2">
          <label className="text-14 font-normal text-gray-900">
            {t('modal.fields.startDateTimeLabel')}
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <DatePicker
                value={startDate}
                onChange={date => setStartDate(date instanceof Date ? date : undefined)}
                placeholder={t('modal.placeholders.startDate')}
                className="w-full"
              />
            </div>
            <div className="w-32">
              <Input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                placeholder={t('modal.placeholders.time')}
                className="h-auto px-4 py-3 text-14"
              />
            </div>
          </div>
        </div>

        {/* End Date and Time */}
        <div className="flex flex-col gap-2">
          <label className="text-14 font-normal text-gray-900">
            {t('modal.fields.endDateTimeLabel')}
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <DatePicker
                value={endDate}
                onChange={date => setEndDate(date instanceof Date ? date : undefined)}
                placeholder={t('modal.placeholders.endDate')}
                className="w-full"
              />
            </div>
            <div className="w-32">
              <Input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                placeholder={t('modal.placeholders.time')}
                className="h-auto px-4 py-3 text-14"
              />
            </div>
          </div>
        </div>

        {/* Is Default Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            checked={isDefault}
            onChange={e => setIsDefault(e.target.checked)}
            className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
          />
          <label htmlFor="isDefault" className="text-14 font-normal text-gray-900 cursor-pointer">
              {t('modal.fields.defaultLabel')}
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-6"
          >
            {t('modal.actions.cancel')}
          </Button>
          <Button
            variant="brand"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="px-6 text-white"
          >
            {t('modal.actions.create')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

