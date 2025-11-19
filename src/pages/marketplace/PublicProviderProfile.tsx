import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { publicProviderService } from "@/services/publicProviderService";
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import MainButton from '@/SimpleComponent/MainButton/MainButton';

export default function PublicProviderProfile() {
    const { id, code, slug } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProvider = async () => {
            try {
                setLoading(true);
                let data;

                if (id) {
                    data = await publicProviderService.getProfileById(id);
                } else if (code) {
                    data = await publicProviderService.getProfileByCode(code);
                } else if (slug) {
                    data = await publicProviderService.getProfileBySlug(slug);
                } else {
                    throw new Error("No identifier provided");
                }

                setProvider(data);

                // Update SEO meta tags if available
                if (data?.seoMetaTitle) {
                    document.title = data.seoMetaTitle;
                }
                if (data?.seoMetaDescription) {
                    const metaDescription = document.querySelector('meta[name="description"]');
                    if (metaDescription) {
                        metaDescription.setAttribute('content', data.seoMetaDescription);
                    } else {
                        const meta = document.createElement('meta');
                        meta.name = 'description';
                        meta.content = data.seoMetaDescription;
                        document.getElementsByTagName('head')[0].appendChild(meta);
                    }
                }
            } catch (err) {
                setError(err.message || "Failed to load provider profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProvider();
    }, [id, code, slug]);

    const handleViewStore = () => {
        if (provider?.id) {
            navigate(`/marketplace/providers/${provider.id}/store`);
        }
    };

    const handleViewLinks = () => {
        if (provider?.id) {
            navigate(`/marketplace/providers/${provider.id}/links`);
        } else if (code) {
            navigate(`/marketplace/providers/code/${code}/links`);
        } else if (slug) {
            navigate(`/marketplace/providers/slug/${slug}/links`);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (error || !provider) {
        return (
            <div className="provider-profile-section">
                <section className="hero-section">
                    <div className="container">
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <div className="error-content">
                                    <i className="fas fa-exclamation-triangle" style={{ fontSize: "4rem", color: "#f14836", marginBottom: "20px" }}></i>
                                    <h2 className="section-title">Provider Not Found</h2>
                                    <p className="section-description">
                                        {error || "The provider profile you're looking for doesn't exist or is not publicly available."}
                                    </p>
                                    <MainButton
                                        title="Go to Home"
                                        link="/"
                                        classes="btn-main"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

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
                <span className="rating-text">({provider.averageRating?.toFixed(1) || "0.0"})</span>
            </div>
        );
    };

    const formatWorkingTime = (workingTime) => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[workingTime.dayOfWeek - 1] || `Day ${workingTime.dayOfWeek}`;
    };

    return (
        <div className="provider-profile-section">
            {/* Hero Section with Banner */}
            <section className="hero-section">
                <div className="hero-background">
                    {provider.publicBannerImageUrl ? (
                        <div
                            className="provider-banner"
                            style={{
                                backgroundImage: `url(${provider.publicBannerImageUrl})`,
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
                                background: "linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)",
                            }}></div>
                        </div>
                    ) : (
                        <div className="hero-gradient"></div>
                    )}
                </div>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="provider-header">
                                <div className="provider-logo-container">
                                    {provider.publicLogoImageUrl ? (
                                        <img
                                            src={provider.publicLogoImageUrl}
                                            alt={provider.nameEn || provider.nameAr}
                                            className="provider-logo"
                                        />
                                    ) : (
                                        <div className="provider-logo-placeholder">
                                            <i className="fas fa-store"></i>
                                        </div>
                                    )}
                                </div>
                                <div className="provider-header-content">
                                    <div className="provider-title-section">
                                        <h1 className="provider-name">
                                            {provider.nameEn || provider.nameAr}
                                            {provider.isVerified && (
                                                <i className="fas fa-check-circle verified-badge" title="Verified Provider"></i>
                                            )}
                                        </h1>
                                        {provider.shortAddress && (
                                            <p className="provider-location">
                                                <i className="fas fa-map-marker-alt me-2"></i>
                                                {provider.shortAddress}
                                            </p>
                                        )}
                                    </div>
                                    <div className="provider-stats">
                                        {provider.rate && (
                                            <div className="stat-item">
                                                {renderStars(provider.rate)}
                                                <span className="stat-label">{provider.totalReviews || 0} Reviews</span>
                                            </div>
                                        )}
                                        {provider.likes !== undefined && (
                                            <div className="stat-item">
                                                <i className="fas fa-heart text-main"></i>
                                                <span className="stat-label">{provider.likes} Likes</span>
                                            </div>
                                        )}
                                        {provider.totalViews !== undefined && (
                                            <div className="stat-item">
                                                <i className="fas fa-eye text-main"></i>
                                                <span className="stat-label">{provider.totalViews} Views</span>
                                            </div>
                                        )}
                                        {provider.totalFollowers !== undefined && (
                                            <div className="stat-item">
                                                <i className="fas fa-users text-main"></i>
                                                <span className="stat-label">{provider.totalFollowers} Followers</span>
                                            </div>
                                        )}
                                        {provider.totalServices !== undefined && provider.totalServices > 0 && (
                                            <div className="stat-item">
                                                <i className="fas fa-concierge-bell text-main"></i>
                                                <span className="stat-label">{provider.totalServices} Services</span>
                                            </div>
                                        )}
                                        {provider.totalProducts !== undefined && provider.totalProducts > 0 && (
                                            <div className="stat-item">
                                                <i className="fas fa-box text-main"></i>
                                                <span className="stat-label">{provider.totalProducts} Products</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Provider Information Section */}
            <section className="provider-info-section" style={{ padding: "80px 0" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            {/* Description */}
                            {provider.descriptionEn || provider.descriptionAr ? (
                                <div className="info-card" style={{ marginBottom: "32px" }}>
                                    <h3 className="info-card-title">
                                        <i className="fas fa-info-circle me-2 text-main"></i>
                                        About
                                    </h3>
                                    <p className="info-card-content">
                                        {provider.descriptionEn || provider.descriptionAr}
                                    </p>
                                </div>
                            ) : null}

                            {/* Services */}
                            {provider.services && provider.services.length > 0 ? (
                                <div className="info-card" style={{ marginBottom: "32px" }}>
                                    <h3 className="info-card-title">
                                        <i className="fas fa-concierge-bell me-2 text-main"></i>
                                        Services ({provider.totalServices || provider.services.length})
                                    </h3>
                                    <div className="services-grid" style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                                        gap: "20px",
                                        marginTop: "24px",
                                    }}>
                                        {provider.services.map((service) => (
                                            <div key={service.id} className="service-item-card" style={{
                                                background: "white",
                                                padding: "20px",
                                                borderRadius: "12px",
                                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                                transition: "all 0.3s ease",
                                            }}>
                                                {service.image && (
                                                    <img
                                                        src={service.image}
                                                        alt={service.nameEn || service.nameAr}
                                                        style={{
                                                            width: "100%",
                                                            height: "150px",
                                                            objectFit: "cover",
                                                            borderRadius: "8px",
                                                            marginBottom: "12px",
                                                        }}
                                                    />
                                                )}
                                                <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px" }}>
                                                    {service.nameEn || service.nameAr}
                                                </h4>
                                                {(service.descriptionEn || service.descriptionAr) && (
                                                    <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "8px" }}>
                                                        {(service.descriptionEn || service.descriptionAr).substring(0, 100)}...
                                                    </p>
                                                )}
                                                {service.price && (
                                                    <div className="service-price" style={{ fontWeight: "700", color: "var(--main)" }}>
                                                        {service.price} EGP
                                                    </div>
                                                )}
                                                {service.rate && (
                                                    <div className="service-rating" style={{ marginTop: "8px" }}>
                                                        {renderStars(service.rate)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            {/* Memberships */}
                            {provider.memberships && provider.memberships.length > 0 ? (
                                <div className="info-card" style={{ marginBottom: "32px" }}>
                                    <h3 className="info-card-title">
                                        <i className="fas fa-crown me-2 text-main"></i>
                                        Membership Plans ({provider.memberships.length})
                                    </h3>
                                    <div className="memberships-grid" style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                        gap: "20px",
                                        marginTop: "24px",
                                    }}>
                                        {provider.memberships
                                            .filter(membership => membership.isActive)
                                            .map((membership) => (
                                                <div key={membership.id} className="membership-card" style={{
                                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                    padding: "24px",
                                                    borderRadius: "16px",
                                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                                                    color: "white",
                                                    transition: "all 0.3s ease",
                                                }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = "translateY(-4px)";
                                                        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.2)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = "translateY(0)";
                                                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
                                                    }}
                                                >
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <h4 style={{ fontSize: "1.3rem", fontWeight: "700", margin: 0 }}>
                                                            {membership.name || "Membership Plan"}
                                                        </h4>
                                                        {membership.isActive && (
                                                            <span style={{
                                                                padding: "4px 10px",
                                                                background: "rgba(255, 255, 255, 0.3)",
                                                                borderRadius: "20px",
                                                                fontSize: "0.75rem",
                                                                fontWeight: "600",
                                                            }}>
                                                                Active
                                                            </span>
                                                        )}
                                                    </div>
                                                    {membership.price !== undefined && membership.price !== null && (
                                                        <div className="membership-price" style={{
                                                            fontSize: "2rem",
                                                            fontWeight: "700",
                                                            marginBottom: "16px",
                                                        }}>
                                                            {membership.price} EGP
                                                        </div>
                                                    )}
                                                    <button
                                                        className="btn btn-light"
                                                        style={{
                                                            width: "100%",
                                                            fontWeight: "600",
                                                            marginTop: "12px",
                                                        }}
                                                        onClick={() => {
                                                            if (provider.id) {
                                                                navigate(`/marketplace/providers/${provider.id}/store`);
                                                            }
                                                        }}
                                                    >
                                                        <i className="fas fa-shopping-cart me-2"></i>
                                                        View Details
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ) : null}

                            {/* Gift Cards */}
                            {provider.giftCards && provider.giftCards.length > 0 ? (
                                <div className="info-card" style={{ marginBottom: "32px" }}>
                                    <h3 className="info-card-title">
                                        <i className="fas fa-gift me-2 text-main"></i>
                                        Gift Cards ({provider.giftCards.length})
                                    </h3>
                                    <div className="gift-cards-grid" style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                                        gap: "20px",
                                        marginTop: "24px",
                                    }}>
                                        {provider.giftCards
                                            .filter(giftCard => giftCard.isActive)
                                            .map((giftCard) => (
                                                <div key={giftCard.id} className="gift-card-item" style={{
                                                    background: "white",
                                                    padding: "24px",
                                                    borderRadius: "16px",
                                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                                    border: "2px solid #f0f0f0",
                                                    transition: "all 0.3s ease",
                                                    textAlign: "center",
                                                }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = "translateY(-4px)";
                                                        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                                        e.currentTarget.style.borderColor = "var(--main)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = "translateY(0)";
                                                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                                        e.currentTarget.style.borderColor = "#f0f0f0";
                                                    }}
                                                >
                                                    <div style={{
                                                        width: "60px",
                                                        height: "60px",
                                                        background: "linear-gradient(135deg, var(--main) 0%, var(--third) 100%)",
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        margin: "0 auto 16px",
                                                        color: "white",
                                                        fontSize: "1.5rem",
                                                    }}>
                                                        <i className="fas fa-gift"></i>
                                                    </div>
                                                    <h5 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px" }}>
                                                        {giftCard.name || "Gift Card"}
                                                    </h5>
                                                    {giftCard.isActive && (
                                                        <span style={{
                                                            padding: "4px 10px",
                                                            background: "#d4edda",
                                                            color: "#155724",
                                                            borderRadius: "20px",
                                                            fontSize: "0.75rem",
                                                            fontWeight: "600",
                                                            marginBottom: "12px",
                                                            display: "inline-block",
                                                        }}>
                                                            Available
                                                        </span>
                                                    )}
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        style={{ width: "100%", marginTop: "12px" }}
                                                        onClick={() => {
                                                            if (provider.id) {
                                                                navigate(`/marketplace/providers/${provider.id}/store`);
                                                            }
                                                        }}
                                                    >
                                                        <i className="fas fa-shopping-cart me-2"></i>
                                                        Purchase Gift Card
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ) : null}

                            {/* Team Members */}
                            {provider.teamMembers && provider.teamMembers.length > 0 ? (
                                <div className="info-card" style={{ marginBottom: "32px" }}>
                                    <h3 className="info-card-title">
                                        <i className="fas fa-users me-2 text-main"></i>
                                        Team Members ({provider.teamMembers.length})
                                    </h3>
                                    <div className="team-members-grid" style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                        gap: "20px",
                                        marginTop: "24px",
                                    }}>
                                        {provider.teamMembers
                                            .filter(member => member.isActive)
                                            .map((member) => (
                                                <div key={member.id} className="team-member-card" style={{
                                                    background: "white",
                                                    padding: "24px",
                                                    borderRadius: "12px",
                                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                                    transition: "all 0.3s ease",
                                                }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = "translateY(-4px)";
                                                        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = "translateY(0)";
                                                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                                    }}
                                                >
                                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                                                        <div style={{
                                                            width: "60px",
                                                            height: "60px",
                                                            borderRadius: "50%",
                                                            background: "linear-gradient(135deg, var(--main) 0%, var(--third) 100%)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            color: "white",
                                                            fontSize: "1.5rem",
                                                            fontWeight: "700",
                                                            marginRight: "16px",
                                                        }}>
                                                            {member.user?.firstName?.[0]?.toUpperCase() || member.user?.name?.[0]?.toUpperCase() || "?"}
                                                        </div>
                                                        <div>
                                                            <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "4px", color: "#2d2d2d" }}>
                                                                {member.user?.firstName && member.user?.lastName
                                                                    ? `${member.user.firstName} ${member.user.lastName}`
                                                                    : member.user?.name || member.user?.email || "Team Member"}
                                                            </h4>
                                                            {member.role && (
                                                                <p style={{ fontSize: "0.85rem", color: "#666", margin: 0 }}>
                                                                    {member.role.name || member.roleKey || "Member"}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {member.user?.bio && (
                                                        <p style={{ fontSize: "0.9rem", color: "#666", lineHeight: "1.5", marginBottom: "12px" }}>
                                                            {member.user.bio}
                                                        </p>
                                                    )}
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
                                                        {member.user?.isCertified && (
                                                            <span style={{
                                                                padding: "4px 10px",
                                                                background: "#d4edda",
                                                                color: "#155724",
                                                                borderRadius: "4px",
                                                                fontSize: "0.75rem",
                                                                fontWeight: "600",
                                                            }}>
                                                                <i className="fas fa-certificate me-1"></i>
                                                                Certified
                                                            </span>
                                                        )}
                                                        {member.user?.isVerified && (
                                                            <span style={{
                                                                padding: "4px 10px",
                                                                background: "#cce5ff",
                                                                color: "#004085",
                                                                borderRadius: "4px",
                                                                fontSize: "0.75rem",
                                                                fontWeight: "600",
                                                            }}>
                                                                <i className="fas fa-check-circle me-1"></i>
                                                                Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                    {member.branchId && (
                                                        <div style={{ marginTop: "12px", fontSize: "0.85rem", color: "#999" }}>
                                                            <i className="fas fa-map-marker-alt me-1"></i>
                                                            Branch: {member.availableBranches?.find(b => b.id === member.branchId)?.nameEn || `Branch ${member.branchId}`}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ) : null}

                            {/* Reviews */}
                            {provider.reviews && provider.reviews.length > 0 ? (
                                <div className="info-card">
                                    <h3 className="info-card-title">
                                        <i className="fas fa-star me-2 text-main"></i>
                                        Reviews ({provider.totalReviews || provider.reviews.length})
                                    </h3>
                                    <div className="reviews-list" style={{ marginTop: "24px" }}>
                                        {provider.reviews.map((review) => (
                                            <div key={review.id} className="review-item" style={{
                                                background: "white",
                                                padding: "20px",
                                                borderRadius: "12px",
                                                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                                                marginBottom: "16px",
                                            }}>
                                                <div className="review-header" style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    marginBottom: "12px",
                                                }}>
                                                    <div className="review-rating">
                                                        {renderStars(review.rate)}
                                                    </div>
                                                    <div className="review-date" style={{ fontSize: "0.85rem", color: "#666" }}>
                                                        {new Date(review.creationDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                {review.comment && (
                                                    <p className="review-comment" style={{ color: "#333", lineHeight: "1.6" }}>
                                                        {review.comment}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <div className="col-lg-4">
                            <div className="provider-sidebar">
                                {/* Contact Information */}
                                <div className="sidebar-card" style={{
                                    background: "white",
                                    padding: "24px",
                                    borderRadius: "16px",
                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                    marginBottom: "24px",
                                }}>
                                    <h3 className="sidebar-title" style={{
                                        fontSize: "1.3rem",
                                        fontWeight: "700",
                                        marginBottom: "20px",
                                        color: "#2d2d2d",
                                    }}>
                                        Contact Information
                                    </h3>
                                    {provider.phoneNumber && (
                                        <div className="contact-item" style={{ marginBottom: "16px" }}>
                                            <i className="fas fa-phone text-main me-2"></i>
                                            <a href={`tel:${provider.phoneNumber}`} style={{ color: "#333", textDecoration: "none" }}>
                                                {provider.phoneNumber}
                                            </a>
                                        </div>
                                    )}
                                    {provider.address && (
                                        <div className="contact-item" style={{ marginBottom: "16px" }}>
                                            <i className="fas fa-map-marker-alt text-main me-2"></i>
                                            <span>
                                                {provider.address.street}, {provider.address.city}, {provider.address.country}
                                            </span>
                                        </div>
                                    )}
                                    {provider.profileURL && (
                                        <div className="contact-item">
                                            <i className="fas fa-globe text-main me-2"></i>
                                            <a href={provider.profileURL} target="_blank" rel="noopener noreferrer" style={{ color: "#333", textDecoration: "none" }}>
                                                Visit Website
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Working Hours */}
                                {provider.workingTimes && provider.workingTimes.length > 0 && (
                                    <div className="sidebar-card" style={{
                                        background: "white",
                                        padding: "24px",
                                        borderRadius: "16px",
                                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                        marginBottom: "24px",
                                    }}>
                                        <h3 className="sidebar-title" style={{
                                            fontSize: "1.3rem",
                                            fontWeight: "700",
                                            marginBottom: "20px",
                                            color: "#2d2d2d",
                                        }}>
                                            Working Hours
                                        </h3>
                                        <div className="working-hours-list">
                                            {provider.workingTimes.map((wt) => (
                                                <div key={wt.id} className="working-hour-item" style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    padding: "8px 0",
                                                    borderBottom: "1px solid #eee",
                                                }}>
                                                    <span>{formatWorkingTime(wt)}</span>
                                                    <span style={{ fontWeight: "600" }}>
                                                        {wt.startTime} - {wt.endTime}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                {provider.links && provider.links.length > 0 && (
                                    <div className="sidebar-card" style={{
                                        background: "white",
                                        padding: "24px",
                                        borderRadius: "16px",
                                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                        marginBottom: "24px",
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                                            <h3 className="sidebar-title" style={{
                                                fontSize: "1.3rem",
                                                fontWeight: "700",
                                                margin: 0,
                                                color: "#2d2d2d",
                                            }}>
                                                Follow Us
                                            </h3>
                                            {provider.links.length > 3 && (
                                                <button
                                                    onClick={handleViewLinks}
                                                    className="btn btn-outline-main btn-sm"
                                                    style={{ fontSize: "0.85rem", padding: "6px 12px" }}
                                                >
                                                    View All ({provider.links.length})
                                                </button>
                                            )}
                                        </div>
                                        <div className="links-list">
                                            {provider.links.slice(0, 3).map((link) => (
                                                <a
                                                    key={link.id}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="link-item"
                                                    style={{
                                                        display: "block",
                                                        padding: "12px",
                                                        borderRadius: "8px",
                                                        background: "#f8f9fa",
                                                        marginBottom: "8px",
                                                        textDecoration: "none",
                                                        color: "#333",
                                                        transition: "all 0.3s ease",
                                                    }}
                                                >
                                                    <i className={`fab fa-${link.type?.toLowerCase() || "link"} me-2 text-main`}></i>
                                                    {link.displayName || link.nameEn || link.nameAr || link.type || "Link"}
                                                </a>
                                            ))}
                                        </div>
                                        {provider.links.length > 3 && (
                                            <button
                                                onClick={handleViewLinks}
                                                className="btn btn-main"
                                                style={{ width: "100%", marginTop: "12px" }}
                                            >
                                                <i className="fas fa-external-link-alt me-2"></i>
                                                View All Links
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Payment Methods */}
                                {provider.paymentMethods && provider.paymentMethods.length > 0 && (
                                    <div className="sidebar-card" style={{
                                        background: "white",
                                        padding: "24px",
                                        borderRadius: "16px",
                                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                        marginBottom: "24px",
                                    }}>
                                        <h3 className="sidebar-title" style={{
                                            fontSize: "1.3rem",
                                            fontWeight: "700",
                                            marginBottom: "20px",
                                            color: "#2d2d2d",
                                        }}>
                                            <i className="fas fa-credit-card me-2 text-main"></i>
                                            Payment Methods
                                        </h3>
                                        <div className="payment-methods-list">
                                            {provider.paymentMethods.map((method) => (
                                                <div key={method.id} className="payment-method-item" style={{
                                                    padding: "12px",
                                                    background: "#f8f9fa",
                                                    borderRadius: "8px",
                                                    marginBottom: "8px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "12px",
                                                }}>
                                                    <i className={`fas fa-${method.type?.toLowerCase() === 'cash' ? 'money-bill' : method.type?.toLowerCase() === 'card' ? 'credit-card' : 'wallet'} text-main`}></i>
                                                    <span style={{ flex: 1 }}>
                                                        {method.name || method.type || "Payment Method"}
                                                    </span>
                                                    {method.isActive && (
                                                        <span style={{
                                                            padding: "4px 8px",
                                                            background: "#d4edda",
                                                            color: "#155724",
                                                            borderRadius: "4px",
                                                            fontSize: "0.75rem",
                                                            fontWeight: "600",
                                                        }}>
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Branches */}
                                {provider.branches && provider.branches.length > 0 && (
                                    <div className="sidebar-card" style={{
                                        background: "white",
                                        padding: "24px",
                                        borderRadius: "16px",
                                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                        marginBottom: "24px",
                                    }}>
                                        <h3 className="sidebar-title" style={{
                                            fontSize: "1.3rem",
                                            fontWeight: "700",
                                            marginBottom: "20px",
                                            color: "#2d2d2d",
                                        }}>
                                            Branches
                                        </h3>
                                        <div className="branches-list">
                                            {provider.branches.map((branch) => (
                                                <div key={branch.id} className="branch-item" style={{
                                                    padding: "12px",
                                                    background: "#f8f9fa",
                                                    borderRadius: "8px",
                                                    marginBottom: "8px",
                                                }}>
                                                    <i className="fas fa-map-marker-alt text-main me-2"></i>
                                                    {branch.nameEn || branch.nameAr}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Store CTA */}
                                {provider.totalProducts > 0 && (
                                    <div className="sidebar-card" style={{
                                        background: "linear-gradient(135deg, var(--main) 0%, var(--third) 100%)",
                                        padding: "32px 24px",
                                        borderRadius: "16px",
                                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                        textAlign: "center",
                                        color: "white",
                                    }}>
                                        <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "12px" }}>
                                            View Our Store
                                        </h3>
                                        <p style={{ marginBottom: "20px", opacity: 0.9 }}>
                                            Browse {provider.totalProducts} products
                                        </p>
                                        <button
                                            onClick={handleViewStore}
                                            className="btn btn-outline-main"
                                            style={{
                                                background: "white",
                                                color: "var(--main)",
                                                border: "none",
                                            }}
                                        >
                                            <i className="fas fa-store me-2"></i>
                                            Visit Store
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

