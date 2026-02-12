'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Textarea } from './Textarea'
import { ProblemTypeSelector, type ProblemType } from './ProblemTypeSelector'
import { useI18nTranslations } from '@/i18n'

export interface ReportProblemFormProps {
  onSubmit?: (data: { problemType: ProblemType; description: string }) => void
  className?: string
}

/**
 * ReportProblemForm - Form component for reporting problems
 */
export const ReportProblemForm = ({
  onSubmit,
  className,
}: ReportProblemFormProps) => {
  const t = useI18nTranslations('helpCenter.reportProblem')
  const [selectedProblemType, setSelectedProblemType] =
    useState<ProblemType>('Booking issue')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit({
        problemType: selectedProblemType,
        description,
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-5',
        className
      )}
    >
      {/* Header */}
      <div className="flex w-full flex-col gap-4">
        <h2 className="text-16 lg:text-20 font-normal leading-8 text-gray-900">
          {t('title')}
        </h2>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <h3 className="text-16 font-normal leading-6 text-gray-900">
          {t('heading')}
        </h3>
        <p className="text-16 font-normal leading-6 text-gray-500">
          {t('description')}
        </p>
      </div>

      {/* Problem Type Selector */}
      <ProblemTypeSelector
        selectedType={selectedProblemType}
        onSelect={setSelectedProblemType}
      />

      {/* Description Textarea */}
      <div className="flex flex-col gap-2">
        <label className="text-16 font-normal leading-6 text-gray-900">
          {t('describeLabel')}
        </label>
        <Textarea
          placeholder={t('describePlaceholder')}
          value={description}
          onChange={e => setDescription(e.target.value)}
          variant="default"
          size="lg"
          rows={6}
          className="min-h-[151px] rounded-xl placeholder:text-14 placeholder:text-gray-500 font-normal"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="brand"
        size="lg"
        disabled
        className="w-full rounded-full py-[18px] text-20 font-medium text-white"
      >
        {t('submit')}
      </Button>
    </form>
  )
}
