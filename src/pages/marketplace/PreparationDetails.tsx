import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import preparationService from "@/services/preparationService";
// import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import MainButton from '@/SimpleComponent/MainButton/MainButton';

export default function PreparationDetails() {
    const { preparationId } = useParams();
    const navigate = useNavigate();
    const [preparation, setPreparation] = useState(null);
    const [services, setServices] = useState([]);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(20);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [prepData, servicesData] = await Promise.all([
                    preparationService.getById(preparationId),
                    preparationService.getServicesByPreparationPaged(preparationId, currentPage, pageSize),
                ]);

                const prep = prepData.data || prepData;
                setPreparation(prep);

                const servicesList = servicesData.data || servicesData || [];
                setServices(servicesList);

                // Extract unique providers
                const providersMap = new Map();
                servicesList.forEach((service) => {
                    if (service.provider && !providersMap.has(service.provider.id)) {
                        providersMap.set(service.provider.id, service.provider);
                    }
                });
                setProviders(Array.from(providersMap.values()));
            } catch (err) {
                setError(err.message || "Failed to load preparation details");
            } finally {
                setLoading(false);
            }
        };

        if (preparationId) {
            fetchData();
        }
    }, [preparationId, currentPage, pageSize]);

    const handleServiceClick = (serviceId) => {
        navigate(`/services/${serviceId}`);
    };

    const handleProviderClick = (providerId) => {
        navigate(`/marketplace/providers/${providerId}`);
    };

    // if (loading) {
    //     return <LoadingScreen />;
    // }

    if (error || !preparation) {
        return (
            <div className="preparation-details-section">
                <section className="hero-section">
                    <div className="container">
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <div className="error-content">
                                    <i className="fas fa-exclamation-triangle" style={{ fontSize: "4rem", color: "#f14836", marginBottom: "20px" }}></i>
                                    <h2 className="section-title">Preparation Not Found</h2>
                                    <p className="section-description">
                                        {error || "The preparation you're looking for doesn't exist."}
                                    </p>
                                    <MainButton title="Go to Preparations" link="/preparations" classes="btn-main" />
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
            </div>
        );
    };

    return (
        <div className="preparation-details-section">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    {preparation.imageUrl ? (
                        <div
                            className="preparation-banner"
                            style={{
                                backgroundImage: `url(${preparation.imageUrl})`,
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
                            <div className="preparation-header" style={{ padding: "40px 0" }}>
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                                    {preparation.iconName && (
                                        <i className={preparation.iconName} style={{
                                            fontSize: "3rem",
                                            color: preparation.colorName || "var(--main)",
                                            marginRight: "20px",
                                        }}></i>
                                    )}
                                    <div>
                                        <h1 className="preparation-name" style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "12px", color: "white" }}>
                                            {preparation.nameEn || preparation.nameAr}
                                        </h1>
                                        {preparation.bioEn || preparation.bioAr ? (
                                            <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                                                {preparation.bioEn || preparation.bioAr}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Description Section */}
            {(preparation.descriptionEn || preparation.descriptionAr) && (
                <section className="description-section" style={{ padding: "60px 0", background: "white" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2">
                                <div className="description-content">
                                    <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px" }}>
                                        About This Preparation
                                    </h2>
                                    <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#666" }}>
                                        {preparation.descriptionEn || preparation.descriptionAr}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Providers Section */}
            {providers.length > 0 && (
                <section className="providers-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                    <div className="container">
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <h2 className="section-title">Available Providers</h2>
                                <p className="section-description">
                                    Browse providers offering services in this preparation category
                                </p>
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "40px" }}>
                            {providers.map((provider) => (
                                <div key={provider.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                                    <div
                                        className="provider-card"
                                        style={{
                                            background: "white",
                                            borderRadius: "12px",
                                            padding: "24px",
                                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
                                            textAlign: "center",
                                        }}
                                        onClick={() => handleProviderClick(provider.id)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-4px)";
                                            e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                        }}
                                    >
                                        <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "8px" }}>
                                            {provider.nameEn || provider.nameAr}
                                        </h4>
                                        {provider.shortAddress && (
                                            <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "12px" }}>
                                                <i className="fas fa-map-marker-alt me-1"></i>
                                                {provider.shortAddress}
                                            </p>
                                        )}
                                        {provider.rate && (
                                            <div style={{ marginBottom: "12px" }}>
                                                {renderStars(provider.rate)}
                                                <span style={{ marginLeft: "8px" }}>({provider.rate.toFixed(1)})</span>
                                            </div>
                                        )}
                                        {provider.isVerified && (
                                            <span style={{
                                                padding: "4px 12px",
                                                background: "#d4edda",
                                                color: "#155724",
                                                borderRadius: "20px",
                                                fontSize: "0.85rem",
                                                fontWeight: "600",
                                            }}>
                                                <i className="fas fa-check-circle me-1"></i>
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Services Section */}
            <section className="services-section" style={{ padding: "80px 0", background: "white" }}>
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8">
                            <h2 className="section-title">Available Services</h2>
                            <p className="section-description">
                                Browse all services in this preparation category
                            </p>
                        </div>
                    </div>

                    {services.length > 0 ? (
                        <>
                            <div className="row" style={{ marginTop: "40px" }}>
                                {services.map((service) => (
                                    <div key={service.id} className="col-lg-4 col-md-6 mb-4">
                                        <div
                                            className="service-card"
                                            style={{
                                                background: "white",
                                                borderRadius: "16px",
                                                overflow: "hidden",
                                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                height: "100%",
                                            }}
                                            onClick={() => handleServiceClick(service.id)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-4px)";
                                                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                            }}
                                        >
                                            {service.imageUrl && (
                                                <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
                                                    <img
                                                        src={service.imageUrl}
                                                        alt={service.nameEn || service.nameAr}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <div style={{ padding: "24px" }}>
                                                <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "12px" }}>
                                                    {service.nameEn || service.nameAr}
                                                </h4>
                                                {(service.descriptionEn || service.descriptionAr) && (
                                                    <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "16px", lineHeight: "1.5" }}>
                                                        {(service.descriptionEn || service.descriptionAr).substring(0, 100)}...
                                                    </p>
                                                )}
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                                    {service.buyPrice && (
                                                        <div>
                                                            <span style={{ fontSize: "0.85rem", color: "#999" }}>Buy: </span>
                                                            <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--main)" }}>
                                                                {service.buyPrice} EGP
                                                            </span>
                                                        </div>
                                                    )}
                                                    {service.rentPrice && (
                                                        <div>
                                                            <span style={{ fontSize: "0.85rem", color: "#999" }}>Rent: </span>
                                                            <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--main)" }}>
                                                                {service.rentPrice} EGP
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                {service.rate && (
                                                    <div style={{ marginBottom: "12px" }}>
                                                        {renderStars(service.rate)}
                                                        <span style={{ marginLeft: "8px" }}>({service.rate.toFixed(1)})</span>
                                                    </div>
                                                )}
                                                {service.provider && (
                                                    <div style={{ fontSize: "0.85rem", color: "#999", marginTop: "12px" }}>
                                                        <i className="fas fa-store me-1"></i>
                                                        {service.provider.nameEn || service.provider.nameAr}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="row justify-content-center text-center" style={{ marginTop: "40px" }}>
                            <div className="col-lg-8">
                                <i className="fas fa-inbox" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                                <h3>No Services Available</h3>
                                <p style={{ color: "#666" }}>
                                    No services available in this preparation category at the moment.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

