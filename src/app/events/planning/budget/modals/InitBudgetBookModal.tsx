'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

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
  const [weddingDate, setWeddingDate] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [initialEstimated, setInitialEstimated] = useState<string>('')

  useEffect(() => {
    if (!isOpen) {
      setTitle('')
      setClientName('')
      setWeddingDate('')
      setEventLocation('')
      setInitialEstimated('')
    }
  }, [isOpen])

  const isValid = useMemo(() => {
    return (
      title.trim() !== '' &&
      clientName.trim() !== '' &&
      weddingDate !== '' &&
      eventLocation.trim() !== '' &&
      initialEstimated.trim() !== '' &&
      !isNaN(Number(initialEstimated)) &&
      Number(initialEstimated) > 0
    )
  }, [title, clientName, weddingDate, eventLocation, initialEstimated])

  const handleCreate = useCallback(() => {
    if (!isValid) {
      return
    }

    onCreate({
      title: title.trim(),
      clientName: clientName.trim(),
      weddingDate,
      eventLocation: eventLocation.trim(),
      initialEstimated: Number(initialEstimated),
    })
  }, [title, clientName, weddingDate, eventLocation, initialEstimated, isValid, onCreate])

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
              onChange={(e) => setTitle(e.target.value)}
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
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
              size="lg"
            />
          </div>

          {/* Wedding Date */}
          <div className="space-y-2">
            <label className="block text-14 font-semibold text-gray-900">
              Wedding Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              size="lg"
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
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Enter event location"
              size="lg"
            />
          </div>

          {/* Initial Estimated Budget */}
          <div className="space-y-2">
            <label className="block text-14 font-semibold text-gray-900">
              Initial Estimated Budget (EGP) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={initialEstimated}
              onChange={(e) => setInitialEstimated(e.target.value)}
              placeholder="Enter initial budget"
              min="0"
              step="0.01"
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
              Create Budget Book
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

