'use client'

import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { Typography, CardWrapper, Button } from '@/components/ui'
import {
  Package,
  Clock,
  DollarSign,
  MapPin,
  Truck,
  Shield,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18nTranslations, useIsRTL } from '@/i18n'

export default function ShippingPage() {
  const t = useI18nTranslations('shipping')
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
                  <Truck className="h-6 w-6 text-brand-500" />
                </div>
                <Typography variant="h1" className="text-24 md:text-32 font-normal">
                  {t('pageTitle')}
                </Typography>
              </div>
              <div className="w-20 h-1 bg-brand-500 mx-auto md:mx-0" />
              <Typography variant="bodyLarge" textColor="secondary" className={cn("mt-4 max-w-2xl", isRtl ? "text-right" : "text-left")}>
                {t('pageSubtitle')}
              </Typography>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 md:space-y-12">
              {/* Delivery Times Section */}
              <CardWrapper padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <Typography variant="h3" className="text-20 md:text-24 font-normal">
                    {t('deliveryTimes.title')}
                  </Typography>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CardWrapper className="bg-blue-50 border-blue-100" padding="sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      <Typography variant="h5">{t('deliveryTimes.standard.title')}</Typography>
                    </div>
                    <Typography variant="bodySmall" className={cn("mb-2 leading-relaxed", isRtl ? "text-right" : "text-left")}>
                      {t('deliveryTimes.standard.time')}
                    </Typography>
                    <Typography variant="bodyTiny" textColor="secondary" className={cn(isRtl ? 'text-right' : 'text-left')}>
                      {t('deliveryTimes.standard.note')}
                    </Typography>
                  </CardWrapper>

                  <CardWrapper className="bg-green-50 border-green-100" padding="sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-5 w-5 text-green-600" />
                      <Typography variant="h5">{t('deliveryTimes.express.title')}</Typography>
                    </div>
                    <Typography variant="bodySmall" className={cn("mb-2 leading-relaxed", isRtl ? "text-right" : "text-left")}>
                      {t('deliveryTimes.express.time')}
                    </Typography>
                    <Typography variant="bodyTiny" textColor="secondary" className={cn(isRtl ? 'text-right' : 'text-left')}>
                      {t('deliveryTimes.express.note')}
                    </Typography>
                  </CardWrapper>

                  <CardWrapper className="bg-purple-50 border-purple-100" padding="sm">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      <Typography variant="h5">{t('deliveryTimes.international.title')}</Typography>
                    </div>
                    <Typography variant="bodySmall" className={cn("mb-2 leading-relaxed", isRtl ? "text-right" : "text-left")}>
                      {t('deliveryTimes.international.time')}
                    </Typography>
                    <Typography variant="bodyTiny" textColor="secondary" className={cn(isRtl ? 'text-right' : 'text-left')}>
                      {t('deliveryTimes.international.note')}
                    </Typography>
                  </CardWrapper>
                </div>
              </CardWrapper>

              {/* Shipping Costs Section */}
              <CardWrapper padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <Typography variant="h3" className="text-20 md:text-24 font-normal">
                    {t('shippingCosts.title')}
                  </Typography>
                </div>
                <div className="space-y-4">
                  <Typography variant="body" className={cn("mb-4 leading-relaxed", isRtl ? "text-right" : "text-left")}>
                    {t('shippingCosts.intro')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><Typography variant="body" as="span">{t('shippingCosts.bullets.weight')}</Typography></li>
                    <li><Typography variant="body" as="span">{t('shippingCosts.bullets.address')}</Typography></li>
                    <li><Typography variant="body" as="span">{t('shippingCosts.bullets.method')}</Typography></li>
                    <li><Typography variant="body" as="span">{t('shippingCosts.bullets.orderValue')}</Typography></li>
                  </ul>
                  <Typography variant="body" className={cn("mt-4 leading-relaxed" , isRtl ? "text-right" : "text-left")}>
                    {t('shippingCosts.outro')}
                  </Typography>
                </div>
              </CardWrapper>

              {/* Tracking Section */}
              <CardWrapper padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-indigo-600" />
                  </div>
                  <Typography variant="h3" className="text-20 md:text-24 font-normal">
                    {t('tracking.title')}
                  </Typography>
                </div>
                <Typography variant="body" className={cn("mb-4 leading-relaxed", isRtl ? "text-right" : "text-left")}>
                  {t('tracking.p1')}
                </Typography>
                <Typography variant="body" className={cn("leading-relaxed", isRtl ? "text-right" : "text-left")}>
                  {t('tracking.p2Prefix')}
                  <a href="/orders" className={cn("text-brand-500 hover:text-brand-600 underline" , isRtl ? "text-right" : "text-left")}>{t('tracking.ordersLinkText')}</a>{' '}
                  {t('tracking.p2Suffix')}
                </Typography>
              </CardWrapper>

              {/* Delivery Address Section */}
              <CardWrapper padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <Typography variant="h3" className="text-20 md:text-24 font-normal">
                    {t('address.title')}
                  </Typography>
                </div>
                <Typography variant="body" className={cn("mb-4 leading-relaxed", isRtl ? "text-right" : "text-left")}>
                  {t('address.p1')}
                </Typography>
                <Typography variant="body" className={cn("leading-relaxed", isRtl ? "text-right" : "text-left")}>
                  {t('address.p2Prefix')}
                  <a href="/addresses" className="text-brand-500 hover:text-brand-600 underline">{t('address.addressesLinkText')}</a>{t('address.p2Suffix')}
                </Typography>
              </CardWrapper>

              {/* Special Handling Section */}
              <CardWrapper padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-yellow-600" />
                  </div>
                  <Typography variant="h3" className="text-20 md:text-24 font-normal">
                    {t('specialHandling.title')}
                  </Typography>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CardWrapper className="bg-yellow-50 border-yellow-100" padding="sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-yellow-600" />
                      <Typography variant="h5">{t('specialHandling.fragile.title')}</Typography>
                    </div>
                    <Typography variant="bodySmall" className={cn("leading-relaxed", isRtl ? "text-right" : "text-left")}>
                      {t('specialHandling.fragile.desc')}
                    </Typography>
                  </CardWrapper>
                  <CardWrapper className="bg-blue-50 border-blue-100" padding="sm">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      <Typography variant="h5">{t('specialHandling.signature.title')}</Typography>
                    </div>
                    <Typography variant="bodySmall" className={cn("leading-relaxed" , isRtl ? "text-right" : "text-left")}>
                      {t('specialHandling.signature.desc')}
                    </Typography>
                  </CardWrapper>
                </div>
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
                <Typography variant="body" className={cn("mb-4 leading-relaxed" , isRtl ? "text-right" : "text-left")}>
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
