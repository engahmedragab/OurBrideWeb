import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serviceService } from "../../services/apiService";
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import MainButton from '../../SimpleComponent/MainButton/MainButton';

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
            const [serviceData, packagesData, summaryData] = await Promise.all([
                serviceService.getById(id),
                serviceService.getPackages(id),
                serviceService.getReviewSummary(id),
            ]);

            setService(serviceData.data || serviceData);
            setPackages(packagesData.data || packagesData || []);
            setReviewSummary(summaryData.data || summaryData);
        } catch (err) {
            setError(err.message || "Failed to load service details");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await serviceService.getReviews(id, reviewsPage, reviewsPageSize);
            const data = response.data || response;
            setReviews(data.reviews || data || []);
        } catch (err) {
            console.error("Failed to load reviews:", err);
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
        <div className="service-details-section">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    {service.imageUrl ? (
                        <div
                            className="service-banner"
                            style={{
                                backgroundImage: `url(${service.imageUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                height: "400px",
                                width: "100%",
                                position: "relative",
                            }}
                        >
                            <div className="banner-overlay" style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)",
                            }}></div>
                        </div>
                    ) : (
                        <div className="hero-gradient"></div>
                    )}
                </div>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="service-header" style={{ padding: "40px 0" }}>
                                <h1 className="service-name" style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "12px", color: "white" }}>
                                    {service.nameEn || service.nameAr}
                                </h1>
                                {service.provider && (
                                    <div style={{ marginBottom: "16px" }}>
                                        <button
                                            onClick={() => handleProviderClick(service.provider.id)}
                                            className="btn btn-outline-light"
                                            style={{ marginRight: "12px" }}
                                        >
                                            <i className="fas fa-store me-2"></i>
                                            {service.provider.nameEn || service.provider.nameAr}
                                        </button>
                                        {service.provider.isVerified && (
                                            <span style={{
                                                padding: "6px 12px",
                                                background: "rgba(255,255,255,0.2)",
                                                color: "white",
                                                borderRadius: "20px",
                                                fontSize: "0.85rem",
                                                fontWeight: "600",
                                            }}>
                                                <i className="fas fa-check-circle me-1"></i>
                                                Verified Provider
                                            </span>
                                        )}
                                    </div>
                                )}
                                <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                                    {service.rate && (
                                        <div>
                                            {renderStars(service.rate)}
                                            <span style={{ marginLeft: "8px", color: "white" }}>
                                                ({service.rate.toFixed(1)}) {reviewSummary?.totalReviews || 0} Reviews
                                            </span>
                                        </div>
                                    )}
                                    {service.likes !== undefined && (
                                        <div style={{ color: "white" }}>
                                            <i className="fas fa-heart me-1"></i>
                                            {service.likes} Likes
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
                            <div className="tabs" style={{ display: "flex", gap: "24px" }}>
                                <button
                                    className={`btn ${activeTab === "details" ? "btn-main" : "btn-outline-main"}`}
                                    onClick={() => setActiveTab("details")}
                                >
                                    Details
                                </button>
                                {packages.length > 0 && (
                                    <button
                                        className={`btn ${activeTab === "packages" ? "btn-main" : "btn-outline-main"}`}
                                        onClick={() => setActiveTab("packages")}
                                    >
                                        Packages ({packages.length})
                                    </button>
                                )}
                                <button
                                    className={`btn ${activeTab === "reviews" ? "btn-main" : "btn-outline-main"}`}
                                    onClick={() => setActiveTab("reviews")}
                                >
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
                                <div className="details-card" style={{
                                    background: "white",
                                    padding: "32px",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                    marginBottom: "24px",
                                }}>
                                    <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px" }}>
                                        Service Description
                                    </h2>
                                    <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#666" }}>
                                        {service.descriptionEn || service.descriptionAr || "No description available."}
                                    </p>
                                </div>

                                {/* Pricing */}
                                <div className="pricing-card" style={{
                                    background: "white",
                                    padding: "32px",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                }}>
                                    <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px" }}>
                                        Pricing
                                    </h2>
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

                            <div className="col-lg-4">
                                <div className="sidebar-card" style={{
                                    background: "white",
                                    padding: "24px",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                    position: "sticky",
                                    top: "20px",
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
                                <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "32px" }}>
                                    Available Packages
                                </h2>
                                {packages.length > 0 ? (
                                    <div className="row">
                                        {packages.map((pkg) => (
                                            <div key={pkg.id} className="col-lg-4 mb-4">
                                                <div style={{
                                                    background: "white",
                                                    padding: "24px",
                                                    borderRadius: "12px",
                                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                                    height: "100%",
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
                                    <div style={{
                                        background: "white",
                                        padding: "24px",
                                        borderRadius: "12px",
                                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                        marginBottom: "24px",
                                    }}>
                                        <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px" }}>
                                            Review Summary
                                        </h2>
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
                                )}

                                <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px" }}>
                                    Reviews
                                </h2>
                                {reviews.length > 0 ? (
                                    <>
                                        {reviews.map((review) => (
                                            <div key={review.id} style={{
                                                background: "white",
                                                padding: "24px",
                                                borderRadius: "12px",
                                                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
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
                                    <div className="text-center" style={{ padding: "60px 20px", background: "white", borderRadius: "12px" }}>
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
    );
}

