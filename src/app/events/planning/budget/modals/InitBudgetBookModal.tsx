'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/ui/DatePicker'

interface InitBudgetBookModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: {
    title: string
    clientName: string
    weddingDate: string
    eventLocation: string
    initialEstimated: number
  }) => void
}

export const InitBudgetBookModal = ({
  isOpen,
  onClose,
  onCreate,
}: InitBudgetBookModalProps) => {
  const [title, setTitle] = useState('')
  const [clientName, setClientName] = useState('')
  const [weddingDate, setWeddingDate] = useState<Date | null>(null)
  const [eventLocation, setEventLocation] = useState('')
  const [initialEstimated, setInitialEstimated] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setTitle('')
      setClientName('')
      setWeddingDate(null)
      setEventLocation('')
      setInitialEstimated('')
    }
  }, [isOpen])

  const cleanInitialEstimated = useMemo(
    () => initialEstimated.replace(/\s*EGP\s*/gi, '').trim(),
    [initialEstimated]
  )

  const isValid = useMemo(
    () =>
      title.trim() !== '' &&
      clientName.trim() !== '' &&
      weddingDate !== null &&
      eventLocation.trim() !== '' &&
      cleanInitialEstimated !== '',
    [title, clientName, weddingDate, eventLocation, cleanInitialEstimated]
  )

  const handleCreate = useCallback(() => {
    const numericValue = cleanInitialEstimated.replace(/,/g, '')

    if (!isValid || !weddingDate) {
      return
    }

    onCreate({
      title: title.trim(),
      clientName: clientName.trim(),
      weddingDate: weddingDate.toISOString(),
      eventLocation: eventLocation.trim(),
      initialEstimated: parseFloat(numericValue) || 0,
    })

    onClose()
  }, [
    title,
    clientName,
    weddingDate,
    eventLocation,
    cleanInitialEstimated,
    isValid,
    onCreate,
    onClose,
  ])

  const handleInitialEstimatedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9,]/g, '').replace(/\s*EGP\s*/gi, '')
      setInitialEstimated(value)
    },
    []
  )

  const handleDateChange = useCallback((date: Date | string | undefined) => {
    if (!date) {
      setWeddingDate(null)
      return
    }
    setWeddingDate(date instanceof Date ? date : new Date(date))
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Initialize Budget Book"
      maxWidth="md"
    >
      <div className="flex flex-col">
        <div className="space-y-6 pb-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter budget title"
            size="lg"
          />
        </div>

        {/* Client Name */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Client Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
            placeholder="Enter client name"
            size="lg"
          />
        </div>

        {/* Wedding Date */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Wedding Date <span className="text-red-500">*</span>
          </label>
          <DatePicker
            value={weddingDate || undefined}
            onChange={handleDateChange}
            placeholder="Select wedding date"
            size="lg"
            required
          />
        </div>

        {/* Event Location */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Event Location <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={eventLocation}
            onChange={e => setEventLocation(e.target.value)}
            placeholder="Enter event location"
            size="lg"
          />
        </div>

        {/* Initial Estimated */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Initial Estimated Budget <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={initialEstimated ? `${initialEstimated} EGP` : ''}
            onChange={handleInitialEstimatedChange}
            placeholder="0 EGP"
            size="lg"
          />
        </div>
        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 pt-4 border-t border-gray-100 -mx-6 px-6 bg-white rounded-b-2xl">
          <div className="flex flex-row gap-3">
            <Button
              variant="gray"
              size="md"
              onClick={onClose}
              className="flex-1 h-[44px] !rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              size="md"
              onClick={handleCreate}
              disabled={!isValid}
              className="flex-1 h-[44px] !rounded-full text-white"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
