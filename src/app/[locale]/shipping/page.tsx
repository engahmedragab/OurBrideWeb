import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { Typography, CardWrapper, Button } from '@/components/ui'
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
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Shipping Information | OurBride',
  description: 'Learn about OurBride shipping policies, delivery times, and tracking information',
}

export default function ShippingPage() {
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
                  Shipping Information
                </Typography>
              </div>
              <div className="w-20 h-1 bg-brand-500 mx-auto md:mx-0" />
              <Typography variant="bodyLarge" textColor="secondary" className="mt-4 max-w-2xl">
                Everything you need to know about shipping, delivery, and tracking your orders
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
                    Delivery Times
                  </Typography>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CardWrapper className="bg-blue-50 border-blue-100" padding="sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <Typography variant="h5">Standard Shipping</Typography>
                      </div>
                      <Typography variant="bodySmall" className="mb-2 leading-relaxed">
                        5-7 business days
                      </Typography>
                      <Typography variant="bodyTiny" textColor="secondary">
                        Delivery times may vary based on location and product availability.
                      </Typography>
                    </CardWrapper>
                  <CardWrapper className="bg-green-50 border-green-100" padding="sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-5 w-5 text-green-600" />
                        <Typography variant="h5">Express Shipping</Typography>
                      </div>
                      <Typography variant="bodySmall" className="mb-2 leading-relaxed">
                        2-3 business days
                      </Typography>
                      <Typography variant="bodyTiny" textColor="secondary">
                        Available for select products. Additional charges apply.
                      </Typography>
                    </CardWrapper>
                  <CardWrapper className="bg-purple-50 border-purple-100" padding="sm">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        <Typography variant="h5">International</Typography>
                      </div>
                      <Typography variant="bodySmall" className="mb-2 leading-relaxed">
                        10-21 business days
                      </Typography>
                      <Typography variant="bodyTiny" textColor="secondary">
                        Customs and import duties may apply.
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
                      Shipping Costs
                    </Typography>
                  </div>
                  <div className="space-y-4">
                    <Typography variant="body" className="mb-4 leading-relaxed">
                      Shipping costs are calculated at checkout based on:
                    </Typography>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><Typography variant="body" as="span">Product weight and dimensions</Typography></li>
                      <li><Typography variant="body" as="span">Delivery address</Typography></li>
                      <li><Typography variant="body" as="span">Selected shipping method</Typography></li>
                      <li><Typography variant="body" as="span">Order value (free shipping may apply for orders above a certain amount)</Typography></li>
                    </ul>
                    <Typography variant="body" className="mt-4 leading-relaxed">
                      You can view the exact shipping cost before completing your purchase.
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
                      Order Tracking
                    </Typography>
                  </div>
                  <Typography variant="body" className="mb-4 leading-relaxed">
                    Once your order ships, you will receive a tracking number via email. You can use this tracking number 
                    to monitor your package&apos;s journey from our warehouse to your doorstep.
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    Track your order by visiting the <a href="/orders" className="text-brand-500 hover:text-brand-600 underline">Orders</a> page 
                    in your account dashboard.
                  </Typography>
              </CardWrapper>

              {/* Delivery Address Section */}
              <CardWrapper padding="lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <Typography variant="h3" className="text-20 md:text-24 font-normal">
                      Delivery Address
                    </Typography>
                  </div>
                  <Typography variant="body" className="mb-4 leading-relaxed">
                    Please ensure your delivery address is complete and accurate. We are not responsible for delays or 
                    lost packages due to incorrect address information.
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    You can update your shipping addresses in your <a href="/addresses" className="text-brand-500 hover:text-brand-600 underline">Addresses</a> page.
                  </Typography>
              </CardWrapper>

              {/* Special Handling Section */}
              <CardWrapper padding="lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-yellow-600" />
                    </div>
                    <Typography variant="h3" className="text-20 md:text-24 font-normal">
                      Special Handling
                    </Typography>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CardWrapper className="bg-yellow-50 border-yellow-100" padding="sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-5 w-5 text-yellow-600" />
                          <Typography variant="h5">Fragile Items</Typography>
                        </div>
                        <Typography variant="bodySmall" className="leading-relaxed">
                          Carefully packaged with extra protection. Please inspect upon delivery and report any damage immediately.
                        </Typography>
                    </CardWrapper>
                    <CardWrapper className="bg-blue-50 border-blue-100" padding="sm">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                          <Typography variant="h5">Signature Required</Typography>
                        </div>
                        <Typography variant="bodySmall" className="leading-relaxed">
                          Some high-value orders may require a signature. You will be notified if signature confirmation is needed.
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
                      Questions About Shipping?
                    </Typography>
                  </div>
                  <Typography variant="body" className="mb-4 leading-relaxed">
                    If you have any questions about shipping or need assistance with your order, we&apos;re here to help.
                  </Typography>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-brand-200 text-brand-500 hover:bg-brand-50"
                    asChild
                  >
                    <a href="/dashboard/help-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Visit Help Center
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

