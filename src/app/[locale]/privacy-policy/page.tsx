import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { Typography, CardWrapper } from '@/components/ui'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-secondary">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8 max-w-4xl">
          <CardWrapper padding="lg">
              <Typography variant="h1" textColor="primary" className="text-2xl md:text-3xl font-bold mb-4">
                Privacy Policy for OurBride
              </Typography>
              <Typography variant="body" className="mb-6">
                <strong>Last updated: June 28, 2024</strong>
              </Typography>

              <div className="space-y-6">
                <Typography variant="body" className="mb-4">
                  This Privacy Policy describes Our policies and procedures on the collection, use, and
                  disclosure of Your information when You use the Service and tells You about Your
                  privacy rights and how the law protects You.
                </Typography>

                <Typography variant="body" className="mb-4">
                  We use Your Personal data to provide and improve the Service. By using the Service, You
                  agree to the collection and use of information in accordance with this Privacy Policy.
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
                    of whether they appear in singular or plural.
                  </Typography>

                  <Typography variant="h3" className="text-lg font-semibold mt-6 mb-3">
                    Definitions
                  </Typography>
                  <Typography variant="body" className="mb-4">
                    For the purposes of this Privacy Policy:
                  </Typography>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Account</strong> means a unique account created for You to access our Service
                        or parts of our Service.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Affiliate</strong> means an entity that controls, is controlled by, or is
                        under common control with a party, where &quot;control&quot; means ownership of 50% or more of
                        the shares, equity interest, or other securities entitled to vote for election of
                        directors or other managing authority.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Application</strong> refers to Our Bride, the software program provided by
                        the Company.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or
                        &quot;Our&quot; in this Agreement) refers to OurBride.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Cookies</strong> are small files that are placed on Your computer, mobile
                        device, or any other device by a website, containing the details of Your browsing
                        history on that website among its many uses.
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
                        computer, a cellphone, or a digital tablet.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Personal Data</strong> is any information that relates to an identified or
                        identifiable individual.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Service</strong> refers to the Application or the Website or both.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Service Provider</strong> means any natural or legal person who processes the
                        data on behalf of the Company. It refers to third-party companies or individuals
                        employed by the Company to facilitate the Service, to provide the Service on behalf of
                        the Company, to perform services related to the Service, or to assist the Company in
                        analyzing how the Service is used.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Usage Data</strong> refers to data collected automatically, either generated
                        by the use of the Service or from the Service infrastructure itself (for example, the
                        duration of a page visit).
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
                    Collecting and Using Your Personal Data
                  </Typography>

                  <Typography variant="h3" className="text-lg font-semibold mt-6 mb-3">
                    Types of Data Collected
                  </Typography>

                  <Typography variant="h4" className="text-base font-semibold mt-4 mb-2">
                    Personal Data
                  </Typography>
                  <Typography variant="body" className="mb-4">
                    While using Our Service, We may ask You to provide Us with certain personally
                    identifiable information that can be used to contact or identify You. Personally
                    identifiable information may include, but is not limited to:
                  </Typography>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <Typography variant="body" as="span">Email address</Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">Usage Data</Typography>
                    </li>
                  </ul>

                  <Typography variant="h4" className="text-base font-semibold mt-4 mb-2">
                    Usage Data
                  </Typography>
                  <Typography variant="body" className="mb-4">
                    Usage Data is collected automatically when using the Service. Usage Data may include
                    information such as Your Device&apos;s Internet Protocol address (e.g. IP address), browser
                    type, browser version, the pages of our Service that You visit, the time and date of
                    Your visit, the time spent on those pages, unique device identifiers and other
                    diagnostic data.
                  </Typography>

                  <Typography variant="h3" className="text-lg font-semibold mt-6 mb-3">
                    Information Collected while Using the Application
                  </Typography>
                  <Typography variant="body" className="mb-4">
                    While using Our Application, in order to provide features of Our Application, We may
                    collect, with Your prior permission:
                  </Typography>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <Typography variant="body" as="span">Information regarding your location</Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">Information from your Device&apos;s phone book (contacts list)</Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        Pictures and other information from your Device&apos;s camera and photo library
                      </Typography>
                    </li>
                  </ul>
                  <Typography variant="body" className="mb-4">
                    We use this information to provide features of Our Service, to improve and customize
                    Our Service. The information may be uploaded to the Company&apos;s servers and/or a Service
                    Provider&apos;s server or it may be simply stored on Your device.
                  </Typography>

                  <Typography variant="h3" className="text-lg font-semibold mt-6 mb-3">
                    Tracking Technologies and Cookies
                  </Typography>
                  <Typography variant="body">
                    We use Cookies and similar tracking technologies to track the activity on Our Service
                    and store certain information.
                  </Typography>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Use of Your Personal Data
                  </Typography>
                  <Typography variant="body" className="mb-4">
                    The Company may use Personal Data for the following purposes:
                  </Typography>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <Typography variant="body" as="span">
                        <strong>To provide and maintain our Service</strong>, including to monitor the usage
                        of our Service.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>To manage Your Account</strong>: to manage Your registration as a user of the
                        Service.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>For the performance of a contract</strong>: the development, compliance, and
                        undertaking of the purchase contract for products, items, or services You have
                        purchased.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>To contact You</strong>: by email, phone, or other equivalent forms of
                        electronic communication.
                      </Typography>
                    </li>
                  </ul>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Retention of Your Personal Data
                  </Typography>
                  <Typography variant="body">
                    The Company will retain Your Personal Data only for as long as necessary for the
                    purposes set out in this Privacy Policy.
                  </Typography>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Disclosure of Your Personal Data
                  </Typography>
                  <Typography variant="body" className="mb-4">
                    We may disclose Your Personal Data in the following situations:
                  </Typography>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Business Transactions:</strong> If the Company is involved in a merger,
                        acquisition, or asset sale.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Law enforcement:</strong> If required by law or in response to valid requests
                        by public authorities.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body" as="span">
                        <strong>Other legal requirements:</strong> To protect against legal liability.
                      </Typography>
                    </li>
                  </ul>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Security of Your Personal Data
                  </Typography>
                  <Typography variant="body">
                    The security of Your Personal Data is important to Us, but remember that no method of
                    transmission over the Internet is 100% secure.
                  </Typography>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Children&apos;s Privacy
                  </Typography>
                  <Typography variant="body">
                    We do not knowingly collect personally identifiable information from anyone under the
                    age of 13. If You are a parent or guardian and You are aware that Your child has
                    provided Us with Personal Data, please contact Us.
                  </Typography>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Changes to this Privacy Policy
                  </Typography>
                  <Typography variant="body">
                    We may update Our Privacy Policy from time to time. You are advised to review this
                    Privacy Policy periodically for any changes.
                  </Typography>
                </div>

                <div>
                  <Typography variant="h2" className="text-xl font-semibold mt-8 mb-4">
                    Contact Us
                  </Typography>
                  <Typography variant="body">
                    If you have any questions about this Privacy Policy, You can contact us at:{' '}
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
