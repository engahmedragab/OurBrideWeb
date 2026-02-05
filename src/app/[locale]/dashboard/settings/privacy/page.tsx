'use client'

import { useRouter } from '@/i18n/navigation'
import { ChevronLeft } from 'lucide-react'
import { useI18nTranslations, useIsRTL } from '@/i18n'
import { cn } from '@/lib/utils'

/**
 * Privacy Policy page component
 * Matches Figma design exactly
 */
export default function PrivacyPage() {
  const t = useI18nTranslations('settings.privacy')
  const isRTL = useIsRTL()
  const router = useRouter()

  const handleBack = () => {
    router.push('/dashboard/settings')
  }

  const sections = [
    {
      title: t.raw('sections.informationWeCollect.title'),
      content: t.raw('sections.informationWeCollect.content'),
    },
    {
      title: t.raw('sections.howWeUse.title'),
      content: t.raw('sections.howWeUse.content'),
    },
    {
      title: t.raw('sections.dataProtection.title'),
      content: t.raw('sections.dataProtection.content'),
    },
    {
      title: t.raw('sections.sharingData.title'),
      content: t.raw('sections.sharingData.content'),
    },
    {
      title: t.raw('sections.userRights.title'),
      content: t.raw('sections.userRights.content'),
    },
    {
      title: t.raw('sections.changesToPolicy.title'),
      content: t.raw('sections.changesToPolicy.content'),
    },
  ]

  return (
    <div className="max-w-4xl" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page Header with Back Button */}
      <div className={cn("mb-6 flex items-center gap-2", isRTL && "flex-row-reverse")}>
        <button
          onClick={handleBack}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className={cn("h-6 w-6 text-gray-600", isRTL && "rotate-180")} />
        </button>
        <h1 className="text-20 font-normal text-gray-900">{t('title')}</h1>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col gap-4">
          {sections.map((section, index) => (
            <div key={index} className="flex flex-col gap-2">
              {/* Section Title */}
              <h2 className="text-16 font-medium text-gray-900">
                {section.title}
              </h2>

              {/* Section Content */}
              {Array.isArray(section.content) ? (
                <div className="text-14 font-normal text-gray-600">
                  {section.content.map((paragraph: string, pIndex: number) => (
                    <p key={pIndex} className={pIndex === 0 ? 'mb-0' : ''}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-14 font-normal text-gray-600">
                  {section.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

