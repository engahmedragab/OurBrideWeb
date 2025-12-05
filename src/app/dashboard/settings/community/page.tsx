'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

/**
 * Community Guidelines page component
 * Matches Figma design exactly
 */
export default function CommunityPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/dashboard/settings')
  }

  const sections = [
    {
      title: 'Respect Others',
      content: 'No harassment, hate speech, or offensive content.',
    },
    {
      title: 'Authenticity',
      content: [
        'Provide real and accurate information.',
        'Do not impersonate others.',
      ],
    },
    {
      title: 'Safe Communication',
      content: [
        'Keep conversations respectful.',
        'Calls/messages may be recorded for safety.',
      ],
    },
    {
      title: 'Service Integrity',
      content: [
        'Providers must deliver services as promised.',
        'No direct transactions outside the app.',
      ],
    },
    {
      title: 'Reporting & Consequences',
      content: [
        'Use Report a Problem for issues.',
        'Violations may result in account suspension or removal.',
      ],
    },
  ]

  return (
    <div className="max-w-4xl">
      {/* Page Header with Back Button */}
      <div className="mb-6 flex items-center gap-2">
        <button
          onClick={handleBack}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-20 font-normal text-gray-900">
          Community Guidelines
        </h1>
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
                <div className="text-14 font-normal text-gray-500">
                  {section.content.map((paragraph, pIndex) => (
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

