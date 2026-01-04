'use client'

import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { SelectPopover } from '@/components/ui/SelectPopover'
import { Button } from '@/components/ui/Button'
import type { GuestGroup, GuestGroupId, GuestStatus } from './mockGuests'
import { addGuestFormSchema, type AddGuestFormData } from '@/app/events/planning/invitation/schemas/guest.schema'

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
  const selectableGroups = useMemo(() => {
    return availableGroups.filter(g => {
      const n = Number(g.id)
      return Number.isFinite(n) && n > 0
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
    resolver: zodResolver(addGuestFormSchema) as any,
    defaultValues: {
      categoryMode: forceNewCategory ? 'new' : forcedGroupId ? 'existing' : 'existing',
      lineCategoryId: forcedGroupId ? String(forcedGroupId) : '',
      nickName: '',
      peopleCount: 1,
      status: 'none',
      categoryName: '',
      categorySlug: '',
      categoryDescription: '',
    } as any,
  })

  const categoryMode = watch('categoryMode')
  const lineCategoryId = watch('lineCategoryId')
  const status = watch('status')

  useEffect(() => {
    if (!isOpen) return
    reset({
      categoryMode: forceNewCategory ? 'new' : forcedGroupId ? 'existing' : 'existing',
      lineCategoryId: forcedGroupId ? String(forcedGroupId) : '',
      nickName: '',
      peopleCount: 1,
      status: 'none',
      categoryName: '',
      categorySlug: '',
      categoryDescription: '',
    } as any)
  }, [isOpen, forcedGroupId, forceNewCategory, reset])

  useEffect(() => {
    if (forceNewCategory) {
      setValue('categoryMode', 'new', { shouldValidate: false })
      return
    }
    if (!forcedGroupId) return
    setValue('categoryMode', 'existing', { shouldValidate: false })
    setValue('lineCategoryId', String(forcedGroupId), { shouldValidate: true })
  }, [forcedGroupId, forceNewCategory, setValue])

  const submit = (data: AddGuestFormData | any) => {
    if (data.categoryMode === 'existing') {
      const categoryIdNum = Number(data.lineCategoryId)
      if (!Number.isFinite(categoryIdNum) || categoryIdNum <= 0) return

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

    // new category
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
      title="Add New Guest"
      maxWidth="md"
      containerClassName="w-[calc(100vw-32px)] sm:w-full max-w-[560px]"
      contentClassName="p-4 sm:p-6 max-h-[75vh] overflow-y-auto md:max-h-none md:overflow-visible"
    >
      <form onSubmit={handleSubmit(submit)}>
        <div className="space-y-4">
          {/* Mode Toggle (hidden if forced or forceNewCategory) */}
          {!forcedGroupId && !forceNewCategory && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant={categoryMode === 'existing' ? 'brand' : 'outline'}
                className={categoryMode === 'existing' ? 'text-white' : ''}
                onClick={() => setValue('categoryMode', 'existing' as any)}
              >
                Select Category
              </Button>
              <Button
                type="button"
                variant={categoryMode === 'new' ? 'brand' : 'outline'}
                className={categoryMode === 'new' ? 'text-white' : ''}
                onClick={() => setValue('categoryMode', 'new' as any)}
              >
                New Category
              </Button>
            </div>
          )}

          {/* Category Section */}
          <div>
            <label className="block text-14 font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>

            {forcedGroupId ? (
              <div className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-16 text-gray-700">
                {lockedTitle || 'Selected Category'}
              </div>
            ) : forceNewCategory || categoryMode === 'new' ? (
              <div className="space-y-3">
                <Input
                  {...register('categoryName' as any)}
                  placeholder="Category name"
                  variant={(errors as any).categoryName ? 'error' : 'default'}
                  errorMessage={(errors as any).categoryName?.message}
                  size="md"
                />
                <Input
                  {...register('categorySlug' as any)}
                  placeholder="Slug (optional)"
                  size="md"
                />
                <Input
                  {...register('categoryDescription' as any)}
                  placeholder="Description (optional)"
                  size="md"
                />
              </div>
            ) : categoryMode === 'existing' ? (
              <>
                <SelectPopover
                  value={lineCategoryId}
                  onChange={value => setValue('lineCategoryId', String(value), { shouldValidate: true })}
                  options={selectableGroups.map(g => ({ value: g.id, label: g.title }))}
                  placeholder="Select category"
                />
                {'lineCategoryId' in errors && (errors as any).lineCategoryId?.message && (
                  <p className="mt-1 text-12 text-red-600">{(errors as any).lineCategoryId.message}</p>
                )}

                {selectableGroups.length === 0 && (
                  <p className="mt-2 text-12 text-gray-500">You need to add a category first.</p>
                )}
              </>
            ) : null}
          </div>

          {/* Guest Name */}
          <div>
            <label className="block text-14 font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('nickName')}
              placeholder="Enter guest name"
              variant={errors.nickName ? 'error' : 'default'}
              errorMessage={errors.nickName?.message}
              size="md"
            />
          </div>

          {/* People Count */}
          <div>
            <label className="block text-14 font-medium text-gray-700 mb-2">
              Total People Number <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              {...register('peopleCount')}
              min={1}
              max={20}
              placeholder="Enter number of people"
              variant={errors.peopleCount ? 'error' : 'default'}
              errorMessage={errors.peopleCount?.message}
              size="md"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-14 font-medium text-gray-700 mb-2">Status</label>
            <SelectPopover
              value={status}
              onChange={value => setValue('status', value as any)}
              options={[
                { value: 'none', label: 'None' },
                { value: 'confirmed', label: 'Confirmed' },
              ]}
              placeholder="Select status"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} size="md" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" variant="brand" size="md" className="w-full sm:w-auto text-white">
              Add Guest
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
