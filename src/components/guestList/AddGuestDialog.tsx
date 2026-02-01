'use client'

import { useEffect, useMemo } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { SelectPopover } from '@/components/ui/SelectPopover'
import { Button } from '@/components/ui/Button'
import type { GuestGroup, GuestGroupId, GuestStatus } from './mockGuests'
import { addGuestFormSchema, type AddGuestFormData } from '@/schema/guest.schema'
import { useI18nTranslations } from '@/i18n/hooks'

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

interface AddGuestDialogProps {
  isOpen: boolean
  onClose: () => void

  onSubmit: (data:
    | { mode: 'existing'; lineCategoryId: number; nickName: string; peopleCount: number; status: GuestStatus }
    | { mode: 'new'; category: { name: string; slug: string; description?: string }; nickName: string; peopleCount: number; status: GuestStatus }
  ) => void

  availableGroups: GuestGroup[]
  forcedGroupId?: GuestGroupId
  forceNewCategory?: boolean
}

export const AddGuestDialog = ({
  isOpen,
  onClose,
  onSubmit, 
  availableGroups,
  forcedGroupId,
  forceNewCategory = false,
}: AddGuestDialogProps) => {
  const t = useI18nTranslations('eventsPlanning.guestList')
  const tValidation = useI18nTranslations('eventsPlanning.guestList.dialog.validation')
  const selectableGroups = useMemo(() => {
    // Show all available groups/tables, including temporary ones (negative IDs for new items)
    // The parent already filters out 'uncategorized', so we return all available groups
    // Just ensure we have valid groups with id (title can be empty)
    return availableGroups.filter(g => {
      // Ensure group exists and has valid id (can be string, number, or negative number)
      if (!g) return false
      if (g.id === undefined || g.id === null || g.id === '') return false
      // Allow all valid IDs: positive numbers, negative numbers (temp), or strings
      return true
    })
  }, [availableGroups])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddGuestFormData>({
    resolver: zodResolver(addGuestFormSchema) as never,
    defaultValues: (forceNewCategory
      ? {
          categoryMode: 'new' as const,
          categoryName: '',
          categorySlug: '',
          categoryDescription: '',
          nickName: '',
          peopleCount: 1,
          status: 'none' as const,
        }
      : {
          categoryMode: 'existing' as const,
          lineCategoryId: forcedGroupId ? String(forcedGroupId) : '',
          nickName: '',
          peopleCount: 1,
          status: 'none' as const,
        }) as AddGuestFormData,
  })

  const categoryMode = watch('categoryMode')
  const lineCategoryId = watch('lineCategoryId')
  const status = watch('status')

  useEffect(() => {
    if (!isOpen) return
    reset(
      (forceNewCategory
        ? {
            categoryMode: 'new' as const,
            categoryName: '',
            categorySlug: '',
            categoryDescription: '',
            nickName: '',
            peopleCount: 1,
            status: 'none' as const,
          }
        : {
            categoryMode: 'existing' as const,
            lineCategoryId: forcedGroupId ? String(forcedGroupId) : '',
            nickName: '',
            peopleCount: 1,
            status: 'none' as const,
          }) as AddGuestFormData
    )
  }, [isOpen, forcedGroupId, forceNewCategory, reset])

  useEffect(() => {
    if (forceNewCategory) {
      setValue('categoryMode', 'new', { shouldValidate: false })
      return
    }
    if (!forcedGroupId) {
      // If no tables available, automatically switch to new mode
      if (selectableGroups.length === 0) {
        setValue('categoryMode', 'new', { shouldValidate: false })
      }
      return
    }
    setValue('categoryMode', 'existing', { shouldValidate: false })
    setValue('lineCategoryId', String(forcedGroupId), { shouldValidate: true })
  }, [forcedGroupId, forceNewCategory, setValue, selectableGroups.length])

  const submit: SubmitHandler<AddGuestFormData> = (data) => {
    if (data.categoryMode === 'existing') {
      const categoryIdStr = String(data.lineCategoryId || '')
      // Handle both numeric IDs (positive/negative) and string IDs (like "tmp-0")
      const categoryIdNum = Number(categoryIdStr)

      // If it's a valid number (positive or negative), use it
      // Otherwise, it might be a string ID like "tmp-0" which we need to handle differently
      if (Number.isFinite(categoryIdNum) && categoryIdNum !== 0) {
        onSubmit({
          mode: 'existing',
          lineCategoryId: categoryIdNum,
          nickName: data.nickName.trim(),
          peopleCount: data.peopleCount,
          status: data.status,
        })
        onClose()
        return
      }

      // If it's not a valid number, it might be a string ID - try to find the group
      const selectedGroup = selectableGroups.find(g => String(g.id) === categoryIdStr)
      if (selectedGroup) {
        // Try to extract numeric ID from the group
        const groupIdNum = Number(selectedGroup.id)
        if (Number.isFinite(groupIdNum) && groupIdNum !== 0) {
          onSubmit({
            mode: 'existing',
            lineCategoryId: groupIdNum,
            nickName: data.nickName.trim(),
            peopleCount: data.peopleCount,
            status: data.status,
          })
          onClose()
          return
        }
      }

      // If we can't find a valid ID, don't submit
      return
    }

    // new table
    const finalSlug = (data.categorySlug?.trim() || slugify(data.categoryName)).trim()
    if (!finalSlug) return

    onSubmit({
      mode: 'new',
      category: {
        name: data.categoryName.trim(),
        slug: finalSlug,
        description: data.categoryDescription?.trim() || undefined,
      },
      nickName: data.nickName.trim(),
      peopleCount: data.peopleCount,
      status: data.status,
    })
    onClose()
  }

  const lockedTitle =
    forcedGroupId ? availableGroups.find(g => g.id === forcedGroupId)?.title : null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('dialog.title')}
      maxWidth="md"
      containerClassName="w-[calc(100vw-32px)] sm:w-full max-w-[560px]"
      contentClassName="p-4 sm:p-6 max-h-[75vh] overflow-y-auto md:max-h-none md:overflow-visible"
    >
      <form onSubmit={handleSubmit(submit)}>
        <div className="space-y-4">
          {/* Mode Toggle (hidden if forced, forceNewCategory, or no tables available) */}
          {!forcedGroupId && !forceNewCategory && selectableGroups.length > 0 && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant={categoryMode === 'existing' ? 'brand' : 'outline'}
                className={categoryMode === 'existing' ? 'text-white' : ''}
                onClick={() => setValue('categoryMode', 'existing' as const)}
              >
                {t('dialog.mode.selectTable')}
              </Button>
              <Button
                type="button"
                variant={categoryMode === 'new' ? 'brand' : 'outline'}
                className={categoryMode === 'new' ? 'text-white' : ''}
                onClick={() => setValue('categoryMode', 'new' as const)}
              >
                {t('dialog.mode.newTable')}
              </Button>
            </div>
          )}

          {/* Message when no tables available */}
          {!forcedGroupId && !forceNewCategory && selectableGroups.length === 0 && (
            <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-14 text-blue-700 font-medium">{t('dialog.mode.noTablesTitle')}</p>
              <p className="text-12 text-blue-600 mt-1">{t('dialog.mode.noTablesSubtitle')}</p>
            </div>
          )}

          {/* Table Section */}
          <div>
            <label className="block text-14 font-medium text-gray-700 mb-2">
              {t('dialog.fields.tableLabel')} <span className="text-red-500">*</span>
            </label>

            {forcedGroupId ? (
              <div className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-16 text-gray-700">
                {lockedTitle || t('dialog.placeholders.selectTable')}
              </div>
            ) : forceNewCategory || categoryMode === 'new' ? (
              <div className="space-y-3">
                <Input
                  {...register('categoryName')}
                  placeholder={t('dialog.placeholders.tableName')}
                  variant={categoryMode === 'new' && 'categoryName' in errors && errors.categoryName ? 'error' : 'default'}
                  errorMessage={categoryMode === 'new' && 'categoryName' in errors && errors.categoryName ? errors.categoryName.message && tValidation('categoryNameMin') : undefined}
                  size="md"
                />
                <Input
                  {...register('categorySlug')}
                  placeholder={t('dialog.placeholders.slugOptional')}
                  size="md"
                />
                <Input
                  {...register('categoryDescription')}
                  placeholder={t('dialog.placeholders.descriptionOptional')}
                  size="md"
                />
              </div>
            ) : categoryMode === 'existing' ? (
              <>
                <SelectPopover
                  value={lineCategoryId || ''}
                  onChange={value => setValue('lineCategoryId', String(value), { shouldValidate: true })}
                  options={selectableGroups.map(g => ({
                    value: String(g.id),
                    label: (g.title && g.title.trim()) || t('dialog.placeholders.untitledTable')
                  }))}
                  placeholder={t('dialog.placeholders.selectTable')}
                />
                {categoryMode === 'existing' && 'lineCategoryId' in errors && errors.lineCategoryId && (
                  <p className="mt-1 text-12 text-red-600">{errors.lineCategoryId.message && tValidation('categoryRequired')}</p>
                )}

                {selectableGroups.length === 0 && (
                  <p className="mt-2 text-12 text-gray-500">{t('dialog.mode.needToAddTable')}</p>
                )}
              </>
            ) : null}
          </div>

          {/* Guest Name */}
          <div>
            <label className="block text-14 font-medium text-gray-700 mb-2">
              {t('dialog.fields.nameLabel')} <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('nickName')}
              placeholder={t('dialog.placeholders.guestName')}
              variant={errors.nickName ? 'error' : 'default'}
              errorMessage={errors.nickName?.message && tValidation('guestNameMin')}
              size="md"
            />
          </div>

          {/* People Count */}
          <div>
            <label className="block text-14 font-medium text-gray-700 mb-2">
              {t('dialog.fields.peopleCountLabel')} <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              {...register('peopleCount')}
              min={1}
              max={20}
              placeholder={t('dialog.placeholders.peopleCount')}
              variant={errors.peopleCount ? 'error' : 'default'}
              errorMessage={errors.peopleCount?.message && tValidation('peopleMin')}
              size="md"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-14 font-medium text-gray-700 mb-2">{t('dialog.fields.statusLabel')}</label>
            <SelectPopover
              value={status}
              onChange={value => setValue('status', value as 'none' | 'confirmed')}
              options={[
                { value: 'none', label: t('status.none') },
                { value: 'confirmed', label: t('status.confirmed') },
              ]}
              placeholder={t('dialog.placeholders.selectStatus')}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} size="md" className="w-full sm:w-auto">
              {t('dialog.actions.cancel')}
            </Button>
            <Button type="submit" variant="brand" size="md" className="w-full sm:w-auto text-white">
              {t('dialog.actions.submit')}
            </Button>
          </div>
        </div>  
      </form>
    </Modal>
  )
}
