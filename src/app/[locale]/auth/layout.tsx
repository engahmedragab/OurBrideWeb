import AuthHeroSection from '@/auth/components/AuthHeroSection'
import { useI18nTranslations } from '@/i18n'
import { getTranslations } from 'next-intl/server'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const t = await getTranslations('auth')
  const heroSectionData ={
    "backToHome": t('hero.backToHome'),
    "title": t('hero.title'),
    "description":t('hero.description'),
    "heroCard":{
      "title": t('heroCard.title'),
      "subtitle": t('heroCard.subtitle')
    }
  }
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row overflow-hidden">
      {/* Left Section - Hero (60%) - Hidden on mobile */}
      <div className="hidden lg:flex w-full h-screen lg:w-[60%] items-center justify-center lg:py-6 lg:px-4 overflow-hidden">
        <AuthHeroSection heroSectionData={heroSectionData} />
      </div>

      {/* Right Section - Form (40%) */}
      <div className="w-full min-h-screen lg:w-[40%] flex flex-col bg-white p-6 items-center lg:justify-center overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}
