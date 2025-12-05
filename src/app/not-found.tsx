"use client"

import pageNotFoundSvg from '@/assets/svg/page-not-found.svg'
import { useRouter } from 'next/navigation'

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center w-full">
        {/* SVG Illustration */}
        <img
          src={typeof pageNotFoundSvg === 'string' ? pageNotFoundSvg : pageNotFoundSvg.src}
          alt="Page Not Found"
          className="w-64 h-64 object-contain mb-8"
        />
        {/* Heading */}
        <h2 className="text-18 md:text-22 font-semibold text-gray-900 mb-1 text-center">404 &mdash; Page Not Found</h2>
        {/* Subtext */}
        <p className="text-14 text-gray-500 mb-6 text-center">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        {/* Back to Home Button */}
        <button
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-full px-8 py-2 font-semibold text-14 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all"
          onClick={() => router.push('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
