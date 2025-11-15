import React from "react";
import ContactForm from "./ContactForm";

export default function Contact() {

  return (
    <>
      <div className="contact-section">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-gradient"></div>
            <div className="hero-particles">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
              <div className="particle particle-5"></div>
            </div>
          </div>
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="hero-content">
                  <div className="hero-badge">
                    <div className="badge-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <span>Contact Us</span>
                  </div>
                  <h1 className="hero-title">
                    Get in <span className="text-gradient">Touch</span>
                  </h1>
                  <p className="hero-description">
                    We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    Our dedicated team is here to help with your wedding planning journey.
                  </p>
                  <div className="hero-stats">
                    <div className="stat-item">
                      <div className="stat-number">24/7</div>
                      <div className="stat-label">Support Available</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">2hr</div>
                      <div className="stat-label">Response Time</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">98%</div>
                      <div className="stat-label">Satisfaction Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-form-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <ContactForm
                  source="Contact Form"
                  title="Send us a Message"
                  subtitle="We're here to help with any questions about your wedding planning"
                  showPhone={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="contact-info-section">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="section-header">
                  <div className="section-badge">
                    <i className="fas fa-info-circle"></i>
                    <span>Contact Information</span>
                  </div>
                  <h2 className="section-title">Get in Touch</h2>
                  <p className="section-description">
                    Multiple ways to reach our support team
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-4">
                <div className="contact-info-card">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <h3>Email Us</h3>
                  <p>support@our-bride.com</p>
                  <span className="contact-note">We respond within 2 hours</span>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="contact-info-card featured">
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <h3>Business Hours</h3>
                  <p>Mon-Fri 9AM-6PM</p>
                  <span className="contact-note">24/7 online support available</span>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="contact-info-card">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <h3>Call Us</h3>
                  <p>+1 (555) 123-4567</p>
                  <span className="contact-note">Available during business hours</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Features Section */}
        <section className="support-features-section">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="section-header">
                  <div className="section-badge">
                    <i className="fas fa-headset"></i>
                    <span>Support Features</span>
                  </div>
                  <h2 className="section-title">How We Help You</h2>
                  <p className="section-description">
                    Our dedicated support team is here to help you get the most out of your wedding planning experience
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-4">
                <div className="support-feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-headset"></i>
                  </div>
                  <h3>24/7 Support</h3>
                  <p>Get help anytime, day or night. Our support team is always ready to assist you with any questions or concerns.</p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="support-feature-card featured">
                  <div className="feature-icon">
                    <i className="fas fa-comments"></i>
                  </div>
                  <h3>Quick Response</h3>
                  <p>We pride ourselves on fast response times. Most inquiries are answered within 2 hours during business hours.</p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="support-feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-video"></i>
                  </div>
                  <h3>Expert Guidance</h3>
                  <p>Our team includes wedding planning experts who can provide personalized advice for your special day.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="section-header">
                  <div className="section-badge">
                    <i className="fas fa-question-circle"></i>
                    <span>FAQ</span>
                  </div>
                  <h2 className="section-title">Frequently Asked Questions</h2>
                  <p className="section-description">
                    Find quick answers to common questions about OurBride app and services
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6">
                <div className="faq-item">
                  <div className="faq-icon">
                    <i className="fas fa-download"></i>
                  </div>
                  <div className="faq-content">
                    <h4>How do I download the OurBride app?</h4>
                    <p>You can download OurBride from Google Play Store and App Store. The app is available for both Android and iOS devices.</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="faq-item">
                  <div className="faq-icon">
                    <i className="fas fa-gift"></i>
                  </div>
                  <div className="faq-content">
                    <h4>Is OurBride app free to use?</h4>
                    <p>Yes, the OurBride app is completely free to download and use. Some premium features may require a subscription.</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="faq-item">
                  <div className="faq-icon">
                    <i className="fas fa-sync"></i>
                  </div>
                  <div className="faq-content">
                    <h4>Can I sync my wedding plans across devices?</h4>
                    <p>Absolutely! Your wedding plans automatically sync across all your devices when you're signed in to your OurBride account.</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="faq-item">
                  <div className="faq-icon">
                    <i className="fas fa-store"></i>
                  </div>
                  <div className="faq-content">
                    <h4>How do I find vendors through the app?</h4>
                    <p>Browse our curated list of verified vendors in the app, read reviews, and book services directly through the platform.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="cta-content">
                  <h2 className="cta-title">Ready to Start Your Wedding Planning?</h2>
                  <p className="cta-description">
                    Download OurBride app today and begin your journey to the perfect wedding
                  </p>
                  <div className="cta-buttons">
                    <a
                      href="https://apps.apple.com/sa/app/ourbride/id6747453812"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-main cta-btn"
                    >
                      <i className="fas fa-download me-2"></i>
                      Download App
                    </a>
                    <a href="https://www.our-bride.store" className="btn btn-outline-main cta-btn">
                      <i className="fas fa-store me-2"></i>
                      Visit Store
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
