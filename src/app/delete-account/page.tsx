'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'

export default function DeleteAccountPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDeleteAccount = async () => {
    setLoading(true)
    setError(null)

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://preprod.our-bride.com'
      const response = await axios.post(
        `${baseURL}/api/v1/identity/delete`,
        {
          emailOrPhone,
          password,
        },
        {
          withCredentials: true,
        }
      )

      if (response.data.success) {
        // Clear any tokens
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
        }
        // Redirect to home
        router.push('/')
      } else {
        setError(response.data.errors?.join(', ') || 'Failed to delete account')
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (err as { message?: string })?.message ||
        'Failed to delete account, please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = emailOrPhone.trim() !== '' && password.trim() !== ''

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-500 mb-4">
            Delete Account
          </h1>
          <p className="text-gray-600">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </div>

        <div className="space-y-6 max-w-md mx-auto">
          {/* Email/Phone Input */}
          <div>
            <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your Email or Phone Number
            </label>
            <input
              type="text"
              id="emailOrPhone"
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Email or Phone Number"
              value={emailOrPhone}
              onChange={e => setEmailOrPhone(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Delete Account Button */}
          <div className="pt-4">
            <Button
              variant="brand"
              size="lg"
              onClick={handleDeleteAccount}
              disabled={!isFormValid || loading}
              className="w-full rounded-full"
            >
              {loading ? 'Deleting...' : 'Delete Account'}
            </Button>
          </div>
        </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
