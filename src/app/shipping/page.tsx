import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: 'Shipping Information | OurBride',
  description:
    'Learn about OurBride shipping policies, delivery times, and tracking information',
}

export default function ShippingPage() {
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
                  <Truck className="h-6 w-6 text-brand-500" />
                </div>
                <h1 className="text-24 md:text-32 font-normal text-gray-900">
                  Shipping Information
                </h1>
              </div>
              <div className="w-20 h-1 bg-brand-500 mx-auto md:mx-0" />
              <p className="text-16 text-gray-600 mt-4 max-w-2xl">
                Everything you need to know about shipping, delivery, and
                tracking your orders
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 md:space-y-12">
              {/* Delivery Times Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Delivery Times
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      <h3 className="text-16 font-normal text-gray-900">
                        Standard Shipping
                      </h3>
                    </div>
                    <p className="text-14 text-gray-700 leading-relaxed mb-2">
                      5-7 business days
                    </p>
                    <p className="text-13 text-gray-600">
                      Delivery times may vary based on location and product
                      availability.
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-5 w-5 text-green-600" />
                      <h3 className="text-16 font-normal text-gray-900">
                        Express Shipping
                      </h3>
                    </div>
                    <p className="text-14 text-gray-700 leading-relaxed mb-2">
                      2-3 business days
                    </p>
                    <p className="text-13 text-gray-600">
                      Available for select products. Additional charges apply.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      <h3 className="text-16 font-normal text-gray-900">
                        International
                      </h3>
                    </div>
                    <p className="text-14 text-gray-700 leading-relaxed mb-2">
                      10-21 business days
                    </p>
                    <p className="text-13 text-gray-600">
                      Customs and import duties may apply.
                    </p>
                  </div>
                </div>
              </section>

              {/* Shipping Costs Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Shipping Costs
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="text-16 text-gray-700 leading-relaxed mb-4">
                    Shipping costs are calculated at checkout based on:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-16 text-gray-700 ml-4">
                    <li>Product weight and dimensions</li>
                    <li>Delivery address</li>
                    <li>Selected shipping method</li>
                    <li>
                      Order value (free shipping may apply for orders above a
                      certain amount)
                    </li>
                  </ul>
                  <p className="text-16 text-gray-700 leading-relaxed mt-4">
                    You can view the exact shipping cost before completing your
                    purchase.
                  </p>
                </div>
              </section>

              {/* Tracking Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Order Tracking
                  </h2>
                </div>
                <p className="text-16 text-gray-700 leading-relaxed mb-4">
                  Once your order ships, you will receive a tracking number via
                  email. You can use this tracking number to monitor your
                  package&apos;s journey from our warehouse to your doorstep.
                </p>
                <p className="text-16 text-gray-700 leading-relaxed">
                  Track your order by visiting the{' '}
                  <a
                    href="/orders"
                    className="text-brand-500 hover:text-brand-600 underline"
                  >
                    Orders
                  </a>{' '}
                  page in your account dashboard.
                </p>
              </section>

              {/* Delivery Address Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Delivery Address
                  </h2>
                </div>
                <p className="text-16 text-gray-700 leading-relaxed mb-4">
                  Please ensure your delivery address is complete and accurate.
                  We are not responsible for delays or lost packages due to
                  incorrect address information.
                </p>
                <p className="text-16 text-gray-700 leading-relaxed">
                  You can update your shipping addresses in your{' '}
                  <a
                    href="/addresses"
                    className="text-brand-500 hover:text-brand-600 underline"
                  >
                    Addresses
                  </a>{' '}
                  page.
                </p>
              </section>

              {/* Special Handling Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-yellow-600" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Special Handling
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-yellow-600" />
                      <h3 className="text-16 font-normal text-gray-900">
                        Fragile Items
                      </h3>
                    </div>
                    <p className="text-14 text-gray-700 leading-relaxed">
                      Carefully packaged with extra protection. Please inspect
                      upon delivery and report any damage immediately.
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      <h3 className="text-16 font-normal text-gray-900">
                        Signature Required
                      </h3>
                    </div>
                    <p className="text-14 text-gray-700 leading-relaxed">
                      Some high-value orders may require a signature. You will
                      be notified if signature confirmation is needed.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section className="bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-xl border border-brand-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Questions About Shipping?
                  </h2>
                </div>
                <p className="text-16 text-gray-700 leading-relaxed mb-4">
                  If you have any questions about shipping or need assistance
                  with your order, we&apos;re here to help.
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
