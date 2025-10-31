import React, { useState } from "react";
import MainButton from "../../SimpleComponent/MainButton/MainButton";
import { useSpringCarousel } from "react-spring-carousel";
import { providerService } from "../../services/apiService";
import { createServiceClassData, serviceClassListToJson } from "../../utils/serviceClasses";

export default function Providers() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    contactNumber: "",
    emailAddress: "",
    address: "",
    serviceClasses: [],
    priceRange: "",
    capacityOrScale: "",
    websiteOrSocialMedia: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceCategories = createServiceClassData();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      serviceClasses: prev.serviceClasses.includes(category)
        ? prev.serviceClasses.filter(c => c !== category)
        : [...prev.serviceClasses, category]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^(?:\+20|0)?1[0125][0-9]{8}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid Egyptian phone number";
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address";
    }

    if (formData.serviceClasses.length === 0) {
      newErrors.serviceClasses = "Please select at least one service category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // API call to save provider registration using the service
      const data = await providerService.register({
        fullName: formData.fullName,
        businessName: formData.businessName || null,
        contactNumber: formData.contactNumber,
        emailAddress: formData.emailAddress,
        address: formData.address || null,
        serviceClasses: serviceClassListToJson(formData.serviceClasses),
        priceRange: formData.priceRange ? parseFloat(formData.priceRange) : null,
        capacityOrScale: formData.capacityOrScale || null,
        websiteOrSocialMedia: formData.websiteOrSocialMedia || null,
      });

      alert('Provider registration submitted successfully!');
      setShowRegistrationModal(false);
      resetForm();
    } catch (error) {
      // Registration error handled silently
      alert(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      businessName: "",
      contactNumber: "",
      emailAddress: "",
      address: "",
      serviceClasses: [],
      priceRange: "",
      capacityOrScale: "",
      websiteOrSocialMedia: ""
    });
    setErrors({});
  };

  const { carouselFragment, slideToPrevItem, slideToNextItem } =
    useSpringCarousel({
      items: [
        {
          id: "item-1",
          renderItem: (
            <div className="provider-card">
              <div className="provider-image">
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Wedding Photography"
                />
              </div>
              <div className="provider-content">
                <h3>Wedding Photography</h3>
                <p>Professional photography services to capture your special moments with artistic excellence and attention to detail</p>
                <div className="provider-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <span>5.0 (120 reviews)</span>
                </div>
                <button className="btn btn-main">View Details</button>
              </div>
            </div>
          ),
        },
        {
          id: "item-2",
          renderItem: (
            <div className="provider-card">
              <div className="provider-image">
                <img
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Wedding Venues"
                />
              </div>
              <div className="provider-content">
                <h3>Wedding Venues</h3>
                <p>Elegant and stunning venues that provide the perfect backdrop for your unforgettable wedding celebration</p>
                <div className="provider-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <span>4.9 (85 reviews)</span>
                </div>
                <button className="btn btn-main">View Details</button>
              </div>
            </div>
          ),
        },
        {
          id: "item-3",
          renderItem: (
            <div className="provider-card">
              <div className="provider-image">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Catering Services"
                />
              </div>
              <div className="provider-content">
                <h3>Catering Services</h3>
                <p>Exquisite culinary experiences with gourmet menus crafted to delight your guests and create lasting memories</p>
                <div className="provider-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <span>4.8 (95 reviews)</span>
                </div>
                <button className="btn btn-main">View Details</button>
              </div>
            </div>
          ),
        },
        {
          id: "item-4",
          renderItem: (
            <div className="provider-card">
              <div className="provider-image">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Wedding Planning"
                />
              </div>
              <div className="provider-content">
                <h3>Wedding Planning</h3>
                <p>Comprehensive wedding planning services that ensure every detail is perfect for your dream wedding day</p>
                <div className="provider-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <span>5.0 (150 reviews)</span>
                </div>
                <button className="btn btn-main">View Details</button>
              </div>
            </div>
          ),
        },
        {
          id: "item-5",
          renderItem: (
            <div className="provider-card">
              <div className="provider-image">
                <img
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Wedding Decor"
                />
              </div>
              <div className="provider-content">
                <h3>Wedding Decor</h3>
                <p>Stunning floral arrangements and elegant decorations that transform your venue into a magical setting</p>
                <div className="provider-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <span>4.9 (110 reviews)</span>
                </div>
                <button className="btn btn-main">View Details</button>
              </div>
            </div>
          ),
        },
        {
          id: "item-6",
          renderItem: (
            <div className="provider-card">
              <div className="provider-image">
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Wedding Entertainment"
                />
              </div>
              <div className="provider-content">
                <h3>Wedding Entertainment</h3>
                <p>Live music, DJs, and entertainment that keeps your celebration lively and creates unforgettable moments</p>
                <div className="provider-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <span>4.7 (75 reviews)</span>
                </div>
                <button className="btn btn-main">View Details</button>
              </div>
            </div>
          ),
        },
      ],
    });

  return (
    <>
      <div className="providers-section">
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
                      <i className="fas fa-handshake"></i>
                    </div>
                    <span>Trusted Partners</span>
                  </div>
                  <h1 className="hero-title">
                    Our <span className="text-gradient">Wedding Providers</span>
                  </h1>
                  <p className="hero-description">
                    Connect with verified and trusted wedding service providers.
                    From photographers to venues, find the perfect partners for your special day.
                  </p>
                  <div className="hero-stats">
                    <div className="stat-item">
                      <div className="stat-number">500+</div>
                      <div className="stat-label">Verified Providers</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">4.8★</div>
                      <div className="stat-label">Average Rating</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">10K+</div>
                      <div className="stat-label">Happy Couples</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Providers Carousel Section */}
        <section className="providers-carousel-section">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="section-header">
                  <div className="section-badge">
                    <i className="fas fa-star"></i>
                    <span>Featured Providers</span>
                  </div>
                  <h2 className="section-title">Top Wedding Service Providers</h2>
                  <p className="section-description">
                    Discover our handpicked selection of premium wedding service providers.
                    Each one is verified and highly rated by our community.
                  </p>
                </div>
              </div>
            </div>

            <div className="providers-carousel-container">
              <div className="carousel-controls">
                <button
                  onClick={slideToPrevItem}
                  className="carousel-control-btn prev-btn"
                  aria-label="Previous provider"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  onClick={slideToNextItem}
                  className="carousel-control-btn next-btn"
                  aria-label="Next provider"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              <div className="providers-carousel">
                {carouselFragment}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="provider-categories-section">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h2 className="section-title">Browse by Category</h2>
                <p className="section-description">
                  Find the perfect wedding services organized by category
                </p>
              </div>
            </div>

            <div className="categories-grid">
              <div className="category-card">
                <div className="category-icon">
                  <i className="fas fa-camera"></i>
                </div>
                <h3>Photography</h3>
                <p>Professional photographers to capture your special moments</p>
                <span className="provider-count">150+ Providers</span>
              </div>

              <div className="category-card">
                <div className="category-icon">
                  <i className="fas fa-building"></i>
                </div>
                <h3>Venues</h3>
                <p>Beautiful venues for your perfect wedding celebration</p>
                <span className="provider-count">200+ Venues</span>
              </div>

              <div className="category-card">
                <div className="category-icon">
                  <i className="fas fa-utensils"></i>
                </div>
                <h3>Catering</h3>
                <p>Delicious catering options for your wedding reception</p>
                <span className="provider-count">120+ Caterers</span>
              </div>

              <div className="category-card">
                <div className="category-icon">
                  <i className="fas fa-music"></i>
                </div>
                <h3>Entertainment</h3>
                <p>Live music and entertainment for your special day</p>
                <span className="provider-count">80+ Artists</span>
              </div>

              <div className="category-card">
                <div className="category-icon">
                  <i className="fas fa-car"></i>
                </div>
                <h3>Transportation</h3>
                <p>Luxury transportation services for your wedding</p>
                <span className="provider-count">60+ Services</span>
              </div>

              <div className="category-card">
                <div className="category-icon">
                  <i className="fas fa-gem"></i>
                </div>
                <h3>Jewelry</h3>
                <p>Beautiful jewelry and accessories for your wedding</p>
                <span className="provider-count">90+ Stores</span>
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
                  <h2 className="cta-title">Ready to Find Your Perfect Wedding Providers?</h2>
                  <p className="cta-description">
                    Join thousands of couples who have found their dream wedding services through OurBride.
                  </p>
                  <div className="cta-buttons">
                    <MainButton
                      title="Browse All Providers"
                      classes="btn-main cta-btn"
                    />
                    <button
                      onClick={() => setShowRegistrationModal(true)}
                      className="btn btn-outline-main cta-btn"
                    >
                      <i className="fas fa-plus me-2"></i>
                      Become a Provider
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Provider Registration Modal */}
      {showRegistrationModal && (
        <div className="modal-overlay" onClick={() => setShowRegistrationModal(false)}>
          <div className="provider-registration-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <i className="fas fa-user-plus me-2"></i>
                Provider Registration
              </h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowRegistrationModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="provider-registration-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    <i className="fas fa-user me-2"></i>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={`form-control modern-input ${errors.fullName ? 'error' : ''}`}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                  {errors.fullName && <div className="error-message">{errors.fullName}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="businessName" className="form-label">
                    <i className="fas fa-building me-2"></i>
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    className="form-control modern-input"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Enter your business name (optional)"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contactNumber" className="form-label">
                    <i className="fas fa-phone me-2"></i>
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    className={`form-control modern-input ${errors.contactNumber ? 'error' : ''}`}
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    required
                  />
                  {errors.contactNumber && <div className="error-message">{errors.contactNumber}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="emailAddress" className="form-label">
                    <i className="fas fa-envelope me-2"></i>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    className={`form-control modern-input ${errors.emailAddress ? 'error' : ''}`}
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                  {errors.emailAddress && <div className="error-message">{errors.emailAddress}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-control modern-input"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address (optional)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-tags me-2"></i>
                  Service Categories *
                </label>
                <div className="service-categories-grid">
                  {serviceCategories.map((category) => (
                    <div
                      key={category.value}
                      className={`service-category-item ${formData.serviceClasses.includes(category.value) ? 'selected' : ''}`}
                      onClick={() => handleCategoryChange(category.value)}
                    >
                      <i className={category.icon}></i>
                      <span>{category.label}</span>
                    </div>
                  ))}
                </div>
                {errors.serviceClasses && <div className="error-message">{errors.serviceClasses}</div>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="priceRange" className="form-label">
                    <i className="fas fa-dollar-sign me-2"></i>
                    Price Range
                  </label>
                  <input
                    type="number"
                    id="priceRange"
                    name="priceRange"
                    className="form-control modern-input"
                    value={formData.priceRange}
                    onChange={handleInputChange}
                    placeholder="Enter price range (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="capacityOrScale" className="form-label">
                    <i className="fas fa-users me-2"></i>
                    Capacity/Scale
                  </label>
                  <input
                    type="text"
                    id="capacityOrScale"
                    name="capacityOrScale"
                    className="form-control modern-input"
                    value={formData.capacityOrScale}
                    onChange={handleInputChange}
                    placeholder="Enter capacity or scale (optional)"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="websiteOrSocialMedia" className="form-label">
                  <i className="fas fa-globe me-2"></i>
                  Website/Social Media Links
                </label>
                <input
                  type="url"
                  id="websiteOrSocialMedia"
                  name="websiteOrSocialMedia"
                  className="form-control modern-input"
                  value={formData.websiteOrSocialMedia}
                  onChange={handleInputChange}
                  placeholder="Enter website or social media links (optional)"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline-main"
                  onClick={() => setShowRegistrationModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-main"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      Submit Registration
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
