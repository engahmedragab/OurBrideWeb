import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import serviceService from "@/services/serviceService";
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import CTASection from '@/Components/Shared/CTASection';
import Pagination from '@/Components/Community/Shared/Pagination';
import SEOHead from '@/Components/SEO/SEOHead';

export default function Services() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Search filters
    const [searchParams, setSearchParams] = useState({
        query: "",
        serviceClass: "",
        serviceStatus: "",
        serviceType: "",
        isOurBrideService: false,
        hasInstallment: false,
        hasPackages: false,
        sortBy: "name",
        sortOrder: "asc",
    });

    useEffect(() => {
        fetchServices();
    }, [currentPage, searchParams]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            setError(null);

            // Map search params to API params
            const apiParams: any = {
                Page: currentPage,
                PageSize: pageSize,
            };

            if (searchParams.query) {
                apiParams.Search = searchParams.query;
            }
            if (searchParams.serviceClass) {
                apiParams.ServiceClass = parseInt(searchParams.serviceClass);
            }
            if (searchParams.serviceType) {
                apiParams.ServiceType = parseInt(searchParams.serviceType);
            }
            if (searchParams.isOurBrideService) {
                apiParams.IsOurBrideService = true;
            }
            if (searchParams.hasPackages) {
                apiParams.HasPackages = true;
            }
            if (searchParams.hasInstallment) {
                apiParams.HasInstallment = true;
            }

            const response = await serviceService.search(apiParams);

            // Handle different response structures
            if (Array.isArray(response)) {
                setServices(response);
                setTotalCount(response.length);
                setTotalPages(1);
            } else if (response?.services || response?.data) {
                const servicesData = response.services || response.data || [];
                setServices(Array.isArray(servicesData) ? servicesData : []);
                setTotalPages(response.totalPages || response.totalPages || 1);
                setTotalCount(response.totalCount || response.total || servicesData.length || 0);
            } else if (response?.items) {
                setServices(response.items);
                setTotalPages(response.totalPages || 1);
                setTotalCount(response.totalCount || response.total || 0);
            } else {
                setServices([]);
                setTotalPages(1);
                setTotalCount(0);
            }
        } catch (err: any) {
            console.error('Error fetching services:', err);
            setError(err.message || "Failed to load services");
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleServiceClick = (serviceId) => {
        navigate(`/services/${serviceId}`);
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

    if (loading && services.length === 0) {
        return <LoadingScreen />;
    }

    return (
        <div className="services-section">
            <SEOHead
                title="Wedding Services - OurBride Marketplace"
                description="Search and discover the perfect wedding services for your special day. From photography to catering, find everything you need."
                keywords="wedding services, event planning, vendors, marketplace, wedding vendors"
                image=""
                url={`${window.location.origin}/services`}
            />

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
                description="Search and discover the perfect wedding services for your special day. From photography to catering, find everything you need."
                stats={[
                    { number: totalCount > 0 ? `${totalCount}+` : "1000+", label: "Services" },
                    { number: totalPages > 1 ? `${totalPages}` : "1", label: "Pages" },
                    { number: "4.8★", label: "Average Rating" },
                ]}
            />

            {/* Search and Filters Section */}
            <section className="filters-section py-5" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)" }}>
                <div className="container">
                    {/* Search Bar */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="search-bar-wrapper position-relative">
                                <div className="input-group input-group-lg shadow-sm" style={{ borderRadius: "50px", overflow: "hidden" }}>
                                    <span className="input-group-text bg-white border-0" style={{ paddingLeft: "24px" }}>
                                        <i className="fas fa-search text-muted"></i>
                                    </span>
                                    <input
                                        type="text"
                                        name="query"
                                        className="form-control border-0"
                                        placeholder="Search for services, providers, or keywords..."
                                        value={searchParams.query}
                                        onChange={handleInputChange}
                                        style={{ fontSize: "1rem", padding: "16px 0" }}
                                    />
                                    {searchParams.query && (
                                        <button
                                            className="btn btn-link text-muted border-0"
                                            onClick={() => {
                                                setSearchParams({ ...searchParams, query: "" });
                                                setCurrentPage(1);
                                            }}
                                            style={{ paddingRight: "24px" }}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters Card */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card shadow-sm border-0" style={{ borderRadius: "20px", overflow: "hidden" }}>
                                <div className="card-body p-4">
                                    <div className="row align-items-center g-3">
                                        {/* Sort By */}
                                        <div className="col-lg-3 col-md-6">
                                            <label className="form-label fw-semibold mb-2" style={{ fontSize: "0.875rem", color: "#495057" }}>
                                                <i className="fas fa-sort me-2 text-main"></i>Sort By
                                            </label>
                                            <select
                                                name="sortBy"
                                                className="form-select"
                                                value={searchParams.sortBy}
                                                onChange={handleInputChange}
                                                style={{ borderRadius: "12px", border: "1px solid #e9ecef", padding: "10px 16px" }}
                                            >
                                                <option value="name">Name</option>
                                                <option value="rate">Rating</option>
                                                <option value="createdAt">Date</option>
                                                <option value="price">Price</option>
                                            </select>
                                        </div>

                                        {/* Sort Order */}
                                        <div className="col-lg-3 col-md-6">
                                            <label className="form-label fw-semibold mb-2" style={{ fontSize: "0.875rem", color: "#495057" }}>
                                                <i className="fas fa-arrow-up-down me-2 text-main"></i>Order
                                            </label>
                                            <select
                                                name="sortOrder"
                                                className="form-select"
                                                value={searchParams.sortOrder}
                                                onChange={handleInputChange}
                                                style={{ borderRadius: "12px", border: "1px solid #e9ecef", padding: "10px 16px" }}
                                            >
                                                <option value="asc">Ascending</option>
                                                <option value="desc">Descending</option>
                                            </select>
                                        </div>

                                        {/* Filter Chips */}
                                        <div className="col-lg-6 col-md-12">
                                            <label className="form-label fw-semibold mb-2 d-block" style={{ fontSize: "0.875rem", color: "#495057" }}>
                                                <i className="fas fa-filter me-2 text-main"></i>Quick Filters
                                            </label>
                                            <div className="d-flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    className={`btn ${searchParams.hasPackages ? 'btn-main' : 'btn-outline-secondary'} btn-sm`}
                                                    onClick={() => {
                                                        setSearchParams({ ...searchParams, hasPackages: !searchParams.hasPackages });
                                                        setCurrentPage(1);
                                                    }}
                                                    style={{ borderRadius: "20px", padding: "8px 16px" }}
                                                >
                                                    <i className="fas fa-box me-1"></i>
                                                    Has Packages
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`btn ${searchParams.hasInstallment ? 'btn-main' : 'btn-outline-secondary'} btn-sm`}
                                                    onClick={() => {
                                                        setSearchParams({ ...searchParams, hasInstallment: !searchParams.hasInstallment });
                                                        setCurrentPage(1);
                                                    }}
                                                    style={{ borderRadius: "20px", padding: "8px 16px" }}
                                                >
                                                    <i className="fas fa-credit-card me-1"></i>
                                                    Installment
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`btn ${searchParams.isOurBrideService ? 'btn-main' : 'btn-outline-secondary'} btn-sm`}
                                                    onClick={() => {
                                                        setSearchParams({ ...searchParams, isOurBrideService: !searchParams.isOurBrideService });
                                                        setCurrentPage(1);
                                                    }}
                                                    style={{ borderRadius: "20px", padding: "8px 16px" }}
                                                >
                                                    <i className="fas fa-star me-1"></i>
                                                    OurBride Service
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active Filters & Reset */}
                                    {(searchParams.query || searchParams.hasPackages || searchParams.hasInstallment || searchParams.isOurBrideService) && (
                                        <div className="row mt-3 pt-3 border-top">
                                            <div className="col-12">
                                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                                    <div className="d-flex flex-wrap gap-2 align-items-center">
                                                        <span className="text-muted small fw-semibold">
                                                            <i className="fas fa-tags me-1"></i>Active Filters:
                                                        </span>
                                                        {searchParams.query && (
                                                            <span className="badge bg-main text-white" style={{ padding: "6px 12px", borderRadius: "12px", fontSize: "0.75rem" }}>
                                                                Search: {searchParams.query}
                                                                <button
                                                                    className="btn-close btn-close-white ms-2"
                                                                    style={{ fontSize: "0.6rem" }}
                                                                    onClick={() => {
                                                                        setSearchParams({ ...searchParams, query: "" });
                                                                        setCurrentPage(1);
                                                                    }}
                                                                ></button>
                                                            </span>
                                                        )}
                                                        {searchParams.hasPackages && (
                                                            <span className="badge bg-main text-white" style={{ padding: "6px 12px", borderRadius: "12px", fontSize: "0.75rem" }}>
                                                                Packages
                                                                <button
                                                                    className="btn-close btn-close-white ms-2"
                                                                    style={{ fontSize: "0.6rem" }}
                                                                    onClick={() => {
                                                                        setSearchParams({ ...searchParams, hasPackages: false });
                                                                        setCurrentPage(1);
                                                                    }}
                                                                ></button>
                                                            </span>
                                                        )}
                                                        {searchParams.hasInstallment && (
                                                            <span className="badge bg-main text-white" style={{ padding: "6px 12px", borderRadius: "12px", fontSize: "0.75rem" }}>
                                                                Installment
                                                                <button
                                                                    className="btn-close btn-close-white ms-2"
                                                                    style={{ fontSize: "0.6rem" }}
                                                                    onClick={() => {
                                                                        setSearchParams({ ...searchParams, hasInstallment: false });
                                                                        setCurrentPage(1);
                                                                    }}
                                                                ></button>
                                                            </span>
                                                        )}
                                                        {searchParams.isOurBrideService && (
                                                            <span className="badge bg-main text-white" style={{ padding: "6px 12px", borderRadius: "12px", fontSize: "0.75rem" }}>
                                                                OurBride Service
                                                                <button
                                                                    className="btn-close btn-close-white ms-2"
                                                                    style={{ fontSize: "0.6rem" }}
                                                                    onClick={() => {
                                                                        setSearchParams({ ...searchParams, isOurBrideService: false });
                                                                        setCurrentPage(1);
                                                                    }}
                                                                ></button>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => {
                                                            setSearchParams({
                                                                query: "",
                                                                serviceClass: "",
                                                                serviceStatus: "",
                                                                serviceType: "",
                                                                isOurBrideService: false,
                                                                hasInstallment: false,
                                                                hasPackages: false,
                                                                sortBy: "name",
                                                                sortOrder: "asc",
                                                            });
                                                            setCurrentPage(1);
                                                        }}
                                                        style={{ borderRadius: "12px", padding: "6px 16px" }}
                                                    >
                                                        <i className="fas fa-redo me-1"></i>
                                                        Reset All
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="services-grid-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                <div className="container">
                    {totalCount > 0 && (
                        <div className="row justify-content-center text-center mb-5">
                            <div className="col-lg-8">
                                <SectionHeader
                                    title="Available Services"
                                    description={`Found ${totalCount} service${totalCount !== 1 ? 's' : ''} matching your criteria`}
                                />
                            </div>
                        </div>
                    )}

                    {error ? (
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <div className="error-content">
                                    <i className="fas fa-exclamation-triangle" style={{ fontSize: "4rem", color: "#f14836", marginBottom: "20px" }}></i>
                                    <h3>Error Loading Services</h3>
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    ) : services.length > 0 ? (
                        <>
                            <div className="row">
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="row justify-content-center" style={{ marginTop: "40px" }}>
                                    <div className="col-lg-12">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            hasNextPage={currentPage < totalPages}
                                            hasPreviousPage={currentPage > 1}
                                            onPageChange={(page) => {
                                                setCurrentPage(page);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            loading={loading}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : !loading ? (
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <div className="empty-state" style={{ padding: "60px 20px" }}>
                                    <i className="fas fa-inbox" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                                    <h3>No Services Found</h3>
                                    <p style={{ color: "#666", marginBottom: "24px" }}>
                                        Try adjusting your search filters to find more services.
                                    </p>
                                    <button
                                        className="btn btn-outline-main"
                                        onClick={() => {
                                            setSearchParams({
                                                query: "",
                                                serviceClass: "",
                                                serviceStatus: "",
                                                serviceType: "",
                                                isOurBrideService: false,
                                                hasInstallment: false,
                                                hasPackages: false,
                                                sortBy: "name",
                                                sortOrder: "asc",
                                            });
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <i className="fas fa-redo me-2"></i>
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>

            {/* CTA Section */}
            {services.length > 0 && (
                <CTASection
                    title="Need Help Finding the Right Service?"
                    description="Our team is here to help you find the perfect wedding services for your special day."
                    buttons={[
                        {
                            label: "Browse Providers",
                            icon: "fas fa-users",
                            to: "/providers",
                            variant: "primary"
                        },
                        {
                            label: "Contact Support",
                            icon: "fas fa-headset",
                            to: "/contact",
                            variant: "outline"
                        }
                    ]}
                />
            )}
        </div>
    );
}

