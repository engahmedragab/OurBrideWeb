import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Typography } from '@/components/ui/Typography'
import { SocialMediaButton } from '@/components/ui/SocialMediaButton'
import { authRoutes } from '@/constants'
import { cn } from '@/lib/utils'
import { Mail, User } from 'lucide-react'

/**
 * Register page component for user registration
 * @returns {JSX.Element} Register form component
 */
export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement registration logic with API
    console.log('Register form submitted:', formData)
  }

  return (
    <div className={cn('w-full space-y-8')}>
        {/* Header */}
        <div className={cn('space-y-2 text-center')}>
          <Typography variant="h1" className={cn('text-32 font-bold')}>
            Create Account
          </Typography>
          <Typography variant="body" className={cn('text-foreground-secondary')}>
            Sign up to get started with OurBride
          </Typography>
        </div>

        {/* Social Media Buttons */}
        <div className={cn('space-y-3')}>
          <SocialMediaButton provider="google" size="default" className={cn('w-full')}>
            Continue with Google
          </SocialMediaButton>
          <SocialMediaButton provider="facebook" size="default" className={cn('w-full')}>
            Continue with Facebook
          </SocialMediaButton>
        </div>

        {/* Divider */}
        <div className={cn('relative flex items-center')}>
          <div className={cn('flex-1 border-t border-gray-300')} />
          <Typography variant="bodySmall" className={cn('px-4 text-foreground-tertiary')}>
            OR
          </Typography>
          <div className={cn('flex-1 border-t border-gray-300')} />
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className={cn('space-y-4')}>
          {/* Full Name Input */}
          <div className={cn('space-y-1')}>
            <Input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={e => handleInputChange('fullName', e.target.value)}
              prefixIcon={User}
              variant={errors.fullName ? 'error' : 'default'}
              errorMessage={errors.fullName}
              size="lg"
            />
          </div>

          {/* Email Input */}
          <div className={cn('space-y-1')}>
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              prefixIcon={Mail}
              variant={errors.email ? 'error' : 'default'}
              errorMessage={errors.email}
              size="lg"
            />
          </div>

          {/* Password Input */}
          <div className={cn('space-y-1')}>
            <PasswordInput
              placeholder="Password"
              value={formData.password}
              onChange={e => handleInputChange('password', e.target.value)}
              variant={errors.password ? 'error' : 'default'}
              errorMessage={errors.password}
              size="lg"
            />
          </div>

          {/* Confirm Password Input */}
          <div className={cn('space-y-1')}>
            <PasswordInput
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={e => handleInputChange('confirmPassword', e.target.value)}
              variant={errors.confirmPassword ? 'error' : 'default'}
              errorMessage={errors.confirmPassword}
              size="lg"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="brand"
            size="lg"
            className={cn('w-full')}
          >
            Create Account
          </Button>
        </form>

      {/* Login Link */}
      <div className={cn('text-center')}>
        <Typography variant="body" className={cn('text-foreground-secondary')}>
          Already have an account?{' '}
          <Link
            to={authRoutes.LOGIN}
            className={cn('font-semibold text-brand-500 hover:text-brand-600 hover:underline')}
          >
            Sign In
          </Link>
        </Typography>
      </div>
    </div>
  )
}

