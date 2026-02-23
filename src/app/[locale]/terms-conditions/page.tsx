'use client'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { Typography, CardWrapper } from '@/components/ui'
import { useI18nTranslations, useIsRTL } from '@/i18n'
import { cn } from '@/lib'

export default function TermsAndConditionsPage() {
  const t = useI18nTranslations('terms')
  const isRtl = useIsRTL()

  return (
    <div
      className="min-h-screen flex flex-col bg-background-secondary"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8 max-w-4xl">
          <CardWrapper padding="lg">

            <Typography
              variant="h1"
              textColor="primary"
              className={cn("text-2xl md:text-3xl font-bold mb-4", isRtl ? "text-right" : "text-left")}
            >
              {t('title')}
            </Typography>

            <Typography
              variant="body"
              className={cn("mb-6", isRtl ? "text-right" : "text-left")}
            >
              <strong>{t('lastUpdated')}</strong>
            </Typography>

            <div className="space-y-6">

              <Typography
                variant="body"
                className={cn(isRtl ? "text-right" : "text-left")}
              >
                {t('intro')}
              </Typography>

              {/* Interpretation */}
              <div>
                <Typography
                  variant="h2"
                  className={cn("text-xl font-semibold mt-8 mb-4", isRtl ? "text-right" : "text-left")}
                >
                  {t('interpretationAndDefinitions')}
                </Typography>

                <Typography
                  variant="h3"
                  className={cn("text-lg font-semibold mt-6 mb-3", isRtl ? "text-right" : "text-left")}
                >
                  {t('interpretation')}
                </Typography>

                <Typography
                  variant="body"
                  className={cn("mb-4", isRtl ? "text-right" : "text-left")}
                >
                  {t('interpretationText')}
                </Typography>

                <Typography
                  variant="h3"
                  className={cn("text-lg font-semibold mt-6 mb-3", isRtl ? "text-right" : "text-left")}
                >
                  {t('definitions')}
                </Typography>

                <Typography
                  variant="body"
                  className={cn("mb-4", isRtl ? "text-right" : "text-left")}
                >
                  {t('definitionsIntro')}
                </Typography>

                <ul className="list-disc pl-6 space-y-2">
                  <li><Typography variant="body" as="span"><strong>{t('labels.application')}</strong> {t('def_application')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.applicationStore')}</strong> {t('def_applicationStore')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.company')}</strong> {t('def_company')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.country')}</strong> {t('def_country')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.device')}</strong> {t('def_device')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.service')}</strong> {t('def_service')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.terms')}</strong> {t('def_terms')}</Typography></li>
                  <li>
                    <Typography variant="body" as="span">
                      <strong>{t('labels.website')}</strong> {t('def_website')}{' '}
                      <a
                        href="https://www.our-bride.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-500 hover:text-brand-600 underline"
                      >
                        https://www.our-bride.com
                      </a>
                    </Typography>
                  </li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.you')}</strong> {t('def_you')}</Typography></li>
                </ul>
              </div>

              {/* Acknowledgment */}
              <div>
                <Typography variant="h2" className={cn("text-xl font-semibold mt-8 mb-4", isRtl ? "text-right" : "text-left")}>
                  {t('acknowledgment')}
                </Typography>

                <Typography variant="body" className={cn("mb-4", isRtl ? "text-right" : "text-left")}>
                  {t('ack_text1')}
                </Typography>

                <Typography variant="body" className={cn("mb-4", isRtl ? "text-right" : "text-left")}>
                  {t('ack_text2')}
                </Typography>

                <Typography variant="body" className={cn("mb-4", isRtl ? "text-right" : "text-left")}>
                  {t('ack_text3')}
                </Typography>
              </div>

              {/* Links */}
              <div>
                <Typography variant="h2" className={cn("text-xl font-semibold mt-8 mb-4", isRtl ? "text-right" : "text-left")}>
                  {t('linksTitle')}
                </Typography>

                <Typography variant="body" className={cn(isRtl ? "text-right" : "text-left")}>
                  {t('linksText')}
                </Typography>
              </div>

              {/* Termination */}
              <div>
                <Typography variant="h2" className={cn("text-xl font-semibold mt-8 mb-4", isRtl ? "text-right" : "text-left")}>
                  {t('terminationTitle')}
                </Typography>

                <Typography variant="body" className={cn(isRtl ? "text-right" : "text-left")}>
                  {t('terminationText')}
                </Typography>
              </div>

              {/* Liability */}
              <div>
                <Typography variant="h2" className={cn("text-xl font-semibold mt-8 mb-4", isRtl ? "text-right" : "text-left")}>
                  {t('liabilityTitle')}
                </Typography>

                <Typography variant="body" className={cn(isRtl ? "text-right" : "text-left")}>
                  {t('liabilityText')}
                </Typography>
              </div>

              {/* Disclaimer */}
              <div>
                <Typography variant="h2" className={cn("text-xl font-semibold mt-8 mb-4", isRtl ? "text-right" : "text-left")}>
                  {t('disclaimerTitle')}
                </Typography>

                <Typography variant="body" className={cn(isRtl ? "text-right" : "text-left")}>
                  {t('disclaimerText')}
                </Typography>
              </div>

              {/* Governing Law */}
              <div>
                <Typography variant="h2" className={cn("text-xl font-semibold mt-8 mb-4", isRtl ? "text-right" : "text-left")}>
                  {t('governingLawTitle')}
                </Typography>

                <Typography variant="body" className={cn(isRtl ? "text-right" : "text-left")}>
                  {t('governingLawText')}
                </Typography>
              </div>

              {/* Disputes */}
              <div>
                <Typography variant="h2" className={cn("text-xl font-semibold mt-8 mb-4", isRtl ? "text-right" : "text-left")}>
                  {t('disputesTitle')}
                </Typography>

                <Typography variant="body" className={cn(isRtl ? "text-right" : "text-left")}>
                  {t('disputesText')}
                </Typography>
              </div>

              {/* Changes */}
              <div>
                <Typography variant="h2" className={cn("text-xl font-semibold mt-8 mb-4", isRtl ? "text-right" : "text-left")}>
                  {t('changesTitle')}
                </Typography>

                <Typography variant="body" className={cn(isRtl ? "text-right" : "text-left")}>
                  {t('changesText')}
                </Typography>
              </div>

              {/* Contact */}
              <div>
                <Typography variant="h2" className={cn("text-xl font-semibold mt-8 mb-4", isRtl ? "text-right" : "text-left")}>
                  {t('contactTitle')}
                </Typography>

                <Typography variant="body" className={cn(isRtl ? "text-right" : "text-left")}>
                  {t('contactText')}{' '}
                  <a
                    href="mailto:info@our-bride.com"
                    className="text-brand-500 hover:text-brand-600 underline"
                  >
                    info@our-bride.com
                  </a>
                </Typography>
              </div>

            </div>
          </CardWrapper>
        </div>
      </main>
      <Footer />
    </div>
  )
}
