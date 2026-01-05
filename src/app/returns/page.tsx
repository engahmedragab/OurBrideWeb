import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: 'Returns & Refunds | OurBride',
  description:
    'Learn about OurBride return policy, refund process, and exchange information',
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 md:mb-12 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center">
                  <RotateCcw className="h-6 w-6 text-brand-500" />
                </div>
                <h1 className="text-24 md:text-32 font-normal text-gray-900">
                  Returns & Refunds
                </h1>
              </div>
              <div className="w-20 h-1 bg-brand-500 mx-auto md:mx-0" />
              <p className="text-16 text-gray-600 mt-4 max-w-2xl">
                Simple and hassle-free return process for your peace of mind
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 md:space-y-12">
              {/* Return Policy Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Return Policy
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-16 text-gray-700 leading-relaxed">
                      We want you to be completely satisfied with your purchase.
                      If you&apos;re not happy with your order, you can return
                      most items within{' '}
                      <span className="font-semibold text-gray-900">
                        30 days
                      </span>{' '}
                      of delivery for a full refund or exchange.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <h3 className="text-16 font-normal text-gray-900">
                          Eligible Items
                        </h3>
                      </div>
                      <ul className="list-disc list-inside space-y-1.5 text-14 text-gray-700 ml-2">
                        <li>Unused and in original condition</li>
                        <li>Original packaging and tags included</li>
                        <li>Proof of purchase required</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <div className="flex items-center gap-2 mb-3">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <h3 className="text-16 font-normal text-gray-900">
                          Non-Returnable
                        </h3>
                      </div>
                      <ul className="list-disc list-inside space-y-1.5 text-14 text-gray-700 ml-2">
                        <li>Personalized or customized items</li>
                        <li>Perishable goods</li>
                        <li>Items damaged by misuse</li>
                        <li>Digital products or services</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Return Process Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    How to Return an Item
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-16 font-normal">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-18 font-normal text-gray-900 mb-2">
                        Initiate Return
                      </h3>
                      <p className="text-16 text-gray-700 leading-relaxed">
                        Go to your{' '}
                        <a
                          href="/orders"
                          className="text-brand-500 hover:text-brand-600 underline font-medium"
                        >
                          Orders
                        </a>{' '}
                        page, select the item you want to return, and click
                        &quot;Request Return&quot;.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-16 font-normal">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-18 font-normal text-gray-900 mb-2">
                        Get Return Authorization
                      </h3>
                      <p className="text-16 text-gray-700 leading-relaxed">
                        Once approved, you&apos;ll receive a return
                        authorization and shipping label via email.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-16 font-normal">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-18 font-normal text-gray-900 mb-2">
                        Package & Ship
                      </h3>
                      <p className="text-16 text-gray-700 leading-relaxed">
                        Package the item securely with all original packaging
                        and tags, attach the return label, and ship it back to
                        us.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-16 font-normal">
                      4
                    </div>
                    <div className="flex-1">
                      <h3 className="text-18 font-normal text-gray-900 mb-2">
                        Receive Refund
                      </h3>
                      <p className="text-16 text-gray-700 leading-relaxed">
                        Once we receive and inspect your return, we&apos;ll
                        process your refund to the original payment method
                        within 5-10 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Refund Information Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Refund Information
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-18 font-normal text-gray-900 mb-2">
                      Refund Processing Time
                    </h3>
                    <p className="text-16 text-gray-700 leading-relaxed">
                      Refunds are typically processed within 5-10 business days
                      after we receive your return. The time it takes for the
                      refund to appear in your account depends on your payment
                      method and financial institution.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-18 font-normal text-gray-900 mb-2">
                      Shipping Costs
                    </h3>
                    <p className="text-16 text-gray-700 leading-relaxed">
                      Original shipping costs are non-refundable unless the item
                      was defective or we made an error. Return shipping costs
                      are the responsibility of the customer unless the return
                      is due to our error.
                    </p>
                  </div>
                </div>
              </section>

              {/* Exchanges Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Exchanges
                  </h2>
                </div>
                <p className="text-16 text-gray-700 leading-relaxed mb-4">
                  If you need a different size, color, or style, you can request
                  an exchange during the return process. Exchanges are subject
                  to product availability.
                </p>
                <p className="text-16 text-gray-700 leading-relaxed">
                  If the item you want is not available, we&apos;ll process a
                  refund instead.
                </p>
              </section>

              {/* Damaged or Defective Items Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Damaged or Defective Items
                  </h2>
                </div>
                <p className="text-16 text-gray-700 leading-relaxed mb-4">
                  If you receive a damaged or defective item, please contact us
                  immediately. We&apos;ll arrange for a replacement or full
                  refund, including return shipping costs.
                </p>
                <p className="text-16 text-gray-700 leading-relaxed">
                  Please take photos of the damaged item and packaging to help
                  us process your claim faster.
                </p>
              </section>

              {/* Contact Section */}
              <section className="bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-xl border border-brand-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Need Help with Returns?
                  </h2>
                </div>
                <p className="text-16 text-gray-700 leading-relaxed mb-4">
                  If you have questions about returns or need assistance,
                  we&apos;re here to help.
                </p>
                <a
                  href="/dashboard/help-center"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-brand-200 text-brand-500 hover:bg-brand-50 transition-colors text-14 font-medium"
                >
                  <HelpCircle className="h-4 w-4" />
                  Visit Help Center
                </a>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
