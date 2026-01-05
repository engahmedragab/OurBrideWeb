'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

/**
 * Privacy Policy page component
 * Matches Figma design exactly
 */
export default function PrivacyPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/dashboard/settings')
  }

  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'Name, email, phone, ID (for providers).',
        'Payment details (encrypted).',
      ],
    },
    {
      title: 'How We Use Your Information',
      content: [
        'To manage bookings and payments.',
        'To improve services and personalize offers.',
      ],
    },
    {
      title: 'Data Protection',
      content: [
        'All data is encrypted and stored securely.',
        'We never sell your data to third parties.',
      ],
    },
    {
      title: 'Sharing Data',
      content: [
        'Shared only with providers/clients for booking purposes.',
        'Required by law when necessary.',
      ],
    },
    {
      title: 'User Rights',
      content: [
        'Edit or delete your data at any time.',
        'Request account deletion permanently.',
      ],
    },
    {
      title: 'Changes to Policy',
      content: 'Updates will be notified in-app.',
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
        <h1 className="text-20 font-normal text-gray-900">Privacy Policy</h1>
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
