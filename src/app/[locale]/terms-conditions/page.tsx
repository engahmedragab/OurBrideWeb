import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { Typography, CardWrapper } from '@/components/ui'

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-secondary">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8 max-w-4xl">
          <CardWrapper padding="lg">
              <Typography variant="h1" textColor="primary" className="text-2xl md:text-3xl font-bold mb-4">
                Terms and Conditions for OurBride
              </Typography>
              <Typography variant="body" className="mb-6">
                <strong>Last updated: June 28, 2024</strong>
              </Typography>

              <div className="space-y-6">
                <Typography variant="body">
                  Please read these terms and conditions carefully before using Our Service.
                </Typography>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Interpretation and Definitions
                  </Typography>

                  <Typography variant="h3" className="text-lg font-semibold mt-6 mb-3">
                    Interpretation
                  </Typography>
                  <Typography variant="body" className="mb-4">
                    The words of which the initial letter is capitalized have meanings defined under the
                    following conditions. The following definitions shall have the same meaning regardless
                    of whether they appear in singular or in plural.
                  </Typography>

                  <Typography variant="h3" className="text-lg font-semibold mt-6 mb-3">
                    Definitions
                  </Typography>
                  <Typography variant="body" className="mb-4">
                    For the purposes of these Terms and Conditions:
                  </Typography>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Application</strong> means the software program provided by the Company
                        downloaded by You on any electronic device, named OurBride.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Application Store</strong> refers to the digital distribution service
                        operated by Apple Inc. (Apple App Store) or Google Inc. (Google Play Store) in which
                        the Application has been downloaded.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Company</strong> refers to OurBride, Cairo, 15 May.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Country</strong> refers to: Egypt.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Device</strong> means any device that can access the Service such as a
                        computer, cellphone, or digital tablet.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Service</strong> refers to the Application or the Website or both.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Terms and Conditions</strong> mean these Terms and Conditions that form the
                        entire agreement between You and the Company regarding the use of the Service.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Website</strong> refers to OurBride, accessible from{' '}
                        <a
                          href="https://www.our-bride.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-500 hover:text-brand-600 underline"
                        >
                          https://www.our-bride.com
                        </a>
                        .
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>You</strong> means the individual accessing or using the Service, or the
                        company, or other legal entity on behalf of which such individual is accessing or
                        using the Service, as applicable.
                      </Typography>
                    </li>
                  </ul>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Acknowledgment
                  </Typography>
                  <Typography variant="body" className="mb-4">
                    These are the Terms and Conditions governing the use of this Service and the agreement
                    that operates between You and the Company. These Terms and Conditions set out the
                    rights and obligations of all users regarding the use of the Service.
                  </Typography>
                  <Typography variant="body" className="mb-4">
                    Your access to and use of the Service is conditioned on Your acceptance of and
                    compliance with these Terms and Conditions. By accessing or using the Service You agree
                    to be bound by these Terms and Conditions. If You disagree with any part of these Terms
                    and Conditions, then You may not access the Service.
                  </Typography>
                  <Typography variant="body" className="mb-4">
                    You represent that you are over the age of 18. The Company does not permit those under
                    18 to use the Service.
                  </Typography>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Links to Other Websites
                  </Typography>
                  <Typography variant="body">
                    Our Service may contain links to third-party websites or services that are not owned or
                    controlled by the Company. The Company has no control over, and assumes no
                    responsibility for, the content, privacy policies, or practices of any third-party
                    websites or services. You acknowledge and agree that the Company shall not be
                    responsible or liable, directly or indirectly, for any damage or loss caused by the use
                    of any such content available on such websites or services.
                  </Typography>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Termination
                  </Typography>
                  <Typography variant="body">
                    We may terminate or suspend Your access immediately, without prior notice or liability,
                    for any reason, including if You breach these Terms and Conditions.
                  </Typography>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Limitation of Liability
                  </Typography>
                  <Typography variant="body">
                    To the maximum extent permitted by applicable law, the Company or its suppliers will
                    not be liable for any incidental, indirect, or consequential damages.
                  </Typography>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; Disclaimer
                  </Typography>
                  <Typography variant="body">
                    The Service is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without any warranties of any kind.
                    The Company makes no warranties regarding the operation or availability of the Service.
                  </Typography>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Governing Law
                  </Typography>
                  <Typography variant="body">
                    The laws of Egypt shall govern these Terms and Your use of the Service.
                  </Typography>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Disputes Resolution
                  </Typography>
                  <Typography variant="body">
                    If You have any concern or dispute about the Service, You agree to first try to resolve
                    the dispute informally by contacting the Company.
                  </Typography>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Changes to These Terms and Conditions
                  </Typography>
                  <Typography variant="body">
                    We reserve the right to modify or replace these Terms at any time. By continuing to
                    access or use Our Service after those revisions become effective, You agree to be bound
                    by the revised terms.
                  </Typography>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Contact Us
                  </Typography>
                  <Typography variant="body">
                    If you have any questions about these Terms and Conditions, You can contact us by
                    email:{' '}
                    <a href="mailto:info@our-bride.com" className="text-brand-500 hover:text-brand-600 underline">
                      info@our-bride.com
                    </a>
                    .
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
