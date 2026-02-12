'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { newEventSchema, type NewEventFormValues } from '@/schema/event.schema'
import { useI18nTranslations } from '@/i18n/hooks'

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
  const t = useI18nTranslations('eventsPlanning.addEvent')
  const tValidation = useI18nTranslations('eventsPlanning.addEvent.validation')
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
      title={t('modal.title')}
      maxWidth="md"
      containerClassName="max-h-[90vh] flex flex-col"
      contentClassName="flex-1 flex flex-col min-h-0"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4">
        {/* Title Field */}
        <div className="space-y-1.5">
          <label htmlFor="event-title" className="text-14 font-medium text-gray-700">
            {t('modal.fields.titleLabel')} <span className="text-red-500">*</span>
          </label>
          <Input
            id="event-title"
            type="text"
            placeholder={t('modal.placeholders.title')}
            {...register('title')}
            variant={errors.title ? 'error' : titleValue ? 'fill' : 'default'}
            errorMessage={errors.title?.message && tValidation(errors.title?.message as keyof typeof tValidation) }
            size="lg"
          />
        </div>

        {/* Start Time Field */}
        <div className="space-y-1.5">
          <label htmlFor="event-time" className="text-14 font-medium text-gray-700">
            {t('modal.fields.startDateTimeLabel')} <span className="text-red-500">*</span>
          </label>
          <Input
            id="event-time"
            type="time"
            {...register('time')}
            variant={errors.time ? 'error' : timeValue ? 'fill' : 'default'}
            errorMessage={errors.time?.message && tValidation(errors.time?.message as keyof typeof tValidation) }
            size="lg"
          />
        </div>

        {/* Duration Field */}
        <div className="space-y-1.5">
          <label htmlFor="event-duration" className="text-14 font-medium text-gray-700">
            {t('modal.fields.durationLabel')} <span className="text-red-500">*</span>
          </label>
          <Input
            id="event-duration"
            type="number"
            placeholder={t('modal.placeholders.duration')}
            {...register('duration')}
            min="1"
            variant={errors.duration ? 'error' : durationValue ? 'fill' : 'default'}
            errorMessage={errors.duration?.message && tValidation(errors.duration?.message as keyof typeof tValidation)   }
            size="lg"
          />
          </div>
        </div>

        {/* Fixed Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 flex-shrink-0">
          <Button
            type="button"
            variant="outlineBrand"
            size="md"
            onClick={handleClose}
          >
            {t('modal.actions.cancel')}
          </Button>
          <Button
            type="submit"
            variant="brand"
            size="md"
            className="text-white"
          >
            {t('modal.actions.create')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

 