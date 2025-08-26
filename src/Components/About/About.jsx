import React from "react";
import img0 from "../../Assets/Weddingplanner0.png";
import img1 from "../../Assets/Weddingplanner1.png";
import img2 from "../../Assets/Weddingplanner2.png";
import img3 from "../../Assets/Weddingplanner3.png";
import img4 from "../../Assets/Weddingplanner4.png";
import MainButton from "../../SimpleComponent/MainButton/MainButton.jsx";

export default function About() {
  return (
    <>
      <div className="about-section">
        <div className="container">
          {/* Hero Section */}
          <div className="about-hero">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="about-title">
                  Welcome to <span className="text-main">OurBride</span>
                </h1>
                <p className="about-subtitle">
                  Our working experience to take care of your marriage and your wedding.
                </p>
              </div>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="about-carousel-section">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div
                  id="carouselExampleIndicators"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-indicators">
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to="0"
                      className="active"
                      aria-current="true"
                      aria-label="Slide 1"
                    ></button>
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to="1"
                      aria-label="Slide 2"
                    ></button>
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to="2"
                      aria-label="Slide 3"
                    ></button>
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to="3"
                      aria-label="Slide 4"
                    ></button>
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to="4"
                      aria-label="Slide 5"
                    ></button>
                  </div>
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img src={img0} className="d-block w-100 carousel-image" alt="Wedding Planner 1" />
                    </div>
                    <div className="carousel-item">
                      <img src={img1} className="d-block w-100 carousel-image" alt="Wedding Planner 2" />
                    </div>
                    <div className="carousel-item">
                      <img src={img2} className="d-block w-100 carousel-image" alt="Wedding Planner 3" />
                    </div>
                    <div className="carousel-item">
                      <img src={img3} className="d-block w-100 carousel-image" alt="Wedding Planner 4" />
                    </div>
                    <div className="carousel-item">
                      <img src={img4} className="d-block w-100 carousel-image" alt="Wedding Planner 5" />
                    </div>
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev"
                  >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next"
                  >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="about-content-section">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="content-title">Our Mission</h2>
                <p className="content-description">
                  At OurBride, we understand that your wedding day is one of the most important
                  moments in your life. That's why we've created a comprehensive platform that
                  brings together everything you need to plan and celebrate your special day.
                </p>

                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-heart"></i>
                    </div>
                    <h3>Personalized Experience</h3>
                    <p>Every couple is unique, and so should be their wedding planning experience.</p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <h3>Community Support</h3>
                    <p>Join a community of couples, vendors, and wedding professionals.</p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <h3>Trusted Partners</h3>
                    <p>We work with verified vendors and trusted partners to ensure quality.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* App Importance Section */}
          <div className="app-importance-section">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="importance-content">
                  <h2 className="section-title">Why OurBride App is Essential</h2>
                  <p className="section-description">
                    In today's digital age, having a comprehensive wedding planning app is not just a luxury—it's a necessity. OurBride brings together all the tools you need in one place.
                  </p>
                  <div className="importance-features">
                    <div className="importance-feature">
                      <div className="feature-check">
                        <i className="fas fa-check"></i>
                      </div>
                      <div>
                        <h4>Save Time & Reduce Stress</h4>
                        <p>Automated checklists and reminders keep you organized</p>
                      </div>
                    </div>
                    <div className="importance-feature">
                      <div className="feature-check">
                        <i className="fas fa-check"></i>
                      </div>
                      <div>
                        <h4>Stay Within Budget</h4>
                        <p>Track expenses and find the best deals from trusted vendors</p>
                      </div>
                    </div>
                    <div className="importance-feature">
                      <div className="feature-check">
                        <i className="fas fa-check"></i>
                      </div>
                      <div>
                        <h4>Never Miss a Detail</h4>
                        <p>Comprehensive planning tools ensure nothing is overlooked</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="importance-visual">
                  <div className="app-showcase">
                    <div className="phone-mockup">
                      <div className="phone-screen">
                        <div className="app-preview">
                          <div className="app-header">
                            <h3>OurBride</h3>
                            <p>Wedding Planner</p>
                          </div>
                          <div className="app-features">
                            <div className="app-feature-item">
                              <i className="fas fa-calendar"></i>
                              <span>Wedding Timeline</span>
                            </div>
                            <div className="app-feature-item">
                              <i className="fas fa-list"></i>
                              <span>Task Manager</span>
                            </div>
                            <div className="app-feature-item">
                              <i className="fas fa-store"></i>
                              <span>Vendor Directory</span>
                            </div>
                            <div className="app-feature-item">
                              <i className="fas fa-shopping-cart"></i>
                              <span>Wedding Shop</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="about-stats-section">
            <div className="row text-center">
              <div className="col-md-3 col-6">
                <div className="stat-card">
                  <div className="stat-number">5+</div>
                  <div className="stat-label">Years Experience</div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="stat-card">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">Weddings Planned</div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="stat-card">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Satisfaction Rate</div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="stat-card">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Support Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="about-cta-section">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h2 className="cta-title">Ready to Start Your Wedding Journey?</h2>
                <p className="cta-description">
                  Join thousands of happy couples who have trusted OurBride to make their wedding dreams come true.
                </p>
                <div className="cta-buttons">
                  <MainButton
                    title="Download OurBride App"
                    classes="btn-main cta-btn"
                  />
                  <a href="https://www.our-bride.store" className="btn btn-outline-main cta-btn">
                    Explore Our Store
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
