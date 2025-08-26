import React from "react";
import MainButton from "../../SimpleComponent/MainButton/MainButton.jsx";
import LoadingScreen from "../LoadingScreen/LoadingScreen.jsx";
import { SvgIcons } from "../SVG/SvgIcons.jsx";
import homeimage from "../../Assets/appHome.jpg";
import screen1 from "../../Assets/screen1.jpg";
import screen2 from "../../Assets/screen2.jpg";
import screen3 from "../../Assets/screen4.jpg";
import screensplach from "../../Assets/splachscreen.jpg";
import servces from "../../Assets/servces-pana.png";
import cart from "../../Assets/cart-pana.png";

export default function Home() {
  return (
    <>
      <div className="home">
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
            <div className="row align-items-center min-vh-100">
              <div className="col-lg-6">
                <div className="hero-content">
                  <div className="hero-badge">
                    <div className="badge-icon">
                      <i className="fas fa-crown"></i>
                    </div>
                    <span>Premium Wedding Planning</span>
                  </div>
                  <h1 className="hero-title">
                    Create Your <span className="text-gradient">Dream Wedding</span> with OurBride
                  </h1>
                  <p className="hero-description">
                    The most advanced wedding planning platform that transforms your vision into reality.
                    From the first "yes" to the final dance, we're your perfect partner.
                  </p>
                  <div className="hero-stats">
                    <div className="stat-item">
                      <div className="stat-number">15K+</div>
                      <div className="stat-label">Happy Couples</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">1000+</div>
                      <div className="stat-label">Premium Vendors</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">4.9★</div>
                      <div className="stat-label">App Rating</div>
                    </div>
                  </div>
                  <div className="hero-actions">
                    <div className="hero-form">
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control hero-input"
                          placeholder="Enter your email address"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="tel"
                          className="form-control hero-input"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    <div className="hero-buttons">
                      <MainButton
                        title="Start Planning Now"
                        link="register"
                        classes="btn-main hero-btn"
                      />
                      <a href="#" className="btn btn-outline-main hero-btn-secondary">
                        <i className="fas fa-play me-2"></i>
                        Watch Demo
                      </a>
                    </div>
                  </div>
                  <div className="hero-trust">
                    <div className="trust-badges">
                      <div className="trust-badge">
                        <i className="fas fa-shield-alt"></i>
                        <span>100% Secure</span>
                      </div>
                      <div className="trust-badge">
                        <i className="fas fa-clock"></i>
                        <span>24/7 Support</span>
                      </div>
                      <div className="trust-badge">
                        <i className="fas fa-award"></i>
                        <span>Award Winning</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="hero-visual">
                  <div className="hero-phone-container">
                    <div className="phone-mockup">
                      <div className="phone-frame">
                        <img src={homeimage} alt="OurBride App" className="app-screenshot" />
                      </div>
                      <div className="floating-card card-1">
                        <div className="card-icon">
                          <i className="fas fa-calendar-check"></i>
                        </div>
                        <div className="card-content">
                          <span className="card-title">Wedding Timeline</span>
                          <span className="card-subtitle">Perfect Planning</span>
                        </div>
                      </div>
                      <div className="floating-card card-2">
                        <div className="card-icon">
                          <i className="fas fa-tasks"></i>
                        </div>
                        <div className="card-content">
                          <span className="card-title">Task Manager</span>
                          <span className="card-subtitle">Stay Organized</span>
                        </div>
                      </div>
                      <div className="floating-card card-3">
                        <div className="card-icon">
                          <i className="fas fa-store"></i>
                        </div>
                        <div className="card-content">
                          <span className="card-title">Vendor Directory</span>
                          <span className="card-subtitle">Best Services</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="section-header">
                  <div className="section-badge">
                    <i className="fas fa-star"></i>
                    <span>Why Choose OurBride?</span>
                  </div>
                  <h2 className="section-title">Everything You Need for Your Perfect Wedding</h2>
                  <p className="section-description">
                    Our comprehensive platform combines cutting-edge technology with personalized service
                    to make your wedding planning journey seamless and enjoyable.
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <h3>Intuitive Design</h3>
                  <p>Beautiful, easy-to-use interface designed for everyone. Plan your wedding with confidence and style.</p>
                  <div className="feature-badge">Most Popular</div>
                  <div className="feature-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="feature-card featured">
                  <div className="feature-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3>Enterprise Security</h3>
                  <p>Bank-level security protects your data. Your privacy and information are our top priority.</p>
                  <div className="feature-badge">Trusted</div>
                  <div className="feature-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-sync-alt"></i>
                  </div>
                  <h3>Real-time Sync</h3>
                  <p>Access your plans from any device. Everything stays synchronized automatically across all platforms.</p>
                  <div className="feature-badge">Smart Sync</div>
                  <div className="feature-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="section-header">
                  <div className="section-badge">
                    <i className="fas fa-rocket"></i>
                    <span>How It Works</span>
                  </div>
                  <h2 className="section-title">Your Journey to the Perfect Wedding</h2>
                  <p className="section-description">
                    Get your dream wedding in just 3 simple steps. Our proven process has helped thousands of couples.
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <div className="step-card">
                  <div className="step-number">01</div>
                  <div className="step-icon">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <h3>Create Your Profile</h3>
                  <p>Sign up and create your personalized wedding profile in minutes. Tell us about your dream wedding.</p>
                  <div className="step-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="step-card featured">
                  <div className="step-number">02</div>
                  <div className="step-icon">
                    <i className="fas fa-tasks"></i>
                  </div>
                  <h3>Plan & Organize</h3>
                  <p>Use our comprehensive tools to plan every detail of your special day. From budget to timeline.</p>
                  <div className="step-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="step-card">
                  <div className="step-number">03</div>
                  <div className="step-icon">
                    <i className="fas fa-heart"></i>
                  </div>
                  <h3>Celebrate Love</h3>
                  <p>Enjoy your perfect wedding day with everything organized and ready. Create memories that last forever.</p>
                  <div className="step-arrow">
                    <i className="fas fa-check"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App Showcase Section */}
        <section className="app-showcase-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="app-content">
                  <div className="section-header text-start">
                    <div className="section-badge">
                      <i className="fas fa-mobile-alt"></i>
                      <span>Mobile App</span>
                    </div>
                    <h2 className="section-title">Your Wedding, Our Commitment</h2>
                    <p className="section-description">
                      Download OurBride app and start planning your perfect wedding today.
                      Available on Google Play Store with iOS version coming soon.
                    </p>
                  </div>
                  <div className="app-features">
                    <div className="app-feature">
                      <i className="fas fa-check-circle"></i>
                      <span>Comprehensive wedding planning tools</span>
                    </div>
                    <div className="app-feature">
                      <i className="fas fa-check-circle"></i>
                      <span>Vendor directory and booking system</span>
                    </div>
                    <div className="app-feature">
                      <i className="fas fa-check-circle"></i>
                      <span>Budget tracking and management</span>
                    </div>
                    <div className="app-feature">
                      <i className="fas fa-check-circle"></i>
                      <span>Guest list and RSVP management</span>
                    </div>
                  </div>
                  <div className="download-buttons">
                    <a href="#" className="btn btn-main download-btn">
                      <i className="fab fa-google-play me-2"></i>
                      Get it on Google Play
                    </a>
                    <a href="#" className="btn btn-outline-main download-btn disabled">
                      <i className="fab fa-apple me-2"></i>
                      Coming Soon on App Store
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="app-visual">
                  <div className="mobile-screens">
                    <img src={screen1} alt="App Feature 1" className="screen screen-1" />
                    <img src={screen2} alt="App Feature 2" className="screen screen-2" />
                    <img src={screen3} alt="App Feature 3" className="screen screen-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="section-header">
                  <div className="section-badge">
                    <i className="fas fa-cogs"></i>
                    <span>Our Services</span>
                  </div>
                  <h2 className="section-title">Complete Wedding Solutions</h2>
                  <p className="section-description">
                    Everything you need for your wedding planning journey in one comprehensive platform.
                  </p>
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="services-grid">
                  <div className="service-card">
                    <div className="service-icon">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <h3>Wedding Shop</h3>
                    <p>
                      Browse and purchase everything you need for your wedding from our curated collection
                      of high-quality products and accessories.
                    </p>
                  </div>
                  <div className="service-card featured">
                    <div className="service-icon">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <h3>Vendor Services</h3>
                    <p>
                      Connect with trusted vendors and book services for your wedding. From venues to
                      photographers, we've got you covered.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="services-visual">
                  <img src={servces} alt="OurBride Services" className="services-image" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="section-header">
                  <div className="section-badge">
                    <i className="fas fa-heart"></i>
                    <span>Testimonials</span>
                  </div>
                  <h2 className="section-title">What Couples Say About Us</h2>
                  <p className="section-description">
                    Real stories from happy couples who used OurBride to create their perfect wedding.
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <div className="testimonial-card">
                  <div className="testimonial-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="testimonial-content">
                    <p>"OurBride made our wedding planning so much easier. Everything was organized and we never missed a detail!"</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="author-info">
                      <h4>Sarah & Ahmed</h4>
                      <span>Married 2024</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="testimonial-card featured">
                  <div className="testimonial-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="testimonial-content">
                    <p>"The app helped us find amazing vendors and stay on budget. Highly recommended for all couples!"</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="author-info">
                      <h4>Fatima & Omar</h4>
                      <span>Married 2024</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="testimonial-card">
                  <div className="testimonial-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="testimonial-content">
                    <p>"From planning to execution, OurBride was our perfect wedding companion. Thank you!"</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="author-info">
                      <h4>Layla & Khalid</h4>
                      <span>Married 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Store Section */}
        <section className="store-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="store-content">
                  <div className="section-header text-start">
                    <div className="section-badge">
                      <i className="fas fa-store"></i>
                      <span>Our Store</span>
                    </div>
                    <h2 className="section-title">Explore Our Wedding Store</h2>
                    <p className="section-description">
                      Discover a world of premium wedding products and services curated just for you.
                    </p>
                  </div>
                  <div className="store-features">
                    <div className="store-feature">
                      <i className="fas fa-check-circle"></i>
                      <span>Wide range of wedding products</span>
                    </div>
                    <div className="store-feature">
                      <i className="fas fa-check-circle"></i>
                      <span>Easy navigation and filtering</span>
                    </div>
                    <div className="store-feature">
                      <i className="fas fa-check-circle"></i>
                      <span>Secure payments and fast delivery</span>
                    </div>
                    <div className="store-feature">
                      <i className="fas fa-check-circle"></i>
                      <span>Trusted vendors and quality products</span>
                    </div>
                  </div>
                  <a
                    href="https://www.our-bride.store"
                    className="btn btn-main store-btn"
                  >
                    <i className="fas fa-store me-2"></i>
                    Explore OurBride Store
                  </a>
                </div>
              </div>
              <div className="col-md-6">
                <div className="store-visual">
                  <img src={cart} alt="OurBride Store" className="store-image" />
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
                  <h2 className="cta-title">Ready to Create Your Perfect Wedding?</h2>
                  <p className="cta-description">
                    Join thousands of happy couples who have used OurBride to create their dream wedding.
                    Start your journey today!
                  </p>
                  <div className="cta-buttons">
                    <MainButton
                      title="Download App Now"
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
        </section>
      </div>
    </>
  );
}
