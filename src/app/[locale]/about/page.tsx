'use client'

import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { Typography, CardWrapper, Button } from '@/components/ui'
import {
  Target,
  Eye,
  Heart,
  Shield,
  Star,
  Users,
  Lightbulb,
  Mail,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18nTranslations, useIsRTL } from '@/i18n'

export default function AboutPage() {
  const t = useI18nTranslations('about');
  const isRtl = useIsRTL();

  return (
    <div className="min-h-screen flex flex-col bg-background-secondary">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 md:mb-12 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-brand-500" />
                </div>
                <Typography variant="h1" className="text-24 md:text-32 font-normal">
                  {t('pageTitle')}
                </Typography>
              </div>
              <div className="w-20 h-1 bg-brand-500 mx-auto md:mx-0" />
              <Typography variant="bodyLarge" textColor="secondary" className={cn("mt-4 max-w-2xl" , isRtl ? 'text-right' : 'text-left')}>
                {t('pageSubtitle')}
              </Typography>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 md:space-y-12">
              {/* Mission Section */}
              <CardWrapper padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <Typography variant="h3" className="text-20 md:text-24 font-normal">
                    {t('mission.title')}
                  </Typography>
                </div>
                <Typography variant="body" textColor="default" className={cn("mb-4 leading-relaxed" , isRtl ? 'text-right' : 'text-left')}>
                  {t('mission.p1')}
                </Typography>
                <Typography variant="body" textColor="default" className={cn("leading-relaxed" , isRtl ? 'text-right' : 'text-left')}>
                  {t('mission.p2')}
                </Typography>
              </CardWrapper>

              {/* Vision Section */}
              <CardWrapper padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Eye className="h-5 w-5 text-purple-600" />
                  </div>
                  <Typography variant="h3" className="text-20 md:text-24 font-normal">
                    {t('vision.title')}
                  </Typography>
                </div>
                <Typography variant="body" textColor="default" className={cn("mb-4 leading-relaxed" , isRtl ? 'text-right' : 'text-left')}>
                  {t('vision.p1')}
                </Typography>
                <Typography variant="body" textColor="default" className={cn("leading-relaxed" , isRtl ? 'text-right' : 'text-left')}>
                  {t('vision.p2')}
                </Typography>
              </CardWrapper>

              {/* Values Section */}
              <CardWrapper padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <Typography variant="h3" className="text-20 md:text-24 font-normal">
                    {t('values.title')}
                  </Typography>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <Typography variant="h5" className={cn("mb-2" , isRtl ? 'text-right' : 'text-left')}>{t('values.trust.title')}</Typography>
                      <Typography variant="body" textColor="default" className={cn("leading-relaxed" , isRtl ? 'text-right' : 'text-left')}>
                        {t('values.trust.desc')}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <Typography variant="h5" className={cn("mb-2" , isRtl ? 'text-right' : 'text-left')}>{t('values.quality.title')}</Typography>
                      <Typography variant="body" textColor="default" className={cn("leading-relaxed" , isRtl ? 'text-right' : 'text-left')}>
                        {t('values.quality.desc')}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-pink-50 flex items-center justify-center">
                      <Users className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <Typography variant="h5" className={cn("mb-2" , isRtl ? 'text-right' : 'text-left')}>{t('values.community.title')}</Typography>
                      <Typography variant="body" textColor="default" className={cn("leading-relaxed" , isRtl ? 'text-right' : 'text-left')}>
                        {t('values.community.desc')}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <Typography variant="h5" className={cn("mb-2" , isRtl ? 'text-right' : 'text-left')}>{t('values.innovation.title')}</Typography>
                      <Typography variant="body" textColor="default" className={cn("leading-relaxed" , isRtl ? 'text-right' : 'text-left')}>
                        {t('values.innovation.desc')}
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardWrapper>

              {/* Contact Section */}
              <CardWrapper className={cn("bg-gradient-to-br from-brand-50 to-brand-100/50 border-brand-200")} padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <Typography variant="h3" className="text-20 md:text-24 font-normal">
                    {t('contact.title')}
                  </Typography>
                </div>
                <Typography variant="body" textColor="default" className={cn("mb-4 leading-relaxed" , isRtl ? 'text-right' : 'text-left')}>
                  {t('contact.desc')}
                </Typography>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-brand-200 text-brand-500 hover:bg-brand-50"
                    asChild
                  >
                    <a href="/dashboard/help-center">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {t('contact.helpCta')}
                    </a>
                  </Button>
                </div>
              </CardWrapper>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
