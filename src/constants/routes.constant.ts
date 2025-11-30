export const authRoutes = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_OTP: '/verify-otp',
  VERIFY_EMAIL_OTP: '/verify-email-otp',
} as const

export const protectedRoutes = {
  DASHBOARD: '/dashboard',
} as const

export const publicRoutes = {
  HOME: '/',
} as const
