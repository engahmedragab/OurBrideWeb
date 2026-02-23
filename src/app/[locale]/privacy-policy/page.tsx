'use client'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { Typography, CardWrapper } from '@/components/ui'
import { useI18nTranslations, useIsRTL } from '@/i18n'
import { cn } from '@/lib'

export default function PrivacyPolicyPage() {
  const t = useI18nTranslations('privacyPolicy')
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
              className={cn("text-2xl md:text-3xl font-bold mb-4" , isRtl? `text-right` : `text-left`)}
            
            >
              {t('title')}
            </Typography>

            <Typography variant="body" className={cn( "mb-6" ,  isRtl? `text-right` : `text-left`)} >
              <strong>{t('lastUpdated')}</strong>
            </Typography>

            <div className="space-y-6">

              <Typography variant="body" className= {cn("mb-4" ,  isRtl? `text-right` : `text-left`)}>
                {t('intro1')}
              </Typography>

              <Typography variant="body" className={cn("mb-4" ,  isRtl? `text-right` : `text-left`)}>
                {t('intro2')}
              </Typography>

              {/* Interpretation & Definitions */}
              <div>
                <Typography variant="h2" className={cn( "text-xl font-semibold mt-8 mb-4",  isRtl? `text-right` : `text-left`)}>
                  {t('interpretationAndDefinitions')}
                </Typography>

                <Typography variant="h3" className={cn("text-lg font-semibold mt-6 mb-3" ,  isRtl? `text-right` : `text-left`)}>
                  {t('interpretation')}
                </Typography>

                <Typography variant="body" className={cn("mb-4" ,  isRtl? `text-right` : `text-left`)}>
                  {t('interpretationText')}
                </Typography>

                <Typography variant="h3" className={cn( "text-lg font-semibold mt-6 mb-3",  isRtl? `text-right` : `text-left`)}>
                  {t('definitions')}
                </Typography>

                <Typography variant="body" className={cn("mb-4" ,  isRtl? `text-right` : `text-left`)}>
                  {t('definitionsIntro')}
                </Typography>

                <ul className="list-disc pl-6 space-y-2">
                  <li><Typography variant="body" as="span"><strong>{t('labels.account')}</strong> {t('def_account')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.affiliate')}</strong> {t('def_affiliate')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.application')}</strong> {t('def_application')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.company')}</strong> {t('def_company')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.cookies')}</strong> {t('def_cookies')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.country')}</strong> {t('def_country')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.device')}</strong> {t('def_device')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.personalData')}</strong> {t('def_personalData')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.service')}</strong> {t('def_service')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.serviceProvider')}</strong> {t('def_serviceProvider')}</Typography></li>
                  <li><Typography variant="body" as="span"><strong>{t('labels.usageData')}</strong> {t('def_usageData')}</Typography></li>
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

              {/* Collecting & Using */}
              <div>
                <Typography variant="h2" className={cn("text-xl font-semibold mt-8 mb-4" ,  isRtl? `text-right` : `text-left`)}>
                  {t('collectingAndUsing')}
                </Typography>

                <Typography variant="h3" className={cn( "text-lg font-semibold mt-6 mb-3",  isRtl? `text-right` : `text-left`)}>
                  {t('typesOfDataCollected')}
                </Typography>

                <Typography variant="h4" className={cn( "text-base font-semibold mt-4 mb-2",  isRtl? `text-right` : `text-left`)}>
                  {t('personalData')}
                </Typography>

                <Typography variant="body" className={cn("mb-4" ,  isRtl? `text-right` : `text-left`)}>
                  {t('personalDataText')}
                </Typography>

                <ul className="list-disc pl-6 space-y-2">
                  <li><Typography variant="body" as="span">{t('emailAddress')}</Typography></li>
                  <li><Typography variant="body" as="span">{t('usageData')}</Typography></li>
                </ul>

                <Typography variant="h4" className={cn("text-base font-semibold mt-4 mb-2" ,  isRtl? `text-right` : `text-left`)}>
                  {t('usageDataTitle')}
                </Typography>

                <Typography variant="body" className={cn( "mb-4",  isRtl? `text-right` : `text-left`)}>
                  {t('usageDataText')}
                </Typography>

                <Typography variant="h3" className={cn( "text-lg font-semibold mt-6 mb-3",  isRtl? `text-right` : `text-left`)}>
                  {t('applicationInfoTitle')}
                </Typography>

                <Typography variant="body" className={cn("mb-4" ,  isRtl? `text-right` : `text-left`)}>
                  {t('applicationInfoText1')}
                </Typography>

                <ul className="list-disc pl-6 space-y-2">
                  <li><Typography variant="body" as="span">{t('applicationInfo_location')}</Typography></li>
                  <li><Typography variant="body" as="span">{t('applicationInfo_contacts')}</Typography></li>
                  <li><Typography variant="body" as="span">{t('applicationInfo_photos')}</Typography></li>
                </ul>

                <Typography variant="body" className={cn( "mb-4",  isRtl? `text-right` : `text-left`)}>
                  {t('applicationInfoText2')}
                </Typography>

                <Typography variant="h3" className={cn("text-lg font-semibold mt-6 mb-3" ,  isRtl? `text-right` : `text-left`)}>
                  {t('trackingTitle')}
                </Typography>

                <Typography variant="body" className={cn(isRtl? `text-right` : `text-left`)}>
                  {t('trackingText')}
                </Typography>
              </div>

              {/* Use of Data */}
              <div>
                <Typography variant="h2" className={cn( "text-xl font-semibold mt-8 mb-4",  isRtl? `text-right` : `text-left`)}>
                  {t('useOfDataTitle')}
                </Typography>

                <Typography variant="body" className={cn( "mb-4",  isRtl? `text-right` : `text-left`)}>
                  {t('useOfDataIntro')}
                </Typography>

                <ul className="list-disc pl-6 space-y-2">
                  <li><Typography variant="body" as="span">{t('use_provide')}</Typography></li>
                  <li><Typography variant="body" as="span">{t('use_manageAccount')}</Typography></li>
                  <li><Typography variant="body" as="span">{t('use_contract')}</Typography></li>
                  <li><Typography variant="body" as="span">{t('use_contact')}</Typography></li>
                </ul>
              </div>

              {/* Retention */}
              <div>
                <Typography variant="h2" className={cn("text-xl font-semibold mt-8 mb-4" ,  isRtl? `text-right` : `text-left`)}>
                  {t('retentionTitle')}
                </Typography>

                <Typography variant="body" className={cn(isRtl? `text-right` : `text-left`)}>
                  {t('retentionText')}
                </Typography>
              </div>

              {/* Disclosure */}
              <div>
                <Typography variant="h2" className={cn( "text-xl font-semibold mt-8 mb-4",  isRtl? `text-right` : `text-left`)}>
                  {t('disclosureTitle')}
                </Typography>

                <Typography variant="body" className={cn("mb-4" ,  isRtl? `text-right` : `text-left`)}>
                  {t('disclosureIntro')}
                </Typography>

                <ul className="list-disc pl-6 space-y-2">
                  <li><Typography variant="body" as="span">{t('disclosure_business')}</Typography></li>
                  <li><Typography variant="body" as="span">{t('disclosure_law')}</Typography></li>
                  <li><Typography variant="body" as="span">{t('disclosure_legal')}</Typography></li>
                </ul>
              </div>

              {/* Security */}
              <div>
                <Typography variant="h2" className={cn( "text-xl font-semibold mt-8 mb-4",  isRtl? `text-right` : `text-left`)}>
                  {t('securityTitle')}
                </Typography>

                <Typography variant="body" className={cn(isRtl? `text-right` : `text-left`)}>
                  {t('securityText')}
                </Typography>
              </div>

              {/* Children */}
              <div>
                <Typography variant="h2" className={cn("text-xl font-semibold mt-8 mb-4" ,  isRtl? `text-right` : `text-left`)}>
                  {t('childrenTitle')}
                </Typography>

                <Typography variant="body" className={cn(isRtl? `text-right` : `text-left`)}>
                  {t('childrenText')}
                </Typography>
              </div>

              {/* Changes */}
              <div>
                <Typography variant="h2" className={cn( "text-xl font-semibold mt-8 mb-4",  isRtl? `text-right` : `text-left`)}>
                  {t('changesTitle')}
                </Typography>

                <Typography variant="body" className={cn(isRtl? `text-right` : `text-left`)}>
                  {t('changesText')}
                </Typography>
              </div>

              {/* Contact */}
              <div>
                <Typography variant="h2" className={cn( "text-xl font-semibold mt-8 mb-4",  isRtl? `text-right` : `text-left`)}>
                  {t('contactTitle')}
                </Typography>

                <Typography variant="body" className={cn(isRtl? `text-right` : `text-left`)}>
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
