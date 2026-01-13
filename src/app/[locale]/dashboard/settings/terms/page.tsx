'use client'

import { useRouter } from '@/i18n/navigation'
import { ChevronLeft } from 'lucide-react'

/**
 * Terms & Conditions page component
 * Matches Figma design exactly
 */
export default function TermsPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/dashboard/settings')
  }

  const sections = [
    {
      title: 'Introduction',
      content:
        'By using OurBride, you agree to the following terms and conditions.',
    },
    {
      title: 'Account Usage',
      content: [
        'Users must provide accurate personal information.',
        'You are responsible for keeping your account secure.',
      ],
    },
    {
      title: 'Bookings & Services',
      content: [
        'Bookings depend on provider availability.',
        "Cancellations and refunds follow each provider's policy.",
      ],
    },
    {
      title: 'Payments & Fees',
      content: [
        'All payments must be made through the app.',
        'OurBride deducts a 2% commission from provider earnings monthly.',
      ],
    },
    {
      title: 'Content & Community',
      content: [
        'Users must not post offensive or harmful content.',
        'OurBride reserves the right to remove any inappropriate material.',
      ],
    },
    {
      title: 'Privacy & Security',
      content: [
        'We protect your data under our Privacy Policy.',
        'Identity verification is required for providers.',
      ],
    },
    {
      title: 'Liability',
      content: [
        'OurBride is not responsible for direct agreements made outside the platform.',
        'Any disputes must follow our dispute resolution process.',
      ],
    },
    {
      title: 'Changes to Terms',
      content: [
        'OurBride may update these terms at any time.',
        'Continued use of the app means you accept the updated terms.',
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
          Terms & Conditions
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
                <div className="text-14 font-normal text-gray-600">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className={pIndex === 0 ? 'mb-0' : ''}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-14 font-normal text-gray-600">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

