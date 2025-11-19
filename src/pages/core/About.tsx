import React from "react";
import MainButton from '@/SimpleComponent/MainButton/MainButton';

export default function About() {
  return (
    <>
      <div className="about-section">
        <div className="container">
          {/* Hero Section */}
          <div className="about-hero">
            <div className="row justify-content-center text-center">
              <div className="col-lg-10">
                <h1 className="about-title">
                  Welcome to <span className="text-main">OurBride</span>
                </h1>
                <p className="about-subtitle">
                  Your comprehensive wedding planning platform that brings together everything you need to create the perfect celebration of your love story.
                </p>
                <div className="hero-highlights">
                  <div className="highlight-item">
                    <i className="fas fa-heart"></i>
                    <span>Personalized Planning</span>
                  </div>
                  <div className="highlight-item">
                    <i className="fas fa-users"></i>
                    <span>Expert Guidance</span>
                  </div>
                  <div className="highlight-item">
                    <i className="fas fa-star"></i>
                    <span>Memorable Moments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Content Section */}
          <div className="about-content-section">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="row">
                  <div className="col-lg-6">
                    <h2 className="content-title">Our Mission</h2>
                    <p className="content-description">
                      At OurBride, we believe that every love story deserves a perfect celebration.
                      We've dedicated ourselves to creating a comprehensive platform that transforms
                      the often overwhelming wedding planning process into an enjoyable, organized,
                      and stress-free experience.
                    </p>
                    <p className="content-description">
                      Our mission is to empower couples with the tools, resources, and support
                      they need to create their dream wedding while staying within budget and
                      maintaining their sanity throughout the planning journey.
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <h2 className="content-title">What We Offer</h2>
                    <div className="offerings-list">
                      <div className="offering-item">
                        <i className="fas fa-check-circle"></i>
                        <div>
                          <h4>Complete Wedding Planning Tools</h4>
                          <p>From guest lists to vendor management, we've got you covered</p>
                        </div>
                      </div>
                      <div className="offering-item">
                        <i className="fas fa-check-circle"></i>
                        <div>
                          <h4>Digital Invitations & RSVP</h4>
                          <p>Beautiful, customizable invitations with easy RSVP tracking</p>
                        </div>
                      </div>
                      <div className="offering-item">
                        <i className="fas fa-check-circle"></i>
                        <div>
                          <h4>Wedding Registry & Shopping</h4>
                          <p>Curated selection of wedding essentials and gifts</p>
                        </div>
                      </div>
                      <div className="offering-item">
                        <i className="fas fa-check-circle"></i>
                        <div>
                          <h4>Expert Vendor Network</h4>
                          <p>Access to verified, trusted wedding professionals</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <h2 className="section-title text-center">Why Choose OurBride?</h2>
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-magic"></i>
                    </div>
                    <h3>Personalized Experience</h3>
                    <p>Every couple is unique, and so should be their wedding planning experience. We tailor our tools and recommendations to match your style, budget, and vision.</p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-handshake"></i>
                    </div>
                    <h3>Trusted Partnerships</h3>
                    <p>We work exclusively with verified vendors and trusted partners who share our commitment to excellence and customer satisfaction.</p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-mobile-alt"></i>
                    </div>
                    <h3>Mobile-First Design</h3>
                    <p>Access your wedding planning tools anywhere, anytime. Our mobile-optimized platform ensures you're always connected to your special day.</p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-headset"></i>
                    </div>
                    <h3>24/7 Support</h3>
                    <p>Our dedicated support team is always here to help you navigate any challenges and answer your questions throughout your planning journey.</p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <h3>Budget Management</h3>
                    <p>Stay on track with our comprehensive budget tracking tools and get alerts when you're approaching your spending limits.</p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <h3>Timeline Management</h3>
                    <p>Never miss an important deadline with our automated timeline management and reminder system that keeps you organized.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* App Importance Section */}
          <div className="app-importance-section">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="text-center">
                  <h2 className="section-title">Why OurBride App is Essential</h2>
                  <p className="section-description">
                    In today's digital age, having a comprehensive wedding planning app is not just a luxury—it's a necessity.
                    OurBride brings together all the tools you need in one place, making your wedding planning journey seamless and enjoyable.
                  </p>
                </div>
                <div className="row">
                  <div className="col-lg-4">
                    <div className="importance-feature">
                      <div className="feature-icon-large">
                        <i className="fas fa-clock"></i>
                      </div>
                      <h4>Save Time & Reduce Stress</h4>
                      <p>Automated checklists, reminders, and timeline management keep you organized and on track. Focus on enjoying your engagement instead of worrying about details.</p>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="importance-feature">
                      <div className="feature-icon-large">
                        <i className="fas fa-dollar-sign"></i>
                      </div>
                      <h4>Stay Within Budget</h4>
                      <p>Track expenses in real-time, compare vendor prices, and get alerts when you're approaching your spending limits. Make informed financial decisions.</p>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="importance-feature">
                      <div className="feature-icon-large">
                        <i className="fas fa-clipboard-check"></i>
                      </div>
                      <h4>Never Miss a Detail</h4>
                      <p>Comprehensive planning tools ensure nothing is overlooked. From venue bookings to final vendor confirmations, we've got every detail covered.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="about-stats-section">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <h2 className="section-title text-center">Our Impact</h2>
                <p className="text-center section-description">
                  Join thousands of couples who have trusted OurBride to make their wedding dreams come true
                </p>
                <div className="row text-center">
                  <div className="col-md-3 col-6">
                    <div className="stat-card">
                      <div className="stat-number">5+</div>
                      <div className="stat-label">Years of Excellence</div>
                      <p>Dedicated to perfecting the wedding planning experience</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="stat-card">
                      <div className="stat-number">1000+</div>
                      <div className="stat-label">Weddings Planned</div>
                      <p>Successfully helped couples create their perfect day</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="stat-card">
                      <div className="stat-number">98%</div>
                      <div className="stat-label">Satisfaction Rate</div>
                      <p>Couples love their OurBride experience</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="stat-card">
                      <div className="stat-number">24/7</div>
                      <div className="stat-label">Support Available</div>
                      <p>Always here when you need us most</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="about-cta-section">
            <div className="row justify-content-center text-center">
              <div className="col-lg-10">
                <h2 className="cta-title">Ready to Start Your Wedding Journey?</h2>
                <p className="cta-description">
                  Join thousands of happy couples who have trusted OurBride to make their wedding dreams come true.
                  Start planning your perfect day today with our comprehensive wedding planning platform.
                </p>
                <div className="cta-benefits">
                  <div className="cta-benefit">
                    <i className="fas fa-rocket"></i>
                    <span>Get Started in Minutes</span>
                  </div>
                  <div className="cta-benefit">
                    <i className="fas fa-gift"></i>
                    <span>Free to Use</span>
                  </div>
                  <div className="cta-benefit">
                    <i className="fas fa-shield-alt"></i>
                    <span>Secure & Private</span>
                  </div>
                </div>
                <div className="cta-buttons">
                  <MainButton
                    title="Start Planning Now"
                    classes="btn-main cta-btn"
                  />
                  <a href="https://www.our-bride.store" className="btn btn-outline-main cta-btn">
                    Explore Our Store
                  </a>
                </div>
                <p className="cta-note">
                  <i className="fas fa-info-circle"></i>
                  No credit card required • Free forever • 24/7 support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
