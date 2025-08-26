import React from "react";
import MainButton from "../../SimpleComponent/MainButton/MainButton";

export default function Contact() {
  return (
    <>
      <div className="contact-section">
        <div className="container">
          {/* Hero Section */}
          <div className="contact-hero">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="contact-title">
                  Get in <span className="text-main">Touch</span>
                </h1>
                <p className="contact-subtitle">
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="contact-form-section">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="contact-form-container">
                  <h2 className="form-title">Send us a Message</h2>
                  <form className="contact-form">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="name" className="form-label">
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="email" className="form-label">
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject" className="form-label">
                        Subject
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        placeholder="What is this about?"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message" className="form-label">
                        Message
                      </label>
                      <textarea
                        className="form-control"
                        id="message"
                        rows="5"
                        placeholder="Tell us more about your inquiry..."
                      ></textarea>
                    </div>

                    <div className="form-actions">
                      <MainButton
                        title="Send Message"
                        classes="btn-main contact-btn"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="contact-info-section">
            <div className="row">
              <div className="col-lg-4">
                <div className="contact-info-card">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <h3>Email Us</h3>
                  <p>support@ourbride.com</p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="contact-info-card">
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <h3>Business Hours</h3>
                  <p>Mon-Fri 9AM-6PM</p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="contact-info-card">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <h3>Call Us</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* App Support Section */}
          <div className="app-support-section">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="support-content">
                  <h2 className="section-title">Need Help with OurBride App?</h2>
                  <p className="section-description">
                    Our dedicated support team is here to help you get the most out of your wedding planning experience. Whether you need technical assistance or wedding planning advice, we're just a message away.
                  </p>
                  <div className="support-features">
                    <div className="support-feature">
                      <div className="feature-icon">
                        <i className="fas fa-headset"></i>
                      </div>
                      <div>
                        <h4>24/7 Support</h4>
                        <p>Get help anytime, day or night</p>
                      </div>
                    </div>
                    <div className="support-feature">
                      <div className="feature-icon">
                        <i className="fas fa-comments"></i>
                      </div>
                      <div>
                        <h4>Live Chat</h4>
                        <p>Instant responses to your questions</p>
                      </div>
                    </div>
                    <div className="support-feature">
                      <div className="feature-icon">
                        <i className="fas fa-video"></i>
                      </div>
                      <div>
                        <h4>Video Calls</h4>
                        <p>Personal assistance when you need it most</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="support-visual">
                  <div className="support-illustration">
                    <div className="support-card">
                      <div className="support-header">
                        <i className="fas fa-heart"></i>
                        <h3>OurBride Support</h3>
                      </div>
                      <div className="support-message">
                        <p>"How can we help make your wedding planning journey easier?"</p>
                      </div>
                      <div className="support-actions">
                        <button className="btn btn-main">Start Chat</button>
                        <button className="btn btn-outline-main">Schedule Call</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h2 className="section-title">Frequently Asked Questions</h2>
                <p className="section-description">
                  Find quick answers to common questions about OurBride app and services
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="faq-item">
                  <h4>How do I download the OurBride app?</h4>
                  <p>You can download OurBride from Google Play Store. The app is currently available for Android devices, with iOS version coming soon.</p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="faq-item">
                  <h4>Is OurBride app free to use?</h4>
                  <p>Yes, the OurBride app is completely free to download and use. Some premium features may require a subscription.</p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="faq-item">
                  <h4>Can I sync my wedding plans across devices?</h4>
                  <p>Absolutely! Your wedding plans automatically sync across all your devices when you're signed in to your OurBride account.</p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="faq-item">
                  <h4>How do I find vendors through the app?</h4>
                  <p>Browse our curated list of verified vendors in the app, read reviews, and book services directly through the platform.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="contact-cta-section">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h2 className="cta-title">Ready to Start Your Wedding Planning?</h2>
                <p className="cta-description">
                  Download OurBride app today and begin your journey to the perfect wedding
                </p>
                <div className="cta-buttons">
                  <MainButton
                    title="Download App"
                    classes="btn-main cta-btn"
                  />
                  <a href="https://www.our-bride.store" className="btn btn-outline-main cta-btn">
                    Visit Store
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
