import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import preparationService from "@/services/preparationService";
import MainButton from '@/SimpleComponent/MainButton/MainButton';
import LoadingScreen from "@/Components/LoadingScreen/LoadingScreen";

export default function Preparations() {
    const navigate = useNavigate();
    const [preparations, setPreparations] = useState([]);
    const [featuredPreparations, setFeaturedPreparations] = useState([]);
    const [lastServices, setLastServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFeatured, setShowFeatured] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [allData, featuredData, lastServicesData] = await Promise.all([
                    preparationService.getAll(),
                    preparationService.getFeatured(),
                    preparationService.getLastServices(),
                ]);

                setPreparations(allData.data || allData || []);
                setFeaturedPreparations(featuredData.data || featuredData || []);
                setLastServices(lastServicesData.data || lastServicesData || []);
            } catch (err) {
                setError(err.message || "Failed to load preparations");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePreparationClick = (preparationId) => {
        navigate(`/preparations/${preparationId}`);
    };

    const handleServiceClick = (serviceId) => {
        navigate(`/services/${serviceId}`);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <div className="preparations-section">
                <section className="hero-section">
                    <div className="container">
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <div className="error-content">
                                    <i className="fas fa-exclamation-triangle" style={{ fontSize: "4rem", color: "#f14836", marginBottom: "20px" }}></i>
                                    <h2 className="section-title">Error Loading Preparations</h2>
                                    <p className="section-description">{error}</p>
                                    <MainButton title="Go to Home" link="/" classes="btn-main" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    const displayPreparations = showFeatured ? featuredPreparations : preparations;

    return (
        <div className="preparations-section">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-gradient"></div>
                </div>
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8">
                            <div className="hero-content">
                                <h1 className="hero-title">
                                    Wedding <span className="text-gradient">Preparations</span>
                                </h1>
                                <p className="hero-description">
                                    Explore our comprehensive wedding preparation services and find the perfect providers for your special day.
                                </p>
                                <div className="hero-actions" style={{ marginTop: "32px" }}>
                                    <button
                                        onClick={() => setShowFeatured(!showFeatured)}
                                        className={`btn ${showFeatured ? 'btn-main' : 'btn-outline-main'}`}
                                    >
                                        {showFeatured ? "Show All" : "Show Featured"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Services Section */}
            {lastServices.length > 0 && (
                <section className="last-services-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                    <div className="container">
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <h2 className="section-title">Latest Services</h2>
                                <p className="section-description">Recently added services</p>
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "40px" }}>
                            {lastServices.map((service) => (
                                <div key={service.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                                    <div
                                        className="service-card"
                                        style={{
                                            background: "white",
                                            borderRadius: "12px",
                                            overflow: "hidden",
                                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
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
                                                    alt={service.name || service.nameEn || service.nameAr}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div style={{ padding: "20px" }}>
                                            <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px" }}>
                                                {service.name || service.nameEn || service.nameAr}
                                            </h4>
                                            {service.description && (
                                                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "12px", lineHeight: "1.5" }}>
                                                    {service.description.substring(0, 100)}...
                                                </p>
                                            )}
                                            {service.price && (
                                                <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--main)" }}>
                                                    {service.price} EGP
                                                </div>
                                            )}
                                            {service.rating && (
                                                <div style={{ marginTop: "8px" }}>
                                                    <i className="fas fa-star text-warning"></i>
                                                    <span style={{ marginLeft: "4px" }}>{service.rating.toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Preparations Grid */}
            <section className="preparations-grid-section" style={{ padding: "80px 0" }}>
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8">
                            <h2 className="section-title">
                                {showFeatured ? "Featured Preparations" : "All Preparations"}
                            </h2>
                            <p className="section-description">
                                {showFeatured
                                    ? "Handpicked premium wedding preparation services"
                                    : "Browse all available wedding preparation categories"}
                            </p>
                        </div>
                    </div>

                    {displayPreparations.length > 0 ? (
                        <div className="row" style={{ marginTop: "40px" }}>
                            {displayPreparations
                                .filter(prep => prep.isActive && !prep.isDeleted)
                                .map((preparation) => (
                                    <div key={preparation.id} className="col-lg-4 col-md-6 mb-4">
                                        <div
                                            className="preparation-card"
                                            style={{
                                                background: "white",
                                                borderRadius: "16px",
                                                overflow: "hidden",
                                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                height: "100%",
                                            }}
                                            onClick={() => handlePreparationClick(preparation.id)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-4px)";
                                                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                            }}
                                        >
                                            {preparation.imageUrl && (
                                                <div style={{ width: "100%", height: "250px", overflow: "hidden", position: "relative" }}>
                                                    <img
                                                        src={preparation.imageUrl}
                                                        alt={preparation.nameEn || preparation.nameAr}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                    {preparation.isFeatured && (
                                                        <div style={{
                                                            position: "absolute",
                                                            top: "12px",
                                                            right: "12px",
                                                            background: "var(--main)",
                                                            color: "white",
                                                            padding: "6px 12px",
                                                            borderRadius: "20px",
                                                            fontSize: "0.85rem",
                                                            fontWeight: "600",
                                                        }}>
                                                            Featured
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div style={{ padding: "24px" }}>
                                                <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                                                    {preparation.iconName && (
                                                        <i className={preparation.iconName} style={{
                                                            fontSize: "2rem",
                                                            color: preparation.colorName || "var(--main)",
                                                            marginRight: "12px",
                                                        }}></i>
                                                    )}
                                                    <h3 style={{ fontSize: "1.3rem", fontWeight: "700", margin: 0 }}>
                                                        {preparation.nameEn || preparation.nameAr}
                                                    </h3>
                                                </div>
                                                {preparation.bioEn || preparation.bioAr ? (
                                                    <p style={{ fontSize: "0.95rem", color: "#666", marginBottom: "16px", lineHeight: "1.6" }}>
                                                        {preparation.bioEn || preparation.bioAr}
                                                    </p>
                                                ) : null}
                                                {preparation.descriptionEn || preparation.descriptionAr ? (
                                                    <p style={{ fontSize: "0.9rem", color: "#999", marginBottom: "16px", lineHeight: "1.5" }}>
                                                        {(preparation.descriptionEn || preparation.descriptionAr).substring(0, 120)}...
                                                    </p>
                                                ) : null}
                                                {preparation.services && preparation.services.length > 0 && (
                                                    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #eee" }}>
                                                        <span style={{ fontSize: "0.85rem", color: "#666" }}>
                                                            <i className="fas fa-concierge-bell me-1"></i>
                                                            {preparation.services.length} Services Available
                                                        </span>
                                                    </div>
                                                )}
                                                <button
                                                    className="btn btn-main"
                                                    style={{ width: "100%", marginTop: "16px" }}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="row justify-content-center text-center" style={{ marginTop: "40px" }}>
                            <div className="col-lg-8">
                                <i className="fas fa-inbox" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                                <h3>No Preparations Available</h3>
                                <p style={{ color: "#666" }}>
                                    {showFeatured
                                        ? "No featured preparations at the moment."
                                        : "No preparations available at the moment."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

