'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { useI18nTranslations } from '@/i18n'
import supportImage from '@/assets/images/support.png'

export interface LiveChatSectionProps {
  onStartChat?: () => void
  className?: string
}

/**
 * LiveChatSection - Component for live chat support section
 */
export const LiveChatSection = ({
  onStartChat,
  className,
}: LiveChatSectionProps) => {
  const t = useI18nTranslations('helpCenter.liveChat')

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-3xl border border-gray-200 bg-white p-5',
        className
      )}
    >
      {/* Header */}
      <div className="flex w-full flex-col gap-4">
        <h2 className="text-20 font-normal leading-8 text-gray-900">
          {t('title')}
        </h2>
      </div>

      {/* Icon */}
      <div className="relative h-[190px] w-[190px] flex-shrink-0">
        <div className="absolute inset-[2.5%] flex items-center justify-center">
          <Image
            src={
              typeof supportImage === 'object' && 'src' in supportImage
                ? supportImage.src
                : String(supportImage)
            }
            alt="Support"
            fill
            sizes="190px"
            className="object-contain"
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-20 font-normal leading-6 text-gray-900">
        {t('heading')}
      </h3>

      {/* Description */}
      <p className="text-center text-16 font-normal leading-6 text-gray-500">
        {t('description')}
      </p>

      {/* Start Chat Button */}
      <Button
        variant="brand"
        size="lg"
        onClick={onStartChat}
        disabled
        className="w-full rounded-full py-[18px] text-20 font-medium text-white"
      >
        {t('startChat')}
      </Button>
    </div>
  )
}
