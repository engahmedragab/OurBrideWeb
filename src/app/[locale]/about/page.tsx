'use client'

import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { Typography, CardWrapper, Button } from '@/components/ui'
import {
  Target,
  Eye,
  Heart,
  Shield,
  Star,
  Users,
  Lightbulb,
  Mail,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AboutPage() {
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
                  <Heart className="h-6 w-6 text-brand-500" />
                </div>
                <Typography variant="h1" className="text-24 md:text-32 font-normal">
                  About OurBride
                </Typography>
              </div>
              <div className="w-20 h-1 bg-brand-500 mx-auto md:mx-0" />
              <Typography variant="bodyLarge" textColor="secondary" className="mt-4 max-w-2xl">
                Your trusted partner for creating the perfect wedding experience
              </Typography>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 md:space-y-12">
              {/* Mission Section */}
              <CardWrapper padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <Typography variant="h3" className="text-20 md:text-24 font-normal">
                    Our Mission
                  </Typography>
                </div>
                <Typography variant="body" textColor="default" className="mb-4 leading-relaxed">
                  At OurBride, we believe that every wedding should be a perfect reflection of your unique love story. 
                  Our mission is to make wedding planning effortless, enjoyable, and memorable by connecting brides and 
                  grooms with the finest wedding products and services.
                </Typography>
                <Typography variant="body" textColor="default" className="leading-relaxed">
                  We are committed to providing a seamless experience where you can discover, compare, and book everything 
                  you need for your special day - all in one place.
                </Typography>
              </CardWrapper>

              {/* Vision Section */}
              <CardWrapper padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Eye className="h-5 w-5 text-purple-600" />
                  </div>
                  <Typography variant="h3" className="text-20 md:text-24 font-normal">
                    Our Vision
                  </Typography>
                </div>
                <Typography variant="body" textColor="default" className="mb-4 leading-relaxed">
                  We envision a world where wedding planning is stress-free and accessible to everyone. Our platform brings 
                  together verified service providers, quality products, and a supportive community to help you create the 
                  wedding of your dreams.
                </Typography>
                <Typography variant="body" textColor="default" className="leading-relaxed">
                  Through innovation, trust, and dedication, we aim to be the leading destination for couples planning their 
                  perfect day.
                </Typography>
              </CardWrapper>

              {/* Values Section */}
              <CardWrapper padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <Typography variant="h3" className="text-20 md:text-24 font-normal">
                    Our Values
                  </Typography>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <Typography variant="h5" className="mb-2">Trust & Transparency</Typography>
                      <Typography variant="body" textColor="default" className="leading-relaxed">
                        We verify all service providers and maintain transparent pricing to ensure you make informed decisions.
                      </Typography>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <Typography variant="h5" className="mb-2">Quality & Excellence</Typography>
                      <Typography variant="body" textColor="default" className="leading-relaxed">
                        We curate only the best products and services, ensuring high standards and exceptional quality for your special day.
                      </Typography>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-pink-50 flex items-center justify-center">
                      <Users className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <Typography variant="h5" className="mb-2">Community & Support</Typography>
                      <Typography variant="body" textColor="default" className="leading-relaxed">
                        Our vibrant community of brides, grooms, and wedding professionals supports and inspires each other throughout the planning journey.
                      </Typography>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <Typography variant="h5" className="mb-2">Innovation & Convenience</Typography>
                      <Typography variant="body" textColor="default" className="leading-relaxed">
                        We continuously innovate to make wedding planning easier, faster, and more convenient through technology and user-friendly solutions.
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardWrapper>

              {/* Contact Section */}
              <CardWrapper className={cn("bg-gradient-to-br from-brand-50 to-brand-100/50 border-brand-200")} padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <Typography variant="h3" className="text-20 md:text-24 font-normal">
                    Get in Touch
                  </Typography>
                </div>
                <Typography variant="body" textColor="default" className="mb-4 leading-relaxed">
                  Have questions or feedback? We&apos;d love to hear from you!
                </Typography>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-brand-200 text-brand-500 hover:bg-brand-50"
                    asChild
                  >
                    <a href="/dashboard/help-center">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Visit Help Center
                    </a>
                  </Button>
                </div>
              </CardWrapper>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

