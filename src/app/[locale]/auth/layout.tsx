import type { ReactNode } from 'react'
import AuthHeroSection from '@/auth/components/AuthHeroSection'
import { getTranslations } from 'next-intl/server'

type AuthLayoutProps = {
  children: ReactNode
  params: Promise<{
    locale: string
  }>
}

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = await params
  const t = await getTranslations('auth')

  const heroSectionData = {
    backToHome: t('hero.backToHome'),
    title: t('hero.title'),
    description: t('hero.description'),
    heroCard: {
      title: t('heroCard.title'),
      subtitle: t('heroCard.subtitle'),
    },
  }

  const isRTL = locale === 'ar'

  return (
    <div
      className={[
        'flex h-dvh w-full overflow-hidden', 
        'flex-col',
        isRTL ? 'lg:flex-row' : 'lg:flex-row-reverse', 
      ].join(' ')}
    >
    
      <div className="w-full lg:w-[55%] h-full bg-white overflow-y-auto py-6 overflow-x-hidden">
        <div className="min-h-full w-full p-6  flex flex-col items-center sm:justify-center">
          
          {children}
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[45%] h-full overflow-hidden items-center justify-center ">
        <AuthHeroSection heroSectionData={heroSectionData} />
      </div>
    </div>
  )
}
