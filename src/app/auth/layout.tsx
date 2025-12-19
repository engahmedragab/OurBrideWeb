import AuthHeroSection from '@/auth/components/AuthHeroSection'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-screen  flex-col lg:flex-row !overflow-hidden">
      {/* Left Section - Hero (60%) - Hidden on mobile */}
      <div className="hidden lg:flex w-full h-screen lg:w-[60%] items-center justify-center lg:py-6 lg:px-4 overflow-hidden">
        <AuthHeroSection />
      </div>

      {/* Right Section - Form (40%) */}
      <div className="w-full min-h-screen lg:w-[40%] flex flex-col bg-white p-6 items-center  lg:justify-center">
        {children}
      </div>
    </div>
  )
}
