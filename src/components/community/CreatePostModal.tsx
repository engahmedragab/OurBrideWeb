'use client'

import { useState, useRef, useCallback } from 'react'
import NextImage from 'next/image'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Image, Video, List, ChevronDown, X, Sparkles, Loader2 } from 'lucide-react'
import { createPost } from '@/services/api/postsApi'
import { FilesService } from '@/services/api/filesService'
import type { CreatePostRequest } from '@/../client/common/api/gen/ourbride-api'
import { useToast } from '@/components/ui/Toaster'
import { useQueryClient } from '@tanstack/react-query'
import { useI18nTranslations } from '@/i18n' // ✅ add

export interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser?: {
    name: string
    avatar: string
  }
  onPostCreated?: () => void
}

/**
 * AI Content Generation Service
 * This is a placeholder - replace with actual AI API endpoint when available
 */
const generateAIContent = async (prompt: string): Promise<string> => {
  // TODO: Replace with actual AI API endpoint
  // For now, return a simple generated content based on prompt
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple content generation (replace with actual AI call)
      const generated = `Here's a thoughtful post about "${prompt}":\n\n${prompt} is something that many people find interesting and worth sharing. This topic brings together different perspectives and experiences that can inspire meaningful conversations in our community.\n\nWhat are your thoughts on this? Share your experiences below! 💭`
      resolve(generated)
    }, 1500) // Simulate API delay
  })
}

export const CreatePostModal = ({
  isOpen,
  onClose,
  currentUser = {
    name: 'User',
    avatar: 'https://via.placeholder.com/100',
  },
  onPostCreated,
}: CreatePostModalProps) => {
  const t = useI18nTranslations('community') // ✅ add

  const [postContent, setPostContent] = useState('')
  const [postTitle, setPostTitle] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState<string[]>([])
  const [isPosting, setIsPosting] = useState(false)
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [privacy, setPrivacy] = useState<'Public' | 'Friends' | 'Private'>('Public')
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToast()
  const queryClient = useQueryClient()

  const handleImageUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const filesArray = Array.from(files)
    const maxImages = 10
    const remainingSlots = maxImages - imageUrls.length

    if (filesArray.length > remainingSlots) {
      addToast(
        t('createPostModal.toasts.uploadLimit', { max: maxImages, count: remainingSlots }),
        'warning'
      )
      filesArray.splice(remainingSlots)
    }

    setUploadingImages(prev => [...prev, ...filesArray.map(f => f.name)])

    try {
      const uploadPromises = filesArray.map(async (file) => {
        try {
          const result = await FilesService.uploadFile(file)
          return result.url
        } catch (error) {
          addToast(t('createPostModal.toasts.uploadFileFail', { fileName: file.name }), 'error')
          return null
        }
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      const validUrls = uploadedUrls.filter((url): url is string => url !== null)

      setImageUrls(prev => [...prev, ...validUrls])
      addToast(t('createPostModal.toasts.uploadSuccess', { count: validUrls.length }), 'success')
    } catch (error) {
      addToast(t('createPostModal.toasts.uploadFail'), 'error')
    } finally {
      setUploadingImages([])
    }
  }, [imageUrls.length, addToast, t])

  const handleRemoveImage = useCallback((index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleGenerateContent = useCallback(async () => {
    if (!postTitle.trim() && !postContent.trim()) {
      addToast(t('createPostModal.toasts.generateNeedInput'), 'warning')
      return
    }

    setIsGeneratingContent(true)
    try {
      const prompt = postTitle.trim() || postContent.trim() || 'wedding planning'
      const generatedContent = await generateAIContent(prompt)
      setPostContent(generatedContent)
      addToast(t('createPostModal.toasts.generateSuccess'), 'success')
    } catch (error) {
      addToast(t('createPostModal.toasts.generateFail'), 'error')
    } finally {
      setIsGeneratingContent(false)
    }
  }, [postTitle, postContent, addToast, t])

  const handlePost = useCallback(async () => {
    if (!postTitle.trim() && !postContent.trim()) {
      addToast(t('createPostModal.toasts.postNeedInput'), 'warning')
      return
    }

    setIsPosting(true)
    try {
      const postData: CreatePostRequest = {
        title:
          postTitle.trim() ||
          postContent.trim().substring(0, 100) ||
          t('createPostModal.fallback.newPostTitle'),
        content: postContent.trim() || null,
        summary: postContent.trim().substring(0, 200) || null,
        isPublished: true,
        isFeatured: false,
        isPinned: false,
        allowComments: true,
        isAnonymous: false,
        imageUrls: imageUrls.length > 0 ? imageUrls : null,
      }

      const createdPost = await createPost(postData)

      if (createdPost) {
        addToast(t('createPostModal.toasts.postSuccess'), 'success')
        queryClient.invalidateQueries({ queryKey: ['posts'] })
        queryClient.invalidateQueries({ queryKey: ['unified-content'] })

        setPostContent('')
        setPostTitle('')
        setImageUrls([])

        if (onPostCreated) onPostCreated()
        onClose()
      } else {
        throw new Error(t('createPostModal.toasts.postNoResponse'))
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t('createPostModal.toasts.postFail')
      addToast(errorMessage, 'error')
    } finally {
      setIsPosting(false)
    }
  }, [postTitle, postContent, imageUrls, addToast, queryClient, onPostCreated, onClose, t])

  const handleClose = useCallback(() => {
    if (isPosting) return

    setPostContent('')
    setPostTitle('')
    setImageUrls([])
    setUploadingImages([])
    onClose()
  }, [isPosting, onClose])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      containerClassName="!p-0"
      headerClassName="!p-0 !border-0"
      contentClassName="!p-0"
      showCloseButton={false}
    >
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <h2 className="text-20 font-normal text-gray-900">
          {t('createPostModal.title')}
        </h2>

        <button
          onClick={handleClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={t('createPostModal.aria.close')}
          disabled={isPosting}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 pb-4">
        {/* User Info Section */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
            {currentUser.avatar && currentUser.avatar !== 'https://via.placeholder.com/100' ? (
              <NextImage
                src={currentUser.avatar}
                alt={currentUser.name}
                fill
                sizes="40px"
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : null}
            {(!currentUser.avatar || currentUser.avatar === 'https://via.placeholder.com/100') && (
              <div className="w-full h-full flex items-center justify-center bg-brand-100">
                <span className="text-14 font-semibold text-brand-600">
                  {currentUser.name.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className="text-14 font-normal text-gray-900">{currentUser.name}</p>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
                className="flex items-center gap-1 text-14 text-brand-500 hover:text-brand-600 transition-colors"
                disabled={isPosting}
              >
                <span>
                  {privacy === 'Public'
                    ? t('createPostModal.privacy.public')
                    : privacy === 'Friends'
                      ? t('createPostModal.privacy.friends')
                      : t('createPostModal.privacy.private')}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showPrivacyMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                  <button
                    type="button"
                    onClick={() => {
                      setPrivacy('Public')
                      setShowPrivacyMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-14 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {t('createPostModal.privacy.public')}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPrivacy('Friends')
                      setShowPrivacyMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-14 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {t('createPostModal.privacy.friends')}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPrivacy('Private')
                      setShowPrivacyMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-14 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {t('createPostModal.privacy.private')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mb-4"></div>

        {/* Post Title Input */}
        <div className="mb-4">
          <input
            type="text"
            value={postTitle}
            onChange={e => setPostTitle(e.target.value)}
            placeholder={t('createPostModal.fields.titlePlaceholder')}
            className="w-full px-0 py-2 border-0 bg-transparent focus:outline-none text-16 font-medium text-gray-900 placeholder:text-gray-400"
            disabled={isPosting}
          />
        </div>

        {/* Post Content Input */}
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
          placeholder={t('createPostModal.fields.contentPlaceholder', { name: currentUser.name })}
          className="w-full min-h-[200px] px-0 py-2 border-0 bg-transparent focus:outline-none text-14 text-gray-900 placeholder:text-gray-400 resize-none"
          disabled={isPosting}
        />

        {/* Image Preview Grid */}
        {imageUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
              >
                <NextImage
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 200px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isPosting}
                  aria-label={t('createPostModal.aria.removeImage')}
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-gray-200 mt-4 mb-4"></div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={e => handleImageUpload(e.target.files)}
              accept="image/*"
              multiple
              className="hidden"
              disabled={isPosting || imageUrls.length >= 10}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPosting || imageUrls.length >= 10}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={t('createPostModal.aria.uploadImage')}
              title={
                imageUrls.length >= 10
                  ? t('createPostModal.tooltips.maxImages', { max: 10 })
                  : t('createPostModal.tooltips.uploadImage')
              }
            >
              <Image className="h-5 w-5 text-gray-500" />
            </button>

            <button
              type="button"
              onClick={handleGenerateContent}
              disabled={isPosting || isGeneratingContent}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={t('createPostModal.aria.generateAi')}
              title={t('createPostModal.tooltips.generateAi')}
            >
              {isGeneratingContent ? (
                <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5 text-gray-500" />
              )}
            </button>

            <button
              type="button"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={t('createPostModal.aria.addReels')}
              disabled={isPosting}
              title={t('createPostModal.tooltips.addVideoComingSoon')}
            >
              <Video className="h-5 w-5 text-gray-500" />
            </button>

            <button
              type="button"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={t('createPostModal.aria.textFormat')}
              disabled={isPosting}
              title={t('createPostModal.tooltips.textFormatComingSoon')}
            >
              <List className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <Button
            onClick={handlePost}
            variant="brand"
            className="px-6 py-2 rounded-lg text-white font-normal"
            disabled={(!postTitle.trim() && !postContent.trim()) || isPosting}
          >
            {isPosting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('createPostModal.buttons.posting')}
              </>
            ) : (
              t('createPostModal.buttons.post')
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
