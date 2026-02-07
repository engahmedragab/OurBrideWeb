'use client'

import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { Typography, CardWrapper, Button } from '@/components/ui'
import {
  RotateCcw,
  FileText,
  DollarSign,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18nTranslations, useIsRTL } from '@/i18n'

export default function ReturnsPage() {
  const t = useI18nTranslations('returns')
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
                  <RotateCcw className="h-6 w-6 text-brand-500" />
                </div>
                <Typography variant="h1" className="text-24 md:text-32 font-normal">
                  {t('pageTitle')}
                </Typography>
              </div>
              <div className="w-20 h-1 bg-brand-500 mx-auto md:mx-0" />
              <Typography
                variant="bodyLarge"
                textColor="secondary"
                className={cn("mt-4 max-w-2xl", isRtl ? "text-right" : "text-left")}
              >
                {t('pageSubtitle')}
              </Typography>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 md:space-y-12">
              {/* Return Policy Section */}
              <CardWrapper padding="lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <Typography variant="h3" className="text-20 md:text-24 font-normal">
                      {t('policy.title')}
                    </Typography>
                  </div>
                  <div className="space-y-6">
                    <CardWrapper className="bg-blue-50 border-blue-100" padding="sm">
                        <Typography variant="body" className={cn("leading-relaxed", isRtl ? "text-right" : "text-left")}>
                          {t('policy.introPrefix')}{' '}
                          <span className="font-semibold text-gray-900">{t('policy.introHighlight')}</span>{' '}
                          {t('policy.introSuffix')}
                        </Typography>
                    </CardWrapper>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CardWrapper className="bg-green-50 border-green-100" padding="sm">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <Typography variant="h5">{t('policy.eligible.title')}</Typography>
                          </div>
                          <ul className="list-disc list-inside space-y-1.5 ml-2">
                            <li><Typography variant="bodySmall" as="span">{t('policy.eligible.bullets.unused')}</Typography></li>
                            <li><Typography variant="bodySmall" as="span">{t('policy.eligible.bullets.packaging')}</Typography></li>
                            <li><Typography variant="bodySmall" as="span">{t('policy.eligible.bullets.proof')}</Typography></li>
                          </ul>
                      </CardWrapper>
                      <CardWrapper className="bg-red-50 border-red-100" padding="sm">
                          <div className="flex items-center gap-2 mb-3">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <Typography variant="h5">{t('policy.nonReturnable.title')}</Typography>
                          </div>
                          <ul className="list-disc list-inside space-y-1.5 ml-2">
                            <li><Typography variant="bodySmall" as="span">{t('policy.nonReturnable.bullets.personalized')}</Typography></li>
                            <li><Typography variant="bodySmall" as="span">{t('policy.nonReturnable.bullets.perishable')}</Typography></li>
                            <li><Typography variant="bodySmall" as="span">{t('policy.nonReturnable.bullets.misuse')}</Typography></li>
                            <li><Typography variant="bodySmall" as="span">{t('policy.nonReturnable.bullets.digital')}</Typography></li>
                          </ul>
                      </CardWrapper>
                    </div>
                  </div>
              </CardWrapper>

              {/* Return Process Section */}
              <CardWrapper padding="lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <RotateCcw className="h-5 w-5 text-purple-600" />
                    </div>
                    <Typography variant="h3" className="text-20 md:text-24 font-normal">
                      {t('process.title')}
                    </Typography>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-16 font-normal">
                        1
                      </div>
                      <div className="flex-1">
                        <Typography variant="h5" className={cn("mb-2", isRtl ? "text-right" : "text-left")}>{t('process.steps.1.title')}</Typography>
                        <Typography variant="body" className={cn("leading-relaxed", isRtl ? "text-right" : "text-left")}>
                          {t('process.steps.1.p1Prefix')}
                          <a href="/orders" className="text-brand-500 hover:text-brand-600 underline font-medium">{t('process.steps.1.ordersLinkText')}</a>{' '}
                          {t('process.steps.1.p1Suffix')}
                        </Typography>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-16 font-normal">
                        2
                      </div>
                      <div className="flex-1">
                        <Typography variant="h5" className={cn("mb-2", isRtl ? "text-right" : "text-left")}>{t('process.steps.2.title')}</Typography>
                        <Typography variant="body" className={cn("leading-relaxed", isRtl ? "text-right" : "text-left")}>
                          {t('process.steps.2.desc')}
                        </Typography>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-16 font-normal">
                        3
                      </div>
                      <div className="flex-1">
                        <Typography variant="h5" className={cn("mb-2", isRtl ? "text-right" : "text-left")}>{t('process.steps.3.title')}</Typography>
                        <Typography variant="body" className={cn("leading-relaxed", isRtl ? "text-right" : "text-left")}>
                          {t('process.steps.3.desc')}
                        </Typography>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-16 font-normal">
                        4
                      </div>
                      <div className="flex-1">
                        <Typography variant="h5" className={cn("mb-2", isRtl ? "text-right" : "text-left")}>{t('process.steps.4.title')}</Typography>
                        <Typography variant="body" className={cn("leading-relaxed", isRtl ? "text-right" : "text-left")}>
                          {t('process.steps.4.desc')}
                        </Typography>
                      </div>
                    </div>
                  </div>
              </CardWrapper>

              {/* Refund Information Section */}
              <CardWrapper padding="lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <Typography variant="h3" className="text-20 md:text-24 font-normal">
                      {t('refund.title')}
                    </Typography>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Typography variant="h5" className={cn("mb-2", isRtl ? "text-right" : "text-left")}>{t('refund.processing.title')}</Typography>
                      <Typography variant="body" className={cn("leading-relaxed", isRtl ? "text-right" : "text-left")}>
                        {t('refund.processing.desc')}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h5" className={cn("mb-2", isRtl ? "text-right" : "text-left")}>{t('refund.shippingCosts.title')}</Typography>
                      <Typography variant="body" className={cn("leading-relaxed", isRtl ? "text-right" : "text-left")}>
                        {t('refund.shippingCosts.desc')}
                      </Typography>
                    </div>
                  </div>
              </CardWrapper>

              {/* Exchanges Section */}
              <CardWrapper padding="lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <RefreshCw className="h-5 w-5 text-indigo-600" />
                    </div>
                    <Typography variant="h3" className="text-20 md:text-24 font-normal">
                      {t('exchanges.title')}
                    </Typography>
                  </div>
                  <Typography variant="body" className={cn("mb-4 leading-relaxed", isRtl ? "text-right" : "text-left")}>
                    {t('exchanges.p1')}
                  </Typography>
                  <Typography variant="body" className={cn("leading-relaxed", isRtl ? "text-right" : "text-left")}>
                    {t('exchanges.p2')}
                  </Typography>
              </CardWrapper>

              {/* Damaged or Defective Items Section */}
              <CardWrapper padding="lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <Typography variant="h3" className="text-20 md:text-24 font-normal">
                      {t('damaged.title')}
                    </Typography>
                  </div>
                  <Typography variant="body" className={cn("mb-4 leading-relaxed", isRtl ? "text-right" : "text-left")}>
                    {t('damaged.p1')}
                  </Typography>
                  <Typography variant="body" className={cn("leading-relaxed", isRtl ? "text-right" : "text-left")}>
                    {t('damaged.p2')}
                  </Typography>
              </CardWrapper>

              {/* Contact Section */}
              <CardWrapper className={cn("bg-gradient-to-br from-brand-50 to-brand-100/50 border-brand-200")} padding="lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="h-5 w-5 text-white" />
                    </div>
                    <Typography variant="h3" className="text-20 md:text-24 font-normal">
                      {t('contact.title')}
                    </Typography>
                  </div>
                  <Typography variant="body" className={cn("mb-4 leading-relaxed", isRtl ? "text-right" : "text-left")}>
                    {t('contact.desc')}
                  </Typography>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-brand-200 text-brand-500 hover:bg-brand-50"
                    asChild
                  >
                    <a href="/dashboard/help-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      {t('contact.helpCta')}
                    </a>
                  </Button>
              </CardWrapper>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
