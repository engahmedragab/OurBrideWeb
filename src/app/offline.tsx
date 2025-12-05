"use client"

import offlineSvg from '@/assets/svg/offline.svg'

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center w-full">
        {/* SVG Illustration */}
        <img
          src={typeof offlineSvg === 'string' ? offlineSvg : offlineSvg.src}
          alt="Offline"
          className="w-64 h-64 object-contain mb-8"
        />
        {/* Heading */}
        <h2 className="text-18 md:text-22 font-semibold text-gray-900 mb-1 text-center">You&apos;re Offline</h2>
        {/* Subtext */}
        <p className="text-14 text-gray-500 mb-6 text-center">
          Please check your internet connection and try again
        </p>
        {/* Retry Button */}
        <button
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-full px-8 py-2 font-semibold text-14 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all"
          onClick={handleRetry}
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
