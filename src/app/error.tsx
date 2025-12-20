"use client"

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import orderEmptySvg from '@/assets/svg/something-wrong.svg'

export default function ErrorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center w-full">
        {/* SVG Illustration */}
        <Image
          src={typeof orderEmptySvg === 'string' ? orderEmptySvg : orderEmptySvg.src}
          alt="Something went wrong"
          width={256}
          height={256}
          className="w-64 h-64 object-contain mb-8"
        />
        {/* Header */}
        <h2 className="text-18 md:text-22 font-semibold text-gray-900 mb-1 text-center">
          Oops! Something went wrong
        </h2>
        {/* Subtext */}
        <p className="text-14 text-gray-500 mb-6 text-center">
          Please try again later
        </p>
        {/* Button */}
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
