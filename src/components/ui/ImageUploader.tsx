'use client'

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Button } from './Button'
import { LoadingSpinner } from './LoadingSpinner'
import { Upload, X } from 'lucide-react'
import { FilesService } from '@/services/api/filesService'
import { cn } from '@/lib/utils'
import { useToast } from './Toaster'

export interface ImageUploaderProps {
  /** Existing image URL (for edit mode) */
  existingImageUrl?: string
  /** Callback when image is uploaded - receives URL and optional media data */
  onImageUploaded?: (url: string, mediaData?: Record<string, unknown>) => void
  /** Callback when image is removed */
  onImageRemoved?: () => void
  /** Custom className */
  className?: string
  /** Disabled state */
  disabled?: boolean
  /** Upload button text */
  uploadButtonText?: string
  /** Maximum file size in bytes (default: 2MB) */
  maxSize?: number
  /** Show remove button */
  showRemoveButton?: boolean
  /** Image preview size */
  previewSize?: 'sm' | 'md' | 'lg'
  /** Circular image (for profile pictures) */
  circular?: boolean
}

/**
 * Generic Image Uploader Component
 * Handles single image upload with preview and removal
 */
export const ImageUploader: React.FC<ImageUploaderProps> = ({
  existingImageUrl,
  onImageUploaded,
  onImageRemoved,
  className,
  disabled = false,
  uploadButtonText = 'Upload Image',
  maxSize = 2 * 1024 * 1024, // Default 2MB
  showRemoveButton = true,
  previewSize = 'md',
  circular = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImageUrl || null)
  const { addToast } = useToast()

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32 sm:w-40 sm:h-40',
    lg: 'w-48 h-48 sm:w-64 sm:h-64',
  }

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
      addToast(`File size exceeds ${maxSizeMB}MB limit`, 'error')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file', 'error')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    try {
      const result = await FilesService.uploadFile(file)
      
      if (result && result.url) {
        setPreviewUrl(result.url)
        if (onImageUploaded) {
          onImageUploaded(result.url, result.mediaData)
        }
        addToast('Image uploaded successfully', 'success')
      } else {
        throw new Error('No URL returned from upload service. Please check the server response.')
      }
    } catch (error: unknown) {
      const errorResponse = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response 
        : undefined
      
      let errorMessage = 'Failed to upload image. Please try again.'
      
      if (errorResponse?.data?.message) {
        errorMessage = errorResponse.data.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      addToast(errorMessage, 'error')
      // Revert preview on error
      setPreviewUrl(existingImageUrl || null)
    } finally {
      setUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [maxSize, onImageUploaded, existingImageUrl, addToast])

  const handleRemove = useCallback(async () => {
    if (!previewUrl) return

    // Extract filename from URL if possible
    try {
      const urlObj = new URL(previewUrl)
      const pathParts = urlObj.pathname.split('/').filter(Boolean)
      const fileName = pathParts[pathParts.length - 1]
      
      // Try to delete from server if we have a filename
      if (fileName && !fileName.includes('.')) {
        // Likely a fileId, try to delete
        try {
          await FilesService.deleteFile(fileName)
        } catch (error) {
          // Ignore delete errors - file might not exist on server
        }
      }
    } catch (error) {
      // URL parsing failed, skip server deletion
    }

    setPreviewUrl(null)
    if (onImageRemoved) {
      onImageRemoved()
    }
    addToast('Image removed', 'success')
  }, [previewUrl, onImageRemoved, addToast])

  const handleUploadClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className={cn('relative', sizeClasses[previewSize])}>
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              sizes={sizeClasses[previewSize]}
              className={cn('object-cover', circular ? 'rounded-full' : 'rounded-lg')}
            />
            {showRemoveButton && !disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className={cn(
            'w-full h-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300',
            circular ? 'rounded-full' : 'rounded-lg'
          )}>
            {uploading ? (
              <LoadingSpinner size="sm" text="Uploading image..." fullScreen={true} />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {!previewUrl && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUploadClick}
          disabled={disabled || uploading}
          className="mt-4 text-14 font-normal text-brand-500 hover:text-brand-600"
        >
          {uploading ? 'Uploading...' : uploadButtonText}
        </Button>
      )}

      {previewUrl && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUploadClick}
          disabled={uploading}
          className="mt-4 text-14 font-normal text-brand-500 hover:text-brand-600"
        >
          {uploading ? 'Uploading...' : 'Change Image'}
        </Button>
      )}
    </div>
  )
}

