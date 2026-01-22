import Image from 'next/image'
import { cn } from '@/lib/utils'
import brandLogo from '@/assets/svg/Brand-logo.svg'
import { useI18nTranslations } from '@/i18n'

export interface LoadingOverlayProps {
  open: boolean
  title?: string
  subtitle?: string
  className?: string
  containerClassName?: string
}

/**
 * LoadingOverlay - Reusable loading overlay component
 * Displays logo, loading text, and optional subtitle
 */
export const LoadingOverlay = ({
  open,
  title ,
  subtitle ,
  className,
  containerClassName,
}: LoadingOverlayProps) => {
 
  const t =useI18nTranslations('common')
  if (!open) return null
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl bg-white p-8 sm:p-10 shadow-lg min-w-[280px] sm:min-w-[320px]',
          containerClassName
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Image
            src={typeof brandLogo === 'string' ? brandLogo : brandLogo.src}
            alt="OurBride Logo"
            width={120}
            height={96}
            className="h-20 w-auto sm:h-24"
          />
        </div>

        {/* Loading Text */}
        <div className="mt-4 sm:mt-5 flex flex-col items-center">
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            {title || t('loading')}
          </p>
          {subtitle ? (
            <p className="mt-2 text-sm sm:text-base text-gray-500">
              {subtitle}
            </p>
          ) : (
            <p className="mt-2 text-sm sm:text-base text-gray-500">
              {t('pleaseWait')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
