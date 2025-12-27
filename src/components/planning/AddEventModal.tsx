'use client'

import { useState, useEffect, FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export interface AddEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  baseDate: Date
  onCreate: (event: { startTime: Date; title: string; duration: number }) => void
  initialTime?: string
  initialDuration?: string
}

export const AddEventModal = ({
  open,
  onOpenChange,
  baseDate,
  onCreate,
  initialTime = '',
  initialDuration = '',
}: AddEventModalProps) => {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState(initialTime)
  const [duration, setDuration] = useState(initialDuration)
  const [errors, setErrors] = useState<{
    title?: string
    time?: string
    duration?: string
  }>({})

  const handleClose = () => {
    setTitle('')
    setTime('')
    setDuration('')
    setErrors({})
    onOpenChange(false)
  }

  // Update time and duration when initial values change
  useEffect(() => {
    if (open) {
      setTime(initialTime)
      setDuration(initialDuration)
    }
  }, [open, initialTime, initialDuration])

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!time.trim()) {
      newErrors.time = 'Start time is required'
    } else {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(time)) {
        newErrors.time = 'Invalid time format (use HH:MM)'
      }
    }

    if (!duration.trim()) {
      newErrors.duration = 'Duration is required'
    } else {
      const durationNum = parseInt(duration, 10)
      if (isNaN(durationNum) || durationNum <= 0) {
        newErrors.duration = 'Duration must be a positive number'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const [hours, minutes] = time.split(':').map(Number)
    const startTime = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hours,
      minutes,
      0
    )

    onCreate({
      startTime,
      title: title.trim(),
      duration: parseInt(duration, 10),
    })

    handleClose()
  }

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="Add New Event"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div className="space-y-1.5">
          <label htmlFor="event-title" className="text-14 font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="event-title"
            type="text"
            placeholder="Enter event title"
            value={title}
            onChange={e => {
              setTitle(e.target.value)
              if (errors.title) {
                setErrors(prev => ({ ...prev, title: undefined }))
              }
            }}
            variant={errors.title ? 'error' : title ? 'fill' : 'default'}
            errorMessage={errors.title}
            size="lg"
          />
        </div>

        {/* Start Time Field */}
        <div className="space-y-1.5">
          <label htmlFor="event-time" className="text-14 font-medium text-gray-700">
            Start Time <span className="text-red-500">*</span>
          </label>
          <Input
            id="event-time"
            type="time"
            value={time}
            onChange={e => {
              setTime(e.target.value)
              if (errors.time) {
                setErrors(prev => ({ ...prev, time: undefined }))
              }
            }}
            variant={errors.time ? 'error' : time ? 'fill' : 'default'}
            errorMessage={errors.time}
            size="lg"
          />
        </div>

        {/* Duration Field */}
        <div className="space-y-1.5">
          <label htmlFor="event-duration" className="text-14 font-medium text-gray-700">
            Duration (minutes) <span className="text-red-500">*</span>
          </label>
          <Input
            id="event-duration"
            type="number"
            placeholder="Enter duration in minutes"
            value={duration}
            onChange={e => {
              setDuration(e.target.value)
              if (errors.duration) {
                setErrors(prev => ({ ...prev, duration: undefined }))
              }
            }}
            min="1"
            variant={errors.duration ? 'error' : duration ? 'fill' : 'default'}
            errorMessage={errors.duration}
            size="lg"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outlineBrand"
            size="md"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="brand"
            size="md"
            className="text-white"
          >
            Create Event
          </Button>
        </div>
      </form>
    </Modal>
  )
}

