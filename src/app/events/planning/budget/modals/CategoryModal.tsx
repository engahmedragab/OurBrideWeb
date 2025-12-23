'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { SelectMenu } from '@/components/ui/SelectMenu'
import { Button } from '@/components/ui/Button'
import type { MockBudgetLineCategory } from '../state/mockBudgetData'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    id?: number
    name: string
    description: string | null
    iconName: string | null
    colorName: string | null
  }) => void
  editingCategory?: MockBudgetLineCategory | null
}

const colorOptions = [
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
]

export const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
}: CategoryModalProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [iconName, setIconName] = useState('')
  const [colorName, setColorName] = useState<string>('')

  useEffect(() => {
    if (isOpen && editingCategory) {
      setName(editingCategory.name || '')
      setDescription(editingCategory.description || '')
      setIconName(editingCategory.iconName || '')
      setColorName(editingCategory.colorName || '')
    } else if (!isOpen) {
      setName('')
      setDescription('')
      setIconName('')
      setColorName('')
    }
  }, [isOpen, editingCategory])

  const isValid = useMemo(() => name.trim() !== '', [name])

  const handleSave = useCallback(() => {
    if (!isValid) {
      return
    }

    onSave({
      id: editingCategory?.id,
      name: name.trim(),
      description: description.trim() || null,
      iconName: iconName.trim() || null,
      colorName: colorName || null,
    })

    onClose()
  }, [name, description, iconName, colorName, editingCategory?.id, isValid, onSave, onClose])

  const selectOptions = useMemo(
    () => [
      { label: 'Select color', value: '' },
      ...colorOptions,
    ],
    []
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCategory ? 'Edit Category' : 'Add Category'}
      maxWidth="md"
      footer={
        <div className="flex flex-row gap-3">
          <Button
            variant="gray"
            size="lg"
            onClick={onClose}
            className="flex-1 h-[52px] !rounded-full"
          >
            Cancel
          </Button>
          <Button
            variant="brand"
            size="lg"
            onClick={handleSave}
            disabled={!isValid}
            className="flex-1 h-[52px] !rounded-full text-white"
          >
            Save
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter category name"
            size="lg"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Description
          </label>
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter category description"
            size="lg"
            rows={3}
          />
        </div>

        {/* Icon Name */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Icon Name
          </label>
          <Input
            type="text"
            value={iconName}
            onChange={e => setIconName(e.target.value)}
            placeholder="Enter icon name (e.g., 'makeup', 'camera')"
            size="lg"
          />
        </div>

        {/* Color Name */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">Color</label>
          <SelectMenu
            value={colorName}
            onChange={setColorName}
            options={selectOptions}
            placeholder="Select color"
            size="lg"
          />
        </div>
      </div>
    </Modal>
  )
}
