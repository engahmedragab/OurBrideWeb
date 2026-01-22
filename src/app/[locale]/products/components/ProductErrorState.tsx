/**
 * Error state component for product pages
 */

'use client'

import Image from 'next/image'
import { useRouter } from '@/i18n/navigation'
import { useI18nTranslations } from '@/i18n'
import pageNotFoundSvg from '@/assets/svg/page-not-found.svg'

interface ProductErrorStateProps {
  title?: string
  message?: string
  backHref?: string
  backLabel?: string
}

export function ProductErrorState({
  title,
  message,
  backHref = '/products',
  backLabel,
}: ProductErrorStateProps) {
  const router = useRouter()
  const tCommon = useI18nTranslations('common')
  const defaultTitle = title || tCommon('productCommon.productNotFound')
  const defaultMessage = message || tCommon('productCommon.productNotFoundMessage')
  const defaultBackLabel = backLabel || tCommon('productCommon.backToProducts')

  const handleBack = () => {
    router.push(backHref)
  }

  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <div className="flex flex-col items-center justify-center w-full max-w-md px-4">
        {/* SVG Illustration */}
        <Image
          src={typeof pageNotFoundSvg === 'string' ? pageNotFoundSvg : pageNotFoundSvg.src}
          alt={defaultTitle}
          width={256}
          height={256}
          className="w-64 h-64 object-contain mb-8"
        />
        {/* Heading */}
        <h2 className="text-18 md:text-22 font-semibold text-gray-900 mb-2 text-center">
          {defaultTitle}
        </h2>
        {/* Subtext */}
        <p className="text-14 text-gray-500 mb-6 text-center">
          {defaultMessage}
        </p>
        {/* Back Button */}
        <button
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-full px-8 py-2 font-semibold text-14 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all"
          onClick={handleBack}
        >
          {defaultBackLabel}
        </button>
      </div>
    </div>
  )
}

