'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'

export interface QRCodeProps {
  value: string
  size?: number
  className?: string
}

/**
 * QR Code Component
 * Generates a QR code using an external service or displays a placeholder
 */
export const QRCode = ({ value, size = 200, className }: QRCodeProps) => {
  // Using a QR code API service (you can replace with your preferred service)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`

  return (
    <div className={cn('inline-block', className)}>
      <Image
        src={qrCodeUrl}
        alt="QR Code"
        width={size}
        height={size}
        className="rounded-lg"
        unoptimized
      />
    </div>
  )
}
