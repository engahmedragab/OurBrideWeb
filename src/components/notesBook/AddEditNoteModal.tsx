'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { noteFormSchema, type NoteFormData } from '@/schema/note.schema'
import type { NoteLineResponse } from '@/types/responses'

interface AddEditNoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { title: string; note: string }) => void
  editingNote?: NoteLineResponse | null
}

export const AddEditNoteModal = ({
  isOpen,
  onClose,
  onSave,
  editingNote,
}: AddEditNoteModalProps) => {
  const isEditing = !!editingNote

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema) as any,
    defaultValues: { title: '', note: '' },
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (!isOpen) return
    reset({
      title: editingNote?.title ?? '',
      note: editingNote?.note ?? '',
    })
  }, [isOpen, editingNote, reset])

  const submit = (data: NoteFormData) => {
    onSave({ title: data.title, note: data.note })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Note' : 'Add New Note'}>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div>
          <label className="block text-14 font-medium text-gray-900 mb-1.5">
            Notes Name <span className="text-red-500">*</span>
          </label>

          <Input {...register('title')} placeholder="Enter list name" aria-invalid={!!errors.title} />

          {errors.title?.message && (
            <p className="mt-1 text-12 text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-14 font-medium text-gray-900 mb-1.5">
            Note <span className="text-red-500">*</span>
          </label>

          <Textarea
            {...register('note')}
            placeholder="Write your note..."
            rows={8}
            aria-invalid={!!errors.note}
          />

          {errors.note?.message && (
            <p className="mt-1 text-12 text-red-500">{errors.note.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="brand" disabled={isSubmitting} className="text-white">
            {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Note'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
