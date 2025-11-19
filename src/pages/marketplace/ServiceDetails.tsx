import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import serviceService from "@/services/serviceService";
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import MainButton from '@/SimpleComponent/MainButton/MainButton';
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import CTASection from '@/Components/Shared/CTASection';
import SEOHead from '@/Components/SEO/SEOHead';

export default function ServiceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewSummary, setReviewSummary] = useState(null);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("details");
    const [reviewsPage, setReviewsPage] = useState(1);
    const [reviewsPageSize] = useState(10);

    useEffect(() => {
        fetchServiceDetails();
    }, [id]);

    useEffect(() => {
        if (id && activeTab === "reviews") {
            fetchReviews();
        }
    }, [id, activeTab, reviewsPage]);

    const fetchServiceDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const serviceId = parseInt(id || '0');
            if (!serviceId) {
                throw new Error('Invalid service ID');
            }

            const [serviceData, packagesData, summaryData] = await Promise.all([
                serviceService.getById(serviceId),
                serviceService.getPackages(serviceId).catch(() => []), // Packages might not exist
                serviceService.getReviewSummary(serviceId).catch(() => null), // Summary might not exist
            ]);

            setService(serviceData);
            setPackages(Array.isArray(packagesData) ? packagesData : []);
            setReviewSummary(summaryData);
        } catch (err: any) {
            console.error('Error fetching service details:', err);
            setError(err.message || "Failed to load service details");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const serviceId = parseInt(id || '0');
            if (!serviceId) return;

            const response = await serviceService.getReviews(serviceId, reviewsPage, reviewsPageSize);

            // Handle different response structures
            if (Array.isArray(response)) {
                setReviews(response);
            } else if (response?.reviews || response?.items) {
                setReviews(response.reviews || response.items || []);
            } else if (response?.data) {
                setReviews(Array.isArray(response.data) ? response.data : []);
            } else {
                setReviews([]);
            }
        } catch (err: any) {
            console.error("Failed to load reviews:", err);
            setReviews([]);
        }
    };

    const handleProviderClick = (providerId) => {
        navigate(`/marketplace/providers/${providerId}`);
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating || 0);
        const hasHalfStar = (rating || 0) % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="rating-stars">
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

    if (loading) {
        return <LoadingScreen />;
    }

    if (error || !service) {
        return (
            <div className="service-details-section">
                <section className="hero-section">
                    <div className="container">
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <div className="error-content">
                                    <i className="fas fa-exclamation-triangle" style={{ fontSize: "4rem", color: "#f14836", marginBottom: "20px" }}></i>
                                    <h2 className="section-title">Service Not Found</h2>
                                    <p className="section-description">
                                        {error || "The service you're looking for doesn't exist."}
                                    </p>
                                    <MainButton title="Go to Services" link="/services" classes="btn-main" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <>
            <SEOHead
                title={service.nameEn || service.nameAr || "Service Details"}
                description={service.descriptionEn || service.descriptionAr || "View service details"}
                keywords={`${service.nameEn || service.nameAr}, wedding service, ${service.provider?.nameEn || service.provider?.nameAr || ''}`}
                image={service.imageUrl || ''}
                url={`${window.location.origin}/services/${id}`}
            />
            <div className="service-details-section">
                {/* Hero Section with Service Image */}
                <section className="hero-section" style={{ position: "relative", minHeight: "500px" }}>
                    <div className="hero-background">
                        {service.imageUrl ? (
                            <div
                                className="service-banner"
                                style={{
                                    backgroundImage: `url(${service.imageUrl})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    height: "100%",
                                    width: "100%",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                }}
                            >
                                <div className="banner-overlay" style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)",
                                }}></div>
                            </div>
                        ) : (
                            <div className="hero-gradient"></div>
                        )}
                        <div className="hero-particles">
                            <div className="particle particle-1"></div>
                            <div className="particle particle-2"></div>
                            <div className="particle particle-3"></div>
                        </div>
                    </div>
                    <div className="container" style={{ position: "relative", zIndex: 1 }}>
                        <div className="row align-items-center">
                            <div className="col-lg-12">
                                <div className="service-header" style={{ padding: "60px 0" }}>
                                    <div className="hero-badge mb-3">
                                        <div className="badge-icon">
                                            <i className="fas fa-concierge-bell"></i>
                                        </div>
                                        <span>Wedding Service</span>
                                    </div>
                                    <h1 className="hero-title" style={{ fontSize: "3rem", fontWeight: "700", marginBottom: "20px", color: "white" }}>
                                        {service.nameEn || service.nameAr}
                                    </h1>
                                    {service.provider && (
                                        <div style={{ marginBottom: "20px" }}>
                                            <button
                                                onClick={() => handleProviderClick(service.provider.id)}
                                                className="btn btn-outline-light btn-lg"
                                                style={{ marginRight: "12px" }}
                                            >
                                                <i className="fas fa-store me-2"></i>
                                                {service.provider.nameEn || service.provider.nameAr}
                                            </button>
                                            {service.provider.isVerified && (
                                                <span style={{
                                                    padding: "8px 16px",
                                                    background: "rgba(255,255,255,0.2)",
                                                    color: "white",
                                                    borderRadius: "20px",
                                                    fontSize: "0.9rem",
                                                    fontWeight: "600",
                                                }}>
                                                    <i className="fas fa-check-circle me-1"></i>
                                                    Verified Provider
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <div className="hero-stats" style={{ display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap" }}>
                                        {service.rate && (
                                            <div className="stat-item">
                                                <div className="stat-number" style={{ color: "white" }}>
                                                    {renderStars(service.rate)}
                                                    <span style={{ marginLeft: "8px" }}>
                                                        {service.rate.toFixed(1)} ({reviewSummary?.totalReviews || 0} Reviews)
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        {service.likes !== undefined && (
                                            <div className="stat-item">
                                                <div className="stat-number" style={{ color: "white" }}>
                                                    <i className="fas fa-heart me-2"></i>
                                                    {service.likes} Likes
                                                </div>
                                            </div>
                                        )}
                                        {(service.buyPrice || service.rentPrice) && (
                                            <div className="stat-item">
                                                <div className="stat-number" style={{ color: "white", fontSize: "1.5rem", fontWeight: "700" }}>
                                                    {service.buyPrice ? `${service.buyPrice} EGP` : service.rentPrice ? `${service.rentPrice} EGP` : ''}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tabs Section */}
                <section className="tabs-section" style={{ padding: "20px 0", background: "white", borderBottom: "2px solid #eee" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="tabs" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                    <button
                                        className={`btn btn-lg ${activeTab === "details" ? "btn-main" : "btn-outline-main"}`}
                                        onClick={() => setActiveTab("details")}
                                        style={{ borderRadius: "12px" }}
                                    >
                                        <i className="fas fa-info-circle me-2"></i>
                                        Details
                                    </button>
                                    {packages.length > 0 && (
                                        <button
                                            className={`btn btn-lg ${activeTab === "packages" ? "btn-main" : "btn-outline-main"}`}
                                            onClick={() => setActiveTab("packages")}
                                            style={{ borderRadius: "12px" }}
                                        >
                                            <i className="fas fa-box me-2"></i>
                                            Packages ({packages.length})
                                        </button>
                                    )}
                                    <button
                                        className={`btn btn-lg ${activeTab === "reviews" ? "btn-main" : "btn-outline-main"}`}
                                        onClick={() => setActiveTab("reviews")}
                                        style={{ borderRadius: "12px" }}
                                    >
                                        <i className="fas fa-star me-2"></i>
                                        Reviews ({reviewSummary?.totalReviews || 0})
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="content-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                    <div className="container">
                        {activeTab === "details" && (
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="details-card shadow-sm" style={{
                                        background: "white",
                                        padding: "32px",
                                        borderRadius: "16px",
                                        marginBottom: "24px",
                                    }}>
                                        <SectionHeader
                                            title="Service Description"
                                            description="Learn more about this service"
                                        />
                                        <div className="mt-4">
                                            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#666" }}>
                                                {service.descriptionEn || service.descriptionAr || "No description available."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="pricing-card shadow-sm" style={{
                                        background: "white",
                                        padding: "32px",
                                        borderRadius: "16px",
                                    }}>
                                        <SectionHeader
                                            title="Pricing"
                                            description="Choose the option that works for you"
                                        />
                                        <div className="mt-4">
                                            <div className="row">
                                                {service.buyPrice && (
                                                    <div className="col-lg-6 mb-3">
                                                        <div style={{
                                                            padding: "20px",
                                                            background: "#f8f9fa",
                                                            borderRadius: "8px",
                                                        }}>
                                                            <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>
                                                                Buy Price
                                                            </h4>
                                                            <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--main)" }}>
                                                                {service.buyPrice} EGP
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {service.rentPrice && (
                                                    <div className="col-lg-6 mb-3">
                                                        <div style={{
                                                            padding: "20px",
                                                            background: "#f8f9fa",
                                                            borderRadius: "8px",
                                                        }}>
                                                            <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>
                                                                Rent Price
                                                            </h4>
                                                            <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--main)" }}>
                                                                {service.rentPrice} EGP
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {service.deposit && (
                                                    <div className="col-lg-12">
                                                        <div style={{
                                                            padding: "20px",
                                                            background: "#fff3cd",
                                                            borderRadius: "8px",
                                                        }}>
                                                            <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>
                                                                Deposit Required
                                                            </h4>
                                                            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#856404" }}>
                                                                {service.deposit} EGP
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4">
                                    <div className="sidebar-card shadow-lg" style={{
                                        background: "white",
                                        padding: "24px",
                                        borderRadius: "16px",
                                        position: "sticky",
                                        top: "100px",
                                    }}>
                                        {service.provider && (
                                            <div style={{ marginBottom: "24px" }}>
                                                <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "16px" }}>
                                                    Provider
                                                </h3>
                                                <div style={{
                                                    padding: "16px",
                                                    background: "#f8f9fa",
                                                    borderRadius: "8px",
                                                }}>
                                                    <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px" }}>
                                                        {service.provider.nameEn || service.provider.nameAr}
                                                    </h4>
                                                    {service.provider.shortAddress && (
                                                        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "12px" }}>
                                                            <i className="fas fa-map-marker-alt me-1"></i>
                                                            {service.provider.shortAddress}
                                                        </p>
                                                    )}
                                                    {service.provider.rate && (
                                                        <div style={{ marginBottom: "12px" }}>
                                                            {renderStars(service.provider.rate)}
                                                            <span style={{ marginLeft: "8px" }}>({service.provider.rate.toFixed(1)})</span>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => handleProviderClick(service.provider.id)}
                                                        className="btn btn-main"
                                                        style={{ width: "100%" }}
                                                    >
                                                        View Provider Profile
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {service.shortAddress && (
                                            <div style={{ marginBottom: "24px" }}>
                                                <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "16px" }}>
                                                    Location
                                                </h3>
                                                <p style={{ fontSize: "0.95rem", color: "#666" }}>
                                                    <i className="fas fa-map-marker-alt me-2 text-main"></i>
                                                    {service.shortAddress}
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "16px" }}>
                                                Service Info
                                            </h3>
                                            <div style={{ fontSize: "0.95rem", color: "#666" }}>
                                                {service.hasPackages && (
                                                    <div style={{ marginBottom: "8px" }}>
                                                        <i className="fas fa-check-circle text-success me-2"></i>
                                                        Has Packages
                                                    </div>
                                                )}
                                                {service.hasInstallment && (
                                                    <div style={{ marginBottom: "8px" }}>
                                                        <i className="fas fa-check-circle text-success me-2"></i>
                                                        Installment Available
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "packages" && (
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row justify-content-center text-center mb-5">
                                        <div className="col-lg-8">
                                            <SectionHeader
                                                badge={{ icon: "fas fa-box", text: "Packages" }}
                                                title="Available Packages"
                                                description={`${packages.length} package${packages.length !== 1 ? 's' : ''} available for this service`}
                                            />
                                        </div>
                                    </div>
                                    {packages.length > 0 ? (
                                        <div className="row">
                                            {packages.map((pkg) => (
                                                <div key={pkg.id} className="col-lg-4 mb-4">
                                                    <div className="shadow-sm" style={{
                                                        background: "white",
                                                        padding: "24px",
                                                        borderRadius: "16px",
                                                        height: "100%",
                                                        transition: "all 0.3s ease",
                                                    }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = "translateY(-4px)";
                                                            e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = "translateY(0)";
                                                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                                        }}>
                                                        <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "12px" }}>
                                                            {pkg.name || pkg.nameEn || pkg.nameAr}
                                                        </h3>
                                                        {pkg.description && (
                                                            <p style={{ fontSize: "0.95rem", color: "#666", marginBottom: "16px" }}>
                                                                {pkg.description}
                                                            </p>
                                                        )}
                                                        {pkg.price && (
                                                            <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--main)", marginBottom: "16px" }}>
                                                                {pkg.price} EGP
                                                            </div>
                                                        )}
                                                        {pkg.features && pkg.features.length > 0 && (
                                                            <ul style={{ listStyle: "none", padding: 0 }}>
                                                                {pkg.features.map((feature, index) => (
                                                                    <li key={index} style={{ marginBottom: "8px" }}>
                                                                        <i className="fas fa-check text-success me-2"></i>
                                                                        {feature}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center" style={{ padding: "60px 20px" }}>
                                            <i className="fas fa-box-open" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                                            <h3>No Packages Available</h3>
                                            <p style={{ color: "#666" }}>
                                                This service doesn't have any packages at the moment.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="row">
                                <div className="col-lg-8">
                                    {reviewSummary && (
                                        <div className="shadow-sm" style={{
                                            background: "white",
                                            padding: "32px",
                                            borderRadius: "16px",
                                            marginBottom: "24px",
                                        }}>
                                            <SectionHeader
                                                title="Review Summary"
                                                description="See what customers are saying"
                                            />
                                            <div className="mt-4">
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div style={{ textAlign: "center" }}>
                                                            <div style={{ fontSize: "3rem", fontWeight: "700", color: "var(--main)" }}>
                                                                {reviewSummary.averageRating?.toFixed(1) || "0.0"}
                                                            </div>
                                                            {renderStars(reviewSummary.averageRating)}
                                                            <p style={{ marginTop: "8px", color: "#666" }}>
                                                                {reviewSummary.totalReviews || 0} Reviews
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        {reviewSummary.ratingCounts && (
                                                            <div>
                                                                {[5, 4, 3, 2, 1].map((rating) => (
                                                                    <div key={rating} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                                                        <span style={{ width: "60px" }}>{rating} Star</span>
                                                                        <div style={{
                                                                            flex: 1,
                                                                            height: "8px",
                                                                            background: "#eee",
                                                                            borderRadius: "4px",
                                                                            margin: "0 12px",
                                                                            overflow: "hidden",
                                                                        }}>
                                                                            <div style={{
                                                                                height: "100%",
                                                                                width: `${((reviewSummary.ratingCounts[rating] || 0) / (reviewSummary.totalReviews || 1)) * 100}%`,
                                                                                background: "var(--main)",
                                                                            }}></div>
                                                                        </div>
                                                                        <span style={{ width: "40px", textAlign: "right" }}>
                                                                            {reviewSummary.ratingCounts[rating] || 0}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <SectionHeader
                                            title="Customer Reviews"
                                            description={`${reviewSummary?.totalReviews || 0} review${reviewSummary?.totalReviews !== 1 ? 's' : ''} from verified customers`}
                                        />
                                    </div>
                                    {reviews.length > 0 ? (
                                        <>
                                            {reviews.map((review) => (
                                                <div key={review.id} className="shadow-sm" style={{
                                                    background: "white",
                                                    padding: "24px",
                                                    borderRadius: "16px",
                                                    marginBottom: "16px",
                                                }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                                        <div>
                                                            <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "4px" }}>
                                                                {review.userName || review.reviewer || "Anonymous"}
                                                            </h4>
                                                            {review.rating && renderStars(review.rating)}
                                                        </div>
                                                        <div style={{ fontSize: "0.85rem", color: "#666" }}>
                                                            {new Date(review.date || review.creationDate || review.dateCreated).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    {review.comment && (
                                                        <p style={{ color: "#333", lineHeight: "1.6" }}>
                                                            {review.comment}
                                                        </p>
                                                    )}
                                                    {review.images && review.images.length > 0 && (
                                                        <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                            {review.images.map((img, index) => (
                                                                <img
                                                                    key={index}
                                                                    src={img}
                                                                    alt={`Review ${index + 1}`}
                                                                    style={{
                                                                        width: "80px",
                                                                        height: "80px",
                                                                        objectFit: "cover",
                                                                        borderRadius: "8px",
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="text-center shadow-sm" style={{ padding: "60px 20px", background: "white", borderRadius: "16px" }}>
                                            <i className="fas fa-comments" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                                            <h3>No Reviews Yet</h3>
                                            <p style={{ color: "#666" }}>
                                                Be the first to review this service!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}

