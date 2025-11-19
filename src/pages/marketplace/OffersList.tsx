import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import SEOHead from '@/Components/SEO/SEOHead';
import CTASection from '@/Components/Shared/CTASection';

export default function OffersList() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  // TODO: Replace with actual API call
  useEffect(() => {
    // Placeholder - implement actual API call
    setLoading(false);
    setOffers([]);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <SEOHead
        title="Offers & Deals"
        description="Browse amazing offers and deals on wedding services and products"
        keywords="wedding offers, deals, discounts, promotions, wedding savings"
        image=""
        url={`${window.location.origin}/offers`}
      />
      <div className="offers-list-section">
        {/* Hero Section */}
        <HeroSection
          badge={{
            icon: "fas fa-tags",
            text: "Special Offers"
          }}
          title={
            <>
              Offers & <span className="text-gradient">Deals</span>
            </>
          }
          description="Discover amazing offers and deals on wedding services and products. Save on your special day with our exclusive promotions."
          stats={[
            { number: offers.length > 0 ? `${offers.length}+` : "50+", label: "Active Offers" },
            { number: "Up to 50%", label: "Discounts" },
            { number: "4.8★", label: "Average Rating" },
          ]}
        />

        {/* Offers Grid Section */}
        <section className="offers-grid-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <SectionHeader
                  badge={{ icon: "fas fa-tags", text: "Latest" }}
                  title="Available Offers"
                  description="Browse through our current offers and deals"
                />
              </div>
            </div>

            {offers.length === 0 ? (
              <div className="row justify-content-center text-center">
                <div className="col-lg-8">
                  <div className="empty-state" style={{ padding: "60px 20px" }}>
                    <i className="fas fa-tags" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                    <h3>No Offers Available</h3>
                    <p style={{ color: "#666", marginBottom: "24px" }}>
                      Check back soon for new offers and deals!
                    </p>
                    <Link to="/services" className="btn btn-outline-main">
                      <i className="fas fa-arrow-left me-2"></i>
                      Browse Services
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                {offers.map((offer) => (
                  <div key={offer.id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card shadow-sm" style={{ borderRadius: "16px", overflow: "hidden", transition: "all 0.3s ease" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                      }}>
                      {offer.imageUrl && (
                        <img
                          src={offer.imageUrl}
                          className="card-img-top"
                          alt={offer.title}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      )}
                      <div className="card-body" style={{ padding: "24px" }}>
                        <h5 className="card-title mb-3" style={{ fontWeight: "600" }}>
                          {offer.title}
                        </h5>
                        <p className="card-text" style={{ color: "#666", marginBottom: "16px" }}>
                          {offer.description}
                        </p>
                        {offer.discount && (
                          <div className="mb-3">
                            <span className="badge bg-danger" style={{ fontSize: "1rem", padding: "8px 12px" }}>
                              {offer.discount}% OFF
                            </span>
                          </div>
                        )}
                        {offer.link && (
                          <Link to={offer.link} className="btn btn-outline-main btn-sm">
                            View Offer <i className="fas fa-arrow-right ms-2"></i>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <CTASection
          title="Looking for More Deals?"
          description="Browse our services and products to find the perfect wedding solutions for your special day."
          buttons={[
            {
              label: "Browse Services",
              icon: "fas fa-concierge-bell",
              to: "/services",
              variant: "primary"
            },
            {
              label: "Shop Products",
              icon: "fas fa-shopping-bag",
              to: "/shop",
              variant: "outline"
            }
          ]}
        />
      </div>
    </>
  );
}

