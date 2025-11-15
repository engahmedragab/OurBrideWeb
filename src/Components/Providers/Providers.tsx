import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainButton from "../../SimpleComponent/MainButton/MainButton";
import { providerService, preparationService, statisticsService, featuredProvidersService } from "../../services/apiService";
import { createServiceClassData, serviceClassListToJson } from "../../utils/serviceClasses";
import LoadingScreen from '../LoadingScreen/LoadingScreen';


export default function Providers() {
  const navigate = useNavigate();
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [preparations, setPreparations] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    totalProviders: 0,
    verifiedProviders: 0,
    averageRating: 0,
    totalHappyCouples: 0,
  });
  const [preparationStats, setPreparationStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const carouselScrollRef = useRef(null);

  const serviceCategories = createServiceClassData();

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [statsData, featuredProvidersData, preparationsData] = await Promise.all([
          statisticsService.getOverview().catch(() => ({ data: null })),
          featuredProvidersService.getFeatured(6).catch(() => ({ data: [] })),
          preparationService.getFeatured().catch(() => ({ data: [] })),
        ]);

        // Set platform statistics
        if (statsData.data) {
          setPlatformStats({
            totalProviders: statsData.data.verifiedProviders || statsData.data.totalProviders || 0,
            verifiedProviders: statsData.data.verifiedProviders || 0,
            averageRating: statsData.data.averageRating || 0,
            totalHappyCouples: statsData.data.totalHappyCouples || statsData.data.totalUsers || 0,
          });
        }

        // Set featured providers for carousel
        const providers = featuredProvidersData.data || featuredProvidersData || [];
        setFeaturedProviders(providers.slice(0, 6));

        // Set preparations for categories
        const preps = preparationsData.data || preparationsData || [];
        const activePreps = preps.filter(prep => prep.isActive && !prep.isDeleted);
        setPreparations(activePreps);

        // Fetch statistics for each preparation
        if (activePreps.length > 0) {
          const statsPromises = activePreps.slice(0, 6).map(prep =>
            preparationService.getStatistics(prep.id)
              .then(response => ({ id: prep.id, stats: response.data || response }))
              .catch(() => ({ id: prep.id, stats: null }))
          );
          const statsResults = await Promise.all(statsPromises);
          const statsMap = {};
          statsResults.forEach(({ id, stats }) => {
            if (stats) {
              statsMap[id] = stats;
            }
          });
          setPreparationStats(statsMap);
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
        console.error("Error fetching providers data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProviderClick = (providerId, slug) => {
    if (slug) {
      navigate(`/marketplace/providers/slug/${slug}`);
    } else {
      navigate(`/marketplace/providers/${providerId}`);
    }
  };

  const handlePreparationClick = (preparationId) => {
    navigate(`/preparations/${preparationId}`);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="provider-rating">
        {[...Array(fullStars)].map((_, i) => (
          <i key={i} className="fas fa-star"></i>
        ))}
        {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="far fa-star"></i>
        ))}
      </div>
    );
  };

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

  // Create carousel items from featured providers
  const carouselItems = React.useMemo(() => {
    if (!featuredProviders || featuredProviders.length === 0) {
      return [];
    }

    return featuredProviders.map((provider, index) => ({
      id: `provider-${provider.id || index}`,
      card: (
        <div className="provider-card">
          <div className="provider-image">
            <img
              src={provider.publicBannerImageUrl || provider.publicLogoImageUrl || "https://via.placeholder.com/400x300?text=Provider"}
              alt={provider.nameEn || provider.nameAr || "Provider"}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x300?text=Provider";
              }}
            />
            {provider.isVerified && (
              <div className="verified-badge">
                <i className="fas fa-check-circle"></i>
              </div>
            )}
          </div>
          <div className="provider-content">
            <h3>{provider.nameEn || provider.nameAr || "Provider"}</h3>
            <p>
              {provider.descriptionEn || provider.descriptionAr ||
                "Professional wedding service provider"}
            </p>
            {provider.rate && (
              <div className="provider-rating">
                {renderStars(provider.rate)}
                <span>{provider.rate.toFixed(1)} {provider.totalReviews ? `(${provider.totalReviews} reviews)` : ""}</span>
              </div>
            )}
            <div className="provider-meta">
              {provider.totalServices > 0 && (
                <span><i className="fas fa-concierge-bell"></i> {provider.totalServices} Services</span>
              )}
              {provider.totalProducts > 0 && (
                <span><i className="fas fa-box"></i> {provider.totalProducts} Products</span>
              )}
            </div>
            <button
              className="btn btn-main"
              onClick={() => handleProviderClick(provider.id, provider.publicProfileSlug)}
            >
              View Profile
            </button>
          </div>
        </div>
      ),
    }));
  }, [featuredProviders]);

  const scrollCarousel = useCallback((direction) => {
    const container = carouselScrollRef.current;

    if (!container) {
      return;
    }

    const firstCard = container.querySelector(".provider-card");
    const containerRect = container.getBoundingClientRect();
    const fallbackWidth = containerRect.width || 320;
    const cardRect = firstCard ? firstCard.getBoundingClientRect() : null;
    const cardWidth = cardRect?.width || fallbackWidth;
    const gap = 30; // roughly matches total horizontal spacing between cards
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }, []);

  if (loading && featuredProviders.length === 0 && preparations.length === 0) {
    return <LoadingScreen />;
  }

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
                      <div className="stat-number">
                        {platformStats.verifiedProviders > 0
                          ? `${platformStats.verifiedProviders}+`
                          : platformStats.totalProviders > 0
                            ? `${platformStats.totalProviders}+`
                            : "500+"}
                      </div>
                      <div className="stat-label">Verified Providers</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">
                        {platformStats.averageRating > 0
                          ? `${platformStats.averageRating.toFixed(1)}★`
                          : "4.8★"}
                      </div>
                      <div className="stat-label">Average Rating</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">
                        {platformStats.totalHappyCouples > 0
                          ? platformStats.totalHappyCouples >= 1000
                            ? `${(platformStats.totalHappyCouples / 1000).toFixed(0)}K+`
                            : `${platformStats.totalHappyCouples}+`
                          : "10K+"}
                      </div>
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

            <div
              className="providers-carousel-container"
              style={{ minHeight: "400px" }}
            >
              {loading ? (
                <div className="text-center" style={{ padding: "60px 20px" }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "var(--main)" }}></i>
                  <p style={{ marginTop: "16px", color: "#666" }}>Loading featured services...</p>
                </div>
              ) : carouselItems.length > 0 ? (
                <>
                  <div className="carousel-controls">
                    <button
                      onClick={() => scrollCarousel("prev")}
                      className="carousel-control-btn prev-btn"
                      aria-label="Previous provider"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                      onClick={() => scrollCarousel("next")}
                      className="carousel-control-btn next-btn"
                      aria-label="Next provider"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>

                  <div className="providers-carousel" ref={carouselScrollRef}>
                    <div className="providers-carousel-track">
                      {carouselItems.map((item) => (
                        <React.Fragment key={item.id}>{item.card}</React.Fragment>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center" style={{ padding: "60px 20px" }}>
                  <i className="fas fa-inbox" style={{ fontSize: "3rem", color: "#ccc", marginBottom: "16px" }}></i>
                  <p style={{ color: "#666" }}>No featured providers available at the moment.</p>
                </div>
              )}
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
              {loading ? (
                <div className="col-12 text-center">
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "var(--main)" }}></i>
                </div>
              ) : preparations.length > 0 ? (
                preparations.slice(0, 6).map((preparation) => {
                  const stats = preparationStats[preparation.id];
                  const serviceCount = stats?.totalServices || preparation.services?.length || 0;
                  const providerCount = stats?.totalProviders || 0;

                  return (
                    <div
                      key={preparation.id}
                      className="category-card"
                      onClick={() => handlePreparationClick(preparation.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="category-icon">
                        {preparation.iconName ? (
                          <i className={preparation.iconName} style={{ color: preparation.colorName || "var(--main)" }}></i>
                        ) : (
                          <i className="fas fa-th-large"></i>
                        )}
                      </div>
                      <h3>{preparation.nameEn || preparation.nameAr || "Category"}</h3>
                      <p>{preparation.bioEn || preparation.bioAr || preparation.descriptionEn || preparation.descriptionAr || "Wedding preparation services"}</p>
                      <span className="provider-count">
                        {serviceCount > 0
                          ? `${serviceCount}+ Services${providerCount > 0 ? ` • ${providerCount} Providers` : ""}`
                          : providerCount > 0
                            ? `${providerCount} Providers`
                            : "View Details"}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center">
                  <p>No categories available at the moment.</p>
                </div>
              )}
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
                    <button
                      onClick={() => navigate("/preparations")}
                      className="btn btn-main cta-btn"
                    >
                      <i className="fas fa-th-large me-2"></i>
                      Browse Preparations
                    </button>
                    <button
                      onClick={() => navigate("/services")}
                      className="btn btn-main cta-btn"
                    >
                      <i className="fas fa-concierge-bell me-2"></i>
                      Browse Services
                    </button>
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
