'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { newEventSchema, type NewEventFormValues } from '@/schema/event.schema'

export interface AddEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  baseDate: Date
  onCreate: (event: {
    startTime: Date
    title: string
    duration: number
  }) => void
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<NewEventFormValues>({
    resolver: zodResolver(newEventSchema),
    defaultValues: {
      title: '',
      time: initialTime,
      duration: initialDuration,
    },
  })

  const titleValue = watch('title')
  const timeValue = watch('time')
  const durationValue = watch('duration')

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  // Update time and duration when initial values change
  useEffect(() => {
    if (open) {
      setValue('time', initialTime)
      setValue('duration', initialDuration)
    }
  }, [open, initialTime, initialDuration, setValue])

  const onSubmit = (data: NewEventFormValues) => {
    const [hours, minutes] = data.time.split(':').map(Number)
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
      title: data.title.trim(),
      duration: parseInt(data.duration, 10),
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="event-title"
            className="text-14 font-medium text-gray-700"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="event-title"
            type="text"
            placeholder="Enter event title"
            {...register('title')}
            variant={errors.title ? 'error' : titleValue ? 'fill' : 'default'}
            errorMessage={errors.title?.message}
            size="lg"
          />
        </div>

        {/* Start Time Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="event-time"
            className="text-14 font-medium text-gray-700"
          >
            Start Time <span className="text-red-500">*</span>
          </label>
          <Input
            id="event-time"
            type="time"
            {...register('time')}
            variant={errors.time ? 'error' : timeValue ? 'fill' : 'default'}
            errorMessage={errors.time?.message}
            size="lg"
          />
        </div>

        {/* Duration Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="event-duration"
            className="text-14 font-medium text-gray-700"
          >
            Duration (minutes) <span className="text-red-500">*</span>
          </label>
          <Input
            id="event-duration"
            type="number"
            placeholder="Enter duration in minutes"
            {...register('duration')}
            min="1"
            variant={
              errors.duration ? 'error' : durationValue ? 'fill' : 'default'
            }
            errorMessage={errors.duration?.message}
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
