'use client'

import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { ItineraryEvent } from './ItineraryEventCard'
import { useI18nTranslations } from '@/i18n'

export interface EditEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  baseDate: Date
  event: ItineraryEvent | null
  onUpdate: (eventId: string, eventData: { startTime: Date; title: string; duration: number }) => void
}

export const EditEventModal = ({
  open,
  onOpenChange,
  baseDate,
  event,
  onUpdate,
}: EditEventModalProps) => {
  const t = useI18nTranslations('userEvents')
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState('')
  const [errors, setErrors] = useState<{
    title?: string
    time?: string
    duration?: string
  }>({})

  useEffect(() => {
    if (event && open) {
      setTitle(event.title)
      const hours = String(event.startTime.getHours()).padStart(2, '0')
      const minutes = String(event.startTime.getMinutes()).padStart(2, '0')
      setTime(`${hours}:${minutes}`)
      setDuration(String(event.duration))
      setErrors({})
    }
  }, [event, open])

  const handleClose = () => {
    setTitle('')
    setTime('')
    setDuration('')
    setErrors({})
    onOpenChange(false)
  }

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!title.trim()) {
      newErrors.title = t('validation.titleRequired')
    }

    if (!time.trim()) {
      newErrors.time = t('validation.timeRequired')
    } else {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(time)) {
        newErrors.time =t('validation.timeInvalid')
      }
    }

    if (!duration.trim()) {
      newErrors.duration =t('validation.durationRequired')
    } else {
      const durationNum = parseInt(duration, 10)
      if (isNaN(durationNum) || durationNum <= 0) {
        newErrors.duration =t('validation.durationPositive')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !event) {
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

    onUpdate(event.id, {
      startTime,
      title: title.trim(),
      duration: parseInt(duration, 10),
    })

    handleClose()
  }

  if (!event) return null

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title={t('editEvent')}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div className="space-y-1.5">
          <label htmlFor="edit-event-title" className="text-14 font-medium text-gray-700">
            {t('title')} <span className="text-red-500">*</span>
          </label>
          <Input
            id="edit-event-title"
            type="text"
            placeholder={t('enterEventTitle')}
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
          <label htmlFor="edit-event-time" className="text-14 font-medium text-gray-700">
            {t('startTime')} <span className="text-red-500">*</span>
          </label>
          <Input
            id="edit-event-time"
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
          <label htmlFor="edit-event-duration" className="text-14 font-medium text-gray-700">
            {t('durationMinutes')} <span className="text-red-500">*</span>
          </label>
          <Input
            id="edit-event-duration"
            type="number"
            placeholder={t('enterDurationMinutes')}
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
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            variant="brand"
            size="md"
            className="text-white"
          >
           {t('saveChanges')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

