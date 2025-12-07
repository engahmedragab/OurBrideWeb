'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ImagePreviewItemProps {
  file: File
  preview: string
  onRemove: () => void
  className?: string
}

/**
 * ImagePreviewItem component
 * Displays a preview of an uploaded image with a remove button
 */
export const ImagePreviewItem = ({
  file,
  preview,
  onRemove,
  className,
}: ImagePreviewItemProps) => {
  return (
    <div className={cn('relative inline-block', className)}>
      <img
        src={preview}
        alt={file.name}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-gray-200"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center shadow-md hover:bg-brand-600 transition-colors"
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  )
}

export interface ImagePreviewListProps {
  images: Array<{ file: File; preview: string }>
  onRemove: (index: number) => void
  className?: string
}

/**
 * ImagePreviewList component
 * Displays a horizontal list of image previews
 */
export const ImagePreviewList = ({
  images,
  onRemove,
  className,
}: ImagePreviewListProps) => {
  if (images.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {images.map((image, index) => (
        <ImagePreviewItem
          key={`${image.file.name}-${index}`}
          file={image.file}
          preview={image.preview}
          onRemove={() => onRemove(index)}
        />
      ))}
    </div>
  )
}

