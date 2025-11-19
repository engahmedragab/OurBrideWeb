import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { homeService } from "@/services/homeService";
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import MainButton from '@/SimpleComponent/MainButton/MainButton';
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import CTASection from '@/Components/Shared/CTASection';

interface FeaturedPreparation {
    id: number;
    nameAr: string;
    nameEn: string;
    bioAr: string;
    bioEn: string;
    isActive: boolean;
    type: string;
    class: string;
    iconName: string;
    colorName: string;
    services: any[];
}

interface FeatureService {
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    title: string;
    subTitle: string;
    icon: string;
    color: string;
    image: string;
    link: string;
    rate: number;
    isFeatured: boolean;
    type: string;
    class: string;
    preparationId: number;
    preparation: any;
}

interface FeatureProvider {
    id: number;
    nameAr: string;
    nameEn: string;
    phoneNumber: string;
    profileURL: string;
    rate: number;
    likes: number;
    shortAddress: string;
    providerStatus: string;
    providerRate: string;
    servicesCount: number;
    productsCount: number;
    isVerified: boolean;
    isProfileComplete: boolean;
    profileCompletionPercentage: number;
}

interface Banner {
    id: number;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    imageUrl: string;
    linkUrl: string;
    bannerType: string;
    isActive: boolean;
    order: number;
    startDate: string;
    endDate: string;
}

interface ServiceHomeData {
    featuredPreparations: FeaturedPreparation[];
    allFeatureServices: FeatureService[];
    featureProviders: FeatureProvider[];
    banners: Banner[];
}

export default function ServicesHome() {
    const [data, setData] = useState<ServiceHomeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await homeService.getServiceHome();
                setData(response);
            } catch (err: any) {
                setError(err.message || "Failed to load service home data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error</h4>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className="services-home-page">
            {/* Hero Section */}
            <HeroSection
                badge={{
                    icon: "fas fa-concierge-bell",
                    text: "Wedding Services"
                }}
                title={
                    <>
                        Wedding <span className="text-gradient">Services</span>
                    </>
                }
                description="Discover professional wedding services from verified providers. From photography to catering, find everything you need for your special day."
                stats={[
                    { number: data.allFeatureServices?.length || "500+", label: "Services" },
                    { number: data.featureProviders?.length || "100+", label: "Providers" },
                    { number: "4.8★", label: "Average Rating" },
                ]}
            />

            {/* Banners Section */}
            {data.banners && data.banners.length > 0 && (
                <section className="banners-section" style={{ padding: "40px 0", background: "white" }}>
                    <div className="container">
                        <div className="row justify-content-center text-center mb-4">
                            <div className="col-lg-8">
                                <SectionHeader
                                    badge={{ icon: "fas fa-images", text: "Featured" }}
                                    title="Special Offers"
                                    description="Check out our latest promotions and featured services"
                                />
                            </div>
                        </div>
                        <div className="row">
                            {data.banners.map((banner) => (
                                <div key={banner.id} className="col-12 mb-4">
                                    <Link to={banner.linkUrl || "#"} className="banner-link text-decoration-none">
                                        <div className="banner-card position-relative overflow-hidden rounded shadow-sm" style={{ borderRadius: "16px", transition: "all 0.3s ease" }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-4px)";
                                                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                            }}>
                                            <img
                                                src={banner.imageUrl}
                                                alt={banner.titleEn || banner.titleAr}
                                                className="w-100"
                                                style={{ maxHeight: "300px", objectFit: "cover" }}
                                            />
                                            <div className="banner-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)" }}>
                                                <div className="container">
                                                    <h2 className="text-white mb-3" style={{ fontWeight: "600" }}>
                                                        {banner.titleEn || banner.titleAr}
                                                    </h2>
                                                    {banner.descriptionEn || banner.descriptionAr ? (
                                                        <p className="text-white">
                                                            {banner.descriptionEn || banner.descriptionAr}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Preparations Section */}
            {data.featuredPreparations && data.featuredPreparations.length > 0 && (
                <section className="featured-preparations-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                    <div className="container">
                        <div className="row justify-content-center text-center mb-5">
                            <div className="col-lg-8">
                                <SectionHeader
                                    badge={{ icon: "fas fa-th-large", text: "Categories" }}
                                    title="Featured Preparations"
                                    description="Browse services by wedding preparation categories"
                                />
                            </div>
                        </div>
                        <div className="row">
                            {data.featuredPreparations.map((prep) => (
                                <div key={prep.id} className="col-md-4 col-lg-3 mb-4">
                                    <Link
                                        to={`/preparations/${prep.id}`}
                                        className="card h-100 text-decoration-none shadow-sm"
                                        style={{ borderRadius: "16px", overflow: "hidden", transition: "all 0.3s ease" }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-4px)";
                                            e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                        }}>
                                        <div className="card-body text-center" style={{ padding: "32px" }}>
                                            {prep.iconName && (
                                                <div
                                                    className="prep-icon mb-3"
                                                    style={{ color: prep.colorName || "var(--main)", fontSize: "3rem" }}
                                                >
                                                    <i className={`fas fa-${prep.iconName}`}></i>
                                                </div>
                                            )}
                                            <h5 className="card-title mb-3" style={{ fontWeight: "600" }}>
                                                {prep.nameEn || prep.nameAr}
                                            </h5>
                                            <p className="card-text text-muted small">
                                                {prep.bioEn || prep.bioAr}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Services Section */}
            {data.allFeatureServices && data.allFeatureServices.length > 0 && (
                <section className="featured-services-section" style={{ padding: "60px 0", background: "white" }}>
                    <div className="container">
                        <div className="row justify-content-center text-center mb-5">
                            <div className="col-lg-8">
                                <SectionHeader
                                    badge={{ icon: "fas fa-star", text: "Featured" }}
                                    title="Featured Services"
                                    description="Handpicked services from our top-rated providers"
                                />
                            </div>
                        </div>
                        <div className="row">
                            {data.allFeatureServices.map((service, index) => (
                                <div key={index} className="col-md-6 col-lg-4 mb-4">
                                    <div className="card h-100 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden", transition: "all 0.3s ease" }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-4px)";
                                            e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                        }}>
                                        {service.image && (
                                            <img
                                                src={service.image}
                                                className="card-img-top"
                                                alt={service.nameEn || service.nameAr}
                                                style={{ height: "200px", objectFit: "cover" }}
                                            />
                                        )}
                                        <div className="card-body" style={{ padding: "24px" }}>
                                            <h5 className="card-title mb-2" style={{ fontWeight: "600" }}>
                                                {service.nameEn || service.nameAr}
                                            </h5>
                                            {service.title && (
                                                <h6 className="card-subtitle mb-3 text-muted">
                                                    {service.title}
                                                </h6>
                                            )}
                                            <p className="card-text" style={{ color: "#666", marginBottom: "16px" }}>
                                                {service.descriptionEn || service.descriptionAr}
                                            </p>
                                            {service.rate && (
                                                <div className="mb-3">
                                                    <span className="badge bg-warning text-dark">
                                                        ⭐ {service.rate.toFixed(1)}
                                                    </span>
                                                </div>
                                            )}
                                            {service.link && (
                                                <Link
                                                    to={service.link}
                                                    className="btn btn-outline-main btn-sm"
                                                >
                                                    View Details <i className="fas fa-arrow-right ms-2"></i>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Providers Section */}
            {data.featureProviders && data.featureProviders.length > 0 && (
                <section className="featured-providers-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                    <div className="container">
                        <div className="row justify-content-center text-center mb-5">
                            <div className="col-lg-8">
                                <SectionHeader
                                    badge={{ icon: "fas fa-users", text: "Providers" }}
                                    title="Featured Providers"
                                    description="Trusted and verified wedding service providers"
                                />
                            </div>
                        </div>
                        <div className="row">
                            {data.featureProviders.map((provider) => (
                                <div key={provider.id} className="col-md-6 col-lg-4 mb-4">
                                    <Link
                                        to={`/providers/${provider.id}`}
                                        className="card h-100 text-decoration-none shadow-sm"
                                        style={{ borderRadius: "16px", overflow: "hidden", transition: "all 0.3s ease" }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-4px)";
                                            e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                        }}>
                                        {provider.profileURL && (
                                            <img
                                                src={provider.profileURL}
                                                className="card-img-top"
                                                alt={provider.nameEn || provider.nameAr}
                                                style={{ height: "200px", objectFit: "cover" }}
                                            />
                                        )}
                                        <div className="card-body" style={{ padding: "24px" }}>
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="card-title mb-0" style={{ fontWeight: "600" }}>
                                                    {provider.nameEn || provider.nameAr}
                                                </h5>
                                                {provider.isVerified && (
                                                    <span className="badge bg-success">
                                                        <i className="fas fa-check-circle"></i> Verified
                                                    </span>
                                                )}
                                            </div>
                                            {provider.rate && (
                                                <div className="mb-3">
                                                    <span className="badge bg-warning text-dark">
                                                        ⭐ {provider.rate.toFixed(1)}
                                                    </span>
                                                    {provider.likes > 0 && (
                                                        <span className="ms-2 text-muted">
                                                            <i className="fas fa-heart text-danger"></i> {provider.likes}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {provider.shortAddress && (
                                                <p className="card-text text-muted small mb-3">
                                                    <i className="fas fa-map-marker-alt me-1"></i> {provider.shortAddress}
                                                </p>
                                            )}
                                            <div className="d-flex gap-2">
                                                {provider.servicesCount > 0 && (
                                                    <span className="badge bg-info">
                                                        {provider.servicesCount} Services
                                                    </span>
                                                )}
                                                {provider.productsCount > 0 && (
                                                    <span className="badge bg-secondary">
                                                        {provider.productsCount} Products
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-5">
                            <Link to="/providers" className="btn btn-main btn-lg">
                                <i className="fas fa-users me-2"></i>
                                View All Providers
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <CTASection
                title="Ready to Find Your Perfect Wedding Services?"
                description="Browse our amazing collection of wedding services and connect with verified providers."
                buttons={[
                    {
                        label: "Browse All Services",
                        icon: "fas fa-concierge-bell",
                        to: "/services",
                        variant: "primary"
                    },
                    {
                        label: "View Providers",
                        icon: "fas fa-users",
                        to: "/providers",
                        variant: "outline"
                    }
                ]}
            />
        </div>
    );
}
