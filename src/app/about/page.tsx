import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: 'About Us | OurBride',
  description:
    'Learn about OurBride - your trusted partner for wedding products and services',
}

export default function AboutPage() {
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
                  <Heart className="h-6 w-6 text-brand-500" />
                </div>
                <h1 className="text-24 md:text-32 font-normal text-gray-900">
                  About OurBride
                </h1>
              </div>
              <div className="w-20 h-1 bg-brand-500 mx-auto md:mx-0" />
              <p className="text-16 text-gray-600 mt-4 max-w-2xl">
                Your trusted partner for creating the perfect wedding experience
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 md:space-y-12">
              {/* Mission Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Our Mission
                  </h2>
                </div>
                <p className="text-16 text-gray-700 leading-relaxed mb-4">
                  At OurBride, we believe that every wedding should be a perfect
                  reflection of your unique love story. Our mission is to make
                  wedding planning effortless, enjoyable, and memorable by
                  connecting brides and grooms with the finest wedding products
                  and services.
                </p>
                <p className="text-16 text-gray-700 leading-relaxed">
                  We are committed to providing a seamless experience where you
                  can discover, compare, and book everything you need for your
                  special day - all in one place.
                </p>
              </section>

              {/* Vision Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Eye className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Our Vision
                  </h2>
                </div>
                <p className="text-16 text-gray-700 leading-relaxed mb-4">
                  We envision a world where wedding planning is stress-free and
                  accessible to everyone. Our platform brings together verified
                  service providers, quality products, and a supportive
                  community to help you create the wedding of your dreams.
                </p>
                <p className="text-16 text-gray-700 leading-relaxed">
                  Through innovation, trust, and dedication, we aim to be the
                  leading destination for couples planning their perfect day.
                </p>
              </section>

              {/* Values Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Our Values
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-18 font-normal text-gray-900 mb-2">
                        Trust & Transparency
                      </h3>
                      <p className="text-16 text-gray-700 leading-relaxed">
                        We verify all service providers and maintain transparent
                        pricing to ensure you make informed decisions.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-18 font-normal text-gray-900 mb-2">
                        Quality & Excellence
                      </h3>
                      <p className="text-16 text-gray-700 leading-relaxed">
                        We curate only the best products and services, ensuring
                        high standards and exceptional quality for your special
                        day.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-18 font-normal text-gray-900 mb-2">
                        Community & Support
                      </h3>
                      <p className="text-16 text-gray-700 leading-relaxed">
                        Our vibrant community of brides, grooms, and wedding
                        professionals supports and inspires each other
                        throughout the planning journey.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-18 font-normal text-gray-900 mb-2">
                        Innovation & Convenience
                      </h3>
                      <p className="text-16 text-gray-700 leading-relaxed">
                        We continuously innovate to make wedding planning
                        easier, faster, and more convenient through technology
                        and user-friendly solutions.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section className="bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-xl border border-brand-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-20 md:text-24 font-normal text-gray-900">
                    Get in Touch
                  </h2>
                </div>
                <p className="text-16 text-gray-700 leading-relaxed mb-4">
                  Have questions or feedback? We&apos;d love to hear from you!
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/dashboard/help-center"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-brand-200 text-brand-500 hover:bg-brand-50 transition-colors text-14 font-medium"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Visit Help Center
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
