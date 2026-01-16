import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { Typography, CardWrapper, Button } from '@/components/ui'
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
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Returns & Refunds | OurBride',
  description: 'Learn about OurBride return policy, refund process, and exchange information',
}

export default function ReturnsPage() {
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
                  Returns & Refunds
                </Typography>
              </div>
              <div className="w-20 h-1 bg-brand-500 mx-auto md:mx-0" />
              <Typography variant="bodyLarge" textColor="secondary" className="mt-4 max-w-2xl">
                Simple and hassle-free return process for your peace of mind
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
                      Return Policy
                    </Typography>
                  </div>
                  <div className="space-y-6">
                    <CardWrapper className="bg-blue-50 border-blue-100" padding="sm">
                        <Typography variant="body" className="leading-relaxed">
                          We want you to be completely satisfied with your purchase. If you&apos;re not happy with your order, 
                          you can return most items within <span className="font-semibold text-gray-900">30 days</span> of delivery for a full refund or exchange.
                        </Typography>
                    </CardWrapper>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CardWrapper className="bg-green-50 border-green-100" padding="sm">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <Typography variant="h5">Eligible Items</Typography>
                          </div>
                          <ul className="list-disc list-inside space-y-1.5 ml-2">
                            <li><Typography variant="bodySmall" as="span">Unused and in original condition</Typography></li>
                            <li><Typography variant="bodySmall" as="span">Original packaging and tags included</Typography></li>
                            <li><Typography variant="bodySmall" as="span">Proof of purchase required</Typography></li>
                          </ul>
                      </CardWrapper>
                      <CardWrapper className="bg-red-50 border-red-100" padding="sm">
                          <div className="flex items-center gap-2 mb-3">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <Typography variant="h5">Non-Returnable</Typography>
                          </div>
                          <ul className="list-disc list-inside space-y-1.5 ml-2">
                            <li><Typography variant="bodySmall" as="span">Personalized or customized items</Typography></li>
                            <li><Typography variant="bodySmall" as="span">Perishable goods</Typography></li>
                            <li><Typography variant="bodySmall" as="span">Items damaged by misuse</Typography></li>
                            <li><Typography variant="bodySmall" as="span">Digital products or services</Typography></li>
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
                      How to Return an Item
                    </Typography>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-16 font-normal">
                        1
                      </div>
                      <div className="flex-1">
                        <Typography variant="h5" className="mb-2">Initiate Return</Typography>
                        <Typography variant="body" className="leading-relaxed">
                          Go to your <a href="/orders" className="text-brand-500 hover:text-brand-600 underline font-medium">Orders</a> page, 
                          select the item you want to return, and click &quot;Request Return&quot;.
                        </Typography>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-16 font-normal">
                        2
                      </div>
                      <div className="flex-1">
                        <Typography variant="h5" className="mb-2">Get Return Authorization</Typography>
                        <Typography variant="body" className="leading-relaxed">
                          Once approved, you&apos;ll receive a return authorization and shipping label via email.
                        </Typography>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-16 font-normal">
                        3
                      </div>
                      <div className="flex-1">
                        <Typography variant="h5" className="mb-2">Package & Ship</Typography>
                        <Typography variant="body" className="leading-relaxed">
                          Package the item securely with all original packaging and tags, attach the return label, 
                          and ship it back to us.
                        </Typography>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-16 font-normal">
                        4
                      </div>
                      <div className="flex-1">
                        <Typography variant="h5" className="mb-2">Receive Refund</Typography>
                        <Typography variant="body" className="leading-relaxed">
                          Once we receive and inspect your return, we&apos;ll process your refund to the original 
                          payment method within 5-10 business days.
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
                      Refund Information
                    </Typography>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Typography variant="h5" className="mb-2">Refund Processing Time</Typography>
                      <Typography variant="body" className="leading-relaxed">
                        Refunds are typically processed within 5-10 business days after we receive your return. 
                        The time it takes for the refund to appear in your account depends on your payment method 
                        and financial institution.
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h5" className="mb-2">Shipping Costs</Typography>
                      <Typography variant="body" className="leading-relaxed">
                        Original shipping costs are non-refundable unless the item was defective or we made an error. 
                        Return shipping costs are the responsibility of the customer unless the return is due to our error.
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
                      Exchanges
                    </Typography>
                  </div>
                  <Typography variant="body" className="mb-4 leading-relaxed">
                    If you need a different size, color, or style, you can request an exchange during the return process. 
                    Exchanges are subject to product availability.
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    If the item you want is not available, we&apos;ll process a refund instead.
                  </Typography>
              </CardWrapper>

              {/* Damaged or Defective Items Section */}
              <CardWrapper padding="lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <Typography variant="h3" className="text-20 md:text-24 font-normal">
                      Damaged or Defective Items
                    </Typography>
                  </div>
                  <Typography variant="body" className="mb-4 leading-relaxed">
                    If you receive a damaged or defective item, please contact us immediately. We&apos;ll arrange for 
                    a replacement or full refund, including return shipping costs.
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    Please take photos of the damaged item and packaging to help us process your claim faster.
                  </Typography>
              </CardWrapper>

              {/* Contact Section */}
              <CardWrapper className={cn("bg-gradient-to-br from-brand-50 to-brand-100/50 border-brand-200")} padding="lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="h-5 w-5 text-white" />
                    </div>
                    <Typography variant="h3" className="text-20 md:text-24 font-normal">
                      Need Help with Returns?
                    </Typography>
                  </div>
                  <Typography variant="body" className="mb-4 leading-relaxed">
                    If you have questions about returns or need assistance, we&apos;re here to help.
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
