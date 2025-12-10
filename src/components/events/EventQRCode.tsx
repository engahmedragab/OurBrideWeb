'use client'

import { useEffect, useRef, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import QRCode from 'qrcode'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import {
  FacebookShareButton,
  WhatsappShareButton,
} from 'react-share'
import { Link, Share2, Facebook, Instagram, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/Toaster'

const eventQRCodeVariants = cva(
  'bg-white rounded-[24px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] flex flex-col gap-6 p-5',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const qrCodeContainerVariants = cva(
  'relative shrink-0 size-[223px] flex items-center justify-center',
  {
    variants: {
      state: {
        default: '',
        loading: 'opacity-50',
        error: 'opacity-75',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

const socialButtonVariants = cva(
  'bg-white border-2 border-brand-500 h-12 w-12 flex items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      state: {
        default: '',
        hovered: 'bg-brand-50',
        pressed: 'scale-[0.98]',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

const actionButtonVariants = cva(
  'flex items-center justify-center gap-2 rounded-[24px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      state: {
        default: 'text-brand-500 hover:text-brand-600 active:opacity-80',
        hovered: 'text-brand-600',
        pressed: 'opacity-80',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

export interface EventQRCodeProps
  extends VariantProps<typeof eventQRCodeVariants> {
  qrData: string
  showEditButton?: boolean
  onEditClick?: () => void
  className?: string
}

/**
 * EventQRCode Component
 * Displays a QR code for event sharing with social media and copy link buttons
 */
export const EventQRCode = ({
  qrData,
  showEditButton = false,
  onEditClick,
  className,
  variant,
}: EventQRCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrLoading, setQrLoading] = useState(true)
  const [facebookButtonState, setFacebookButtonState] = useState<
    'default' | 'hovered' | 'pressed'
  >('default')
  const [instagramButtonState, setInstagramButtonState] = useState<
    'default' | 'hovered' | 'pressed'
  >('default')
  const [whatsappButtonState, setWhatsappButtonState] = useState<
    'default' | 'hovered' | 'pressed'
  >('default')
  const [copyLinkButtonState, setCopyLinkButtonState] = useState<
    'default' | 'hovered' | 'pressed'
  >('default')
  const [shareQRButtonState, setShareQRButtonState] = useState<
    'default' | 'hovered' | 'pressed'
  >('default')
  const { addToast } = useToast()

  useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current || !qrData) return

      try {
        setQrLoading(true)
        // Generate QR code with padding included in the size
        await QRCode.toCanvas(canvasRef.current, qrData, {
          width: 191, // 223px - 32px (16px padding on each side)
          margin: 1,
          color: {
            dark: '#F14836',
            light: '#FFFFFF',
          },
        })
        setQrLoading(false)
      } catch (error) {
        console.error('Error generating QR code:', error)
        setQrLoading(false)
        addToast('Failed to generate QR code', 'error')
      }
    }

    generateQRCode()
  }, [qrData, addToast])

  const handleCopyLink = () => {
    addToast('Link copied to clipboard!', 'success')
  }

  const handleShareQRCode = async () => {
    if (!canvasRef.current) return

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'qr-code.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Event QR Code',
        })
      } else {
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = 'qr-code.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        addToast('QR code downloaded', 'success')
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing QR code:', error)
        addToast('Failed to share QR code', 'error')
      }
    }
  }

  return (
    <div className={cn(eventQRCodeVariants({ variant }), className)}>
      {/* Header */}
      <div className="flex gap-2.5 items-center justify-center w-full">
        {/* Title */}
        <div className="flex-1 flex flex-col font-['Poppins'] font-medium justify-center leading-[24px] text-20 text-gray-900">
          <p className="leading-[24px]">Event Invitation</p>
        </div>

        {/* Edit Button */}
        {showEditButton && (
          <button
            onClick={onEditClick}
            className="font-['Poppins'] font-medium leading-[24px] text-16 text-brand-500 hover:text-brand-600 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md px-2 py-1"
          >
            Edit
          </button>
        )}
      </div>

      {/* QR Code and Actions */}
      <div className="flex-1 flex flex-col  gap-3 items-center justify-between min-h-0 w-full">
        {/* QR Code Container */}
        <div
          className={cn(
            qrCodeContainerVariants({
              state: qrLoading ? 'loading' : 'default',
            })
          )}
        >
          <div className="absolute inset-0 border-2 border-brand-500 rounded-xl" />
          <canvas
            ref={canvasRef}
            className="relative z-10 rounded-xl"
            style={{
              width: 'calc(223px - 32px)',
              height: 'calc(223px - 32px)',
              margin: '16px',
            }}
            aria-label="Event invitation QR code"
          />
        </div>

        {/* Social Share Buttons and Actions */}
        <div className="flex flex-col gap-2 items-center w-full">
          {/* Social Share Buttons Row */}
          <div className="flex gap-2 items-center justify-center w-full">
            {/* Facebook Share Button */}
            <FacebookShareButton url={qrData}>
              <button
                className={cn(socialButtonVariants({ state: facebookButtonState }))}
                onMouseEnter={() => setFacebookButtonState('hovered')}
                onMouseLeave={() => setFacebookButtonState('default')}
                onMouseDown={() => setFacebookButtonState('pressed')}
                onMouseUp={() => setFacebookButtonState('hovered')}
                aria-label="Share on Facebook"
              >
                <Facebook className="size-6 text-brand-500" />
              </button>
            </FacebookShareButton>

            {/* Instagram Share Button */}
            <button
              onClick={() => {
                if (canvasRef.current) {
                  canvasRef.current.toBlob(blob => {
                    if (blob && navigator.share) {
                      const file = new File([blob], 'qr-code.png', {
                        type: 'image/png',
                      })
                      navigator.share({
                        files: [file],
                        title: 'Event QR Code',
                      }).catch(() => {
                        window.open(
                          `https://www.instagram.com/create/story/`,
                          '_blank'
                        )
                      })
                    } else {
                      window.open(
                        `https://www.instagram.com/create/story/`,
                        '_blank'
                      )
                    }
                  })
                }
              }}
              className={cn(socialButtonVariants({ state: instagramButtonState }))}
              onMouseEnter={() => setInstagramButtonState('hovered')}
              onMouseLeave={() => setInstagramButtonState('default')}
              onMouseDown={() => setInstagramButtonState('pressed')}
              onMouseUp={() => setInstagramButtonState('hovered')}
              aria-label="Share on Instagram"
            >
              <Instagram className="size-6 text-brand-500" />
            </button>

            {/* WhatsApp Share Button */}
            <WhatsappShareButton url={qrData}>
              <button
                className={cn(socialButtonVariants({ state: whatsappButtonState }))}
                onMouseEnter={() => setWhatsappButtonState('hovered')}
                onMouseLeave={() => setWhatsappButtonState('default')}
                onMouseDown={() => setWhatsappButtonState('pressed')}
                onMouseUp={() => setWhatsappButtonState('hovered')}
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="size-6 text-brand-500" />
              </button>
            </WhatsappShareButton>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 items-center justify-center w-full">
            {/* Copy Link Button */}
            <CopyToClipboard text={qrData} onCopy={handleCopyLink}>
              <button
                className={cn(actionButtonVariants({ state: copyLinkButtonState }))}
                onMouseEnter={() => setCopyLinkButtonState('hovered')}
                onMouseLeave={() => setCopyLinkButtonState('default')}
                onMouseDown={() => setCopyLinkButtonState('pressed')}
                onMouseUp={() => setCopyLinkButtonState('hovered')}
                aria-label="Copy link"
              >
                <Link className="size-[18px]" />
                <p className="font-['Poppins'] font-medium leading-[24px] text-16">
                  Copy Link
                </p>
              </button>
            </CopyToClipboard>

            {/* Share QR Code Button */}
            <button
              onClick={handleShareQRCode}
              className={cn(actionButtonVariants({ state: shareQRButtonState }))}
              onMouseEnter={() => setShareQRButtonState('hovered')}
              onMouseLeave={() => setShareQRButtonState('default')}
              onMouseDown={() => setShareQRButtonState('pressed')}
              onMouseUp={() => setShareQRButtonState('hovered')}
              aria-label="Share QR code"
            >
              <Share2 className="size-[18px]" />
              <p className="font-['Poppins'] font-medium leading-[24px] text-16">
                Share QR code
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

